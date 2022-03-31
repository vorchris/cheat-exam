/**
 * This is the ELECTRON main file that actually opens the electron window
 */

import { app, BrowserWindow, shell, ipcMain, screen, globalShortcut, TouchBar } from 'electron'
import { release } from 'os'
import { join } from 'path'
import childProcess from 'child_process'



// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') {  app.setAppUserModelId(app.getName())}


/**
 * most of the keyboard restrictions could be handled by "iohook" for all platforms
 * unfortunalety it's not yet released for node v16.x and electron v16.x
 * https://wilix-team.github.io/iohook/installation.html
 */
function enableRestrictions(){

    // PLASMA/KDE
    if (process.platform === 'linux') {
        childProcess.execFile('qdbus', ['org.kde.kglobalaccel' ,'/kglobalaccel', 'blockGlobalShortcuts', 'true'], (error, stdout, stderr) => {
            if (stderr) {  console.log(stderr)  }
            if (error)  {  console.log(error)   }
        })

        //for gnome3 we need to set every key individually => reset will obviously set defaults (so we may mess up customized shortcuts here)
        childProcess.execFile('gsettings', ['set' ,'org.gnome.desktop.wm.keybindings', 'show-desktop', `['']`])   //deactivate
        childProcess.execFile('gsettings', ['set' ,'org.gnome.desktop.wm.keybindings', 'cycle-windows', `['']`])
        childProcess.execFile('gsettings', ['set' ,'org.gnome.desktop.wm.keybindings', 'switch-applications', `['']`])



        // activate-window-menu          maximize-horizontally         move-to-side-n                move-to-workspace-8           switch-applications           switch-to-workspace-3         switch-windows-backward
        // always-on-top                 maximize-vertically           move-to-side-s                move-to-workspace-9           switch-applications-backward  switch-to-workspace-4         toggle-above
        // begin-move                    minimize                      move-to-side-w                move-to-workspace-down        switch-group                  switch-to-workspace-5         toggle-fullscreen
        // begin-resize                  move-to-center                move-to-workspace-1           move-to-workspace-last        switch-group-backward         switch-to-workspace-6         toggle-maximized
        // close                         move-to-corner-ne             move-to-workspace-10          move-to-workspace-left        switch-input-source           switch-to-workspace-7         toggle-on-all-workspaces
        // cycle-group                   move-to-corner-nw             move-to-workspace-11          move-to-workspace-right       switch-input-source-backward  switch-to-workspace-8         toggle-shaded
        // cycle-group-backward          move-to-corner-se             move-to-workspace-12          move-to-workspace-up          switch-panels                 switch-to-workspace-9         unmaximize
        // cycle-panels                  move-to-corner-sw             move-to-workspace-2           panel-main-menu               switch-panels-backward        switch-to-workspace-down      
        // cycle-panels-backward         move-to-monitor-down          move-to-workspace-3           panel-run-dialog              switch-to-workspace-1         switch-to-workspace-last      
        // cycle-windows                 move-to-monitor-left          move-to-workspace-4           raise                         switch-to-workspace-10        switch-to-workspace-left      
        // cycle-windows-backward        move-to-monitor-right         move-to-workspace-5           raise-or-lower                switch-to-workspace-11        switch-to-workspace-right     
        // lower                         move-to-monitor-up            move-to-workspace-6           set-spew-mark                 switch-to-workspace-12        switch-to-workspace-up        
        // maximize                      move-to-side-e                move-to-workspace-7           show-desktop                  switch-to-workspace-2         switch-windows  


    }

    // WINDOWS
    if (process.platform === 'win32') {
        let executable = join(__dirname, '../../public/disable-shortcuts.exe')
    
        childProcess.execFile(executable, [], (error, stdout, stderr) => {
            if (stderr) {  console.log(stderr)  }
            if (error)  {  console.log(error)   }
        })
    }

    // MacOS
    if (process.platform === 'darwin') {
        const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar
        const textlabel = new TouchBarLabel({label: "Next-Exam"})
        const touchBar = new TouchBar({
            items: [
            new TouchBarSpacer({ size: 'flexible' }),
            textlabel,
            new TouchBarSpacer({ size: 'flexible' }),
            ]
        })
        win?.setTouchBar(touchBar)
    }
}




function disableRestrictions(){
    // disable global keyboardshortcuts on PLASMA/KDE
    if (process.platform === 'linux') {
        // all shortcuts KDE
        childProcess.execFile('qdbus', ['org.kde.kglobalaccel' ,'/kglobalaccel', 'blockGlobalShortcuts', 'false'])

        // specific shortcuts GNOME
        childProcess.execFile('gsettings', ['reset' ,'org.gnome.desktop.wm.keybindings', 'show-desktop']) // reset
        childProcess.execFile('gsettings', ['reset' ,'org.gnome.desktop.wm.keybindings', 'cycle-windows'])
        childProcess.execFile('gsettings', ['reset' ,'org.gnome.desktop.wm.keybindings', 'switch-applications'])
    }
}





if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null

async function createWindow() {
    const display = screen.getPrimaryDisplay();
    const dimensions = display.workAreaSize;


    win = new BrowserWindow({
        title: 'Main window',
        icon: join(__dirname, '../../public/icons/icon.png'),
        width: 1000,
        height: 600,
        minWidth: 760,
        minHeight: 600,
        alwaysOnTop: true,
        webPreferences: {
            preload: join(__dirname, '../preload/preload.cjs')
        }
    })

    if (app.isPackaged || process.env["DEBUG"]) {
        win.removeMenu() 
        win.loadFile(join(__dirname, '../renderer/index.html'))
        win.webContents.openDevTools()  // you don't want this in the final build
    } 
    else {
        const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
        win.removeMenu() 
        win.loadURL(url)
        win.webContents.openDevTools()
    }



    /**
     * we create custom listeners here
     * in electron frontend OR express api (import) ipcRenderer is exposed and usable to send or receive messages (see preload/index.ts)
     * we can call ipcRenderer.send('signal') to send and ipcMain to reveive in mainprocess
     */
    const blurevent = () => { 
        win?.webContents. send('blurevent'); 
        win?.show();  // we keep focus on the window.. no matter what
        win?.moveTop();
        win?.focus();
    }
   
    // if we receive "exam" from the express API (via ipcRenderer.send() ) - we inform our renderer (view) 
    // which sets a ipcRenderer listener for the "exam" signal to switch to the correct page (read examtype)  
    ipcMain.on("exam", (event, token, examtype) =>  {
        enableRestrictions()
        win?.setKiosk(true)
        win?.minimize()
        win?.focus()
        win?.addListener('blur', blurevent)  // send blurevent on blur
        win?.webContents.send('exam', token, examtype);
    }); 

    ipcMain.on("endexam", (event, token, examtype) =>  {
        disableRestrictions()
        win?.setKiosk(false)
        win?.removeListener('blur', blurevent)  // do not send blurevent on blur
        win?.webContents.send('endexam', token, examtype);
    }); 

    //trying to fetch some common keyboardshortcuts (alt+tab strg-alt-entf is not possible)
    win.webContents.on('before-input-event', (event, input) => {
        if (input.alt || input.key.toLowerCase() === "alt") {
            console.log('Pressed Alt')
            event.preventDefault()
          }
        if (input.key.toLocaleLowerCase() === "meta" || input.key.toLocaleLowerCase() === "super"|| input.key.toLocaleLowerCase() === "cmd" ) {
            console.log('Pressed meta')
            event.preventDefault()
          }
    })


    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return { action: 'deny' }
    })
}





app.whenReady()
.then( () => {
    globalShortcut.register('Cmd+p', () => {
        console.log('Electron loves global shortcuts!')
        return false
    })
  })
.then(createWindow)



// if window is closed
app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()

    disableRestrictions()
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})
