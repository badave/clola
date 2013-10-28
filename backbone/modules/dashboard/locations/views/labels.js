DashboardLocationLabels = Backbone.Marionette.CompositeView.extend({
  template_path: "dashboard/locations/templates/labels",
  itemView: DashboardLocationLabel,
  itemViewContainer: '.locations'
});