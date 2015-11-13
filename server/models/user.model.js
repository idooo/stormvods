'use strict';

var mongoose = require('mongoose'),
	SchemaDefinition = require('./abstract.definition');

class User extends SchemaDefinition {

	constructor () {
		super();
		this.schema = new mongoose.Schema({
			name: {
				type: String,
				trim: true,
				required: true
			},
			redditInfo: {
				type: Object
			},
			creation_date: {
				type: Date,
				default: Date.now
			}
		});
		
	}
}

module.exports = User;
