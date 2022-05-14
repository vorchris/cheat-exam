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

import express from "express"
import https from 'https'
import cors from 'cors'
import fileUpload from "express-fileupload";
import {clientRouter} from './routes/clientroutes.js' 
import config from './config.js';
import fsExtra from "fs-extra"
import path from 'path'
import ip from 'ip'

import fs from 'fs'
import os from 'os'
import forge from 'node-forge'
forge.options.usePureJavaScript = true; 
import defaultGateway from'default-gateway';



config.workdirectory = path.join(os.homedir(), config.examdirectory)
config.tempdirectory = path.join(os.tmpdir(), 'exam-tmp')
if (!fs.existsSync(config.workdirectory)){ fs.mkdirSync(config.workdirectory); }
if (!fs.existsSync(config.tempdirectory)){ fs.mkdirSync(config.tempdirectory); }


try {
    const {gateway, interface: iface} =  defaultGateway.v4.sync()
    config.hostip = ip.address(iface)    // this returns the ip of the interface that has a default gateway..  should work in MOST cases.  probably provide "ip-options" in UI ?
 }
 catch (e) {
   console.log(e)
   config.hostip = false
 }



if (typeof window !== 'undefined'){
    if (window.process.type == "renderer") config.electron = true
}

// clean temp directory
fsExtra.emptyDirSync(config.tempdirectory)



const api = express()
api.use(fileUpload())  //When you upload a file, the file will be accessible from req.files (init before routes)
api.use(cors())
api.use(express.json())
api.use(express.static('public'));
api.use(express.urlencoded({extended: true}));
api.use('/client', clientRouter)


let certs = createCACert()

var options = {
    key: certs.key,
    cert: certs.cert,
    requestCert: false,
    rejectUnauthorized: false,
    agent: false
  };

const server = https.createServer(options, api);

export default server;


function createCACert() {
    let rsa =  forge.pki.rsa;
    let pki = forge.pki;
    let seed = forge.random.getBytesSync(32);
    let keys = rsa.generateKeyPair({bits: 1024, seed: seed});
    var cert = pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.privateKey = keys.privateKey;
    cert.sign(keys.privateKey);
    var pem_pkey = pki.privateKeyToPem(keys.privateKey);
    var pem_cert = pki.certificateToPem(cert);
    return {key: pem_pkey , cert: pem_cert}
};
