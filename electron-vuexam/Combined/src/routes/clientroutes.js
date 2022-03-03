const { Router } = require( 'express')

module.exports = clientRouter = Router()

const controlRoutes = require( './client/control.js')
const dataRoutes = require( './client/data.js')


clientRouter.use('/control/', controlRoutes);
clientRouter.use('/data/', dataRoutes);


