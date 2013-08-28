var helper = require('../lib/helper');
var config  = require("../config");

var homeController = module.exports = {};

homeController.index = function(req, res, next) {
	var context = {
		title: config.title
	};

	return helper.render(req, res, 200, 'home/index', context);
};

homeController.awesomeSauce = function(req, res) {
  if(!req.user || !req.user.admin) {
    return res.redirect("/go");
  }

	var context = {
		title: config.title,
		layout: "backbone"
	};

	return helper.render(req, res, 200, "home/index", context);
};

homeController.go = function(req, res) {
  var context = {
    title: config.title,
    register_inputs: { 
      "name": "Name",
      "email": "Email", 
      "password": "Password", 
      "password_confirmation": "Password Confirmation",
    },
    login_inputs: {
      "email": "Email",
      "password": "Password"
    }
  };

  return helper.render(req, res, 200, "home/go", context);
};