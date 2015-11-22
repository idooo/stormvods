'use strict';

var logger = require('winston');

class SchemaDefinition {
	
	constructor () {
		this.name = this.constructor.name;
		logger.debug('Schema has been loaded');
	}
	
	configure () {
		this.schema.statics.getList = this.getList;
		this.schema.statics.findOne = this.findOne;
		this.schema.statics.removeOne = this.removeOne;
		
		this.schema.methods.markAsRemoved = this.markAsRemoved;
	}
	
	/**
	* Generate the 'get collection' function with promises for scheme
	* @returns {Promise}
	*/
	getList (query, fields) {
		var self = this;
		
		fields = fields || '-__v';
		query = query || {};
		
		return new Promise(function (resolve, reject) {
			query = self.where(query).select(fields);
			query.find(function (err, objects) {
				if (objects) resolve(objects);
				else if (err) reject(err);
				else reject([]);
			});
		});
	}
	
	findOne (query, fields) {
		var self = this;
		
		fields = fields || '-__v';
		query = query || {};
		
		return new Promise(function (resolve, reject) {
			query = self.where(query).select(fields);
			query.findOne(function (err, object) {
				if (err) reject(err);
				else resolve(object);
			});
		});
	}
	
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