const express = require('express')
const router = express.Router()

const controlRoutes = require('./client/control');
const uiRoutes = require('./client/ui');
const dataRoutes = require('./client/data');


router.use('/control/', controlRoutes);
router.use('/ui/', uiRoutes);
router.use('/data/', dataRoutes);


module.exports = router
