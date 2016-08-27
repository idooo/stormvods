'use strict';

const STREAMS_UPDATE_INTERVAL = 5 * 60 * 1000;
const API_TIMEOUT = 5000;
const GAME_NAME = 'Heroes of the Storm';
const TWITCH_STREAMS_URL = 'https://api.twitch.tv/kraken/streams';
const STREAMS = [
	'DunkTrain',
	'mcintyrelol',
	'sc2fantv',
	'lunarn',
	'danatan',
	'dreamhackheroes',
	'michaeludall',
	'anzheroestv',
	'crisheroes',
	'esl_heroes',
	'gillyweedsc2',
	'arthelon',
	'breezhots',
	'tempest_hide',
	'blizzheroes',
	'smexystyle',
	'trikslyr',
	'ognglobal',
	'kaeyoh',
	'followgrubby',
	'solidjakegg',
	'khaldor',
	'kaelaris',
	'artosis'
];

var request = require('request'),
	logger = require('winston'),
	instance = null;

/** singleton */
class Twitch {

	constructor () {
		if (instance) return instance;
		instance = this; // eslint-disable-line consistent-this

		this.streams = [];
		this.lastUpdate = null;
		this.isUpdateInProgress = false;
		this.timer = null;
	}

	getStreams () {
		return this.streams;
	}

	getLastUpdate () {
		return this.lastUpdate;
	}

	start () {
		this.requestStreamsData();
		this.timer = setInterval(() => this.requestStreamsData(), STREAMS_UPDATE_INTERVAL);
	}

	requestStreamsData () {
		var self = this,
			streams = [],
			streamsUpdated = 0;

		if (this.isUpdateInProgress) {
			logger.info('Twitch update is already in progress');
			return;
		}

		STREAMS.forEach(streamName => {

			var options = {
				url: `${TWITCH_STREAMS_URL}/${streamName}`,
				headers: {
					'User-Agent': 'stormvods.com bot 1.0'
				},
				timeout: API_TIMEOUT
			};

			request.get(options, (err, httpResponse, body) => {
				if (err) {
					logger.warn(err);
					return callback(streams);
				}

				try {
					var data = JSON.parse(body);

					if (data.stream === null || data.stream.game !== GAME_NAME) {
						streams.push({
							name: streamName,
							isOnline: false
						});
						return callback(streams);
					}

					streams.push({
						name: streamName,
						isOnline: true,
						preview: data.stream.preview.medium,
						viewers: data.stream.viewers,
						logo: data.stream.channel.logo,
						displayName: data.stream.channel.display_name,
						status: data.stream.channel.status
					});
					callback(streams);
				}
				catch (ex) {
					logger.error(ex);
				}
			});

		});

		function callback (streams) {
			streamsUpdated++;
			if (streamsUpdated === STREAMS.length) {
				self.isUpdateInProgress = false;
				self.streams = streams;
				self.lastUpdate = new Date();
				logger.debug('Twitch streamers data has been updated');
			}
		}
	}
}

module.exports = Twitch;
