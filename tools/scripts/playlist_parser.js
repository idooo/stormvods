#!/usr/bin/env node

/**
 * Script to normalize data from youtube playlist API
 * to import it later
 *
 * -d (path to playlist data folder)
 *
 * ./playlist_parser.js -d data/playlist/
 */

var fs = require('fs'),
	path = require('path'),
	argv = require('yargs').argv,
	files = fs.readdirSync(argv.d);

var data = [];

files
	.filter(filename => /\.json$/.test(filename))
	.forEach(filename => {
		var file = require(path.join(argv.d, filename));
		data = data.concat(file.items);
	});

data = data.map(item => {
	var date = new Date(item.snippet.publishedAt);
	date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2);

	var thing = {
		youtubeId: item.snippet.resourceId.videoId,
		date: date,
		format: '',
		originalDate: item.snippet.publishedAt,
		title: item.snippet.title,
		description: item.snippet.description,
	};

	var teams = thing.title
		.split(':')
		.filter(i => i.indexOf('vs.') !== -1);

	if (teams && teams.length > 0) {

		teams = teams[0]
			.split('-')
			.filter(i => i.indexOf('vs.') !== -1);

		if (teams && teams.length > 0) {
			teams = teams[0]
				.split('vs.')
				.filter(i => i.indexOf('vs.') === -1)
				.map(i => i.trim());
		}
	}
	thing.teams = teams;

	var tournament = thing.title.split('-');
	if (tournament && tournament.length > 0) {
		thing.tournament = tournament.pop();
	}

	var formatMatch = thing.title.match(/BO\d/i);
	if (formatMatch) thing.format = formatMatch[0].toUpperCase();

	return thing;
});

data.forEach(item => {
	var record = [];
	record.push(item.date);
	record.push(item.tournament);
	record.push(''); //stage
	record.push(item.format);
	if (item.teams.length === 2) {
		record.push(item.teams[0]);
		record.push(item.teams[1]);
	}
	else {
		record.push('');
		record.push('');
	}
	record.push('https://www.youtube.com/watch?v=' + item.youtubeId);
	record.push('Khaldor');

	record.push('');
	record.push(item.title);
	record.push(item.description.split('\n')[0]);

	console.log(record.map(i => i.trim()).join(','))
});

