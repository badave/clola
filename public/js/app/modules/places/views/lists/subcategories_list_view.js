SubcategoriesRowView = ListRowView.extend({
	onSelect: function() {
		App.PlacesController.trigger("subcategory:selected", this.text);
	}
});

SubcategoriesListView = ListView.extend({
	rowView: SubcategoriesRowView,
	className: "subcategories-list list-view"
});