/* global __dirname */
'use strict';

const MODELS_PATH = `${__dirname}/../models`;

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
			db: {native_parser: true},
			server: {poolSize: 5},
			user: this.config.username,
			pass: this.config.password
		};
	
		mongoose.connect(`${this.config.uri}:${this.config.port}/${this.config.db}`, options);
	
		mongoose.connection
			.on('error', (err) => logger.error('Database connection error', JSON.stringify(err)))
			.once('open', () => {
				this.isConnected = true;
				logger.info(`DB connected ${this.config.uri}/${this.config.db}`);
			});
	}
	
	loadModel () {
			
		// load models
		var modelsFiles = fs.readdirSync(MODELS_PATH);
		
		modelsFiles
			.filter((filename) => /.*\.model\.js/.test(filename))
			.forEach((filename) => {
				var schemaDefinition = new (require(`${MODELS_PATH}/${filename}`));
				schemaDefinition.configure();
				this.models[schemaDefinition.name] = mongoose.model(schemaDefinition.name, schemaDefinition.schema);
			});
	
		return this.models;
	}
}

module.exports = Database;