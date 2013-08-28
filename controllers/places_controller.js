var ObjectID = require('mongodb').ObjectID,
  bcrypt = require('bcrypt'),
  crypto = require('crypto'),
  hbs = require("hbs");

var db = require("../lib/db");
var helper = require('../lib/helper');
var config = require("../config");

var genericModel = require("../lib/generic_model");

var placesController = module.exports = {};

placesController.find = function(req, res, next) {
	genericModel.find("places", genericModel.jsonResponder(req, res))
}

placesController.create = function(req, res) {
  if(!req.user) {
    return res.redirect("/go");
  }
  
	genericModel.create("places", req.body, genericModel.jsonResponder(req, res));
}

placesController.update = function(req, res) {
  if(!req.user) {
    return res.redirect("/go");
  }
  
	genericModel.update("places", { "_id": ObjectID(req.params.id) }, req.body, genericModel.jsonResponder(req, res));
}