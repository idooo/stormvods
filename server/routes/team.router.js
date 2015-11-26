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
		this.bindPOST('/api/team', this.routeAddTeam, {auth: true});
		this.bindDELETE('/api/team/:id', RouteFactory.generateRemoveRoute(this.models.Team), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});
	}

	routeAddTeam (req, res, next, auth) {
		var self = this;

		// Validate params
		var name = TeamRouter.filter(req.params.name);

		if (name < Team.constants().MIN_LENGTH) {
			Router.fail(res, {message: {'name': Constants.ERROR_INVALID}});
			return next();
		}

		var tournament = new self.models.Team({
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

module.exports = TeamRouter;
