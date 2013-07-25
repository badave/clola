PlaceView = Backbone.Marionette.ItemView.extend({
	template_path: "places/templates/place",
	className: "small",
	events: {
		"click .edit": "onEdit",
		"tap .edit": "onEdit"
	},
	context: function(modelJson){
		modelJson.tags = modelJson.tags ? modelJson.tags.split(","): [];
		return {
			model: modelJson
		}
	},
	onEdit: function() {
		App.vent.trigger("place:edit", this.model);
	}
});