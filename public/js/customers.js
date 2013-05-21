$(function() {
	// TODO Split up into multiple files, refactor out some of the hacky stuff
	// 			Use routes


	/*
		Customer lookup (/customer)
	 */


	 if($.cookie('last_phone_lookup')) {
	 	$("#phone").val($.cookie('last_phone_lookup'));
	 }
	$(document).on("submit", "#lookup", function(e) {
		e.preventDefault();
		e.stopPropagation();


		var phone = $("#phone").val().replace(/\D/g, '');
		$.cookie("last_phone_lookup", phone);

		$("#lookup-btn").val("Looking up...").attr("disabled", "disabled");
		
		if($("#" + phone).length === 0) {
			customer = new Customer({
				"phone": phone
			})

			customer.fetch({
				success: function(data) {
					$("#lookup-btn").val("Found").removeAttr("disabled");

					setTimeout(function() {
						$("#lookup-btn").val("Go");
					}, 3000)

					customer = data;

					if(!customer.id) {
						customer.save();
					}

					customer.cv = new CustomerView({model: customer});
					customer.cv.render();
				}, 
				error: function(data) {
					$("#lookup-btn").val("Retry").removeAttr("disabled");
					console.log("Error with", data);
					console.log("Please render an error");
				}
			});
		} else {
			$("body").animate({scrollTop: $("#" + phone).offset().top });
		}
	})



	/*
			Customer Model for Backbone
	 */
	Customer = Backbone.Model.extend({ 
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




	/*
			CustomerView for Backbone
	 */
	CustomerView = Backbone.View.extend({
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

			this.placesView.renderFinder();
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


	/*
		Adding location does this
	 */


	$(document).on("click", "#add_location_btn", function(e) {
		var placeObj = {
			"city": $("#place-city").val(),
			"area": $("#place-area").val(),
			"category": $("#place-category").val(),
			"subcategory": $("#place-subcategory").val(),
			"name": $("#place-name").val(),
			"description": $("#place-description").val(),
			"address": $("#place-address").val(),
			"contact": $("#place-contact").val(),
			"hours": $("#place-hours").val()
		};

		for(var key in placeObj) {
			placeObj[key] = placeObj[key].trim();
		}

		var place = new Place(placeObj);

		place.save();
		all_places.add(place);


		_.each($("#places-modal input"), function(el) {
			$(el).val("");
		});

		$("#places-modal").modal('hide');
	})

	/*
		Place Model
	 */

	Place = Backbone.Model.extend({
		idAttribute: "_id",
		urlRoot: "/v1/places"
	})

	/*
		Places Collection
	 */

	Places = Backbone.Collection.extend({
		model: Place,
		getPlaces: function(cities) {
			return _.filter(this.models, function(place) { return _.contains(cities, place.get("city")); });
		},

		getAreas: function(places) {
			return _.map(places, function(place) { return place.get("area"); })
		},

		getCategories: function(places) {
			return _.map(places, function(place) { return place.get("category"); });
		},

		getSubcategories: function(places) {
			return _.map(places, function(place) { return place.get("subcategory"); });
		},
		url: function() {
			return "/v1/places";
		},
		cities: function() {
			return _.uniq(_.map(this.models, function(place) {
				return place.get("city");
			}));
		}
	})

	/*
		Places View
	 */

	PlacesView = Backbone.View.extend({
		initialize: function() {
			var self = this;
			this.collection.on("add", function(e) {
				self.findAreas(e);
			})
		},
		events: {
			'change [name="city"]': "findAreas",
			'change [name="area"]': "findCategories",
			'change [name="category"]': "findSubcategories",
			'change [name="subcategory"]': "find",
			"click .send-btn": "addLocation"
		},
		find_template: _.template($("#find-place-template").html()),
		template: _.template($("#place-template").html()),
		find_area_template: _.template('<% _.each(areas, function(area, idx) { %> \
						<input id="find-area-<%= idx %>" name="area" type="checkbox" value="<%= area %>" class="toggle"></input> \
								<label for="find-area-<%= idx %>" class="btn btn-large"><%= area %></label> \
						<% }) %>'),
		find_category_template: _.template('<% _.each(categories, function(category, idx) { %> \
						<input id="find-category-<%= idx %>" name="category" type="checkbox" value="<%= category %>" class="toggle"></input> \
								<label for="find-category-<%= idx %>" class="btn btn-large"><%= category %></label> \
						<% }) %>'),
		find_subcategory_template: _.template('<% _.each(subcategories, function(subcategory, idx) { %> \
						<input id="find-subcategory-<%= idx %>" name="subcategory" type="checkbox" value="<%= subcategory %>" class="toggle"></input> \
								<label for="find-subcategory-<%= idx %>" class="btn btn-large"><%= subcategory %></label> \
						<% }) %>'),

		addLocation: function(e) {
			if(this.options.customer) {
				var place = this.collection.findWhere({ _id: $(e.target).attr('data-id')});

				var location = {
					name: place.get("name"),
					address: place.get('address'),
					notes: place.get('description')
				};
				this.options.customer.addLocation(location);
				var tmpl = _.template($("#location-template").html());
				$("#" + this.options.customer.id + " .previous-locations").prepend(tmpl({ "location": location }));
			}
		},

		getSelectedAreas: function() {
			return _.map(this.$el.find(".places-areas input:checked"), function(selected) { return $(selected).val(); });
		},

		getSelectedCities: function() {
			return _.map(this.$el.find(".places-cities input:checked"), function(selected) { return $(selected).val(); });
		},

		getSelectedCategories: function() {
			return _.map(this.$el.find(".places-categories input:checked"), function(selected) { return $(selected).val(); });
		},

		getSelectedSubcategories: function() {
			return _.map(this.$el.find(".places-subcategories input:checked"), function(selected) { return $(selected).val(); });
		},

		findAreas: function(e) {
			var cities = this.getSelectedCities();
			var places = this.collection.getPlaces(cities);
			var areas = this.collection.getAreas(places);

			unique_areas = _.uniq(areas);

			// var area is really a place in the area
			var tmpl = this.find_area_template({"areas": unique_areas});

			this.$el.find(".places-areas").html(tmpl);

			this.$el.find(".places-categories").html("");
			this.$el.find(".places-subcategories").html("");

			$(".places").html("");
			// this.renderPlaces(places);
			this.delegateEvents();
		},

		findCategories: function(e) {
			var cities = this.getSelectedCities();
			var areas = this.getSelectedAreas();
			var places = _.filter(this.collection.getPlaces(cities), function(place) {
				return _.contains(areas, place.get("area"));
			})

			if(areas.length > 0) {
				var cat_array = this.collection.getCategories(places);
				var unique_categories = _.uniq(cat_array);
			  
			  var tmpl = this.find_category_template({"categories": unique_categories});

			  this.$el.find(".places-categories").html(tmpl);

			  this.$el.find(".places-subcategories").html("");
			  $(".places").html("");

				this.delegateEvents();
			} else {
				this.$el.find(".places-categories").html("");
				this.$el.find(".places-subcategories").html("");
				$(".places").html("");
			}
		},

		findSubcategories: function(e) {
			var cities = this.getSelectedCities();
			var areas = this.getSelectedAreas();
			var categories = this.getSelectedCategories();

			var places = _.filter(this.collection.getPlaces(cities), function(place) {
				return _.contains(areas, place.get("area"))
					&& _.contains(categories, place.get("category"));
			})

			if(categories.length > 0) {
				var subcategories = this.collection.getSubcategories(places);
				var unique_subcategories = _.uniq(subcategories);
				var tmpl = this.find_subcategory_template({"subcategories": unique_subcategories});

				this.$el.find(".places-subcategories").html(tmpl);
				this.delegateEvents();
			} else {
				this.$el.find(".places-subcategories").html("");
				$(".places").html("");
			}

		},

		find: function(e) {
			var cities = this.getSelectedCities();
			var areas = this.getSelectedAreas();
			var categories = this.getSelectedCategories();
			var subcategories = this.getSelectedSubcategories();

			if(subcategories.length > 0) {
				var places = _.filter(this.collection.getPlaces(cities), function(place) {
					return _.contains(areas, place.get('area')) && _.contains(categories, place.get("category"))
						&& _.contains(subcategories, place.get("subcategory"));
				})

				if(places.length > 0) {
					this.renderPlaces(places);
				}
			} else {
				$(".places").html("");
			}
		},

		renderPlaces: function(places) {
			var self = this;
			var html = "";
			var customer;
			if(this.options.customer) {
				customer = this.options.customer.toJSON();
			}
			_.each(places, function(place) {
				html += self.template({"place": place.toJSON(), "customer": customer });
			})
			$(".places").html(html);
		},

		renderFinder: function() {
			var cities = this.collection.cities();

			var tmpl = this.find_template({"cities": cities})			
			$(".find-places").html(tmpl);

			this.$el = $(".find-places .find-place");
			this.delegateEvents();
		},

	})

	// initialize places
	all_places = new Places();
	all_places.fetch({
		success: function(places) {
			if(typeof afterPlacesLoaded === "function") {
				afterPlacesLoaded(places);
			}
		}
	});



	/*
		SMS Messages
	 */
	// messages page
	if($(".messages-container").length > 0) {
		var socket = io.connect('http://clola.herokuapp.com:80/'); // + window.location.host);

		socket.on("msg", function(data) {
			messages.add(data);
		})

		socket.on("replying", function(data) {
			$("#" + data.phone + ".message-group").addClass("replying");
			$("#" + data.phone + " .reply").val(data.reply);
		})

		Message = Backbone.Model.extend({
			idAttribute: "_id",
			urlRoot: "/v1/messages"
		})

		Messages = Backbone.Collection.extend({
			model: Message,
			url: function() {
				return "/v1/messages";
			}
		})

		MessageView = Backbone.View.extend({
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
					this.$el.closest(".msg-container").removeClass("offset6").show();
				}
				if(status === "replied") {
					this.$el.closest(".msg-container").addClass("offset6").show();
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