AppLayout = Backbone.Marionette.Layout.extend({
	regions: {
    header: "#header",
		places: "#places",
		messages: "#messages",
		customers: "#customers"
	},
  regionViews: {
    header: HeaderView
  },
	template_path: "app/templates/layout"
});