'use strict';

var mongoose = require('mongoose'),
	logger = require('winston'),
	SchemaDefinition = require('./schema.definition'),
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
				}
			}
		});

		this.schema.methods.vote = this.vote;
	}

	/**
	 * Schema method to vote for video or one of the entities
	 */ 
	vote (video, entityType, entityId) {
		var self = this;

		if (entityType === 'video') {
			video.rating++;
			entityId = video._id;
		}
		else {
			// Search for entity by _id in the array of entities and increase its rating
			for (let i = 0; i < video[entityType].length; i++) {
				
				// If entity is array of _ids (casters, teams)
				// then go deeper and search inside that array
				
				// TODO: Check all IDS in arry, not the only one
				if (Array.isArray(video[entityType][i][entityType])) {
					for (let j = 0; j < video[entityType][i][entityType].length; j++) {
						if (video[entityType][i][entityType][j].equals(entityId)) {
							video[entityType][i].rating++;
						}
					}
				}
				else if (video[entityType][i]._id.equals(entityId)) video[entityType][i].rating++;
			}
			
			// sort entities after vote, top rated will be always first
			video[entityType] = video[entityType].sort((a, b) => a.rating < b.rating);
			
			// mark model mongoose model as modified to save it
			video.markModified(entityType);
		}

		// update video rating (we do not care about the result)
		video.save((err) => {
			if (err) logger.debug(`Saving vote for video "${video._id}" failed`, err);
		});

		self.lastVoteTime = Date.now();

        return new Promise(function (resolve, reject) {
			for (var i = 0; i < self.votes[entityType].length; i++) {
				if (entityId.equals(self.votes[entityType][i])) reject({message: Constants.ERROR_VOTE_TWICE});
			}

			// Save only video Id
			if (entityType === 'video') self.votes[entityType].push(entityId);
			
			// or combined id
			else self.votes[entityType].push(video._id + entityId);

			self.save(function (err) {
				if (err) reject(err);
				else resolve();
			});
        });
	}

}

module.exports = User;
