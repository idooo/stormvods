'use strict';

var logger = require('winston'),
	uuid = require('node-uuid'),
	base64url = require('base64url'),
	Cache = require('./cache');

class Auth {
	
	// TODO: Cache user _id

	static findUserByToken (token) {
		var cache = new Cache(),
			username = cache.get(token);
		
		if (!username) {
			logger.debug(`Token "${token}" not found in cache`);
			return false;
		}
		return username;
	}
	
	static authorize (username) {
		var cache = new Cache(),	
			token = base64url(uuid.v4());

		token = token.slice(9) + token.slice(0, 9);
		
		cache.put(token, username);
		logger.debug(`User ${username} authorized`);
		
		return {token, username};
	}
}

module.exports = Auth;
