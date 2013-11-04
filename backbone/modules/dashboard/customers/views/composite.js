DashboardCustomersCompositeView = Backbone.Marionette.Layout.extend({
  template_path: "dashboard/customers/templates/composite",
  tagName: "span",

  // This shit is annoying.  This basically munges location
  // customer, location, and place data into an object with date as string being the key
  // This is then impossible to sort because you can't sort objects
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
    var that = this;

    var visits = this.gatherByDate();

    var dates = _.keys(visits);

    dates = dates.sort(function(a, b) {
      var a_date = new Date(a).getTime();
      var b_date = new Date(b).getTime();
      return b_date - a_date;
    });

    var $el = this.$el.find('.squares');
    _.each(dates, function(date) {
      var $line = $('<div class="squares-line" />');
      $line.append('<h4 class="ui inverted black block header">' + date + '</h4>');
      _.each(visits[date], function(data, customer_id) {
        // Data is form []
        _.each(data, function(d) {
          $line.append(new DashboardCustomerRowView({
            model: d.customer,
            data: d
          }).render().$el);
        });
      });
      $el.append($line);
    });
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