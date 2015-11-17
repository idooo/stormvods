'use strict';

var logger = require('winston'),
	ObjectId = require('mongoose').Types.ObjectId,
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
			entityId;
		
		if (TYPES.indexOf(entityType) === -1) {
			logger.info(`${Constants.ERROR_TYPE} "${entityType}"`);
			Router.fail(res, {message: Constants.ERROR_TYPE}, 404);
			return next();
		}
		
		// TODO abstract - copy paste
		try {
			entityId = ObjectId(req.params.id); 
		}
		catch (e) {
			logger.info(`${Constants.NOT_FOUND_MESSAGE} "${req.params.id}"`);
			Router.fail(res, {message: Constants.NOT_FOUND_MESSAGE}, 404);
			return next();
		}
		
		self.models.User.findOne({name: auth.name}, 'votesVideos')
			.then(function (user) {
				Router.success(res, user);
				// return self.models.Video.findOne({_id: entityId}, 'votesVideos')
			})
			.catch(function (err) {
				Router.fail(res, err);
				return next();
			});
	}
}

module.exports = VoteRouter;
