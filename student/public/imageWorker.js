// imageWorker.js
import { parentPort } from 'worker_threads';
import screenshot from 'screenshot-desktop-wayland'

let Image = null 
async function loadImageJs() {
    const { Image } = await import('image-js');  // Dynamischer Import
    return Image;
 }


loadImageJs().then((image) => {
   Image = image
});




parentPort.on('message', async ({ imgBuffer }) => {
    try {
        if (!imgBuffer) { // Verwende "screenshot-desktop" -- imgBuffer kann dieser funktion auch übergeben werden von "capturePage" zb
            imgBuffer = await screenshot({ format: 'jpg' });
        }

        if (Buffer.isBuffer(imgBuffer)) {
            const image = await Image.load(imgBuffer);
            const targetWidth = Math.min(1200, image.width);
            // const resizedImage = image.resize({ width: targetWidth });
            const imageHeader = image.crop({ x: 0, y: 0, width: targetWidth, height: 100 });
            let compressedImage = image.toBuffer('image/jpeg', { format: "jpg", quality: 50 });
            let header = imageHeader.toBuffer('image/jpeg', { format: "jpg", quality: 100 });

            let isAllBlack = true
            const data = imageHeader.getRGBAData();
            for (let i = 0; i < 100; i += 4) {   // wenn in einem der ersten 100px farbe enthalten ist dann ist das bild nicht komplett schwarz
                if (data[i] !== 0 || data[i + 1] !== 0 || data[i + 2] !== 0) {   // check r/g/b
                    isAllBlack = false;
                    break;
                }
            }
      
            compressedImage = Buffer.from(compressedImage)
            header = Buffer.from(header)
            let screenshotBase64 = compressedImage.toString('base64');
            let headerBase64 = header.toString('base64');
            parentPort.postMessage({ success: true, screenshotBase64:  screenshotBase64, headerBase64: headerBase64 , isblack: isAllBlack});
        }
        else {
            console.log("keinen imagebuffer erhalten...")
        }
    } 
    catch (error) {
        parentPort.postMessage({ success: false, error: error.message });
    }
});