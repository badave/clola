var BusinessRouter = Backbone.Router.extend({
  constructor:function () {
    var that = this;

    // ------------------------------------------ Config

    that.routes = {
      "dashboard/businesses": "businesses",
      "dashboard/businesses/new": "create",
      "dashboard/businesses/:id": "edit"
    };

    that.initialize = function() {
      App.businesses = App.businesses || new BusinessesCollection();
      App.businesses.load();

      App.locations = App.locations || new LocationsCollection();
      App.locations.load();
    };

    that.businesses = function(params) {
      var dash = new DashLayout();
      dash.render();

      waitFor(function() {
        return App.businesses.loaded;
      }, function() {
        var view = new BusinessCompositeView({
          collection: App.businesses
        });

        dash.body.show(view);
      });

      App.businesses.load();
    };

    that.create = function() {
      var dash = new DashLayout();
      dash.render();

      var business = new Business();

      var view = new BusinessModal({model: business});

      view.open();
    };

    that.edit = function(params) {
      var dash = new DashLayout();
      dash.render();

      waitFor(function() {
        return App.businesses.loaded;
      }, function() {
        var business = App.businesses.findWhere({"_id": params}) || new Business({
          _id: params
        });

        var view = new BusinessForm({
          model: business
        });

        business.fetch({
          success: function() {
            view.render();
          }
        });

        view.open();

      });
    };

    return Backbone.Router.apply(that, arguments);
  }

});