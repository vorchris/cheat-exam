
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
import fs from 'fs' 

import i18n from '../../../../renderer/src/locales/locales.js'
const { t } = i18n.global




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
 * GET FILE-LIST from workdirectory
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






//do not allow requests from external hosts
function requestSourceAllowed(req,res){
    if (req.ip == "::1"  || req.ip == "127.0.0.1" || req.ip.includes('127.0.0.1') ){ 
      return true
    }  
    console.log(`Blocked request from remote Host: ${req.ip}`); 
    res.json('Request denied') 
    return false 
}
  
  
