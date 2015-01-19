Message = BaseModel.extend({
  timer: {},
	resource: "messages",
	url: function() {
    if(this.get("phone")) {
      return this.urlRoot() + "/" + this.get("phone");
    }
    return this.urlRoot();
  },
  
  startTimer: function(elem) {
    this.timer = TimersJS.repeater(1000, function(delta) {
      console.log("This is output every 250ms, time since last execution: " + delta + "ms");
      switch(delta) {
        case (delta > 3000 && delta < 6000):
        elem.addClass("delta_gt_3_lt_6");
        break;
        case (delta > 6000 && delta < 9000):
        elem.addClass("delta_gt_6_lt_9");
        break;
        case (delta > 9000):
        elem.addClass("delta_gt_9");
        break;
      }
    });
  },
  
  stopTimer: function() {
    this.timer = TimersJS.killAllTimers();
  }
});