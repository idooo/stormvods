'use strict';

var logger = require('winston'),
	Router = require('./abstract.router'),
	Constants = require('../constants');

const API_VOTE_PATH = '/api/vote';
const TYPES = ['video', 'tournament', 'teams', 'stage', 'format', 'casters'];

class VoteRouter extends Router {

	configure () {
			
		/**
		* @api {post} /api/vote Vote for video or video's entity
		* @apiName Vote
		* @apiGroup Vote
		* @apiPermission USER
		* @apiVersion 1.0.0
		*
		* @apiParam {ObjectId} videoId
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
		this.bindPOST(API_VOTE_PATH, this.routeVote, {auth:true});
	}
	
	routeVote (req, res, next, auth) {
		var self = this,
			entityType = req.params.entityType || TYPES[0], // video by default
			entityId,
			videoId,
			user;
			
		// TODO: allow user to votes for teams and check it correctly

		// Validate params
		videoId = this.models.ObjectId(req.params.videoId);
		if (!videoId) return Router.notFound(res, next, req.params.videoId);

		if (TYPES.indexOf(entityType) === -1) {
			logger.info(`${Constants.ERROR_TYPE} "${entityType}"`);
			Router.fail(res, {message: Constants.ERROR_TYPE}, 404);
			return next();
		}

		if (entityType === TYPES[0]) entityId = videoId;
		else {
			entityId = this.models.ObjectId(req.params.entityId);
			if (!entityId) return Router.notFound(res, next, req.params.entityId);
		}
		
		// Main logic: searching for users, 
		// checking can he vote and vote if everything is ok
		self.models.User.findOne({name: auth.name}, 'votes lastVoteTime')
			.then(function (_user) {
				user = _user;
				var isAllowedByTime = user.lastVoteTime.getTime() <= Date.now() + self.config.votes.delayRestriction;
				if (!isAllowedByTime) return Promise.reject({message: Constants.ERROR_TIME_RESTRICTION});

				var isAllowedById = false;
				
				// If type is video than search by id
				if (entityType === TYPES[0]) {
					isAllowedById = user.votes[entityType].indexOf(entityId) === -1;
				}
				// else search by combinedId = videoId + entityId
				else {
					isAllowedById = user.votes[entityType].indexOf(videoId + entityId) === -1;
				}
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
