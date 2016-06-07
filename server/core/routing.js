'use strict';

const ROUTERS_PATH = `${__dirname}/../routes`;
const STATIC_ROUTER = 'static.router.js';
const ABSTRACT_ROUTER = 'abstract.router.js';
const ABSTRACT_ENTITY_ROUTER = 'abstract.entity.router.js';
const RE_DEBUG_LOG = /(^\/api\/|^\/\??$)/; // /api and /

var fs = require('fs'),
	logger = require('winston');

class RouterLoader {

	constructor (server, config) {
		this.server = server;
		this.config = config;

		// Add debug logger to endpoints
		server.use(function (req, res, next) {
			if (RE_DEBUG_LOG.test(req.url)) logger.debug(req.method + ' ' + req.url);
			return next();
		});
	}

	loadRouters () {
		var files = fs.readdirSync(ROUTERS_PATH);

		files
			// Exlude some routes (static and abstract)
			.filter(filename => {
				return /.*\.router\.js/.test(filename)
					&& [STATIC_ROUTER, ABSTRACT_ROUTER, ABSTRACT_ENTITY_ROUTER].indexOf(filename) === -1;
			})
			.forEach(filename => this.loadRouter(filename));

		this.loadRouter(STATIC_ROUTER);
	}

	loadRouter (routeName) {
		var Router = require(`${ROUTERS_PATH}/${routeName}`);
		new Router(this.server, this.config).configure();
	}
}

module.exports = RouterLoader;
