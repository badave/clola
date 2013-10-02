BusinessCompositeView = Backbone.Marionette.CompositeView.extend({
  template_path: "dashboard/businesses/templates/composite",
  constructor: function() {
    this.itemViewContainer = ".items";
    this.itemView = BusinessView;
    this.emptyView = BusinessEmptyView;

    return Backbone.Marionette.CompositeView.apply(this, arguments);
  }
});