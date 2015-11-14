/* global __dirname */

'use strict';

const ROUTERS_PATH = `${__dirname}/../routes`;
const STATIC_ROUTER = 'static.router.js';
const ABSTRACT_ROUTER = 'abstract.router.js';

var fs = require('fs'),
	logger = require('winston');

class RouterLoader {
	
	constructor (server, model, config) {
		this.server = server;
		this.model = model;
		this.config = config;
		
		// Add debug logger for /api/* endpoints
		server.use(function (req, res, next) {
			if (req.url.indexOf('/api') >= 0) logger.debug(req.method + ' ' + req.url);
			return next();
		});
	}
	
	loadRouters () {
		var files = fs.readdirSync(ROUTERS_PATH);
		
		files
			.filter((filename) => {
				return /.*\.router\.js/.test(filename) && [STATIC_ROUTER, ABSTRACT_ROUTER].indexOf(filename) === -1;
			}) 
			.forEach((filename) => this.loadRouter(filename));
		
		// static must be the last
		this.loadRouter(STATIC_ROUTER);
	
		return this.models;
	}
	
	loadRouter (routeName) {
		var Router = require(`${ROUTERS_PATH}/${routeName}`);
		new Router(this.server, this.model, this.config).configure();
	}
}

module.exports = RouterLoader;