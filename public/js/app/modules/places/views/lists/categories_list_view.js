CategoriesRowView = ListRowView.extend({
	onSelect: function() {
		App.vent.trigger("category:selected", this.elem);
	}
});

CategoriesListView = ListView.extend({
	rowView: CategoriesRowView,
	className: "categories-list list-view"
});