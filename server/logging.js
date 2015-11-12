var winston = require('winston');

module.exports = function(config) {

	config.logger = new (winston.Logger) ({
		transports: [
			new (winston.transports.Console)({
				level: (config.logs || {}).level,
				colorize: true
			}),
			new (winston.transports.File)({
				level: (config.logs || {}).level,
				json: false,
				filename: (config.logs || {}).file || `${__dirname}/../logs/server.log`
			})
		]
	});

	return config.logger;
};