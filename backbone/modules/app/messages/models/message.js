Message = BaseModel.extend({
	resource: "messages",
	url: function() {
    if(this.get("phone")) {
      return this.urlRoot() + "/" + this.get("phone");
    }
    return this.urlRoot();
  },
});