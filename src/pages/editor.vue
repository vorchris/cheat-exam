 <template>
  <div class="w-100 p-3 text-white bg-dark shadow text-right">
        <img src="/src/assets/img/svg/speedometer.svg" class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-4 ">{{clientname}}</span>
        <span class="fs-4 align-middle" style="float: right">Next-Exam Writer</span>
  </div>



    <div id="editorcontainer">

        <div id="uploaddiv" class="fadeinslow p-4">
            <div class="mb-3 row">
                <div class="mb-3 ">Wollen sie den Inhalt des Editors durch den Inhalt der Datei <b>{{selectedFile}}</b> ersetzen?</div>
                <div class="col d-inlineblock btn btn-success m-1"  @click="toggleUpload()"        >cancel </div>
                <div class="col d-inlineblock btn btn-danger m-1"  @click="loadfile(selectedFile)" >replace</div>
            </div>
        </div>




        <div id="localfiles" class="mb-2">
             <div v-for="file in localfiles" class="btn btn-dark me-2" @click="selectedFile=file; toggleUpload()">
              <img src="/src/assets/img/svg/document-replace.svg" class="" width="22" height="22" > {{file}} 
            </div>
        </div>
        <div v-if="editor" class="mb-2" id="editortoolbar">
            <button @click="editor.chain().focus().undo().run()" class="btn btn-outline-warning p-1 me-1 mb-1"><img src="/src/assets/img/svg/edit-undo.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().redo().run()" class="btn btn-outline-warning p-1 me-1 mb-1"><img src="/src/assets/img/svg/edit-redo.svg" class="white" width="22" height="22" > </button>
            <button @click="editor.chain().focus().clearNodes().run()" class="btn btn-outline-warning p-1 me-3 mb-1"><img src="/src/assets/img/svg/format-remove-node.svg" class="white" width="22" height="22" ></button>
      
            <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" class="btn btn-outline-success p-1 me-1 mb-1"><img src="/src/assets/img/svg/format-text-bold.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" class="btn btn-outline-success p-1 me-1 mb-1"><img src="/src/assets/img/svg/format-text-italic.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }" class="btn btn-outline-success p-1 me-1 mb-1 "> <img src="/src/assets/img/svg/format-text-underline.svg" class="white" width="22" height="22" ></button>
  
            <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" class="btn btn-outline-dark p-1 me-1 mb-1">h2</button>
            <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" class="btn btn-outline-dark p-1 me-1 mb-1">h3</button>
            <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }" class="btn btn-outline-dark p-1 me-1 mb-1">h4</button>
            <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }" class="btn btn-outline-dark p-1 me-1 mb-1">h5</button>
            
            <button @click="editor.chain().focus().toggleSubscript().run()" :class="{ 'is-active': editor.isActive('subscript') }" class="btn btn-outline-success p-1 me-1 mb-1"><img src="/src/assets/img/svg/format-text-subscript.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleSuperscript().run()" :class="{ 'is-active': editor.isActive('superscript') }" class="btn btn-outline-success p-1 me-2 mb-1"><img src="/src/assets/img/svg/format-text-superscript.svg" class="white" width="22" height="22" ></button>

            <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }" class="btn btn-outline-info p-1 me-1 mb-1"><img src="/src/assets/img/svg/format-list-unordered.svg" class="white" width="22" height="22" > </button>
            <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }" class="btn btn-outline-info p-1 me-1 mb-1"><img src="/src/assets/img/svg/format-list-ordered.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }" class="btn btn-outline-secondary p-1 me-1 mb-1"><img src="/src/assets/img/svg/dialog-xml-editor.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }" class="btn btn-outline-secondary p-1 me-1 mb-1 "><img src="/src/assets/img/svg/code-context.svg" class="white" width="22" height="22" > </button>

            <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }" class="btn btn-outline-info p-1 me-1 mb-1"> <img src="/src/assets/img/svg/format-text-blockquote.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().setHorizontalRule().run()" class="btn btn-outline-info p-1 me-2 mb-1"><img src="/src/assets/img/svg/newline.svg" class="white" width="22" height="22" ></button>
        
            <button @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }" class="btn btn-outline-info  p-1 me-1 mb-1"><img src="/src/assets/img/svg/format-justify-left.svg" class="white" width="22" height="22" ></button> 
            <button @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }" class="btn btn-outline-info p-1 me-1 mb-1 "><img src="/src/assets/img/svg/format-justify-center.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }" class="btn btn-outline-info p-1 me-2 mb-1 "><img src="/src/assets/img/svg/format-justify-right.svg" class="white" width="22" height="22" ></button>

            <button @click="editor.chain().focus().setHardBreak().run()" class="btn btn-outline-info p-1 me-2 mb-1"><img src="/src/assets/img/svg/key-enter.svg" class="white" width="22" height="22" ></button>
        </div>
    
        <editor-content :editor="editor" class='p-0' id="editorcontent"/>
    </div>
<div id="preview"></div>
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
import { lowlight } from 'lowlight'// load all highlight.js languages
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'


import { activatefocuscheck } from '../assets/js/checkfocus'
import $ from 'jquery'

export default {
  components: {
    EditorContent,
  },

  data() {
    return {
        selectedFile:null,
        currentFile:null,
        editor: null,
        fetchinterval: null,
        loadfilelistinterval: null,
        servername: this.$route.params.servername,
        servertoken: this.$route.params.servertoken,
        serverip: this.$route.params.serverip,
        token: this.$route.params.token,
        clientname: this.$route.params.clientname,
        localfiles: null
    }
  },

  mounted() {
    // run focuscheck function (give it 'this' in order to know about reactive vars from this view )
    activatefocuscheck.call('', this)  // aus einem mir momentan nicht zugänglichen grund wird der erste parameter hier nicht wie erwartet als "this" an die funktion übergeben


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

    this.currentFile = this.clientname
    this.fetchinterval = setInterval(() => { this.fetchContent() }, 6000)   //1*pro minute
    this.loadfilelistinterval = setInterval(() => { this.loadFilelist() }, 6000)   //1*pro minute
    this.loadFilelist()
  },
  methods: {

        loadFilelist(){
            fetch(`http://localhost:3000/client/data/getfiles`, { method: 'POST' })
            .then( response => response.json() )
            .then( data => {
                this.localfiles = data;
            }).catch(err => { console.warn(err)});
        },

        // get file from local workdirectory and replace editor content with it
        loadfile(file){
            this.toggleUpload()
            this.currentFile = file.replace(/\.[^/.]+$/, "")  // this is going to be the name of the file (without extension) when saved as html or pdf (never overwrite another file)
            const form = new FormData()
            form.append("filename", file)
            // fetch file from disc - replace editor content
            fetch(`http://localhost:3000/client/data/getfiles`, { method: 'POST', body: form })
                .then( response => response.json() )
                .then( html => {
                    this.editor.commands.clearContent(true)
                    this.editor.commands.insertContent(html)
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
        async fetchContent() {              
            let body = document.body;
            let doc = new jsPDF('p', 'px','a4', true, true);   //orientation, unit for coordinates, format, onlyUsedFonts, compress
            let pagenumber = 0;   // how many pdf pages can we get out of the total page height?
            let windowHeight = 0;  // the dryrun will set the windowheight of the editor at a given width of 794px (final pdf x resolution)

            html2canvas(body, { scale: 1, x:0, y: 0,  scrollX: 0,  scrollY: 0,  windowWidth: 794,    //DRYRUN - this sets the html body width for this canvas render testrun >> ATTENTION: windowHeight will change accordingly !!!
                onclone: (document) => {
                    document.getElementById('editortoolbar').style.display = 'none';   //hide toolbar
                    document.getElementById('localfiles').style.display = 'none';   //hide filespicker
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
                                document.getElementById('editortoolbar').style.display = 'none'
                                document.getElementById('localfiles').style.display = 'none';   //hide filespicker
                            }
                        }).then( canvas => {  // now we have a canvas that contains the whole website :-) !!
                            let img = canvas.toDataURL('image/jpeg', 1);  // type, quality
                            doc.addImage(img, 'JPG', 0, 0, 0, 0, i, 'FAST');    // imagedata, format if recognition fails, x, y ,w ,h, alias, compression, rotation
                            if ( ( i + 1 ) == pagenumber) {  // FINISHED
                                const editorcontent = this.editor.getHTML();  //get content as JSON (für späteren re-import in den editor!?)
                                const pdfBlob = new Blob([ doc.output('blob') ], { type : 'application/pdf'});

                                const form = new FormData()
                                form.append("file", pdfBlob,  `${this.currentFile}.pdf` );
                                form.append("editorcontent", editorcontent)
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

<style lang="scss">
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
