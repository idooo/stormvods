'use strict';

var mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator'),
	SchemaDefinition = require('./schema.definition'),
	Constants = require('../constants');

class BasicModel extends SchemaDefinition {

	constructor () {
		super();

		this.schema = new mongoose.Schema({
			name: {
				type: String,
				trim: true,
				unique: true,
				index: true,
				required: true,
				minlength: BasicModel.constants().MIN_LENGTH
			},
			isRemoved: {
				type: Boolean,
				default: false
			},
			author: {
				type: mongoose.Schema.Types.ObjectId,
				required: true
			}
		});

		this.schema.plugin(uniqueValidator, {message: Constants.ERROR_UNIQUE});
	}

	static constants () {
		return {MIN_LENGTH: 5};
	}
}

module.exports = BasicModel;
