'use strict';

var mongoose = require('mongoose'),
	logger = require('winston'),
	SchemaDefinition = require('./schema.definition'),
	Video = require('./video.model'),
	Constants = require('../constants');
	
class User extends SchemaDefinition {

	constructor () {
		super();
		this.schema = new mongoose.Schema({
			name: {
				type: String,
				trim: true,
				required: true
			},
			role: {
				type: String,
				default: Constants.ROLES.USER
			},
			redditInfo: {
				type: Object
			},
			creationDate: {
				type: Date,
				default: Date.now
			},
			lastVoteTime: {
				type: Date,
				default: 0
			},
			lastCreateTime: {
				type: Date,
				default: 0
			},
			votes: {
				video: {
					type: Array,
					default: Array
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
				}
			}
		});

		this.schema.methods.vote = this.vote;
	}

	/**
	 * Schema method to vote for video or one of the entities
	 * NOTE: Here is no check that user already voted for entity - check it in route
	 */ 
	vote (video, entityType, entityId) {
		var self = this;
		
		// ENTITY_TYPES[0] = 'video'
		if (entityType === Constants.ENTITY_TYPES[0]) {
			video.rating++;
			entityId = video._id;
		}
		else {
			// Search for entity by _id in the array of entities and increase its rating
			var isFound = Video.matchEntity(video, entityType, entityId, entity => entity.rating++);
			
			if (!isFound) return Promise.reject({message: Constants.ERROR_WRONG_ENTITY_ID});
			
			// sort entities after vote, top rated will be always first
			video[entityType] = video[entityType].sort((a, b) => a.rating < b.rating);
			
			// mark model mongoose model as modified to save it
			video.markModified(entityType);
		}

		// update video rating (we do not care about the result)
		video.save(err => {
			if (err) logger.debug(`Saving vote for video "${video._id}" failed`, err);
		});

		self.lastVoteTime = Date.now();

		// Save video Id in the list of votes
        return new Promise(function (resolve, reject) {
			self.votes[entityType].push(video._id);
			self.save(function (err) {
				if (err) reject(err);
				else resolve();
			});
        });
	}

}

module.exports = User;
