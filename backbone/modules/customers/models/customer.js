Customer = BaseModel.extend({ 
	resource: "customers",
	url: function() {
		if(this.get("phone")) {
			return this.urlRoot() + "/" + this.get("phone");
		}
		return this.urlRoot();
	},
	addLocation: function(description, callback) {
		var previous_locations = this.get("previous_locations") || [];
		var location = { "description": description };
		location.updated = new Date().getTime();
		location.updated_date = new Date();
		previous_locations.unshift(location);
		this.set("previous_locations", previous_locations);
	}
});