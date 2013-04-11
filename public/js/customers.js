$(function() {
	if($.cookie('last_phone_lookup')) {
		$("#phone").val($.cookie('last_phone_lookup'));
	}

	var updateButton = function(id, now, later, done) {
		$("#" + id).val(now);

		setTimeout(function() {
			$("#" + id).val(later);
		}, 1000);

		setTimeout(function() {
			$("#" + id).val(done);
		}, 3000)
	}

	$("#lookup").submit(function(e) {
		e.preventDefault();
		e.stopPropagation();


		var phone = $("#phone").val().replace(/\D/g, '');
		$.cookie("last_phone_lookup", phone);

		updateButton("lookup", "Looking up...", "Found", "Lookup");
		
		if($("#" + phone).length === 0) {
			customer = new Customer({
				"phone": phone
			})

			customer.fetch({
				success: function(data) {
					$("#lookup").val("Found");
					customer = data;

					if(!customer.id) {
						customer.save();
					}

					var cv = new CustomerView({model: customer});
					cv.render();
				}, 
				error: function(data) {
					console.log("Error with", data);
					console.log("Please render an error");
				}
			});
		} else {
			$("body").animate({scrollTop: $("#" + phone).offset().top });
		}
	})

	var Customer = Backbone.Model.extend({ 
		idAttribute: "_id",
		url: function() {
			return this.urlRoot + "/" + this.get("phone");
		},
		urlRoot: "/v1/customers",
		buildObject: function(arr) {
			var obj = {}
			// for example, pass in ["name"], it add 
			// "name": $("#" + this.id + " .name").val() 
			// to the object
			var self = this;
			$(arr).each(function(idx, el) {
				var value = $("#" + self.id + " ." + el).val();
				if(value !== "") {
					obj[el] = value;
				}
			})
			return obj;
		},
		updateValues: function(callback) {
			this.save(this.buildObject(["name", "email", "gender", "age"]), { 
				success: callback 
			});
		},
		addLocation: function(callback) {
			var previous_locations = this.get("previous_locations") || [];
			var location = this.buildObject(["location_name", "street", "city", "state", "zip", "long", "lat", "notes"]);
			location.updated = new Date().getTime();
			location.updated_date = new Date();
			previous_locations.unshift(location);
			this.set("previous_locations", previous_locations);
			this.save({}, {
				success: callback
			});
		}
	})

	var CustomerView = Backbone.View.extend({
		el: '.customers',
		events: {
			"click .update": "saveInfo",
			"click .add-location": "addLocation"
		},
		template: _.template($("#customer").html()),
		render: function() {
			this.$el.append(this.template({ data: this.model.toJSON() }));
		},
		saveInfo: function(e) {
			e.stopPropagation();
			e.preventDefault();
			var self = this;

			$("#" + this.model.id + " .update").val("Updating...");
			this.model.updateValues(function() {
				$("#" + self.model.id + " .update").val("Updated");
				setTimeout(function() {
					$("#" + self.model.id + " .update").val("Update");
				}, 3000)
			});

			return false;
		},
		addLocation: function(e) {
			e.stopPropagation();
			e.preventDefault();

			var self = this;
			$("#" + this.model.id + " .add-location").val("Updating...");

			this.model.addLocation(function() {
				$(".location-form input").each(function(idx, el) {
					$(el).val("");
				})
				$("#" + self.model.id + " .add-location").val("Updated");

				var location_template = _.template($("#location-template").html());

				$("#" + self.model.id + " .previous-locations").prepend(location_template({ location: self.model.get("previous_locations")[0] }));

				setTimeout(function() {
					$("#" + self.model.id + " .add-location").val("Add Location");
				}, 3000)
			});
			return false;
		}
	})
})