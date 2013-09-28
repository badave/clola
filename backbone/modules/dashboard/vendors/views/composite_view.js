VendorsCompositeView = Backbone.Marionette.CompositeView.extend({
  template_path: "dashboard/vendors/templates/composite",
  constructor: function() {
    this.itemViewContainer = ".items";
    this.itemView = VendorView;
    this.emptyView = VendorEmptyView;

    return Backbone.Marionette.CompositeView.apply(this, arguments);
  }
});