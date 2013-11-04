DashboardCustomerTableView = Backbone.Marionette.CompositeView.extend({
  template_path: "dashboard/customers/templates/table/table",
  itemView: DashboardCustomerTableRowView,
  emptyView: DashboardCustomerTableEmptyView,
  tagName: "table",
  className: "ui table segment"
});