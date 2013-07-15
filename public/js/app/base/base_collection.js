var BaseCollection = Backbone.Collection.extend({
  resource: "",
  urlRoot:function () {
    return App.API_URL + "/v1/" + this.resource;
  },
  url:function () {
    return this.urlRoot();
  },
	pluckUnique: function(str) {
  	return _.uniq(this.pluck(str));
  }
});
