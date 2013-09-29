App.addInitializer(function(options) {
	// App.socket = io.connect('http://clola.herokuapp.com:80/');
	
	App.socket = io.connect('http://localhost:5050/');
	
	App.socket.on('connect', function() {
     // Connected, let's sign-up for to receive messages for this room
     App.socket.emit("joinserver", "arpan");
  });
  
	App.socket.on("socketRoomMessage", function(data) {
		var phoneModel = App.messages.findByPhone(data.phone);
		var messages = phoneModel.get("messages");
		messages.push(data.messages[0]);
		phoneModel.set({
			"messages": messages,
			"status": data.status
		});

		App.vent.trigger("change:message", phoneModel);
	});
	
	App.socket.on("replying", function(data) {
	  var phoneModel = App.messages.findByPhone(data.phone);
	  phoneModel.set({
	    "replying": data.message.replying,
	    "replying_text": data.message.text,
	  });
	  App.vent.trigger("replyingToMessage", phoneModel);
  });
});