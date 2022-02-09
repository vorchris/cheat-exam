const express = require('express')
const router = express.Router()

const controlRoutes = require('./server/control');
const uiRoutes = require('./server/ui');
const dataRoutes = require('./server/data');


router.use('/control/', controlRoutes);
router.use('/ui/', uiRoutes);
router.use('/data/', dataRoutes);


module.exports = router
