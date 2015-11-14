/* global Buffer, __dirname */

'use strict';

const TEMPLATE_PATH = `${__dirname}/../../web/index.html`;

var restify = require('restify'),
	fs = require('fs'),
	Handlebars = require('handlebars'),
	Router = require('./abstract.router');

class StaticRouter extends Router {

	configure () {
		this.compileTemplate();

		// This rout should go first
		this.bind(/\/($|\?.*|\#.*|index.html)/, this.indexRender);
		
		this.server.get(/\/?.*/, restify.serveStatic({
			directory: __dirname + '/../../web',
			default: 'index.html',
			maxAge: 1 // TODO: disable in production
		}));
	}
	
	compileTemplate () {
		this.template = Handlebars.compile(fs.readFileSync(TEMPLATE_PATH).toString());
	}

	indexRender (req, res) {
		if (this.config.debug.disableTemplateCaching) this.compileTemplate();
		
		var body = this.template(this.config);
		res.writeHead(200, {
			'Content-Length': Buffer.byteLength(body),
			'Content-Type': 'text/html'
		});
		res.write(body);
		res.end();
	}
}

module.exports = StaticRouter;
