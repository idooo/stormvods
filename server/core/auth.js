'use strict';

var logger = require('winston');

class Auth {

	static validateToken (token) {
		// send request to DB
		if (token === 'test') {
			logger.debug('Auth failed');
			return false;
		}
		return true;
	}
}

module.exports = Auth;
