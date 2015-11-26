'use strict';

var Router = require('./abstract.router'),
	Constants = require('../constants'),
	RouteFactory = require('../core/route.factory');

class StageRouter extends Router {

	configure () {
		this.bindPOST('/api/stage', RouteFactory.generateAddRoute(this.models.Stage), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});
		this.bindDELETE('/api/stage/:id', RouteFactory.generateRemoveRoute(this.models.Stage), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});
	}
}

module.exports = StageRouter;
