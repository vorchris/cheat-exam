async function checkAllWords(){
    const text = this.editor.getText()
    const response = ipcRenderer.sendSync('checktext', text);
    const misspelledWords = response.misspelledWords;
    console.log(text)
    console.log(misspelledWords)
    if (!misspelledWords.length) {  // no misspelled words .. make sure to remove all markers
            this.removeAllHighlightsByClass()
            return;
    }
    this.highlightMisspelledWords(misspelledWords)
}


async function checkSelectedWords() {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const fragment = range.cloneContents();
    const div = document.createElement('div');
    div.appendChild(fragment);
    const selectedText = div.textContent || div.innerText;
    // Send to backend if text is selected
    if (selectedText) {
        let response = ipcRenderer.sendSync('checktext', selectedText);
        const misspelledWords = response.misspelledWords;
        if (!misspelledWords.length) {  // no misspelled words .. make sure to remove all markers 
            this.removeAllHighlightsByClass()
            return;
        }
        this.highlightMisspelledWords(misspelledWords)
    }
}

async function highlightMisspelledWords(misspelledWords) {
    // get current editor content
    let html = this.editor.getHTML()  
    // Remove all previous highlights
    html = this.removeElementsByClassFromString(html, ".NXTEhighlight")
    misspelledWords.forEach(word => {
        console.log(word)
        //const regex = new RegExp(`(?<=^|\\W)${word}(?=$|\\W)`, 'g');
        const regex = new RegExp(`(?<=^|[^a-zA-ZäöüÄÖÜéèêëôûüÔÛÜáíóúñÁÍÓÚÑàèéìòùÀÈÉÌÒÙ])${word}(?=$|[^a-zA-ZäöüÄÖÜéèêëôûüÔÛÜáíóúñÁÍÓÚÑàèéìòùÀÈÉÌÒÙ])`, 'g');

        let insideTag = false;
        html = html.replace(regex, (match, offset, fullString) => {
            const prefix = fullString.lastIndexOf('<', offset);
            const suffix = fullString.indexOf('>', offset);
            // Check if we're inside an HTML tag (some real words are also html tags - we need to capture that edge case)
            for(let i = offset; i >= 0; i--){
                if (fullString[i] === '<') { insideTag = true;  break;  }
                if (fullString[i] === '>') { insideTag = false; break;  }
            }
            // If inside a tag this is not a word we need to correct or highlight, skip this match
            if (insideTag) return match;
            //  If within a tag with an id that starts with NXTEhighlight... skip
            if (prefix > -1 && suffix > -1 && prefix < suffix) {
                const tagContent = fullString.substring(prefix + 1, suffix);
                // Check if 'span' and 'id=NXTEhighlight' appear within the same opening tag
                if (/^span[^>]*id=['"]NXTEhighlight-/.test(tagContent)) { return match; }   //this is already highlighted - return match only without additional span elements
            }
            return `<span class='NXTEhighlight' id='NXTEhighlight-${this.uuidv4()}'>${match}</span>`;
        });
    });
    this.editor.commands.clearContent(true)  //clear edtior
    this.editor.commands.insertContent(html)  // set editor content - with our span elements that highlight errors  (we use insertContent instead of setContent because setContent removes spaces)
}

function getWord(event) {
    event.preventDefault(); // Prevent default context menu
    //const editor = document.getElementById('editor'); // Get div element by ID
    const tmpRange = document.caretRangeFromPoint(event.clientX, event.clientY);  // Temporary range for getting caret position
    // Get the text from the editor
   // const editorText = editor.textContent || editor.innerText;
    const offset = tmpRange.startOffset;
    const textNode = tmpRange.startContainer;
    const nodeText = textNode.textContent || "";
    // Regex to match word characters and adjacent punctuation
    const wordWithPunctRegex = /[\w]+[\.,;!?]?$/;
    // Extract the word surrounding the caret position with punctuation
    const leftTextMatch = nodeText.slice(0, offset).match(wordWithPunctRegex);
    const leftText = leftTextMatch ? leftTextMatch[0] : "";
    const rightText = nodeText.slice(offset).split(/\s|[\.,;!?]/)[0];
    this.word = leftText + rightText;
    // Update the currentRange to include adjacent punctuation
    const startOffset = Math.max(offset - leftText.length, 0);
    const endOffset = Math.min(offset + rightText.length, nodeText.length);

    this.currentRange = document.createRange();
    this.currentRange.setStart(textNode, startOffset);
    this.currentRange.setEnd(textNode, endOffset);
    
    if (this.word) {
        let response = ipcRenderer.sendSync('checkword', this.word);
        if (response.suggestions === null) {
            console.log(`no suggestions for >>${this.word}<<`);
            return;
        }
        this.showSuggestions(event.clientX, event.clientY, response.suggestions);
        console.log(response);
    }
}


import { Node, mergeAttributes } from '@tiptap/core'

// in order to insert <span> elemnts (used for highlighting misspelled words) we need our own tiptap extenison
const CustomSpan = Node.create({
    name: 'customSpan',
    addOptions: {        HTMLAttributes: {},    },
    inline: true,
    group: 'inline',
    atom: false,
    content: 'inline*',
    addAttributes() {
        return {
        id: {
            default: null,
            parseHTML: element => ( element.getAttribute('id')),
            renderHTML: attributes => ({  id: attributes.id }),
        },
        class: {
            default: null,
            parseHTML: element => ( element.getAttribute('class')),
            renderHTML: attributes => ({ class: attributes.class }),
        },
        }
    },
    parseHTML() { return [ { tag: 'span', }, ] },
    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes), 0]
    },
})


 // Function to display suggestions
 function showSuggestions(x, y, suggestions) {
    const menu = document.getElementById("suggestion-menu");
    menu.style.display = "block";
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    // Clear existing menu items
    menu.innerHTML = '';
    // Populate new suggestions
    suggestions.forEach(suggestion => {
        const item = document.createElement("div");
        item.innerHTML = suggestion;
        item.onclick = () => { 
            // Do something with the clicked suggestion
            console.log(`Clicked suggestion: ${suggestion}`);
            this.replaceWord(suggestion);
            menu.style.display = "none"; // Hide menu after selection
        };
        menu.appendChild(item);
    });
}


function replaceWord(suggestion) {
    if (this.currentRange) {
        const { startContainer, startOffset, endOffset } = this.currentRange;
        // Extract word boundaries using regex to consider special characters
       // const regex = /(?<=^|\W)[a-zA-ZäöüÄÖÜ]+(?=\W|$)/g;
        const regex = /(?<=^|\W)[a-zA-ZäöüÄÖÜéèêëôûüÔÛÜáíóúñÁÍÓÚÑàèéìòùÀÈÉÌÒÙ]+(?=\W|$)/g;   //for all languages
        let match;
        let startWordOffset = 0, endWordOffset = 0;

        while (match = regex.exec(startContainer.textContent)) {
            if (startOffset <= match.index + match[0].length && endOffset >= match.index) {
                startWordOffset = match.index;
                endWordOffset = match.index + match[0].length;
                break;
            }
        }
        // Replace the word
        const beforeWord = startContainer.textContent.substring(0, startWordOffset);
        const afterWord = startContainer.textContent.substring(endWordOffset);
        startContainer.textContent = beforeWord + suggestion + afterWord;
        // Update the range to select the newly inserted word
        this.currentRange.setStart(startContainer, startWordOffset);
        this.currentRange.setEnd(startContainer, startWordOffset + suggestion.length);
        // Try to locate the highlight span by its unique ID
        const wordRange = document.createRange();
        wordRange.setStart(this.currentRange.startContainer, this.currentRange.startOffset);
        wordRange.setEnd(this.currentRange.startContainer, this.currentRange.endOffset);
        const spanId = this.getSpanIdFromRange(wordRange);
        if (spanId) {
            this.removeHighlight(spanId);
        }
    }
}


function getSpanIdFromRange(range) {
    let node = range.startContainer;
    while (node && node.nodeType !== 1) { node = node.parentNode; }
    if (node && node.id && node.id.startsWith("NXTEhighlight-")) { return node.id;  }
    return null;
}

function removeHighlight(id) {
    const span = document.getElementById(id);
    if (span) {
        const parent = span.parentNode;
        while (span.firstChild) { parent.insertBefore(span.firstChild, span);  }
        parent.removeChild(span);
    }
}

function removeAllHighlightsByClass() {
    const editor = document.getElementById("editorcontent");
    const elements = editor.querySelectorAll('.NXTEhighlight');
    elements.forEach(element => {
        const parent = element.parentNode;
        while (element.firstChild) { parent.insertBefore(element.firstChild, element); }
        parent.removeChild(element);
    });
}


function removeElementsByClassFromString(html, classname) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const editor = doc.body;
    const elements = editor.querySelectorAll(classname);
    elements.forEach(element => {
        const parent = element.parentNode;
        while (element.firstChild) { parent.insertBefore(element.firstChild, element);  }
        parent.removeChild(element);
    });
    return editor.innerHTML;
}

// hides the spellcheck context menu
function hideSpellcheckMenu(){
    const menu = document.getElementById("suggestion-menu");
    menu.style.display = "none";
}

async function checkAllWordsOnSpacebar(event){
    if (event.data === " " || event.data === "\u00A0") { // if spacebar is hit
        try {
            const selection = window.getSelection();  // Get current selection and range
            const range = selection.getRangeAt(0);
            const marker = document.createElement('span'); // Insert marker element at cursor position
            marker.id = 'NXTEmarker';
            range.insertNode(marker);
            await new Promise(resolve => setTimeout(resolve, 0)); // wait for next tick so the node is already inserted when we check html/text for spellingmistakes
            await this.checkAllWords();  //recheck the whole text  // this funtion removes all spaces.. why?
            const newMarker = document.getElementById('NXTEmarker');
            const newRange = document.createRange(); // Create a new range object
            newRange.setStartAfter(newMarker); // Set the start and end positions to the end of the marker span
            newRange.setEndAfter(newMarker);
            newMarker.remove();// Remove the marker span
            selection.removeAllRanges(); // Remove all ranges from the selection object
            selection.addRange(newRange); // Add the new range to the selection object
        } catch (e) { console.log(e)}
    }
}




export {checkAllWordsOnSpacebar, hideSpellcheckMenu, removeElementsByClassFromString, removeAllHighlightsByClass,removeHighlight,getSpanIdFromRange, replaceWord, showSuggestions, CustomSpan, getWord ,highlightMisspelledWords ,checkAllWords, checkSelectedWords}