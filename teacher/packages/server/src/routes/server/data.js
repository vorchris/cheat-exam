
import { Router } from 'express'
const router = Router()
import path  from 'path'
import config from '../../config.js'
import fs from 'fs' 
import extract from 'extract-zip'
import i18n from '../../../../renderer/src/locales/locales.js'
const { t } = i18n.global
 




/**
 * GET all files from workdirectory
 */ 
 router.post('/getfiles/:servername/:token', function (req, res, next) {
  
    const token = req.params.token
    const servername = req.params.servername
    const mcServer = config.examServerList[servername] // get the multicastserver object
   
    if ( token !== mcServer.serverinfo.servertoken ) { return res.json({ status: t("data.tokennotvalid") }) }
   
    
    // ATTENTION!  this currently only makes sense if the server(teacher) runs on the local computer in electron app (re-think for server version )
    const workdir = path.join(config.workdirectory,"/")
  
    
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
    
})












/**
 * Stores file(s) to the workdirectory (files coming FROM CLIENTS (finished EXAMS) )
 * @param token the students token - this has to be valid (coming from a registered user) 
 * in order to process the request - DO NOT STORE FILES COMING from anywhere.. always check if token belongs to a registered student (or server)
 * TODO: if receiver is "server" it should unzip and store with files with timestamp and username
 */
 router.post('/receive/:servername/:token', async (req, res, next) => {  
    const token = req.params.token
    const servername = req.params.servername
    const mcServer = config.examServerList[servername] // get the multicastserver object
  
    if ( !checkToken(token, mcServer ) ) { res.json({ status: t("data.tokennotvalid") }) }
    else {
        console.log("Server: Receiving File(s)...")
        let errors = 0
        
        if (req.files){
            for (const [key, file] of Object.entries( req.files)) {
                //console.log(file)
                let absoluteFilepath = path.join(config.workdirectory, file.name);
                if (file.name.includes(".zip")){  //ABGABE as ZIP
                    let time = new Date(new Date().getTime()).toISOString().substr(11, 8);
                    let studentname = ""
                    // get username
                    mcServer.studentList.forEach( (student) => {
                        if (token === student.token) {
                            studentname = student.clientname
                            console.log(student)
                        }
                    });
                    
                    // create user abgabe directory
                    let studentdirectory =  path.join(config.workdirectory, studentname)
                    if (!fs.existsSync(studentdirectory)){ fs.mkdirSync(studentdirectory);  }

                    // create archive directory
                    let studentarchivedir = path.join(studentdirectory, String(time))
                    if (!fs.existsSync(studentarchivedir)){ fs.mkdirSync(studentarchivedir); }

                    // extract zip file to archive
                    file.mv(absoluteFilepath, (err) => {  
                        if (err) { errors++; console.log( t("data.couldnotstore") ) }
                        extract(absoluteFilepath, { dir: studentarchivedir }).then( () => {
                            fs.unlink(absoluteFilepath, (err) => {
                                if (err) console.log(err);
                            });
                        }).catch( err => console.log(err))
                    });
                }
                else {
                    // this is another file (most likely a screenshot as we do not yet transfer other files)
                    file.mv(absoluteFilepath, (err) => {  
                        if (err) { errors++; console.log( t("data.couldnotstore") ) }
                    });
                }
            }
            res.json({ status:"success", sender: "server", message:t("data.filereceived"), errors: errors, clienttoken: token  })
        }
        else {
            res.json({ status:"error",  sender: "server", message:t("data.nofilereceived"), errors: errors, clienttoken: token  })
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