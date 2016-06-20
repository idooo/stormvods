'use strict';

var mongoose = require('mongoose'),
	logger = require('winston'),
	mongoosePaginate = require('mongoose-paginate'),
	AbstractModel = require('./abstract.model'),
	Video = require('./video.model'),
	Constants = require('../constants');

class User extends AbstractModel {

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
			lastCreateTime: {
				type: Date,
				default: 0
			},
			isRemoved: {
				type: Boolean,
				default: false
			},
			stats: {
				videosAdded: {
					type: Number,
					default: 0
				},
				videosUpdated: {
					type: Number,
					default: 0
				}
			}
		});

		this.schema.plugin(mongoosePaginate);
	}
}

module.exports = User;
