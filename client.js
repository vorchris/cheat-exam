const client = require("./classes/client.js");
const api = require("./api.js");


client.init();
api.init(client);
