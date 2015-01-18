DashboardCustomersCompositeView = Backbone.Marionette.Layout.extend({
  template_path: "dashboard/customers/templates/composite",
  tagName: "span",

  gatherByDate: function() {
    var customers = this.collection;
    var locations = this.locations;

    var obj = {};

    locations.each(function(location) {
      customers.each(function(customer) {
        var previous_visits = customer.previousVisits(location.get('place_id'));

        _.each(previous_visits, function(place) {
          var date = new Date(place.updated);

          var date_as_string = date.toLocaleDateString();

          obj[date_as_string] = obj[date_as_string] || {};

          obj[date_as_string][customer.id] = obj[date_as_string][customer.id] || [];

          obj[date_as_string][customer.id].push({
            customer: customer, 
            place: place, 
            location: location,
            date: date.toLocaleDateString()
          });
        });
      });
    });

    return obj;
  },

  onRender: function() {
    var visits = this.gatherByDate();

    return {
      visits: visits
    };
  },

  // constructor: function() {
  //   this.itemViewContainer = ".squares";
  //   this.itemView = DashboardCustomerRowView;
  //   this.emptyView = DashboardCustomersEmptyView;

  //   return Backbone.Marionette.CompositeView.apply(this, arguments);
  // },
  events: {
    "click .customer-square-view": "showSquares",
    "click .customer-list-view": "showList"
  },

  showSquares: function() {
    // this.itemViewContainer = ".squares";
    // this.itemView = DashboardCustomerRowView;
    // this.emptyView = DashboardCustomersEmptyView;

    // this.render();

    // this.$el.find(".customers-table").hide();
    // this.$el.find(".squares").show();

    this.$el.find(".selected").removeClass("selected");
    this.$el.find(".customer-square-view").addClass("selected");
  },
  showList: function() {
    // this.itemViewContainer = "tbody";
    // this.itemView = DashboardCustomersTableRowView;
    // this.emptyView = DashboardCustomersTableEmptyView;

    // this.render();

    // this.$el.find(".customers-table").show();
    // this.$el.find(".squares").hide();
    this.$el.find(".selected").removeClass("selected");
    this.$el.find(".customer-list-view").addClass("selected");
  }
});