'use strict';

var logger = require('winston'),
	Router = require('./abstract.router'),
	Constants = require('../constants');

const API_VOTE_PATH = '/api/vote';
const UUID_LENGTH = 36;

class VoteRouter extends Router {

	configure () {

		/**
		* @api {post} /api/vote Vote for video or video's entity
		* @apiName Vote
		* @apiGroup Vote
		* @apiVersion 2.0.0
		*
		* @apiParam {ObjectId} videoId
		* @apiParam {String} uuid User UUID
		* @apiParam {String} [entityType] One of entity types: video, tournament, teams, stage, format, casters
		* @apiParam {ObjectId} [entityId] (or array of enitity IDs)
		*
		* @apiSuccessExample Success-Response:
		* HTTP/1.1 200 OK
		* {
		*     "status": "ok"
		* }
		*
		* @apiUse NOT_FOUND
		* @apiError VOTE_TWICE User cannot vote twice for the same entity
		* @apiError WRONG_TYPE Wrong entity type
		* @apiError TIME_RESTRICTION User can't vote too often
		*/
		this.bindPOST(API_VOTE_PATH, this.routeVote);
	}

	routeVote (req, res, next) {
		var self = this,
			entityType = req.params.entityType || Constants.ENTITY_TYPES[0], // video by default
			uuid = req.params.uuid,
			entityId,
			videoId,
			user;

		// Validate params
		videoId = this.models.ObjectId(req.params.videoId);
		if (!videoId) return Router.notFound(res, next, req.params.videoId);

		if (!uuid && uuid.length !== UUID_LENGTH) {
			logger.info('Wrong UUID during voting');
			Router.fail(res, {message: Constants.ERROR_INVALID}, 400);
			return next();
		}

		if (Constants.ENTITY_TYPES.indexOf(entityType) === -1) {
			logger.info(`${Constants.ERROR_TYPE} "${entityType}"`);
			Router.fail(res, {message: Constants.ERROR_TYPE}, 404);
			return next();
		}

		// if entity type 0 (video) then use video id
		if (entityType === Constants.ENTITY_TYPES[0]) entityId = videoId;
		else {
			// entityId can be string (just _id for tournament)
			// or an array (list of _ids for teams)
			if (typeof req.params.entityId === 'string') {
				entityId = Router.filter(req.params.entityId);

				// for entity types 'stage' and 'format' (and probably more later)
				// we expect codes instead of ids
				// validate that this is a correct code
				if (Constants.ENTITY_TYPES_CODE.indexOf(entityType) !== -1) {
					if (Constants.STAGE.indexOf(entityId) + Constants.FORMAT.indexOf(entityId) === -2) entityId = null;
				}
			}
			else if (Array.isArray(req.params.entityId)) entityId = req.params.entityId.map(Router.filter);

			if (!entityId) return Router.notFound(res, next, req.params.entityId);
		}

		// Main logic: searching for users,
		// checking can he vote and vote if everything is ok
		self.models.Votes.findOne({uuid: uuid}, 'votes lastVoteTime')
			.then(function (user) {
				if (!user) {
					return new self.models.Votes({uuid: uuid}).save();
				}
				return Promise.resolve(user);
			})
			.then(function (_user) {
				user = _user;
				var isAllowedByTime = user.lastVoteTime.getTime() <= Date.now() + (self.config.votes || {}).delayRestriction || 1000;
				if (!isAllowedByTime) return Promise.reject({message: Constants.ERROR_TIME_RESTRICTION});

				// Search through the list of already voted entities
				var isAllowedById = user.votes[entityType].indexOf(videoId) === -1;
				if (!isAllowedById) return Promise.reject({message: Constants.ERROR_VOTE_TWICE});

				return self.models.Video.findOne({_id: videoId});
			})
			.then(function (video) {
				return user.vote(video, entityType, entityId);
			})
			.then(function () {
				Router.success(res);
			})
			.catch(function (err) {
				Router.fail(res, err);
				return next();
			});
	}
}

module.exports = VoteRouter;
