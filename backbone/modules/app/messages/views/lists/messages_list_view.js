MessageRowView = ListRowView.extend({
	render: function() {
	  var phoneModel = this.collection.findByPhone(this.elem);
	  
	  if(phoneModel.attributes.status == "new") {
	    this.$el.html(this.elem).append('<i class="icon-circle fr"></i>');
	    
	    // start timer
	    phoneModel.startTimer(this.$el);
	  } else {
  		this.$el.html(this.elem).append('<i class="icon-chevron-sign-right fr"></i>');
  		
  		if(phoneModel.timer) {
    		// stop timer
    		phoneModel.stopTimer();
    		
    		// clear the background
    		this.$el.attr('class', '');
  		}
	  }
	  
	  if(this.onRender) this.onRender();
		return this;
	},
	renderNewMessage: function(model) {
	  if(this.elem == model.attributes.phone && model.attributes.status == "new") {
	    this.$el.html(this.elem).append('<i class="icon-circle fr"></i>');
	    
	    // start timer
	    phoneModel.startTimer(this.$el);
	  }
	},
	renderRepliedMessage: function(model) {
    if(this.elem == model.attributes.phone) {
      this.$el.html(this.elem).append('<i class="icon-chevron-sign-right fr"></i>');
      
      if(phoneModel.timer) {
        // stop timer
        phoneModel.stopTimer();
        
        // clear the background
        this.$el.attr('class', '');
      }
    }
  },
	onRender: function() {
	  var that = this;
	  App.vent.on('change:message', function(model) {
	    that.renderNewMessage(model);
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