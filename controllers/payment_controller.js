var ObjectID = require('mongodb').ObjectID,
  bcrypt = require('bcrypt'),
  crypto = require('crypto'),
  hbs = require("hbs");

var db = require("../lib/db");
var helper = require('../lib/helper');
var config = require("../config");

var genericModel = require("../lib/generic_model");

var paymentsController = module.exports = {};

paymentsController.findOne = function(req, res, next) {
  if(!req.user) {
    return res.redirect("/go");
  }

  genericModel.findOneWithQuery("payments", { "user_id": req.user._id }, genericModel.jsonResponder(req, res));
};

paymentsController.create = function(req, res) {
  if(!req.user) {
    return res.redirect("/go");
  }

  var object = req.body;

  object.user_id = req.user._id;
  object.created = new Date().getTime();
  object.created_date = new Date();
  
  genericModel.create("payments", object, genericModel.jsonResponder(req, res));
};

paymentsController.update = function(req, res) {
  if(!req.user) {
    return res.redirect("/go");
  }
  
  genericModel.update("payments", { "_id": ObjectID(req.params.id), "user_id": req.user._id }, req.body, genericModel.jsonResponder(req, res));
};