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
var Room = require("../models/room");

var uuid = require('node-uuid');
var people = {};
var rooms = {};
var clients = [];
var _ = require("underscore");

// enable redis-store for socket.io so that we can scale 
var RedisStore = require('socket.io/lib/stores/redis')
  , redis  = require('socket.io/node_modules/redis')
  , pub    = redis.createClient()
  , sub    = redis.createClient()
  , client = redis.createClient();

var socketController = module.exports = function(server){
	var self = this;
	io = require('socket.io').listen(server);
	
	io.set("origins","*:*");
	// assuming io is the Socket.IO server object
	io.configure(function () { 
	  io.set("transports", [
  	  "xhr-polling",
  	  "websocket"
	  ]); 
	  io.set("polling duration", 30); 
	  io.set("log level", 1);
	  io.set('store', new RedisStore({
      redisPub : pub,
      redisSub : sub,
      redisClient : client
    }));
	});

	io.on("connection", function(socket) {
	  
    socket.on("joinserver", function(name) {
      var ownerRoomID = inRoomID = null;
      people[socket.id] = {"name" : name, "owns" : ownerRoomID, "inroom": inRoomID};
      clients.push(socket);
    });
    
    // params
    // @name - name of the room, in our case email id of the customer rep 
    socket.on("createRoom", function(name) {
      console.log("in create room");
      if (people[socket.id].owns === null) {
        var id = uuid.v4();
        var room = new Room(name, id, socket.id);
        rooms[id] = room;

        //add room to socket, and auto join the creator of the room
        socket.room = name;
        
        // once a client has connected, we expect to get a ping from them saying what room they want to join
        socket.join(socket.room);
        console.log("room joined", socket.room);
        people[socket.id].owns = id;
        people[socket.id].inroom = id;
        
        room.addPerson(socket.id);
      } else {
        // socket.sockets.emit("update", "You have already created a room.");
        console.log('You have already createad a room');
      }
    });
    
    socket.on("joinRoom", function(id) {
      var room = rooms[id];
      if (socket.id === room.owner) {
        throw new Error("You are the owner of this room and you have already been joined.");
        // client.emit("update", "You are the owner of this room and you have already been joined.");
      } else {
        room.people.contains(socket.id, function(found) {
          if (found) {
            console.log("You have already joined this room");
            // client.emit("update", "You have already joined this room.");
          } else {
            if (people[socket.id].inroom !== null) {
              console.log("You are already in a room: ("+rooms[people[client.id].inroom].name+").");
              // client.emit("update", "You are already in a room ("+rooms[people[client.id].inroom].name+"), please leave it first to join another room.");
            } else {
              room.addPerson(socket.id);
              people[socket.id].inroom = id;
              socket.room = room.name;
              socket.join(socket.room);
              user = people[socket.id];
              io.sockets.in(socket.room).emit("update", user.name + " has connected to " + room.name + " room.");
              // client.emit("update", "Welcome to " + room.name + ".");
              // client.emit("sendRoomID", {id: id});
            }
          }
        });
      }
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
    // join room and emit message or find the room and emit the message to that room
		// now, it's easy to send a message to just the clients in a given room
    var room = Room.getRoomByPhoneNumber(msg.phone, rooms);

    var phoneNumber = msg.phone;
    if(_.contains(room.people, phoneNumber)) {
      console.log("Phone number: ("+phoneNumber+") already exists in room: ("+room.name+")");
    } else {
      room.addPerson(phoneNumber);
      // TODO: add phone number to messages collection
      
      console.log("update: ("+phoneNumber+") has connected to room: ("+room.name+")");
    }
    
    io.sockets.in(room["name"]).emit('socketRoomMessage', msg);
	});

};

