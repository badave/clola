DashboardToolbarView = Backbone.Marionette.Layout.extend({
  template_path: "dashboard/toolbar/templates/toolbar",
  context: function() {
    return {
      locations: this.business.locations().toJSON()
    };
  },
  onRender: function() {
    var that = this;
    this.$el.find('.ui.dropdown')
    .dropdown({
      onChange: function(value, text) {
        if(value === "all") {
          that.locations = that.business.locations();
        } else if(value === "add") {
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
        } else {
          var location = App.locations.find(function(location) {
            return location.get('_id') === value;
          });

          that.locations = that.locations || new LocationsCollection();
          that.locations.set([location]);
        }

        that.render();

        if(that.updateCollection) {
          that.updateCollection();
        }
      }
    });
  }
});