'use strict';

/**
 * @api {get} /video/list Get the list of videos
 * @apiName GetVideoList
 * @apiGroup Video
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * Only one of filter params can be active at time
 *
 * @apiParam {Number} [p] page number
 * @apiParam {ObjectId} [tournament] tournament Id
 * @apiParam {ObjectId} [team] team Id
 * @apiParam {ObjectId} [caster] caster Id
 * @apiParam {Number} [maxResults=24] results per page (5..50)
 *
 * @apiParam {Object} [query] ADMIN ONLY: db query
 * @apiParam {Object} [sort] ADMIN ONLY: db sort
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
  "videos": [
    {
      "_id": "566e8e811f35829d4c78778e",
      "youtubeId": [
        "ooDCHGPKvoo"
      ],
      "author": {
        "name": "idonreddit",
        "_id": "564b00fe5d63f20f4444e4b6"
      },
      "format": {
        "rating": 1,
        "code": "BO3"
      },
      "stage": {
        "rating": 1,
        "code": "GROUP"
      },
      "teams": {
        "rating": 1,
        "teams": [
          {
            "_id": "566e8e801f35829d4c78778c",
            "name": "Natus Vincere"
          },
          {
            "_id": "566e8e801f35829d4c78778d",
            "name": "G2 Esports"
          }
        ]
      },
      "tournament": {
        "_id": "56639b2782f4f8973eef2b3a",
        "name": "DreamHack all stars",
        "date": "2015-12-00T09:40:17.135Z",
        "series": 'dh'
      },
      "casters": {
        "rating": 1,
        "casters": [
          {
            "_id": "56565f44c34514194cd1a2bd",
            "name": "Khaldor"
          }
        ]
      },
      "creationDate": "2015-12-14T09:40:17.135Z",
      "rating": 1,
      "isVoted": true
    },
    ...
  ],
  "pageCount": 1,
  "itemCount": 15,
  "currentPage": 1,
  "status": "ok"
}
 */

var _max = require('lodash/math/max'),
	_flatten = require('lodash/array/flatten'),
	Router = require('./../abstract.router'),
	Constants = require('../../constants');

const MAX_RESULTS = 50;
const MAX_RESULTS_DEFAULT = 24;
const MAX_RESULTS_MIN = 5;

class VideoListRoute {

	static route (req, res, next, auth) {

		var self = this,
			query = {isRemoved: {'$ne': true}},
			sort = {'_id': -1}, // sort by date, latest first by default
			page = parseInt(req.params.p, 10) || 1,
			maxResults = parseInt(req.params.maxResults, 10) || MAX_RESULTS_DEFAULT,
			fields = '-isRemoved -__v -reports',
			tournamentId = self.models.ObjectId(req.params.tournament),
			teamId = self.models.ObjectId(req.params.team),
			casterId = self.models.ObjectId(req.params.caster);

		if (tournamentId) query['tournament.0._id'] = tournamentId;
		else if (teamId) query['teams.0.teams'] = teamId;
		else if (casterId) query['casters.0.casters'] = casterId;

		if (maxResults > MAX_RESULTS) maxResults = MAX_RESULTS;
		else if (maxResults < MAX_RESULTS_MIN) maxResults = MAX_RESULTS_MIN;

		// Admin mode
		if (auth && auth.role >= Constants.ROLES.ADMIN) {
			query = req.params.query || query; // only for admins so do not care for now
			sort = req.params.sort || sort; // sort by date, latest first by default
			try {
				query = JSON.parse(query);
				sort = JSON.parse(sort);
			}
			catch (e) {
				// eslint-disable-line no-empty
			}
			fields = '-__v';
		}

		self.models.Video.paginate(query, {
			page: page,
			sort: sort, // sort by date, latest first
			limit: maxResults,
			select: fields
		})
			.then(function (data) {
				return VideoListRoute.mapReduce.call(self, data, auth);
			})
			.then(function (data) {
				Router.success(res, data);
				return next();
			})
			.catch(function (err) {
				Router.fail(res, err);
				return next();
			});

	}

	static maxByRating (items) {
		var max = _max(items, 'rating');
		if (typeof max === 'number') return undefined;
		return max;
	}

	/**
	 * Not a typical map-reduce here but just a nice name
	 * for a function that somehow reminds me about it
	 *
	 * Big function that gets list of videos from the database,
	 * and then creates multiple requests to DB to retrieve all info about
	 * tournaments, teams and etc based on ids stored in video records (map).
	 *
	 * After getting response, it formats all the data it received
	 * and returns as a promise (reduce)
	 *
	 * @param {Object} result
	 * @param {Object} auth
	 * @returns {Promise}
	 */
	static mapReduce (result, auth) {
		var self = this,
			videos = [],
			currentPage,
			pageCount,
			itemCount;

		return new Promise(function (resolve) {
			mapPromise(result)
				.then(reducePromise)
				.then(function (data) {
					resolve({videos: data, pageCount, itemCount, currentPage});
				});
		});

		function mapPromise (data) {
			var tournamentIds = [],
				teamIds = [],
				casterIds = [],
				userIds = [],
				promises = [],
				_tmp = data.docs ? data.docs : data; // support for paginate and findOne

			pageCount = data.pages;
			itemCount = data.total;
			currentPage = data.page;

			// Go through video data and get top entities and their ids
			videos = _tmp.map(function (video) {
				video = video.toObject(); // Convert because tournament is Array in scheme

				video.tournament = VideoListRoute.maxByRating(video.tournament);
				video.teams = VideoListRoute.maxByRating(video.teams);
				video.casters = VideoListRoute.maxByRating(video.casters);

				if (video.tournament) tournamentIds.push(video.tournament._id);
				if (video.teams) teamIds = teamIds.concat(video.teams.teams);
				if (video.casters) casterIds = casterIds.concat(video.casters.casters);
				userIds.push(video.author);

				return video;
			});

			// Create a list of promises to get entities from other collections
			promises.push(self.models.Tournament.find({_id: {'$in': tournamentIds}}, 'name _id date series'));
			promises.push(self.models.Team.find({_id: {'$in': teamIds}}, 'name _id image'));
			promises.push(self.models.Caster.find({_id: {'$in': casterIds}}, 'name _id'));
			promises.push(self.models.User.find({_id: {'$in': userIds}}, 'name _id'));

			if (auth && auth.id) promises.push(self.models.User.findOne({_id: auth.id}, 'name _id votes'));

			return Promise.all(promises);
		}

		function reducePromise (data) {

			return new Promise(function (resolve) {
				var lookup = {};
				_flatten(data).forEach(i => lookup[i._id] = i);

				// Populate video data using entities data resolved from other collections
				for (let i = 0; i < videos.length; i++) {
					if (videos[i].tournament) {
						videos[i].tournament.name = lookup[videos[i].tournament._id].name;
						videos[i].tournament._id = lookup[videos[i].tournament._id]._id;
						videos[i].tournament.date = lookup[videos[i].tournament._id].date;
						videos[i].tournament.series = lookup[videos[i].tournament._id].series;
					}
					if (videos[i].teams) videos[i].teams.teams = videos[i].teams.teams.map(item => lookup[item]);
					if (videos[i].casters) videos[i].casters.casters = videos[i].casters.casters.map(item => lookup[item]);
					if (videos[i].stage) videos[i].stage = videos[i].stage[0];
					if (videos[i].format) videos[i].format = videos[i].format[0];

					if (lookup[videos[i].author]) {
						videos[i].author = {
							name: lookup[videos[i].author].name,
							_id: lookup[videos[i].author]._id
						};
					}
					else {
						videos[i].author = {
							name: '[deleted]',
							_id: videos[i].author
						};
					}
				}

				if (auth && auth.id) {
					for (let i = 0; i < videos.length; i++) {
						videos[i].isVoted = lookup[auth.id].votes.video.indexOf(videos[i]._id.toString()) !== -1;
					}
				}

				resolve(videos);
			});
		}
	}
}

module.exports = VideoListRoute;
