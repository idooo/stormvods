'use strict';

var Router = require('./abstract.router'),
	Constants = require('../constants'),
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
