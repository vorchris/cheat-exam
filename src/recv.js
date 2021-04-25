const Transportreceive = require('./classes/filetransport').transportReceiver

const sender = new Transportreceive()
sender.init('test1.txt')
