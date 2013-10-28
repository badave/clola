DashboardLocationLabels = Backbone.Marionette.CompositeView.extend({
  template_path: "dashboard/app/locations/templates/labels",
  itemView: DashboardLocationLabel,
  itemViewContainer: '.locations'
});