VendorSidebarView = Backbone.Marionette.ItemView.extend({
  template_path: "vendors/sidebar/templates/sidebar",
  constructor: function () {
    var that = this;

    // ------------------------------------------ Config

    that.events = {
      "click a": "navigate",
      "tap a": "navigate",
      "render": "onRender"
    };

    that.navigate = function(e) {
      // if (!//.test($(e.currentTarget).attr('href'))) {
      //   return;
      // }

      e.preventDefault();

      Backbone.history.navigate($(e.currentTarget).attr('href'), {trigger: true});

      that.$el.find(".link-nav-dashboard-active").removeClass('link-nav-dashboard-active');
      $(e.currentTarget).addClass('link-nav-dashboard-active');
    };
    // ------------------------------------------ Apply

    return Backbone.Marionette.ItemView.apply(that, arguments);
  },
  onRender: function() {
    var that = this;
    this.highlightLinks();

    Backbone.history.bind("all", function(route, router) {
      that.highlightLinks();
    });
  },
  highlightLinks: function() {
    this.$el.find(".link-nav-dashboard-active").removeClass('link-nav-dashboard-active');
    // Nav link highlighting
    this.$el.find(".link-nav-dashboard").each(function() {
      if (!/dashboard/.test($(this).attr('href'))) {
        return;
      }
      var pathname = window.location.pathname.replace('/dashboard','');
      var href = $(this).attr('href').replace('/dashboard','');

      var h = href.match(/(?:\/)(\w+[^\/])/) ? href.match(/(?:\/)(\w+[^\/])/)[1] : null;
      var p = pathname.match(/(?:\/)(\w+[^\/])/) ? pathname.match(/(?:\/)(\w+[^\/])/)[1] : null;

      if (h === p) {
        $(this).addClass('link-nav-dashboard-active');
      }
    });
  }
});

