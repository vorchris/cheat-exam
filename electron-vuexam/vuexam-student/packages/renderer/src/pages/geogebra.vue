 <template> 
  <div id="apphead" class="w-100 p-3 text-white bg-dark shadow text-right">
        <img src="/src/assets/img/svg/speedometer.svg" class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-4 ">{{clientname}}</span>
        <span class="fs-4 align-middle" style="float: right">GeoGebra</span>
  </div>
  <div id=content>
    <iframe id="geogebraframe" src="http://localhost:3000/geogebra/geometry.html"></iframe>
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
        }
    },    
    mounted() {
        this.currentFile = this.clientname
        // run focuscheck function (give it 'this' in order to know about reactive vars from this view )
        if(this.token) { activatefocuscheck.call('', this) }  // aus einem mir momentan nicht zugänglichen grund wird der erste parameter hier nicht wie erwartet als "this" an die funktion übergeben
        //this.fetchinterval = setInterval(() => { this.fetchContent() }, 6000)   //1*pro minute
    },
    methods: {

        /** Converts the Editor View into a multipage PDF */
        async fetchContent() {              
            let body = document.body;
            let doc = new jsPDF('p', 'px','a4', true, true);   //orientation, unit for coordinates, format, onlyUsedFonts, compress
            let pagenumber = 0;   // how many pdf pages can we get out of the total page height?
            let windowHeight = 0;  // the dryrun will set the windowheight of the editor at a given width of 794px (final pdf x resolution)

            html2canvas(body, { scale: 1, x:0, y: 0,  scrollX: 0,  scrollY: 0,  windowWidth: 794,    //DRYRUN - this sets the html body width for this canvas render testrun >> ATTENTION: windowHeight will change accordingly !!!
                onclone: (document) => {
                    //document.getElementById('editortoolbar').style.display = 'none';   //hide toolbar
                    //document.getElementById('localfiles').style.display = 'none';   //hide filespicker
                    let body = document.body;           
                    let html = document.documentElement;
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
                                form.append("editorcontent", false)
                                form.append("currentfilename", this.currentFile)

                                //post to client (store pdf, store json, send to teacher)
                                fetch(`http://localhost:3000/client/data/store`, { method: 'POST', body: form })
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
        this.editor.destroy()
        clearInterval( this.fetchinterval )
        clearInterval( this.loadfilelistinterval )
    },
}
</script>

<style>

</style>
