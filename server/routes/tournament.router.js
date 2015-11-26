'use strict';

var logger = require('winston'),
	_omit = require('lodash/object/omit'),
	Router = require('./abstract.router'),
	Constants = require('../constants'),
	Tournament = require('../models/tournament.model'),
	RouteFactory = require('../core/route.factory');

class TournamentRouter extends Router {

	configure () {
		this.bindPOST('/api/tournament', RouteFactory.generateAddRoute(this.models.Tournament), {auth: true});
		this.bindDELETE('/api/tournament/:id', RouteFactory.generateRemoveRoute(this.models.Tournament), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});
	}
}

module.exports = TournamentRouter;
