'use strict';

var Router = require('./abstract.router'),
	Constants = require('../constants'),
	RouteFactory = require('../core/route.factory');

class TeamRouter extends Router {

	configure () {
		this.bindPOST('/api/team', RouteFactory.generateAddRoute(this.models.Team), {auth: true});
		this.bindDELETE('/api/team/:id', RouteFactory.generateRemoveRoute(this.models.Team), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});
	}
}

module.exports = TeamRouter;
