'use strict';

var AbstractEntityRouter = require('./abstract.entity.router');

class CasterRouter extends AbstractEntityRouter {

	configure () {

		this.bindRoutes('caster', this.models.Caster, 'casters');

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

		/**
		 * @api {delete} /api/caster/:id Delete Caster
		 * @apiName DeleteCaster
		 * @apiGroup Caster
		 * @apiPermission ADMIN
		 * @apiVersion 1.0.0
		 */

		/**
		 * @api {get} /api/casters Get list of casters
		 * @apiName GetCasters
		 * @apiGroup Caster
		 * @apiVersion 1.0.0
		 */

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
	}
}

module.exports = CasterRouter;
