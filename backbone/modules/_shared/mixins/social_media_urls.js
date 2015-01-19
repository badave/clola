SocialMediaUrls = {
  facebook: function() {
    var facebook = this.model.get("facebook");

    if(facebook) {
      if(facebook.indexOf("https://") < 0) {
        facebook = "https://www.facebook.com/" + facebook;
      }
    }

    return facebook;
  },

  facebook_user: function() {
    var facebook_user = this.model.get("facebook");

    if(facebook_user && facebook_user.indexOf("https://") >= 0) {
      facebook_user = facebook_user.replace("https://www.facebook.com/", "");

      if(facebook_user.indexOf("?") >= 0) {
        facebook_user = facebook_user.substr(0, facebook_user.indexOf("?"));
      }
    }

    return facebook_user;
  },

  facebook_image: function() {
    if(this.facebook_user()) {
      return "https://graph.facebook.com/" + this.facebook_user() + "/picture";
    }
  },

  twitter: function() {
    var twitter = this.model.get("twitter");

    if(twitter) {
      twitter = twitter.replace("@", "");

      if(twitter.indexOf("https://") < 0) {
        twitter = "https://www.twitter.com/" + twitter;
      }
    }

    return twitter;
  },

  linkedin: function() {
    var linkedin = this.model.get("linkedin");

    if(linkedin) {
      if(linkedin.indexOf("https://") < 0) {
        linkedin = "https://www.linkedin.com/in/" + linkedin;
      }
    }

    return linkedin;
  },

  yelp: function() {
    var yelp = this.model.get("yelp");

    if(yelp) {
      if(yelp.indexOf("https://") < 0) {
        yelp = "http://" + yelp + ".yelp.com/";
      }
    }

    return yelp;
  }
}