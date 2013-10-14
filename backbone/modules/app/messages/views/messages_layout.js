MessagesLayout = Backbone.Marionette.Layout.extend({
	template_path: "app/messages/templates/layout",
	regions: {
		"messages": "#messages-list",
		"message_views": "#message-views"
	},
	
	events: {
    "click .btn-create-room": "createRoom",
    "click .btn-remove-room": "removeRoom"
  },
  
  createRoom: function() {
    App.socket.emit("createRoom", App.user.email);
    // this.$el.find(".btn-create-room")[0].style.visibility = 'hidden';
    // this.$el.find(".btn-remove-room")[0].style.visibility = 'visible';
  },
  
  removeRoom: function() {
    App.socket.emit("removeRoom", App.user.email);
    this.$el.find(".btn-create-room")[0].style.visibility = 'visible';
    // this.$el.find(".btn-remove-room")[0].style.visibility = 'hidden';
  },
	
	onRender: function() {
	  var that = this;
	  // that.$el.find(".btn-remove-room")[0].style.visibility = 'hidden';
	  
	  // if connected to a room start getting messages
	  App.vent.on('roomCreated', function(room) {
	    that.$("#messages-list").show();
  		that.renderMessages();
  
  		_.bindAll(that, "renderMessages", "selectMessages");
  		that.collection.on("change", that.renderMessages);
  		that.collection.on("add", that.renderMessages);
  
  		App.vent.on("message:selected", that.selectMessages);
	  });
	  
	  App.vent.on('roomRemoved', function(room) {
      that.$("#messages-list").hide();
  
      that.unbindAll(that, "renderMessages", "selectMessages");
    });
	},
	
	renderMessages: function() {
		var messages = this.collection.models;

		var list = _.map(messages, function(message) {
			return message.get("phone");
		});

		// sync customer's with list

		this.messageListView = new MessagesListView({
			array: list,
			collection: this.collection
		});

		this.messages.show(this.messageListView);
	},

	selectMessages: function(phone) {
		var messages = this.collection.findByPhone(phone);

		// render this message view
		this.messageView = new MessageView({
			model: messages
		});

		this.message_views.show(this.messageView);
		
	}
});