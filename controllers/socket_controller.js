var ObjectID = require('mongodb').ObjectID,
  bcrypt = require('bcrypt'),
  crypto = require('crypto'),
  hbs = require("hbs");

var db = require("../lib/db");
var helper = require('../lib/helper');
var config = require("../config");

var smsController = require("../controllers/sms_controller");

var url = require('url');

var evt = require("../models/evt");

var socketController = module.exports = function(server){
	var self = this;
	io = require('socket.io').listen(server);
	io.set("origins = *");
	// assuming io is the Socket.IO server object
	io.configure(function () { 
	  io.set("transports", ["xhr-polling"]); 
	  io.set("polling duration", 30); 
	});

	io.on("connection", function(socket) {
		// console.log(socket);
		// socket.emit("hello", {'data': "hello"});
		// 

		socket.on("replying", function(data) {
			// echo to others
			socket.broadcast.emit("replying", data);
		})

		socket.on("reply", function(data) {
			console.log(data);
			data.message.created = new Date().getTime();
			smsController.send(data);
			db.findAndModify("messages", {"phone": data.phone}, {}, { "$set": { "status": "replied" }, "$push": { "messages": data.message} }, { "upsert": true }, function(err, object) {
				evt.emit("message", {"phone": data.phone, "status": "replied", "messages": [data.message] });
			})
		})
	})

	evt.on("message", function(msg) {
		io.sockets.emit("msg", msg);
	})

};


// var io = require('socket.io').listen(80);


// io.sockets.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });