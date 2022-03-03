const { Router } = require('express')
module.exports = serverRouter = Router()

const controlRoutes = require('./server/control.js')
const dataRoutes  = require('./server/data.js')


serverRouter.use('/control/', controlRoutes);
serverRouter.use('/data/', dataRoutes);


