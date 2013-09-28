MessagesLayout = Backbone.Marionette.Layout.extend({
	template_path: "app/messages/templates/layout",
	regions: {
		"messages": "#messages-list",
		"message_views": "#message-views"
	},
	
	onRender: function() {
		this.renderMessages();

		_.bindAll(this, "renderMessages", "selectMessages");
		this.collection.on("change", this.renderMessages);
		this.collection.on("add", this.renderMessages);

		App.vent.on("message:selected", this.selectMessages);
	},
	
	renderMessages: function() {
		var messages = this.collection.models;

		var list = _.map(messages, function(message) {
			return message.get("phone");
		});

		// sync customer's with list

		this.messageListView = new MessagesListView({
			array: list,
			collection: this.collection
		});

		this.messages.show(this.messageListView);
	},

	selectMessages: function(phone) {
		var messages = this.collection.findByPhone(phone);

		// render this message view
		this.messageView = new MessageView({
			model: messages
		});

		this.message_views.show(this.messageView);
		
	}
});