CustomerLayout = Backbone.Marionette.Layout.extend({
	template_path: "app/customers/templates/layout",
	className: "customers-layout",
	regions: {
		"customers": ".customers",
		"sidepane": ".sidepane.right"
	},
	events: {
		"click .pane-overlay": "hideSidepane"
	},
	onRender: function() {
		App.current_customer = this.model;
		
		this.customers.show(new CustomerView({
			model: this.model
		}));

		this.sidepane.show(new CustomerEditView({
			model: this.model
		}));

		this.bindEvents();
	},
	bindEvents: function() {
		var that = this;
		_.bindAll(this, "editCustomer", "hideSidepane");
		App.vent.on("customer:edit",  that.editCustomer);
		App.vent.on("hide:sidepane-right", that.hideSidepane);

		this.model.on("change", this.render);
	},
	editCustomer: function(customer) {
		this.showSidepane();
	},
	showSidepane: function() {
		this.$el.find(".sidepane").addClass("expand");
		this.$el.find(".pane-overlay").show();
		var that = this;
		setTimeout(function() { that.$el.find(".sidepane form").fadeIn(); }, 300)
	},
	hideSidepane: function() {
		var that = this;
		this.$el.find(".sidepane form").fadeOut();
		this.$el.find(".pane-overlay").hide();
		setTimeout(function() { 
			that.$el.find(".sidepane").removeClass("expand"); 
		}, 300);
	},
});