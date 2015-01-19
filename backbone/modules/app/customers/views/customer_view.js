CustomerView = Backbone.Marionette.ItemView.extend({
	template_path: "app/customers/templates/customer",
	className: "customer-view",
	events: {
		"click .edit": "onEdit",
		"click .sent-places": "onPlace"
	},
	context: function(modelJson) {
		return {
			model: modelJson,
			facebook: this.facebook(),
			facebook_user: this.facebook_user(),
			facebook_image: this.facebook_image(),
			twitter: this.twitter(),
			linkedin: this.linkedin(),
			yelp: this.yelp()
		};
	},

	onEdit: function() {
		App.vent.trigger("customer:edit", this.model);
	},
	bindEvents: function() {
		var that = this;
		this.model.on("change:previous_places", function() {
			that.render();
		});
	},
	onPlace: function(e) {
		var place_id = $(e.target).attr("data-id");
		var place = App.places.findWhere({"_id": place_id });

		if(place.get("address")) {
			$("#places-search").val(place.get("address"));
		} else {
			$("#places-search").val(place.get("name"));
		}
		$("#places-search").trigger("change");
	}
});

_.extend(CustomerView.prototype, SocialMediaUrls);