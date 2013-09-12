FormView = Backbone.Marionette.ItemView.extend({
  template_path: "vendors/templates/form",
  className: "vendor-body",
  events: {
    "click .btn-save": "hide"
  },
  hide: function() {
    $("#info").hide();

    $("#vendor-home").show();
  }
});