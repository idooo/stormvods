'use strict';

var Router = require('./abstract.router'),
	Constants = require('../constants'),
	RouteFactory = require('../core/route.factory');

class TeamRouter extends Router {

	configure () {
		/**
		 * @api {post} /api/team Create Team
		 * @apiName CreateTeam
		 * @apiGroup Team
		 * @apiPermission USER
		 * @apiVersion 1.0.0
		 *
		 * @apiParam {String} name
		 *
		 * @apiSuccessExample Success-Response:
		 * HTTP/1.1 200 OK
		 * {
		 *     _id: '56a723653ddc195f787e07c2',
		 *     name: 'exampleName',
		 *     status: 'ok'
		 * }
		 */
		this.bindPOST('/api/team', RouteFactory.generateAddRoute(this.models.Team), {
			auth: true,
			restrict: Constants.ROLES.USER
		});

		/**
		 * @api {delete} /api/team/:id Delete Team
		 * @apiName DeleteTeam
		 * @apiGroup Team
		 * @apiPermission ADMIN
		 * @apiVersion 1.0.0
		 */
		this.bindDELETE('/api/team/:id', RouteFactory.generateRemoveRoute(this.models.Team), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});

		/**
		 * @api {get} /api/teams Get list of teams
		 * @apiName GetTeams
		 * @apiGroup Team
		 * @apiVersion 1.0.0
		 */
		this.bindGET('/api/teams', RouteFactory.generateGetListRoute(this.models.Team), {
			auth: true,
			restrict: Constants.ROLES.OPTIONAL
		});

		/**
		 * @api {put} /api/team Update Team
		 * @apiName UpdateTeam
		 * @apiGroup Team
		 * @apiPermission ADMIN
		 * @apiVersion 1.0.0
		 *
		 * @apiParam {ObjectId} id Team id
		 * @apiParam {Object} update Fields to update
		 */
		this.bindPUT('/api/team', RouteFactory.generateUpdateRoute(this.models.Team), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});
	}
}

module.exports = TeamRouter;
