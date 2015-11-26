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
		this.bindPOST('/api/caster', this.routeAddCaster, {auth: true});
		this.bindDELETE('/api/caster/:id', RouteFactory.generateRemoveRoute(this.models.Caster), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});
	}

	routeAddCaster (req, res, next, auth) {
		var self = this;

		// Validate params
		var name = CasterRouter.filter(req.params.name);

		if (name < Caster.constants().MIN_LENGTH) {
			Router.fail(res, {message: {'name': Constants.ERROR_INVALID}});
			return next();
		}

		var tournament = new self.models.Caster({
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
				Router.success(res, _pick(responseFromDB, ['_id', 'name']));
				return next();
			}
		});
	}
}

module.exports = CasterRouter;
