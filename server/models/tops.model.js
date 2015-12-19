'use strict';

var mongoose = require('mongoose'),
	SchemaDefinition = require('./schema.definition');

class Tops extends SchemaDefinition {

	constructor () {
		super();
		this.schema = new mongoose.Schema({
			DAY1: {
				type: Array,
				default: Array
			},
			DAY7: {
				type: Array,
				default: Array
			},
			DAY30: {
				type: Array,
				default: Array
			}
		});

	}

}

module.exports = Tops;
