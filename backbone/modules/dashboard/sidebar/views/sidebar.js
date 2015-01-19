DashboardSidebar = Backbone.Marionette.CompositeView.extend({
  template_path: "dashboard/sidebar/templates/sidebar",
  constructor: function() {

    this.itemView = DashboardLabel;
    this.itemViewContainer = ".business-labels";

    return Backbone.Marionette.CompositeView.apply(this, arguments);
  },
  context: function(modelJson) {
    return {
      modelJson: modelJson,
      random: _.random(200),
      customers: App.customers.length
    }
  },
  initialize: function() {
    this.collection = App.businesses;

    return Backbone.Marionette.CompositeView.prototype.initialize.apply(this, arguments);
  },
  itemViewOptions: function(model, index) {
    return {
      model: model,
      index: index
    };
  },
  events: {
    'click .add': "addBusiness"
  },
  addBusiness: function() {
    var that = this;
    var business = new Business();
    var modal = new BusinessModal({
      model: business,
      onSave: function() {
        App.businesses.add(business);
        that.render();
      }
    });

    modal.open();
  }
});