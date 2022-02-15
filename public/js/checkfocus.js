let hidden, visibilityChange;
const focusevent = new Event('focuslost');  //create a new custom event

// Listen for the focuslost event and trigger an action
window.addEventListener('focuslost', async function (e) {
    console.log("houston we have a problem")
    
    
    /** inform the teacher immediately */
    // send API request to the exam server and highlight the student
    await fetch(`http://${serverip}:3000/server/control/studentlist/statechange/${servername}/${studenttoken}/false`)
        .then( response => response.json() )
        .then( async (data) => {
               console.log(data);
        });




}, false);
  


window.addEventListener('beforeunload', (e) => {
    e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
    e.returnValue = '';  // Chrome requires returnValue to be set
    window.dispatchEvent(focusevent);
});

window.addEventListener('blur', (e) => {
    window.dispatchEvent(focusevent);
});


if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} 
else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} 
else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}
  
  
// Warn if the browser doesn't support addEventListener or the Page Visibility API
if (typeof document.addEventListener === "undefined" || hidden === undefined) {
    console.log("This app requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
} 
else {
    document.addEventListener(visibilityChange, (e) => {
        if (document[hidden]) {   window.dispatchEvent(focusevent);} 
    }, false);
}