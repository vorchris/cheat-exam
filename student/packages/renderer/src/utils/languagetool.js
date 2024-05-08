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

  
    let eye = document.getElementById('eye')
    if (ltdiv && ltdiv.style.right == "0px"){
        ltdiv.style.right = "-282px";
        ltdiv.style.boxShadow = "-2px 1px 2px rgba(0,0,0,0)";
    }

    eye.classList.add('eyeopen');
    eye.classList.add('darkgreen');
    eye.classList.remove('eyeclose');
    eye.classList.remove('darkred');

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
    let ltdiv = document.getElementById(`languagetool`)
    let eye = document.getElementById('eye')
   
    if (this.LTactive){
        this.LTdisable()
        return 
    }
    else {
        ltdiv.style.right = "0px"
        ltdiv.style.boxShadow = "-2px 1px 2px rgba(0,0,0,0.2)"; 
        eye.classList.remove('eyeopen');
        eye.classList.remove('darkgreen');
        eye.classList.add('eyeclose');
        eye.classList.add('darkred');
        this.LTactive = true;
    }



    if (this.text.length == 0) { 
        this.LTinfo = "keine Fehler gefunden"
        return; 
    }

    //request LanguageTool API
    this.LTinfo = "searching..."

    fetch(`https://${this.serverip}:${this.serverApiPort}/server/control/languagetool/${this.servername}/${this.token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: this.text, language: this.serverstatus.spellchecklang })
    })
    .then(response => response.json())
    .then(async (data) => {
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
        let positions = await this.LTfindWordPositions();  //finde wörter im text und erzeuge highlights
        this.LThighlightWords(positions)

    })
    .catch(async (error) => {
        console.warn('languagetool.js @ LTcheckAllwords (catch):', error.message)  
         // FALLBACK to HUNSPELL if LanguageTool (Next-Exam-Teacher) is not reachable
        const hunspelldata = ipcRenderer.sendSync('checktext', this.text);
        this.LThandleMisspelled("hunspell", hunspelldata) 

        this.LTinfo = "closing..."
        let positions = await this.LTfindWordPositions();  //finde wörter im text und erzeuge highlights
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
            return true; // Entferne dieses Match, da das Wort bereits vorhanden ist
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




async function LTfindWordPositionsOld() {
    if (!this.misspelledWords || !this.textContainer || this.misspelledWords.length == 0) {  return;}
    const nodeIterator = document.createNodeIterator(this.textContainer, NodeFilter.SHOW_TEXT);
    let textNode;

    const wordsMap = new Map(); // Speichert alle Vorkommen jedes Wortes
  
    while ((textNode = nodeIterator.nextNode())) {   // Durchlaufe alle Textknoten und sammle Vorkommen der zu markierenden Wörter
        const text = textNode.nodeValue;
        let nodeoffset = this.text.indexOf(text)  // wir brauchen den genauen offset dieses textknotens - addieren den offset des worts innerhalb des textknotens

        this.misspelledWords.forEach(word => {
            if (word.rule.issueType == "typographical") { word.color = "rgba(146, 43, 33 , 0.3)"; }
            else if (word.rule.issueType == "whitespace") { word.color = "rgba( 243, 190, 41, 0.5)"; word.whitespace = true;}
            else if (word.rule.issueType == "misspelling") { word.color = "rgba( 211, 84, 0, 0.3)"; }
            else { word.color = "rgba( 108, 52, 131, 0.3)"; }

            //suche auch nach "  " (zwei leerzeichen) ansonsten nach dem wort
            const pattern = word.wrongWord.trim() === '' ? '\\s\\s+' : `(?<!\\w)${word.wrongWord}(?!\\w)`;
            const regex = new RegExp(pattern, 'g');

            let match;
            while ((match = regex.exec(text)) !== null) {
                const currentOffset = nodeoffset + match.index;  // hier berechnen wir den lokalen offset des wortes für den vergleich
                if (this.hunspellFallback){ word.offset =  currentOffset}  //hunspell doesn't deliver offsets
                // nur wenn der offset des gefunden worts auch in etwa dem offset im text von languagetool entspricht wird das wort aufgenommen - (wort am satzanfang möglicherweise falsch aber im text nicht)
                if (this.hunspellFallback || Math.abs(word.offset - currentOffset) <= 10) { // Erlaube eine kleine Abweichung des wort-offsets
                    const wordKey = `${word.wrongWord}_${word.offset}`; // Eindeutiger Schlüssel pro word und offset
                    if (!wordsMap.has(wordKey)) { wordsMap.set(wordKey, { word, occurrences: [] });  }
                    wordsMap.get(wordKey).occurrences.push({ node: textNode, index: match.index });
                }
            }
        });
    }

    const positions = [];
    wordsMap.forEach((data, wordKey) => {   // Zugriff auf das `word` Objekt und die Vorkommen
        const { word, occurrences } = data;

        if (occurrences.length && occurrences.length == 0){ this.LTdisable(); return;}  // text deleted.. this.misspelledWords still populated
        occurrences.forEach(({ node, index }) => {
            const range = document.createRange();
            range.setStart(node, index);
            range.setEnd(node, index + word.wrongWord.length);
            const rects = range.getClientRects();
            if (rects.length > 0) {
                // Verarbeitung der rects und Hinzufügen in `positions` ohne Duplikate
                Array.from(rects).forEach(rect => {
                    const newPosition = {
                        left: rect.left,
                        top: rect.top,
                        width: rect.width,
                        height: rect.height,
                        word: word.wrongWord,
                        color: word.color,
                        textoffset: word.offset
                    };
                
                    word.rect = newPosition  //try to save position on word itself - doesnt work because of weird nodes that are ignored when something is pasted into the editor - WTF?

                    if (isUnique(newPosition, positions)) {
                        positions.push(newPosition);
                    }
                });



            }
        });
    });
    return positions
}





async function LTfindWordPositions() {
    if (!this.misspelledWords || !this.textContainer || this.misspelledWords.length === 0) {
        return [];
    }
    this.misspelledWords.forEach(word => {
        word.position=null // reset and search again
     })


    // Vorbereiten des Node Iterators
    const nodeIterator = document.createNodeIterator(this.textContainer, NodeFilter.SHOW_TEXT);
    let textNode;


    // Durchlaufe alle Textknoten
    while ((textNode = nodeIterator.nextNode())) {
        const text = textNode.nodeValue;
     
        this.misspelledWords.forEach(word => {
            
            // Setze Farben basierend auf dem Issue Typ
            if (word.rule.issueType === "typographical") { word.color = "rgba(146, 43, 33 , 0.3)"; }
            else if (word.rule.issueType === "whitespace") { word.color = "rgba(243, 190, 41, 0.5)"; word.whitespace = true; }
            else if (word.rule.issueType === "misspelling") { word.color = "rgba(211, 84, 0, 0.3)"; }
            else { word.color = "rgba(108, 52, 131, 0.3)"; }

            // Erstelle Regex für das Wort
            const pattern = word.wrongWord.trim() === '' ? '\\s\\s+' : `(?<!\\w)${word.wrongWord}(?!\\w)`;
            const regex = new RegExp(pattern, 'g');

            // Durchsuche den Text der aktuellen (text)Node nach diesem Wort
            let match;
            while ((match = regex.exec(text)) !== null) {
                const range = document.createRange();
                range.setStart(textNode, match.index);
                range.setEnd(textNode, match.index + word.wrongWord.length);
                const rects = range.getClientRects(); // Positionsinformationen des Textes

                Array.from(rects).forEach(rect => {
                    const newPosition = {
                        left: rect.left,
                        top: rect.top,
                        width: rect.width,
                        height: rect.height,
                    };
              
                    if (isUnique(newPosition, word, this.misspelledWords)) {  // Prüfe, ob die Position einzigartig ist
                        if (!word.position) {
                            word.position = newPosition;  // Speichere Position, wenn noch keine vorhanden ist
                            word.range = range
                        }
                    }

                });
            }
        });
    }

}
function isUnique(position, currentWord, allWords) {
    // Check if any word already has this exact position
    const alreadyTaken = allWords.some(word => 
        word !== currentWord && 
        word.position && 
        word.position.left === position.left && 
        word.position.top === position.top 
       
    );
    return !alreadyTaken;
}







function LThighlightWords() {
    if (!this.textContainer || this.misspelledWords.length == 0){  this.LTdisable(); return }
    this.canvas.width = this.textContainer.offsetWidth;
    this.canvas.height = this.textContainer.offsetHeight;
    this.canvas.style.top = this.textContainer.offsetTop + 'px';
    this.canvas.style.left = this.textContainer.offsetLeft + 'px';
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Vorheriges Highlighting löschen
    
    this.misspelledWords.forEach(word => {
        let height = 3
        let translate = word.position.height
        if (this.currentLTword && word.position.top == this.currentLTword.position.top){ height= height+word.position.height+3; translate = -3; }
        const adjustedLeft = word.position.left - this.textContainer.offsetLeft + window.scrollX;
        const adjustedTop = word.position.top - this.textContainer.offsetTop + window.scrollY;
        this.ctx.fillStyle = word.color; // Farbe und Transparenz des Highlights
        this.ctx.fillRect(adjustedLeft, adjustedTop+translate, word.position.width, height); // Angepasste Position und Größe
    });
}
    





export { LTcheckAllWords, LTfindWordPositions, LThighlightWords, LTdisable, LThandleMisspelled }