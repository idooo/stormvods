'use strict';

const TEMPLATES_PATH = `${__dirname}/../../web`;

var restify = require('restify'),
	fs = require('fs'),
	logger = require('winston'),
	Handlebars = require('handlebars'),
	Router = require('./abstract.router');

class StaticRouter extends Router {

	configure () {
		this.compileIndexTemplate();

		// This route should go first
		this.bindGET(/\/($|\?.*|\#.*|index.html)/, this.indexRender);

		this.server.get(/\/?.*/, restify.serveStatic({
			directory: __dirname + '/../../web',
			default: 'index.html',
			maxAge: this.config.server.staticMaxAge
		}));
	}

	compileIndexTemplate () {
		this.template = Handlebars.compile(fs.readFileSync(`${TEMPLATES_PATH}/index.html`).toString());
		logger.debug('index.html template compiled');
	}

	indexRender (req, res) {
		if (this.config.debug.disableTemplateCaching) this.compileIndexTemplate();

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
