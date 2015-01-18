Location = BaseModel.extend({
  resource: "locations",
  urlRoot: function() {
    if(this.get("business_id")) {
      return "/v1/businesses/" + this.get("business_id") + "/" + this.resource;
    } else {
      return "/v1/locations";
    }
  },
  url: function() {
    if(this.isNew()) {
      return this.urlRoot();
    }
    return this.urlRoot() + "/" + this.get("_id");
  }
});