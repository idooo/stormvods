'use strict';

var mongoose = require('mongoose'),
	SchemaDefinition = require('./abstract.definition'),
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

	vote (entity) {
		var self = this;

		// update video rating (we do not care about the result)
		entity.rating++;
		entity.save();

		self.lastVoteTime = Date.now();

        return new Promise(function (resolve, reject) {
			for (var i = 0; i < self.votes.video.length; i++) {
				if (entity._id.equals(self.votes.video[i])) reject({message: Constants.ERROR_VOTE_TWICE});
			}

			// TODO: support different entity types
			self.votes.video.push(entity._id);

			self.save(function (err) {
				if (err) reject(err);
				else resolve();
			});
        });
	}

}

module.exports = User;
