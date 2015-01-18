$(function() {
	jQuery.fn.buttonHelper = function(loading_text, success_text, failed_text) {
		var buttonHelper = new ButtonHelper($(this), loading_text, success_text, failed_text);
		return buttonHelper;
	}


	// Helper takes a el, changes text for each state
	ButtonHelper = function(el, loading_text, success_text, failed_text) {
		this.el = el;
		this.waiting_text = $(el).text() || $(el).val() || "Submit";
		this.loading_text = loading_text || $(el).attr("data-loading-text") || "Sending...";
		this.success_text = success_text || $(el).attr("data-success-text") || "Success!";
		this.failed_text = failed_text ||  $(el).attr("data-failed-text") || "Failed";
	};

	ButtonHelper.prototype.loading = function() {
		$(this.el).text(this.loading_text).attr("disabled", "disabled");
	};

	ButtonHelper.prototype.waiting = function() {
		$(this.el).text(this.waiting_text).removeAttr("disabled");
	};

	ButtonHelper.prototype.success = function() {
		var that = this;
		$(this.el).text(this.success_text);
		setTimeout(function() {
			that.waiting();
		}, 2000);
	};

	ButtonHelper.prototype.failed = function() {
		var that = this;
		$(this.el).text(this.failed_text);
		setTimeout(function() {
			that.waiting();
		}, 2000);
	};

	ButtonHelper.prototype.enabled = function() {
		return !$(this.el).attr('disabled');
	};

	ButtonHelper.prototype.disabled = function() {
		return !this.enabled();
	};

	ButtonHelper.prototype.enable = function() {
		$(this.el).removeAttr("disabled");
	};
})
