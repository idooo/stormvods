'use strict';

var mongoose = require('mongoose'),
	SchemaDefinition = require('./abstract.definition');

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
				trim: true
			},
			
			// TODO: Remove
			url: {
				type: String,
				trim: true
			}
		});
		
	}
}

module.exports = Video;
