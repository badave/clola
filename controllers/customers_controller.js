var ObjectID = require('mongodb').ObjectID,
  bcrypt = require('bcrypt'),
  crypto = require('crypto'),
  hbs = require("hbs");

 var _ = require("underscore");

var db = require("../lib/db");
var helper = require('../lib/helper');
var config = require("../config");

var genericModel = require("../lib/generic_model");

var customersController = module.exports = {};

customersController.find = function(req, res, next) {
	if(!req.user) {
	  return res.redirect("/go");
	}

	// get locations for user
	genericModel.findWithQuery("locations", { "user_id": req.user._id }, function(err, locations) {

		var place_ids = []; 

		_.each(locations, function(location) {
			if(location.place_id) {
				place_ids.push(location.place_id.toString());
			}
		});

		if(!place_ids.length) {
			helper.respondJson(req, res, 200, []);
		} else {
			genericModel.findWithQuery("customers", { "previous_places._id": { "$in": place_ids }}, function(err, data) {
				if(err) {
					console.error(err);
					helper.respondJsonError(req, res, 500, err);
					return;
				}

				_.each(data, function(customer) {
					// this is internal
					delete customer.previous_locations;

					var places = _.filter(customer.previous_places, function(place) {
						return _.contains(place_ids, place._id.toString());
					});

					customer.previous_places = places;
				});


				helper.respondJson(req, res, 200, data);
			});
		}
	});
};

// API calls can be split to another server later if need be
customersController.findByNumber = function(req, res, next) {
	if(!req.user) {
	  return res.redirect("/go");
	}
	
	var phone = req.params.phone.replace(/\D/g, '').toString();

	db.findOne("customers", {"phone": phone}, function(err, customer) {
		if(err) {
			console.error(err);
			return helper.respondJsonError(req, res, 500);
		}

		if(!customer) {
			return helper.respondJson(req, res, 200, {});
		}

		return helper.respondJson(req, res, 200, customer);
	});
};

customersController.create = function(req, res, next) {
	if(!req.user) {
	  return res.redirect("/go");
	}
	
	var customer = req.body;

	if(!customer.phone) {
		return helper.respondJsonError(req, res, 500);
	}


	// standardizes phone #s
	if(customer.phone) customer.phone = customer.phone.replace(/\D/g, '').toString();
	customer.created = new Date().getTime();
	customer.created_date = new Date();


	db.insert("customers", customer, function(err, customer) {
		if(err) {
			return helper.respondJsonError(req, res, 500);
		}

		if(!customer) {
			return helper.respondJson(req, res, 200, {});
		}

		return helper.respondJson(req, res, 200, customer);
	})
}

customersController.update = function(req, res, next) {
	if(!req.user) {
	  return res.redirect("/go");
	}
	
	var customer = req.body;

	if(!customer.phone) {
		return helper.respondJsonError(req, res, 500);
	}

	// Standardizes phone numbers...
	if(customer.phone) {
		customer.phone = customer.phone.replace(/\D/g, '').toString();
	}

	customer.updated = new Date().getTime();
	customer.updated_date = new Date();

	delete customer._id;


	db.update("customers", {phone: customer.phone}, { "$set": customer }, {}, function(err, data) {
		if(err) {
			console.error(err);
			return helper.respondJsonError(req, res, 500);
		}

		return helper.respondJson(req, res, 200, customer);
	})

}