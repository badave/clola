MessageRowView = ListRowView.extend({
	onSelect: function() {
		App.vent.trigger("message:selected", this.elem);
	}
})

MessagesListView = ListView.extend({
	rowView: MessageRowView,
	className: "messages-list list-view"
});