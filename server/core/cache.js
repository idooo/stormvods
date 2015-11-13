'use strict';

var logger = require('winston'),
	instance = null;

class Cache {
	
	constructor () {
		if (!instance) instance = this; // eslint-disable-line consistent-this
		this.cache = {};
		return instance;
	}
	put (key, value) {
		this.cache[key] = value;
		logger.debug(`Put "${key}" => "${value}" to cache`);
	}
	get (key) {
		logger.debug(`Return "${key}" => "${this.cache[key]}" from cache`);
		return this.cache[key];
	}
}

module.exports = Cache;
