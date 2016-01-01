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
		var self = this,
			isFound = false;
		
		if (entityType === 'video') {
			video.rating++;
			entityId = video._id;
		}
		else {
			// Search for entity by _id in the array of entities and increase its rating
			for (let i = 0; i < video[entityType].length; i++) {
				
				/**
				 * 
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
						if (isArrayTheSame) video[entityType][i].rating++;
						isFound = isArrayTheSame;
					}
				}
				else {
					try {
						if (video[entityType][i]._id.equals(entityId)) {
							isFound = true;
							video[entityType][i].rating++;
						}
					}
					catch (e) { 
						//
					}
				}
			}
			
			if (!isFound) {
				return Promise.reject({message: Constants.ERROR_WRONG_ENTITY_ID});
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
			// Save video Id in the list of votes
			
			self.votes[entityType].push(video._id);

			self.save(function (err) {
				if (err) reject(err);
				else resolve();
			});
        });
	}

}

module.exports = User;
