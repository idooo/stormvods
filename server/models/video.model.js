'use strict';

var mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator'),
	mongoosePaginate = require('mongoose-paginate'),
	AbstractModel = require('./abstract.model'),
	Constants = require('../constants');

class Video extends AbstractModel {

	constructor () {
		super();

		this.schema = new mongoose.Schema({
			name: {
				type: String,
				trim: true
			},
			youtubeId: {
				type: Array,
				index: true,
				required: true,
				validate: {
					validator: Video.validateYoutubeId,
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
			creationDate: {
				type: Date,
				default: Date.now
			},
			casters: {
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
			format: {
				type: Array,
				default: Array
			},
			reports: {
				type: Array,
				default: Array
			}
		});

		this.schema.plugin(uniqueValidator, {message: Constants.ERROR_UNIQUE});
		this.schema.plugin(mongoosePaginate);
	}

	static constants () {
		return {
			YOUTUBE_ID_LENGTH: 11,
			MAX_VIDEOS_IN_MATCH: 7
		};
	}

	/**
	 * @description
	 * Deep search in the video data trying to find full match for entity
	 *
	 * @param {Object} video
	 * @param {String} entityType
	 * @param {String} entityId _id of entity or array
	 * @param {Function} callback Sync callbcak function
	*/
	static matchEntity (video, entityType, entityId, callback) {
		var isFound = false,
			isCode = Constants.ENTITY_TYPES_CODE.indexOf(entityType) !== -1;

		// convert entity ids to a string
		if (!isCode) {
			if (Array.isArray(entityId)) entityId = entityId.map(e => e.toString());
			else entityId = entityId.toString();
		}

		for (let i = 0; i < video[entityType].length; i++) {

			/**
			* If entity ids is an array of _ids (casters, teams)
			* then go deeper and search inside that array
			*
			* eg user voted for teams AAA and BBB, _ids ['001...', '002...']
			* we have a structure in video entity with the arrays of arrays of teams like
			* teams: [
			* 	  {
			* 		teams: ['001...', '002...'],
			* 		rating: 1
			* 	  },
			* 	  {
			* 		teams: ['003...', '004...'],
			* 		rating: 1
			*    }
			* ]
			* so we will search for the full match of arrays
			*/
			if (Array.isArray(entityId) && Array.isArray(video[entityType][i][entityType])) {
				if (entityId.length === video[entityType][i][entityType].length) {
					let isArrayTheSame = true;
					for (let j = 0; j < video[entityType][i][entityType].length; j++) {
						isArrayTheSame = isArrayTheSame && entityId.indexOf(video[entityType][i][entityType][j].toString()) !== -1;
					}
					if (isArrayTheSame && typeof callback === 'function') callback(video[entityType][i]);
					isFound = isArrayTheSame;
				}
			}

			// special logic to search by code (not id)
			// for entities using code (stage, format and probably more later)
			else if (Constants.ENTITY_TYPES_CODE.indexOf(entityType) !== -1) {
				if (video[entityType][i].code === entityId) {
					isFound = true;
					if (typeof callback === 'function') callback(video[entityType][i]);
				}
			}

			// normal ids
			else {
				try {
					if (video[entityType][i]._id.equals(entityId)) {
						isFound = true;
						if (typeof callback === 'function') callback(video[entityType][i]);
					}
				}
				catch (e) {
					//
				}
			}
		}

		return isFound;
	}

	static validateYoutubeId (value) {
		if (!value || !value.length || value.length > Video.constants().MAX_VIDEOS_IN_MATCH) return false;
		for (let i = 0; i < value.length; i++) {
			if (value[i].toString().length !== Video.constants().YOUTUBE_ID_LENGTH) return false;
		}
		return true;
	}
}

module.exports = Video;
