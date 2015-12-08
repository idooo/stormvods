var h = require('../api.helpers');

module.exports = {

	getUrl: function (test) {
		var res = h.get('/api/auth/url');

		test.equal(res.state.length, 36); // uuid
		test.equal(res.url.slice(0, 5), 'https');
		test.ok(res.url.length > 100); // usually > 200

		test.done();
	}
};
