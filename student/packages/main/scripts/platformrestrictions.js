


/**
 * most of the keyboard restrictions could be handled by "iohook" for all platforms
 * unfortunalety it's not yet released for node v16.x and electron v16.x
 * https://wilix-team.github.io/iohook/installation.html
 */

 import childProcess from 'child_process'


const gnomeKeybindings = [  
   ' activate-window-menu'          'maximize-horizontally'         'move-to-side-n'                'move-to-workspace-8'           'switch-applications'           switch-to-workspace-3         switch-windows-backward
    'always-on-top'                 'maximize-vertically'           move-to-side-s                move-to-workspace-9           switch-applications-backward  switch-to-workspace-4         toggle-above
    'begin-move'                    'minimize'                      move-to-side-w                move-to-workspace-down        switch-group                  switch-to-workspace-5         toggle-fullscreen
    'begin-resize'                  move-to-center                move-to-workspace-1           move-to-workspace-last        switch-group-backward         switch-to-workspace-6         toggle-maximized
    'close'                         move-to-corner-ne             move-to-workspace-10          move-to-workspace-left        switch-input-source           switch-to-workspace-7         toggle-on-all-workspaces
    'cycle-group'                   move-to-corner-nw             move-to-workspace-11          move-to-workspace-right       switch-input-source-backward  switch-to-workspace-8         toggle-shaded
    cycle-group-backward          move-to-corner-se             move-to-workspace-12          move-to-workspace-up          switch-panels                 switch-to-workspace-9         unmaximize
    cycle-panels                  move-to-corner-sw             move-to-workspace-2           panel-main-menu               switch-panels-backward        switch-to-workspace-down      
    cycle-panels-backward         move-to-monitor-down          move-to-workspace-3           panel-run-dialog              switch-to-workspace-1         switch-to-workspace-last      
    cycle-windows                 move-to-monitor-left          move-to-workspace-4           raise                         switch-to-workspace-10        switch-to-workspace-left      
    cycle-windows-backward        move-to-monitor-right         move-to-workspace-5           raise-or-lower                switch-to-workspace-11        switch-to-workspace-right     
    lower                         move-to-monitor-up            move-to-workspace-6           set-spew-mark                 switch-to-workspace-12        switch-to-workspace-up        
    maximize                      move-to-side-e                move-to-workspace-7           show-desktop                  switch-to-workspace-2         switch-windows  

]


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


        for (binding of gnomeKeybindings){
             childProcess.execFile('gsettings', ['set' ,'org.gnome.desktop.wm.keybindings', `${binding}`, `['']`])
        }


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

export {enableRestrictions, disableRestrictions}