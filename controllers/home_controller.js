var helper = require('../lib/helper');
var config  = require("../config");

var homeController = module.exports = {};

homeController.index = function(req, res, next) {
	var context = {
		title: config.title,
    home: true,
    semantic: true
	};

	return helper.render(req, res, 200, 'home/index', context);
};

homeController.awesomeSauce = function(req, res) {
  if(!req.user || !req.user.admin) {
    return res.redirect("/dashboard");
  }
  
	var context = {
		title: config.title,
		user : helper.addslashes(JSON.stringify(req.user)),
		layout: "backbone",
    bootstrap: true,
    app: true
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
    },
    bootstrap: true,
  };

  return helper.render(req, res, 200, "home/go", context);
};

homeController.dashboard = function(req, res) {
  if(!req.user) {
    res.redirect("/go");
    return;
  }

  var context = {
    title: config.title,
    user : helper.addslashes(JSON.stringify(req.user)),
    layout: "backbone",
    semantic: false,
    dashboard: false
  };

  return helper.render(req, res, 200, "home/index", context);
};