VendorLayout = Backbone.Marionette.Layout.extend({
  template_path: "vendors/templates/layout", 
  className: "vendor",
  regions: {
    header: "#header",
    form: "#form",
    vendor_home: "#vendor-home"
  },
  regionViews: function() { 
    return {
      header: HeaderView,
      form: FormView,
      vendor_home: VendorView
    };
  }
});