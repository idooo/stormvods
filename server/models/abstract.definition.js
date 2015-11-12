'use strict';

class SchemaDefinition {
	constructor () {
		this.name = this.constructor.name;
	}
	configure () {
		this.schema.statics.getList = this.getList;
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
}

module.exports = SchemaDefinition;