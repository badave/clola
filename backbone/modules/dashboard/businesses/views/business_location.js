/*
  This is a composite view, but the collection is Locations
  composite.js holds the business collection and renders
  all this as an array
 */
BusinessLocationView = Backbone.Marionette.CompositeView.extend({
  template_path: "dashboard/businesses/templates/business",
  events: {
    "click .add-location": "addLocation",
    "click .edit-business": "editBusiness"
  },
  constructor: function() {
    var that = this;
    this.itemViewContainer = ".locations";
    this.itemView = LocationView;

    return Backbone.Marionette.CompositeView.apply(this, arguments);
  },
  addLocation: function(e) {
    var that = this;
    var location = new Location();

    location.set("business_id", this.model.id);

    var modalView = new LocationModal({
      model: location,
      animate: true,
      onSave: function() {
        that.collection.push(location);
      }
    });

    modalView.open();
  },

  editBusiness: function() {
    var view = new BusinessModal({model: this.model});
    view.open();
  },
  onRender: function() {
    this.collection.load();
  }
});