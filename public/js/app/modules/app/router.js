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

      loadPlaces(function() {
        if(!that.placesLayout) {
          that.placesLayout = new PlacesLayout({
            collection: that.places
          });

          App.layout.places.show(that.placesLayout);
        }
      });

      // loadMessages(function() {
        if(!that.messagesLayout) {
          that.messagesLayout = new MessagesLayout({
            collection: App.messages
          });

          App.layout.messages.show(that.messagesLayout);
        }
      // });
    };

    function loadPlaces(callback) {
      that.places = new PlacesCollection();

      that.places.fetch({
        prefill: true,
        prefillSuccess: function() {
          callback();
        },
        success: function() {
          callback();
        }
      });
    }

    function loadMessages(callback) {

      callback();
    }

    return Backbone.Router.apply(that, arguments);
  }
});