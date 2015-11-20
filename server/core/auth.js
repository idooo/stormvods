'use strict';

var logger = require('winston'),
	uuid = require('node-uuid'),
	base64url = require('base64url'),
	Cache = require('./cache');

var cache = new Cache();

class Auth {

	static findUserByToken (token) {
		return new Promise(function (resolve) {
			cache.get(token)
				.then((data) => {
					var tmp = data.split(':');
					resolve({
						id: tmp[0],
						name: tmp[1],
						role: tmp[2]
					});
				})
				.catch(() => resolve(null))
		});
	}

	static authorize (id, username, role) {
		var cache = new Cache(),
			token = base64url(uuid.v4());

		token = token.slice(9) + token.slice(0, 9);

		cache.put(token, `${id.toString()}:${username}:${role}`);
		logger.debug(`User ${username} authorized (role ${role})`);

		return {token, username};
	}
}

module.exports = Auth;
