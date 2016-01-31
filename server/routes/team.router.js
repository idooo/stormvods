'use strict';

var AbstractEntityRouter = require('./abstract.entity.router');

class TeamRouter extends AbstractEntityRouter {

	configure () {

		this.bindRoutes('team', this.models.Team, 'teams');

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

		/**
		 * @api {delete} /api/team/:id Delete Team
		 * @apiName DeleteTeam
		 * @apiGroup Team
		 * @apiPermission ADMIN
		 * @apiVersion 1.0.0
		 */

		/**
		 * @api {get} /api/teams Get list of teams
		 * @apiName GetTeams
		 * @apiGroup Team
		 * @apiVersion 1.0.0
		 */

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
	}
}

module.exports = TeamRouter;
