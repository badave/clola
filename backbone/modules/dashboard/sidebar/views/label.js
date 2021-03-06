DashboardLabel = Backbone.Marionette.Layout.extend({
  template_path: 'dashboard/sidebar/templates/label',
  events: {
    "click a": function() {
      $('.sidebar-row.selected').removeClass("selected");
      this.$el.addClass("selected");

      App.selected_business = this.model;
      App.vent.trigger("business.selected", this.model);
    }
  },
  constructor: function() {
    this.className = "sidebar-row";

    return Backbone.Marionette.Layout.apply(this, arguments);
  },
  onRender: function() {
    // This automatically sets the selected business to the first business
    // though this could change to use params passed in
    if(this.index === 0) {
      this.$el.addClass("selected");
      App.vent.trigger("business.selected", this.model);
    }
  }
});