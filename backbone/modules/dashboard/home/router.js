HomeRouter = Backbone.Router.extend({
  constructor:function () {
    var that = this;

    // ------------------------------------------ Config

    that.routes = {
      "dashboard": "home"
    };

    that.initialize = function() {
      that.businesses = new BusinessesCollection();
      that.businesses.load();
    };


    that.home = function(params) {
      var dash = new DashLayout();
      dash.render();

      waitFor(function() {
        return that.businesses.loaded;
      }, function() {
        var view;
        if(that.businesses.length) {
          view = new VendorsCompositeView({
            collection: that.businesses
          });
        } else {
          view = new VendorEmptyView();
        }

        dash.body.show(view);
      });
    };

    // that.customers = function(params) {
    //   var dash = new DashLayout();
    //   dash.render();

    //   waitFor(function() {
    //     return that.vendors.loaded;
    //   }, function() {
    //     // var view = new VendorsCompositeView({
    //     //   collection: that.vendors
    //     // });

    //     // dash.body.show(view);
    //   });
    // };

    return Backbone.Router.apply(that, arguments);
  }

});