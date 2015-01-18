App.addInitializer(function(options){
	App.messages = new MessageCollection();
	
	// TODO: fetch messages/phone#'s only for this room -arpan
	App.messages.fetch();
});