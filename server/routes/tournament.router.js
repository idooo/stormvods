'use strict';

var Router = require('./abstract.router'),
	Constants = require('../constants'),
	RouteFactory = require('../core/route.factory');


class TournamentRouter extends Router {

	configure () {
		/**
		 * @api {post} /api/tournament Create Tournament
		 * @apiName CreateTournament
		 * @apiGroup Tournament
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
		this.bindPOST('/api/tournament', RouteFactory.generateAddRoute(this.models.Tournament), {
			auth: true,
			restrict: Constants.ROLES.USER
		});

		/**
		 * @api {delete} /api/tournament/:id Delete Tournament
		 * @apiName DeleteTournament
		 * @apiGroup Tournament
		 * @apiPermission ADMIN
		 * @apiVersion 1.0.0
		 */
		this.bindDELETE('/api/tournament/:id', RouteFactory.generateRemoveRoute(this.models.Tournament), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});

		/**
		 * @api {get} /api/tournaments Get list of tournaments
		 * @apiName GetTournaments
		 * @apiGroup Tournament
		 * @apiVersion 1.0.0
		 */
		this.bindGET('/api/tournaments', RouteFactory.generateGetListRoute(this.models.Tournament), {
			auth: true,
			restrict: Constants.ROLES.OPTIONAL
		});

		/**
		 * @api {put} /api/tournament Update Tournament
		 * @apiName UpdateTournament
		 * @apiGroup Tournament
		 * @apiPermission ADMIN
		 * @apiVersion 1.0.0
		 *
		 * @apiParam {ObjectId} id Tournament id
		 * @apiParam {Object} update Fields to update
		 */
		this.bindPUT('/api/tournament', RouteFactory.generateUpdateRoute(this.models.Tournament), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});
	}
}

module.exports = TournamentRouter;
