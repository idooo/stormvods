'use strict';

var mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator'),
	mongoosePaginate = require('mongoose-paginate'),
	BasicModel = require('./basic.model'),
	Constants = require('../constants');

class Tournament extends BasicModel {

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
			creationDate: {
				type: Date,
				default: Date.now
			},
			isRemoved: {
				type: Boolean,
				default: false
			},
			date: {
				type: Date,
				default: Date.now,
				index: true
			},
			series: {
				type: String
			},
			author: {
				type: mongoose.Schema.Types.ObjectId,
				required: true
			}
		});

		this.schema.plugin(uniqueValidator, {message: Constants.ERROR_UNIQUE});
		this.schema.plugin(mongoosePaginate);
		this.schema.statics.getOrCreate = this.getOrCreate;
	}
}

module.exports = Tournament;
