CustomerView = Backbone.Marionette.ItemView.extend({
	template_path: "customers/templates/customer",
	className: "customer-view",
	events: {
		"click .edit": "onEdit"
	},
	onEdit: function() {
		App.vent.trigger("customer:edit", this.model);
	}
});
