App.addInitializer(function(options) {
	App.messages = new MessageCollection();

	App.messages.fetch();

	App.socket = io.connect('http://clola.herokuapp.com:80/');  

	if(options.localhost) {
		io.connect('http://localhost:5050/'); 
	}

	App.socket.on("msg", function(data) {
		App.messages.add(data);
	});
});