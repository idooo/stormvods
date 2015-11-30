'use strict';

var mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator'),
	SchemaDefinition = require('./schema.definition'),
	logger = require('winston'),
	Constants = require('../constants');

class BasicModel extends SchemaDefinition {

	constructor () {
		super();

		this.schema = new mongoose.Schema({
			name: {
				type: String,
				trim: true,
				unique: true,
				index: true,
				required: true,
				minlength: BasicModel.constants().MIN_LENGTH
			},
			creationDate: {
				type: Date,
				default: Date.now	
			},
			isRemoved: {
				type: Boolean,
				default: false
			},
			author: {
				type: mongoose.Schema.Types.ObjectId,
				required: true
			}
		});

		this.schema.plugin(uniqueValidator, {message: Constants.ERROR_UNIQUE});
		this.schema.statics.getOrCreate = this.getOrCreate;
	}
	
	static constants () {
		return {MIN_LENGTH: 5};
	}
	
	getOrCreate (entityName, auth) {
		var self = this;
		return new Promise(function (resolve, reject) {
			
			if (!entityName) return resolve({value: null, type: self.modelName});

			self.findOne({name: entityName})
				.then(function (entity) {
					if (entity) return resolve({value: entity, type: self.modelName});
					
					try {
						entity = new self({
							name: entityName,
							author: auth.id
						});
					}
					catch (e) {
						logger.error(`getOrCreate failed for '${self.modelName}': ${e}`);
						return reject(Constants.ERROR_INTERNAL);
					}
					entity.save(function (err, entityFromDB) {
						if (err) return reject(err);
						resolve({value: entityFromDB, type: self.modelName});
					});

				});
		});
	}
}

module.exports = BasicModel;
