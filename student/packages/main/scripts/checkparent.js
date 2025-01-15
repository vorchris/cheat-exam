
import { app, dialog} from 'electron'
import ps from 'ps-node'
import log from 'electron-log';
import WindowHandler from './windowhandler.js'


export async function checkParent() {
    try {
        const parentPid = process.ppid; // Parent PID festlegen

        const foundBrowser = await findParentProcess(parentPid, 4, new Set());

        if (foundBrowser) {
            log.warn('checkparent @ checkParent: Die App wurde direkt aus einem Browser gestartet');
            dialog.showMessageBoxSync(WindowHandler.mainwindow, {
                type: 'question',
                buttons: ['OK'],
                title: 'Programm beenden',
                message: 'Unerlaubter Programmstart aus einem Webbrowser erkannt.\nNext-Exam wird beendet!',
            });

            WindowHandler.mainwindow.allowexit = true;
            app.quit();
        } else {
            log.info('checkparent @ checkParent: Parent Process Check OK');
        }
    } catch (error) {
        log.error(`checkparent @ checkParent: Unerwarteter Fehler: ${error.message}`);
    }
}

export async function findParentProcess(pid, maxDepth, visitedPids) {
    const browserKeywords = ['chrom', 'edge', 'fire', 'brave', 'opera'];

    if (pid == 1) {
        log.info('main @ findParentProcess: PID 1 erreicht. Kein Webbrowser gefunden.');
        return false; 
    }

    if (maxDepth <= 0) {
        log.warn('checkparent @ findParentProcess: Maximale Rekursionstiefe erreicht.');
        return false;
    }

    if (visitedPids.has(pid)) {
        log.warn(`checkparent @ findParentProcess: Zirkuläre Referenz erkannt für PID ${pid}.`);
        return false;
    }

    visitedPids.add(pid);

    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            log.error(`checkparent @ findParentProcess: Timeout bei PID ${pid}.`);
            resolve(false);
        }, 4000); // 4 Sekunden Timeout für den Versuch einen Prozess zu finden - Windows liefert manchmal keine, inkonsistente oder zirkuläre Referenzen hier - abbruch!

        ps.lookup({ pid }, (err, resultList) => {
            clearTimeout(timeout);

             if (err) {
                log.error(`checkparent @ findParentProcess: Fehler bei der Prozessabfrage für PID ${pid}: ${err.message}`);
                resolve(false);
                return;
            }
            
            if (!resultList.length) {
                log.warn(`checkparent @ findParentProcess: Keine Ergebnisse für Prozess mit PID ${pid} gefunden.`);
                resolve(false);
                return;
            }
            
            
            const parentProcess = resultList[0];
            const parentCommand = parentProcess.command.toLowerCase();

            if (browserKeywords.some(browser => parentCommand.includes(browser)))        { resolve(true);  }    // Browser gefunden
            else if (parentCommand.includes('explorer.exe') || parentProcess.ppid == 1) { resolve(false); }    // Auf Windows ist Explorer quasi root
            else { resolve(findParentProcess(parentProcess.ppid, maxDepth - 1, visitedPids)); }                 // Weiter nach oben
           
        });
    });
}
