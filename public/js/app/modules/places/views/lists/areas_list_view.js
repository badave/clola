AreasRowView = ListRowView.extend({
	onSelect: function() {
		App.vent.trigger("area:selected", this.elem);
	}
});

AreasListView = ListView.extend({
	rowView: AreasRowView,
	className: "areas-list list-view"
});