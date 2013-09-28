VendorsCompositeView = Backbone.Marionette.CompositeView.extend({
  template_path: "vendors/templates/composite",
  constructor: function() {
    this.itemViewContainer = ".items";
    this.itemView = VendorView;
    this.emptyView = Backbone.Marionette.ItemView.extend({
      events: {
        "click .a": "handleAClick"
      },
      template_path: "vendors/templates/empty",
      handleAClick: function(e) {
        e.preventDefault();
        
        Backbone.history.navigate($(e.target).attr("href"), { trigger: true});
      },
    });

    return Backbone.Marionette.CompositeView.apply(this, arguments);
  }
});