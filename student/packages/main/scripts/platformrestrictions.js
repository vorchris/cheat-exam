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


/**
 * the next best solution i came up with is to kill all of the shells - starting with explorer.exe because its absolutely impossible to 
 * deactivate this nasty "windows" button or 3FingerSlideUp Gesture in windows 11 - you could edit the registry and reboot but thats obviously not what we want
 */

import { join } from 'path'
import childProcess from 'child_process'   //needed to run bash commands on linux 
import { app, TouchBar, clipboard, globalShortcut} from 'electron'
import config from '../config.js';
import log from 'electron-log';
import {SchedulerService} from './schedulerservice.ts'

const __dirname = import.meta.dirname;

// unfortunately there is no convenient way for gnome-shell to un-set ALL shortcuts at once
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
const gnomeShellKeybindings = ['focus-active-notification','open-application-menu','screenshot','screenshot-window','shift-overview-down',
    'shift-overview-up','switch-to-application-1','switch-to-application-2','switch-to-application-3','switch-to-application-4','switch-to-application-5',
    'switch-to-application-6','switch-to-application-7','switch-to-application-8','switch-to-application-9','show-screenshot-ui','show-screen-recording-ui',
    'toggle-application-view','toggle-message-tray','toggle-overview'  ]

const gnomeMutterKeybindings = ['rotate-monitor','switch-monitor','tab-popup-cancel','tab-popup-select','toggle-tiled-left','toggle-tiled-right']

const gnomeDashToDockKeybindings = ['app-ctrl-hotkey-1','app-ctrl-hotkey-10','app-ctrl-hotkey-2','app-ctrl-hotkey-3','app-ctrl-hotkey-4','app-ctrl-hotkey-5',
    'app-ctrl-hotkey-6','app-ctrl-hotkey-7','app-ctrl-hotkey-8','app-ctrl-hotkey-9',
    'app-hotkey-1','app-hotkey-10','app-hotkey-2','app-hotkey-3','app-hotkey-4','app-hotkey-5','app-hotkey-6','app-hotkey-7','app-hotkey-8','app-hotkey-9',
    'app-shift-hotkey-1','app-shift-hotkey-10','app-shift-hotkey-2','app-shift-hotkey-3','app-shift-hotkey-4','app-shift-hotkey-5',
    'app-shift-hotkey-6','app-shift-hotkey-7','app-shift-hotkey-8','app-shift-hotkey-9','shortcut']

const gnomeWaylandKeybindings = ['switch-to-session-1','switch-to-session-2','switch-to-session-3','switch-to-session-4','switch-to-session-5','switch-to-session-6','switch-to-session-7','switch-to-session-8','switch-to-session-9','switch-to-session-10','switch-to-session-11','switch-to-session-12' ]

let clipboardInterval
let configStore = {
    linux: {},
    windows: {},
    macos: {}
}

// list of apps we do not want to run in background
const appsToClose = [];

let isKDE = false
let isGNOME = false
childProcess.exec('echo $XDG_CURRENT_DESKTOP', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stdout.trim() === 'GNOME') { isGNOME = true } 
    if (stdout.trim() === 'KDE') { isKDE = true } 
});



function enableRestrictions(winhandler){
    if (!config.development) {return}
    if (config.development) {return}
}












function disableRestrictions(){
    if (config.development) {return}
    if (!config.development) {return}
}

export {enableRestrictions, disableRestrictions}
