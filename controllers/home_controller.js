var helper = require('../lib/helper');
var config  = require("../config");

var homeController = module.exports = {};

homeController.index = function(req, res, next) {
	var context = {
		title: config.title
	}
	return helper.render(req, res, 200, 'home/index', context);
}

homeController.awesomeSauce = function(req, res) {
	var context = {
		title: config.title,
		layout: "backbone"
	}

	return helper.render(req, res, 200, "home/index", context);
}