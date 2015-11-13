'use strict';

const TEMPLATE_PATH = `${__dirname}/../../web/index.html`;

var restify = require('restify'),
	fs = require('fs'),
	Handlebars = require('handlebars'),
	Route = require('./abstract.route');

class StaticRoute extends Route {

	configure () {
		this.template = Handlebars.compile(fs.readFileSync(TEMPLATE_PATH).toString());

		this.server.get(/\/?.*/, restify.serveStatic({
			directory: __dirname + '/../../web',
			default: 'index.html',
			maxAge: 1 // TODO: disable in production
		}));

		this.bind(/(\/|index.html)/, this.indexRender);
	}

	indexRender (req, res, next) {
		var body = this.template(this.config);
		res.writeHead(200, {
			'Content-Length': Buffer.byteLength(body),
			'Content-Type': 'text/html'
		});
		Route.setCookie(res, 'test', 'pew')
		res.send(200, body);
	}

}

module.exports = StaticRoute;
