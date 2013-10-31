DashboardCustomersLayout = Backbone.Marionette.Layout.extend({
  template_path: "dashboard/customers/templates/layout",
  regions: {
    customers: '.customers'
  },
  regionViews: function() {
    return {
      customers: DashboardCustomersCompositeView
    };
  },
  context: function(modelJson) {
    return {
      model: modelJson,
      locations: this.locations.toJSON()
    };
  },

  updateCollection: function() {
    var that = this;
    var arr = [];

    // TODO make a serverside call
    this.locations.each(function(location) {
      var customers = App.customers.filter(function(customer) {
        return customer.hasBeenToPlace(location.get('place_id'));
      });

      arr = arr.concat(customers);
    });

    this.collection = new CustomersCollection(arr);

    return this;
  },

  initialize: function() {
    var that = this;
    this.locations = App.businesses.first().locations();

    that.updateCollection();

    App.vent.on("business.selected", function(business) {
      that.business = business;
      that.locations = business.locations();

      that.updateCollection();

      that.render();
    });

    return Backbone.Marionette.Layout.prototype.initialize.apply(this, arguments);
  },
  onRender: function() {
    var that = this;
    this.$el.find('.ui.dropdown')
    .dropdown({
      onChange: function(value, text) {
        if(value !== "all") {
          var location = App.locations.find(function(location) {
            return location.get('_id') === value;
          });

          that.locations = new LocationsCollection([location]);
        } else {
          that.locations = that.business.locations();
        }

        that.updateCollection();
        
        that.render();
      }
    });
  }
});