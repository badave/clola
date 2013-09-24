var amqp = require('amqp');

var evt = require("../models/evt");

var rabbitControllerClass = function() {
  // { host: 'localhost'
  // , port: 5672
  // , login: 'guest'
  // , password: 'guest'
  // , authMechanism: 'AMQPLAIN'
  // , vhost: '/'
  // , ssl: { enabled : false
  //        }
  // }
  var rabbitConnection = amqp.createConnection({ reconnect: true, keepAlive: 10000 });


  var smsExchange;
  rabbitConnection.on('connect', function () {
    console.log("Connected to rabbitmq");
    smsExchange = rabbitConnection.exchange('smsExchange', { 'type' : 'fanout'});
  });

  rabbitConnection.on("close", function() {
    console.log("Connection with rabbitmq is closed");
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