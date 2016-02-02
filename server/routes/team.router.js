'use strict';

var AbstractEntityRouter = require('./abstract.entity.router');

class TeamRouter extends AbstractEntityRouter {

	configure () {

		this.bindRoutes('team', this.models.Team, 'teams');

		/**
		 * @api {get} /api/teams Get list of teams
		 * @apiName GetTeams
		 * @apiGroup Team
		 * @apiVersion 1.0.0
		 */

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
		 * @api {put} /api/team Update Team
		 * @apiName UpdateTeam
		 * @apiGroup Team
		 * @apiPermission ADMIN
		 * @apiVersion 1.0.0
		 *
		 * @apiParam {ObjectId} id Team id
		 * @apiParam {Object} update Fields to update
		 */

		/**
		 * @api {put} /api/team/merge Merge Team
		 * @apiName MergeTeam
		 * @apiGroup Team
		 * @apiPermission ADMIN
		 * @apiVersion 1.0.0
		 *
		 * @apiDescription
		 * Merge SOURCE entity into TARGET entity. System goes over
		 * all videos and replace SOURCE id by TARGET id. Deletes SOURCE entity
		 * permanently
		 *
		 * @apiParam {ObjectId} src Source entity id
		 * @apiParam {ObjectId} target Target entity id
		 */

		/**
		 * @api {delete} /api/team/:id Delete Team
		 * @apiName DeleteTeam
		 * @apiGroup Team
		 * @apiPermission ADMIN
		 * @apiVersion 1.0.0
		 *
		 * @apiDescription
		 * Remove entity permanently, search through all the videos
		 * and remove entity from there
		 */
	}
}

module.exports = TeamRouter;
