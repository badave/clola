DashboardToolbarView = Backbone.Marionette.Layout.extend({
  template_path: "dashboard/toolbar/templates/toolbar",
  context: function() {
    var selected_location_exists = false;
    var selected_location_name = "Locations";

    if(App.selected_location) {
      selected_location_name = App.selected_location.get('name');
      selected_location_exists = true; // 
    }

    return {
      locations: this.business.locations().toJSON(),
      selected_location_name: selected_location_name,
      selected_location_exists: selected_location_exists
    };
  },
  onRender: function() {
    var that = this;
    this.$el.find('.ui.dropdown')
    .dropdown({
      onChange: function(value, text) {
        if(value === "all") {
          that.locations = that.business.locations();
          delete App.selected_location;
        } else {
          var location = App.locations.find(function(location) {
            return location.get('_id') === value;
          });

          that.locations = that.locations || new LocationsCollection();
          that.locations.set([location]);
          App.selected_location = location;
        }

        that.render();

        // This is passed in from customers
        if(that.update) {
          that.update();
        }
      }
    });
  },
  events: {
    "click .add-location": function() {
      var that = this;
      var location = new Location({
        "address": that.business.get('address'),
        "business_id": that.business.id
      });

      var modal = new LocationModal({
        model: location,
        animate: true,
        onSave: function() {
          that.locations.add(location);
          App.locations.add(location);
          that.render();
        }
      });

      modal.open();
    }
  }
});