const http = require('http')
const fs = require('fs')
const config = require('../config')

/**
 * This class provides an http file server
 * @param {filename}  string
 * @param {numberOfClients} integer
 * it closes the server if all clients received their file
 * ATTENTION: FIXME if one client doesn't show up - server will stay alive
 * probably add a timeout - figure out which clients didn't reveive their files (via csrf token identity)
 * retry or inform UI
 */


class transportSender {
  constructor () {
    this.istream = false
    this.server = false
    this.numberOfClients = 0
  }

  init (filename, numberOfClients) {
    this.istream = fs.createReadStream(filename)

    const server = http.createServer(function (req, res) {
      console.log('Request received')
      const readStream = fs.createReadStream(filename, { bufferSize: 1024 })
      readStream.setEncoding('utf8')

      readStream.on('data', function (data) {
        res.write(data)
      })

      readStream.on('end', () => {
        res.end()
        numberOfClients--
        console.log('Request processed')
        console.log(`${numberOfClients} left`)

        if (numberOfClients === 0) { // TODO: Handle the case where some clients misbehave and do not connect (server would stay open atm)
          server.close(() => { console.log('\nTransfer(s) done!') })
        }
      })
    })

    server.listen(config.httpPort)
  }
}

class transportReceiver {
  constructor () {
    this.date = new Date()
    this.size = 0
    this.elapsed = 0

    this.options = {
      port: config.httpPort,
      path: '/'
    }
  }

  init (filename) {
    http.get(this.options, res => {
      console.log('response received')

      this.ostream = fs.createWriteStream(filename)

      res.on('data', chunk => {
        this.size += chunk.length
        this.elapsed = new Date() - this.date
        this.ostream.write(chunk)
      })

      res.on('end', () => {
        console.log(`\n Finished getting file. Speed was: ${((this.size / (1024 * 1024)) / (this.elapsed / 1000)).toFixed(6)} MB/s`)
      })
    })
  }
}

module.exports = { transportSender, transportReceiver }
