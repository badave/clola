ListRowView = Backbone.Marionette.ItemView.extend({
	tagName: "li",
	render: function() {
		this.$el.html(this.elem);
		return this;
	},
	events: {
		"click": "select",
		"tap": "select"
	},
	select: function() {
		// unselect and reselect
		this.$el.parent().find(".selected").removeClass("selected");
		this.$el.addClass("selected");
		if(this.onSelect) {
			this.onSelect();
		}
	}
});