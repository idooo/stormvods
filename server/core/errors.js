'use strict';

class GenericAPIError extends Error {

	constructor (message) {
		super(message);
		this.name = 'GenericAPIError';
		this.isApiError = true;
	}
}

module.exports = {
	GenericAPIError
};
