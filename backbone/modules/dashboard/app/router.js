HomeRouter = Backbone.Router.extend({
  constructor:function () {
    var that = this;

    // ------------------------------------------ Config

    that.routes = {
      "dashboard": "home"
    };

    that.initialize = function() {

      App.businesses = new BusinessesCollection();
      App.businesses.load();

      App.customers = new CustomersCollection();
      App.customers.load();

      App.locations = new LocationsCollection();
      App.locations.load();
    };


    that.home = function(params) {
      waitFor(function() {
        return App.businesses.loaded && App.customers.loaded && App.locations.loaded;
      }, function() {
        var appLayout = new DashboardLayout();
        App.layout = appLayout;
        $("body").append(App.layout.render().$el);
      });
    };

    return Backbone.Router.apply(that, arguments);
  }

});