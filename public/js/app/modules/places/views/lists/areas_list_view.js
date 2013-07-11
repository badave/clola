AreasRowView = ListRowView.extend({
	onSelect: function() {
		App.PlacesController.trigger("area:selected", this.text);
	}
});

AreasListView = ListView.extend({
	rowView: AreasRowView,
	className: "areas-list list-view"
});