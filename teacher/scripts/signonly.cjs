require('dotenv').config();
const { notarize } = require('@electron/notarize');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Funktion zum Ausführen eines Befehls als Promise
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}


// Funktion zum Löschen eines Verzeichnisses rekursiv
function deleteDirectory(directoryPath) {
    if (fs.existsSync(directoryPath)) {
      fs.rmSync(directoryPath, { recursive: true, force: true });
      console.log(`Deleted directory: ${directoryPath}`);
    }
}


(async () => {
  const appOutDir = process.argv[2];  // Übergib den appOutDir Pfad als Argument
  const appName = process.argv[3];    // Übergib den App-Namen als Argument
  const appPath = path.join(appOutDir, `${appName}.app`, 'Contents', 'Resources', 'app.asar.unpacked', 'public', 'LanguageTool', 'libs');

  // Liste der JAR-Dateien, die bearbeitet werden müssen
  const jarFiles = [
    'hunspell.jar',
    'grpc-netty-shaded.jar',
    'jna.jar'
  ];

  // Signieren der nativen Bibliotheken in den entpackten JAR-Dateien
  for (const jarFile of jarFiles) {
    const unpackedDir = path.join(appPath, `${jarFile}_unpacked`);
    const filesToSign = [
      'darwin-x86-64/libhunspell.dylib',
      'META-INF/native/libio_grpc_netty_shaded_netty_tcnative_osx_x86_64.jnilib',
      'com/sun/jna/darwin-x86-64/libjnidispatch.jnilib'
    ];

    for (const file of filesToSign) {
      const fullPath = path.join(unpackedDir, file);
      if (fs.existsSync(fullPath)) {
        try {
          await execPromise(`codesign --deep --force --options runtime --timestamp --sign ${process.env.SHAID} "${fullPath}"`);
          console.log(`Successfully signed ${fullPath}`);
        } catch (error) {
          console.error(`Error signing ${fullPath}:`, error);
          throw new Error(`Signing failed for ${fullPath}`);
        }
      }
    }

    // Neuverpacken der JAR-Datei
    try {
      await execPromise(`jar cf "${path.join(appPath, jarFile)}" -C "${unpackedDir}" .`);
      console.log(`Successfully repacked ${jarFile}`);
    } catch (error) {
      console.error(`Error repacking ${jarFile}:`, error);
      throw new Error(`Repacking failed for ${jarFile}`);
    }

    // _unpacked-Verzeichnis löschen
    deleteDirectory(unpackedDir);
  }

  // Notarization-Prozess starten
//   console.log("Notarizing Next-Exam-Teacher");

//   try {
//     await notarize({
//       tool: 'notarytool',
//       teamId: process.env.TEAMID,
//       appBundleId: 'com.nextexam-teacher.app',
//       appPath: path.join(appOutDir, `${appName}.app`),
//       appleId: process.env.APPLEID,
//       appleIdPassword: process.env.APPLEIDPASS,
//     });
//     console.log("Notarization successful!");
//   } catch (error) {
//     console.error("Failed to notarize:", error);
//   }
})();
