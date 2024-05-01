import path from 'path';
import log from 'electron-log/main';
import { app } from 'electron'
//import config from '../config.js'

let languageToolJarPath = path.join(__dirname, '../../public/LanguageTool/languagetool-server.jar')
if (app.isPackaged) { languageToolJarPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'public/LanguageTool/languagetool-server.jar') }

// if (app.isPackaged) { languageToolJarPath = path.join(config.tempdirectory, 'LanguageTool/languagetool-server.jar') }
console.log( languageToolJarPath)




 import { spawn } from 'node-jre';

 class LanguageToolServer {
     constructor() {
         this.languageToolProcess = null; // Initialisiert die Prozessvariable
     }
 
     startServer() {
         if (this.languageToolProcess && !this.languageToolProcess.killed) {
             log.warn('lt-server @ startserver: LanguageTool server is already running.');
             return; // Verhindert das erneute Starten, wenn der Server bereits läuft
         }
         try {
            this.languageToolProcess = spawn(
                ['java', '-cp', languageToolJarPath], // Klassenpfad
                'org.languagetool.server.HTTPServer', // Hauptklasse der LanguageTool API
                ['--port', '8088', '--allow-origin', '*'] // Zusätzliche Argumente, z.B. Port und CORS-Erlaubnis
            );
            console.log( this.languageToolProcess)
            log.info('lt-server @ startserver: LanguageTool API running at localhost:8088');

            this.languageToolProcess.stdout.on('data', data => {
                log.info('lt-server @ startserver  output:', data.toString());
            });
    
            this.languageToolProcess.stderr.on('data', data => {
                log.error('lt-server @ startserver error:', data.toString());
            });
    
            this.languageToolProcess.on('exit', code => {
                log.warn(`t-server @ startserver: LanguageTool server exited with code ${code}`);
                this.languageToolProcess = null; // Setzt den Prozess zurück, wenn er beendet wird
            });
        }
        catch(err){
            log.error('lt-server @ startserver error:', err);
        }


     }
 }







export default new LanguageToolServer()











