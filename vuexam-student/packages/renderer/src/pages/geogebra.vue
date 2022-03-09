 <template> 
  <div id="apphead" class="w-100 p-3 text-white bg-dark shadow text-right">
         <router-link :to="(clientname == 'DemoUser')?'/':''" class="text-white m-1">
            <img src="/src/assets/img/svg/speedometer.svg" class="white me-2  " width="32" height="32" >
            <span class="fs-4 align-middle me-4 ">{{clientname}}</span>
        </router-link>

        <span class="fs-4 align-middle" style="float: right">GeoGebra</span>
  </div>
  <div id=content>
    <iframe id="geogebraframe" :src="geogebrasource"></iframe>
 </div>
</template>

<script>
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

import $ from 'jquery'

export default {
    data() {
        return {
            currentFile:null,
            fetchinterval: null,
            servername: this.$route.params.servername,
            servertoken: this.$route.params.servertoken,
            serverip: this.$route.params.serverip,
            token: this.$route.params.token,
            clientname: this.$route.params.clientname,
            serverApiPort: this.$route.params.serverApiPort,
            clientApiPort: this.$route.params.clientApiPort,
            geogebrasource: "",
            electron: this.$route.params.electron,
            blurEvent : null,
            endExamEvent: null,
        }
    }, 
    components: {  },  
    mounted() {
        this.geogebrasource = `./geogebra/geometry.html`
        this.currentFile = this.clientname

        if (this.electron){
            this.blurEvent = ipcRenderer.on('blurevent', this.focuslost, false);  //ipcRenderer seems to be of type nodeEventTarget (on/addlistener returns a reference to the eventTarget)
            this.endExamEvent = ipcRenderer.on('endexam', () => { this.$router.push({ name: 'student'}); }); //redirect to home view // right before we leave vue.js will run beforeUnmount() which removes all listeners this view attached to the window and the ipcrenderer
        }
    
        this.$nextTick(function () { // Code that will run only after the entire view has been rendered
           this.fetchinterval = setInterval(() => { this.fetchContent() }, 6000)   //1*pro minute
           if (this.token) { this.focuscheck() } 
        })
    },
    methods: {
        focuscheck() {
            window.addEventListener('beforeunload',         this.focuslost);  // keeps the window open (displays "are you sure in browser")
            window.addEventListener('blur',                 this.focuslost);  // fires only from vue componend not iframe.. check if focus is now on geogebraframe if so > do not inform teacher 
            document.addEventListener("visibilityChange",   this.focuslost);  
        },
        focuslost(e){   /** inform the teacher immediately */
            console.log(e)
            if (e && e.type === "blur") {  
                let elementInFocus = document.activeElement.id
                console.log(elementInFocus);
                if (elementInFocus !== "geogebraframe" && elementInFocus !== "vuexambody" ){
                   this.informTeacher()
                }
            }
            else if (e && e.type === "beforeunload") {
                e.preventDefault(); 
                e.returnValue = ''; 
                this.informTeacher()
            }
            else {
                this.informTeacher()
            }
        },
        informTeacher(){
            console.log("HOUSTON WE HAVE A CHEATER!")
            fetch(`http://${this.serverip}:${this.serverApiPort}/server/control/studentlist/statechange/${this.servername}/${this.token}/false`)
            .then( response => response.json() )
            .then( (data) => { console.log(data); });  
        },
  


        /** Converts the Editor View into a multipage PDF */
        async fetchContent() {  
            let body = $("#geogebraframe").contents().find('body')[0];
            let html = document.documentElement;
            let doc = new jsPDF('p', 'px','a4', true, true);   //orientation, unit for coordinates, format, onlyUsedFonts, compress
            let pagenumber = 0;   // how many pdf pages can we get out of the total page height?
            let windowHeight = 0;  // the dryrun will set the windowheight of the editor at a given width of 794px (final pdf x resolution)

            html2canvas(body, { scale: 1, x:0, y: 0,  scrollX: 0,  scrollY: 0,  windowWidth: 794,    //DRYRUN - this sets the html body width for this canvas render testrun >> ATTENTION: windowHeight will change accordingly !!!
                onclone: (document) => {
                    windowHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );  // calculate NEW Height for rendering and set global variable
                    pagenumber = Math.ceil(windowHeight / 1123);   // how many pdf pages can we get out of the total page height?
                }
            }).then( async () => {
                for (let i = 0; i < pagenumber; i++) {
                    await new Promise( resolve => {
                        html2canvas(body, {
                            scale: 1,
                            x:0,
                            y: i * 1123,  // on every loop advance y-position by 1123 - why this number ? because gimp says the final pdf page in 96dpi has this height.. wtf ? jsPDF sucks hard!
                            scrollX: 0,
                            scrollY: 0,
                            windowWidth: 794,    //this sets the html body width somehow
                            windowHeight: windowHeight,  // we set the height for this rendering to the previously determined height
                            onclone: (document) => {
                                //document.getElementById('editortoolbar').style.display = 'none'
                                //document.getElementById('localfiles').style.display = 'none';   //hide filespicker
                            }
                        }).then( canvas => {  // now we have a canvas that contains the whole website :-) !!
                            let img = canvas.toDataURL('image/jpeg', 1);  // type, quality
                            doc.addImage(img, 'JPG', 0, 0, 0, 0, i, 'FAST');    // imagedata, format if recognition fails, x, y ,w ,h, alias, compression, rotation
                            if ( ( i + 1 ) == pagenumber) {  // FINISHED
                                const pdfBlob = new Blob([ doc.output('blob') ], { type : 'application/pdf'});
                                const form = new FormData()
                                form.append("file", pdfBlob,  `${this.currentFile}.pdf` );
                                form.append("currentfilename", this.currentFile)

                                //post to client (store pdf, store json, send to teacher)
                                fetch(`http://localhost:${this.clientApiPort}/client/data/store`, { method: 'POST', body: form })
                                .then( response => response.json() )
                                .then( async (data) => {
                                    console.log(data)
                                }).catch(err => { console.warn(err)}); 
                            } 
                            else { doc.addPage(); }
                            resolve();
                        });
                    });
                }
            });
        },
    },
    beforeUnmount() {
        clearInterval( this.fetchinterval )
        clearInterval( this.loadfilelistinterval )
        //remove electron ipcRender events
        this.endExamEvent.removeAllListeners('endexam')   //remove endExam listener from window
        this.blurEvent.removeAllListeners('blurevent')  //Node.js-specific extension to the EventTarget class. If type is specified, removes all registered listeners for type, otherwise removes all registered listeners.
        //remove window/document events
        window.removeEventListener("beforeunload",  this.focuslost);
        window.removeEventListener('blur',          this.focuslost);
        document.removeEventListener("visibilityChange", this.focuslost); 
    },
}
</script>

<style>

</style>
