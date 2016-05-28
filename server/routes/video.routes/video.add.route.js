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
 * @apiParam {String} date when tournament happened (format 'YYYY-MM')
 * @apiParam {String} format format
 * @apiParam {String} stage stage
 * @apiParam {String[]} teams
 * @apiParam {String[]} casters
 */

var _uniq = require('lodash/array/uniq'),
	logger = require('winston'),
	errors = require('../../core/errors'),
	Router = require('./../abstract.router'),
	Video = require('../../models/video.model'),
	TournamentRouter = require('./../tournament.router'),
	Constants = require('../../constants');

class VideoAddRoute {

	static route (req, res, next, auth) {
		var self = this,

			// Check params and sanitise them
			tournament = Router.filter(req.params.tournament),
			youtubeIds = [].concat(req.params.youtubeId),
			format = Router.filter(req.params.format),
			stage = Router.filter(req.params.stage),

			// Additional tournament data
			tournamentData = {
				date: Router.date(req.params.date) || new Date()
			},

			// Prepopulate some data
			videoObjectData = {
				youtubeId: youtubeIds,
				author: auth.id,
				rating: 1
			},

			// init structures we will need later
			promises = [],
			teams = [],
			casters = [],
			videoFromDB;

		if (!Video.validateYoutubeId(youtubeIds)) {
			Router.fail(res, {message: {youtubeId: Constants.ERROR_INVALID}});
			return next();
		}

		if (!TournamentRouter.isTournamentDateValid(tournamentData.date)) tournament.date = null;

		// Sanitise
		youtubeIds = youtubeIds.map(Router.filter);

		if (Constants.STAGE.indexOf(stage) === -1) stage = null;
		if (Constants.FORMAT.indexOf(format) === -1) format = null;

		// Validate youtube ids among each ither
		if (youtubeIds.length !== _uniq(youtubeIds).length) {
			Router.fail(res, {message: Constants.ERROR_UNIQUE}, 400);
			return next();
		}

		// Ability to disable video adding
		if ((self.config.actions || {}).addVideoDisabled) {
			Router.fail(res, {message: Constants.ERROR_DISABLED}, 400);
			return next();
		}

		self.models.User.findOne({name: auth.name}, 'lastCreateTime')
			.then(function (user) {
				var isAllowedByTime = user.lastCreateTime.getTime() <= Date.now() + (self.config.actions || {}).delayRestriction || 1000;
				if (!isAllowedByTime) return Promise.reject({message: Constants.ERROR_TIME_RESTRICTION});

				return self.models.Video.find({youtubeId: {'$in': youtubeIds}}, '_id');
			})
			.then(function (video) {
				if (video.length) throw new errors.GenericAPIError(Constants.ERROR_UNIQUE);

				if (Array.isArray(req.params.teams)) {
					teams = req.params.teams.map(teamName => Router.filter(teamName));
				}
				if (Array.isArray(req.params.casters)) {
					casters = req.params.casters.map(casterName => Router.filter(casterName));
				}

				if (!teams.length || !tournament) throw new errors.GenericAPIError(Constants.ERROR_REQUIRED);

				// Create getOrCreate promises to get entities from database by name
				// or create them if they are not exist
				promises.push(self.models.Tournament.getOrCreate(tournament, auth, tournamentData));
				teams.forEach(teamName => promises.push(self.models.Team.getOrCreate(teamName, auth)));
				casters.forEach(casterName => promises.push(self.models.Caster.getOrCreate(casterName, auth)));

				return Promise.all(promises);
			})
			.then(function (data) {
				if (stage) videoObjectData.stage = [{rating: 1, code: stage}];
				if (format) videoObjectData.format = [{rating: 1, code: format}];
				return VideoAddRoute.createVideoObject.call(self, videoObjectData, data);
			})
			.then(function (_videoFromDB) {
				var userUpdate = {};
				videoFromDB = _videoFromDB;

				// store user votes for video and entities
				userUpdate['votes.video'] = videoFromDB._id;
				Constants.ENTITY_TYPES.forEach(key => {
					if (videoFromDB[key] && videoFromDB[key].length) userUpdate[`votes.${key}`] = videoFromDB._id;
				});

				// Update user votes
				return self.models.User.update({_id: auth.id}, {
					$push: userUpdate,
					$inc: {'stats.videosAdded': 1}
				});
			})
			.then(function () {
				Router.success(res, videoFromDB);
				return next();
			})
			.catch(function (err) {
				if (!err.isApiError) {
					logger.error(err.stack);
					Router.fail(res, {message: Constants.ERROR_INTERNAL}, 500);
				}
				else Router.fail(res, {message: err.message}, 400);
				return next();
			});
	}

	/**
	 * Create new Video object using passed video data and populate it using data returned
	 * from promises (passed as `data` param)
	 *
	 * @param {Object} video Video data
	 * @param {Array<Object>} data Array of promises results
     */
	static createVideoObject (video, data) {
		var self = this,
			createdTeams = [],
			createdCasters = [];

		if (data) {
			data.forEach(function (resolvedPromise) {
				if (!resolvedPromise.value) return;
				switch (resolvedPromise.type) {
					case self.models.Tournament.modelName:
						video.tournament = [{
							rating: 1,
							_id: resolvedPromise.value._id
						}];
						break;

					case self.models.Caster.modelName:
						createdCasters.push(resolvedPromise.value._id);
						break;

					case self.models.Team.modelName:
						createdTeams.push(resolvedPromise.value._id);
						break;
				}
			});
		}

		if (createdTeams.length) {
			video.teams = [{
				rating: 1,
				teams: createdTeams
			}];
		}

		if (createdCasters.length) {
			video.casters = [{
				rating: 1,
				casters: createdCasters
			}];
		}

		return (new self.models.Video(video)).save();
	}

}



module.exports = VideoAddRoute;
