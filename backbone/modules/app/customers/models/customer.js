Customer = BaseModel.extend({ 
	resource: "customers",
	url: function() {
		if(this.get("phone")) {
			return this.urlRoot() + "/" + this.get("phone");
		}
		return this.urlRoot();
	},
	addLocation: function(description) {
		var previous_locations = this.get("previous_locations") || [];
		var location = { "description": description };
		location.updated = new Date().getTime();
		location.updated_date = new Date();
		previous_locations.unshift(location);
		this.set("previous_locations", previous_locations);
	},
	addPlace: function(place) {
		var previous_places = this.get("previous_places") || [];
		place = place.toJSON();
		place.updated = new Date().getTime();
		place.updated_date = new Date();
		previous_places.unshift(place);
		this.set("previous_places", previous_places);
	},
	places: function() {
		var previous_places = this.get('previous_places') || [];

		return _.filter(previous_places, function(place) {
			return place._id === place_id;
		});
	},
	hasBeenToPlace: function(place_id) {
		var previous_places = this.get('previous_places') || [];

		return _.find(previous_places, function(place) {
			return place._id === place_id;
		});
	},

	previousVisits: function(place_id) {
		var previous_places = this.get('previous_places') || [];

		return _.filter(previous_places, function(place) {
			return place._id === place_id;
		});
	},
	getVisits: function() {
		var previous_places = this.get("previous_places", []);

		_.each(previous_places, function(place) {
			var matching_location = App.locations.findWhere({
				"place_id": place._id
			});

			if(matching_location) {
				place.location = matching_location;
			}
		});

		var places = _.sortBy(previous_places, function(a, b) {
			return a.updated_date > b.updated_date;
		});

		return places;
	}
});