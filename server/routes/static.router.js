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

		this.server.get(/.*\.(gif|png|css|js|jpg|eot|woff|ttf|woff2|svg)/, restify.serveStatic({
			directory: __dirname + '/../../web',
			maxAge: this.config.server.staticMaxAge
		}));

		this.bindGET(/^(?!\/api).*/, this.indexRender);
	}

	compileIndexTemplate () {
		this.template = Handlebars.compile(fs.readFileSync(`${TEMPLATES_PATH}/index.html`).toString(), {noEscape: true});
		logger.debug('index.html template compiled');
	}

	indexRender (req, res) {
		var data = {},
			cookies = req.cookies;

		if (cookies.token && cookies.username && cookies.role) {
			data.configurationString = `window.Auth = {
				username: '${cookies.username}', 
				token: '${cookies.token}',
				role: '${cookies.role}'
			};`;
		}

		if (this.config.debug.disableTemplateCaching) this.compileIndexTemplate();

		var body = this.template(data);
		res.writeHead(200, {
			'Content-Length': Buffer.byteLength(body),
			'Content-Type': 'text/html'
		});
		res.write(body);
		res.end();
	}
}

module.exports = StaticRouter;
