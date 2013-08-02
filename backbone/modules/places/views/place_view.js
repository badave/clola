PlaceView = Backbone.Marionette.ItemView.extend({
	template_path: "places/templates/place",
	className: "small",
	events: {
		"click .edit": "onEdit",
		"tap .edit": "onEdit",
		"click .text-to": "onTextTo"
	},
	context: function(modelJson){
		modelJson.tags = modelJson.tags ? modelJson.tags.split(","): [];
		return {
			model: modelJson
		}
	},
	onEdit: function() {
		App.vent.trigger("place:edit", this.model);
	},
	onTextTo: function() {
		if(!!$("#reply-box")) {
			$("#reply-box").val(this.model.get("text_message"));
		}
	}
});