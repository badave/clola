DashboardLayout = Backbone.Marionette.Layout.extend({
  template_path: "dashboard/app/templates/layout",
  className: "dashboard",
  regions: {
    "home": "#home",
    "businesses": ".businesses",
    "customers": ".customers"
  },
  regionViews: function() {
    return {
      home: DashboardHomeLayout,
      businesses: DashboardBusinessesLayout,
      customers: DashboardCustomersLayout
    };
  }
});