


/**
 * most of the keyboard restrictions could be handled by "iohook" for all platforms
 * unfortunalety it's not yet released for node v16.x and electron v16.x  (also it's "big sur" intel only on macs)
 * https://wilix-team.github.io/iohook/installation.html
 * 
 * "node-global-key-listener" would be another solution for windows and macos (although it requires "accessability" permissions on mac)
 * but for now it seems the module can not run in a final electron build
 * https://github.com/LaunchMenu/node-global-key-listener/issues/18
 * 
 * hardcoding the keyboardshortcuts we want to capture into iohook(or n-g-k-l) and manually compiling it for mac and windows could be done - (but not until i get paid for this amount of work ;-) 
 */

import { join } from 'path'
import childProcess from 'child_process'   //needed to run bash commands on linux 
// import { GlobalKeyboardListener } from "node-global-key-listener";   //needed to deactivate shortcuts on windows
// const v = new GlobalKeyboardListener();





const gnomeKeybindings = [  
    'activate-window-menu','maximize-horizontally','move-to-side-n','move-to-workspace-8','switch-applications','switch-to-workspace-3','switch-windows-backward',
    'always-on-top','maximize-vertically','move-to-side-s','move-to-workspace-9','switch-applications-backward','  switch-to-workspace-4','toggle-above',
    'begin-move','minimize','move-to-side-w','move-to-workspace-down','switch-group','switch-to-workspace-5','toggle-fullscreen',
    'begin-resize','move-to-center','move-to-workspace-1','move-to-workspace-last','switch-group-backward','switch-to-workspace-6','toggle-maximized',
    'close','move-to-corner-ne','move-to-workspace-10','move-to-workspace-left','switch-input-source','switch-to-workspace-7','toggle-on-all-workspaces',
    'cycle-group','move-to-corner-nw','move-to-workspace-11','move-to-workspace-right','switch-input-source-backward  switch-to-workspace-8','toggle-shaded',
    'cycle-group-backward','move-to-corner-se','move-to-workspace-12','move-to-workspace-up','switch-panels','switch-to-workspace-9','unmaximize',
    'cycle-panels','move-to-corner-sw','move-to-workspace-2','panel-main-menu','switch-panels-backward','switch-to-workspace-down',      
    'cycle-panels-backward','move-to-monitor-down','move-to-workspace-3','panel-run-dialog','switch-to-workspace-1','switch-to-workspace-last',              
    'cycle-windows','move-to-monitor-left','move-to-workspace-4','raise','switch-to-workspace-10','switch-to-workspace-left',    
    'cycle-windows-backward','move-to-monitor-right','move-to-workspace-5','raise-or-lower','switch-to-workspace-11','switch-to-workspace-right',   
    'lower','move-to-monitor-up','move-to-workspace-6','set-spew-mark','switch-to-workspace-12','switch-to-workspace-up',     
    'maximize','move-to-side-e','move-to-workspace-7','show-desktop','switch-to-workspace-2','switch-windows'  
]


 function enableRestrictions(){

    // PLASMA/KDE
    if (process.platform === 'linux') {
        /////////
        // KDE
        /////////

        // Temporarily deactivate ALL global keyboardshortcuts 
        childProcess.execFile('qdbus', ['org.kde.kglobalaccel' ,'/kglobalaccel', 'blockGlobalShortcuts', 'true'])
        // Clear Clipboard history 
        childProcess.execFile('qdbus', ['org.kde.klipper' ,'/klipper', 'org.kde.klipper.klipper.clearClipboardHistory'])


        //////////
        // GNOME
        ///////////

        // for gnome3 we need to set every key individually => reset will obviously set defaults (so we may mess up customized shortcuts here)
        // possible fix: instead of set > reset we could use get - set - set.. first get the current bindings and store them - then set to nothing - then set to previous setting
        for (let binding of gnomeKeybindings){
            childProcess.execFile('gsettings', ['set' ,'org.gnome.desktop.wm.keybindings', `${binding}`, `['']`])
        }
    }

    // WINDOWS
    if (process.platform === 'win32') {

        //clear clipboard
        childProcess.execFile('$null', ['|' ,'&', '$env:windir\System32\clip.exe'])

        
        //block important keyboard shortcuts (disable-shortcuts.exe is a selfmade C application - shortcuts are hardcoded there - need to rebuild if adding shortcuts)
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
        // reset all shortcuts KDE
        childProcess.execFile('qdbus', ['org.kde.kglobalaccel' ,'/kglobalaccel', 'blockGlobalShortcuts', 'false'])

        // reset specific shortcuts GNOME
        for (let binding of gnomeKeybindings){
            childProcess.execFile('gsettings', ['reset' ,'org.gnome.desktop.wm.keybindings', `${binding}`])
        }

    }
}

export {enableRestrictions, disableRestrictions}