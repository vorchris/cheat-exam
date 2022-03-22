 <template>
    <!-- HEADER START -->
    <div class="w-100 p-3 text-white bg-dark  text-center" style=" z-index: 10000 !important">
        <div v-if="online" class="text-white m-1">
            <img src="/src/assets/img/svg/speedometer.svg" class="white me-2" width="32" height="32" style="float: left;" />
            <span class="fs-4 align-middle me-1" style="float: left;">{{clientname}}</span>
            <span class="fs-4 align-middle me-4 green" style="float: left;" >| online</span> 
        </div>

        <div v-if="!online" class="text-white m-1">
            <img src="/src/assets/img/svg/speedometer.svg" class="white me-2" width="32" height="32" style=" float: left;" />
             <span class="fs-4 align-middle me-1" style=" float: left;"> {{clientname}} </span>
             <span class="fs-4 align-middle me-4 red" style="float: left;"> | offline </span>  
            <button style="float: left;" @click="exit()" class="btn btn-outline-warning ">{{$t('editor.exit')}} </button>
        </div>

        <span class="fs-4 align-middle" style="">{{servername}}</span>
        <span class="fs-4 align-middle" style="float: right">Writer</span>
        <span class="fs-4 align-middle me-2" style="float: right">{{timesinceentry}}</span>
    </div>
     <!-- HEADER END -->



    <div class="w-100 p-2 m-0 text-white shadow-sm text-center" style=" top: 66px; z-index: 10001 !important; background-color: white;">
        
        <!-- toolbar start -->
        <div v-if="editor" class="m-2" id="editortoolbar">
            <button @click="editor.chain().focus().undo().run()" class="btn btn-outline-warning p-1 me-1 mb-1 btn-sm"><img src="/src/assets/img/svg/edit-undo.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().redo().run()" class="btn btn-outline-warning p-1 me-1 mb-1 btn-sm"><img src="/src/assets/img/svg/edit-redo.svg" class="white" width="22" height="22" > </button>
            <button @click="editor.chain().focus().clearNodes().run()" class="btn btn-outline-warning p-1 me-3 mb-1 btn-sm"><img src="/src/assets/img/svg/format-remove-node.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" class="btn btn-outline-success p-1 me-1 mb-1 btn-sm"><img src="/src/assets/img/svg/format-text-bold.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" class="btn btn-outline-success p-1 me-1 mb-1 btn-sm"><img src="/src/assets/img/svg/format-text-italic.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }" class="btn btn-outline-success p-1 me-1 mb-1 btn-sm "> <img src="/src/assets/img/svg/format-text-underline.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" class="btn btn-outline-dark p-1 me-1 mb-1 btn-sm">h2</button>
            <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" class="btn btn-outline-dark p-1 me-1 mb-1 btn-sm">h3</button>
            <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }" class="btn btn-outline-dark p-1 me-1 mb-1 btn-sm">h4</button>
            <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }" class="btn btn-outline-dark p-1 me-1 mb-1 btn-sm">h5</button>
            <button @click="editor.chain().focus().toggleSubscript().run()" :class="{ 'is-active': editor.isActive('subscript') }" class="btn btn-outline-success p-1 me-1 mb-1 btn-sm"><img src="/src/assets/img/svg/format-text-subscript.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleSuperscript().run()" :class="{ 'is-active': editor.isActive('superscript') }" class="btn btn-outline-success p-1 me-2 mb-1 btn-sm"><img src="/src/assets/img/svg/format-text-superscript.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }" class="btn btn-outline-info p-1 me-1 mb-1 btn-sm"><img src="/src/assets/img/svg/format-list-unordered.svg" class="white" width="22" height="22" > </button>
            <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }" class="btn btn-outline-info p-1 me-1 mb-1 btn-sm"><img src="/src/assets/img/svg/format-list-ordered.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }" class="btn btn-outline-secondary p-1 me-1 mb-1 btn-sm"><img src="/src/assets/img/svg/dialog-xml-editor.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }" class="btn btn-outline-secondary p-1 me-1 mb-1  btn-sm"><img src="/src/assets/img/svg/code-context.svg" class="white" width="22" height="22" > </button>
            <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }" class="btn btn-outline-info p-1 me-1 mb-1 btn-sm"> <img src="/src/assets/img/svg/format-text-blockquote.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().setHorizontalRule().run()" class="btn btn-outline-info p-1 me-2 mb-1 btn-sm"><img src="/src/assets/img/svg/newline.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }" class="btn btn-outline-info  p-1 me-1 mb-1 btn-sm"><img src="/src/assets/img/svg/format-justify-left.svg" class="white" width="22" height="22" ></button> 
            <button @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }" class="btn btn-outline-info p-1 me-1 mb-1 btn-sm "><img src="/src/assets/img/svg/format-justify-center.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }" class="btn btn-outline-info p-1 me-2 mb-1 btn-sm "><img src="/src/assets/img/svg/format-justify-right.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().setHardBreak().run()" class="btn btn-outline-info p-1 me-2 mb-1 btn-sm"><img src="/src/assets/img/svg/key-enter.svg" class="white" width="22" height="22" ></button>
        
           <div v-for="file in localfiles" class="d-inline">
                <div v-if="(file.name == currentFile && file.type == 'html')" class="btn btn-success p-1 me-1 mb-1 btn-sm"   @click="selectedFile=file.name; toggleUpload()"><img src="/src/assets/img/svg/games-solve.svg" class="" width="22" height="22" > {{file.name}} </div>
                <div v-if="(file.name != currentFile && file.type == 'html')" class="btn btn-secondary p-1 me-1 mb-1 btn-sm" @click="selectedFile=file.name; toggleUpload()"><img src="/src/assets/img/svg/document-replace.svg" class="" width="22" height="22" > {{file.name}} </div>
                <div v-if="(file.type == 'pdf')" class="btn btn-secondary p-1 me-1 mb-1 btn-sm" @click="selectedFile=file.name; loadPDF(file.name)"><img src="/src/assets/img/svg/document-replace.svg" class="" width="22" height="22" > {{file.name}} </div>
            </div>
        
        </div>
        <!-- toolbar end -->
    </div>

    <!-- angabe/pdf preview start -->
    <div id=preview class="fadeinslow p-4">
        <embed src="" id="pdfembed"/>
    </div>
    <!-- angabe/pdf preview end -->

    <!-- focus warning start -->
   <div v-if="!focus" id="" class="infodiv p-4 d-block focuswarning" >
        <div class="mb-3 row">
            <div class="mb-3 "> {{$t('editor.leftkiosk')}} <br> {{$t('editor.tellsomeone')}} </div>
            <img src="/src/assets/img/svg/eye-slash-fill.svg" class=" me-2" width="32" height="32" >
        </div>
    </div>
    <!-- focuswarning end  -->



    <!-- file replace start -->
    <div id="uploaddiv" class="fadeinslow p-4">
        <div class="mb-3 row">
            <div class="mb-3 "> {{$t('editor.replacecontent')}} <b>{{selectedFile}}</b></div>
            <div class="col d-inlineblock btn btn-success m-1"  @click="toggleUpload()"        >{{$t('editor.cancel')}}</div>
            <div class="col d-inlineblock btn btn-danger m-1"  @click="loadHTML(selectedFile)" >{{$t('editor.replace')}}</div>
        </div>
    </div>
    <!-- filereplace end -->



    <!-- EDITOR START -->
    <div style="position: relative; height: 100%; overflow:hidden; overflow-y: scroll; background-color: #eeeefa;">
        <div id="editorcontainer" class="shadow" style="border-radius:0; margin-top:20px; width: 90vw; margin-left:5vw;">
            <editor-content :editor="editor" class='p-0' id="editorcontent" style="background-color: #fff; border-radius:0;" />
        </div>
    </div>
    <!-- EDITOR END -->
</template>

<script>
import { Editor, EditorContent, VueNodeViewRenderer } from '@tiptap/vue-3'
import TextAlign from '@tiptap/extension-text-align'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import CodeBlockComponent from '../components/CodeBlockComponent.vue'
import Blockquote from '@tiptap/extension-blockquote'
import BulletList from '@tiptap/extension-bullet-list'
import HardBreak from '@tiptap/extension-hard-break'
import ListItem from '@tiptap/extension-list-item'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Heading from '@tiptap/extension-heading'
import OrderedList from '@tiptap/extension-ordered-list'
import Bold from '@tiptap/extension-bold'
import Code from '@tiptap/extension-code'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Dropcursor from '@tiptap/extension-dropcursor'
import Gapcursor from '@tiptap/extension-gapcursor'
import History from '@tiptap/extension-history'
import { lowlight } from "lowlight/lib/common.js";
import jsPDF from 'jspdf'

import FormData from 'form-data';
import axios from "axios";
import $ from 'jquery'


export default {
    components: {
        EditorContent,
    },
    data() {
        return {
            online: true,
            focus: true,
            exammode: false,
            selectedFile:null,
            currentFile:null,
            editor: null,
            saveinterval: null,
            fetchinfointerval: null,
            clockinterval: null,
            loadfilelistinterval: null,
            servername: this.$route.params.servername,
            servertoken: this.$route.params.servertoken,
            serverip: this.$route.params.serverip,
            token: this.$route.params.token,
            clientname: this.$route.params.clientname,
            localfiles: null,
            serverApiPort: this.$route.params.serverApiPort,
            clientApiPort: this.$route.params.clientApiPort,
            electron: this.$route.params.electron,
            blurEvent : null,
            endExamEvent: null,
            clientinfo: null,
            entrytime: 0,
            timesinceentry: 0
        }
    },
    methods: {
        exit(){
             ipcRenderer.send('endexam')
        }, 
        clock(){
            let now = new Date().getTime()
            this.timesinceentry =  new Date(now - this.entrytime).toISOString().substr(11, 8)
        },
        fetchInfo() {
            axios.get(`http://localhost:${this.clientApiPort}/client/control/getinfo`)
            .then( response => {
                this.clientinfo = response.data.clientinfo
                this.token = this.clientinfo.token
                this.focus = this.clientinfo.focus
                this.clientname = this.clientinfo.name
                this.exammode = this.clientinfo.exammode
        
                if (!this.focus){  this.entrytime = new Date().getTime()}
                if (this.clientinfo && this.clientinfo.token){  this.online = true  }
                else { this.online = false  }
            })
            .catch( err => {console.log(err)});
        }, 
        loadFilelist(){
            fetch(`http://localhost:${this.clientApiPort}/client/data/getfiles`, { method: 'POST' })
            .then( response => response.json() )
            .then( filelist => {
                this.localfiles = filelist;
            }).catch(err => { console.warn(err)});
        },

        // get file from local workdirectory and replace editor content with it
        loadHTML(file){
            this.toggleUpload()
            this.currentFile = file  //.replace(/\.[^/.]+$/, "")  // this is going to be the name of the file (without extension) when saved as html or pdf (never overwrite another file)
            const form = new FormData()
            form.append("filename", file)
            fetch(`http://localhost:${this.clientApiPort}/client/data/getfiles`, { method: 'POST', body: form })
                .then( response => response.json())
                .then( data => {
                    this.editor.commands.clearContent(true)
                    this.editor.commands.insertContent(data)
                }).catch(err => { console.warn(err)});     
        },

        // fetch file from disc - show preview
        loadPDF(file){
            const form = new FormData()
            form.append("filename", file)
            fetch(`http://localhost:${this.clientApiPort}/client/data/getpdf`, { method: 'POST', body: form })
                .then( response => response.arrayBuffer())
                .then( data => {
                    let url =  URL.createObjectURL(new Blob([data], {type: "application/pdf"})) 
                    $("#pdfembed").attr("src", `${url}#toolbar=0&navpanes=0&scrollbar=0`)
                    $("#preview").css("display","block");
                    $("#preview").click(function(e) {
                         $("#preview").css("display","none");
                    });
               }).catch(err => { console.warn(err)});     
        },

        // make upload div visible or hide it
        toggleUpload(){
            let status =  $("#uploaddiv").css("display");
            if (status == "none") {  
                $("#uploaddiv").css("display","block");
                $("#formFileMultiple").val('') 
            }
            else {  $("#uploaddiv").css("display","none"); }
        },

        /** Converts the Editor View into a multipage PDF */
        async saveContent() {              
            let doc = new jsPDF('p', 'px','a4', true, true);   //orientation, unit for coordinates, format, onlyUsedFonts, compress
            const editorcontent = this.editor.getHTML();    
            let pdfBlob;
            doc.html(editorcontent, {
                    callback: (doc) => {
                        let filename = this.currentFile.replace(/\.[^/.]+$/, "")  // we dont need the extension
                        pdfBlob = new Blob([ doc.output('blob') ], { type : 'application/pdf'});
                        let form = new FormData()
                        form.append("file", pdfBlob,  `${filename}.pdf` );
                        form.append("editorcontent", editorcontent)
                        form.append("currentfilename", filename)
                        
                        axios({
                            method: "post", 
                            url: `http://localhost:${this.clientApiPort}/client/data/store`, 
                            data: form, 
                            headers: { 'Content-Type': `multipart/form-data; boundary=${form._boundary}` }  
                        }).then( async (response) => {
                            //console.log(response.data)
                        }).catch(err => { console.warn(err)});
                    },
                    x: 0,
                    y: 0,
                    margin: [20,20,20,20],
                    width :400,
                    windowWidth:420,
                    autoPaging: 'slice',
            });
        },
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
                if (elementInFocus !== "geogebraframe" && elementInFocus !== "vuexambody" && elementInFocus !== "pdfembed" ){
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
            axios.get(`http://${this.serverip}:${this.serverApiPort}/server/control/studentlist/statechange/${this.servername}/${this.token}/false`)
            .then( (response) => { console.log(response.data); })
            .catch( err => {console.log(err)});  
           
            //also store focus information locally
            axios.get(`http://localhost:${this.clientApiPort}/client/control/focus/${this.token}/false`)
            .then( response => { this.focus = false; console.log(response.data);  })
            .catch( err => {console.log(err)});
        }
    },
    mounted() {
        this.editor = new Editor({
            extensions: [
                Blockquote,
                BulletList,
                Document,
                HardBreak,
                Heading,
                HorizontalRule,
                ListItem,
                OrderedList,
                Paragraph,
                Text,
                Bold,
                Code,
                Italic,
                Subscript,
                Superscript,
                Underline,
                Dropcursor,
                Gapcursor,
                History,
                TextAlign.configure({
                types: ['heading', 'paragraph'],
                }),
                CodeBlockLowlight
                .extend({
                    addNodeView() {
                    return VueNodeViewRenderer(CodeBlockComponent)
                    },
                })
                .configure({ lowlight }),
            ],
            content: `
     
<h2>
    Hi there,
</h2>
<p>
    this is a <em>basic</em> example of <strong>tiptap</strong>. 
    <br>Next up: A bullet list:
</p>
<ul>
    <li>Free Open Source Software</li>
    <li>Plattform independent</li>
</ul>
<p>Let’s try a code block:</p>
<pre><code class="language-css">
body {
    background-color: rgba(200,200,24,1);
}
</code></pre>
<p> 1 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>2 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>3 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>4 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>5 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>6 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>7 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>8 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>9 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>10 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>11 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>12 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>13 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>14 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>Let’s try a code block: </p>
<pre><code class="language-javascript">
const test = function ( data ) { console.log(data); }
</code></pre>
<p>1 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>2 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>3 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>4 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>5 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>6 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>7 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>8 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>9 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>10 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>11 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>12 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>13 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>14 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>

ENDE !!`,
        });

        if (this.token) { this.focuscheck() }  // run focuscheck function (sets some window event listeners )    // no focuscheck function when entering manually   
        if (this.electron){
            if (this.token) {  this.blurEvent = ipcRenderer.on('blurevent', this.focuslost, false); } //ipcRenderer seems to be of type nodeEventTarget (on/addlistener returns a reference to the eventTarget)
            this.endExamEvent = ipcRenderer.on('endexam', () => { this.$router.push({ name: 'student'}); }); //redirect to home view // right before we leave vue.js will run beforeUnmount() which removes all listeners this view attached to the window and the ipcrenderer
        }   
        this.currentFile = this.clientname+".html"
        this.entrytime = new Date().getTime()
        this.saveinterval = setInterval(() => { this.saveContent() }, 20000)    // speichert content als datei
        this.loadfilelistinterval = setInterval(() => { this.loadFilelist() }, 10000)   // zeigt html dateien (angaben, eigene arbeit) im header
        this.fetchinfointerval = setInterval(() => { this.fetchInfo() }, 5000)      //holt client info (exam status, connection, token)
        this.clockinterval = setInterval(() => { this.clock() }, 1000)   // uhrzeit (jede sekunde)
        this.loadFilelist()
    },
    beforeUnmount() {
        //remove electron ipcRender events
        if (this.endExamEvent){ this.endExamEvent.removeAllListeners('endexam')  } //remove endExam listener from window
        if (this.blurEvent){ this.blurEvent.removeAllListeners('blurevent') } //Node.js-specific extension to the EventTarget class. If type is specified, removes all registered listeners for type, otherwise removes all registered listeners.
        

        //remove window/document events
        window.removeEventListener("beforeunload",  this.focuslost);
        window.removeEventListener('blur',          this.focuslost);
        document.removeEventListener("visibilityChange", this.focuslost); 

        this.editor.destroy()
        clearInterval( this.saveinterval )
        clearInterval( this.loadfilelistinterval )
        clearInterval( this.fetchinfointerval )
        clearInterval( this.clockinterval )
    },
}
</script>

<style lang="scss" scoped>

#preview {
    display: none;
    position: absolute;
    top:0;
    left: 0;
    width:100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    z-index:100000;
}

#pdfembed { 
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -30vw;
    margin-top: -45vh;
    width:60vw;
    height: 90vh;
    padding: 10px;
    background-color: rgba(255, 255, 255, 1);
    border: 0px solid rgba(255, 255, 255, 0.589);
    box-shadow: 0 0 15px rgba(22, 9, 9, 0.589);
    padding: 10px;
    border-radius: 6px;
}

.html2pdf__container {  //this works only if html automaging mode is "slice" - if we set it to "text" this messes up all lineheights
    line-height: 12px;
    font-size: 12px;
    ul { padding: 0 15px; line-height: 2px;  }
    ol { padding: 0 15px; line-height: 2px;  }

    pre {
        code {
            letter-spacing: 2px;
        }
    }
    
    h5 {font-size: 20px; }
    h4 {font-size: 22px; }
    h3 {font-size: 24px; }
    h2 {font-size: 26px; }
}

/* Basic editor styles */

.ProseMirror {
  padding: 14px;
  outline: 1px solid rgb(197, 197, 197);
  border-radius: 5px;
}

.ProseMirror:focus-visible{
  outline: 1px solid rgb(197, 197, 197);
}

.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
    line-height: 1;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }

    .hljs-comment, .hljs-quote {
      color: #616161;
    }

    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #F98181;
    }

    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #FBBC88;
    }

    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #B9F18D;
    }

    .hljs-title,
    .hljs-section {
      color: #FAF594;
    }

    .hljs-keyword,
    .hljs-selector-tag {
      color: #70CFF8;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: 700;
    }

}
</style>
