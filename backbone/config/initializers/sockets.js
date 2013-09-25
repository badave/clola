App.addInitializer(function(options) {
	// App.socket = io.connect('http://clola.herokuapp.com:80/');
	
	App.socket = io.connect('http://localhost:5050/');
	
	App.socket.on('connect', function() {
     // Connected, let's sign-up for to receive messages for this room
     App.socket.emit('room', "1");
  });
   
  App.socket.on('socket_message', function(data) {
     console.log('Incoming message:', data);
  }); 

	if(options.localhost) {
		io.connect('http://localhost:5050/'); 
	}

	App.socket.on("msg", function(data) {
		var model = App.messages.findByPhone(data.phone);
		var messages = model.get("messages");
		messages.push(data.messages[0]);
		model.set({
			"messages": messages,
			"status": data.status
		});

		App.vent.trigger("change:message", model);
	});
	
	App.socket.on("replying", function(data) {
	  var model = App.messages.findByPhone(data.phone);
	  model.set({
	    "replying": data.message.replying,
	    "replying_text": data.message.text,
	  });
	  App.vent.trigger("replyingToMessage", model);
  })
});