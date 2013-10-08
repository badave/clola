LocationsCollection = BaseCollection.extend({
  resource: "locations",
  model: Location,
  urlRoot: function() {
    return "/v1/businesses/" + this.business_id + "/" + this.resource;
  }
});