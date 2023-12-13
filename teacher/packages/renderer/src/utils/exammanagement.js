import axios from "axios"
import FormData from 'form-data'
import log from 'electron-log/renderer';


// enable exam mode 
function startExam(){
    this.lockscreens(false, false); // deactivate lockscreen
    this.serverstatus.exammode = true;
    log.info("starting exammode")
    this.visualfeedback(this.$t("dashboard.startexam"))
    this.setServerStatus()
}


// disable exammode 
function endExam(){
    this.getFiles('all') // fetch files from students before ending exam for everybody
    this.$swal.fire({
        title: this.$t("dashboard.sure"),
        html: `<div>
            <input class="form-check-input" type="checkbox" id="checkboxdel">
            <label class="form-check-label" for="checkboxdel"> ${this.$t("dashboard.exitdelete")} </label>
            <br><br>
            <span>${this.$t("dashboard.exitkiosk")}</span>
        </div>`,
        icon: "question",
        showCancelButton: true,
        cancelButtonText: this.$t("dashboard.cancel"),
        reverseButtons: true,
        preConfirm: () => {
            this.serverstatus.delfolderonexit = document.getElementById('checkboxdel').checked; 
        }
    })
    .then((result) => {
        if (result.isConfirmed) {
            this.serverstatus.exammode = false;
            this.lockscreens(false, false); // deactivate lockscreen
            this.setServerStatus()
        } 
    }); 
}



//remove student from exam
function kick(studenttoken, studentip){
    if ( this.studentlist.length <= 0 ) { this.status(this.$t("dashboard.noclients")); return; }
    
    this.$swal.fire({
        title: this.$t("dashboard.sure"),
        text:  this.$t("dashboard.reallykick"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("dashboard.cancel"),
        reverseButtons: true
    })
    .then((result) => {
        if (result.isConfirmed) {
                //unregister locally
            axios.get(`https://${this.serverip}:${this.serverApiPort}/server/control/kick/${this.servername}/${this.servertoken}/${studenttoken}`)
            .then( response => {
                log.info(response.data);
                this.status(response.data.message);
            }).catch(error => {log.error(error)});
        } 
    });  
}



//restore focus state for specific student -- we tell the client that his status is restored which will then (on the next update) update it's focus state on the server 
function restore(studenttoken){
    this.visualfeedback(this.$t("dashboard.restore"),2000)
    axios.get(`https://${this.serverip}:${this.serverApiPort}/server/control/restore/${this.servername}/${this.servertoken}/${studenttoken}`)
        .then( response => { log.info(response.data)  })
        .catch( err => {log.error(err)});
}



function setAbgabeInterval(){
    if (!this.autoabgabe) {
        this.$swal.fire({
            title: this.$t("dashboard.abgabeauto"),
            icon: 'question',
            input: 'range',
            html: `${this.$t("dashboard.abgabeautoquestion")} <br>  ${this.$t("dashboard.abgabeautohint")}`,
            inputAttributes: {
                min: 1,
                max: 20,
                step: 1
            },
            inputValue: this.abgabeintervalPause
        }).then((result) => {
            const inputInteger = parseInt(result.value, 10); // Convert to integer
            this.abgabeintervalPause = inputInteger
            if (!this.abgabeintervalPause || !Number.isInteger(this.abgabeintervalPause) ){  // make sure it is set otherwise we well fetch the exams X times per second
                log.warn("something wrong with interval frequency - setting to default")
                this.abgabeintervalPause = 5
            }   
            log.info("starting submission intervall", this.abgabeintervalPause)
            this.abgabeinterval = setInterval(() => { this.getFiles('all') }, 60000 * this.abgabeintervalPause) //trigger getFiles('all') every other minute
        })
    }
    else {
        log.info(this.abgabeinterval)
        log.info("stopping submission interval")
        clearInterval( this.abgabeinterval); 
    }
}


// get finished exams (ABGABE) from students
function getFiles(who, feedfack=false, quiet=false){
    this.checkDiscspace()
    if ( this.studentlist.length <= 0 ) { this.status(this.$t("dashboard.noclients")); log.warn("no clients connected"); return; }

    if (this.serverstatus.examtype === "microsoft365"){ //fetch files from onedrive
        this.downloadFilesFromOneDrive()
        if (feedfack){ this.visualfeedback(this.$t("dashboard.examrequest"), 2000) }
        else { 
            if (quiet) {return}  //completely quiet
            this.status(this.$t("dashboard.examrequest")); 
        }
    }
    else { // fetch files from clients
        axios.get(`https://${this.serverip}:${this.serverApiPort}/server/control/fetch/${this.servername}/${this.servertoken}/${who}`)  //who is either all or token
        .then( async (response) => { 
            if (feedfack){ this.visualfeedback(response.data.message, 2000) } // we do not want intrusive feedback on automated tasks })
            else { 
                if (quiet) {return}  //completely quiet
                this.status(response.data.message); 
            } })  
        .catch( err => {log.error(err)});
    }
}




 //sets a new screenshot update interval - the value is sent to the students and then used to update the screenshots
 function setScreenshotInterval(){
    this.$swal.fire({
        title: this.$t("dashboard.screenshottitle"),
        icon: 'question',
        input: 'range',
        html: `${this.$t("dashboard.screenshotquestion")} <br>  ${this.$t("dashboard.screenshothint")}`,
        inputAttributes: {
            min: 0,
            max: 60,
            step: 4
        },
        inputValue: this.serverstatus.screenshotinterval
    }).then((result) => {
        const inputInteger = parseInt(result.value, 10); // Convert to integer
        this.serverstatus.screenshotinterval= inputInteger
        if (this.serverstatus.screenshotinterval == 0) { document.getElementById("screenshotinterval").checked = false }
        else { document.getElementById("screenshotinterval").checked = true}
        if (!this.serverstatus.screenshotinterval || !Number.isInteger(this.serverstatus.screenshotinterval)){this.serverstatus.screenshotinterval = 4}

        // WRITE screenshotinterval serverstatus ojbect so it can be retrieved on the next student update 
        this.setServerStatus()
    })  
}


// temporarily lock screens
function lockscreens(state, feedback=true){
    if (this.studentlist.length === 0) { this.status(this.$t("dashboard.noclients")); return;}
    if (state === false) { this.serverstatus.screenslocked = false; if (feedback) { this.visualfeedback(this.$t("dashboard.unlock")); } }   // the feedback interferes with endexam screen
    else { this.serverstatus.screenslocked = true; this.visualfeedback(this.$t("dashboard.lock"))} 
    this.setServerStatus()
}




//upload files to all students
function sendFiles(who) {
    if (this.studentlist.length === 0) { this.status(this.$t("dashboard.noclients")); return;}
    this.$swal.fire({
        title: this.$t("dashboard.filesend"),
        text: this.$t("dashboard.filesendtext"),
        icon: "info",
        input: 'file',
        showCancelButton: true,
        cancelButtonText: this.$t("dashboard.cancel"),
        reverseButtons: true,
        inputAttributes: {
            type: "file",
            name:"files",
            id: "swalFile",
            class:"form-control",
            multiple:"multiple",
            accept: ".pdf, .bak"
        }
    })
    .then((input) => {
        this.files = input.value
        if (!this.files) { this.status(this.$t("dashboard.nofiles")); return }
        this.status(this.$t("dashboard.uploadfiles"));

        //create a new form
        const formData = new FormData()
        formData.append('servertoken', this.servertoken);
        formData.append('servername', this.servername);

        for (const i of Object.keys(this.files)) {
            let filename = encodeURIComponent(this.files[i].name) // we need to encode the filename because sending formdata encodes non-ASCII characters in a not reversable way
            formData.append('files', this.files[i], filename)  // single file is sent as object.. multiple files as array..
        }
        
        axios({
            method: "post", 
            url: `https://${this.serverip}:${this.serverApiPort}/server/data/upload/${this.servername}/${this.servertoken}/${who}`, 
            data: formData, 
        })
        .then( (response) => {log.info(response.data) })
        .catch( err =>{ log.error(`${err}`) })
    });    
}


//this just keeps the state of the toggle
function toggleScreenshot(){
    if (this.screenshotinterval == 0) { document.getElementById("screenshotinterval").checked = false }
    else { document.getElementById("screenshotinterval").checked = true}
}



/** 
 * Stop and Exit Exam Server Instance
 */
function stopserver(){
    this.$swal.fire({
        title: this.$t("dashboard.exitexamsure"),
        text:  this.$t("dashboard.exitexam"),
        icon: "question",
        showCancelButton: true,
        cancelButtonText: this.$t("dashboard.cancel"),
        reverseButtons: true
    })
    .then((result) => {
        if (result.isConfirmed) {
            axios.get(`https://${this.serverip}:${this.serverApiPort}/server/control/stopserver/${this.servername}/${this.servertoken}`)
            .then( async (response) => {
                this.status(response.data.message);
                //log.info(response.data);
                await this.sleep(2000);
                this.$router.push({ path: '/startserver' })
            }).catch( err => {log.error(err)});
        } 
    });    
}


        // show warning
function delfolderquestion(){
    if (this.studentlist.length === 0) { this.status(this.$t("dashboard.noclients")); return;}
    this.$swal.fire({
        title: this.$t("dashboard.attention"),
        text:  this.$t("dashboard.delsure"),
        icon: "question",
        showCancelButton: true,
        cancelButtonText: this.$t("dashboard.cancel"),
        reverseButtons: true,
        
    })
    .then((result) => {
        if (result.isConfirmed) {
        
                // inform student that folder needs to be deleted
            fetch(`https://${this.serverip}:${this.serverApiPort}/server/control/setstudentstatus/${this.servername}/${this.servertoken}/all`, { 
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ delfolder : true } )
            })
            .then( res => res.json() )
            .then( result => { log.info(result)});
        } 
    });  
}




/**
 * Spellcheck for specific student
 * workflow:  es wird durch einen api call an control.js der studentstatus.allowspellcheck gesetzt (object {spellchecklang, suggestions})
 * beim nächsten update holt sich der student den studentstatus und sollte allowspellcheck true sein wird
 * clientinfo.allowspellcheck (communicationhandler.js) gesetzt,  clientinfo holt sich das frontend alle 4 sek.
 * der editor (frontend) sieht dann allowspellcheck und aktiviert mittels IPC invoke (ipchandler.js) dann nodehun() und macht den spellcheckbutton sichtbar
 */
async function activateSpellcheckForStudent(token, clientname){
    let suggestions = null
    const inputOptions = new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                'none':this.$t("dashboard.none"),
                'de': this.$t("dashboard.de"),
                'en-GB': this.$t("dashboard.en"),
                'fr': this.$t("dashboard.fr"),
                'es': this.$t("dashboard.es"),
                'it': this.$t("dashboard.it"),
            })
        }, 100)
    })
    const { value: language } = await this.$swal.fire({
        title: this.$t("dashboard.spellcheck"),
        html: `
        <div style="border: 0px solid black;">
            <h4 style: margin-bottom: 0px;padding-bottom: 0px;>${this.$t("dashboard.allowspellcheck")}</h4>
            <input class="form-check-input" type="checkbox" id="checkboxsuggestions">
            <label class="form-check-label" for="checkboxsuggestions"> ${this.$t("dashboard.suggest")} </label>
            <br><br>
            <span>${this.$t("dashboard.spellcheckchoose")}</span>
        </div>`,
        input: 'select',
        inputOptions: inputOptions,
        focusConfirm: false,
        inputValidator: (value) => {
            if (!value) {
            return 'You need to choose something!'
            }
        },
        preConfirm: () => {
            suggestions = document.getElementById('checkboxsuggestions').checked; 
        }
    })
    if (language) {
        let spellcheck = true
        let spellchecklang = language
        if (language === 'none'){
            spellcheck = false
            console.log(`de-activating spellcheck for user: ${clientname} `)
            console.log(spellcheck,spellchecklang,suggestions )
            // inform student that spellcheck can be activated
            fetch(`https://${this.serverip}:${this.serverApiPort}/server/control/setstudentstatus/${this.servername}/${this.servertoken}/${token}`, { 
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ allowspellcheck : false } )
            })
            .then( res => res.json() )
            .then( result => { log.info(result)});
        }
        else {
            console.log(`activating spellcheck for user: ${clientname} `)
            // inform student that spellcheck can be activated
            fetch(`https://${this.serverip}:${this.serverApiPort}/server/control/setstudentstatus/${this.servername}/${this.servertoken}/${token}`, { 
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ allowspellcheck : true, spellchecklang : spellchecklang, suggestions: suggestions } )
            })
            .then( res => res.json() )
            .then( result => { log.info(result)});
        }
    }  
}




















export {activateSpellcheckForStudent, delfolderquestion, stopserver, toggleScreenshot, sendFiles, lockscreens, setScreenshotInterval, getFiles, startExam, endExam, kick, restore, setAbgabeInterval  }