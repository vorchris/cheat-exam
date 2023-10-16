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
                <span id="NXTEHeader">Next-Exam</span> | 

                <span id="NXTEclientname"></span>@
                <span id="NXTEservername"></span>| 
                <span id="NXTEconnectionstatus"></span>
                <div id="NXTEexit" class="next-exam-button-default next-exam-button-danger"  style="display:none"  onclick="gracefullyexit()">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="22" height="22">
                        <path style="fill:currentColor;fill-opacity:1;stroke:none" d="M16 4A12 12 0 0 0 7.886719 7.179688L7.885 7.178A12 12 0 0 0 7.847656 7.214844 12 12 0 0 0 4 16 12 12 0 0 0 16 28 12 12 0 0 0 24.11328 24.820312L24.12 24.822A12 12 0 0 0 24.15234 24.785156 12 12 0 0 0 28 16 12 12 0 0 0 16 4M16 5A11 11 0 0 1 27 16 11 11 0 0 1 24.11523 23.408203L8.592 7.885A11 11 0 0 1 16 5M7.885 8.592L23.408 24.12A11 11 0 0 1 16 27 11 11 0 0 1 5 16 11 11 0 0 1 7.884766 8.591797" />
                    </svg>
                    entsperren 
                 </div>
                 <br>
                 <div id="NXTEtools" style="display: inline-block;">
                    <button id="NXTEprint" class="next-exam-button-default next-exam-button-black" onclick="nxtePrint()">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height="22" width="22">
                            <path style="fill:white;fill-opacity:1;"  d="m7 4v8h-3v12h6v4h12v-4h6v-12h-3v-8zm1 1h16v7h-16zm2 2v1h12v-1zm0 3v1h12v-1zm-5 3h22v10h-3v-4h-16v4h-3zm17 2v1h4v-1zm-11 9h10v3h-10z" class="ColorScheme-Text" />
                        </svg>
                    </button>
                </div>
                <div id="NXTEfiles" style="display: inline-block;"></div>
            </div>

            <div id=NXTEpreview>
                <iframe src="" id="NXTEpdfembed"></iframe>
            </div>

            <div id="custom-swal-overlay" class="custom-swal-overlay" style="display:none;">
                <div class="custom-swal">
                <p class="custom-swal-text" id="swal-text">Verlassen Sie den abgesicherten Modus nie ohne Freigabe einer Lehrperson.</p>
                <div class="custom-swal-buttons">
                    <button id="NXTEswalok" class="next-exam-button-default next-exam-button-danger">OK</button>
                    <button id="NXTEswalcancel" class="next-exam-button-default next-exam-button-black">Abbrechen</button>
                </div>
                </div>
            </div>
          


            `

        this.menuCSS = `
            #NXTEheader {

            }
            #next-exam-menu {
                min-width:300px;
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
            .next-exam-button-default {
                height: 30px;
                display: inline-block;
                font-weight: 400;
                line-height: 1.5;
                color: #212529;
                text-align: center;
                text-decoration: none;
                vertical-align: middle;
                cursor: pointer;
                -webkit-user-select: none;
                -moz-user-select: none;
                user-select: none;
                background-color: transparent;
                border: 1px solid transparent;
                padding: 0 4px 0 4px;
                margin: 6px 2px 2px 0px;
             
                border-radius: .25rem;
                transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
            }
            .next-exam-button-danger {
                color: #fff;
                background-color: #dc3545;
                border-color: #dc3545;
            }
            .next-exam-button-danger:hover {
                color: #fff;
                background-color: #bb2d3b;
                border-color: #b02a37;
            }
            .next-exam-button-blue {
                background-color: #0d6efd;
                border: 1px solid #0d6efd;
                color: white;
            }
            .next-exam-button-blue:hover {
                background-color: #0056b3;
                border-color: #0056b3;
            }

            .next-exam-button-black {
                background-color: #151616;
                border: 1px solid #151616;
                color: white;
            }
            .next-exam-button-black:hover {
                background-color: #1c1f23;
                border-color: #1c1f23;
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
            

            .custom-swal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.4);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            
            .custom-swal {
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                width: 300px;
                text-align: center;
                box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                font-family: "Roboto",-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
                color: #6d727c;
                font-size: 14px;
            }
            
            .custom-swal-text {
                margin-bottom: 20px;
            }
            
            .custom-swal-buttons {
                display: flex;
                justify-content: space-between;
            }
            .custom-swal-buttons .next-exam-button-default{
                min-width:100px;
            }
              
            `
        
        this.injectNextExamMenu = `console.log('injecting exammenu...'); 

            (function() {
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

        this.injectExamFunctions = `console.log('injecting examfunctions...') 

            let NXTEunlocked = false;

            function gracefullyexit(){

                const swalOverlay = document.getElementById('custom-swal-overlay');
                const okButton = document.getElementById('NXTEswalok');
                const cancelButton = document.getElementById('NXTEswalcancel');
             
                // Show the dialog
                swalOverlay.style.display = 'flex';

                // Attach event listeners
                okButton.addEventListener('click', function() {
                    swalOverlay.style.display = 'none';
                    document.getElementById("NXTEexit").style.display = "none"
                    ipcRenderer.send('gracefullyexit');
                    NXTEunlocked = true;
                });

                cancelButton.addEventListener('click', function() {
                    swalOverlay.style.display = 'none';
                });
            }

            function getClientInfo(){
                const response = ipcRenderer.sendSync('getinfo');
                let serverList = response.serverlist;
                let clientInfo = response.clientinfo;

                
                if (clientInfo.examtype !== "microsoft365") {  //we cant print eduvidual or googleforms
                    document.getElementById("NXTEprint").style.display = "none"
                }

                let clientspan = document.getElementById("NXTEclientname")
                if (clientspan) { clientspan.innerHTML = clientInfo.name }

                if (clientInfo.servername){ document.getElementById("NXTEservername").innerHTML = clientInfo.servername  }
                else { document.getElementById("NXTEservername").innerHTML = "Localhost" }
                
                if (clientInfo.token) {
                    document.getElementById("NXTEconnectionstatus").innerHTML = "verbunden"
                    document.getElementById("NXTEconnectionstatus").classList.add('NXTEgreen');
                    document.getElementById("NXTEconnectionstatus").classList.remove('NXTEred');
                    document.getElementById("NXTEexit").style.display = "none"
                    NXTEunlocked = false;
                }
                else {  //offline
                    document.getElementById("NXTEconnectionstatus").innerHTML = "Verbindung unterbrochen"
                    document.getElementById("NXTEconnectionstatus").classList.add('NXTEred');
                    document.getElementById("NXTEconnectionstatus").classList.remove('NXTEgreen');
                    if (!NXTEunlocked){
                        document.getElementById("NXTEexit").style.display = "block"
                    }
                    
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
                        button.classList.add('next-exam-button-default');
                        button.classList.add('next-exam-button-blue');
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

            function nxtePrint(){

                const swalOverlay = document.getElementById('custom-swal-overlay');
                const okButton = document.getElementById('NXTEswalok');
                const cancelButton = document.getElementById('NXTEswalcancel');
             
                document.getElementById("swal-text").innerHTML = "Druckanfrage senden?"

                // Show the dialog
                swalOverlay.style.display = 'flex';

                // Attach event listeners
                okButton.addEventListener('click', function() {
                    swalOverlay.style.display = 'none';
                    document.getElementById("NXTEexit").style.display = "none"
                   
                    ipcRenderer.send('sendPrintRequest') 
                 
                });

                cancelButton.addEventListener('click', function() {
                    swalOverlay.style.display = 'none';
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