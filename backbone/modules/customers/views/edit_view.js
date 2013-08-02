CustomerEditView = Backbone.Marionette.ItemView.extend({
	template_path: "customers/templates/form",
	tagName: "form",
	className: "customer-form hide",
	events: {
		"click .hide-sidepane": "hidePane",
		"click .save": "save",
		"submit": "save"
	},
	hidePane: function() {
		App.vent.trigger("hide:sidepane-right");
	},
	save: function(e) {
		e.preventDefault();

		var data = Backbone.Syphon.serialize(this);

		if(data.location) {
			this.model.addLocation(data.location);
		}

		this.model.set(data);

		var isNew = this.model.isNew();
		var that = this;

		var bh = $(".save").buttonHelper("Saving");
		bh.loading();

		this.model.save({}, {
			success: function() {
				bh.success();
				that.hidePane();
			},
			error: function() {
				$(".save").buttonHelper.failed();
			}
		});
	}
});