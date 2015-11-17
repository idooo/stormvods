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
				validate: {
					validator: (value) => value.toString().length === Video.constants().YOUTUBE_ID_LENGTH,
					message: Constants.ERROR_INVALID
				}
			},
			rating: {
				type: Number,
				default: 0
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
