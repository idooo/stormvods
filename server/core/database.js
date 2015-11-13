/* global __dirname */
var mongoose = require('mongoose'),
	logger = require('winston');

var modelsFiles = ['user.model'];

module.exports = function (config) {

	config.database.isConnected = false;

	var options = {
		db: {native_parser: true},
		server: {poolSize: 5},
		user: config.database.username,
		pass: config.database.password
	};
	var models = [];

	mongoose.connect(config.database.uri + ':' + config.database.port + '/' + config.database.db, options);

	var connection = mongoose.connection;
	connection.on('error', function (err) {
		logger.error('Database connection error', JSON.stringify(err));
	});
	connection.once('open', function callback () {
		config.database.isConnected = true;
		logger.info('DB connected ' + config.database.uri + '/' + config.database.db);
	});

	modelsFiles.forEach(function (modelName) {
		var schemaDefinition = new (require(`${__dirname}/../models/${modelName}`));
		schemaDefinition.configure();
		models[schemaDefinition.name] = mongoose.model(schemaDefinition.name, schemaDefinition.schema);

	});

	return models;
};
