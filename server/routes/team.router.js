'use strict';

var logger = require('winston'),
	_omit = require('lodash/object/omit'),
	_pick = require('lodash/object/pick'),
	Router = require('./abstract.router'),
	Constants = require('../constants'),
	Team = require('../models/team.model'),
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
