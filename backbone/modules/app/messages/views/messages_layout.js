MessagesLayout = Backbone.Marionette.Layout.extend({
	template_path: "app/messages/templates/layout",
	regions: {
		"messages": "#messages-list",
		"message_views": "#message-views"
	},
	
	events: {
    "click .btn-create-room": "createRoom",
  },
  
  createRoom: function() {
    App.socket.emit("createRoom", App.user.email);
  },
	
	onRender: function() {
	  var that = this;
	  
	  App.vent.on('roomCreated', function(room) {
	    that.$el.find(".btn-create-room")[0].style.display = 'none';
	    
  	  // if connected to a room
  		that.renderMessages();
  
  		_.bindAll(that, "renderMessages", "selectMessages");
  		that.collection.on("change", that.renderMessages);
  		that.collection.on("add", that.renderMessages);
  
  		App.vent.on("message:selected", that.selectMessages);
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