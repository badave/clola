DashboardCustomersView = Backbone.Marionette.ItemView.extend({
  template_path: "dashboard/customers/templates/row",
  className: 'tile big-block',
  context: function(modelJson) {
    var facebook = modelJson.facebook;

    return {
      model: modelJson,
      facebook: this.facebook(),
      facebook_user: this.facebook_user(),
      facebook_image: this.facebook_image(),
      twitter: this.twitter(),
      linkedin: this.linkedin(),
      yelp: this.yelp()
    };
  }
});

_.extend(DashboardCustomersView.prototype, SocialMediaUrls);