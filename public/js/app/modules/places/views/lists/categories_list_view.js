CategoriesRowView = ListRowView.extend({
	onSelect: function() {
		App.PlacesController.trigger("category:selected", this.text);
	}
});

CategoriesListView = ListView.extend({
	rowView: CategoriesRowView,
	className: "categories-list list-view"
});