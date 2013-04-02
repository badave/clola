var helper = require('../lib/helper');
var config  = require("../config");

var homeController = module.exports = {};

homeController.index = function(req, res, next) {
	var context = {
		title: config.title
	}
	return helper.render(req, res, 200, 'home/index', context);
}