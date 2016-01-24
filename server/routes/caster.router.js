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
		*/
		this.bindPOST('/api/caster', RouteFactory.generateAddRoute(this.models.Caster), {auth: true});

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
	}
}

module.exports = CasterRouter;
