var BaseCollection = Backbone.Collection.extend({
  resource: "",
  version: "v1",
  urlRoot:function () {
    return App.API_URL + "/" + this.version + "/"  + this.resource;
  },
  url:function () {
    return this.urlRoot();
  },
  pluckUnique: function(str) {
    return _.uniq(this.pluck(str));
  },
  // ------------------------------------------ Fetch
  findRemote: function (params, callback) {
    var currentPage = params.current_page || 1;
    var limit = params.limit || App.Pagination.NUM_ITEMS_PER_PAGE;
    var data = {
      limit: limit,
      skip:(currentPage - 1) * App.Pagination.NUM_ITEMS_PER_PAGE,
      sort: params.sort || "",
      order: params.order || ""
    };

    _.extend(data, params);
    var that = this;

    var length = that.length;

    var options = {
      data: data,
      reset: true,
      prefill: true,
      prefillSuccess: callback,
      success: callback
    };

    this.fetch(options);
  },
  load: function(callback) {
    var that = this;

    this.params = this.params || {};
    
    that.last_loaded = new Date();
    
    this.findRemote(this.params, function() {
      // sets loaded to true
      that.loaded = true;

      if(callback) {
        callback();
      }
    });
  },
  modelIds: function () {
    return this.pluck("_id");
  },

  bulkUpdate: function(data, callback, failCallback) {
    var ids = this.modelIds();

    $.ajax({
      method: "PUT",
      url: this.url(),
      data: {
        "ids": ids,
        "data": data
      }
    }).always(function(data, status, xhr) {
      callback(data);
    }).fail(function(xhr, status, error) {
      failCallback(xhr);
    });
  },
  shouldUpdate: function() {
    if(typeof(this.last_loaded) !== "undefined") {
      var now = new Date();
      if(now - this.last_loaded < 10000) {
        return false;
      }
    }
    return true;
  }
});