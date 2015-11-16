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
	
	bindGET (url, route, options) {
		this.bind(url, 'get', route, options);
	}

	bindPOST (url, route, options) {
		this.bind(url, 'post', route, options);
	}

	bind (url, methodName, route, options) {
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
					
				// TODO: we need user _id as well
				
				if (username) route.call(self, req, res, next, username);
				else Router.fail(res, {message: 'Access denied'}, 403);
			};
		}

		this.server[methodName](url, wrapper);
	}

	static success (r, response) {
		if (typeof response === 'undefined' || response === null) response = {};
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
		else if (response.name === 'ValidationError') {
			var errors = {};
				
			for (let fieldName of Object.keys(response.errors)) {
				errors[fieldName] = response.errors[fieldName].properties.message;
			}
			
			response = {message: errors};
		}

		response.status = 'error';
		response.code = code;

		r.send(code, response);
	}
}

module.exports = Router;
