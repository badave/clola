CitiesRowView = ListRowView.extend({
	onSelect: function() {
		App.vent.trigger("city:selected", this.elem);
	}
});

CitiesListView = ListView.extend({
	rowView: CitiesRowView,
	className: "cities-list list-view"
});