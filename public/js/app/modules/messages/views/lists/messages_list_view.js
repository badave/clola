MessageRowView = ListRowView.extend({
	render: function() {
		this.$el.html(this.elem).append('<i class="icon-chevron-sign-right fr"></i>');
		return this;
	},
	onSelect: function() {
		App.vent.trigger("message:selected", this.elem);
	}
});

MessagesListView = ListView.extend({
	rowView: MessageRowView,
	className: "messages-list list-view"
});