BaseModel = Backbone.Model.extend({
	idAttribute: "_id",
	resource: "",
	urlRoot: function() {
		return "/v1/" + this.resource;
	},
	url: function() {
		if(this.isNew()) {
			return this.urlRoot();
		}
		return this.urlRoot() + "/" + this.get("_id");
	}
});