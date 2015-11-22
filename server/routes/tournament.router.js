'use strict';

var logger = require('winston'),
	_omit = require('lodash/object/omit'),
	Router = require('./abstract.router'),
	Constants = require('../constants'),
	Tournament = require('../models/tournament.model'),
	RouteFactory = require('../core/route.factory');

class TournamentRouter extends Router {

	configure () {
		this.bindPOST('/api/tournament', this.routeAddTournament, {auth: true});
		this.bindDELETE('/api/tournament/:id', RouteFactory.generateRemoveRoute(this.models.Tournament), {
			auth: true, 
			restrict: Constants.ROLES.ADMIN
		});
	}

	routeAddTournament (req, res, next, auth) {
		var self = this;

		// Validate params
		var name = TournamentRouter.filter(req.params.name);
		
		if (name < Tournament.constants().MIN_LENGTH) {
			Router.fail(res, {message: {'name': Constants.ERROR_INVALID}});
			return next();
		}

		var tournament = new self.models.Tournament({
			name, 
			author: auth.id
		});

		tournament.save(function (err, responseFromDB) {
			if (err) {
				logger.debug(_omit(err, 'stack'));
				Router.fail(res, err);
				return next();
			}
			else {
				Router.success(res, responseFromDB);
				return next();
			}
		});
	}
}

module.exports = TournamentRouter;
