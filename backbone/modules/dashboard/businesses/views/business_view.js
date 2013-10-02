BusinessView = Backbone.Marionette.CompositeView.extend({
  template_path: "dashboard/businesses/templates/business",
  events: {
    "click .a": "handleAClick",
    "click .add-location": "addLocation"
  },
  constructor: function() {
    this.itemViewContainer = ".locations";
    this.itemView = LocationView;

    return Backbone.Marionette.CompositeView.apply(this, arguments);
  },
  addLocation: function(e) {
    var modalView = new LocationModal({
      model: this.model,
      animate: true,
    });

    modalView.open();
  }
});