Location = BaseModel.extend({
  resource: "locations",
  urlRoot: function() {
    return "/v1/businesses/" + this.get("business_id") + "/" + this.resource;
  },
  url: function() {
    if(this.isNew()) {
      return this.urlRoot();
    }
    return this.urlRoot() + "/" + this.get("_id");
  }
});