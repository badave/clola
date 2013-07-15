SubcategoriesRowView = ListRowView.extend({
	onSelect: function() {
		App.vent.trigger("subcategory:selected", this.elem);
	}
});

SubcategoriesListView = ListView.extend({
	rowView: SubcategoriesRowView,
	className: "subcategories-list list-view"
});