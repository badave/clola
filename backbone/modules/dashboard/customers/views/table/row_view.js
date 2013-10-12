DashboardCustomersTableRowView = Backbone.Marionette.ItemView.extend({
  template_path: "dashboard/customers/templates/table/row",
  tagName: "tr",
  context: function(modelJson) {
    var visits = this.model.getVisits();

    _.each(visits, function(visit) {
      visit.location = visit.location ? visit.location.toJSON(): undefined;
    });

    return {
      model: modelJson,
      visits: visits
    };
  }
});