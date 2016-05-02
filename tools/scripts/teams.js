#!/usr/bin/env node

/**
 *
 * -c (path to config)
 *
 * ./teams.js -c config/default.json
 *
 */

const teams = [
	{name: '2ARC', image: '2arc.png'},
	{name: 'Astral Authority', image: 'astral_authority.png'},
	{name: 'COGnitive Gaming', image: 'cognitive.png'},
	{name: 'Cloud 9', image: 'cloud9.png'},
	{name: 'Gale Force eSports', image: 'galeforce.png'},
	{name: 'Panda Global', image: 'panda.png'},
	{name: 'Team Naventic', image: 'naventic.png'},
	{name: 'Tempo Storm', image: 'tempostorm.png'},
	{name: 'Elysium Gaming', image: 'elysium_gaming.png'},
	{name: 'Evil Murkies', image: 'evil_murkies.png'},
	{name: 'Fnatic', image: 'fnatic.png'},
	{name: 'mYinsanity', image: 'myi.png'},
	{name: 'Team Dignitas', image: 'dignitas.png'},
	{name: 'Team Liquid', image: 'liquid.png'},
	{name: 'The Sandwich Monkey', image: 'tsam.png'},
	{name: 'Virtus.pro', image: 'virtuspro.png'},
	{name: 'Murloc Geniuses', image: 'murloc_geniuses.png'},
	{name: 'Team DK KR', image: 'teamdk.png'},
	{name: 'Natus Vincere', image: 'navi.png'},
	{name: 'MVP Black', image: 'mvp.png'},
	{name: 'Mighty', image: 'mighty.png'},
	{name: 'RAVE HOTS', image: 'rave.png'},
	{name: 'Team Hero', image: 'team_hero.png'},
	{name: 'Team No Limit', image: 'tnl.png'},
	{name: 'Brave Heart', image: 'braveheart.png'},
	{name: 'EDward Gaming', image: 'edg.png'},
	{name: 'eStar Gaming', image: 'estar.png'},
	{name: 'Oh My God', image: 'omg.png'},
	{name: 'Star Club', image: 'star_club.png'},
	{name: 'TSD Team', image: 'tsd.png'},
	{name: 'Team YL', image: 'teamyl.png'},
	{name: 'X-Team', image: 'xteam.png'},
	{name: 'ZeroPanda', image: 'zero_gaming.png'},
	{name: 'GIA', image: 'gia.png'},
	{name: 'Big Gods', image: 'big_gods.png'},
	{name: 'Renovatio I', image: 'renovatio.png'},
	{name: 'Negative Synergy', image: 'negative_synergy.png'}
];


var path = require('path'),
	argv = require('yargs').argv,
	Database = require('../../server/core/database');

var configPath = path.join(process.cwd(), argv.c);

try {
	this.config = require(configPath);
}
catch (e) {
	return console.error(`Incorrect config path "${configPath}"`);
}

var db = new Database(this.config.database),
	models = db.loadModel();

var i = -1;
update();

function update () {
	i++;
	if (!teams[i]) return db.disconnect();
	models.Team.update({name: teams[i].name}, teams[i], {upsert: true})
		.then(() => {
			console.log(`Team updated: ${teams[i].name} #${i}`);
			update();
		})
		.catch(console.error);
}
