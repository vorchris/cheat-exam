
/**
 * @license GPL LICENSE
 * Copyright (c) 2021-2022 Thomas Michael Weissel
 * 
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or any later version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <http://www.gnu.org/licenses/>
 */

import { Router } from 'express'
const router = Router()
import config from '../../config.js'
import multiCastclient from '../../classes/multicastclient.js'
import path from 'path'
import FormData from 'form-data/lib/form_data.js'
import archiver from 'archiver'
import fs from 'fs' 
import axios from "axios"
import { BrowserWindow } from 'electron'  // we use this to talk to the electron ipcMain process (send signals)
import fsExtra from "fs-extra"
import i18n from '../../../../renderer/src/locales/locales.js'
const { t } = i18n.global


/**
 * ZIPs and sends all files from a CLIENTS workdirectory TO the registered exam SERVER
 * @param token the students token (needed to accept this "abgabe" request from the server)
 */
 router.post('/abgabe/send/:token', async (req, res, next) => { 
    console.log("request received")    
    const token = req.params.token
    const serverip = multiCastclient.clientinfo.serverip  //this is set if you are registered on a server
    const servername = multiCastclient.clientinfo.servername

    if ( !checkToken(token) ) { return res.json({ sender: "client", message:t("data.tokennotvalid"), status: "error" })}
    else {
        console.log(`token checked - preparing file to send to server: ${serverip}`)

        //send save trigger to exam window
        let windows  = BrowserWindow.getAllWindows()
        for (let win of windows){
            win.webContents.send('save')
        } 
        // give it some time
        await sleep(1000)  // wait one second before zipping workdirectory (give save some time - unfortunately we have no way to wait for save - we could check the filetime in a "while loop" though)

        //zip config.work directory
        if (!fs.existsSync(config.tempdirectory)){ fs.mkdirSync(config.tempdirectory); }
        //fsExtra.emptyDirSync(config.tempdirectory)
        let zipfilename = multiCastclient.clientinfo.name.concat('.zip')
       


        let zipfilepath = path.join(config.tempdirectory, zipfilename);
        await zipDirectory(config.workdirectory, zipfilepath)
        let file = await fs.readFileSync(zipfilepath);
        const form = new FormData()

        if (config.electron){
            let blob =  new Blob( [ new Uint8Array(file).buffer], { type: 'application/zip' })
            form.append(zipfilename, blob, zipfilename );
        } 
        else {
            form.append(zipfilename, file, {contentType: 'application/zip', filename: zipfilename });
        }

        axios({
            method: "post", 
            url: `https://${serverip}:${config.serverApiPort}/server/data/receive/${servername}/${token}`, 
            data: form, 
            headers: { 'Content-Type': `multipart/form-data; boundary=${form._boundary}` }  
        })
        .then(response =>{
            if (response.status === "success"){
                res.json({ sender: "client", message:response.data.message, status: "success",  errors: response.data.errors, clienttoken: response.data.clienttoken })  //we actually send the servers (backend) response back to the server (frontend)
            }
            else {
                res.json({ sender: "client", message:response.data.message, status: "error", errors: response.data.errors, clienttoken: response.data.clienttoken })  //we actually send the servers (backend) response back to the server (frontend)
            } 
        }).catch( err =>{console.log(`ClientData API: ${err}`) })
    }
})










/**
 * Stores file(s) to the workdirectory (files coming FROM the SERVER (Questions, tasks)  )
 * @param token the students token - this has to be valid (coming from the examserver you registered) 
 * in order to process the request - DO NOT STORE FILES COMING from anywhere.. always check if token belongs to a registered student (or server)
 */
 router.post('/receive/:token', async (req, res, next) => {  
    const token = req.params.token
    if ( !checkToken(token) ) { return res.json({ sender: "client", message:t("data.tokennotvalid"), status: "error" })}  //only accept files with valid token (coming from the server)
    if ( !req.files) { return res.send({sender: "client", message:t("data.nofiles"), status:"error"});  }

    console.log("receiving file(s)...")
    let errors = 0
   
    let filesArray = []  // depending on the number of files this comes as array of objects or object
    if (!Array.isArray(req.files.files)){ filesArray.push(req.files.files)}
    else {filesArray = req.files.files}

    filesArray.forEach(file => {
        let absoluteFilepath = path.join(config.workdirectory, file.name);
        file.mv(absoluteFilepath, (err) => {  
            if (err) { errors++; console.log( "client couldn't store file") }
            console.log( "file(s) received")
        });
    })
    
    res.json({sender: "client", message:t("data.filereceived"), status: "success", errors: errors, client: multiCastclient.clientinfo  })
    
})




/**
 * Stores file(s) to the workdirectory (files coming FROM the EDITOR  )
 * Only store file if request source is local
 */
 router.post('/store', async (req, res, next) => {  
    if (!requestSourceAllowed(req, res)) return //only allow this api route on localhost (same machine)
    
    const htmlContent = req.body.editorcontent
    const currentfilename = req.body.currentfilename
    const htmlfilename = currentfilename ? currentfilename +".html" : multiCastclient.clientinfo.name +".html"
    const htmlfile = path.join(config.workdirectory, htmlfilename);
    const pdffilename = currentfilename ? currentfilename +".pdf" : multiCastclient.clientinfo.name +".pdf"
    const pdffilepath = path.join(config.workdirectory, pdffilename);
    const savedate = req.body.savedate

    if (htmlContent) { 
        console.log("saving students work to disk...")

        fs.writeFile(htmlfile, htmlContent, (err) => {if (err) console.log(err); }); 


        for (const [key, file] of Object.entries( req.files)) {
            let absoluteFilepath = path.join(config.workdirectory, file.name);
            file.mv(absoluteFilepath, (err) => {  
            if (err) { errors++; console.log( "client couldn't store file") }
                  
            });
        }


        return res.json({sender: "client", message:t("data.filestored"), status: "success"  })
    }
    else {
        console.log("saving students work to disk...")
        for (const [key, file] of Object.entries( req.files)) {
            let absoluteFilepath = path.join(config.workdirectory, file.name);
            file.mv(absoluteFilepath, (err) => {  
                if (err) { errors++; console.log( "client couldn't store file") }
            });
        }


        return res.json({sender: "client", message:t("data.filestored"), status: "success"  })


    }


})


/**
 * GET all files from workdirectory
 * @param filename if set the content of the file is returned
 */ 
 router.post('/getfiles', function (req, res, next) {
    if (!requestSourceAllowed(req, res)) return //only allow this api route on localhost (same machine)

    const workdir = path.join(config.workdirectory,"/")
    const filename = req.body.filename
    if (filename) { //return content of specific file (html only)
        let filepath = path.join(workdir,filename)
        fs.readFile(filepath, 'utf8' , (err, data) => {
            if (err) {console.error(err);  return }

            return res.json( data )
        })
    }
    else {  // return file list of exam directory
        let filelist =  fs.readdirSync(workdir, { withFileTypes: true })
            .filter(dirent => dirent.isFile())
            .map(dirent => dirent.name)
            .filter( file => path.extname(file).toLowerCase() === ".pdf" || path.extname(file).toLowerCase() === ".html" || path.extname(file).toLowerCase() === ".mtml")
        
        let files = []
        filelist.forEach( file => {
             let type = ""
             if  (path.extname(file).toLowerCase() === ".pdf"){ files.push( {name: file, type: "pdf"})   }
             else if  (path.extname(file).toLowerCase() === ".html"){ files.push( {name: file, type: "html"})   }
             else if  (path.extname(file).toLowerCase() === ".mtml"){ files.push( {name: file, type: "mtml"})   }  // imaginary multiple choice testformat from the future
            
        })
        
        return res.send( files )
    }
})
  


/**
 * GET PDF from EXAM directory
 * @param filename if set the content of the file is returned
 */ 
 router.post('/getpdf', function (req, res, next) {
    if (!requestSourceAllowed(req, res)) return //only allow this api route on localhost (same machine)

    const workdir = path.join(config.workdirectory,"/")
    const filename = req.body.filename
    if (filename) { //return content of specific file
        let filepath = path.join(workdir,filename)
        res.sendFile(filepath); 
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

// timeout 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
  
  
