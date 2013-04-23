var ObjectID = require('mongodb').ObjectID,
  bcrypt = require('bcrypt'),
  crypto = require('crypto'),
  hbs = require("hbs");

var db = require("../lib/db");
var helper = require('../lib/helper');
var config = require("../config");

var url = require('url');

var evt = require("../models/evt");

var socketController = module.exports = function(server){
	var self = this;
	this.io = require('socket.io').listen(server);
	// assuming io is the Socket.IO server object
	this.io.configure(function () { 
	  self.io.set("transports", ["xhr-polling"]); 
	  self.io.set("polling duration", 10); 
	});

	this.io.on("connection", function(socket) {
		// console.log(socket);
		socket.emit("weee", {'data': "hello"});
	})
};

evt.on("new_message", function(msg) {
	socketController.io.sockets.emit("sms", msg);
})

socketController.sockets = function() {
	return this.io.sockets;
}



// var io = require('socket.io').listen(80);


// io.sockets.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });