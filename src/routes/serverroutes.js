const express = require('express')
const childProcess = require('child_process')
const router = express.Router()
const server = require('../../src/classes/multicastserver.js')
const path = require('path')
// const rootpath = path.join(__dirname, '..',)
const rootpath = path.dirname(require.main.filename);

router.get('/', function (req, res, next) {
  console.log('Server: API request recieved')
  res.send('hello teacher' )
})

router.get('/start', function (req, res, next) {
  console.log('Server: API request recieved')

  if (server.running) {
    console.log('server already running')
    res.json('server already running')
  } else {
    server.init()
    res.json('server started')
  }
})

router.get('/info', function (req, res, next) {
  console.log('Server: API request recieved')
  res.send('hello info')
})

router.get('/cmd', function (req, res, next) {
  console.log('Server: API request recieved')

  const filepath = path.join(rootpath, '/assets/pythonscripts/Notification/NotificationTest.py')

  // https://nodejs.org/api/child_process.html#child_process_child_process_execfile_file_args_options_callback

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
