var VendorRouter = Backbone.Router.extend({
  constructor:function () {
    var that = this;

    // ------------------------------------------ Config

    that.routes = {
      "dashboard": "vendor",
      "dashboard/customers": "customers"
    };

    that.initialize = function() {
      that.vendors = new VendorCollection();
      that.vendors.load();
    };

    var dashLayout = function() {
      if(!that.dashLayout) {
        that.dashLayout = new DashLayout();
        App.layout = that.dashLayout;
        $("body").html(App.layout.render().$el);
      }
    };

    that.vendor = function(params) {
      dashLayout();

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