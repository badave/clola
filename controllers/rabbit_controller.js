var amqp = require('amqp');

var evt = require("../models/evt");

var rabbitControllerClass = function() {
  var rabbitConnection = amqp.createConnection({});

  rabbitConnection.setMaxListeners(100);

  var smsExchange;
  rabbitConnection.on('ready', function () {
    smsExchange = rabbitConnection.exchange('smsExchange', { 'type' : 'fanout'});
  });

  this.smsExchange = smsExchange;
};

// Singleton
rabbitControllerClass.instance = null;

rabbitControllerClass.getInstance = function() {
  if (this.instance === null) {
    this.instance = new rabbitControllerClass();
  }
  return this.instance;
};


var rabbitController = module.exports = rabbitControllerClass.getInstance();