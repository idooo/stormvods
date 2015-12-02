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
			}
			
			// TODO: watched
		});

		this.schema.methods.vote = this.vote;
	}

	vote (video, entityType, entityId) {
		
		// TODO: sort entities after vote
		
		var self = this;

		if (entityType === 'video') {
			video.rating++;
			entityId = video._id;
		}
		else {
			for (var i = 0; i < video[entityType].length; i++) {
				if (video[entityType][i]._id.equals(entityId)) video[entityType][i].rating++;
			}
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

			self.votes[entityType].push(entityId);

			self.save(function (err) {
				if (err) reject(err);
				else resolve();
			});
        });
	}

}

module.exports = User;
