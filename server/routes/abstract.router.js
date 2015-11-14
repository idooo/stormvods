'use strict';

var util = require('util'),
	logger = require('winston'),
	Auth = require('../core/auth'),
	Database = require('../core/database');

const AUTH_HEADER = 'Authorization';
const DEFAULT_ROUTE_OPTIONS = {
	auth: false
};

class Router {

	constructor (server, config) {
		this.server = server;
		this.config = config;
		this.models = new Database().models;
		logger.debug('Router has been loaded');
	}

	bind (url, route, options) {
		var self = this,
			wrapper = route.bind(this);

		options = util._extend(util._extend({}, DEFAULT_ROUTE_OPTIONS), options || {});
		
		// Auth
		if (options.auth) {
			wrapper = function (req, res, next) {
				var token = req.header(AUTH_HEADER),
					username = Auth.findUserByToken(token);
					
				// Debug	
				if (self.config.debug && self.config.debug.alwaysLogin) username = self.config.debug.alwaysLogin;	
					
				if (username) route.call(self, req, res, next, username);
				else Router.fail(res, {message: 'Access denied'}, 403);
			};
		}

		this.server.get(url, wrapper);
	}

	static setCookie (r, name, value) {
		r.writeHead(200, {
			'Set-Cookie': `${name}=${value}`
		});
	}

	static success (r, response) {
		if (typeof response === 'undefined') response = {};
		response.status = 'ok';
		r.send(200, response);
	}

	static fail (r, response, code) {
		response = response || {};
		code = code || 400;

		if (response.name === 'MongoError') {
			code = 500;
			response = {error: response.err};
		}
		else if (response.name === 'ValidationError') response = {error: response.errors};

		response.status = 'error';
		response.code = code;

		r.send(code, response);
	}
}

module.exports = Router;
