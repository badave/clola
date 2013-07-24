CustomerLayout = Backbone.Marionette.Layout.extend({
	template_path: "customers/layout",
	className: "customers-layout",
	regions: {
		"customers": ".customers",
		"sidepane": ".sidepane.right"
	},
	onRender: function() {

		this.customers.show(new CustomerView({
			model: this.model
		}));

		this.bindEvents();
	},
	bindEvents: function() {
		var that = this;
		_.bindAll(this, "editCustomer");
		App.vent.on("customer:edit",  function(customer) {
			that.editCustomer(customer);
		});
	},
	editCustomer: function(customer) {
		var editView = new CustomerEditView({
			model: customer
		});

		this.sidepane.show(editView);
		this.showSidepane();
	},
	showSidepane: function() {
		this.$el.find(".sidepane").addClass("expand");
		this.$el.find(".pane-overlay").show();
		var that = this;
		setTimeout(function() { that.$el.find(".sidepane form").fadeIn(); }, 300)
	}
});