 <template>
  <div class="w-100 p-3 text-white bg-dark shadow text-right">
      <router-link to="/" class="text-white m-1">
          <img src="/src/assets/img/svg/speedometer.svg" class="white me-2  " width="32" height="32" >
          <span class="fs-4 align-middle me-4 ">Next-Exam</span>
      </router-link>
      <span class="fs-4 align-middle" style="float: right">Writer</span>
  </div>



    <div id="editorcontainer">
        <div v-if="editor" class=" mb-2">
            <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" class="btn btn-outline-success p-1 me-1 mb-1">
            bold
            </button>
            <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" class="btn btn-outline-success p-1 me-1 mb-1">
            italic
            </button>
            <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }" class="btn btn-outline-success p-1 me-1 mb-1 ">
            strike
            </button>
  
            <button @click="editor.chain().focus().unsetAllMarks().run()" class="btn btn-outline-warning p-1 me-1 mb-1">
            clear marks
            </button>
            <button @click="editor.chain().focus().clearNodes().run()" class="btn btn-outline-warning p-1 me-1 mb-1">
            clear nodes
            </button>
      
     
            <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" class="btn btn-outline-info p-1 me-1 mb-1">
            h2
            </button>
            <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" class="btn btn-outline-info p-1 me-1 mb-1">
            h3
            </button>
            <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }" class="btn btn-outline-info p-1 me-1 mb-1">
            h4
            </button>
            <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }" class="btn btn-outline-info p-1 me-1 mb-1">
            h5
            </button>
    
            <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }" class="btn btn-outline-info p-1 me-1 mb-1">
            bullet list
            </button>
            <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }" class="btn btn-outline-info p-1 me-1 mb-1">
            ordered list
            </button>
            <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }" class="btn btn-outline-secondary p-1 me-1 mb-1">
            code block
            </button>
            <button @click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }" class="btn btn-outline-secondary p-1 me-1 mb-1 ">
            code
            </button>

            <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }" class="btn btn-outline-info p-1 me-1 mb-1">
            blockquote
            </button>
            <button @click="editor.chain().focus().setHorizontalRule().run()" class="btn btn-outline-info p-1 me-1 mb-1">
            horizontal rule
            </button>
            <button @click="editor.chain().focus().setHardBreak().run()" class="btn btn-outline-info p-1 me-1 mb-1">
            hard break
            </button>
            <button @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }" class="btn btn-outline-info p-1 me-1 mb-1 ">
            center
            </button>
            <button @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }" class="btn btn-outline-info p-1 me-1 mb-1 ">
            right
            </button>
            <button @click="editor.chain().focus().setTextAlign('justify').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }" class="btn btn-outline-info  p-1 me-1 mb-1">
            justify
            </button> 

            <button @click="editor.chain().focus().undo().run()" class="btn btn-outline-dark p-1 me-1 mb-1">
            undo
            </button>
            <button @click="editor.chain().focus().redo().run()" class="btn btn-outline-dark p-1 me-1 mb-1">
            redo
            </button>
        </div>
    
        <editor-content :editor="editor" class='p-0'/>
    </div>

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
import Strike from '@tiptap/extension-strike'
import Dropcursor from '@tiptap/extension-dropcursor'
import Gapcursor from '@tiptap/extension-gapcursor'
import History from '@tiptap/extension-history'
import { lowlight } from 'lowlight'// load all highlight.js languages


export default {
  components: {
    EditorContent,
  },

  data() {
    return {
      editor: null,
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
            Strike,
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
          this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
        </p>
        <ul>
          <li>
            That’s a bullet list with one …
          </li>
          <li>
            … or two list items.
          </li>
        </ul>
        <p>
          Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
        </p>
        <pre><code class="language-css">body {
  display: none;
}</code></pre>
        <p>
          I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
        </p>

      `,
    })
  },

  beforeUnmount() {
    this.editor.destroy()
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
