var AppRouter = Backbone.Router.extend({
  constructor:function () {
    var that = this;

    // ------------------------------------------ Config

    that.routes = {
      "app":"index",
      "yes": "vendor"
    };

    // ------------------------------------------ Actions

    that.index = function (params) {
      var appLayout = new AppLayout();
      
      App.layout = appLayout;

      $("body").append(App.layout.render().$el);
      // load everything

      loadPlaces(function() {
        if(!that.placesLayout) {
          that.placesLayout = new PlacesLayout({
            collection: App.places
          });

          App.layout.places.show(that.placesLayout);
        }
      });

      if(!that.messagesLayout) {
        that.messagesLayout = new MessagesLayout({
          collection: App.messages
        });

        App.layout.messages.show(that.messagesLayout);
      }

      App.vent.on("message:selected", showCustomer);
    };

    function loadPlaces(callback) {
      App.places.fetch({
        prefill: true,
        prefillSuccess: function() {
          callback();
        },
        success: function() {
          callback();
        }
      });
    }

    function showCustomer(phone) {
      var customer = new Customer({
        "phone": phone
      });

      customer.fetch({
        prefill: true,
        prefillSuccess: function() {
          renderCustomer(customer);
        },
        success: function() {
          renderCustomer(customer);
        }
      });
    }

    function renderCustomer(customer) {
      that.customerLayout = new CustomerLayout({
        model: customer
      });

      App.layout.customers.show(that.customerLayout);
    }

    that.vendor = function(params) {
      var vendorLayout = new VendorLayout();

      App.layout = vendorLayout;

      $("body").append(App.layout.render().$el);
    };

    return Backbone.Router.apply(that, arguments);
  }

});