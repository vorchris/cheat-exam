 <template> 
  <div id="apphead" class="w-100 p-3 text-white bg-dark shadow text-right">
        <img src="/src/assets/img/svg/speedometer.svg" class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-4 ">{{clientname}}</span>
        
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
            focusevent: new Event('focuslost'),
            electron: this.$route.params.electron,
          
        }
    }, 
    components: {  },  
    mounted() {
        this.geogebrasource = `./geogebra/geometry.html`
        this.currentFile = this.clientname

        if (this.electron){
            ipcRenderer.on('endexam', (event, token, examtype) => {
                    window.removeEventListener("beforeunload", this.beforeunload,false);
                    window.removeEventListener("focuslost",this.focuslost,false);
                    window.removeEventListener('blur', this.onblur,false);
                    $('iframe').each(function() { $(this.contentWindow).unbind(); });
                    this.$router.push({ name: 'student'});
            });
        }
    
        this.$nextTick(function () { // Code that will run only after the entire view has been rendered
            this.fetchinterval = setInterval(() => { this.fetchContent() }, 6000)   //1*pro minute
            if(this.token) { this.focuscheck() } 
        })
    },
    methods: {
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
        focuscheck() {
            let hidden, visibilityChange;
            window.addEventListener('focuslost', this.focuslost, false);
            window.addEventListener('beforeunload', this.beforeunload, false);
            window.addEventListener('blur', this.onblur, false);
            
            //FIXME Doesnt work on iframe in Electron KIOSK MODE
            $('iframe').each(function() {
                console.log( $(this.contentWindow))
                $(this.contentWindow).bind({
                    blur  : function() { 
                        var focused =document.activeElement.id
                         console.log(focused);
                        if (focused !== "vuexam"){  window.dispatchEvent(new Event('focuslost')); }
                    }
                }); 
                 $(this.contentWindow).on("blur", function() { 
                        var focused =document.activeElement.id
                         console.log(focused);
                        if (focused !== "vuexam"){  window.dispatchEvent(new Event('focuslost')); }
                    }
                ); 
            });

            if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
                hidden = "hidden";
                visibilityChange = "visibilitychange";
            } 
            else if (typeof document.msHidden !== "undefined") {
                hidden = "msHidden";
                visibilityChange = "msvisibilitychange";
            } 
            else if (typeof document.webkitHidden !== "undefined") {
                hidden = "webkitHidden";
                visibilityChange = "webkitvisibilitychange";
            }
            
            // Warn if the browser doesn't support addEventListener or the Page Visibility API
            if (typeof document.addEventListener === "undefined" || hidden === undefined) {
                console.log("This app requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
            } 
            else {
                document.addEventListener(visibilityChange, (e) => { if (document[hidden]) { 
                     
                       var focused =document.activeElement.id
                         console.log(focused);
                        if (focused !== "geogebraframe"){
                            window.dispatchEvent(this.focusevent);
                        }
                                
                      } }, false);
            }
        },
        focuslost(e){   /** inform the teacher immediately */
            let vue = this
            console.log("houston we have a problem")
            fetch(`http://${vue.serverip}:${vue.serverApiPort}/server/control/studentlist/statechange/${vue.servername}/${vue.token}/false`)
                .then( response => response.json() )
                .then( async (data) => {
                    console.log(data);
                });
        },
        beforeunload(e){
            e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
            e.returnValue = '';  // Chrome requires returnValue to be set
            window.dispatchEvent(this.focusevent);
        },
        onblur(e){
            var focused =document.activeElement.id
            console.log(focused);
            if (focused !== "geogebraframe"){
                 window.dispatchEvent(this.focusevent);
            }
        }

    },

    beforeUnmount() {
        clearInterval( this.fetchinterval )
        clearInterval( this.loadfilelistinterval )
        window.removeEventListener("beforeunload", this.beforeunload,false);
        window.removeEventListener("focuslost",this.focuslost,false);
        window.removeEventListener('blur', this.onblur,false);
        $('iframe').each(function() { $(this.contentWindow).unbind(); });

    },
}
</script>

<style>

</style>
