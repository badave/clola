var DashboardCustomersRouter = Backbone.Router.extend({
  constructor:function () {
    var that = this;

    // ------------------------------------------ Config

    that.routes = {
      "dashboard/customers": "index",
      "dashboard/customers/new": "create",
      "dashboard/customers/:id": "edit"
    };

    that.initialize = function() {
      that.customers = new CustomersCollection();
      that.customers.load();
    };

    that.index = function(params) {
      var dash = new DashLayout();
      dash.render();

      waitFor(function() {
        return that.customers.loaded;
      }, function() {
        var view = new DashboardCustomersCompositeView({
          collection: that.customers
        });

        dash.body.show(view);
      });

      that.customers.load();
    };

    return Backbone.Router.apply(this, arguments);
  }
});