'use strict';

const MODELS_PATH = `${__dirname}/../models`;
const RE_PATTERN_TO_LOAD =  /.*\.model\.js/;
const EXCLUDED_FILES = ['basic.model.js'];

var fs = require('fs'),
	mongoose = require('mongoose'),
	logger = require('winston'),
	instance = null;

/** singleton */
class Database {

	constructor (config) {
		if (instance) return instance;
		instance = this; // eslint-disable-line consistent-this

		this.config = config;
		this.isConnected = false;
		this.models = {};

		if (this.config.autoConnect) this.connect();
	}

	connect () {
		var options = {
			db: {native_parser: true}, // eslint-disable-line camelcase
			server: {poolSize: 5}
		};

		if (this.config) {
			options.user = this.config.username;
			options.pass = this.config.password;
		}

		mongoose.connect(`${this.config.uri}:${this.config.port}/${this.config.db}`, options);

		mongoose.connection
			.on('error', (err) => logger.error('Database connection error', JSON.stringify(err)))
			.once('open', () => {
				this.isConnected = true;
				mongoose.Promise = global.Promise;
				logger.info(`DB connected ${this.config.uri}/${this.config.db}`);
			});
	}

	loadModel () {
		// load models
		var modelsFiles = fs.readdirSync(MODELS_PATH);

		modelsFiles
			.filter((filename) => RE_PATTERN_TO_LOAD.test(filename) && EXCLUDED_FILES.indexOf(filename) === -1)
			.forEach((filename) => {
				var schemaDefinition = new (require(`${MODELS_PATH}/${filename}`));
				schemaDefinition.configure();
				this.models[schemaDefinition.name] = mongoose.model(schemaDefinition.name, schemaDefinition.schema);
			});

		this.models.ObjectId = Database.ObjectId;

		return this.models;
	}

	disconnect (callback) {
		mongoose.disconnect(function (err, value) {
			if (typeof callback === 'function') callback(err, value);
			logger.info('Database connection was closed');
		});
	}

	clean () {
		var self = this;
		Object.keys(self.models).forEach(function (modelName) {
			if (typeof self.models[modelName].remove === 'undefined') return;
			self.models[modelName].remove({}, function () {
				logger.warn(modelName + ' collection was removed');
			});
		});
	}

	static ObjectId (id) {
		var value = null;
		if (!mongoose.Types.ObjectId.isValid(id)) return value;

		try {
			value = mongoose.Types.ObjectId(id);
		}
		catch (e) {
			// nothing
		}
		return value;
	}
}

module.exports = Database;
