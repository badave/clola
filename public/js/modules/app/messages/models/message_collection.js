MessageCollection = BaseCollection.extend({
	resource: "messages",
	newMessages: function() {
		return this.where({"status": "new"});
	},
	findByPhone: function(phone) {
		return this.findWhere({"phone": phone});
	}
});