'use strict';

var sanitize = require('../helpers/sanitize');

class Route {

	constructor(server, model, config) {
		this.server = server;
		this.model = model;
		this.config = config;
	}

	static success(r, response, keys) {
		if (typeof response === 'undefined') response = {};
		else try {
			response = response.toObject();
		}
		catch (e) { }

		response.status = 'ok';
		response = sanitize(response, keys);

		r.send(200, response);
	}

	static fail(r, response, code) {
		response = response || {};
		code = code || 404;

		if (response.name === 'MongoError') response = {error: response.err};
		else if (response.name === 'ValidationError') response = {error: response.errors};

		response.status = 'error';
		response.code = code;

		r.send(code, response);
	}
}

module.exports = Route;