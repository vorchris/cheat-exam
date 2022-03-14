/**
 * This is the ELECTRON main file that actually opens the electron window
 */

import { app, BrowserWindow, shell, ipcMain  } from 'electron'
import { release } from 'os'
import { join } from 'path'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

let win: BrowserWindow | null = null

async function createWindow() {

    win = new BrowserWindow({
        title: 'Main window',
        icon: join(__dirname, '../renderer/public/favicon.svg'),
        width: 1000,
        height: 600,
        minWidth: 800,
        minHeight: 300,
        webPreferences: {
            preload: join(__dirname, '../preload/preload.cjs')
        },
    })

    if (app.isPackaged || process.env["DEBUG"]) {
        win.removeMenu() 
        win.loadFile(join(__dirname, '../renderer/index.html'))
        //win.webContents.openDevTools()
    } 
    else {
        const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
        win.removeMenu() 
        win.loadURL(url)
        win.webContents.openDevTools()
    }

    const home = app.getPath('home')
    const desktop = app.getPath('desktop')
    const temp  = app.getPath('temp')
    const workdirectory = join(desktop, 'EXAM')
    
    ipcMain.on('env-request', function (event) {
        event.sender.send('env-reply', home, desktop, temp, workdirectory);
    });


    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return { action: 'deny' }
    })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
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
