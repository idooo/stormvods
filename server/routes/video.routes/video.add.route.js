'use strict';

/**
 * @api {post} /video Create video
 * @apiName CreateVideo
 * @apiGroup Video
 * @apiPermission USER
 * @apiVersion 1.0.0
 *
 * @apiParam {String[]} youtubeId youtube Ids (max 7)
 * @apiParam {String} tournament tournament name
 * @apiParam {String} format format
 * @apiParam {String} stage stage
 * @apiParam {String[]} teams
 * @apiParam {String[]} casters
 */

var _uniq = require('lodash/array/uniq'),
	Router = require('./../abstract.router'),
	Video = require('../../models/video.model'),
	Constants = require('../../constants');

class VideoAddRoute {

	static route (req, res, next, auth) {
		var self = this;

		// Check params and sanitise them
		var promises = [],
			tournament = Router.filter(req.params.tournament),
			youtubeIds = [].concat(req.params.youtubeId),
			teams = [],
			casters = [],
			isEntityExist = {},
			format = Router.filter(req.params.format),
			stage = Router.filter(req.params.stage);

		if (!Video.validateYoutubeId(youtubeIds)) {
			Router.fail(res, {message: {youtubeId: Constants.ERROR_INVALID}});
			return next();
		}

		// Sanitise
		youtubeIds = youtubeIds.map(Router.filter);

		if (Constants.STAGE.indexOf(stage) === -1) stage = null;
		if (Constants.FORMAT.indexOf(format) === -1) format = null;

		// Validate youtube ids among each ither
		if (youtubeIds.length !== _uniq(youtubeIds).length) {
			Router.fail(res, {message: Constants.ERROR_UNIQUE}, 400);
			return next();
		}

		this.models.Video.getList({youtubeId: {'$in': youtubeIds}}, '_id')
			.then(function (video) {
				if (video.length) {
					Router.fail(res, {message: Constants.ERROR_UNIQUE}, 400);
					return next();
				}

				if (Array.isArray(req.params.teams)) {
					teams = req.params.teams.map(teamName => Router.filter(teamName));
				}
				if (Array.isArray(req.params.casters)) {
					casters = req.params.casters.map(casterName => Router.filter(casterName));
				}

				// Create getOrCreate promises
				promises.push(self.models.Tournament.getOrCreate(tournament, auth));
				teams.forEach(teamName => promises.push(self.models.Team.getOrCreate(teamName, auth)));
				casters.forEach(casterName => promises.push(self.models.Caster.getOrCreate(casterName, auth)));

				return Promise.all(promises);
			})
			.then(function (data) {

				var videoData = {
						youtubeId: youtubeIds,
						author: auth.id,
						rating: 1
					},
					createdTeams = [],
					createdCasters = [];

				data.forEach(function (resolvedPromise) {
					if (!resolvedPromise.value) return;
					switch (resolvedPromise.type) {
						case self.models.Tournament.modelName:
							videoData.tournament = [{
								rating: 1,
								_id: resolvedPromise.value._id
							}];
							isEntityExist.tournament = true;
							break;

						case self.models.Caster.modelName:
							createdCasters.push(resolvedPromise.value._id);
							isEntityExist.casters = true;
							break;

						case self.models.Team.modelName:
							createdTeams.push(resolvedPromise.value._id);
							isEntityExist.teams = true;
							break;
					}
				});

				if (createdTeams.length) {
					videoData.teams = [{
						rating: 1,
						teams: createdTeams
					}];
				}

				if (createdCasters.length) {
					videoData.casters = [{
						rating: 1,
						casters: createdCasters
					}];
				}

				if (stage) {
					videoData.stage = [{rating: 1, code: stage}];
					isEntityExist.stage = true;
				}
				if (format) {
					videoData.format = [{rating: 1, code: format}];
					isEntityExist.format = true;
				}

				var video = new self.models.Video(videoData);

				return video.save();
			})
			.then(function (videoFromDB) {
				var userUpdate = {};

				// store user votes for video and entities
				userUpdate['votes.video'] = videoFromDB._id;
				Constants.ENTITY_TYPES.forEach(key => {
					if (isEntityExist[key]) userUpdate[`votes.${key}`] = videoFromDB._id;
				});
				// Update user votes
				self.models.User.updateOne({_id: auth.id}, {
					$push: userUpdate,
					$inc: {'stats.videosAdded': 1}
				});

				Router.success(res, videoFromDB);
				return next();
			})
			.catch(function (err) {
				Router.fail(res, {message: err}, 500);
				return next();
			});

	}
}

module.exports = VideoAddRoute;
