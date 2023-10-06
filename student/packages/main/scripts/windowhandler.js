
import { app, BrowserWindow, dialog, Menu, MenuItem, screen} from 'electron'
import { join } from 'path'
import {disableRestrictions, enableRestrictions} from './platformrestrictions.js';

import playSound from 'play-sound';
const sound = playSound({});

  ////////////////////////////////////////////////////////////
 // Window handling (ipcRenderer Process - Frontend) START
////////////////////////////////////////////////////////////


class WindowHandler {
    constructor () {
      this.blockwindows = []
      this.screenlockWindow = null
      this.mainwindow = null
      this.examwindow = null
      this.config = null
      this.multicastClient = null
    }

    init (mc, config) {
        this.multicastClient = mc
        this.config = config
    }

    // return electron window in focus or an other electron window depending on the hierachy
    getCurrentFocusedWindow() {
        const focusedWindow = BrowserWindow.getFocusedWindow();
        if (focusedWindow) {
          return focusedWindow
        } else {
            if (this.screenlockWindow){return this.screenlockWindow}
            else if (this.examwindow){return this.examwindow}
            else if (this.mainwindow){return this.mainwindow}
            else { return false }
        }
    }


    /**
     * BlockWindow (to cover additional screens)
     * @param display 
     */

    newBlockWin(display) {
        let blockwin = new BrowserWindow({
            x: display.bounds.x + 0,
            y: display.bounds.y + 0,
            parent: this.examwindow,
            skipTaskbar:true,
            title: 'Next-Exam',
            width: display.bounds.width,
            height: display.bounds.height,
            closable: false,
            alwaysOnTop: true,
            focusable: false,   //doesn't work with kiosk mode (no kiosk mode possible.. why?)
            minimizable: false,
            // resizable:false,   // leads to weird 20px bottomspace on windows
            movable: false,
            icon: join(__dirname, '../../public/icons/icon.png'),
            webPreferences: {
                preload: join(__dirname, '../preload/preload.cjs'),
            },
        });
    
        let url = "notfound"
        if (app.isPackaged) {
            let path = join(__dirname, `../renderer/index.html`)
            blockwin.loadFile(path, {hash: `#/${url}/`})
        } 
        else {
            url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}/#/${url}/`
            blockwin.loadURL(url)
        }
        
        blockwin.removeMenu() 
        blockwin.setKiosk(true)
        blockwin.setAlwaysOnTop(true, "screen-saver", 1) 
        blockwin.show()
        blockwin.moveTop();
        this.blockwindows.push(blockwin)
    }


    /**
     * Screenlock Window (to cover the mainscreen) - block students from working
     * @param display 
     */

    createScreenlockWindow(display) {
        this.screenlockWindow = new BrowserWindow({
            show: false,
            x: display.bounds.x + 0,
            y: display.bounds.y + 0,
            // parent: this.mainwindow,   // leads to visible titlebar in gnome-desktop
            skipTaskbar:true,
            title: 'Screenlock',
            width: display.bounds.width,
            height: display.bounds.height,
            closable: false,
            alwaysOnTop: true,
            //focusable: false,   //doesn't work with kiosk mode (no kiosk mode possible.. why?)
            minimizable: false,
            // resizable:false, // leads to weird 20px bottomspace on windows
            movable: false,
            icon: join(__dirname, '../../public/icons/icon.png'),
            webPreferences: {
                preload: join(__dirname, '../preload/preload.cjs'),
            },
        });

        let url = "lock"
        if (app.isPackaged) {
            let path = join(__dirname, `../renderer/index.html`)
            this.screenlockWindow.loadFile(path, {hash: `#/${url}/`})
        } 
        else {
            url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}/#/${url}/`
            this.screenlockWindow.loadURL(url)
        }

        if (this.config.showdevtools) { this.screenlockWindow.webContents.openDevTools()  }

        this.screenlockWindow.once('ready-to-show', () => {
            this.screenlockWindow.removeMenu() 
           
            this.screenlockWindow.setMinimizable(false)
            this.screenlockWindow.setKiosk(true)
            this.screenlockWindow.setAlwaysOnTop(true, "screen-saver", 1) 
            this.screenlockWindow.show()
            this.screenlockWindow.moveTop();
            this.screenlockWindow.setClosable(true)
            this.addBlurListener("screenlock")
        })

        this.screenlockWindow.on('close', async  (e) => {   // window should not be closed manually.. ever! but if you do make sure to clean examwindow variable and end exam for the client
            if (!this.config.development) { e.preventDefault(); }  
        });
    }




    /**
     * Examwindow
     * @param examtype eduvidual, math, language
     * @param token student token
     * @param serverstatus the serverstatus object containing info about spellcheck language etc. 
     */
    async createExamWindow(examtype, token, serverstatus, primarydisplay) {
        // just to be sure we check some important vars here
        if (examtype !== "gforms" && examtype !== "eduvidual" && examtype !== "editor" && examtype !== "math" && examtype !== "microsoft365" || !token){  // for now.. we probably should stop everything here
            console.log("missing parameters for exam-mode or mode not in allowed list!")
            examtype = "editor" 
        } 
        
        let px = 0
        let py = 0
        if (primarydisplay && primarydisplay.bounds && primarydisplay.bounds.x) {
            px = primarydisplay.bounds.x
            py = primarydisplay.bounds.y
        }

        this.examwindow = new BrowserWindow({
            x: px + 0,
            y: py + 0,
            // parent: win,  //this doesnt work together with kiosk on ubuntu gnome ?? wtf
            // modal: true,  // this blocks the main window on windows while the exam window is open
            skipTaskbar:true,
            title: 'Exam',
            width: 800,
            height: 600,
            // closable: false,  // if we can't define 'parent' this window has to be closable - why?
            alwaysOnTop: true,
            show: false,
            icon: join(__dirname, '../../public/icons/icon.png'),
            webPreferences: {
                preload: join(__dirname, '../preload/preload.cjs'),
                spellcheck: true,  
            },
        });

        /**
         * Create a Next-Exam basic floating Menu to inject into every website in exam mode
         * This Menu could contain "allowed webpages" "battery monitor" "reconnect buttons" or other features in the future
         * use serverstatus.showExamMenu = true in order to make it visible in Editor (just here for now)
         */

        serverstatus.showExamMenu = false

        this.menuHTML = `<div id="next-exam-menu">
            <button class="next-exam-button" id="button1">Button 1</button>
            <button class="next-exam-button" id="button2">Button 2</button>
            </div>`
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
            }
            .next-exam-button {
                background-color: #0d6efd;
                border: 1px solid #0d6efd;
                color: white;
                padding: .375rem .75rem;
                border-radius: .25rem;
                font-size: 1rem;
                line-height: 1;
                cursor: pointer;
                transition: background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
              }
              .next-exam-button:hover {
                background-color: #0056b3;
                border-color: #0056b3;
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

            // Button event listeners
            const button1 = document.getElementById("button1");
            const button2 = document.getElementById("button2");

      
            button1.addEventListener('click', function() {
                console.log('hello exam!')
            });

            button2.addEventListener('click', function() {
                console.log('hello next-exam!')
            });

            return null;
          })();
        `
        this.injectExamFunctions = `  `
        
    
        // Load correct url 
        if (examtype === "eduvidual"){    //external page
            if (serverstatus.moodleDomain === "eduvidual.at"){
                let url =`https://eduvidual.at/mod/${serverstatus.moodleTestType}/view.php?id=${serverstatus.testid}`    // https://www.eduvidual.at/mod/quiz/view.php?id=4172287  
                this.examwindow.loadURL(url)
            }
            else {
                let url =`https://${serverstatus.moodleDomain}/mod/${serverstatus.moodleTestType}/view.php?id=${serverstatus.testid}`    // https://www.eduvidual.at/mod/quiz/view.php?id=4172287  
                this.examwindow.loadURL(url)
            }
        }
        else if (examtype === "gforms"){    //external page
            let url =`https://docs.google.com/forms/d/e/${serverstatus.gformsTestId}/viewform`  //https://docs.google.com/forms/d/e/1FAIpQLScuTG7yldD0VRhFgOC_2fhbVdgXn95Kf_w2rUbJm79S1kJBnA/viewform
            this.examwindow.loadURL(url)
        }
        else if (examtype === "microsoft365"  ) { //external page
            console.log("starting microsoft365 exam...")
            let url = this.multicastClient.clientinfo.msofficeshare   
            if (!url) {// we wait for the next update tick - msofficeshare needs to be set !
                console.log("no url for microsoft365 was set")
                console.log(this.multicastClient.clientinfo)
                this.examwindow.destroy(); 
                this.examwindow = null;
                disableRestrictions()
                this.multicastClient.clientinfo.exammode = false
                this.multicastClient.clientinfo.focus = true
                return
            }
            this.examwindow.loadURL(url)
        }
        else { 
            let url = examtype   // editor || math || tbd.
            if (app.isPackaged) {
                let path = join(__dirname, `../renderer/index.html`)
                this.examwindow.loadFile(path, {hash: `#/${url}/${token}`})
            } 
            else {
                url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}/#/${url}/${token}/`
                this.examwindow.loadURL(url)
            }
        }

        /**
         * HANDLE SPELLCHECK 
         */ 
        if (serverstatus.spellcheck){  
            console.log(serverstatus.spellchecklang)
            this.examwindow.webContents.session.setSpellCheckerDictionaryDownloadURL(`https://${this.multicastClient.clientinfo.serverip}:${this.config.serverApiPort}/static/dicts/`)
            this.examwindow.webContents.session.setSpellCheckerLanguages([serverstatus.spellchecklang])
            if (serverstatus.suggestions){
                this.examwindow.webContents.on('context-menu', (event, params) => {
                    const menu = new Menu()
                    for (const suggestion of params.dictionarySuggestions) { // Add each spelling suggestion
                        menu.append(new MenuItem({ label: suggestion, click: () => this.examwindow.webContents.replaceMisspelling(suggestion) }))
                    }
                    menu.popup()
                })
            }
        }
        else { this.examwindow.webContents.session.setSpellCheckerLanguages([]) }


        /**
         * Handle special NAVIGATION situations
         */

        // Texteditor
        if (serverstatus.examtype === "editor" ){  // do not under any circumstances allow navigation away from the editor
            this.examwindow.webContents.on('will-navigate', (event, url) => {   
                event.preventDefault()
            })

            this.examwindow.webContents.on('did-finish-load', async () => {
                if (serverstatus.showExamMenu){  // currently showExamMenu is not set but it could be used to inject a menu into 3rd party apps
                    this.examwindow.webContents.executeJavaScript(  this.injectNextExamMenu  );
                    this.examwindow.webContents.executeJavaScript(  this.injectExamFunctions );
                }
            })
        }



        // Microsoft Excel
        if ( serverstatus.examtype === "microsoft365"){  // do not under any circumstances allow navigation away from the current exam url
            this.examwindow.officeurl = false
            
            this.examwindow.webContents.on('will-navigate', (event, url) => {
                console.log(`Student tried to navigate to: ${url}`)
                if (!this.examwindow.officeurl ) { this.examwindow.officeurl = url }
                if (url !== this.examwindow.officeurl ) {
                    console.log("do not navigate away from this test.. ")
                    event.preventDefault()
                }  
            })

            // if a new window should open triggered by window.open()
            this.examwindow.webContents.on('new-window', (event, url) => {
                event.preventDefault(); // Prevent the new window from opening
            });

            // if a new window should open triggered by target="_blank"
            this.examwindow.webContents.setWindowOpenHandler(({ url }) => {
               return { action: 'deny' }; // Prevent the new window from opening
            });


            this.examwindow.webContents.on('did-frame-finish-load', async (event, isMainFrame, frameProcessId, frameRoutingId) => { });

            // Wait until the webContents is fully loaded
            this.examwindow.webContents.on('did-finish-load', async () => {

                this.examwindow.webContents.mainFrame.frames.filter((frame) => {
                    let executeCode =  `
                            function lock(){
                                console.log("LOCKDOWN")
                                const hideus = ['WACDialogOuterContainer','WACDialogInnerContainer','WACDialogPanel','InsertAppsForOffice','FileMenuLauncherContainer','Help-wrapper','Review-wrapper','Header','FarPeripheralControlsContainer','BusinessBar','']
                                for (entry of hideus) {
                                    let element = document.getElementById(entry)
                                    if (element) { element.style.display = "none" }
                                }
                                // this button is redrawn on resize (doesn't happen in exam mode but still there must be a cleaner way - inserting css before it appears is not working)
                                let buttonAppsOverflow = document.getElementsByName('Add-Ins')[0];
                                if (buttonAppsOverflow){ buttonAppsOverflow.style.display = "none" }
                                if (buttonAppsOverflow && buttonAppsOverflow.style.display == "none" ) {   clearInterval(intervalId);   } // we need to wait for this one to show
                            }
                            
                            const intervalId = setInterval(lock, 400);
                            lock()  //for some reason excel delays that call.. doesnt happen on page finish load
                            `
                    if (frame && frame.name === 'WebApplicationFrame') {
                        frame.executeJavaScript(executeCode); 
                    }
                })
            });

            // Wait until the complete DOM is computed
            this.examwindow.webContents.on('dom-ready', () => {});


            this.examwindow.webContents.on('did-navigate', (event, url) => {  // after loading the exam excel worksheet for the first time we capture the url to lock-in students
                console.log("target reached")
                if (!this.examwindow.officeurl ) { this.examwindow.officeurl = url }           
            })
        }





        // Google Forms
        if (serverstatus.examtype === "gforms"){
            console.log("gforms mode")
            this.examwindow.webContents.on('did-navigate', (event, url) => {  //create a new div called "nextexamwarning" and "embedbackground" - this is shown onBlur()
                //console.log(url)
                this.examwindow.webContents.executeJavaScript(` 
                    const warning = document.createElement('div')
                    warning.setAttribute('id', 'nextexamwaring')
                    warning.setAttribute('style', 'display: none');
                    const background = document.createElement('div');
                    background.setAttribute('id', 'embedbackground')
                    background.setAttribute('style', 'display: none');
                    const embed = document.createElement('embed');` , true)
                    .catch(err => console.log(err))
            })
            this.examwindow.webContents.on('will-navigate', (event, url) => {  // if a resource (pdf) is openend create an embed element and embed the pdf
                //console.log(url)
                //we block everything except pages that contain the following keyword-combinations
                if (!url.includes(serverstatus.gformsTestId)){
                    console.log(url)
                    //check if this an exception (login, init) - if URL doesn't include either of these combinations - block! EXPLICIT is easier to read ;-)
                    if ( url.includes("docs.google.com") && url.includes("formResponse") )           { console.log(" url allowed") }
                    else if ( url.includes("docs.google.com") && url.includes("viewscore") )         { console.log(" url allowed") }
                    else {
                        console.log("blocked leaving exam mode")
                        event.preventDefault()
                    }
                }
                else {console.log("entered valid test environment")  }
            })

            // if a new window should open triggered by window.open()
            this.examwindow.webContents.on('new-window', (event, url) => {
                event.preventDefault(); // Prevent the new window from opening
                // Optionally, navigate to the URL in the same window
                if ( url.includes("docs.google.com") && url.includes("viewscore") )         {
                    this.examwindow.loadURL(url);
                }
            });

            // if a new window should open triggered by target="_blank"
            this.examwindow.webContents.setWindowOpenHandler(({ url }) => {
                // Optionally, navigate to the URL in the same window
                if ( url.includes("docs.google.com") && url.includes("viewscore") ) {     
                    this.examwindow.loadURL(url);
                }
                // Prevent the new window from opening
               return { action: 'deny' };
              });
        }



        // EDUVIDUAL / Moodle
        if (serverstatus.examtype === "eduvidual"){
         
            this.examwindow.webContents.on('did-navigate', (event, url) => {  //create new div elements called "nextexamwarning" and "embedbackground" and "embed"
                this.examwindow.webContents.executeJavaScript(` 
                    const warning = document.createElement('div')
                    warning.setAttribute('id', 'nextexamwaring')
                    warning.setAttribute('style', 'display: none');

                    const background = document.createElement('div');
                    background.setAttribute('id', 'embedbackground')
                    background.setAttribute('style', 'display: none');

                    const embed = document.createElement('embed');` , true)
                    .catch(err => console.log(err))
            })

            this.examwindow.webContents.on('will-navigate', (event, url) => {
                //we block everything except pages that contain the following keyword-combinations
                if (!url.includes(serverstatus.testid)){
                    console.log(url)
                    //check if this an exception (login, init) - if URL doesn't include either of these combinations - block! EXPLICIT is easier to read ;-)
                    if ( url.includes("startattempt.php") && url.includes(serverstatus.moodleDomain) )          { console.log(" url allowed") }
                    else if ( url.includes("processattempt.php") && url.includes(serverstatus.moodleDomain) )   { console.log(" url allowed") }
                    else if ( url.includes("login") && url.includes("Microsoft") )                              { console.log(" url allowed") }
                    else if ( url.includes("login") && url.includes("Google") )                                 { console.log(" url allowed") }
                    else if ( url.includes("login") && url.includes("microsoftonline") )                        { console.log(" url allowed") }
                    else if ( url.includes("accounts") && url.includes("google.com") )                          { console.log(" url allowed") }
                    else if ( url.includes("logout") && url.includes(serverstatus.moodleDomain) )               { console.log(" url allowed") }
                    else if ( url.includes("lookup") && url.includes("google") )                                { console.log(" url allowed") }
                    else if ( url.includes("login") && url.includes("eduvidual") )                              { console.log(" url allowed") }
                    else {
                        console.log("blocked leaving exam mode")
                        event.preventDefault()
                    }
                }
                else {console.log("entered valid test environment")  }

                // if a resource (pdf) is openend create an embed element and embed the pdf
                if (url.includes('resource/view')&& !url.includes('forceview')){  // embed pdfs rather than open a new window/tab
                    event.preventDefault()
                    this.examwindow.webContents.executeJavaScript(` 
                        background.onclick = function() {  document.getElementById('embedbackground').style = "display: none;" };
                        background.setAttribute('style', 'display: block; position: fixed; top:0; left: 0; width:100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.4); z-index:100000;');
                        document.body.appendChild(background); 
                        embed.setAttribute('src', '${url}');
                        embed.setAttribute('style', 'position: absolute; top: 50%; left: 50%; margin-left: -30vw; margin-top: -45vh; width:60vw; height: 90vh; padding: 10px; background-color: rgba(255, 255, 255, 1);  box-shadow: 0 0 15px rgba(22, 9, 9, 0.589); padding: 10px; border-radius: 6px;');
                        background.appendChild(embed); ` , true)
                        .catch(err => console.log(err))
                }
            })

            // Wait until the webContent is fully loaded
            this.examwindow.webContents.on('did-finish-load', async () => { })

            // Wait until the complete DOM is computed
            this.examwindow.webContents.on('dom-ready', () => {
                this.examwindow.webContents.insertCSS('.branding { display: none !important; }');
                this.examwindow.webContents.insertCSS('#header { display: none !important; }');
                this.examwindow.webContents.insertCSS('.drawer-toggler { display: none !important; }');
                this.examwindow.webContents.insertCSS('#page-footer { display: none !important; }');
                this.examwindow.webContents.insertCSS('#theme_boost-drawers-courseindex { display: none !important; }');
            });
        }




        if (this.config.showdevtools) { this.examwindow.webContents.openDevTools()  }

        this.examwindow.once('ready-to-show', async () => {
            this.examwindow.removeMenu() 
            if (!this.config.development) { 
                this.examwindow.setKiosk(true)
                this.examwindow.setMinimizable(false)
                this.examwindow.setAlwaysOnTop(true, "popUpMenu", 0) 
                this.examwindow.moveTop();
               
                enableRestrictions(WindowHandler.examwindow)  // enable restriction only when exam window is fully loaded and in focus
                await this.sleep(2000) // wait an additional 2 sec for windows restrictions to kick in (they steal focus)
                this.examwindow.focus()
                this.addBlurListener()
            }
            this.examwindow.show()
            this.examwindow.focus()
        })

        this.examwindow.on('close', async  (e) => {   // window should not be closed manually.. ever! but if you do make sure to clean examwindow variable and end exam for the client
            if (this.multicastClient.clientinfo.exammode) {
                if (!this.config.development) { e.preventDefault(); }
            }
            else {
                this.examwindow.destroy(); 
                this.examwindow = null;
                disableRestrictions()
                this.multicastClient.clientinfo.exammode = false
                this.multicastClient.clientinfo.focus = true
            }  
        });
       
    }






    /**
     * the main window
     */
    async createMainWindow() {
        let primarydisplay = screen.getPrimaryDisplay()

        this.mainwindow = new BrowserWindow({
            title: 'Main window',
            icon: join(__dirname, '../../public/icons/icon.png'),
            center:true,
            width: 1000,
            height: 600,
            minWidth: 760,
            minHeight: 600,
            show: false,
            webPreferences: {
                preload: join(__dirname, '../preload/preload.cjs'),
                spellcheck: false
            }
        })

        if (app.isPackaged || process.env["DEBUG"]) {
            this.mainwindow.removeMenu() 
            this.mainwindow.loadFile(join(__dirname, '../renderer/index.html'))
        } 
        else {
            const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
            this.mainwindow.removeMenu() 
            this.mainwindow.loadURL(url)
        }

        if (this.config.showdevtools) { this.mainwindow.webContents.openDevTools()  } // you don't want this in the final build

        this.mainwindow.webContents.session.setCertificateVerifyProc((request, callback) => {
            var { hostname, certificate, validatedCertificate, verificationResult, errorCode } = request;
            callback(0);
        });

        this.mainwindow.on('close', async  (e) => {   //ask before closing
            if (!this.config.development) {
                let choice = dialog.showMessageBoxSync(this.mainwindow, {
                    type: 'question',
                    buttons: ['Ja', 'Nein'],
                    title: 'Programm Beenden',
                    message: 'Sind sie sicher?',
                    cancelId: 1
                });
                if(choice == 1){ e.preventDefault(); }
            }
        });

        this.mainwindow.once('ready-to-show', () => {
            this.mainwindow.show()
            this.mainwindow.moveTop();
            this.mainwindow.focus();
        })
    }





    /**
     * Additional Functions
     */

    //adds blur listener when entering exammode
    addBlurListener(window = "examwindow"){
        console.log("adding blur listener")
        console.log(window)
        if (window === "examwindow"){ 
            console.log(`Setting Blur Event for ${window}`)
            this.examwindow.addListener('blur', () => this.blurevent(this)) 
        }
        else if (window === "screenlock") {
            console.log(`Setting Blur Event for ${window}window`)
            this.screenlockWindow.addListener('blur', () => this.blureventScreenlock(this))    
        }
    }
    //removes blur listener when leaving exam mode
    removeBlurListener(){
        console.log("removing blur listener")
        this.examwindow.removeAllListeners('blur')
    }
    // implementing a sleep (wait) function
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    //student fogus went to another window
    blurevent(winhandler) { 
        console.log("blur-exam")
        if (winhandler.screenlockWindow) { return }// do nothing if screenlockwindow stole focus // do not trigger an infinite loop between exam window and screenlock window (stealing each others focus)
            
        winhandler.multicastClient.clientinfo.focus = false
        winhandler.examwindow.show();  // we keep focus on the window.. no matter what
        winhandler.examwindow.moveTop();
        winhandler.examwindow.focus();

        // Play sound
        let soundfile = null
        if (app.isPackaged) {
            soundfile = join(process.resourcesPath, 'app.asar.unpacked', 'public', 'attention.wav');
        } else {
            soundfile = join(__dirname, '../../public/attention.wav');
        }
        sound.play(soundfile);

        if (this.multicastClient.clientinfo.examtype === "eduvidual" || this.multicastClient.clientinfo.examtype === "gforms" ){
            // this only works in "eduvidual" mode because otherwise there is no element "warning" to append (clicking on an external link is considered a blur event)
            winhandler.examwindow.webContents.executeJavaScript(` 
                        if (typeof warning !== 'undefined'){
                            document.body.appendChild(warning); 
                            document.getElementById('nextexamwaring').innerHTML = "Leaving exam mode is not allowed";
                            warning.setAttribute('style', 'text-align: center; padding: 20px;display: block; background-color:#ffc107; border-radius:5px;  z-index:100000; position: absolute; top: 50%; left: 50%; margin-left: -10vw; margin-top: -5vh;width:20vw; height: 10vh; box-shadow: 0 0 10px rgba(0,0,0,0.4); ');
                            setTimeout( ()=>{ document.getElementById('nextexamwaring').style.display = 'none'  } , 5000); 
                        }` , true)
            .catch(err => console.log(err))
        }
    }
    //special blur event for temporary low security screenlock
    blureventScreenlock(winhandler) { 
        console.log("blur-screenlock")
        winhandler.screenlockWindow.show();  // we keep focus on the window.. no matter what
        winhandler.screenlockWindow.moveTop();
        winhandler.screenlockWindow.focus();
    }
    
}


export default new WindowHandler()
 








