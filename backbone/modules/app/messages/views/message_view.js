MessageView = Backbone.Marionette.ItemView.extend({
	template_path: "app/messages/templates/message",
	className: "message-view",
	
	events: {
	  "keyup #reply-box": "replyingToMessage",
	  "focusout #reply-box": "doneReplying",
		"submit form": "sendReply"
	},
	
	onRender: function() {
		var that = this;
		setTimeout(function() {
			that.scrollToBottom();
		}, 10);
		this.bindEvents();
	},
	
	scrollToBottom: function() {
	  this.$el.find(".messages-inner-container")[0].scrollTop = this.$el.find(".messages-inner-container")[0].scrollHeight;
	},
	doneReplying: function(e) {
	  e.preventDefault();
	  
	  App.socket.emit("replying", {"phone": this.model.get("phone"), "message": {
      "text": this.$el.find("#reply-box").val(),
      "replying": false,
      "created": new Date().getTime()
    }});
	},
	
	replyingToMessage: function(e) {
	  e.preventDefault();
	  
	  App.socket.emit("replying", {"phone": this.model.get("phone"), "message": {
	    "text": this.$el.find("#reply-box").val(),
	    "replying": true,
	    "created": new Date().getTime()
	  }});
	},
	
	sendReply: function(e) {
		e.preventDefault();

		App.socket.emit("reply", { "phone": this.model.get("phone"), "message": {
			"text": this.$el.find("#reply-box").val(), 
			"reply": true, 
			"created": new Date().getTime()
		}});
		
		App.vent.trigger("message:replied", this.model);

		$(e.target).find("input").val("");
	},
	
	bindEvents: function() {
		var that = this;
		App.vent.on("change:message", function(model) {
			that.render();
		});
		
		App.vent.on("replyingToMessage", function(model) {
      if(model.get("replying")) {
        that.$el.find(".is-replying").html("Being replied to...");
      } else if(model.get("replying_text")) {
        that.$el.find(".is-replying").html("Text has been entered...");
      } else {
        that.$el.find(".is-replying").html("");
      }
      
      that.scrollToBottom();
    });
	}
});