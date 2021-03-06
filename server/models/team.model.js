'use strict';

const MIN_LENGTH = 2;

var mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator'),
	mongoosePaginate = require('mongoose-paginate'),
	BasicModel = require('./basic.model'),
	Constants = require('../constants');

class Team extends BasicModel {

	constructor () {
		super();
		this.schema = new mongoose.Schema({
			name: {
				type: String,
				trim: true,
				unique: true,
				index: true,
				required: true,
				minlength: MIN_LENGTH
			},
			creationDate: {
				type: Date,
				default: Date.now
			},
			isRemoved: {
				type: Boolean,
				default: false
			},
			image: {
				type: String
			},
			masterleagueId: {
				type: String
			},
			website: {
				type: String
			},
			teamLiquidWikiUrl: {
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

module.exports = Team;
