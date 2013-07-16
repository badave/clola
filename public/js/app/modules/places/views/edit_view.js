PlaceEditView = Backbone.Marionette.ItemView.extend({
	template_path: "places/form",
	tagName: "form",
	className: "place-form hide",
	events: {
		"click .hide-sidepane": "hidePane",
		"click .save-place": "save",
		"submit": "save"
	},
	hidePane: function() {
		App.vent.trigger("hide:sidepane-left");
	},
	onRender: function() {
		$(this.$el.find('[name="city"]')).typeahead({source: this.cities });
		$(this.$el.find('[name="area"]')).typeahead({source: this.areas });
		$(this.$el.find('[name="category"]')).typeahead({source: this.categories });
		$(this.$el.find('[name="subcategory"]')).typeahead({source: this.subcategories });
		$(this.$el.find('[name="tags"]')).tagsManager();
	},
	save: function() {
		var data = Backbone.Syphon.serialize(this);

		if(data["hidden-tags"]) {
			data.tags = data["hidden-tags"];
			delete data["hidden-tags"];
		}

		this.model.set(data);

		var isNew = this.model.isNew();
		var that = this;

		this.model.save({}, {
			success: function() {
				if(isNew) {
					App.vent.trigger("place:created", that.model);
				}

				App.vent.trigger("hide:sidepane-left");
			},
			error: function() {
				alert("Failed to Save");
			}
		});
	}

});