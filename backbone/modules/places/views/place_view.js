PlaceView = Backbone.Marionette.ItemView.extend({
	template_path: "places/templates/place",
	className: "small",
	events: {
		"click .edit": "onEdit",
		"tap .edit": "onEdit",
		"click .text-to": "onTextTo",
		"click .send-to": "onSendTo"
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
	},
	onSendTo: function() {
		if(App.current_customer) {
			App.current_customer.addPlace(this.model);
			App.current_customer.save();

			if(!!$("#reply-box")) {
				$("#reply-box").val(this.model.get("name") + " - " + this.model.get("address"));
			}
		}
	}
});