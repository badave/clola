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
	}
});