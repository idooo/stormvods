'use strict';

/**
 * @api {get} /video/:id Request video information
 * @apiName GetVideo
 * @apiGroup Video
 * @apiPermission USER
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * Get the video entity 
 * 
 * @apiParam {ObjectId} id video id
 * 
 * @apiSuccess {...} ... Many of them 
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "_id": "565c2776b200b02e8ea406c8",
 *     "youtubeId": "1AwlsNfxYok",
 *     "author": "564b00fe5d63f20f4444e4b6",
 *     "format": {
 *         "rating": 1,
 *         "code": "BO3"
 *     },
 *     "stage": {
 *         "rating": 1,
 *         "code": "GROUPA"
 *     },
 *     "teams": {
 *         "teams": [
 *             {
 *                 "_id": "565c2775b200b02e8ea406c5",
 *                 "name": "Tempo Storm"
 *             },
 *             {
 *                 "_id": "565c2775b200b02e8ea406c6",
 *                 "name": "Cloud 9"
 *             }
 *         ],
 *         "rating": 2
 *     },
 *     "tournament": {
 *         "_id": "565c2775b200b02e8ea406c4",
 *         "name": "World Championship 2015 Americas",
 *         "rating": 2
 *     },
 *     "casters": {
 *         "casters": [
 *             {
 *                 "_id": "56565f44c34514194cd1a2bd",
 *                 "name": "Khaldor"
 *             }
 *         ],
 *         "rating": 5
 *     },
 *     "creationDate": "2015-11-17T10:27:10.319Z",
 *     "rating": 2,
 *     "status": "ok"
 * }
 * 
 * @apiUse NOT_FOUND
 */

var _max = require('lodash/math/max'),
	Router = require('./../abstract.router'),
	Constants = require('../../constants');

class VideoGetRoute {

	/**
	 * Get video by {id}
	 */
	static route (req, res, next) {

		// TODO: add users' votes

		var self = this,
			id = self.models.ObjectId(req.params.id),
			promisesNames = [], // We need array to store promises order
			video;

		if (!id) return Router.notFound(res, next, req.params.id);

		self.models.Video.findOne({_id: id})
			.then(function (_video) {
				video = _video;
				if (video) {
					var topTournament = VideoGetRoute.maxByRating(video.tournament),
						topTeams = VideoGetRoute.maxByRating(video.teams),
						topCasters = VideoGetRoute.maxByRating(video.casters),
						promises = [];

					if (topTournament) {
						promises.push(self.models.Tournament.findOne({_id: topTournament._id}, 'name _id'));
						promisesNames.push(self.models.Tournament.modelName);
					}
					if (topTeams) {
						promises.push(self.models.Team.getList({_id: {'$in': topTeams.teams}}, 'name _id'));
						promisesNames.push(self.models.Team.modelName);
					}
					if (topCasters) {
						promises.push(self.models.Caster.getList({_id: {'$in': topCasters.casters}}, 'name _id'));
						promisesNames.push(self.models.Caster.modelName);
					}

					return Promise.all(promises);
				}
				else Router.fail(res, {message: Constants.ERROR_NOT_FOUND}, 404);
				return next();
			})
			.then(function (data) {
				var topStage = VideoGetRoute.maxByRating(video.stage),
					topFormat = VideoGetRoute.maxByRating(video.format);

				video = video.toObject(); // Convert because tournament is Array in scheme

				promisesNames.forEach(function (modelName, i) {
					if (!data[i] || Array.isArray(data[i] && !data[i].length)) return;

					switch (modelName) {
						case self.models.Tournament.modelName:
							video.tournament = {
								_id: data[i]._id,
								name: data[i].name,
								rating: video.tournament[0] ? video.tournament[0].rating : null
							};
							break;

						case self.models.Caster.modelName:
							video.casters = {
								casters: data[i],
								rating: video.casters[0] ? video.casters[0].rating : null
							};
							break;

						case self.models.Team.modelName:
							video.teams = {
								teams: data[i],
								rating: video.teams[0] ? video.teams[0].rating : null
							};
							break;
					}
				});

				if (topStage) video.stage = topStage;
				if (topFormat) video.format = topFormat;

				Router.success(res, video);
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

module.exports = VideoGetRoute;
