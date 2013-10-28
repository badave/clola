Business = BaseModel.extend({
  resource: "businesses",

  locations: function() {
    var that = this;
    var locations = App.locations.filter(function(location) {
      return location.get('verified') && location.get('business_id') === that.id;
    });

    return new LocationsCollection(locations);
  }
});