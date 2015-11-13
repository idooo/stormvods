/* global __dirname */
'use strict';

var restify = require('restify');

class Server {
	constructor (configName) {
		try {
			this.config = require(configName);
		}
		catch (e) {
			console.error(`Error! Cannot find config file '${process.env.config}'. Existing now...`); // eslint-disable-line no-console
			process.exit(1);
		}

		this.logger = require('./core/logging')(this.config);
		this.model = require('./core/database')(this.config);
		this.server = restify.createServer({});

		this.server.use(restify.bodyParser());
		this.server.use(restify.queryParser());

		// Load routing
		require('./core/routing')(this.server, this.model, this.config);
	}
	start () {
		var self = this;
		self.server.listen(self.config.server.port, function () {
			self.logger.info('Server is listening at %s', self.server.url);
		});
	}
}

module.exports = Server;
