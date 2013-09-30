PlaceEditView = Backbone.Marionette.ItemView.extend({
	template_path: "app/places/templates/form",
	tagName: "form",
	className: "place-form hide",
	events: {
		"click .hide-sidepane": "hidePane",
		"click .save": "save",
		"submit": "save"
	},
	hidePane: function() {
		App.vent.trigger("hide:sidepane-left");
	},
	onRender: function() {
		$(this.$el.find('[name="city"]')).typeahead({name: "city", local: this.cities });
		$(this.$el.find('[name="area"]')).typeahead({name: "area", local: this.areas });
		$(this.$el.find('[name="category"]')).typeahead({local: this.categories });
		$(this.$el.find('[name="subcategory"]')).typeahead({local: this.subcategories });
		$(this.$el.find('[name="tags"]')).tagsManager();
	},
	save: function(e) {
		e.preventDefault();

		var data = Backbone.Syphon.serialize(this);

		var required_fields = ["name", "city", "area", "category", "subcategory"];
		var valid = true;

		_.each(required_fields, function(field) {
			if(_.isEmpty(data[field])) {
				$('[name="' + field + '"]').tooltipHelper("Required Field");
				valid = false;
			}
		});

		if(!valid) {
			return;
		}


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
				that.hidePane();
			},
			error: function() {

			}
		});
	}

});