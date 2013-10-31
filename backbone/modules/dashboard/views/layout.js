/**
 * Dashboard Layout controls the primary layout
 *
 * It will show the new user flow if not verified
 * It will show the dashboard if verified
 */

DashboardLayout = Backbone.Marionette.Layout.extend({
  template_path: "dashboard/templates/layout",
  className: "dashboard",
  regions: {
    "home": ".home",
    "businesses": ".businesses",
    "customers": ".customers"
  },
  regionViews: function() {
    return {
      home: DashboardHomeLayout,
      businesses: DashboardBusinessesSidebar,
      customers: DashboardCustomersLayout
    };
  },
  onRender: function() {
    var verified = App.locations.findWhere({"verified": true});

    if(!verified) {
      this.$el.find(".home").fadeIn();
    } else {
      this.$el.find('.sidebar').fadeIn();
      this.$el.find('.body').fadeIn();
    }

    this.$el.find('.sidebar')
      .sidebar('show')
    ;
  }
});