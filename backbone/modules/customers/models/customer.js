Customer = BaseModel.extend({ 
	resource: "customers",
	url: function() {
		if(this.get("phone")) {
			return this.urlRoot() + "/" + this.get("phone");
		}
		return this.urlRoot();
	},
	addLocation: function(location, callback) {
		var previous_locations = this.get("previous_locations") || [];
		location.updated = new Date().getTime();
		location.updated_date = new Date();
		previous_locations.unshift(location);
		this.set("previous_locations", previous_locations);
		this.save({}, {
			success: callback
		});
	}
});