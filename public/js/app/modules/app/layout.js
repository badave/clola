AppLayout = Backbone.Marionette.Layout.extend({
	regions: {
		places: "#places",
		messages: "#messages",
		customers: "#customers"
	},
	template_path: "app/layout"
});