import path from 'path';
import fs from 'fs-extra';

export default async function afterPack(context) {
  const arch = context.arch;
  const appPath = context.appOutDir;

  const x64JrePath = path.join(appPath, 'public', 'minimal-jre-11-mac-arm64');
  const arm64JrePath = path.join(appPath, 'public', 'minimal-jre-11-mac');

  if (arch === 'x64') {
    if (await fs.pathExists(x64JrePath)) {
      await fs.remove(x64JrePath);
      console.log(`Removed ARM64 JRE from x64 build: ${x64JrePath}`);
    }
  } else if (arch === 'arm64') {
    if (await fs.pathExists(arm64JrePath)) {
      await fs.remove(arm64JrePath);
      console.log(`Removed x64 JRE from ARM64 build: ${arm64JrePath}`);
    }
  }
}

