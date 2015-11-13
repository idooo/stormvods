'use strict';

class Route {

	constructor (server, model, config) {
		this.server = server;
		this.model = model;
		this.config = config;
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
