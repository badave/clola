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
      that.businesses = new BusinessesCollection();
      that.businesses.load();
    };

    that.businesses = function(params) {
      var dash = new DashLayout();
      dash.render();

      waitFor(function() {
        return that.businesses.loaded;
      }, function() {
        var view = new BusinessCompositeView({
          collection: that.businesses
        });

        dash.body.show(view);
      });
    };

    that.create = function() {
      var dash = new DashLayout();
      dash.render();

      var business = new Business();

      var view = new BusinessForm({model: business});

      dash.body.show(view);
    };

    that.edit = function(params) {
      var dash = new DashLayout();
      dash.render();

      waitFor(function() {
        return that.businesses.loaded;
      }, function() {


        var business = that.businesses.findWhere({"_id": params}) || new Business({
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

        dash.body.show(view);

      });
    };

    return Backbone.Router.apply(that, arguments);
  }

});