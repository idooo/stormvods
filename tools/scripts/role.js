#!/usr/bin/env node

/**
 * Change user role value
 * 
 * -c (path to config) 
 * -u (username)
 * -r (role value 0..10)
 * 
 * ./role.js -c config/default.json -u idonreddit -r 10
 * 
 */

var path = require('path'),
	argv = require('yargs').argv,
	Database = require('../../server/core/database'),
	role;

if (!argv.c || !argv.u || !argv.r) {
	return console.error('-c, -u, -r arguments must be specified');
}

try {
	role = parseInt(argv.r, 10);
	if (role < 0 || role > 10) return console.error(`Role values is out of bound ${role}`)
}
catch (e) {
	return console.error(`Role value is not a number "${argv.r}"`)
}

var configPath = path.join(process.cwd(), argv.c);

try {
	this.config = require(configPath)
}
catch (e) {
	return console.error(`Incorrect config path "${configPath}"`)
}

var db = new Database(this.config.database),
	models = db.loadModel();
	
models.User.findOne({name: argv.u}, 'role')
	.then(function (user) {
		if (!user) return console.error('User not found', err)
		var oldRole = user.role;
		user.role = role;
		user.save(function (err, value) {
			if (err) console.error('Cannot save user to DB');
			else console.log(`User "${argv.u}" role set from "${oldRole}" to "${role}"`);
			db.disconnect();
		})
	})
	.catch(function (err) {
		console.error('Database error', err);
		db.disconnect();
	});