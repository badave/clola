DashboardCustomerModal = Backbone.Modal.extend({
  template_path: "dashboard/customers/modals/templates/customer",
  constructor: function() {
    this.className += " customer-modal";

    return Backbone.Modal.apply(this, arguments); 
  },
  context: function(modelJson) {
    var visits = this.model.getVisits();

    return {
      model: modelJson,
      facebook: this.facebook(),
      facebook_user: this.facebook_user(),
      facebook_image: this.facebook_image(),
      twitter: this.twitter(),
      linkedin: this.linkedin(),
      yelp: this.yelp(),
      visits: visits
    };
  }
});


_.extend(DashboardCustomerModal.prototype, SocialMediaUrls);