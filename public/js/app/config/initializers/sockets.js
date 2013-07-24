App.addInitializer(function(options) {
	App.messages = new MessageCollection();

	App.messages.fetch();

	var socket = io.connect('http://clola.herokuapp.com:80/');  

	if(options.localhost) {
		io.connect('http://clola.herokuapp.com:80/'); 
	}

	socket.on("msg", function(data) {
		App.messages.add(data);
	});
});