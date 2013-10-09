VendorEmptyView = Backbone.Marionette.ItemView.extend({
  template_path: "dashboard/vendors/templates/empty",
  events: {
    "click .new-business": "openBusiness"
  },
  openBusiness: function() {
    var business = new Business();

    var view = new BusinessModal({model: business});

    view.open();
  }
});