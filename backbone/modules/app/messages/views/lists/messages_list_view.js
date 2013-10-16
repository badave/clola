MessageRowView = ListRowView.extend({
  events: {
    "click .cancel-icon": "removePhoneFromRoom",
    "click .phone-number": "select",
    "tap .phone-number": "select"
  },
  
  removePhoneFromRoom: function() {
    var phoneModel = this.collection.findByPhone(this.elem);
    App.socket.emit("leaveRoom", phoneModel.attributes.phone);
    
    // remove elem from the html list
    this.$el.remove();
  },
  
	render: function() {
    this.$el.html('<span class="phone-number">' + this.elem + '</span>' + '<span class="cancel-icon"><i class="icon-remove-sign fr"></i></span>');
	  
	  if(this.onRender) this.onRender();
		return this;
	},
	renderNewMessage: function(model, timerIntervalClass) {
	  if(this.elem == model.attributes.phone && model.attributes.status == "new") {
	    this.$el.html('<span class="phone-number">' + this.elem + '</span>' + '<span class="cancel-icon"><i class="icon-remove-sign fr"></i></span>');
	  }
	},
	renderRepliedMessage: function(model) {
    if(this.elem == model.attributes.phone) {
      this.$el.html('<span class="phone-number">' + this.elem + '</span>' + '<span class="cancel-icon"><i class="icon-remove-sign fr"></i></span>');
    }
  },
	onRender: function() {
	  var that = this;
	  App.vent.on('change:message', function(data) {
	    that.renderNewMessage(data.model, data.timerIntervalClass);
	  });
	  
	  App.vent.on('message:replied', function(model){
	    that.renderRepliedMessage(model);
	  });
	},
	onSelect: function() {
		App.vent.trigger("message:selected", this.elem);
	}
});

MessagesListView = ListView.extend({
	rowView: MessageRowView,
	className: "messages-list list-view"
});