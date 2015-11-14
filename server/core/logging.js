/* global __dirname */

const RE_STACK_REPLACE1 = /(^[^\(]+?[\n$]|^\s+at\s+)/gm;
const RE_STACK_REPLACE2 = /(.*)(\s+\().*(\/server.*)\)/;

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
		},
		formatter:  function (options) {
			return winston.config.colorize(options.level, (options.level.toUpperCase()  + '  ').slice(0, 5))
				+ ': ' + this.timestamp() + ' - ' + getLastStack() + ' - ' + options.message + getMeta(options);
		}
	});

	winston.add(winston.transports.File, {
		level: (config.logs || {}).level,
		json: false,
		filename: (config.logs || {}).file || `${__dirname}/../logs/server.log`
	});
	
	function getMeta (options) {
		if (Object.keys(options.meta).length) return ' - ' + JSON.stringify(options.meta);
		else return '';
	}

	function getLastStack () {
		var e = new Error('dummy');

		return e.stack.replace(RE_STACK_REPLACE1, '')
			.split('\n')
			.splice(10, 1)[0]
			.replace(RE_STACK_REPLACE2, '$1 [$3]');
	}
	return winston;
};
