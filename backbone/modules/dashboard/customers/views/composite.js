DashboardCustomersCompositeView = Backbone.Marionette.CompositeView.extend({
  template_path: "dashboard/customers/templates/composite",
  tagName: "span",
  constructor: function() {
    this.itemViewContainer = ".squares";
    this.itemView = DashboardCustomersView;
    this.emptyView = DashboardCustomersEmptyView;

    return Backbone.Marionette.CompositeView.apply(this, arguments);
  },
});