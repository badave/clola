DashboardCustomersLayout = Backbone.Marionette.Layout.extend({
  template_path: "dashboard/customers/templates/layout",
  initialize: function() {
    this.collection = App.customers;
    return Backbone.Marionette.Layout.prototype.initialize.apply(this, arguments);
  },
  regions: {
    customers: '.customers'
  },
  regionViews: function() {
    return {
      customers: DashboardCustomersCompositeView
    };
  }
});