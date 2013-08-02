App.addInitializer(function(options){
	App.messages = new MessageCollection();
	App.messages.fetch();
})