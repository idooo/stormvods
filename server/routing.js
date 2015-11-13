/* global __dirname */

'use strict';

var routes = [
	'auth',
	'test',
	'static'
];

var logger = require('winston');

module.exports = function (server, model, config) {

	server.use(function (req, res, next) {
		if (req.url.indexOf('/api') >= 0) logger.debug(req.method + ' ' + req.url);
		return next();
	});

	var Route;
	routes.forEach(function (routeName) {
		Route = require(__dirname + '/routes/' + routeName);
		new Route(server, model, config).configure();
	});
};
