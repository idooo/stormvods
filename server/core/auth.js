'use strict';

var logger = require('winston'),
	uuid = require('node-uuid'),
	base64url = require('base64url'),
	Cache = require('./cache');

var cache = new Cache();

class Auth {
	// TODO: Cache user _id

	static findUserByToken (token) {
		return cache.get(token);
	}
	
	static authorize (id, username) {
		var cache = new Cache(),	
			token = base64url(uuid.v4());

		token = token.slice(9) + token.slice(0, 9);
		
		cache.put(token, `${id.toString()}:${username}`);
		logger.debug(`User ${username} authorized`);
		
		return {token, username};
	}
}

module.exports = Auth;
