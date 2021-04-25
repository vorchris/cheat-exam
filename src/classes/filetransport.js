const net = require('net')
const fs = require('fs')
const remoteserver = process.argv[2]

class transportReceiver {
  constructor () {
    this.date = new Date()
    this.size = 0
    this.elapsed = 0
  }

  init (filename) {
    this.socket = remoteserver ? net.connect(8000, remoteserver) : net.connect(8000)
    this.ostream = fs.createWriteStream(filename)

    this.socket.on('data', chunk => {
      this.size += chunk.length
      this.elapsed = new Date() - this.date
      this.socket.write(`\r${(this.size / (1024 * 1024)).toFixed(2)} MB of data was sent. Total elapsed time is ${this.elapsed / 1000} s`)
      process.stdout.write(`\r${(this.size / (1024 * 1024)).toFixed(2)} MB of data was sent. Total elapsed time is ${this.elapsed / 1000} s`)
      this.ostream.write(chunk)
    })

    this.socket.on('end', () => {
      console.log(`\nFinished getting file. speed was: ${((this.size / (1024 * 1024)) / (this.elapsed / 1000)).toFixed(2)} MB/s`)
      process.exit()
    })
  }
}

class transportSender {
  constructor () {
    this.istream = false
  }

  init (filename) {
    this.istream = fs.createReadStream(filename)
    const server = net.createServer(socket => {
      socket.pipe(process.stdout)

      this.istream.on('readable', function () {
        let data
        // eslint-disable-next-line no-cond-assign
        while (data = this.read()) {
          socket.write(data)
        }
      })

      this.istream.on('end', function () {
        socket.end()
      })

      socket.on('end', () => {
        server.close(() => { console.log('\nTransfer is done!') })
      })
    })

    server.listen(8000, '0.0.0.0')
  }
}

module.exports = { transportSender, transportReceiver }
