LocationsCollection = BaseCollection.extend({
  resource: "locations",
  model: Location,
  urlRoot: function() {
    if(this.business_id) {
      return "/v1/businesses/" + this.business_id + "/" + this.resource;
    } else {
      return "/v1/" + this.resource;
    }
  }
});