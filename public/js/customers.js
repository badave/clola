$(function() {
	// var socket = io.connect("http://localhost:5050");
	var socket = io.connect('http://clola.herokuapp.com:80/'); // + window.location.host);

	socket.on("msg", function(data) {
		messages.add(data);
	})

	socket.on("replying", function(data) {
		$("#" + data.phone + ".message-group").addClass("replying");
		$("#" + data.phone + " .reply").val(data.reply);
	})

	if($.cookie('last_phone_lookup')) {
		$("#phone").val($.cookie('last_phone_lookup'));
	}

	// $("#places-modal").modal();

	var updateButton = function(id, now, later, done) {
		$("#" + id).val(now);

		setTimeout(function() {
			$("#" + id).val(later);
		}, 1000);

		setTimeout(function() {
			$("#" + id).val(done);
		}, 3000)
	}

	$(document).on("submit", "#lookup", function(e) {
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

					customer.cv = new CustomerView({model: customer});
					customer.cv.render();
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
		addLocation: function(location, callback) {
			var previous_locations = this.get("previous_locations") || [];
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

			// Load places
			this.placesView = new PlacesView({
				el: "#" + this.model.id + " .find-place",
				"collection": all_places,
				"customer": this.model
			});
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

			// var location = this.model.buildObject(["name", "street", "city", "state", "zip", "long", "lat", "notes"]);
			var locationForm = $("#location-form").serializeArray();
			var location = {};
			_.each(locationForm, function(obj) {
				location[obj.name] = obj.value;
			})

			this.model.addLocation(location, function() {
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
	});


	$(document).on("click", "#add_location_btn", function(e) {
		var place = new Place({
			"city": $("#place-city").val(),
			"area": $("#place-area").val(),
			"category": $("#place-category").val(),
			"name": $("#place-name").val(),
			"description": $("#place-description").val(),
			"address": $("#place-address").val()
		})

		place.save();
		all_places.add(place);


		_.each($("#places-modal input"), function(el) {
			$(el).val("");
		});

		$("#places-modal").modal('hide');
	})

	var Place = Backbone.Model.extend({
		idAttribute: "_id",
		urlRoot: "/v1/places"
	})

	var Places = Backbone.Collection.extend({
		model: Place,
		url: function() {
			return "/v1/places";
		}
	})

	var PlacesView = Backbone.View.extend({
		initialize: function() {
			var self = this;
			this.collection.on("add", function(e) {
				self.findAreas(e);
			})
		},
		el: ".find-place",
		events: {
			"change .find-place-city": "findAreas",
			"change .find-place-area": "findCategories",
			"change .find-place-category": "find",
			"click .send-btn": "addLocation"
		},
		template: _.template($("#place-template").html()),

		addLocation: function(e) {
			var place = this.collection.findWhere({ _id: $(e.target).attr('data-id')});

			var location = {
				name: place.get("name"),
				address: place.get('address'),
				notes: place.get('description')
			};
			this.options.customer.addLocation(location);
			var tmpl = _.template($("#location-template").html());
			$("#" + this.options.customer.id + " .previous-locations").prepend(tmpl({ "location": location }));
		},

		findAreas: function(e) {
			var city = this.$el.find(".find-place-city").val();
			var places = _.filter(this.collection.models, function(place) { return place.get("city") === city });
			var areas = _.map(places, function(place) { return place.get("area"); })

			unique_areas = _.uniq(areas);

			var options = ['<option value="" selected="selected">Area</option>'];
			// var area is really a place in the area
			_.each(unique_areas, function(area) {
				var tmpl = _.template('<option value="<%= area %>"><%= area %></option>');
				options.push(tmpl({area: area }))
			})

			this.$el.find(".find-place-area").html(options.join(""));

			// show all categories of these places too
			// retreives just the area
			
			var categories = _.filter(places, function(place) { return _.contains(unique_areas, place.get("area")); })
			categories = _.map(categories, function(place) { return place.get("category"); })
			var unique_categories = _.uniq(categories)

		  var options = ['<option value="" selected="selected">Category</option>'];
			_.each(unique_categories, function(category) {
				var tmpl = _.template('<option value="<%= category %>"><%= category %></option>');
				options.push(tmpl({"category": category }))
			})
			
			this.$el.find(".find-place-category").html(options.join(""));

			this.renderPlaces(places);
		},

		findCategories: function(e) {
			var city = this.$el.find(".find-place-city").val();
			var area = this.$el.find(".find-place-area").val();
			var places = _.filter(this.collection.models, function(place) { return place.get("city") === city && area === place.get("area"); });
			
			var cat_array = _.map(places, function(place) { return place.get("category"); })
			var unique_categories = _.uniq(cat_array)

		  var options = ['<option value="" selected="selected">Category</option>'];
			_.each(unique_categories, function(category) {
				var tmpl = _.template('<option value="<%= category %>"><%= category %></option>');
				options.push(tmpl({"category": category }))
			})
			
			this.$el.find(".find-place-category").html(options.join(""));
			this.renderPlaces(places);;
		},

		find: function(e) {
			var city = this.$el.find(".find-place-city").val();
			var area = this.$el.find(".find-place-area").val();
			var category = this.$el.find(".find-place-category").val();
			var places = _.filter(this.collection.models, function(place) { return place.get("city") === city && area === place.get("area") && category === place.get("category"); });
			

			this.renderPlaces(places);
		},

		renderPlaces: function(places) {
			var self = this;
			var html = "";
			_.each(places, function(place) {
				html += self.template({"place": place.toJSON() });
			})
			$(".places").html(html);
		}

	})

	// initialize places
	var all_places = new Places();
	all_places.fetch();

	if($("#message").length > 0) {
		var Message = Backbone.Model.extend({
			idAttribute: "_id",
			urlRoot: "/v1/messages"
		})

		var Messages = Backbone.Collection.extend({
			model: Message,
			url: function() {
				return "/v1/messages";
			}
		})

		var MessageView = Backbone.View.extend({
			messages_template: _.template($("#messages").html()),
			message_template: _.template($("#message").html()),
			events: {
				"keyup .reply": "replying",
				"click .send-reply": "sendReply",
				"click .show-reply": "showReply",
				"click .hide-msgs": "hide"
			},
			hide: function(e) {
				socket.emit("hide", {"phone": this.model.get("phone") });
			},
			replying: function(e) {
				var reply = this.$el.find(".message-group").addClass("replying").find(".reply");
				socket.emit("replying", { "phone": $(e.target).attr("data-phone"), "reply": $(reply).val() })
			},
			sendReply: function(e) {
				var reply = this.$el.find(".reply");
				if($(reply).val() !== "") {
					this.$el.find(".message-group").removeClass("replying");
					socket.emit("reply", { "phone": $(reply).attr('data-phone'), "message": {
						"text": $(reply).val(), "reply": true, "created": new Date().getTime()
					}})
				}
			},
			showReply: function(e) {
				this.$el.find(".reply-group").show();
				$(e.target).hide();
			},
			render: function() {
				var phone = this.model.get("phone");
				var template = this.messages_template;
				var html = template({ "data": this.model.toJSON() });
				$(".messages-container").append(html);
				this.el = "#" + phone;
				this.$el = $("#" + phone);
				this.delegateEvents();
				this.updateOffsets(this.model.get("status"));
			},
			add: function(msg) {
				var messages = this.model.get("messages");
				// updates the current model -- though I'm not sure this is needed
				messages.push(msg.get("messages"));
				this.model.set("messages", messages);
				this.model.set('status', msg.get(status));

				var self = this;
				var phone = this.model.get("phone");
				_.each(msg.get("messages"), function(message) {
					self.$el.find(".msgs").append(self.message_template({ "message": message }));
				})

				this.$el.find(".status").text(msg.get("status"));
				this.updateOffsets(msg.get("status"));
			},
			updateOffsets: function(status) {
				if(status === "new") {
					this.$el.closest(".msg-container").removeClass("offset6").addClass("offset2").show();
				}
				if(status === "replied") {
					this.$el.closest(".msg-container").removeClass("offset2").addClass("offset6").show();
				}
				if(status === "hidden") {
					this.$el.closest(".msg-container").hide();
				}
			}
		})


		var messages = new Messages();

		messages.fetch();

		messages.on("add", function(message) {
			this.mv = this.mv || {};
			var phone = message.get("phone");
			if(this.mv[phone]) {
				this.mv[phone].add(message);
			} else {
				this.mv[phone] = new MessageView({model: message});
				this.mv[phone].render();
			}
		})
	}
})