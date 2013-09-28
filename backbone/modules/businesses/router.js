var BusinessRouter = Backbone.Router.extend({
  constructor:function () {
    var that = this;

    // ------------------------------------------ Config

    that.routes = {
      "dashboard/businesses": "businesses"
    };

    that.initialize = function() {
      that.vendors = new VendorCollection();
    };

    that.vendor = function(params) {
      dashLayout();

      that.vendors.load();

      waitFor(function() {
        return that.vendors.loaded;
      }, function() {
        var view = new VendorsCompositeView({
          collection: that.vendors
        });

        App.layout.body.show(view);
      });
    };

    that.customers = function(params) {
      dashLayout();

      waitFor(function() {
        return that.vendors.loaded;
      }, function() {

      });
    }

    return Backbone.Router.apply(that, arguments);
  }

});