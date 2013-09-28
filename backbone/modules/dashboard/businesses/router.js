var BusinessRouter = Backbone.Router.extend({
  constructor:function () {
    var that = this;

    // ------------------------------------------ Config

    that.routes = {
      "dashboard/businesses": "businesses"
    };

    that.initialize = function() {
      that.businesses = new BusinessesCollection();
    };

    that.businesses = function(params) {
      var dash = new DashLayout();

      that.businesses.load();

      waitFor(function() {
        return that.businesses.loaded;
      }, function() {
        var view = new BusinessesCompositeView({
          collection: that.businesses
        });

        App.layout.body.show(view);
      });
    };

    return Backbone.Router.apply(that, arguments);
  }

});