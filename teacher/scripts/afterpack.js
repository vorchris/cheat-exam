// after-pack.js
const path = require('path');
const fs = require('fs-extra'); // Paket zum einfachen Löschen von Verzeichnissen

module.exports = async (context) => {
  const arch = context.arch; // Architektur ermitteln (x64 oder arm64)
  const appPath = context.appOutDir; // Pfad zum App-Ausgabeverzeichnis

  // Pfade zu den Verzeichnissen, die entfernt werden sollen
  const x64JrePath = path.join(appPath, 'public', 'minimal-jre-11-mac-arm64');
  const arm64JrePath = path.join(appPath, 'public', 'minimal-jre-11-mac');

  // Architekturprüfung und entsprechende Verzeichnisse entfernen
  if (arch === 'x64') {
    if (fs.existsSync(x64JrePath)) {
      await fs.remove(x64JrePath);
      console.log(`Removed ARM64 JRE from x64 build: ${x64JrePath}`);
    }
  } else if (arch === 'arm64') {
    if (fs.existsSync(arm64JrePath)) {
      await fs.remove(arm64JrePath);
      console.log(`Removed x64 JRE from ARM64 build: ${arm64JrePath}`);
    }
  }
};
