BusinessCompositeView = Backbone.Marionette.CompositeView.extend({
  template_path: "dashboard/businesses/templates/composite",
  events: {
    "click .new-business": "openBusiness"
  },
  itemViewOptions: function(model) {
    return {
      collection: new LocationsCollection(App.locations.filter(function(location) {
        return location.get("business_id") === model.id;
      })),
      businesses: this.collection
    };
  },
  constructor: function() {
    this.itemViewContainer = ".items";
    this.itemView = BusinessLocationView;
    this.emptyView = BusinessEmptyView;

    return Backbone.Marionette.CompositeView.apply(this, arguments);
  },
  openBusiness: function() {
    var business = new Business();

    var view = new BusinessModal({model: business});

    view.open();
  }
});