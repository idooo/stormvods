'use strict';

var restify = require('restify'),
	Route = require('./abstract.route');

class StaticRoute extends Route {

	configure() {
		this.server.get(/\/?.*/, restify.serveStatic({
			directory: __dirname + '/../../web',
			default: 'index.html',
			maxAge: 1 // TODO: disable in production
		}));
	}
}

module.exports = StaticRoute;