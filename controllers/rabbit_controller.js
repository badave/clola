var amqp = require('amqp');

var rabbitConnection = amqp.createConnection({});

rabbitConnection.setMaxListeners(100);

var smsExchange;
rabbitConnection.on('ready', function () {
  smsExchange = rabbitConnection.exchange('smsExchange', { 'type' : 'fanout'});
});


var evt = require("../models/evt");

var rabbitController = module.exports = {
  smsExchange : smsExchange 
};