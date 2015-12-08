'use strict';

var logger = require('winston'),
	redis = require('redis'),
	instance = null;

const TYPE_UNKNOWN = 'UNKNOWN';
const TYPE_REDIS = 'REDIS';
const TYPE_MEMORY = 'MEMORY';
const RECONNECT_TIMER = 60 * 1000; // each 1 min try to reconnect to redis if connection is broken

/**
 * @singleton
 *
 * This object will try to establish connection with Redis
 * and will use local cache in case of errors.
 *
 * If connection with Redis was lost, the reconnect attempts
 * will be started by timer (RECONNECT_TIMER).
 *
 * The local cache will be migrated to Redis once connection
 * will be restored
 */
class Cache {

	constructor () {
		if (instance) return instance;
		instance = this; // eslint-disable-line consistent-this

		logger.info('Cache instance have been created');
		this.type = TYPE_UNKNOWN;
	}

	start (config) {
		var self = this;

		logger.info('Trying to connect to Redis');

		self.config = config;

		if (typeof self.config === 'undefined') {
			logger.warn('No Redis params found in config. Local fallback is coming');
			self.type = TYPE_MEMORY;
			return self.localFallback();
		}

		self.redisClient = redis.createClient({
			host: self.config.host,
			port: self.config.port,
			max_attempts: self.config.maxAttempts // eslint-disable-line camelcase
		});

		self.redisClient
			.on('error', function (err) {
				if (err.code === 'CONNECTION_BROKEN') {
					logger.error(err.toString());
					self.type = TYPE_MEMORY;
					self.localFallback();
					self.startReconnectTimer();
				}
				else logger.warn(err.toString());
			})
			.on('ready', function () {
				logger.info('Connection established');
				if (self.type === TYPE_MEMORY) {
					self.type = TYPE_REDIS; // to set right type before the migration
					self.moveCache();
				}
				self.type = TYPE_REDIS;
			});
	}

	startReconnectTimer () {
		logger.info(`Redis reconnect timer was started ${RECONNECT_TIMER} ms`);
		setTimeout (() => {
			this.start(this.config);
		}, RECONNECT_TIMER);
	}

	localFallback () {
		logger.warn('Local fallback for cache established');
		this.cache = {};
	}

	moveCache () {
		var migrated = 0;
		for (var key in this.cache) {
			this.put(key, this.cache[key]);
			migrated++;
		}
		this.cache = {};
		logger.info(`Migrated ${migrated} records from local cache to Redis`);
	}

	put (key, value) {
		// TODO: Test Expire
		if (this.type === TYPE_REDIS) this.redisClient.set(key, value, 'EX', this.config.expire);
		else this.cache[key] = value;

		logger.debug(`Put "${key}" => "${value}" to cache`);
	}

	get (key) {
		var self = this;
		return new Promise(function (resolve, reject) {
			if (self.type === TYPE_REDIS) {
				self.redisClient.get(key, (err, value) => {
					if (err) {
						logger.error(err);
						return reject(err);
					}
					logger.debug(`Returning "${key}" => "${value}" from Redis`);
					resolve(value);
				});
			}
			else {
				logger.debug(`Returning "${key}" => "${self.cache[key]}" from local cache`);
				resolve(self.cache[key]);
			}
		});
	}
}

module.exports = Cache;
