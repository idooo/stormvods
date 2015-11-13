'use strict';

class SchemaDefinition {
	constructor () {
		this.name = this.constructor.name;
	}
	configure () {
		this.schema.statics.getList = this.getList;
		this.schema.statics.findOne = this.findOne;
	}
	/**
	* Generate the 'get collection' function with promises for scheme
	* @returns {Promise}
	*/
	getList (ids) {
		var self = this;
		return new Promise(function (resolve, reject) {
			var query = {};
			if (typeof ids !== 'undefined') query = {_id: {$in: ids}};
	
			query = self.where(query).select('-__v');
			query.find(function (err, objects) {
				if (objects) resolve(objects);
				else if (err) reject(err);
				else reject([]);
			});
		});
	}
	findOne (query, fields) {
		var self = this;
		
		if (!fields) fields = '-__v';
		
		return new Promise(function (resolve, reject) {
			query = self.where(query).select(fields);
			query.findOne(function (err, object) {
				if (err) reject(err);
				else resolve(object);
			});
		});
	}
}

module.exports = SchemaDefinition;