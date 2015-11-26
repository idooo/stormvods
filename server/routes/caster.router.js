'use strict';

var logger = require('winston'),
	_omit = require('lodash/object/omit'),
	_pick = require('lodash/object/pick'),
	Router = require('./abstract.router'),
	Constants = require('../constants'),
	Caster = require('../models/caster.model'),
	RouteFactory = require('../core/route.factory');

class CasterRouter extends Router {

	configure () {
		this.bindPOST('/api/caster', RouteFactory.generateAddRoute(this.models.Caster), {auth: true});
		this.bindDELETE('/api/caster/:id', RouteFactory.generateRemoveRoute(this.models.Caster), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});
	}
}

module.exports = CasterRouter;
