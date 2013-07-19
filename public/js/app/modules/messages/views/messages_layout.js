MessagesLayout = Backbone.Marionette.Layout.extend({
	template_path: "messages/layout",
	regions: {
		"messages": ".messages-list"
	},
	onRender: function() {
		this.renderMessages();

		_.bindAll(this, "renderMessages");
		this.collection.on("change", this.renderMessages);
		this.collection.on("add", this.renderMessages);
	},
	renderMessages: function() {
		var messages = this.collection.newMessages();

		var phone_array = _.map(messages, function(message) {
			return message.get("phone");
		});

		this.messageListView = new MessagesListView({
			array: phone_array
		});

		this.messages.show(this.messageListView);
	}
});