
import path from 'path';
// import { fileURLToPath } from 'url';

//const __dirname = path.dirname(fileURLToPath(import.meta.url));

import log from 'electron-log/main';
import { app } from 'electron'

let languageToolJarPath = path.join(__dirname, '../../public/LanguageTool/languagetool-server.jar')
if (app.isPackaged) { languageToolJarPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'public/LanguageTool/languagetool-server.jar') }




function startLanguageTool(){
//    import('node-jre').then(jre => {
 
//     const process = jre.default.spawn(
//         ['java', '-cp', languageToolJarPath], // Klassenpfad
//         'org.languagetool.server.HTTPServer', // Hauptklasse der LanguageTool API
//         ['--port', '8088', '--allow-origin', '*'] // Zusätzliche Argumente, z.B. Port und CORS-Erlaubnis
//     );

//     process.stdout.on('data', data => {  log.info('lt-server Output:', data.toString());  });
//     process.stderr.on('data', data => {  log.error('lt-server Error:', data.toString()); });
//     process.on('exit', code => { log.warn(`lt-server: LanguageTool exited with code ${code}`); });
// })
// .catch(err => { log.error('lt-server: Error loading node-jre module:', err);}); 


import('node-jre').then(jre => {
    // Prüft, ob der Prozess bereits gespeichert und aktiv ist
    if (this.languageToolProcess && !this.languageToolProcess.killed) {
        log.info('LanguageTool server is already running.');
        return; // Früher Ausstieg, wenn der Prozess bereits läuft
    }

    // Startet den LanguageTool-Server
    const process = jre.default.spawn(
        ['java', '-cp', languageToolJarPath], // Klassenpfad
        'org.languagetool.server.HTTPServer', // Hauptklasse der LanguageTool API
        ['--port', '8088', '--allow-origin', '*'] // Zusätzliche Argumente, z.B. Port und CORS-Erlaubnis
    );

    // Speichern des Prozesses in einer Eigenschaft
    this.languageToolProcess = process;

    process.stdout.on('data', data => { log.info('lt-server Output:', data.toString()); });
    process.stderr.on('data', data => { log.error('lt-server Error:', data.toString()); });
    process.on('exit', code => {
        log.warn(`lt-server: LanguageTool exited with code ${code}`);
        this.languageToolProcess = null; // Setzt den Prozess zurück, wenn er beendet wird
    });
})
.catch(err => { log.error('lt-server: Error loading node-jre module:', err); }); 


 }



 import { spawn } from 'node-jre';

 class LanguageToolServer {
     constructor() {
         this.languageToolProcess = null; // Initialisiert die Prozessvariable
     }
 
     startServer() {
         if (this.languageToolProcess && !this.languageToolProcess.killed) {
             console.log('LanguageTool server is already running.');
             return; // Verhindert das erneute Starten, wenn der Server bereits läuft
         }
 
         this.languageToolProcess = spawn(
            ['java', '-cp', languageToolJarPath], // Klassenpfad
            'org.languagetool.server.HTTPServer', // Hauptklasse der LanguageTool API
            ['--port', '8088', '--allow-origin', '*'] // Zusätzliche Argumente, z.B. Port und CORS-Erlaubnis
         );
 
         this.languageToolProcess.stdout.on('data', data => {
             console.log('LanguageTool server output:', data.toString());
         });
 
         this.languageToolProcess.stderr.on('data', data => {
             console.error('LanguageTool server error:', data.toString());
         });
 
         this.languageToolProcess.on('exit', code => {
             console.warn(`LanguageTool server exited with code ${code}`);
             this.languageToolProcess = null; // Setzt den Prozess zurück, wenn er beendet wird
         });
     }
 }







export default LanguageToolServer











