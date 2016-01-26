'use strict';

var Router = require('./abstract.router'),
	Constants = require('../constants'),
	RouteFactory = require('../core/route.factory');


class CasterRouter extends Router {

	configure () {
		/**
		 * @api {post} /api/caster Create Caster
		 * @apiName CreateCaster
		 * @apiGroup Caster
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
		this.bindPOST('/api/caster', RouteFactory.generateAddRoute(this.models.Caster), {
			auth: true,
			restrict: Constants.ROLES.USER
		});

		/**
		 * @api {delete} /api/caster/:id Delete Caster
		 * @apiName DeleteCaster
		 * @apiGroup Caster
		 * @apiPermission ADMIN
		 * @apiVersion 1.0.0
		 */
		this.bindDELETE('/api/caster/:id', RouteFactory.generateRemoveRoute(this.models.Caster), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});

		/**
		 * @api {get} /api/casters Get list of casters
		 * @apiName GetCasters
		 * @apiGroup Caster
		 * @apiVersion 1.0.0
		 */
		this.bindGET('/api/casters', RouteFactory.generateGetListRoute(this.models.Caster), {
			auth: true,
			restrict: Constants.ROLES.OPTIONAL
		});

		/**
		 * @api {put} /api/caster Update Caster
		 * @apiName UpdateCaster
		 * @apiGroup Caster
		 * @apiPermission ADMIN
		 * @apiVersion 1.0.0
		 *
		 * @apiParam {ObjectId} id Caster id
		 * @apiParam {Object} update Fields to update
		 */
		this.bindPUT('/api/caster', RouteFactory.generateUpdateRoute(this.models.Caster), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});
	}
}

module.exports = CasterRouter;
