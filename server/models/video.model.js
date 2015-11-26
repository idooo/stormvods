'use strict';

var mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator'),
	mongoosePaginate = require('mongoose-paginate'),
	SchemaDefinition = require('./schema.definition'),
	Constants = require('../constants');

class Video extends SchemaDefinition {

	constructor () {
		super();

		this.schema = new mongoose.Schema({
			name: {
				type: String,
				trim: true
			},
			youtubeId: {
				type: String,
				trim: true,
				unique: true,
				index: true,
				validate: {
					validator: (value) => value.toString().length === Video.constants().YOUTUBE_ID_LENGTH,
					message: Constants.ERROR_INVALID
				}
			},
			rating: {
				type: Number,
				default: 0
			},
			isRemoved: {
				type: Boolean,
				default: false
			},
			author: {
				type: mongoose.Schema.Types.ObjectId,
				required: true
			},

			// TODO: Multiple casters?
			caster: {
				type: Array,
				default: Array
			},

			tournament: {
				type: Array,
				default: Array
			},

			team: {
				type: Array,
				default: Array
			},

			stage: {
				type: Array,
				default: Array
			}
		});

		this.schema.plugin(uniqueValidator, {message: Constants.ERROR_UNIQUE});
		this.schema.plugin(mongoosePaginate);
	}

	static constants () {
		return {YOUTUBE_ID_LENGTH: 11};
	}
}

module.exports = Video;
