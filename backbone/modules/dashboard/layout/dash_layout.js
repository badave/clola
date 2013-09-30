DashLayout = Backbone.Marionette.Layout.extend({
  template_path: "dashboard/layout/layout", 
  className: "dash",
  regions: {
    sidebar: "#sidebar",
    body: "#body"
  },
  regionViews: function() { 
    return {
      sidebar: VendorSidebarView
    };
  },
  onRender: function() {
    $("body").html(this.$el);
    App.layout = this;
  }
});