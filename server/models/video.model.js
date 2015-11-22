'use strict';

var mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator'),
	SchemaDefinition = require('./abstract.definition'),
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

			caster: {
				type: Array,
				default: Array
			},

			tournament: {
				type: Array,
				default: Array
			},

			teams: {
				type: Array,
				default: Array
			},

			stage: {
				type: Array,
				default: Array
			},

			// TODO: Remove
			url: {
				type: String,
				trim: true
			}
		});

		this.schema.plugin(uniqueValidator, {message: Constants.ERROR_UNIQUE});
	}

	static constants () {
		return {YOUTUBE_ID_LENGTH: 11};
	}
}

module.exports = Video;
