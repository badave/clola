VendorEmptyView = Backbone.Marionette.ItemView.extend({
  events: {
    "click .a": "handleAClick"
  },
  template_path: "dashboard/vendors/templates/empty",
  handleAClick: function(e) {
    e.preventDefault();
    
    Backbone.history.navigate($(e.target).attr("href"), { trigger: true});
  },
});