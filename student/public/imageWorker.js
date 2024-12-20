// imageWorker.js
import { parentPort } from 'worker_threads';

let Image = null 
async function loadImageJs() {
    const { Image } = await import('image-js');  // Dynamischer Import
    return Image;
 }


loadImageJs().then((image) => {
   Image = image
});




parentPort.on('message', async ({ img }) => {
    try {
        const image = await Image.load(img);
        const targetWidth = Math.min(1200, image.width);
        // const resizedImage = image.resize({ width: targetWidth });
        const imageHeader = image.crop({ x: 0, y: 0, width: targetWidth, height: 100 });

        const compressedImage = image.toBuffer('image/jpeg', { format: "jpg", quality: 50 });
        const header = imageHeader.toBuffer('image/jpeg', { format: "jpg", quality: 100 });

        let isAllBlack = true
        
        const data = imageHeader.getRGBAData();

        // wenn in einem der ersten 100px farbe enthalten ist dann ist das bild nicht komplett schwarz
        for (let i = 0; i < 100; i += 4) {
            if (data[i] !== 0 || data[i + 1] !== 0 || data[i + 2] !== 0) {   // check r/g/b
                isAllBlack = false;
                break;
            }
        }

        parentPort.postMessage({ compressedImage:  Buffer.from(compressedImage), header:  Buffer.from(header), isblack: isAllBlack});
    } catch (error) {
        parentPort.postMessage({ error: error.message });
    }
});