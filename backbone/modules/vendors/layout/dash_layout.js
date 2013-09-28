DashLayout = Backbone.Marionette.Layout.extend({
  template_path: "vendors/layout/layout", 
  className: "vendor",
  regions: {
    sidebar: "#sidebar",
    body: "#body"
  },
  regionViews: function() { 
    return {
      sidebar: VendorSidebarView
    };
  }
});