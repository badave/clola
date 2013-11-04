/**
 * This file also does the tooltip for locations...  This could be abstracted out into another view possibly
 */

DashboardCustomersLayout = Backbone.Marionette.Layout.extend({
  template_path: "dashboard/customers/templates/layout",
  regions: {
    customers: '.customers',
    toolbar: '.toolbar'
  },
  regionViews: function() {
    return {
      customers: DashboardCustomersCompositeView,
      toolbar: DashboardToolbarView
    };
  },
  itemViewOptions: function() {
    var that = this;

    return {
      business: that.business,
      locations: that.locations,
      collection: that.collection, // customers for customers compositeView
      update: function() {
        that.update();
      }
    };
  },

  update: function() {
    this.updateCollection();
    this.render();

    return this;
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

    this.collection = this.collection || new CustomersCollection();
    this.collection.set(arr);

    return this;
  },

  initialize: function() {
    var that = this;
    this.business = App.businesses.first();
    this.locations = App.businesses.first().locations();

    that.updateCollection();

    App.vent.on("business.selected", function(business) {
      that.business = business;
      that.locations = business.locations();

      that.updateCollection();
      that.render();
    });

    return Backbone.Marionette.Layout.prototype.initialize.apply(this, arguments);
  }
});