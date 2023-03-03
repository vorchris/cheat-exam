 <template>

    <!-- HEADER START -->
    <div id="editorheader" class="w-100 p-3 text-white bg-dark  text-center" style=" z-index: 10000 !important">
        <div v-if="online" class="text-white m-1">
            <img src="/src/assets/img/svg/speedometer.svg" class="white me-2" width="32" height="32" style="float: left;" />
            <span class="fs-4 align-middle me-1" style="float: left;">{{clientname}}</span>
            <span class="fs-4 align-middle me-4 green" style="float: left;" >| {{$t('student.connected')}}</span> 
        </div>
        
        <div v-if="!online" class="text-white m-1">
            <img src="/src/assets/img/svg/speedometer.svg" class="white me-2" width="32" height="32" style=" float: left;" />
            <span class="fs-4 align-middle me-1" style=" float: left;"> {{clientname}} </span>
            <span class="fs-4 align-middle me-4 red" style="float: left;"> | {{ $t("student.disconnected") }} </span>  
        </div>

        <span  v-if="online" class="fs-4 align-middle" style="">{{servername}}|{{pincode}}</span>
        <div v-if="!online && exammode" class="btn btn-success p-1 me-1 mb-1 btn-sm"  style="float: left;"  @click="reconnect()"><img src="/src/assets/img/svg/gtk-convert.svg" class="" width="22" height="22"> {{ $t("editor.reconnect")}}</div>
        <div v-if="!online && exammode" class="btn btn-danger p-1 me-1 mb-1 btn-sm"  style="float: left;"  @click="gracefullyexit()"><img src="/src/assets/img/svg/dialog-cancel.svg" class="" width="22" height="22"> {{ $t("editor.unlock")}} </div>


        <span class="fs-4 align-middle" style="float: right">Writer</span>
        <span class="fs-4 align-middle me-2" style="float: right">{{timesinceentry}}</span>
        <span v-if="battery && battery.level" class="fs-4 me-3"  style="float: right;">
            <img v-if="battery && battery.level > 0.9" src="/src/assets/img/svg/battery-100.svg"  :title="battery.level*100+'%'" class="white align-middle me-0" width="32" height="32" style="margin-bottom:3px;" />
            <img v-if="battery && battery.level > 0.8 && battery.level < 0.9 " src="/src/assets/img/svg/battery-090.svg" :title="battery.level*100+'%'" class="white align-middle me-0" width="32" height="32" style="margin-bottom:3px;" />
            <img v-if="battery && battery.level > 0.7 && battery.level < 0.8 " src="/src/assets/img/svg/battery-080.svg" :title="battery.level*100+'%'" class="white align-middle me-0" width="32" height="32" style="margin-bottom:3px;" />
            <img v-if="battery && battery.level > 0.6 && battery.level < 0.7 " src="/src/assets/img/svg/battery-070.svg" :title="battery.level*100+'%'" class="white align-middle me-0" width="32" height="32" style="margin-bottom:3px;" />
            <img v-if="battery && battery.level > 0.5 && battery.level < 0.6 " src="/src/assets/img/svg/battery-060.svg" :title="battery.level*100+'%'" class="white align-middle me-0" width="32" height="32" style="margin-bottom:3px;" />
            <img v-if="battery && battery.level > 0.4 && battery.level < 0.5 " src="/src/assets/img/svg/battery-050.svg" :title="battery.level*100+'%'" class="white align-middle me-0" width="32" height="32" style="margin-bottom:3px;" />
            <img v-if="battery && battery.level > 0.3 && battery.level < 0.4 " src="/src/assets/img/svg/battery-040.svg" :title="battery.level*100+'%'" class="white align-middle me-0" width="32" height="32" style="margin-bottom:3px;" />
            <img v-if="battery && battery.level > 0.2 && battery.level < 0.3 " src="/src/assets/img/svg/battery-030.svg" :title="battery.level*100+'%'" class="white align-middle me-0" width="32" height="32" style="margin-bottom:3px;" />
            <img v-if="battery && battery.level > 0.1 && battery.level < 0.2 " src="/src/assets/img/svg/battery-020.svg" :title="battery.level*100+'%'" class="white align-middle me-0" width="32" height="32" style="margin-bottom:3px;" />
            <img v-if="battery && battery.level < 0.1" :title="battery.level*100+'%'" src="/src/assets/img/svg/battery-010.svg" class=" align-middle me-0" width="32" height="32" style="margin-bottom:3px;" />
        </span>


    </div>
     <!-- HEADER END -->



    <div class="w-100 p-2 m-0 text-white shadow-sm text-center" style=" top: 66px; z-index: 10001 !important; background-color: white;">
        
        <!-- toolbar start -->
        <div v-if="editor" class="m-2" id="editortoolbar" style="text-align:left;"> 
            <button @click="saveContent(true); backup();" class="btn btn-outline-success p-1 me-1 mb-1 btn-sm"><img src="/src/assets/img/svg/document-save.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().undo().run()" class="btn btn-outline-warning p-1 me-0 mb-1 btn-sm"><img src="/src/assets/img/svg/edit-undo.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().redo().run()" class="btn btn-outline-warning p-1 me-2 mb-1 btn-sm"><img src="/src/assets/img/svg/edit-redo.svg" class="white" width="22" height="22" > </button>
            <button @click="editor.chain().focus().clearNodes().run()" class="btn btn-outline-warning p-1 me-2 mb-1 btn-sm"><img src="/src/assets/img/svg/draw-eraser.svg" class="white" width="22" height="22" ></button>

            <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" class="btn btn-outline-success p-1 me-0 mb-1 btn-sm"><img src="/src/assets/img/svg/format-text-bold.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" class="btn btn-outline-success p-1 me-0 mb-1 btn-sm"><img src="/src/assets/img/svg/format-text-italic.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }" class="btn btn-outline-success p-1 me-2 mb-1 btn-sm "> <img src="/src/assets/img/svg/format-text-underline.svg" class="white" width="22" height="22" ></button>
            
            
            <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" class="btn btn-outline-secondary p-1 me-0 mb-1 btn-sm"><img src="/src/assets/img/svg/h2.svg" width="22" height="22"></button>
            <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" class="btn btn-outline-secondary p-1 me-0 mb-1 btn-sm"><img src="/src/assets/img/svg/h3.svg" width="22" height="22"></button>
            <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }" class="btn btn-outline-secondary p-1 me-0 mb-1 btn-sm"><img src="/src/assets/img/svg/h4.svg" width="22" height="22"></button>
            <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }" class="btn btn-outline-secondary p-1 me-2 mb-1 btn-sm"><img src="/src/assets/img/svg/h5.svg" width="22" height="22"></button>
            <button @click="editor.chain().focus().toggleSubscript().run()" :class="{ 'is-active': editor.isActive('subscript') }" class="btn btn-outline-success p-1 me-0 mb-1 btn-sm"><img src="/src/assets/img/svg/format-text-subscript.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleSuperscript().run()" :class="{ 'is-active': editor.isActive('superscript') }" class="btn btn-outline-success p-1 me-2 mb-1 btn-sm"><img src="/src/assets/img/svg/format-text-superscript.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }" class="btn btn-outline-info p-1 me-0 mb-1 btn-sm"><img src="/src/assets/img/svg/format-list-unordered.svg" class="white" width="22" height="22" > </button>
            <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }" class="btn btn-outline-info p-1 me-2 mb-1 btn-sm"><img src="/src/assets/img/svg/format-list-ordered.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }" class="btn btn-outline-secondary p-1 me-0 mb-1 btn-sm"><img src="/src/assets/img/svg/dialog-xml-editor.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }" class="btn btn-outline-secondary p-1 me-0 mb-1  btn-sm"><img src="/src/assets/img/svg/code-context.svg" class="white" width="22" height="22" > </button>
            <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }" class="btn btn-outline-info p-1 me-0 mb-1 btn-sm"> <img src="/src/assets/img/svg/format-text-blockquote.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().setHorizontalRule().run()" class="btn btn-outline-info p-1 me-2 mb-1 btn-sm"><img src="/src/assets/img/svg/newline.svg" class="white" width="22" height="22" ></button>

            <button @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }" class="btn btn-outline-info  p-1 me-0 mb-1 btn-sm"><img src="/src/assets/img/svg/format-justify-left.svg" class="white" width="22" height="22" ></button> 
            <button @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }" class="btn btn-outline-info p-1 me-0 mb-1 btn-sm "><img src="/src/assets/img/svg/format-justify-center.svg" class="white" width="22" height="22" ></button>
            <button @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }" class="btn btn-outline-info p-1 me-2 mb-1 btn-sm"><img src="/src/assets/img/svg/format-justify-right.svg" class="white" width="22" height="22" ></button>
   

            <button @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()" class="btn btn-outline-info p-1 me-0 mb-1 btn-sm"><img src="/src/assets/img/svg/insert-table.svg" width="22" height="22" ></button>
            <button @click="editor.chain().focus().deleteTable().run()" :disabled="!editor.can().deleteTable()" class="btn btn-outline-info p-1 me-0 mb-1 btn-sm"><img src="/src/assets/img/svg/deletecell.svg" width="22" height="22" ></button>
            <button @click="editor.chain().focus().addColumnAfter().run()" :disabled="!editor.can().addColumnAfter()" class="btn btn-outline-info p-1 me-0 mb-1 btn-sm"><img src="/src/assets/img/svg/edit-table-insert-column-right.svg" width="22" height="22" ></button>
            <button @click="editor.chain().focus().addRowAfter().run()" :disabled="!editor.can().addRowAfter()" class="btn btn-outline-info p-1 me-0 mb-1 btn-sm"><img src="/src/assets/img/svg/edit-table-insert-row-below.svg" width="22" height="22" ></button>
            <button @click="editor.chain().focus().deleteColumn().run()" :disabled="!editor.can().deleteColumn()" class="btn btn-outline-info p-1 me-0 mb-1 btn-sm"><img src="/src/assets/img/svg/edit-table-delete-column.svg" width="22" height="22" ></button>
            <button @click="editor.chain().focus().deleteRow().run()" :disabled="!editor.can().deleteRow()" class="btn btn-outline-info p-1 me-0 mb-1 btn-sm"><img src="/src/assets/img/svg/edit-table-delete-row.svg" width="22" height="22" ></button>
            <button @click="editor.chain().focus().mergeOrSplit().run()" :disabled="!editor.can().mergeOrSplit()" class="btn btn-outline-info p-1 me-0 mb-1 btn-sm"><img src="/src/assets/img/svg/edit-table-cell-merge.svg" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleHeaderColumn().run()" :disabled="!editor.can().toggleHeaderColumn()" class="btn btn-outline-info p-1 me-0 mb-1 btn-sm"><img src="/src/assets/img/svg/table-header-left.svg" width="22" height="22" ></button>
            <button @click="editor.chain().focus().toggleHeaderRow().run()" :disabled="!editor.can().toggleHeaderRow()" class="btn btn-outline-info p-1 me-2 mb-1 btn-sm"><img src="/src/assets/img/svg/table-header-top.svg" width="22" height="22" ></button>
            <button @click="editor.chain().focus().setHardBreak().run()" class="btn btn-outline-info p-1 me-2 mb-1 btn-sm"><img src="/src/assets/img/svg/key-enter.svg" class="white" width="22" height="22" ></button>
        
            <br>
           <div v-for="file in localfiles" class="d-inline" style="text-align:left">
                <div v-if="(file.type == 'bak')" class="btn btn-success p-0  pe-2 ps-1 me-1 mb-0 btn-sm"   @click="selectedFile=file.name; loadHTML(file.name)"><img src="/src/assets/img/svg/games-solve.svg" class="" width="22" height="22" style="vertical-align: top;"> {{file.name}}     ({{ new Date(this.now - file.mod).toISOString().substr(11, 5) }})</div>
                <div v-if="(file.type == 'pdf')" class="btn btn-info p-0 pe-2 ps-1 me-1 mb-0 btn-sm" @click="selectedFile=file.name; loadPDF(file.name)"><img src="/src/assets/img/svg/eye-fill.svg" class="white" width="22" height="22" style="vertical-align: top;"> {{file.name}} </div>
            </div>
        
        </div>
        <!-- toolbar end -->
    </div>

    <!-- angabe/pdf preview start -->
    <div id=preview class="fadeinslow p-4">
        <div class="btn btn-dark me-2 btn-lg shadow" style="float: right;" @click="print()"><img src="/src/assets/img/svg/print.svg" class="" width="22" height="22" > </div>
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





    <!-- EDITOR START -->
    <div d="editormaincontainer" style="position: relative; height: 100%; overflow:hidden; overflow-y: scroll; background-color: #eeeefa;">
        <div id="editorcontainer" class="shadow" style="">
            <editor-content :editor="editor" class='p-0' id="editorcontent" style="background-color: #fff; border-radius:0;" />
        </div>
        <div id="statusbar">
             <span> {{ $t("editor.chars") }}: {{charcount}}</span> | <span> {{ $t("editor.words") }}: {{wordcount}}</span> 
             <img @click="zoomin()" src="/src/assets/img/svg/zoom-in.svg" class="zoombutton">  
             <img @click="zoomout()" src="/src/assets/img/svg/zoom-out.svg" class="zoombutton">
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
import CharacterCount from  "@tiptap/extension-character-count"
import History from '@tiptap/extension-history'
import Typography from '@tiptap/extension-typography'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import { SmilieReplacer } from '../components/SmilieReplacer'
import { lowlight } from "lowlight/lib/common.js";
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
            clientinfo: null,
            entrytime: 0,
            timesinceentry: 0,
            charcount : 0,
            wordcount : 0,
            now : 0,
            pincode : this.$route.params.pincode,
            zoom:1,
            battery: null
        }
    },
    methods: {
        clock(){
            this.charcount = this.editor.storage.characterCount.characters()
            this.wordcount = this.editor.storage.characterCount.words()
            this.now = new Date().getTime()
            this.timesinceentry =  new Date(this.now - this.entrytime).toISOString().substr(11, 8)
        },
        async fetchInfo() {
            let getinfo = ipcRenderer.sendSync('getinfo')  // we need to fetch the updated version of the systemconfig from express api (server.js)
            this.clientinfo = getinfo.clientinfo;
            this.token = this.clientinfo.token
            this.focus = this.clientinfo.focus
            this.clientname = this.clientinfo.name
            this.exammode = this.clientinfo.exammode
            this.pincode = this.clientinfo.pin

            if (!this.focus){  this.entrytime = new Date().getTime()}
            if (this.clientinfo && this.clientinfo.token){  this.online = true  }
            else { this.online = false  }

            this.battery = await navigator.getBattery();
 
        }, 
        reconnect(){
            this.$swal.fire({
                title: this.$t("editor.reconnect"),
                text:  this.$t("editor.info"),
                icon: 'info',
                input: 'number',
                inputLabel: "PIN",
                inputValue: this.pincode,
                inputValidator: (value) => {
                    if (!value) {return this.$t("student.nopin")}
                }
            }).then((input) => {
                this.pincode = input.value
                if (!input.value) {return}
                let IPCresponse = ipcRenderer.sendSync('register', {clientname:this.clientname, servername:this.servername, serverip: this.serverip, pin:this.pincode })
                console.log(IPCresponse)
                this.token = IPCresponse.token  // set token (used to determine server connection status)

                if (IPCresponse.status === "success") {
                        this.$swal.fire({
                            title: "OK",
                            text: this.$t("student.registeredinfo"),
                            icon: 'success',
                            showCancelButton: false,
                        })
                    }
                if (IPCresponse.status === "error") {
                    this.$swal.fire({
                        title: "Error",
                        text: IPCresponse.message,
                        icon: 'error',
                        showCancelButton: false,
                    })
                }
            })
        },

        gracefullyexit(){
            this.$swal.fire({
                title: this.$t("editor.exit"),
                text:  this.$t("editor.exitkiosk"),
                icon: "question",
                showCancelButton: true,
                cancelButtonText: this.$t("editor.cancel"),
                reverseButtons: true
            })
            .then((result) => {
                if (result.isConfirmed) {
                    ipcRenderer.send('gracefullyexit')
                } 
            }); 
        },

        loadFilelist(){
            let filelist = ipcRenderer.sendSync('getfiles', null)
            this.localfiles = filelist;
        },

        // get file from local workdirectory and replace editor content with it
        loadHTML(file){
            this.$swal.fire({
                title: this.$t("editor.replace"),
                html:  `${this.$t("editor.replacecontent1")} <b>${file}</b> ${this.$t("editor.replacecontent2")}`,
                icon: "question",
                showCancelButton: true,
                cancelButtonText: this.$t("editor.cancel"),
                reverseButtons: true
            })
            .then((result) => {
                if (result.isConfirmed) {
                    let data = ipcRenderer.sendSync('getfiles', file )
                    this.editor.commands.clearContent(true)
                    this.editor.commands.insertContent(data)  
                } 
            }); 
        },

        // fetch file from disc - show preview
        loadPDF(file){
            let data = ipcRenderer.sendSync('getpdf', file )
            let url =  URL.createObjectURL(new Blob([data], {type: "application/pdf"})) 
            $("#pdfembed").attr("src", `${url}#toolbar=0&navpanes=0&scrollbar=0`)
            $("#preview").css("display","block");
            $("#preview").click(function(e) {
                    $("#preview").css("display","none");
            });
        },

        /** Converts the Editor View into a multipage PDF */
        async saveContent(backup, why) {     
            // inform mainprocess to save webcontent as pdf (see @media css query for adjustments for pdf)
            let filename = this.currentFile.replace(/\.[^/.]+$/, "")  // we dont need the extension
            ipcRenderer.send('printpdf', {clientname:this.clientname, filename: `${filename}.pdf` })
            
            if (why === "exitexam") { 
                this.$swal.fire({
                    title: this.$t("editor.leaving"),
                    text: this.$t("editor.saved"),
                    icon: "info"
                })
            }

            if (backup){
                //also save editorcontent as *html file - used to re-populate the editor window in case something went completely wrong
                let editorcontent = this.editor.getHTML(); 
                ipcRenderer.send('storeHTML', {clientname:this.clientname, editorcontent: editorcontent })
            }
            this.loadFilelist()
        },
        print(){
            var iframe = $('#pdfembed')[0]; 
            iframe.contentWindow.focus();
            iframe.contentWindow.print(); 
        },

        // show confirmation
        backup(){
            this.$swal.fire({
                title: this.$t("editor.saved"),
                icon: "info"
            })
        },
        zoomin(){
            if (this.zoom < 4) this.zoom += 0.1
            document.getElementById(`editorcontainer`).style.zoom = this.zoom
        },
        zoomout(){
            if (this.zoom > 0.5) this.zoom -= 0.1
            document.getElementById(`editorcontainer`).style.zoom = this.zoom
        },

    },
    mounted() {
        this.editor = new Editor({
            extensions: [
                Typography,
                SmilieReplacer,
                Table.configure({
                    resizable: true,
                }), 
                TableRow,
                TableCell,
                TableHeader,
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
                CharacterCount,
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
            content: ``,         
        });

       
        ipcRenderer.on('save', (event, why) => {  //trigger document save by signal "save" sent from sendExamtoteacher in communication handler
            console.log("Save event received")
            this.saveContent(true, why) 
        }); 
        ipcRenderer.on('backup', (event, filename) => {  
            console.log("Replace event received ")
            this.loadHTML(filename) 
        }); 
        ipcRenderer.on('loadfilelist', () => {  
            console.log("Reload Files event received ")
            this.loadFilelist() 
        }); 

        this.currentFile = this.clientname
        this.entrytime = new Date().getTime()
        this.saveinterval = setInterval(() => { this.saveContent() }, 20000)    // speichert content als datei
        this.fetchinfointerval = setInterval(() => { this.fetchInfo() }, 5000)      //holt client info (exam status, connection, token)
        this.clockinterval = setInterval(() => { this.clock() }, 1000)   // uhrzeit (jede sekunde)
        this.loadFilelist()
    },
    beforeUnmount() {
        this.editor.destroy()
        clearInterval( this.saveinterval )
        clearInterval( this.fetchinfointerval )
        clearInterval( this.clockinterval )
    },
}
</script>

<style lang="scss">

@media print {  //this controls how the editor view is printed (to pdf)
    
    #editortoolbar, #editorheader {
        display: none !important;
    }

    #statusbar {
        position: relative !important;
        box-shadow: 0px 0px 0px transparent !important;
        background-color: white !important;
        border-top: 1px solid black !important;
    }

    #editorcontainer {
        width: 100% !important;
        margin: 0px !important;
        border-radius:0px !important;
        background-color: white !important;
        overflow: hidden !important;
    }

    #editormaincontainer {
        overflow: hidden !important;
        margin: 0 !important;
        border-radius:0px !important;
        background-color: white !important;
    }
    #vueexambody {
        overflow: hidden !important;
        height: 100% !important;
        border-radius:0px !important;
     
    }

    #app {
        display:block !important;
        height: 100% !important;
        overflow: hidden !important;
          
    }

    .ProseMirror{
        padding: 4px !important;
        border-radius: 0 !important; 
        outline: 0 !important;
        overflow: hidden !important;
        margin-right: 40px;
    }

    ::-webkit-scrollbar {
                display: none;
            }

   // p { page-break-after: always; }
    .footer { position: fixed; bottom: 0px; }

    .zoombutton, #preview {
       display:none !important;
    }

    .swal2-container, .swal2-center, .swal2-backdrop-show , .swal2-popup, .swal2-modal, .swal2-icon-info, .swal2-show {
        display:none !important;
    }

}

#editorcontainer {
    border-radius:0; 
    margin-top:20px; 
    width: 90vw; 
    margin-left:5vw;
}

#statusbar {
    position: fixed;
    bottom:0px; 
    width:100%; 
    height: 28px; 
    background-color: #eeeefa;
    padding: 2px;
    padding-left:6px;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2);
    font-size:0.9em;
}
.zoombutton {
    height:24px;
    float:right;
    cursor: pointer;
   
}
.zoombutton:hover {
    filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(82%) contrast(119%);
}

.swal2-container.swal2-backdrop-show {
    z-index: 1000000;
}



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


/* Basic editor styles */

.ProseMirror {
    min-height: 40vh;
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


/* Table-specific styling */
.ProseMirror {
  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;

    td,
    th {
      min-width: 1em;
      border: 2px solid #ced4da;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
      background-color: #f1f3f5;
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: "";
      left: 0; right: 0; top: 0; bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: #adf;
      pointer-events: none;
    }

    p {
      margin: 0;
    }
  }
}

.tableWrapper {
  overflow-x: auto;
}

.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}


</style>
