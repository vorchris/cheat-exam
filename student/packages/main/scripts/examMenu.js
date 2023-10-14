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



/**
 * Create a Next-Exam basic floating Menu to inject into every website in exam mode
 * This Menu could contain "allowed webpages" "battery monitor" "reconnect buttons" or other features in the future
 * use serverstatus.showExamMenu = true in order to make it visible in Editor (just here for now and completely unused atm)
 */


class ExamMenu {
    constructor () {

        this.menuHTML = `
            <div id="next-exam-menu">
                <span id="NXTEclientname"></span>@
                <span id="NXTEservername"></span>| 
                <span id="NXTEconnectionstatus"></span>
                <div id="NXTEfiles"></div>
            </div>
            <div id=NXTEpreview>
                <iframe src="" id="NXTEpdfembed"></iframe>
            </div>
            `

        this.menuCSS = `
            #next-exam-menu {
                position: fixed;
                z-index: 99999;
                left: 10px;
                top: 10px;
                background: #212529;
                padding: 5px;
                cursor: move;
                border-radius: 5px;
                box-shadow: 2px 2px 10px #000;
                padding-right: 30px;


                font-family: "Roboto",-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
                color: #6d727c;
                font-size: 14px;
       

            }
            .next-exam-button {
                margin: 2px;
                background-color: #0d6efd;
                border: 1px solid #0d6efd;
                color: white;
                border-radius: .25rem;
                cursor: pointer;
                transition: background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
            }
            .next-exam-button:hover {
                background-color: #0056b3;
                border-color: #0056b3;
            }
            #NXTEservername {
                color: white;
                margin: 0 10px 0 10px;
            }
            #NXTEclientname {
                color: white;
                margin: 0 10px 0 10px;
            }
            .NXTEgreen {
                color: #198754;
                
            }
            .NXTEred {
                color: #dc3545;
               
            }

            #NXTEpreview {
                display: none;
                position: absolute;
                top:0;
                left: 0;
                width:100vw;
                height: 100vh;
                background-color: rgba(0, 0, 0, 0.4);
                z-index:100000;
            }
            
            #NXTEpdfembed { 
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
            
            `
        
        this.injectNextExamMenu = `(function() {
            // Inject CSS
            const style = document.createElement('style');
            style.type = 'text/css';
            style.textContent = \`${this.menuCSS}\`;
            document.head.appendChild(style);
        
            // Inject HTML
            const menuHtml = \`${this.menuHTML}\`; 
            document.body.insertAdjacentHTML('afterbegin', menuHtml);
        
            // Make menu draggable
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            
            const menu = document.getElementById("next-exam-menu");
            
            menu.onmousedown = function dragMouseDown(e) {
                e.preventDefault();
                if (e.target.tagName.toLowerCase() === 'button') {  return;  }
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            };
        
            function elementDrag(e) {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                menu.style.top = (menu.offsetTop - pos2) + "px";
                menu.style.left = (menu.offsetLeft - pos1) + "px";
            }
    
            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }

            return null;
        })();  `  

        this.injectExamFunctions = `console.log('running examfunctions here') 
            function getClientInfo(){
                const response = ipcRenderer.sendSync('getinfo');
                let serverList = response.serverlist;
                let clientInfo = response.clientinfo;

                let clientspan = document.getElementById("NXTEclientname")
                if (clientspan) { clientspan.innerHTML = clientInfo.name }

                if (clientInfo.servername){ document.getElementById("NXTEservername").innerHTML = clientInfo.servername  }
                else { document.getElementById("NXTEservername").innerHTML = "Localhost" }
                
                if (clientInfo.token) {
                    document.getElementById("NXTEconnectionstatus").innerHTML = "verbunden"
                    document.getElementById("NXTEconnectionstatus").classList.add('NXTEgreen');
                    document.getElementById("NXTEconnectionstatus").classList.remove('NXTEred');
                }
                else {
                    document.getElementById("NXTEconnectionstatus").innerHTML = "Verbindung unterbrochen"
                    document.getElementById("NXTEconnectionstatus").classList.add('NXTEred');
                    document.getElementById("NXTEconnectionstatus").classList.remove('NXTEgreen');
                }
            }

            let NXTEfilelist = ""; // global filelist
            let NXTEoldfilelist = ""

            function loadFilelist(){
                NXTEfilelist = ipcRenderer.sendSync('getfiles', null)
                const filesdiv = document.getElementById('NXTEfiles');

                if (!arraysEqual(NXTEoldfilelist, NXTEfilelist)){  // something changed !
                    NXTEoldfilelist = NXTEfilelist

                    while (filesdiv.firstChild) {   // Remove all existing buttons from the div
                        filesdiv.removeChild(filesdiv.firstChild);
                    }
                
                    NXTEfilelist.forEach((file) => {  // Jeden Eintrag im Array durchgehen und einen Button hinzufügen
                        if(!file.name.endsWith(".pdf") ) {return;}
                        const button = document.createElement('button'); // Neues Button-Element erstellen
                        button.classList.add('next-exam-button');
                        button.innerHTML = file.name;
                        button.addEventListener('click', () => {  loadPDF(file.name)  });
                        filesdiv.appendChild(button); // Button zum Div hinzufügen
                    });
                }
            }


            function arraysEqual(arr1, arr2) {
                if (arr1.length !== arr2.length) return false;
                for (let i = 0; i < arr1.length; i++) {  
                    if (arr1[i].name !== arr2[i].name){ 
                        console.log(arr1[i], arr2[i])
                        return false;
                    } 
                }
                return true;
            }


            function loadPDF(file){
                let data = ipcRenderer.sendSync('getpdf', file )
                let url =  URL.createObjectURL(new Blob([data], {type: "application/pdf"})) 
                
                document.getElementById("NXTEpdfembed").setAttribute("src", ""+url+"#toolbar=0&navpanes=0&scrollbar=0")
                document.getElementById("NXTEpreview").style.display = "block";
                document.getElementById("NXTEpreview").addEventListener('click', function(e) {
                    document.getElementById("NXTEpreview").style.display = "none";
                });
            }



            setInterval(() => {
                getClientInfo();
                loadFilelist();
            }, 5000);  //fetch current clientinfo to stay up2date
            getClientInfo()

        
        
        `
        


    }
}

export default new ExamMenu()