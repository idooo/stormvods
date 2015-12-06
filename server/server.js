/* global __dirname, process */
'use strict';

var	restify = require('restify'),
	CookieParser = require('restify-cookies'),
	Database = require('./core/database'),
	RouterLoader = require('./core/routing'),
	Cache = require('./core/cache');

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
		
		// Connect to DB and load model
		var db = new Database(this.config.database);
		this.model = db.loadModel();
		
		// Setup server
		this.server = restify.createServer({});
		this.server.use(restify.bodyParser({mapParams: true}));
		this.server.use(restify.queryParser());
		this.server.use(CookieParser.parse);

		// Load routing
		new RouterLoader(this.server, this.config).loadRouters();
		
		// Check debug settings
		if (this.config.debug) {
			Object.keys(this.config.debug).forEach((key) => {
				if (this.config.debug[key]) this.logger.warn(`Server: debug setting "${key}" enabled`);
			});
		}
		
		// Init other things
		new Cache().start(this.config.redis);
	}
	start () {
		var self = this;
		self.server.listen(self.config.server.port, function () {
			self.logger.info('Server is listening at %s', self.server.url);
		});
	}
}

module.exports = Server;
