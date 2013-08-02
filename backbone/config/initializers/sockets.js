App.addInitializer(function(options) {
	App.socket = io.connect('http://clola.herokuapp.com:80/');  

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
		// App.messages.add(data);
	});
});