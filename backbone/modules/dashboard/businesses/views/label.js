DashboardBusinessLabel = Backbone.Marionette.Layout.extend({
  template_path: 'dashboard/businesses/templates/label',
  constructor: function() {
    // this.regions =  {
    //   locations: '.locations'
    // };

    // this.regionViews = {
    //   locations: DashboardLocationLabels
    // };

    this.className = "sidebar-row";

    return Backbone.Marionette.Layout.apply(this, arguments);
  },

  // this gets passed into DashboardLocationLabels
  itemViewOptions: function() {
    var locations = this.model.locations();
    return {
      collection: locations,
      business: this.model
    };
  }
});