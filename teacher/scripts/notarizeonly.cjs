require('dotenv').config();
const { notarize } = require('@electron/notarize');
const path = require('path');


(async () => {
  const appOutDir = process.argv[2];  // Übergib den appOutDir Pfad als Argument
  const appName = process.argv[3];    // Übergib den App-Namen als Argument
  const appPath = path.join(appOutDir, `${appName}.app`, 'Contents', 'Resources', 'app.asar.unpacked', 'public', 'LanguageTool', 'libs');

 


  // Notarization-Prozess starten
  console.log("Notarizing Next-Exam-Teacher");

  try {
    await notarize({
      tool: 'notarytool',
      teamId: process.env.TEAMID,
      appBundleId: 'com.nextexam-teacher.app',
      appPath: path.join(appOutDir, `${appName}.app`),
      appleId: process.env.APPLEID,
      appleIdPassword: process.env.APPLEIDPASS,
    });
    console.log("Notarization successful!");
  } catch (error) {
    console.error("Failed to notarize:", error);
  }
})();
