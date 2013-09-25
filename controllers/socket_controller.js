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
var roomModel = require("../models/room");

var socketController = module.exports = function(server){
	var self = this;
	io = require('socket.io').listen(server);

	io.set("origins","*:*");
	// assuming io is the Socket.IO server object
	io.configure(function () { 
	  io.set("transports", ["xhr-polling"]); 
	  io.set("polling duration", 30); 
	  io.set("log level", 1);
	});

	io.on("connection", function(socket) {
	  // once a client has connected, we expect to get a ping from them saying what room they want to join
    socket.on('room', function(room) {
      console.log("room joined", room);
      socket.join(room);
    });
	  
		socket.on("replying", function(data) {
			// echo to others
			socket.broadcast.emit("replying", data);
		});

		socket.on("reply", function(data) {
			console.log(data);
			data.message.created = new Date().getTime();
			smsController.send(data);
			db.findAndModify("messages", {"phone": data.phone}, {}, { "$set": { "status": "replied" }, "$push": { "messages": data.message} }, { "upsert": true }, function(err, object) {
				evt.emit("message", {"phone": data.phone, "status": "replied", "messages": [data.message] });
			});
		});

		socket.on("hide", function(data) {
			db.findAndModify("messages", {"phone": data.phone}, {}, { "$set": { "status": "hidden" } }, {}, function(err, object) {
				evt.emit("message", {"phone": data.phone, "status": "hidden"});
			});
		});
	});
	
	evt.on("message", function(msg) {
		// now, it's easy to send a message to just the clients in a given room
    var room = "1";
    io.sockets.in(room).emit('socketRoomMessage', msg);
     
    // this message will NOT go to the client defined above
    // io.sockets.in(roomModel.getRoomByPhoneNumber(msg.phone)).emit('message', 'anyone in this room yet?');
	});

};

