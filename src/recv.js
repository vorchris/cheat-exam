const Transportreceive = require('./classes/filetransport').transportReceiver

const receiver = new Transportreceive()
receiver.init('test1.txt')
