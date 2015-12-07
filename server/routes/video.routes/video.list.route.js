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
 * @apiParam {ObjectId} [tournament] tournament Id
 * @apiParam {ObjectId} [team] team Id
 * @apiParam {ObjectId} [caster] caster Id
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

const LIST_PAGE_SIZE = 10;

class VideoListRoute {

	constructor (viewMode) {
		this.viewMode = viewMode;
	}
	
	route (req, res, next) {

		// TODO: add users' votes
		// TODO: add usernames
		// TODO: pages

		var self = this,
			query = {},
			page = parseInt(req.params.p, 10) || 1,
			fields = '-isRemoved -__v',
			tournamentId = self.models.ObjectId(req.params.tournament),
			teamId = self.models.ObjectId(req.params.team),
			casterId = self.models.ObjectId(req.params.caster),
			videos,
			pageCount,
			itemCount;

		if (tournamentId) query = {'tournament.0._id': tournamentId};
		else if (teamId) query = {'teams.0.teams': teamId};
		else if (casterId) query = {'casters.0.casters': casterId};

		if (self.viewMode === Constants.VIEW_MODES.DEFAULT) query.isRemoved = {'$ne': true};
		else if (self.viewMode === Constants.VIEW_MODES.ONLY_REMOVED) query.isRemoved = {'$ne': false};

		self.models.Video.paginate(query, {
			page: page,
			limit: LIST_PAGE_SIZE,
			columns: fields
		})
			.spread(function (_videos, _pageCount, _itemCount) {
				var tournamentIds = [],
					teamIds = [],
					casterIds = [],
					promises = [];

				pageCount = _pageCount;
				itemCount = _itemCount;

				videos = _videos.map(function (video) {
					video = video.toObject(); // Convert because tournament is Array in scheme

					video.tournament = VideoListRoute.maxByRating(video.tournament);
					video.teams = VideoListRoute.maxByRating(video.teams);
					video.casters = VideoListRoute.maxByRating(video.casters);

					if (video.tournament) tournamentIds.push(video.tournament._id);
					if (video.teams) teamIds = teamIds.concat(video.teams.teams);
					if (video.casters) casterIds = casterIds.concat(video.casters.casters);

					return video;
				});

				promises.push(self.models.Tournament.getList({_id: {'$in': tournamentIds}}, 'name _id'));
				promises.push(self.models.Team.getList({_id: {'$in': teamIds}}, 'name _id'));
				promises.push(self.models.Caster.getList({_id: {'$in': casterIds}}, 'name _id'));

				return Promise.all(promises);
			})
			.then(function (data) {
				var lookup = {};
				_flatten(data).forEach(i => lookup[i._id] = i);

				for (let i = 0; i < videos.length; i++) {
					if (videos[i].tournament) videos[i].tournament = lookup[videos[i].tournament._id];
					if (videos[i].teams) videos[i].teams.teams = videos[i].teams.teams.map(item => lookup[item]);
					if (videos[i].casters) videos[i].casters.casters = videos[i].casters.casters.map(item => lookup[item]);
					if (videos[i].stage) videos[i].stage = videos[i].stage[0];
					if (videos[i].format) videos[i].format = videos[i].format[0];
				}

				Router.success(res, {videos, pageCount, itemCount});
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
}

module.exports = VideoListRoute;