import { parentPort } from 'worker_threads';
import screenshot from 'screenshot-desktop-wayland';
import sharp from 'sharp';

parentPort.on('message', async ({ imgBuffer }) => {
    try {
        if (!imgBuffer) {

            try {
                imgBuffer = await screenshot();
            } catch (screenshotError) {
                parentPort.postMessage({ success: false, error: "Screenshot konnte nicht erstellt werden: " + screenshotError.message });
                return;
            }
            
        }

        if (Buffer.isBuffer(imgBuffer)) {
            const image = sharp(imgBuffer);

            const compressedBuffer = await image
                .jpeg({ quality: 40 })  // JPEG-Format und Qualität
                .toBuffer();
            
            const headerBuffer = await image
                .extract({ left: 0, top: 0, width: 1200, height: 100 })
                .toBuffer();
            
            // Prüfen, ob das Bild komplett schwarz ist
            const headerRaw = await sharp(headerBuffer).raw().toBuffer(); // Rohdaten für die Schwarzprüfung
            const isAllBlack = !headerRaw.some((value, index) => index % 4 !== 3 && value !== 0);
            
            // Base64 kodieren
            const screenshotBase64 = compressedBuffer.toString('base64');
            const headerBase64 = headerBuffer.toString('base64');
            
            // Ergebnis an den Hauptthread senden
            parentPort.postMessage({
                success: true,
                screenshotBase64,
                headerBase64,
                isblack: isAllBlack,
                imgBuffer: imgBuffer
            });

        } else {
            parentPort.postMessage({ success: false, error: "Keinen Imagebuffer erhalten..." });
        }
    } catch (error) {
        parentPort.postMessage({ success: false, error: error.message });
    }
});
