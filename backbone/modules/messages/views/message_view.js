MessageView = Backbone.Marionette.ItemView.extend({
	template_path: "messages/templates/message",
	className: "message-view",
	events: {
		"submit form": "sendReply"
	},
	onRender: function() {
		var that = this;
		setTimeout(function() {
			that.el.scrollTop = that.el.scrollHeight;
		}, 10);
	},
	sendReply: function(e) {
		e.preventDefault();

		App.socket.emit("reply", { "phone": this.model.get("phone"), "message": {
			"text": this.$el.find("#reply-box").val(), 
			"reply": true, 
			"created": new Date().getTime()
		}});

		$(e.target).find("input").val("");
	}
});