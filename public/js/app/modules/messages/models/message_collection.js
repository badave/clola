MessageCollection = BaseCollection.extend({
	resource: "messages",
	newMessages: function() {
		return this.where({"status": "new"});
	}
});