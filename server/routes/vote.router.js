'use strict';

var logger = require('winston'),
	Router = require('./abstract.router'),
	Constants = require('../constants');

const API_VOTE_PATH = '/api/vote';
const TYPES = ['video', 'tournament', 'team', 'stage'];

class VoteRouter extends Router {

	configure () {
		this.bindPOST(API_VOTE_PATH, this.routeVote, {auth:true});
	}

	/**
	 * Body params:
	 * - videoId
	 * - entityType
	 * - entityId
	 */
	routeVote (req, res, next, auth) {
		var self = this,
			entityType = req.params.entityType || TYPES[0], // video by default
			entityId,
			videoId,
			user;

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

		self.models.User.findOne({name: auth.name}, 'votes lastVoteTime')
			.then(function (_user) {
				user = _user;
				var isAllowedByTime = user.lastVoteTime.getTime() <= Date.now() + self.config.votes.delayRestriction;
				if (!isAllowedByTime) return Promise.reject({message: Constants.ERROR_TIME_RESTRICTION});

				var isAllowedById = user.votes[entityType].indexOf(entityId) === -1;
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
