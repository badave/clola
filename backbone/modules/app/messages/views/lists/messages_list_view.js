var timers = {};

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
  
  getTimerColor: function(phoneModelMessages) {
    var date = new Date();
    var time = date.getTime();
    var msgsLength = phoneModelMessages.length;
    
    var delta = (time-phoneModelMessages[msgsLength-1].messages[0].created)/1000/60;
      
    // console.log(delta+" mins");
    
    if(delta > 3 && delta < 4) {
      this.$el.addClass("delay_gt_3_lt_4");
    } else if (delta > 4 && delta < 6) {
      this.$el.addClass("delay_gt_4_lt_6");
    } else if (delta > 6){
      this.$el.addClass("delay_gt_6");
      timers[this.elem].stopp();
    }
  },
  
	render: function() {
	  var that = this;
	  
    that.$el.html('<span class="phone-number">' + that.elem + '</span>' + '<span class="cancel-icon"><i class="icon-remove-sign fr"></i></span>');
    
    var phoneModel = that.collection.findByPhone(that.elem);
 
    if(that.elem == phoneModel.attributes.phone && phoneModel.attributes.status == "new") {
      // start timer
      var timer = new Timer( {'interval':1000} );
      timers[that.elem] = timer;
      
      timer.start( function() {
        that.getTimerColor(phoneModel.attributes.messages);
      } );
      
    } else if (phoneModel.attributes.status == "replied") {
      if (timers[that.elem]) timers[that.elem].stopp(); 
    }

	  if(this.onRender) this.onRender();
		return this;
	},
	renderNewMessage: function(model, timerIntervalClass) {
	  if(this.elem == model.attributes.phone && model.attributes.status == "new") {
	    this.$el.html('<span class="phone-number">' + this.elem + '</span>' + '<span class="cancel-icon"><i class="icon-remove-sign fr"></i></span>')
	             .addClass(timerIntervalClass);
	  }
	},
	renderRepliedMessage: function(model, timerIntervalClass) {
    if(this.elem == model.attributes.phone) {
      this.$el.html('<span class="phone-number">' + this.elem + '</span>' + '<span class="cancel-icon"><i class="icon-remove-sign fr"></i></span>')
                .addClass(timerIntervalClass);
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