'use strict';

var logger = require('winston');

class AbstractModel {

	constructor () {
		this.name = this.constructor.name;
		logger.debug('Schema has been loaded');
	}
}

module.exports = AbstractModel;
