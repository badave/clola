DashboardHomeLayout = Backbone.Marionette.Layout.extend({
  template_path: "dashboard/app/home/templates/layout",
  className: "segment",
  events: {
    "click .add-business": "addBusiness",
    "click .add-location": "addLocation"
  },
  context: function() {
    var step = 0;

    if(App.businesses.length) {
      step = 1;
    }

    if(App.locations.length) {
      step = 2;

      var verified = App.locations.findWhere({"verified": true});

      if(!verified) {
        step = 3;
      } else {
        step = 4;
      }
    }

    return {
      step: step
    };
  },
  addBusiness: function() {
    var that = this;
    that.business = new Business();

    that.business.set("email", App.user.email);
    that.business.set("contact_name", App.user.name);

    var view = new BusinessModal({
      model: that.business,
      onSave: function() {
        App.businesses.add(that.business);
        that.render();
      }
    });
    view.open();
  },
  addLocation: function() {
    var that = this;
    var location = new Location();

    location.set("business_id", App.businesses.models[0].id);

  }
});