PlacesRowView = ListRowView.extend({
	template: function() {
		return Handlebars.templates["app/places/templates/list-row"];
	},
	render: function() {
		this.isClosed = false;

    this.triggerMethod("before:render", this);
    this.triggerMethod("item:before:render", this);

    var template = this.template();

    var html = template({ model: this.elem.toJSON() });

    this.$el.html(html);

    this.bindUIElements();

    this.triggerMethod("render", this);
    this.triggerMethod("item:rendered", this);

		return this;
	},
	onSelect: function() {
		App.vent.trigger("place:selected", this.elem)
	}
});

PlacesListView = ListView.extend({
	rowView: PlacesRowView,
	className: "places-list-view list-view"
});