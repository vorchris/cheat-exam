
const express = require('express')
const router = express.Router()
const config = require('../../config')



router.get('/exams/', function (req, res, next) {
    let remoterequest = false;
    if (!requestSourceAllowed(req, res)){ remoterequest = true; }
    res.render('runningexams', { title: 'Exam Student', apiport: config.port, remoterequest: remoterequest })
  })


module.exports = router


//do not allow requests from external hosts
function requestSourceAllowed(req,res){
    if (req.ip !== "::1" && req.ip !== "127.0.0.1"){ 
      console.log("Blocked request from remote Host"); 
      return false
    }   
    return true
  }
