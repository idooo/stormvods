'use strict';

var logger = require('winston');

const DEFAULT_FIELDS = '-__v -isRemoved';

class SchemaDefinition {

	constructor () {
		this.name = this.constructor.name;
		logger.debug('Schema has been loaded');
	}

	configure () {
		this.schema.statics.getList = this.getList;
		this.schema.statics.findOne = this.findOne;
		this.schema.statics.removeOne = this.removeOne;
		this.schema.statics.updateOne = this.updateOne;

		this.schema.methods.markAsRemoved = this.markAsRemoved;
	}

	/**
	 * Promise-based function for getting list of objects from collection
	 * @param {Object} query
	 * @param {String} fields
	 * @return {Promise}
	 */
	getList (query, fields, sort, limit) {
		var self = this;

		fields = fields || DEFAULT_FIELDS;
		query = query || {};

		return new Promise(function (resolve, reject) {
			query = self.where(query).select(fields);
			
			if (sort) query.sort(sort);
			if (limit) query.limit(limit);
			
			query.find(function (err, objects) {
				if (objects) resolve(objects);
				else if (err) reject(err);
				else reject([]);
			});
		});
	}

	/**
	 * Promise-based function to get one object from collection
	 * @param {Object} query
	 * @param {String} fields
	 * @return {Promise}
	 */
	findOne (query, fields) {
		var self = this;

		fields = fields || DEFAULT_FIELDS;
		query = query || {};

		return new Promise(function (resolve, reject) {
			query = self.where(query).select(fields);
			query.findOne(function (err, object) {
				if (err) reject(err);
				else resolve(object);
			});
		});
	}

	/**
	 * Promise-based function to remove object from collection
	 * @param {Object} query
	 * @return {Promise}
	 */
	removeOne (query) {
		var self = this;

		query = query || {};

		return new Promise(function (resolve, reject) {
			self.remove(query, function (err) {
				if (err) reject(err);
				else resolve();
			});
		});
	}
	
	/**
	 * Promise-based function to update object in collection
	 * @param {Object} query
	 * @return {Promise}
	 */
	updateOne (query, update, options) {
		var self = this;

		query = query || {};
		options = options || {};

		return new Promise(function (resolve, reject) {
			self.findOneAndUpdate(query, update, options, function (err, a) {
				if (err) reject(err);
				else resolve();
			});
		});
	}
	
	/**
	 * Promise-based function mark object as removed
	 * Note: applied to model but not for schema
	 * @return {Promise}
	 */
	markAsRemoved () {
		var self = this;
		return new Promise(function (resolve, reject) {
			self.isRemoved = true;

			self.save(function (err) {
				if (err) reject(err);
				else resolve();
			});
		});
	}
	
	
}

module.exports = SchemaDefinition;
