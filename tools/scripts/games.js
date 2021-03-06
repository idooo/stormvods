#!/usr/bin/env node

/**
 * import data
 *
 * -c (path to config)
 * -f (filename for csv to import)
 * -u (authorization header)
 * -a (address eg http://localhost:8088
 *
 * ./games.js -c config/default.json -f data/games.csv -u ItZmZlZi00NTZhLTljYTQtMWM0NmMxNzM0NjRjY2E5Njc0Y -a http://localhost:8088
 *
 */

var path = require('path'),
	fs = require('fs'),
	argv = require('yargs').argv,
	parse = require('csv-parse'),
	request = require('sync-request');


if (!argv.f || !argv.u || !argv.a) {
	return console.error('-f, -u, -a arguments must be specified');
}

var configPath = path.join(argv.c);

try {
	this.config = require(configPath);
}
catch (e) {
	return console.error(`Incorrect config path "${configPath}"`);
}

var file = fs.readFileSync(argv.f);

parse(file, {delimiter: ','}, (err, output) => {
	console.log(err)
	var data = normaliseData(output),
		i = -1;

	insert();

	function insert () {
		i++;
		if (!data[i]) return;

		var res = addVideo(argv.u, data[i]);
		if (res.code > 300) {
			console.error(res);
		}
		else {
			console.log(`OK - ${i + 1}/${data.length} - ${data[i].youtubeId}`);
		}
		insert();
	}
});


function normaliseData (input) {
	input.shift();

	var data = [],
		tournament = '',
		date = '';

	input.forEach(item => {
		var record = {};
		if (!item.join('').trim()) return;

		if (item[0].trim()) date = item[0].trim();
		if (item[1].trim()) tournament = item[1].trim();

		if (date) {
			date = date.split('/');
			date = date[2] + '-' + ('0' + date[0]).slice(-2);
		}

		record.stage = item[2].trim();
		record.format = item[3].trim();
		record.tournament = tournament;
		record.date = date;
		record.teams = [item[4].trim(), item[5].trim()];
		record.youtubeId = item[6]
			.split('|')
			.filter(i => i.trim().length !== 0)
			.map(i => i.match(/watch\?v=(.+)/)[1].trim());

		record.casters = item
			.slice(7)
			.filter(i => i.trim().length !== 0)
			.map(i => i.trim());

		if (record.youtubeId.length) data.push(record);
	});

	return data;
}


function addVideo (header, params) {
	var options = {
			headers: {
				Authorization: header
			},
			json: params
		};

	options.headers['Content-Type'] = 'application/json';

	var res = request('POST', argv.a + '/api/video', options);
	if (res.statusCode === 200) {
		return JSON.parse(res.getBody().toString());
	}
	return JSON.parse(res.body.toString());
}
