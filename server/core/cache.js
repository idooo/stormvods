'use strict';

var logger = require('winston'),
	instance = null;

/** singleton */
class Cache {
	
	constructor () {
		if (instance) return instance;
		instance = this; // eslint-disable-line consistent-this
		
		this.cache = {};
		logger.info('Cache instance have been created');
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
