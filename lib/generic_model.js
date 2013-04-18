var ObjectID = require('mongodb').ObjectID,
  bcrypt = require('bcrypt'),
  crypto = require('crypto'),
  hbs = require("hbs");

var db = require("../lib/db");
var helper = require('../lib/helper');
var config = require("../config");

var genericModel = module.exports = {};

genericModel.find = function(collection, callback) {
	db.find(collection, {}, {}, function(err, object) {
		if(err) {
			return callback(err);
		}

		callback(null, object);
	})
}

genericModel.jsonResponder = function(req, res) {
	return function(err, object) {
		if(err) {
			helper.respondJsonError(req, res, 500);
		}

		helper.respondJson(req, res, 200, object);
	}
}

genericModel.create = function(collection, data, callback) {
	db.insert(collection, data, function(err, object) {
		if(err) {
			return callback(err);
		}

		return callback(null, object)
	})
}