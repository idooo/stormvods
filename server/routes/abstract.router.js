'use strict';

var util = require('util'),
	logger = require('winston'),
	Auth = require('../core/auth'),
	Database = require('../core/database'),
	Constants = require('../constants');

const RE_FILTER = /[^a-zA-Z0-9\s\#_\-]+/g;
const RE_PRETTIFY_ERROR = /\(?`?\{(PATH|VALUE)}`?\)?\s?/g;
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

	bindDELETE (url, route, options) {
		this.bind(url, 'del', route, options);
	}

	bind (url, methodName, route, options) {
		var wrapper = route.bind(this);

		options = util._extend(util._extend({}, DEFAULT_ROUTE_OPTIONS), options || {});

		// Auth
		if (options.auth) {
			wrapper = this.wrapAuth(route, options.restrict || Constants.ROLES.USER);
		}
		this.server[methodName](url, wrapper);
	}

	wrapAuth (route, restrictLevel) {
		var self = this;
		return function (req, res, next) {
			var token = req.header(AUTH_HEADER);

			logger.debug('Auth for route in progress');

			Auth.findUserByToken(token)
				.then(function (authData) {

					// Debug
					if (self.config.debug && self.config.debug.alwaysLogin) {
						authData.name = self.config.debug.alwaysLoginDetails.name;
						authData.id = self.config.debug.alwaysLoginDetails.id;
						authData.role = self.config.debug.alwaysLoginDetails.role;
					}

					if (!authData.id) {
						Router.fail(res, {message: Constants.ERROR_AUTH_REQUIRED}, 403);
					}
					else if (authData.role < restrictLevel) {
						Router.fail(res, {message: Constants.ERROR_ACCESS_DENIED}, 403);
					}
					else {
						authData.id = self.models.ObjectId(authData.id);
						route.call(self, req, res, next, authData);
					}
				})
				.catch(function (err) {
					logger.error(err.stack);
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
				errors[fieldName] = response.errors[fieldName].properties.message.replace(RE_PRETTIFY_ERROR, '');
			}

			response = {message: errors};
		}

		response.status = 'error';
		response.code = code;

		r.send(code, response);
	}

	static notFound (res, next, id) {
		logger.info(`${Constants.ERROR_NOT_FOUND} "${id}"`);
		Router.fail(res, {message: Constants.ERROR_NOT_FOUND}, 404);
		return next();
	}

	static body (req) {
		try {
			return JSON.parse(req.body);
		}
		catch (e) {
			return {};
		}
	}

	static filter (str) {
		return (str.toString() || '').trim().replace(RE_FILTER, '').replace(/(\s+|\t+)/g, ' ');
	}

}

module.exports = Router;
