'use strict';

var logger = require('winston'),
	uuid = require('node-uuid'),
	Cache = require('./cache');

class Auth {

	static findUserBySessionId (sessionId) {
		var cache = new Cache(),
			username = cache.get(sessionId);
		
		if (!username) {
			logger.debug(`Session ID "${sessionId}" not found in cache`);
			return false;
		}
		return username;
	}
	
	static authorize (username) {
		var cache = new Cache(),	
			sessionId = uuid.v4();

		cache.put(sessionId, username);
		logger.debug(`User ${username} authorized`);
		
		return {sessionId, username};
	}
}

module.exports = Auth;
