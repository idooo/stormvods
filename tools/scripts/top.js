#!/usr/bin/env node

/**
 * Generate lists of top videos
 *
 * -c (path to config)
 *
 * ./role.js -c config/default.json
 *
 */

var path = require('path'),
	moment = require('moment'),
	argv = require('yargs').argv,
	Database = require('../../server/core/database');

var tops = {
	DAY1: moment().subtract(1, 'days').toDate(),
	DAY7: moment().subtract(7, 'days').toDate(),
	DAY30: moment().subtract(30, 'days').toDate(),
	ALLTIME: 0
};

if (!argv.c) {
	return console.error('-c argument must be specified');
}

var configPath = path.join(argv.c);

try {
	this.config = require(configPath);
}
catch (e) {
	return console.error(`Incorrect config path "${configPath}"`);
}

// Exit after 10 seconds if anything went wrong
setTimeout(() => process.exit(1), 10000);

var db = new Database(this.config.database),
	models = db.loadModel(),
	promises = [];

console.log('Timeframes:');
console.log(tops);

Object.keys(tops).forEach(function (key) {
	var query = {isRemoved: false};
	if (tops[key] !== 0) query.creationDate = {'$gt': tops[key]};
	promises.push(models.Video
		.find(query, '_id')
		.limit(20)
		.sort({rating: -1}));
});

var oldTops;

models.Tops.findOne({})
	.then(_oldTops => {
		oldTops = _oldTops;
		return Promise.all(promises);
	})
	.then(response => {
		var data = {
			creationDate: new Date()
		};

		for (var i = 0; i < response.length; i++) {
			if (response[i] && response[i].length > 0) {
				data[Object.keys(tops)[i]] = response[i].reverse();
			}
			else {
				console.log(`No new data for ${Object.keys(tops)[i]}`);
				try {
					data[Object.keys(tops)[i]] = oldTops[Object.keys(tops)[i]];
				}
				catch (e) {
					console.log(`No old data for ${Object.keys(tops)[i]}`);
				}
			}
		}

		console.log('Updated tops will be written to DB:');
		console.log(data);

		return models.Tops.update({}, data, {upsert: true});
	})
	.then(db.disconnect);
