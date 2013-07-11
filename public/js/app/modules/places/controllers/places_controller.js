PlacesController = Marionette.Controller.extend({
	loadPlaces: function() {
		var that = this;
		that.places.fetch({
		  success: function() {
				that.trigger("places:loaded", that.places);
		  }
		});
	},
	initialize: function() {
		var that = this;

		that.places = new PlacesCollection();

		that.loadPlaces();

		that.layout = new PlacesLayout({
			collection: that.places
		});
	}
});