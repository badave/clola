AppLayout = Backbone.Marionette.Layout.extend({
	regions: {
		places: "#places",
		messages: "#messages"
	},
	template_path: "app/layout"
});