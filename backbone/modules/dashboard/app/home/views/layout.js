DashboardHomeLayout = Backbone.Marionette.Layout.extend({
  template_path: "dashboard/app/home/templates/layout",
  className: "segment",
  events: {
    "click .add-business": "addBusiness",
    "click .add-location": "addLocation",
    "click .request-verification": "addPayment"
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
        // completed
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
    location.set("address", App.businesses.models[0].get("address")); 

    var view = new LocationModal({
      model: location,
      animate: true,
      onSave: function() {
        App.locations.add(location);
        that.render();
      }
    });

    view.open();
  },
  addPayment: function() {
    var that = this;

    var payment = new Payment();

    payment.set("address", App.businesses.models[0].get("address")); 
    payment.set("business_id", App.businesses.models[0].id);

    var view = new PaymentModal({
      model: payment,
      animate: true,
      onSave: function() {

      }
    });

    view.open();
  }
});