var ObjectID = require('mongodb').ObjectID,
  bcrypt = require('bcrypt'),
  crypto = require('crypto'),
  hbs = require("hbs");

var db = require("../lib/db");
var helper = require('../lib/helper');
var config = require("../config");

var genericModel = require("../lib/generic_model");

var locationsController = module.exports = {};

locationsController.find = function(req, res, next) {
  if(!req.user) {
    return res.redirect("/go");
  }

  var business_id = ObjectID(req.params.business_id);

  genericModel.findWithQuery("locations", { "user_id": req.user._id, "business_id": business_id }, genericModel.jsonResponder(req, res))
}


locationsController.findOne = function(req, res, next) {
  if(!req.user) {
    return res.redirect("/go");
  }

  genericModel.findOneWithQuery("locations", { "user_id": req.user._id, "_id": ObjectID(req.params.location_id) }, genericModel.jsonResponder(req, res))
}

locationsController.create = function(req, res) {
  if(!req.user) {
    return res.redirect("/go");
  }

  var location = req.body;

  location.user_id = req.user._id;
  location.business_id = ObjectID(req.body.business_id);
  location.created = new Date().getTime();
  location.created_date = new Date();
  
  genericModel.create("locations", location, genericModel.jsonResponder(req, res));
}

locationsController.update = function(req, res) {
  if(!req.user) {
    return res.redirect("/go");
  }

  var business_id = ObjectID(req.params.business_id); 

  var location = req.body;

  location.user_id = req.user._id;
  location.business_id = ObjectID(req.body.business_id);
  location.updated = new Date().getTime();
  location.created_date = new Date();
  
  genericModel.update("locations", { "_id": ObjectID(req.params.location_id), "user_id": req.user._id, "business_id": business_id }, location, genericModel.jsonResponder(req, res));
}