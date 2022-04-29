
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
import path  from 'path'
import config from '../../config.js'
import fs from 'fs' 
import extract from 'extract-zip'
import i18n from '../../../../renderer/src/locales/locales.js'
const { t } = i18n.global
import archiver from 'archiver'
import { PDFDocument } from 'pdf-lib/dist/pdf-lib.js'  // we import the complied version otherwise we get 1000 sourcemap warnings
 



/**
 * GET a FILE-LIST from workdirectory
 */ 
 router.post('/getfiles/:servername/:token', function (req, res, next) {
    const token = req.params.token
    const servername = req.params.servername
    const mcServer = config.examServerList[servername] // get the multicastserver object
    if ( token !== mcServer.serverinfo.servertoken ) { return res.json({ status: t("data.tokennotvalid") }) }

  
    const dir =req.body.dir
    console.log(dir)

    // ATTENTION!  this currently only makes sense if the server(teacher) runs on the local computer in electron app (re-think for server version )
    let folders = []
    folders.push( {currentdirectory: dir, parentdirectory: path.dirname(dir)})
    fs.readdirSync(dir).reduce(function (list, file) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            folders.push( { path: filepath, name : file, type : "dir", ext: "", parent: dir })
        }
        else if(fs.statSync(filepath).isFile() ){
            let ext = path.extname(file).toLowerCase()
            folders.push({  path: filepath, name : file, type : "file", ext: ext, parent: '' })
        }
    }, []);
    return res.send( folders )
})





/**
 * GET a latest work from all students
 * This API Route creates a list of the latest pdf filepaths of all connected students
 * and concats each of the pdfs to one
 */ 
 router.post('/getlatest/:servername/:token', async function (req, res, next) {
    const token = req.params.token
    const servername = req.params.servername
    const mcServer = config.examServerList[servername] // get the multicastserver object
    if ( token !== mcServer.serverinfo.servertoken ) { return res.json({ status: t("data.tokennotvalid") }) }

    let dir =  path.join( config.workdirectory, mcServer.serverinfo.servername);

    // get all studentdirectories from workdirectory
    let studentfolders = []
    fs.readdirSync(dir).reduce(function (list, file) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            studentfolders.push({ path: filepath, name : file })
        }
    }, []);
    //console.log(studentfolders)

    // get latest directory of every student (add to array) ATTENTION: this only works with the current file/folder name scheme 
    // DO NOT CHANGE /Clientname/11:02:23 - or better get real filedate and make it more robust
    let latestfolders = []
    for (let studentdir of studentfolders) {
        let latest = {path:"00_00_00", time:"1000000000000"}  // we need this for reference
        fs.readdirSync(studentdir.path).reduce(function (list, file) {
            const filepath = path.join(studentdir.path, file);
            if (fs.statSync(filepath).isDirectory()) {
                let filetime = fs.statSync(filepath).mtime.getTime()
                if ( !file.includes("focus") ){
                    if (filetime > latest.time ) { 
                        latest.time = filetime
                        latest.path = file
                    }
                }
            }
        }, []);
        if (latest.time === "1000000000000") {continue}
        const filepath = path.join(studentdir.path, latest.path);
        latestfolders.push( { path: filepath, parent : studentdir.name })  // we store studentdir.name here because in the next step we need to make sure only the main.pdf (studentsname) is used
    }
    console.log(latestfolders)

    // get PDFs from latest directories 
    let files = []
    for (let folder of latestfolders) {
        fs.readdirSync(folder.path).reduce(function (list, file) {
            const filepath = path.join(folder.path, file);
            if(fs.statSync(filepath).isFile() ){
                let ext = path.extname(file).toLowerCase()
                if (ext === ".pdf" && file === `${folder.parent}.pdf`){  // folder.name contains the studentfolder (and main file) name
                    files.push(filepath)
                } 
            }
        }, []);
    }
    //console.log(files)

    // now create one merged pdf out of all files
    if (files.length === 0) {
        return res.send()
    }
    else {
        let PDF = await concatPages(files)
        res.set('Content-Type', 'application/pdf');
        return res.send( Buffer.from(PDF) )
    }
})






async function concatPages(pdfsToMerge) {
    // Create a new PDFDocument
    const tempPDF = await PDFDocument.create();
    for (const pdfpath of pdfsToMerge) { 
        let pdfBytes = fs.readFileSync(pdfpath);
        const pdf = await PDFDocument.load(pdfBytes); 
        const copiedPages = await tempPDF.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
            tempPDF.addPage(page); 
        }); 
    } 
    // Serialize the PDFDocument to bytes (a Uint8Array)
    const finalPDF = await tempPDF.save()
    return finalPDF
}

















/**
 * GET PDF from EXAM directory
 * @param filename if set the content of the file is returned
 */ 
 router.post('/getpdf/:servername/:token', function (req, res, next) {
    const token = req.params.token
    const servername = req.params.servername
    const mcServer = config.examServerList[servername] // get the multicastserver object
    if ( token !== mcServer.serverinfo.servertoken ) { return res.json({ status: t("data.tokennotvalid") }) }

    const filename = req.body.filename
    if (filename) { //return specific file
        res.sendFile(filename); 
    }
})



/**
 * GET ANY File/Folder from EXAM directory - download !
 * @param filename if set the content of the file is returned
 */ 
 router.post('/download/:servername/:token', async (req, res, next) => {
    const token = req.params.token
    const servername = req.params.servername
    const mcServer = config.examServerList[servername] // get the multicastserver object
    if ( token !== mcServer.serverinfo.servertoken ) { return res.json({ status: t("data.tokennotvalid") }) }

    console.log(req.body)
    const filename = req.body.filename
    const filepath = req.body.path
    const type = req.body.type

    if (type === "file") {
            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.download(filepath, filename);       
    }
    else if (type === "dir") {
        //zip folder and then send
    
        let zipfilename = filename.concat('.zip')
        let zipfilepath = path.join(config.tempdirectory, zipfilename);
        await zipDirectory(filepath, zipfilepath)

        console.log(zipfilepath)

        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.download(zipfilepath,filename); 
    }
 
})








/**
 * Stores file(s) to the workdirectory (files coming FROM CLIENTS (finished EXAMS) )
 * @param studenttoken the students token - this has to be valid (coming from a registered user) 
 * @param servername the server-exam instance the students token belongs to
 * in order to process the request - DO NOT STORE FILES COMING from anywhere.. always check if token belongs to a registered student (or server)
 */
 router.post('/receive/:servername/:studenttoken', async (req, res, next) => {  
    const studenttoken = req.params.studenttoken
    const servername = req.params.servername
    const mcServer = config.examServerList[servername] // get the multicastserver object
  
    if ( !checkToken(studenttoken, mcServer ) ) { res.json({ status: t("data.tokennotvalid") }) }
    else {
        console.log("Server: Receiving File(s)...")
        let errors = 0
        let time = new Date(new Date().getTime()).toISOString().substr(11, 8);
        let student = mcServer.studentList.find(element => element.token === studenttoken) // get student from token
        
        if (req.files){
            for (const [key, file] of Object.entries( req.files)) {
                let absoluteFilepath = path.join(config.workdirectory, mcServer.serverinfo.servername, file.name);
                if (file.name.includes(".zip")){  //ABGABE as ZIP
                    
                    
                    // create user abgabe directory
                    let studentdirectory =  path.join(config.workdirectory, mcServer.serverinfo.servername, student.clientname)
                    if (!fs.existsSync(studentdirectory)){ fs.mkdirSync(studentdirectory, { recursive: true });  }

                    // create archive directory
                    let tstring = String(time).replace(/:/g, "_");
                    let studentarchivedir = path.join(studentdirectory, tstring)
                    if (!fs.existsSync(studentarchivedir)){ fs.mkdirSync(studentarchivedir, { recursive: true }); }

                    // extract zip file to archive
                    file.mv(absoluteFilepath, (err) => {  
                        if (err) { errors++; console.log( t("data.couldnotstore") ) }
                        else {
                            extract(absoluteFilepath, { dir: studentarchivedir }).then( () => {
                                if (student) {  student.status['sendexam']= false  } //we received the exam - remove exam request from student status
                                fs.unlink(absoluteFilepath, (err) => { if (err) console.log(err); }); // remove zip file after extracting
                            }).catch( err => console.log(err))
                        }                     
                    });
                }
                else { // this is another file (most likely a screenshot as we do not yet transfer other files)
                    file.mv(absoluteFilepath, (err) => {  
                        if (err) { errors++; console.log( t("data.couldnotstore") ) }
                    });
                }
            }
            res.json({ status:"success", sender: "server", message:t("data.filereceived"), errors: errors  })
        }
        else {
            res.json({ status:"error",  sender: "server", message:t("data.nofilereceived"), errors: errors })
        }
    }
})




export default router



/**
 * Checks if the token is valid in order to process api request
 * Attention: no all api requests check tokens atm!
 */
 function checkToken(token, mcserver){
    
        let tokenexists = false
        console.log("checking if student is registered on this server")
        mcserver.studentList.forEach( (student) => {
            if (token === student.token) {
                tokenexists = true
            }
        });
        return tokenexists
  
  }



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