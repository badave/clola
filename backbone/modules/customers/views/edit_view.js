CustomerEditView = Backbone.Marionette.ItemView.extend({
	template_path: "customers/templates/form",
	tagName: "form",
	className: "customer-form hide",events: {
		"click .hide-sidepane": "hidePane",
		"click .save-place": "save",
		"submit": "save"
	},
	hidePane: function() {
		App.vent.trigger("hide:sidepane-left");
	},
	save: function() {
		var data = Backbone.Syphon.serialize(this);

		this.model.set(data);

		var isNew = this.model.isNew();
		var that = this;

		this.model.save({}, {
			success: function() {
				App.vent.trigger("hide:sidepane-left");
			},
			error: function() {
				alert("Failed to Save");
			}
		});
	}
});