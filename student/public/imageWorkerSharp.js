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

            // const resizedBuffer = await image
            //     .resize({ width: 1024 }) 
            //     .toBuffer();
            
            // const headerBuffer = await image
            //     .extract({ left: 0, top: 0, width: 1024, height: 100 })
            //     .toBuffer();
            
            const { resizedBuffer, headerBuffer } = await image     //nutze sharp pipeline um sharp nicht zweimal aufrufen zu müssen
                .toBuffer({ resolveWithObject: true })
                .then(async (original) => {
                    const resized = sharp(original.data)
                        .resize({ width: 1024 })  // Auflösung reduzieren da bei der umwandlung in base64 nicth die qualität sondern nur die anzahl der pixel relevant ist 
                        .toBuffer();
            
                    const header = sharp(original.data)
                        .extract({ left: 0, top: 0, width: 1024, height: 100 })
                        .toBuffer();
            
                    return { resizedBuffer: await resized, headerBuffer: await header };
                });




            // Prüfen, ob das Bild komplett schwarz ist
            const headerRaw = await sharp(headerBuffer).raw().toBuffer(); // Rohdaten für die Schwarzprüfung
            const isAllBlack = !headerRaw.some((value, index) => index % 4 !== 3 && value !== 0);
            
            // Base64 kodieren
            const screenshotBase64 = resizedBuffer.toString('base64');
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
