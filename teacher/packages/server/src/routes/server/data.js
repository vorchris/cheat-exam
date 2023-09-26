
/**
 * @license GPL LICENSE
 * Copyright (c) 2021-2023 Thomas Michael Weissel
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
import config from '../../../../main/config.js'
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
    const dir =req.body.dir
    
    if ( token !== mcServer.serverinfo.servertoken ) { return res.json({ status: t("data.tokennotvalid") }) }
   
    let folders = []
    folders.push( {currentdirectory: dir, parentdirectory: path.dirname(dir)}) // so this information is always on filelist[0] >> not the most robust idea
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
    let warning = false

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
    console.log(studentfolders)

    // get latest directory of every student (add to array)
    let latestfolders = []
    for (let studentdir of studentfolders) {
        let latest = {path:"00_00_00", time:"1000000000000"}  // we need this for reference
        fs.readdirSync(studentdir.path).reduce(function (list, file) {
            const filepath = path.join(studentdir.path, file);
            if (fs.statSync(filepath).isDirectory()) {
                let filetime = fs.statSync(filepath).mtime.getTime()
                if ( !file.includes("focus") ){
                    if (filetime > latest.time ) { // this cycles over all found student directories (16_50_01, 16_50_23, 16_50_44, ..) and compares filedates - returns only the newest directory
                        latest.time = filetime
                        latest.path = file
                    }
                }
            }
        }, []);
        if (latest.time === "1000000000000") {continue} 

        //check if the newest directory is older than 5 minutes..  warn the teacher!
        const now = Date.now(); // Current time in milliseconds since the UNIX epoch
        const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
        if (now - latest.time > fiveMinutes) {
            warning = true
            console.log('The file is older than 5 minutes.');
        } 
  

        const filepath = path.join(studentdir.path, latest.path);
        latestfolders.push( { path: filepath, parent : studentdir.name })  // we store studentdir.name here because in the next step we need to make sure only the main.pdf (studentsname) is used
    }
    //console.log(latestfolders)

    // get PDFs from latest directories 
    let files = []
    for (let folder of latestfolders) {
        fs.readdirSync(folder.path).reduce(function (list, file) {
            const filepath = path.join(folder.path, file);
            if(fs.statSync(filepath).isFile() ){
                let ext = path.extname(file).toLowerCase()
                if (ext === ".pdf" && (file === `${folder.parent}.pdf` || file.includes(folder.parent))){  // folder.parent contains the studentfolder (and main file) name
                    files.push(filepath)   // we also allow files here that aren't exactly what we want but close (backup plan just in case saving files didn't work for the student and we needed to chose a different name)
                } 
            }
        }, []);
    }
    // now create one merged pdf out of all files
    if (files.length === 0) {
        return res.json({warning: warning, pdfBuffer: null})
    }
    else {
        let PDF = await concatPages(files)
        let pdfBuffer = Buffer.from(PDF) 
          
        return res.json({warning: warning, pdfBuffer:pdfBuffer });

        //res.set('Content-Type', 'application/pdf');
        //return res.send( Buffer.from(PDF) )
    }
})
















/**
 * GET a latest work from specific Student
 */ 
 router.post('/getLatestFromStudent/:servername/:token/:student', async function (req, res, next) {
    const token = req.params.token
    const servername = req.params.servername
    const student = req.params.student
    const mcServer = config.examServerList[servername] // get the multicastserver object
    let warning = false

    if ( token !== mcServer.serverinfo.servertoken ) { return res.json({ status: t("data.tokennotvalid") }) }
    
    let dir =  path.join( config.workdirectory, mcServer.serverinfo.servername, student.clientname);


    // get latest directory of student 

    let latest = {path:"00_00_00", time:"1000000000000"}  // we need this for reference
    fs.readdirSync(dir).reduce(function (list, file) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            let filetime = fs.statSync(filepath).mtime.getTime()
            if ( !file.includes("focus") ){
                if (filetime > latest.time ) { // this cycles over all found student directories (16_50_01, 16_50_23, 16_50_44, ..) and compares filedates - returns only the newest directory
                    latest.time = filetime
                    latest.path = file
                }
            }
        }
    }, []);


     if (latest.time === "1000000000000") { console.log("no new folder found")} 

    //check if the newest directory is older than 5 minutes..  warn the teacher!
    const now = Date.now(); // Current time in milliseconds since the UNIX epoch
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    if (now - latest.time > fiveMinutes) {
        warning = true
        console.log('The file is older than 5 minutes.');
    } 
  

    const filepath = path.join(studentdir.path, latest.path);
    latestfolder = { path: filepath, parent : studentdir.name })  // we store studentdir.name here because in the next step we need to make sure only the main.pdf (studentsname) is used




    //console.log(latestfolders)

    // get PDFs from latest directories 
    let files = []
    for (let folder of latestfolders) {
        fs.readdirSync(folder.path).reduce(function (list, file) {
            const filepath = path.join(folder.path, file);
            if(fs.statSync(filepath).isFile() ){
                let ext = path.extname(file).toLowerCase()
                if (ext === ".pdf" && (file === `${folder.parent}.pdf` || file.includes(folder.parent))){  // folder.parent contains the studentfolder (and main file) name
                    files.push(filepath)   // we also allow files here that aren't exactly what we want but close (backup plan just in case saving files didn't work for the student and we needed to chose a different name)
                } 
            }
        }, []);
    }
    // now create one merged pdf out of all files
    if (files.length === 0) {
        return res.json({warning: warning, pdfBuffer: null})
    }
    else {
        let PDF = await concatPages(files)
        let pdfBuffer = Buffer.from(PDF) 
          
        return res.json({warning: warning, pdfBuffer:pdfBuffer });

        //res.set('Content-Type', 'application/pdf');
        //return res.send( Buffer.from(PDF) )
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
 * DELETE File from EXAM directory
 */ 
 router.post('/delete/:servername/:token', function (req, res, next) {
    const token = req.params.token
    const servername = req.params.servername
    const mcServer = config.examServerList[servername] // get the multicastserver object
    if ( token !== mcServer.serverinfo.servertoken ) { return res.json({ status: t("data.tokennotvalid") }) }

  
    const filepath = req.body.filepath
    if (filepath) { //return specific file
        if (fs.statSync(filepath).isDirectory()){
            fs.rmSync(filepath, { recursive: true, force: true });
        }
        else {
            fs.unlink(filepath, (err) => { if (err) console.log(err); })
        }
        res.json({ status:"success", sender: "server", message:t("data.fdeleted"),  })
    }
})





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
 * Can be triggered by TEACHER (dashboard explorer) or STUDENT (filerequest)
 * @param filename if set the content of the file is returned
 */ 
 router.post('/download/:servername/:token', async (req, res, next) => {
    const token = req.params.token
    const servername = req.params.servername
    const mcServer = config.examServerList[servername] // get the multicastserver object
    const type = req.body.type  // file, dir, studentfilerequest
    const filename = req.body.filename
    const filepath = req.body.path
    const files = req.body.files  // in case of studentfilerequest 'files' is an array of fileobjects [ {name:file.name, path:file.path }, {name:file.name, path:file.path } ] 

    if ( token !== mcServer.serverinfo.servertoken && !checkToken(token, mcServer )) { return res.json({ status: t("data.tokennotvalid") }) }
   

   
    if (type === "studentfilerequest") {
        // if this request came from a student reset studentstatus
        let student = mcServer.studentList.find(element => element.token === token) // get student from token
        if (student) {  
            student.status['fetchfiles'] = false  //reset filerequest status for student // it is theoretically possible that the client sends a second file request and fetches the file twice before this setting is reset but i guess this doen't really matter
            student.status['files'] = []          // therer is no control system in place to re-check if the file was actually received
            res.zip({files: files});  
        } 
    }  
    else if (type === "file") {
            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.download(filepath);  
    }
    else if (type === "dir") {
        //zip folder and then send
        let zipfilename = filename.concat('.zip')
        let zipfilepath = path.join(config.tempdirectory, zipfilename);
        await zipDirectory(filepath, zipfilepath)
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
     
        let time = new Date(new Date().getTime()).toLocaleTimeString();  //convert to locale string otherwise the foldernames will be created in UTC
      
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


/**
 * UPLOADS Files from the Teacher Frontend and 
 * stores the files into the workdirectory
 * then updates student.status.fetchfiles in order to trigger a filerequest from the student(s) 
 */

router.post('/upload/:servername/:servertoken/:studenttoken', async (req, res, next) => {  
    const servertoken = req.params.servertoken
    const servername = req.params.servername
    const mcServer = config.examServerList[servername] // get the multicastserver object
    const studenttoken = req.params.studenttoken

    if ( servertoken !== mcServer.serverinfo.servertoken ) { return res.json({ status: t("data.tokennotvalid") }) }

    // create user abgabe directory
    let uploaddirectory =  path.join(config.workdirectory, mcServer.serverinfo.servername, 'UPLOADS')
    if (!fs.existsSync(uploaddirectory)){ fs.mkdirSync(uploaddirectory, { recursive: true });  }


    if (req.files){
        let filesArray = []  // depending on the number of files this comes as array of objects or object
        if (!Array.isArray(req.files.files)){ filesArray.push(req.files.files)}
        else {filesArray = req.files.files}

        let files = []        
    
        for await (let file of  filesArray) {
            let filename = decodeURIComponent(file.name)  //encode to prevent non-ascii chars weirdness
            let absoluteFilepath = path.join(uploaddirectory, filename);
            await file.mv(absoluteFilepath, (err) => {  
                if (err) { console.log( t("data.couldnotstore") ) }
            }); 
            files.push({ name:filename , path:absoluteFilepath });
        }

       
        // inform students about this send-file request so that they trigger a download request for the given files
        if (studenttoken === "all"){
            for (let student of mcServer.studentList){ 
                student.status['fetchfiles'] = true  
                student.status['files'] =  files
            }
        }
        else {
            let student = mcServer.studentList.find(element => element.token === studenttoken)
            if (student) {  
                student.status['fetchfiles']= true 
                student.status['files'] = files
            }   
        }
        res.json({ status:"success", sender: "server", message:t("data.filereceived")  })
    }
    else {
        res.json({ status:"error",  sender: "server", message:t("data.nofilereceived") })
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