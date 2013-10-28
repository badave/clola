DashboardBusinessLabel = Backbone.Marionette.Layout.extend({
  template_path: 'dashboard/app/businesses/templates/label',
  className: 'ar',
  constructor: function() {
    this.regions =  {
      locations: '.locations'
    };

    this.regionViews = {
      locations: DashboardLocationLabels
    };

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