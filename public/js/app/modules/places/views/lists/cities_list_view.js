CitiesRowView = ListRowView.extend({
	onSelect: function() {
		App.PlacesController.trigger("city:selected", this.text);
	}
});

CitiesListView = ListView.extend({
	rowView: CitiesRowView,
	className: "cities-list list-view"
});