/* global Buffer, __dirname */

'use strict';

const TEMPLATE_PATH = `${__dirname}/../../web/index.html`;

var restify = require('restify'),
	fs = require('fs'),
	Handlebars = require('handlebars'),
	Route = require('./abstract.route');

class StaticRoute extends Route {

	configure () {
		this.template = Handlebars.compile(fs.readFileSync(TEMPLATE_PATH).toString());

		// This rout should go first
		this.bind(/(\/|index.html)/, this.indexRender);
		
		this.server.get(/\/?.*/, restify.serveStatic({
			directory: __dirname + '/../../web',
			default: 'index.html',
			maxAge: 1 // TODO: disable in production
		}));

	}

	indexRender (req, res) {
		var body = this.template(this.config);
		res.setCookie('my-new-cookie', 'Hi There');
		res.writeHead(200, {
			'Content-Length': Buffer.byteLength(body),
			'Content-Type': 'text/html'
		});
		res.write(body);
		res.end();
	}
}

module.exports = StaticRoute;
