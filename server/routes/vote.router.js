'use strict';

var logger = require('winston'),
	Router = require('./abstract.router'),
	Constants = require('../constants');

const TYPES = ['video'];

class VoteRouter extends Router {

	configure () {
		this.bindPOST('/api/vote/:type/:id', this.routeVote, {auth:true});
	}

	routeVote (req, res, next, auth) {
		var self = this,
			entityType = req.params.type,
			entityId,
			user;

		if (TYPES.indexOf(entityType) === -1) {
			logger.info(`${Constants.ERROR_TYPE} "${entityType}"`);
			Router.fail(res, {message: Constants.ERROR_TYPE}, 404);
			return next();
		}

		entityId = this.models.ObjectId(res, next, req.params.id);

		self.models.User.findOne({name: auth.name}, 'votes lastVoteTime')
			.then(function (_user) {
				user = _user;
				var isAllowedByTime = user.lastVoteTime.getTime() <= Date.now() + self.config.votes.delayRestriction;
				if (!isAllowedByTime) return Promise.reject({message: Constants.ERROR_TIME_RESTRICTION});

				var isAllowedById = user.votes[entityType].indexOf(entityId) === -1;
				if (!isAllowedById) return Promise.reject({message: Constants.ERROR_VOTE_TWICE});

				// TODO: support other entities
				return self.models.Video.findOne({_id: entityId}, 'rating');
			})
			.then(function (entity) {
				return user.vote(entity);
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
