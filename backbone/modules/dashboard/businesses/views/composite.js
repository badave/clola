BusinessCompositeView = Backbone.Marionette.CompositeView.extend({
  template_path: "dashboard/businesses/templates/composite",
  itemViewOptions: function(model) {
    var locations = new LocationsCollection();
    locations.business_id = model.id;

    return {
      collection: locations
    };
  },
  constructor: function() {
    this.itemViewContainer = ".items";
    this.itemView = BusinessView;
    this.emptyView = BusinessEmptyView;

    return Backbone.Marionette.CompositeView.apply(this, arguments);
  }
});