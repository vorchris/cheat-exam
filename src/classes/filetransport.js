const net = require('net')
const fs = require('fs')

class transportSender {
  constructor () {
    this.istream = false
    this.server = false
  }

  init (filename) {
    this.istream = fs.createReadStream(filename)

    this.server = net.createServer(socket => {
      this.istream.on('readable', function () {
        let data
        // eslint-disable-next-line no-cond-assign
        while (data = this.read()) {
          socket.write(data)
        }
      })

      this.istream.on('end', function () {
        socket.end() // terminates socket on both ends
      })

      socket.on('end', () => {
        this.server.close(() => { console.log('\n Transfer is done!') })
      })
    })

    this.server.listen(8000, '0.0.0.0')
  }
}

class transportReceiver {
  constructor () {
    this.date = new Date()
    this.size = 0
    this.elapsed = 0
  }

  init (filename) {
    this.socket = net.connect(8000, 'localhost') // localhost to variable
    this.ostream = fs.createWriteStream(filename)

    this.socket.on('data', chunk => {
      this.size += chunk.length
      this.elapsed = new Date() - this.date
      this.ostream.write(chunk)
    })

    this.socket.on('end', () => {
      console.log(`\n Finished getting file. Speed was: ${((this.size / (1024 * 1024)) / (this.elapsed / 1000)).toFixed(6)} MB/s`)
    })
  }
}

module.exports = { transportSender, transportReceiver }
