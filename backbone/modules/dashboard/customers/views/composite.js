DashboardCustomersCompositeView = Backbone.Marionette.CompositeView.extend({
  template_path: "dashboard/customers/templates/composite",
  tagName: "span",
  constructor: function() {
    this.itemViewContainer = ".squares";
    this.itemView = DashboardCustomerRowView;
    this.emptyView = DashboardCustomersEmptyView;

    return Backbone.Marionette.CompositeView.apply(this, arguments);
  },
  events: {
    "click .customer-square-view": "showSquares",
    "click .customer-list-view": "showList"
  },
  showSquares: function() {
    this.itemViewContainer = ".squares";
    this.itemView = DashboardCustomerRowView;
    this.emptyView = DashboardCustomersEmptyView;

    this.render();

    this.$el.find(".customers-table").hide();
    this.$el.find(".squares").show();

    this.$el.find(".selected").removeClass("selected");
    this.$el.find(".customer-square-view").addClass("selected");
  },
  showList: function() {
    this.itemViewContainer = "tbody";
    this.itemView = DashboardCustomersTableRowView;
    this.emptyView = DashboardCustomersTableEmptyView;

    this.render();

    this.$el.find(".customers-table").show();
    this.$el.find(".squares").hide();
    this.$el.find(".selected").removeClass("selected");
    this.$el.find(".customer-list-view").addClass("selected");
  }
});