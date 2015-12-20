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
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
  "videos": [
    {
      "_id": "566e8e811f35829d4c78778e",
      "youtubeId": "ooDCHGPKvoo",
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
        "name": "Heroes Battle Arena"
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

/**
 * @api {get} /video/removed Get the list of removed videos
 * @apiName GetRemovedVideoList
 * @apiGroup Video
 * @apiPermission ADMIN
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * The same as /video/list but will return list of removed videos
 *
 * @apiParam {ObjectId} [tournament] tournament Id
 * @apiParam {ObjectId} [team] team Id
 * @apiParam {ObjectId} [caster] caster Id
 */

var _max = require('lodash/math/max'),
	_flatten = require('lodash/array/flatten'),
	Router = require('./../abstract.router'),
	Constants = require('../../constants');

const LIST_PAGE_SIZE = 20;

class VideoListRoute {

	constructor (viewMode) {
		this.viewMode = viewMode;
	}

	route (req, res, next, auth) {

		var self = this,
			query = {}, 
			page = parseInt(req.params.p, 10) || 1,
			fields = '-isRemoved -__v',
			tournamentId = self.models.ObjectId(req.params.tournament),
			teamId = self.models.ObjectId(req.params.team),
			casterId = self.models.ObjectId(req.params.caster);

		if (tournamentId) query['tournament.0._id'] = tournamentId;
		else if (teamId) query['teams.0.teams'] = teamId;
		else if (casterId) query['casters.0.casters'] = casterId;

		if (self.viewMode === Constants.VIEW_MODES.DEFAULT) query.isRemoved = {'$ne': true};
		else if (self.viewMode === Constants.VIEW_MODES.ONLY_REMOVED) query.isRemoved = {'$ne': false};

		self.models.Video.paginate(query, {
			page: page,
			sort: {'_id': -1}, // sort by date, latest first
			limit: LIST_PAGE_SIZE,
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
					resolve({videos: data, pageCount, itemCount, currentPage})
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

			promises.push(self.models.Tournament.getList({_id: {'$in': tournamentIds}}, 'name _id'));
			promises.push(self.models.Team.getList({_id: {'$in': teamIds}}, 'name _id'));
			promises.push(self.models.Caster.getList({_id: {'$in': casterIds}}, 'name _id'));
			promises.push(self.models.User.getList({_id: {'$in': userIds}}, 'name _id'));
			
			if (auth && auth.id) promises.push(self.models.User.findOne({_id: auth.id}, 'name _id votes'));

			return Promise.all(promises);
		}
		
		function reducePromise (data) {
			
			return new Promise(function (resolve) {
				var lookup = {};
				_flatten(data).forEach(i => lookup[i._id] = i);

				for (let i = 0; i < videos.length; i++) {
					if (videos[i].tournament) videos[i].tournament = lookup[videos[i].tournament._id];
					if (videos[i].teams) videos[i].teams.teams = videos[i].teams.teams.map(item => lookup[item]);
					if (videos[i].casters) videos[i].casters.casters = videos[i].casters.casters.map(item => lookup[item]);
					if (videos[i].stage) videos[i].stage = videos[i].stage[0];
					if (videos[i].format) videos[i].format = videos[i].format[0];
					videos[i].author = {
						name: lookup[videos[i].author].name,
						_id: lookup[videos[i].author]._id
					};
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
