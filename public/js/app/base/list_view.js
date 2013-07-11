ListView = Backbone.Marionette.Layout.extend({
	template: function() {
		return Handlebars.compile("");
	},
	onRender: function() {
		var that = this;

		this.list = [];

		_.each(this.array, function(item) {
			var listElem = new that.rowView({
				text: item
			});
			that.$el.append(listElem.render().$el);
			that.list.push(listElem);
		});

		// onRender can't really be over written, so give another event to follow
		this.trigger("after:render");
		if(this.afterRender) {
			this.afterRender();
		}
	},
	tagName: "ul"
});