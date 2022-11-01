
import { app, BrowserWindow, shell, dialog, Menu, MenuItem, screen} from 'electron'
import { join } from 'path'
import {disableRestrictions, enableRestrictions} from './platformrestrictions.js';

  ////////////////////////////////////////////////////////////
 // Window handling (ipcRenderer Process - Frontend) START
////////////////////////////////////////////////////////////


class WindowHandler {
    constructor () {
      this.blockwindows = []
      this.mainwindow = null
      this.examwindow = null
      this.config = null
      this.multicastClient = null
    }

    init (mc, config) {
        this.multicastClient = mc
        this.config = config
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
            resizable:false,
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
        blockwin.moveTop();
        blockwin.setKiosk(true)
        blockwin.show()
        this.blockwindows.push(blockwin)
    }







    /**
     * Examwindow
     * @param examtype eduvidual, math, language
     * @param token student token
     * @param serverstatus the serverstatus object containing info about spellcheck language etc. 
     */
    createExamWindow(examtype, token, serverstatus, primarydisplay) {
        // just to be sure we check some important vars here
        if (examtype !== "eduvidual" && examtype !== "editor" && examtype !== "math" || !token){  // for now.. we probably should stop everything here
            console.log("missing parameters for exam-mode!")
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
    
        // Load correct url 
        if (examtype === "eduvidual"){    //external page
            let url =`https://eduvidual.at/mod/${serverstatus.moodleTestType}/view.php?id=${serverstatus.testid}`    // https://www.eduvidual.at/mod/quiz/view.php?id=4172287  
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

        // HANDLE SPELLCHECK 
        if (serverstatus.spellcheck){  
            console.log(serverstatus.spellchecklang)
            this.examwindow.webContents.session.setSpellCheckerLanguages([serverstatus.spellchecklang])
            this.examwindow.webContents.session.setSpellCheckerDictionaryDownloadURL('https://localhost:11411/dicts/')
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

        // HANDLE EDUVIDUAL pdf embed
        if (serverstatus.examtype === "eduvidual"){

            this.examwindow.webContents.on('did-navigate', (event, url) => {  //create a new div called "nextexamwarning" and "embedbackground"
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
                console.log(url)
             
                if (!url.includes(serverstatus.testid) //we block everything except pages that contain the following keyword-combinations
                    && ( !url.includes("startattempt.php") && !url.includes("eduvidual.at"))
                    && ( !url.includes("processattempt.php") && !url.includes("eduvidual.at"))
                    && ( !url.includes("login") && !url.includes("microsoft")) 
                    && ( !url.includes("logout") && !url.includes("eduvidual.at"))
                    && ( !url.includes("lookup") && !url.includes("google"))  
                    ){
                    event.preventDefault()
                }
                if (url.includes('resource/view')&& !url.includes('forceview')){
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
        }
        if (this.config.showdevtools) { this.examwindow.webContents.openDevTools()  }

        this.examwindow.removeMenu() 
        this.examwindow.once('ready-to-show', () => {
            if (!this.config.development) { 
                this.examwindow.setKiosk(true)
                this.examwindow?.moveTop();
                this.examwindow?.setAlwaysOnTop(true, "screen-saver", 1) 
            }
            this.examwindow?.show()
            this.examwindow?.focus(); 
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
        enableRestrictions(WindowHandler.examwindow)
    }

    addBlurListener(){
        console.log("adding blur listener")
        this.examwindow.addListener('blur', () => this.blurevent(this))
    }

    removeBlurListener(){
        console.log("removing blur listener")
        this.examwindow.removeAllListeners('blur')
    }






    /**
     * the main window
     */
    async createMainWindow() {
        let primarydisplay = screen.getPrimaryDisplay()

        this.mainwindow = new BrowserWindow({
            title: 'Main window',
            icon: join(__dirname, '../../public/icons/icon.png'),
            x: primarydisplay.bounds.x + 0,
            y: primarydisplay.bounds.y + 0,
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

        // Make all links open with the browser, not with the application // this would trigger blur event in exam mode
        this.mainwindow.webContents.setWindowOpenHandler(({ url }) => {
            if (url.startsWith('https:')) shell.openExternal(url)
            return { action: 'deny' }
        })

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





    blurevent(winhandler) { 
        console.log("blur")
        winhandler.examwindow.show();  // we keep focus on the window.. no matter what
        winhandler.examwindow.moveTop();
        winhandler.examwindow.focus();
        winhandler.multicastClient.clientinfo.focus = false
    
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


export default new WindowHandler()
 








