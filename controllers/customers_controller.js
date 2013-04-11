var ObjectID = require('mongodb').ObjectID,
  bcrypt = require('bcrypt'),
  crypto = require('crypto'),
  hbs = require("hbs");

var db = require("../lib/db");
var helper = require('../lib/helper');
var config = require("../config");

var customersController = module.exports = {};

customersController.index = function(req, res, next) {
  var context = {
    title: config.title
  }
  return helper.render(req, res, 200, 'customers/index', context);
}

// API calls can be split to another server later if need be
customersController.findByNumber = function(req, res, next) {
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
	})
}

customersController.create = function(req, res, next) {
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