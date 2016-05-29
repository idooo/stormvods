'use strict';

var util = require('util'),
	logger = require('winston'),
	Auth = require('../core/auth'),
	Database = require('../core/database'),
	Constants = require('../constants');

const RE_FILTER = /[^a-zA-Z0-9\s#_\-\)\(]+/g;
const RE_PRETTIFY_ERROR = /\(?`?\{(PATH|VALUE)}`?\)?\s?/g;
const AUTH_HEADER = 'Authorization';
const DEFAULT_ROUTE_OPTIONS = {
	auth: false
};
const DEBUG_HEADERS = {
	ID: 'X-Debug-User-Id',
	NAME: 'X-Debug-User-Name',
	ROLE: 'X-Debug-User-Role'
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

	bindPUT (url, route, options) {
		this.bind(url, 'put', route, options);
	}

	bindHEAD (url, route, options) {
		this.bind(url, 'head', route, options);
	}

	bindDELETE (url, route, options) {
		this.bind(url, 'del', route, options);
	}

	/**
	 * Binds router function to route url with additional options.
	 * Options object:
	 * {
	 *     auth: <boolean>,
	 *     restrict: <number>
	 * }
	 *
	 * @param {String} url
	 * @param {String} methodName
	 * @param {Function} route
     * @param {Object} [options]
     */
	bind (url, methodName, route, options) {
		var wrapper = route.bind(this);

		options = util._extend(util._extend({}, DEFAULT_ROUTE_OPTIONS), options || {});

		// Auth
		if (options.auth) {
			wrapper = this.wrapAuth(route, options.restrict || Constants.ROLES.USER);
		}
		this.server[methodName](url, wrapper);
	}

	/**
	 * @description
	 * Wrap route in auth function
	 * Auth function will pass 4th param to route with `auth` object
	 * if auth is passed
	 *
	 * {
	 *    name: String, // user name
	 *    id: String, // Object id
	 *    role: Number // user role
	 * }
	 *
	 * @param {Function} route
	 * @param {Number} restrictLevel
	 * @returns {Function}
     */
	wrapAuth (route, restrictLevel) {
		var self = this;

		return function (req, res, next) {
			var token = req.header(AUTH_HEADER),
				authData = {};

			logger.debug('Auth for route in progress');

			Auth.findUserByToken(token)
				.then(function (_authData) {
					var error;
					authData = _authData;

					// Debug
					if (self.config.debug && self.config.debug.loginHeaders && req.header(DEBUG_HEADERS.NAME)) {
						authData.name = req.header(DEBUG_HEADERS.NAME);
						authData.id = req.header(DEBUG_HEADERS.ID);
						authData.role = parseInt(req.header(DEBUG_HEADERS.ROLE), 10);
					}

					if (restrictLevel !== Constants.ROLES.OPTIONAL) {
						if (!authData.id) error = Constants.ERROR_AUTH_REQUIRED;
						else if (authData.role < restrictLevel) error = Constants.ERROR_ACCESS_DENIED;
					}

					// leave earlier if we have any errors already
					if (error) return Promise.reject(error);

					// query the database to check user is active
					// if we have user data in session storage
					if (authData.id) {
						return self.models.User.findOne({
							_id: authData.id,
							isRemoved: {'$ne': true}
						}, '_id');
					}
				})
				.then(function (user) {
					// For testing, ignore user search for testUser
					if (self.config.debug && self.config.debug.loginHeaders && authData.name === 'testUser') {
						user = true;
					}

					// if we have id from session cache but there is no user in db
					// then die
					if (!user && authData.id) {
						return Router.fail(res, {message: Constants.ERROR_INACTIVE_USER}, 403);
					}
					// otherwise just call the route
					else {
						authData.id = self.models.ObjectId(authData.id);
						route.call(self, req, res, next, authData);
					}
				})
				.catch(function (err) {
					if (err.stack) {
						logger.error(err.stack);
						Router.fail(res, {message: Constants.ERROR_INTERNAL}, 500);
					}
					else {
						Router.fail(res, {message: err}, 403);
					}

				});
		};
	}

	/**
	 * Sends success response to the user
	 * @param {Object} res response object
	 * @param {Object} [data] content to return
     */
	static success (res, data) {
		if (typeof data === 'undefined' || data === null) data = {};
		data.status = 'ok';
		res.send(200, data);
	}

	/**
	 * Sends error response to the user
	 * @param {Object} res response object
	 * @param {Object} [data] content to return
	 * @param {Number} [code=400] error code
     */
	static fail (res, data, code) {
		data = data || {};
		code = code || 400;

		if (data.name === 'MongoError') {
			code = 500;
			data = {error: data.err};
		}
		else if (data.name === 'ValidationError') {
			var errors = {};

			for (let fieldName of Object.keys(data.errors)) {
				errors[fieldName] = data.errors[fieldName].properties.message.replace(RE_PRETTIFY_ERROR, '');
			}

			data = {message: errors};
		}

		data.status = 'error';
		data.code = code;

		res.send(code, data);
	}

	/**
	 * Sends 404 error response to the user with NOT FOUND message
	 * @param {Object} res response object
	 * @param {Object} next
	 * @param {Object} id object that not found to show to the user
     * @returns {*}
     */
	static notFound (res, next, id) {
		logger.info(`${Constants.ERROR_NOT_FOUND} "${id}"`);
		Router.fail(res, {message: Constants.ERROR_NOT_FOUND}, 404);
		return next();
	}

	/**
	 * Attempts to parse request body to get JS object
	 * @param {Object} req request object
	 * @returns {{}}
     */
	static body (req) {
		try {
			return JSON.parse(req.body);
		}
		catch (e) {
			return {};
		}
	}

	/**
	 * Attempts to filter incoming string. Returns null if string null or undefined.
	 * Otherwise returns trimmed and sanitised version of the string
	 * @param {String} str
	 * @returns {*}
     */
	static filter (str) {
		if (str === null || str === undefined) return null;
		return (str.toString() || '').trim().replace(RE_FILTER, '').replace(/(\s+|\t+)/g, ' ');
	}

	/**
	 * Attempts to format incoming string as a date.
	 * Returns null if failed.
	 * @param {String} str
	 * @returns {*}
     */
	static date (str) {
		str = Router.filter(str);
		if (str === null) return null;
		var date = new Date(str);
		if (!date.valueOf()) return null;
		return date;
	}
}

module.exports = Router;

// Define some docs abstractions

/**
 * @apiDefine NOT_FOUND
 * @apiError NOT_FOUND The id of the Entity was not found.
 *
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *     "message": "NOT_FOUND",
 *     "status": "error",
 *     "code": 404
 * }
 */

/**
 * @apiDefine AUTH_REQUIRED
 * @apiError AUTH_REQUIRED Auth required
 *
 * @apiErrorExample Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *     "message": "AUTH_REQUIRED",
 *     "status": "error",
 *     "code": 403
 * }
 */

/**
 * @apiDefine WRONG_TYPE
 * @apiError WRONG_TYPE Wrong type parameter
 */

/**
 * @apiDefine INVALID_VALUE
 * @apiError INVALID_VALUE Wrong input values
 */
