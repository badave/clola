MessageView = Backbone.Marionette.ItemView.extend({
	template_path: "messages/message",
	className: "message-view",
	onRender: function() {
		var that = this;
		setTimeout(function() {
			that.el.scrollTop = that.el.scrollHeight;
		}, 10);
	}
});