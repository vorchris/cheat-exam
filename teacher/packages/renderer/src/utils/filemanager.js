
import $ from 'jquery'


// DASHBOARD EXPLORER

//delete file or folder
function fdelete(file){
    this.$swal.fire({
        title: this.$t("dashboard.sure"),
        text:  this.$t("dashboard.filedelete"),
        icon: "question",
        showCancelButton: true,
        cancelButtonText: this.$t("dashboard.cancel"),
        reverseButtons: true
    })
    .then((result) => {
        if (result.isConfirmed) {
            fetch(`https://${this.serverip}:${this.serverApiPort}/server/data/delete/${this.servername}/${this.servertoken}`, { 
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ filepath:file.path })
            })
            .then( res => res.json() )
            .then( result => { 
                console.log(result)
                this.loadFilelist(this.currentdirectory)
            });
        }
    });
}



// show workfloder  TODO:  the whole workfolder thing is getting to complex.. this should be a standalone vue.js component thats embedded here
function showWorkfolder(){
    $("#preview").css("display","block");
    $("#closefilebrowser").click(function(e) { $("#preview").css("display","none"); });  // the surroundings of #workfolder can be clicked to close the view
    $('#workfolder').click(function(e){ e.stopPropagation(); });    // don't propagate clicks through the div to the preview div (it would hide the view)
}



// fetch a file or folder (zip) and open download/save dialog
function downloadFile(file){
    if (file === "current"){   //we want to download the file thats currently displayed in preview
        let a = document.createElement("a");
            a.href = this.currentpreview
            a.setAttribute("download", this.currentpreviewname);
            a.click();
        return
    }
    console.log("requesting file for downlod ")
    fetch(`https://${this.serverip}:${this.serverApiPort}/server/data/download/${this.servername}/${this.servertoken}`, { 
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({ filename : file.name, path: file.path, type: file.type})
    })
    .then( res => res.blob() )
    .then( blob => {
            //this is a trick to trigger the download dialog
            let a = document.createElement("a");
            a.href = window.URL.createObjectURL(blob);
            a.setAttribute("download", file.name);
            a.click();
    })
    .catch(err => { console.warn(err)});
}




// send a file from dashboard explorer to specific student
function dashboardExplorerSendFile(file){
    const inputOptions = new Promise((resolve) => {  // prepare input options for radio buttons
        let connectedStudents = {}
        this.studentlist.forEach( (student) => { connectedStudents[student.token]=student.clientname });
        resolve(connectedStudents)
    })
    this.$swal.fire({
        title: this.$t("dashboard.choosestudent"),
        input: 'select',
        icon: 'success',
        showCancelButton: true,
        reverseButtons: true,
        inputOptions: inputOptions,
        inputValidator: (value) => { if (!value) { return this.$t("dashboard.chooserequire") } },
    })
    .then((input) => {
        if (input.isConfirmed) {
            let student = this.studentlist.find(element => element.token === input.value)  // fetch cerrect student that belongs to the token
            fetch(`https://${this.serverip}:${this.serverApiPort}/server/control/sendtoclient/${this.servername}/${this.servertoken}/${student.token}`, { 
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ files:[ {name:file.name, path:file.path } ] })
            })
            .then( res => res.json() )
            .then( result => { console.log(result)});
        }
    });
}



// fetch file from disc - show preview
function loadPDF(filepath, filename){
    const form = new FormData()
    form.append("filename", filepath)
    fetch(`https://${this.serverip}:${this.serverApiPort}/server/data/getpdf/${this.servername}/${this.servertoken}`, { method: 'POST', body: form })
    .then( response => response.arrayBuffer())
    .then( data => {
        let url =  URL.createObjectURL(new Blob([data], {type: "application/pdf"})) 
        this.currentpreview = url   //needed for preview buttons
        this.currentpreviewname = filename   //needed for preview buttons
        $("#pdfembed").attr("src", `${url}#toolbar=0&navpanes=0&scrollbar=0`)
        $("#pdfpreview").css("display","block");
        $("#pdfpreview").click(function(e) {
            $("#pdfpreview").css("display","none");
        });
        }).catch(err => { console.warn(err)});     
}



// fetch file from disc - show preview
function loadImage(file){
    const form = new FormData()
    form.append("filename", file)
    fetch(`https://${this.serverip}:${this.serverApiPort}/server/data/getpdf/${this.servername}/${this.servertoken}`, { method: 'POST', body: form })
        .then( response => response.arrayBuffer())
        .then( data => {
            let url =  URL.createObjectURL(new Blob([data], {type: "application/pdf"})) 
            // wanted to save code here but images need to be presented in a different way than pdf.. so...
            $("#pdfembed").css("background-image",`url(${ url  })`);
            $("#pdfembed").css("height","60vh");
            $("#pdfembed").css("margin-top","-30vh");
            $("#pdfembed").attr("src", '')

            $("#pdfpreview").css("display","block");
            $("#pdfpreview").click(function(e) {
                $("#pdfpreview").css("display","none");
                $("#pdfembed").css("background-image",'');
                $("#pdfembed").css("height","96vh");
                $("#pdfembed").css("margin-top","-48vh");
            });
        }).catch(err => { console.warn(err)});     
}



// fetches latest files of all connected students in one combined pdf
async function getLatest(){
    this.visualfeedback(this.$t("dashboard.summarizepdf"))
    fetch(`https://${this.serverip}:${this.serverApiPort}/server/data/getlatest/${this.servername}/${this.servertoken}`, { 
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
    })
    .then( response => response.json() )
    .then( async(responseObj) => {
        if (!responseObj.pdfBuffer ){
            console.log("nothing found")
            this.visualfeedback(this.$t("dashboard.nopdf"))
            return
        }
        const warning = responseObj.warning;
        const pdfBuffer = new Uint8Array(responseObj.pdfBuffer.data);
        if (warning){
            this.$swal.close();
            this.visualfeedback(this.$t("dashboard.oldpdfwarning",2000))
            await sleep(2000)
        }
        let url =  URL.createObjectURL(new Blob([pdfBuffer], {type: "application/pdf"})) 
        this.currentpreview = url   //needed for preview buttons
        this.currentpreviewname = "combined"   //needed for preview buttons
        $("#pdfembed").attr("src", `${url}#toolbar=0&navpanes=0&scrollbar=0`)
        $("#pdfpreview").css("display","block");
        $("#pdfpreview").click(function(e) {
                $("#pdfpreview").css("display","none");
        });
    }).catch(err => { console.warn(err)});
}



// fetches latest file of specific student
//show info (who sent the request) and wait for confirmation // handle multiple print requests (send "printrequest denied" if there is already an ongoing request)
//introduce printlock variable that blocks additional popups
async function getLatestFromStudent(student){

    if (this.printrequest){ 
        // inform student that request was denied
        fetch(`https://${this.serverip}:${this.serverApiPort}/server/control/setstudentstatus/${this.servername}/${this.servertoken}/${student.token}`, { 
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({ printdenied : true } )
        })
        .then( res => res.json() )
        .then( result => { console.log(result)});
        return
    }


    this.printrequest = true // this is a new one - we allow it and block others for the time beeing
    console.log("print request accepted")
    
    // this informs the student that an exam upload is requested. 
    // this needs 4sek minimum for the student to react because of the current update interval  
    // so if the teacher is faster than that it could happen that no pdf file is found
    this.getFiles(student.token, false, true)
    console.log("requesting current file from student") 
    await this.sleep(4000);  // give it some time



    this.$swal.fire({
        title: this.$t("dashboard.printrequest"),
        html:  `${this.$t("dashboard.printrequestshow")} <br> <b> ${student.clientname}.pdf</b>`,
        icon: "question",
        showCancelButton: true,
        cancelButtonText: this.$t("dashboard.cancel"),
        reverseButtons: true
    })
    .then((result) => {
        this.printrequest = false // allow new requests
        if (result.isConfirmed) {
            fetch(`https://${this.serverip}:${this.serverApiPort}/server/data/getLatestFromStudent/${this.servername}/${this.servertoken}/${student.clientname}`, { 
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
            })
            .then( response => response.json() )
            .then( async(responseObj) => {
                if (!responseObj.pdfBuffer ){
                    console.log("nothing found")
                    this.visualfeedback(this.$t("dashboard.nopdf"))
                    return
                }
                const blob = new Blob([new Uint8Array(responseObj.pdfBuffer.data).buffer], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
        
                if (responseObj.warning){
                    this.$swal.close();
                    this.visualfeedback(this.$t("dashboard.oldpdfwarningsingle",2000))
                    await sleep(2000)
                }
        
                //let url =  URL.createObjectURL(new Blob([pdfBuffer], {type: "application/pdf"})) 
                this.currentpreview = url   //needed for preview buttons
                this.currentpreviewname = "combined"   //needed for preview buttons
                $("#pdfembed").attr("src", `${url}#toolbar=0&navpanes=0&scrollbar=0`)
                $("#pdfpreview").css("display","block");
                $("#pdfpreview").click(function(e) {
                        $("#pdfpreview").css("display","none");
                });
            }).catch(err => { console.warn(err)});
        }
    });
}


function openLatestFolder(student){
    fetch(`https://${this.serverip}:${this.serverApiPort}/server/data/getLatestFromStudent/${this.servername}/${this.servertoken}/${student.clientname}`, { 
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
    })
    .then( response => response.json() )
    .then( async(responseObj) => {
        //console.log(responseObj.latestfolderPath)
        this.loadFilelist(responseObj.latestfolderPath)
        this.showWorkfolder();

    }).catch(err => { console.warn(err)});

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function print(){
    var iframe = $('#pdfembed')[0]; 
    iframe.contentWindow.focus();
    iframe.contentWindow.print(); 
}

function loadFilelist(directory){
    fetch(`https://${this.serverip}:${this.serverApiPort}/server/data/getfiles/${this.servername}/${this.servertoken}`, { 
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({ dir : directory})
    })
    .then( response => response.json() )
    .then( filelist => {
        console.log(filelist)
        filelist.sort()
        filelist.reverse()
        this.localfiles = filelist;
        this.currentdirectory = directory
        this.currentdirectoryparent = filelist[filelist.length-1].parentdirectory // the currentdirectory and parentdirectory properties are always on [0]
        if (directory === this.workdirectory) {this.showWorkfolder(); }
    }).catch(err => { console.warn(err)});
}
 
export {loadFilelist, print, getLatest, getLatestFromStudent, loadImage, loadPDF, dashboardExplorerSendFile, downloadFile, showWorkfolder, fdelete, openLatestFolder  }