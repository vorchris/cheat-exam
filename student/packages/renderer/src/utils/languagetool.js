/**
 * @license GPL LICENSE
 * Copyright (c) 2021 Thomas Michael Weissel
 * 
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or any later version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <http://www.gnu.org/licenses/>
 */



function LTdisable(){
    this.LTactive = false
    this.canvas = document.getElementById('highlight-layer');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Vorheriges Highlighting löschen
    let ltdiv = document.getElementById(`languagetool`)
    let ltcheck = document.getElementById('ltcheck')
    if (ltdiv && ltdiv.style.right == "0px"){
        ltdiv.style.right = "-282px";
        ltdiv.style.boxShadow = "-2px 1px 2px rgba(0,0,0,0)";
        ltcheck.innerHTML= `<img src="/src/assets/img/svg/eye-fill.svg" class="darkgreen"  width="22" height="22" > &nbsp;LanguageTool`
    }
    this.misspelledWords = []
    this.LTpositions = []
    return 
}


async function LTcheckAllWords(){
    this.textContainer =  document.querySelector('#editorcontent > div');
    this.canvas = document.getElementById('highlight-layer');
    this.ctx = this.canvas.getContext('2d');
    this.text = this.editor.getText();    //get text to check
   
    //check if lt is alread open (toggle button)
    if (this.LTactive ){    
        this.LTdisable()  // close LT sidebar
        return 
    }
    if (this.text.length == 0) { 
        this.LTinfo = "keine Fehler gefunden"
        return; 
    }

  
    //request LanguageTool API
    this.LTactive = true;
    this.LTinfo = "searching..."

    fetch(`https://${this.serverip}:${this.serverApiPort}/server/control/languagetool/${this.servername}/${this.token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: this.text, language: this.serverstatus.spellchecklang })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == "error" || !Array.isArray(data.data)){
            console.warn('languagetool.js @ LTcheckAllwords:', data.data)
            // FALLBACK to HUNSPELL if LanguageTool is not reachable
            const hunspelldata = ipcRenderer.sendSync('checktext', this.text);
            this.LThandleMisspelled("hunspell", hunspelldata)  // generiert misspelled object dass ähnlich verarbeitet werden kann wie das lt object
        }
        else {
            this.LThandleMisspelled("languagetool", data)   //bereitet die liste auf - entfernt duplikate
        }

        if (!this.misspelledWords.length) {
            this.LTinfo = "keine Fehler gefunden"
            return;
        }

        this.LTinfo = "closing..."
        let positions = this.LTfindWordPositions();  //finde wörter im text und erzeuge highlights
        this.LThighlightWords(positions)

    })
    .catch(error => {
        console.error('languagetool.js @ LTcheckAllwords:', error.message)  
         // FALLBACK to HUNSPELL if LanguageTool (Next-Exam-Teacher) is not reachable
        const hunspelldata = ipcRenderer.sendSync('checktext', this.text);
        this.LThandleMisspelled("hunspell", hunspelldata) 

        this.LTinfo = "closing..."
        let positions = this.LTfindWordPositions();  //finde wörter im text und erzeuge highlights
        this.LThighlightWords(positions)
    })
    }



function LThandleMisspelled(backend, data){
    if (backend == "hunspell"){
        this.hunspellFallback = true;
        this.misspelledWords = []
        if (data.misspelledWords){
            data.misspelledWords.forEach( word => {
                //generate LT like replacements array of objects
                let suggestions = []
                word.suggestions.forEach(sugg =>{
                    suggestions.push({value: sugg})
                } )
               

                this.misspelledWords.push( {
                    wrongWord: word.wrongWord, 
                    rule: {
                        issueType:"misspelling"
                    },
                    color: "rgba( 211, 84, 0, 0.3)",
                    replacements: suggestions
                } )
            })
        }
        else if (data.error){
            console.error("languagetool.js @ LTcheckAllwords: Hunspell backend nicht verfügbar")
            this.LTinfo = "Hunspell nicht verfügbar"
            return
        }
    }

    if (backend == "languagetool"){
        this.hunspellFallback = false;
        // Verarbeiten der Antwort, um das fehlerhafte Wort zu extrahieren und Duplikate zu entfernen
        const uniqueWords = new Set(); // Ein Set, um die Einzigartigkeit der Wörter zu gewährleisten
        this.misspelledWords = data.data.filter(match => {
            const wrongWord = this.text.substring(match.offset, match.offset + match.length);
            if (!uniqueWords.has(wrongWord)) {
                uniqueWords.add(wrongWord);
                return true; // Behalte dieses Match, da das Wort noch nicht hinzugefügt wurde
            }
            return false; // Entferne dieses Match, da das Wort bereits vorhanden ist
        }).map(match => {
            // Nachdem Duplikate entfernt wurden, füge das fehlerhafte Wort hinzu
            const wrongWord = this.text.substring(match.offset, match.offset + match.length);
            
            return {
                ...match,
                wrongWord,
            };
        });
    }
}




function LTfindWordPositions() {
    if (!this.misspelledWords || !this.textContainer || this.misspelledWords.length == 0) return;
    const nodeIterator = document.createNodeIterator(this.textContainer, NodeFilter.SHOW_TEXT);
    let textNode;

    const wordsMap = new Map(); // Speichert alle Vorkommen jedes Wortes
    while ((textNode = nodeIterator.nextNode())) {   // Durchlaufe alle Textknoten und sammle Vorkommen der zu markierenden Wörter
        const text = textNode.nodeValue;
        this.misspelledWords.forEach(word => {

            //suche auch nach "  " (zwei leerzeichen) ansonsten nach dem wort
            const pattern = word.wrongWord.trim() === '' ? '\\s\\s+' : `(?<!\\w)${word.wrongWord}(?!\\w)`;
            const regex = new RegExp(pattern, 'g');

            let match;
            while ((match = regex.exec(text)) !== null) {
                if (!wordsMap.has(word)) { wordsMap.set(word, []); }
                wordsMap.get(word).push({ node: textNode, index: match.index });
            }
        });
    }
  
    const positions = [];
    wordsMap.forEach((occurrences, word) => {   // Berechne die Positionen für jedes Wort nur einmal
        if (word.rule.issueType == "typographical") { word.color = "rgba(146, 43, 33 , 0.3)"; }
        else if (word.rule.issueType == "whitespace") { word.color = "rgba( 249, 231, 159, 0.5)";}
        else if (word.rule.issueType == "misspelling") { word.color = "rgba( 211, 84, 0, 0.3)"; }
        else { word.color = "rgba( 108, 52, 131, 0.3)"; }

        

        occurrences.forEach(({ node, index }) => {
            const range = document.createRange();
            range.setStart(node, index);
            range.setEnd(node, index + word.wrongWord.length);
            const rects = range.getClientRects();
            if (rects.length > 0) {
                positions.push(...Array.from(rects).map(rect => ({
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height,
                    word: word.wrongWord,
                    color: word.color
                })));
            }
        });
    });
    return positions
}

function LThighlightWords(positions) {
    if (!this.textContainer || !positions || positions.length == 0){ return }
    this.canvas.width = this.textContainer.offsetWidth;
    this.canvas.height = this.textContainer.offsetHeight;
    this.canvas.style.top = this.textContainer.offsetTop + 'px';
    this.canvas.style.left = this.textContainer.offsetLeft + 'px';
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Vorheriges Highlighting löschen
    
    positions.forEach(word => {
        let height = 3
        let translate = word.height
      
        if (word.word == this.currentLTword){ height= height+word.height+3; translate = -3; }

        const adjustedLeft = word.left - this.textContainer.offsetLeft + window.scrollX;
        const adjustedTop = word.top - this.textContainer.offsetTop + window.scrollY;
        this.ctx.fillStyle = word.color; // Farbe und Transparenz des Highlights
        this.ctx.fillRect(adjustedLeft, adjustedTop+translate, word.width, height); // Angepasste Position und Größe
    });
}
    





export { LTcheckAllWords, LTfindWordPositions, LThighlightWords, LTdisable, LThandleMisspelled }