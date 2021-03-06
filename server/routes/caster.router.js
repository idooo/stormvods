'use strict';

var AbstractEntityRouter = require('./abstract.entity.router');

class CasterRouter extends AbstractEntityRouter {

	configure () {

		this.bindRoutes('caster', this.models.Caster, 'casters');

		/**
		 * @api {get} /api/casters Get list of casters
		 * @apiName GetCasters
		 * @apiGroup Caster
		 * @apiVersion 1.0.0
		 *
		 * @apiParam {Number} [page] 
		 * @apiParam {Object} [query] mongodb query (only for admins)
		 * @apiParam {Object} [sort] mongodb object (only for admins)
		 */

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
		 * @api {put} /api/caster Update Caster
		 * @apiName UpdateCaster
		 * @apiGroup Caster
		 * @apiPermission ADMIN
		 * @apiVersion 1.0.0
		 *
		 * @apiParam {ObjectId} id Caster id
		 * @apiParam {Object} update Fields to update
		 */

		/**
		 * @api {put} /api/caster/merge Merge Caster
		 * @apiName MergeCaster
		 * @apiGroup Caster
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
		 * @api {delete} /api/caster/:id Delete Caster
		 * @apiName DeleteCaster
		 * @apiGroup Caster
		 * @apiPermission ADMIN
		 * @apiVersion 1.0.0
		 *
		 * @apiDescription
		 * Remove entity permanently, search through all the videos
		 * and remove entity from there
		 */
	}
}

module.exports = CasterRouter;
