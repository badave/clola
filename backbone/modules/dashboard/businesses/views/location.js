LocationView = Backbone.Marionette.ItemView.extend({
  autoupdate: true,
  template_path: "dashboard/businesses/templates/location",
  events: {
    "click .edit": "edit",
    "click .verify": "verify"
  },
  edit: function() {
    var modalView = new LocationModal({
      model: this.model,
      animate: true,
    });

    modalView.open();
  },
  verify: function() {
    var modalView = new VerifyModal({
      model: this.model,
      animate: true,
    });

    modalView.open();
  }
});