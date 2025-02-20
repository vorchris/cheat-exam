import fs from 'fs';
import yaml from 'yaml';
import dotenv from 'dotenv';

// Lade die env Datei
dotenv.config({ path: 'electron-builder.env' });

// 1. Update electron-builder.yml
const builderConfigPath = './electron-builder.yml';
const builderConfig = yaml.parse(fs.readFileSync(builderConfigPath, 'utf8'));

let buildVersion = process.env.VERSION + '.' + process.env.BUILD_NUMBER;

// Erstelle Datums-String
const now = new Date();
const buildDate = now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0')

const artifactNamePattern = `\${productName}_\${env.VERSION}.\${env.BUILD_NUMBER}_${buildDate}_\${arch}.\${ext}`;
const buildNumber = process.env.BUILD_NUMBER;
const filename = `${process.env.PRODUCT_NAME}_${process.env.VERSION}.${process.env.BUILD_NUMBER}_${buildDate}`;




// Setze die Werte aus der env
builderConfig.buildNumber = process.env.BUILD_NUMBER;
builderConfig.buildVersion = buildVersion;
builderConfig.productName = process.env.PRODUCT_NAME;

// Windows
if (builderConfig.win) {    builderConfig.win.artifactName = artifactNamePattern;}
// Mac
if (builderConfig.mac) {    builderConfig.mac.artifactName = artifactNamePattern;}
// Linux
if (builderConfig.linux) {    builderConfig.linux.artifactName = artifactNamePattern;}

// Setze das Output-Verzeichnis
builderConfig.directories = builderConfig.directories || {};
builderConfig.directories.output = `../release/${process.env.VERSION}.${process.env.BUILD_NUMBER}_${buildDate}`;



// Schreibe die aktualisierte yml
fs.writeFileSync(builderConfigPath, yaml.stringify(builderConfig));




// 2. Update package.json
const packageJsonPath = './package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Setze die Werte in package.json
packageJson.version = process.env.VERSION;
packageJson.buildNumber = process.env.BUILD_NUMBER;
packageJson.buildVersion = buildVersion;
// Schreibe die aktualisierte package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log('✅ Versionen aktualisiert:');
console.log(`Version: ${process.env.VERSION}`);
console.log(`Build Number: ${process.env.BUILD_NUMBER}`);
console.log(`Build Version: ${buildVersion}`);
console.log(`Build Date: ${buildDate}`);
console.log(`FileName: ${filename}`);
console.log(`Development: ${process.env.DEVELOPMENT}`);
console.log(`__________________________________________________________________`);
