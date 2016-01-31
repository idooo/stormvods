'use strict';

var mongoose = require('mongoose'),
	AbstractModel = require('./abstract.model');

class Tops extends AbstractModel {

	constructor () {
		super();
		this.schema = new mongoose.Schema({
			DAY1: {
				type: Array,
				default: Array
			},
			DAY7: {
				type: Array,
				default: Array
			},
			DAY30: {
				type: Array,
				default: Array
			},
			ALLTIME: {
				type: Array,
				default: Array
			}
		});
	}
}

module.exports = Tops;
