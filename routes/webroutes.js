var express = require('express');
var router = express.Router();



router.get('/', function(req, res, next) {
    res.sendFile('/public/index.html', { title: 'Express' });
});


router.get('/student/', function(req, res, next) {
    res.sendFile('/public/student.html', { title: 'Express',  root:"." });
});


router.get('/teacher/', function(req, res, next) {
    res.sendFile('/public/teacher.html', { title: 'Express',  root:"." });
});

router.get('/overview/', function(req, res, next) {
    res.sendFile('/public/overview.html', { title: 'Express',  root:"." });
});


module.exports = router;
