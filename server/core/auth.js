'use strict';

var logger = require('winston'),
	uuid = require('uuid'),
	Cache = require('./cache');

class Auth {

	static validateToken (token) {
		// send request to DB
		if (token === 'test') {
			logger.debug('Auth failed');
			return false;
		}
		return true;
	}
	static authorize (username) {
		var cache = new Cache(), // singleton
			token = uuid.v4();
			
		cache.put(username, token);
		
		logger.debug(`User ${username} authorized`);
		
		return {username, token};
	}
}

module.exports = Auth;
