'use strict';

var Router = require('./abstract.router'),
	Twitch = require('../core/twitch');

const TWITCH_STATUS_PATH = '/api/twitch/streamers';

class TwitchRouter extends Router {

	configure () {

		this.twitch = new Twitch();

		/**
		* @api {get} /api/twitch/streamers Get list of selected streamers from Twitch
		* @apiName Twitch streamers statuses
		* @apiGroup Twitch
		* @apiPermission USER
		* @apiVersion 1.0.0
		*
		* @apiSuccessExample Success-Response:
		* HTTP/1.1 200 OK
		* {
		* 	"streamers": [
		*		{
		*			"name": "chu8",
		*			"isOnline": true,
		*			"preview": "https://static-cdn.jtvnw.net/previews-ttv/live_user_chu8-320x180.jpg",
		*			"viewers": 1531,
		*			"logo": "https://static-cdn.jtvnw.net/jtv_user_pictures/chu8-profile_image-49483ecd69c10041-300x300.png",
		*			"displayName": "chu8",
		*			"status": "chu8 : RIP SLEEP SCHEDULE : PTR Grandmaster Climb : Twitter @chustreaming"
		*		},
		*		{
		*			"name": "DunkTrain",
		*			"isOnline": false
		*		},
		*		...
		*	],
		*	"lastUpdate": "2016-06-11T09:43:18.373Z",
		*	"status": "ok"
		* }
		*/
		this.bindGET(TWITCH_STATUS_PATH, this.routeStreamersData);
	}

	routeStreamersData (req, res) {
		return Router.success(res, {
			streamers: this.twitch.getStreams().sort(sortByViewers),
			lastUpdate: this.twitch.getLastUpdate()
		});

		function sortByViewers (a, b) {
			return (b.viewers || 0) - (a.viewers || 0);
		}
	}
}

module.exports = TwitchRouter;
