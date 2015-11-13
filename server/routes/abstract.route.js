'use strict';

var util = require('util'),
	Auth = require('../core/auth');

const AUTH_HEADER = 'Authorization';
const DEFAULT_ROUTE_OPTIONS = {
	auth: false
};

class Route {

	constructor (server, model, config) {
		this.server = server;
		this.model = model;
		this.config = config;
	}

	bind (url, route, options) {
		var self = this,
			wrapper = route.bind(this);

		options = util._extend(DEFAULT_ROUTE_OPTIONS, options || {});

		if (options.auth) {
			wrapper = function (req, res, next) {
				var token = req.header(AUTH_HEADER);
				if (Auth.validate(token)) route.call(self, req, res, next);
				else Route.fail(res, {message: 'Auth failed'}, 403);
			}
		}

		this.server.get(url, wrapper);
	}

	static success (r, response) {
		if (typeof response === 'undefined') response = {};
		response.status = 'ok';
		r.send(200, response);
	}

	static fail (r, response, code) {
		response = response || {};
		code = code || 400;

		if (response.name === 'MongoError') response = {error: response.err};
		else if (response.name === 'ValidationError') response = {error: response.errors};

		response.status = 'error';
		response.code = code;

		r.send(code, response);
	}
}

module.exports = Route;
