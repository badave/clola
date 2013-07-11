var AppRouter = Backbone.Router.extend({
  constructor:function () {
    var that = this;

    // ------------------------------------------ Config

    that.routes = {
      "app":"index"
    };

    // ------------------------------------------ Actions

    that.index = function (params) {
      // load everything
      // 
      App.PlacesController = new PlacesController();

      App.PlacesController.listenTo(App.PlacesController, "places:loaded", function() {
        App.layout.places.show(App.PlacesController.layout);
      });
    };

    return Backbone.Router.apply(that, arguments);
  }
});