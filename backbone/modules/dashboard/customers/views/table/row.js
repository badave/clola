DashboardCustomerTableRowView = Backbone.Marionette.ItemView.extend({
  template_path: "dashboard/customers/templates/table/row",
  tagName: "tr",
  events: {
    "click": "selectCustomer"
  },
  context: function(modelJson) {
    var visits = this.model.getVisits();
    var most_recent;

    if(visits.length > 0) {
      most_recent = visits[0].location.get('name');
      most_recent_date = visits[0].location.get('updated_at');
    }

    return {
      model: modelJson,
      facebook: this.facebook(),
      facebook_user: this.facebook_user(),
      facebook_image: this.facebook_image(),
      twitter: this.twitter(),
      linkedin: this.linkedin(),
      yelp: this.yelp(),
      visits: visits,
      most_recent: most_recent,
      most_recent_date: most_recent_date
    };
  },
  selectCustomer: function() {
    var modal = new DashboardCustomerModal({
      model: this.model
    });

    modal.open();
  }
});

_.extend(DashboardCustomerTableRowView.prototype, SocialMediaUrls);