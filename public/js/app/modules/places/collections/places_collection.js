PlacesCollection = BaseCollection.extend({
	resource: "places",
	cities: function() {
		var cities = _.uniq(this.pluck("city"));
		return cities;
	}
});