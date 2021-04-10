var express = require('express');
var router = express.Router();
const client = require("../classes/multicastclient.js");


/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("Client: API request recieved");
  res.send(client.examServerList);

});

module.exports = router;
