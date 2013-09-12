CustomerView = Backbone.Marionette.ItemView.extend({
	template_path: "customers/templates/customer",
	className: "customer-view",
	events: {
		"click .edit": "onEdit",
		"click .sent-places": "onPlace"
	},
	context: function(modelJson) {
		var facebook = modelJson.facebook;

		return {
			model: modelJson,
			facebook: this.facebook(),
			facebook_user: this.facebook_user(),
			facebook_image: this.facebook_image(),
			twitter: this.twitter(),
			linkedin: this.linkedin(),
			yelp: this.yelp()
		}
	},

	facebook: function() {
		var facebook = this.model.get("facebook");

		if(facebook) {
			if(facebook.indexOf("https://") < 0) {
				facebook = "https://www.facebook.com/" + facebook;
			}
		}

		return facebook;
	},

	facebook_user: function() {
		var facebook_user = this.model.get("facebook");

		if(facebook_user && facebook_user.indexOf("https://") >= 0) {
			facebook_user = facebook_user.replace("https://www.facebook.com/", "");

			if(facebook_user.indexOf("?") >= 0) {
				facebook_user = facebook_user.substr(0, facebook_user.indexOf("?"));
			}
		}

		return facebook_user;
	},

	facebook_image: function() {
		return "https://graph.facebook.com/" + this.facebook_user() + "/picture";
	},

	twitter: function() {
		var twitter = this.model.get("twitter");

		if(twitter) {
			twitter = twitter.replace("@", "");

			if(twitter.indexOf("https://") < 0) {
				twitter = "https://www.twitter.com/" + twitter;
			}
		}

		return twitter;
	},

	linkedin: function() {
		var linkedin = this.model.get("linkedin");

		if(linkedin) {
			if(linkedin.indexOf("https://") < 0) {
				linkedin = "https://www.linkedin.com/in/" + linkedin;
			}
		}

		return linkedin;
	},

	yelp: function() {
		var yelp = this.model.get("yelp");

		if(yelp) {
			if(yelp.indexOf("https://") < 0) {
				yelp = "http://" + yelp + ".yelp.com/";
			}
		}

		return yelp;
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