import axios from "axios"
import FormData from 'form-data'

// enable exam mode 
function startExam(){
    this.lockscreens(false, false); // deactivate lockscreen
    this.exammode = true;
    console.log("starting")
    this.visualfeedback(this.$t("dashboard.startexam"))
    fetch(`https://${this.serverip}:${this.serverApiPort}/server/control/exam/${this.servername}/${this.servertoken}`, { 
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            exammode: this.exammode, 
            examtype: this.examtype, 
            delfolder: this.delfolder, 
            delfolderonexit: this.delfolderonexit, 
            spellcheck: this.spellcheck, 
            spellchecklang:this.spellchecklang, 
            suggestions: this.suggestions, 
            moodleTestId: this.moodleTestId, 
            moodleTestType: this.moodleTestType,
            moodleDomain: this.moodleDomain,
            gformsTestId: this.gformsTestId, 
            cmargin: this.cmargin,
            serverstatus: this.serverstatus
        })
    })
    .then( res => res.json())
    .then( response => { })
    .catch(err => { console.warn(err) })
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
            this.delfolderonexit = document.getElementById('checkboxdel').checked; 
        }
    })
    .then((result) => {
        if (result.isConfirmed) {
            this.exammode = false;
            this.lockscreens(false, false); // deactivate lockscreen

            fetch(`https://${this.serverip}:${this.serverApiPort}/server/control/exam/${this.servername}/${this.servertoken}`, { 
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ exammode: this.exammode, examtype: this.examtype, delfolder: this.delfolder, delfolderonexit: this.delfolderonexit  })
                })
            .then( res => res.json())
            .then( response => { })
            .catch(err => { console.warn(err) })
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
                console.log(response.data);
                this.status(response.data.message);
            }).catch(error => {console.log(error)});
        } 
    });  
}



//restore focus state for specific student -- we tell the client that his status is restored which will then (on the next update) update it's focus state on the server 
function restore(studenttoken){
    this.visualfeedback(this.$t("dashboard.restore"),2000)
    axios.get(`https://${this.serverip}:${this.serverApiPort}/server/control/restore/${this.servername}/${this.servertoken}/${studenttoken}`)
        .then( response => { console.log(response.data)  })
        .catch( err => {console.log(err)});
}


function toggleAutoabgabe(){
    if (this.autoabgabe) { this.abgabeinterval = setInterval(() => { this.getFiles('all') }, 60000 * this.abgabeintervalPause) }   //trigger getFiles('all') every other minute
    else { clearInterval( this.abgabeinterval )} 
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
        }).then((input) => {
            this.abgabeintervalPause= input.value
            if (!this.abgabeintervalPause){this.abgabeintervalPause = 5}   // make sure it is set otherwise we well fetch the exams X times per second
        })
    }
}


// get finished exams (ABGABE) from students
function getFiles(who, feedfack=false){
    this.checkDiscspace()
    if ( this.studentlist.length <= 0 ) { this.status(this.$t("dashboard.noclients")); console.log("no clients connected"); return; }

    if (this.examtype === "microsoft365"){ //fetch files from onedrive
        this.downloadFilesFromOneDrive()
        if (feedfack){ this.visualfeedback(this.$t("dashboard.examrequest"), 2000) }else { this.status(this.$t("dashboard.examrequest")); }
    }
    else { // fetch files from clients
        axios.get(`https://${this.serverip}:${this.serverApiPort}/server/control/fetch/${this.servername}/${this.servertoken}/${who}`)  //who is either all or token
        .then( async (response) => { if (feedfack){ this.visualfeedback(response.data.message, 2000) }else { this.status(response.data.message); } })  // we do not want intrusive feedback on automated tasks })
        .catch( err => {console.log(err)});
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
        inputValue: this.screenshotinterval
    }).then((input) => {
        this.screenshotinterval= input.value
        if (this.screenshotinterval == 0) { document.getElementById("screenshotinterval").checked = false }
        else { document.getElementById("screenshotinterval").checked = true}
        if (!this.screenshotinterval){this.screenshotinterval = 4}

        console.log(this.screenshotinterval)
        // WRITE screenshotinterval serverstatus ojbect so it can be retrieved on the next student update 
        fetch(`https://${this.serverip}:${this.serverApiPort}/server/control/screenshotinterval/${this.servername}/${this.servertoken}`, { 
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({ screenshotinterval: this.screenshotinterval  })
            })
        .then( res => res.json())
        .then( response => {console.log(response.message) })
        .catch(err => { console.warn(err) })
    })  
}


// temporarily lock screens
function lockscreens(state, feedback=true){
    if (this.studentlist.length === 0) { this.status(this.$t("dashboard.noclients")); return;}

    if (state === false) { this.screenslocked = false; if (feedback) { this.visualfeedback(this.$t("dashboard.unlock")); } }   // the feedback interferes with endexam screen
    else { this.screenslocked = true; this.visualfeedback(this.$t("dashboard.lock"))} 

    fetch(`https://${this.serverip}:${this.serverApiPort}/server/control/serverstatus/${this.servername}/${this.servertoken}`, { 
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({ screenlock: this.screenslocked  })
        })
    .then( res => res.json())
    .then( response => { })
    .catch(err => { console.warn(err) })
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
        .then( (response) => {console.log(response.data) })
        .catch( err =>{ console.log(`${err}`) })
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
                //console.log(response.data);
                await this.sleep(2000);
                this.$router.push({ path: '/startserver' })
            }).catch( err => {console.log(err)});
        } 
    });    
}





export {stopserver, toggleScreenshot, sendFiles, lockscreens, setScreenshotInterval, getFiles, startExam, endExam, kick, restore, toggleAutoabgabe, setAbgabeInterval  }