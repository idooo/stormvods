require('newrelic');

var Server = require('./server/server');

var configName = `${__dirname}/config/default.json`;
if (process.env.config) configName = require('path').resolve(process.cwd(), process.env.config);

var server = new Server(configName);
server.start();

