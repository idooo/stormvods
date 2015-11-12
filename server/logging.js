/* global __dirname */

var winston = require('winston');

module.exports = function (config) {

	winston.remove(winston.transports.Console);
	
	winston.add(winston.transports.Console, {
		level: (config.logs || {}).level,
		colorize: true,
		timestamp: function () {
			var date = new Date();
			return ('0' + date.getHours()).slice(-2) + ':'
				+ ('0' + date.getMinutes()).slice(-2) + ':'
				+ ('0' + date.getSeconds()).slice(-2) + '.'
				+ ('00' + date.getMilliseconds()).slice(-3);
		}
	});
	
	winston.add(winston.transports.File, {
		level: (config.logs || {}).level,
		json: false,
		filename: (config.logs || {}).file || `${__dirname}/../logs/server.log`
	});

	return winston;
};