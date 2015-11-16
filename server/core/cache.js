'use strict';

var logger = require('winston'),
	redis = require('redis'),
	instance = null;

const TYPE_UNKNOWN = 'UNKNOWN'
const TYPE_REDIS = 'REDIS';
const TYPE_MEMORY = 'MEMORY';

/** singleton */
class Cache {
	
	constructor (config) {
		if (instance) return instance;
		instance = this; // eslint-disable-line consistent-this
		
		logger.info('Cache instance have been created');
		
		this.config = config;
		this.type = TYPE_UNKNOWN;
		
		this.start();		
	}
	
	start () {
		var self = this,
			connectionAttempts = 0;
		
		this.reddisClient = redis.createClient({
			host: this.config.host,
			port: this.config.port,
			max_attempts: this.config.maxAttempts
		});
		
		this.reddisClient
			.on('error', function (err) {
				logger.warn(err.toString());
				if (self.type === TYPE_UNKNOWN) {
					connectionAttempts++;
					if (connectionAttempts >= self.config.maxAttempts) {
						self.type = TYPE_MEMORY;
						self.localFallback();
					}	
				}
			})
			.on('ready', function () {
				logger.info('Connection established');
				self.type = TYPE_REDIS;
			});
	}
	
	localFallback () {
		logger.warn('Local fallback for cache established');
		this.cache = {};	
	}
	
	put (key, value) {
		if (this.type === TYPE_REDIS) this.reddisClient.set(key, value);
		else this.cache[key] = value;
		
		logger.debug(`Put "${key}" => "${value}" to cache`);
	}
	
	// TODO Promises
	get (key, callback) {
		if (typeof callback !== 'function') {
			return logger.err(`Expecting callback to return value from Cache for "${key}"`);
		}		
		
		if (this.type === TYPE_REDIS) this.reddisClient.get(key, callback);
		else callback(null, this.cache[key]);
		
		logger.debug(`Return "${key}" => "${this.cache[key]}" from cache`);		
	}
}

module.exports = Cache;
