CustomerView = Backbone.Marionette.ItemView.extend({
	template_path: "customers/templates/customer",
	className: "customer-view",
	events: {
		"click .edit": "onEdit"
	},
	onEdit: function() {
		App.vent.trigger("customer:edit", this.model);
	},
	bindEvents: function() {
		var that = this;
		this.model.on("change:previous_places", function() {
			that.render();
		});
	}
});