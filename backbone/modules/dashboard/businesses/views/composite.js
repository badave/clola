BusinessCompositeView = Backbone.Marionette.CompositeView.extend({
  template_path: "dashboard/businesses/templates/composite",
  events: {
    "click .new-business": "openBusiness"
  },
  itemViewOptions: function(model) {
    var locations = new LocationsCollection();
    locations.business_id = model.id;

    return {
      collection: locations
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