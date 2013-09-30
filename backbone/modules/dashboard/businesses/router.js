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
      that.business = new Business();
    };

    that.businesses = function(params) {
      var dash = new DashLayout();
      dash.render();

      that.business.fetch({
        success: function() {
          var view = new BusinessesCompositeView({
            collection: that.businesses
          });

          dash.body.show(view);
        }
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
      debugger
      var business = new Business();

      var view = new BusinessForm({model: business});

      dash.body.show(view);


    }

    return Backbone.Router.apply(that, arguments);
  }

});