ListView = Backbone.Marionette.Layout.extend({
	template: function() {
		return Handlebars.compile("");
	},
	onRender: function() {
		var that = this;

		this.list = [];

		this.$el.html("");

		_.each(this.array, function(elem) {
			var listElem = new that.rowView({
				elem: elem,
				collection: that.collection,
				model: that.model
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