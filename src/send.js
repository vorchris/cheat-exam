const Transportsend = require('./classes/filetransport').transportSender

const sender = new Transportsend()
sender.init('test.txt', 2)