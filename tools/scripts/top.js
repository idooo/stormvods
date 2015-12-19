#!/usr/bin/env node

/**
 * Change user role value
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
}

const LIMIT = 20;

if (!argv.c) {
	return console.error('-c argument must be specified');
}

var configPath = path.join(process.cwd(), argv.c);

try {
	this.config = require(configPath)
}
catch (e) {
	return console.error(`Incorrect config path "${configPath}"`)
}

var db = new Database(this.config.database),
	models = db.loadModel(),
	promises = [];
	
console.log('Timeframes:');
console.log(tops);

Object.keys(tops).forEach(function (key) {
	var query = {isRemoved: false};
	if (tops[key] !== 0) query.creationDate = {'$gt': tops[key]}
	promises.push(models.Video.getList(query, '_id', {'rating': -1}, 20))
})

Promise.all(promises)
	.then(function (response) {
		var data = {
			creationDate: new Date()
		};
		
		for (var i = 0; i < response.length; i++) { 
			data[Object.keys(tops)[i]] = response[i];
		}
		
		console.log('Updated tops will be written to DB:');
		console.log(data);
		
		return models.Tops.updateOne({}, data, {upsert: true});
	})
	.then(function (response) {
		db.disconnect();
	})
	.catch(function (err) {
		console.error('Database error', err);
		db.disconnect();
	});
