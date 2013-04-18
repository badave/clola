var ObjectID = require('mongodb').ObjectID,
  bcrypt = require('bcrypt'),
  crypto = require('crypto'),
  hbs = require("hbs");

var db = require("../lib/db");
var helper = require('../lib/helper');
var config = require("../config");

var genericModel = require("../lib/generic_model");

var placesController = module.exports = {};

placesController.index = function(req, res, next) {
  var context = {
    title: config.title
  }
  return helper.render(req, res, 200, 'places/index', context);
}

placesController.find = function(req, res, next) {
	genericModel.find("places", genericModel.jsonResponder(req, res))
}

placesController.create = function(req, res) {
	genericModel.create("places", req.body, genericModel.jsonResponder(req, res));
}