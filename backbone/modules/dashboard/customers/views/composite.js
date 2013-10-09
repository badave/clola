DashboardCustomersCompositeView = Backbone.Marionette.CompositeView.extend({
  template_path: "dashboard/customers/templates/composite",
  constructor: function() {
    this.itemViewContainer = "tbody";
    this.itemView = DashboardCustomersView;
    this.emptyView = DashboardCustomersEmptyView;

    return Backbone.Marionette.CompositeView.apply(this, arguments);
  },
});