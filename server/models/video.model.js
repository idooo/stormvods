'use strict';

var mongoose = require('mongoose'),
	SchemaDefinition = require('./abstract.definition');

class Video extends SchemaDefinition {

	constructor () {
		super();
		this.schema = new mongoose.Schema({
			name: {
				type: String,
				trim: true,
				required: true
			}
		});
		
	}
}

module.exports = Video;
