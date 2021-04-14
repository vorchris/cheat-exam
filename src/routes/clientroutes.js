const express = require('express')
const router = express.Router()
const multiCastclient = require('../../src/classes/multicastclient.js')
const rootpath = path.dirname(require.main.filename)
const childProcess = require('child_process')

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log('Client: API request recieved')
  res.send(multiCastclient.examServerList)
})

router.get('/cmd', function (req, res, next) {
  console.log('Server: API request recieved')

  const filepath = path.join(rootpath, '/assets/pythonscripts/Notification/NotificationTest.py')

  childProcess.execFile('python3', [filepath], (error, stdout, stderr) => {
    if (stderr) {
      console.log(stderr)
    }
    if (error) {
      console.log(error)
      res.send(error)
    }
    else {
      res.send(stdout)
    }
  })
})

module.exports = router
