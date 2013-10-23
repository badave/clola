
var config = require("../config");
var amqp = require('amqp');
var evt = require("../models/evt");

var rabbitControllerClass = function() {
  var url = config.rabbit_url;
  var rabbitConnection = amqp.createConnection({ url: url });

  var smsExchange;
  var that = this;
  rabbitConnection.on('ready', function () {
    // console.log('Lets do this! rabbitmq connection ready');
    
    // setup exchange
    smsExchange = rabbitConnection.exchange('smsExchange', { 'type' : 'fanout'});
    smsExchange.on('open', function() {
      // console.log('Lets do this! rabbitmq exchange open');
      that.smsExchange = smsExchange;
    });
    
    // setup queue
    queueOptions = {
      passive: true,
      durable: true,
      exclusive: true,
    };
    
    var smsQueue = rabbitConnection.queue('smsQueue', function (queue) {
      console.log('Queue ' + queue.name + ' is open');
      queue.bind('smsExchange', '#');
      queue.subscribe(function (data) {
        console.log("emitting event from rabbit queue", data );
        
        evt.emit("message", data);
      });
    });
    
  });

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
