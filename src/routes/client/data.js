
import { Router } from 'express'
const router = Router()
import config from '../../config.js'
import multiCastclient from '../../classes/multicastclient.js'
import path from 'path'
import fetch from 'node-fetch'
import FormData from 'form-data'
import archiver from 'archiver'
import fs from 'fs' 



/**
 * ZIPs and sends all files from a CLIENTS workdirectory TO the registered exam SERVER
 * @param token the students token (needed to accept this "abgabe" request from the server)
 */
 router.get('/abgabe/send/:token', async (req, res, next) => {     
    const token = req.params.token
    const serverip = multiCastclient.clientinfo.serverip  //this is set if you are registered on a server
    const servername = multiCastclient.clientinfo.servername

    if ( !checkToken(token) ) { res.json({ status: "token is not valid" }); return }
    else {
        console.log(`token checked - preparing file to send to server: ${serverip}`)

        const browser = multiCastclient.browser
        if (browser) {  // it may or may not be active
            var pages = await browser.pages();
            if (pages[0]) {
                // evaluate will run the function in the page context
                await pages[0].evaluate(_ => { 
                    document.body.style.background = '#000';
                });
            }
        }
  
       
        //zip config.work directory
        let zipfilename = multiCastclient.clientinfo.name.concat('.zip')
        let zipfilepath = path.join(config.tempdirectory, zipfilename);
        await zipDirectory(config.workdirectory, zipfilepath)

        //append file data to form
        const form = new FormData()
        form.append(zipfilename, fs.createReadStream(zipfilepath), {
            contentType: 'application/zip',
            filename: zipfilename,
        });

        //post to server  (send param token in order to authenticate - the server only accepts files from registered students)
        fetch(`http://${serverip}:3000/server/data/receive/server/${servername}/${token}`, { method: 'POST', body: form })
            .then( response => response.json() )
            .then( async (data) => {
                console.log(data)
            });
        
        
    }
})










/**
 * Stores file(s) to the workdirectory (files coming FROM the SERVER (Questions, tasks)  )
 * @param token the students token - this has to be valid (coming from the examserver you registered) 
 * in order to process the request - DO NOT STORE FILES COMING from anywhere.. always check if token belongs to a registered student (or server)
 */
 router.post('/receive/:token', async (req, res, next) => {  
    const token = req.params.token
    if ( !checkToken(token) ) { res.json({ status: "token is not valid" }) }
    else {
        console.log("Receiving File(s)...")
        let errors = 0
        for (const [key, file] of Object.entries( req.files)) {
            let absoluteFilepath = path.join(config.workdirectory, file.name);
            file.mv(absoluteFilepath, (err) => {  
                if (err) { errors++; console.log( "client couldn't store file") }
                console.log( "file(s) received")
            });
        }
        res.json({sender: "client", message:"file(s) received", status: "success", errors: errors, client: multiCastclient.clientinfo  })
    }
})





/**
 * Stores file(s) to the workdirectory (files coming FROM the SERVER (Questions, tasks)  )
 * @param token the students token - this has to be valid (coming from the examserver you registered) 
 * in order to process the request - DO NOT STORE FILES COMING from anywhere.. always check if token belongs to a registered student (or server)
 */
 router.post('/store', async (req, res, next) => {  
    if (!requestSourceAllowed(req, res)) return //only allow this api route on localhost (same machine)
    
    const htmlContent = req.body.editorcontent
    const clientname = multiCastclient.clientinfo.name
    const htmlfile = path.join(config.workdirectory, clientname+".html");

    fs.writeFile(htmlfile, htmlContent, (err) => {if (err) console.log(err); });

    console.log("saving students work to disk...")
    let errors = 0
    for (const [key, file] of Object.entries( req.files)) {
        let absoluteFilepath = path.join(config.workdirectory, file.name);
        file.mv(absoluteFilepath, (err) => {  
        if (err) { errors++; console.log( "client couldn't store file") }
                console.log( "file(s) received")
        });
    }
    res.json({sender: "client", message:"file(s) saved", status: "success", errors: errors  })
    
})


/**
 * GET all files from workdirectory
 */ 
 router.post('/getfiles', function (req, res, next) {
    const workdir = path.join(config.workdirectory,"/")
    const filename = req.body.filename
    if (filename) {
        let filepath = path.join(workdir,filename)
        fs.readFile(filepath, 'utf8' , (err, data) => {
            if (err) {console.error(err);  return }
            return res.json( data )
        })
    }
    else {
        let files=  fs.readdirSync(workdir, { withFileTypes: true })
            .filter(dirent => dirent.isFile())
            .map(dirent => dirent.name)
            .filter( file => file.includes('html'))
        return res.send( files )
    }
})
  
  
  




export default router


/**
 * @param {String} sourceDir: /some/folder/to/compress
 * @param {String} outPath: /path/to/created.zip
 * @returns {Promise}
 */
 function zipDirectory(sourceDir, outPath) {
    const archive = archiver('zip', { zlib: { level: 9 }});
    const stream = fs.createWriteStream(outPath);
  
    return new Promise((resolve, reject) => {
      archive
        .directory(sourceDir, false)
        .on('error', err => reject(err))
        .pipe(stream)
      ;
  
      stream.on('close', () => resolve());
      archive.finalize();
    });
  }



/**
 * Checks if the token is valid in order to process api request
 * Attention: no all api requests check tokens atm!
 */
function checkToken(token){
    if (token === multiCastclient.clientinfo.token) {
        return true
    }
    return false
}

//do not allow requests from external hosts
function requestSourceAllowed(req,res){
    if (req.ip == "::1"  || req.ip == "127.0.0.1" || req.ip.includes('127.0.0.1') ){ 
      return true
    }  
    console.log(`Blocked request from remote Host: ${req.ip}`); 
    res.json('Request denied') 
    return false 
}
  
  
