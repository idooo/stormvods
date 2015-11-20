'use strict';

var util = require('util'),
	logger = require('winston'),
	Auth = require('../core/auth'),
	Database = require('../core/database'),
	Constants = require('../constants'),
	User = require('../models/user.model');

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
		var wrapper = route.bind(this);

		options = util._extend(util._extend({}, DEFAULT_ROUTE_OPTIONS), options || {});

		// Auth
		if (options.auth) wrapper = this.wrapAuth(route);

		this.server[methodName](url, wrapper);
	}

	wrapAuth (route) {
		var self = this;
		return function (req, res, next) {
			var token = req.header(AUTH_HEADER);

			Auth.findUserByToken(token)
				.then(function (id, name, role) {
					// Debug
					if (self.config.debug && self.config.debug.alwaysLogin) {
						name = self.config.debug.alwaysLoginDetails.name;
						id = self.config.debug.alwaysLoginDetails.id;
						role = self.config.debug.alwaysLoginDetails.role;
					}

					// TODO: should handle error in catch
					if (name) route.call(self, req, res, next, {id, name, role});
					else Router.fail(res, {message: Constants.ERROR_ACCESS_DENIED}, 403);
				})
				.catch(function () {
					Router.fail(res, {message: Constants.ERROR_INTERNAL}, 500);
				});
		};
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
