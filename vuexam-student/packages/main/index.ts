/**
 * This is the ELECTRON main file that actually opens the electron window
 */


import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'os'
import { join } from 'path'
import url  from 'url';


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
    width: 1400,
    height: 800,
    webPreferences: {
        //nodeIntegration: true,
        preload: join(__dirname, '../preload/index.cjs')
    },
  })


  if (app.isPackaged || process.env["DEBUG"]) {
    win.removeMenu() 
    win.loadFile(join(__dirname, '../renderer/index.html'))
    win.webContents.openDevTools()
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
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
    ipcMain.on("kiosk", () => win.setKiosk(true)  );
    ipcMain.on("nokiosk", () => win.setKiosk(false)  );


    // if we receive "exam" from the express API - we inform our renderer (view) to switch to the right page
    ipcMain.on("exam", (event, token, examtype) =>  {
        win?.setKiosk(true)
        win?.webContents.send('exam', token, examtype);
    }); 

    ipcMain.on("endexam", (event, token, examtype) =>  {
        win?.setKiosk(false)
        win?.webContents.send('endexam', token, examtype);
    }); 



  // Test active push message to Renderer-process
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

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
