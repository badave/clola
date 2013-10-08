var ObjectID = require('mongodb').ObjectID,
  bcrypt = require('bcrypt'),
  crypto = require('crypto'),
  hbs = require("hbs");

var db = require("../lib/db");
var helper = require('../lib/helper');
var config = require("../config");

var genericModel = require("../lib/generic_model");

var businessesController = module.exports = {};

businessesController.find = function(req, res, next) {
  if(!req.user) {
    return res.redirect("/go");
  }

  genericModel.findWithQuery("businesses", { "user_id": req.user._id }, genericModel.jsonResponder(req, res))
}


businessesController.findOne = function(req, res, next) {
  if(!req.user) {
    return res.redirect("/go");
  }

  genericModel.findOneWithQuery("businesses", { "user_id": req.user._id, "_id": ObjectID(req.params.id) }, genericModel.jsonResponder(req, res))
}

businessesController.create = function(req, res) {
  if(!req.user) {
    return res.redirect("/go");
  }

  var object = req.body;

  object.user_id = req.user._id;
  object.created = new Date().getTime();
  object.created_date = new Date();
  
  genericModel.create("businesses", object, genericModel.jsonResponder(req, res));
}

businessesController.update = function(req, res) {
  if(!req.user) {
    return res.redirect("/go");
  }
  
  genericModel.update("businesses", { "_id": ObjectID(req.params.id), "user_id": req.user._id }, req.body, genericModel.jsonResponder(req, res));
}