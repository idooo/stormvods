var h = require('../api.helpers'),
	users = {
		user01: h.addUser('reportVideoUser', 2),
		user02: h.addUser('reportVideoUser', 2),
		admin01: h.addUser('reportVideoUser', 10)
	};

module.exports = {

	reportVideo: function (test) {
		var data = {
			youtubeId: 'repVideo000'
		};

		var res = h.post('/api/video', data, users.user01),
			res2 = h.post('/api/video/report', {id: res._id}, users.user01),
			res3 = h.get('/api/video/' + res._id, undefined, users.admin01);

		test.equal(res3.reports.length, 1);
		test.equal(res3.reports[0], users.user01._id);

		test.done();
	},

	reportVideoRequireAuth: function (test) {
		var data = {
			youtubeId: 'repVideo001'
		};

		var res = h.post('/api/video', data, users.user01),
			res2 = h.post('/api/video/report', {id: res._id}),
			res3 = h.get('/api/video/' + res._id, undefined, users.admin01);

		test.equal(res3.reports.length, 0);
		test.equal(res2.status, 'error');
		test.equal(res2.code, 403);
		test.equal(res2.message, 'AUTH_REQUIRED');

		test.done();
	},

	reportVideoTwice: function (test) {
		var data = {
			youtubeId: 'repVideo002'
		};

		var res = h.post('/api/video', data, users.user01),
			res2 = h.post('/api/video/report', {id: res._id}, users.user01),
			res3 = h.post('/api/video/report', {id: res._id}, users.user01),
			res4 = h.get('/api/video/' + res._id, undefined, users.admin01);

		test.equal(res4.reports.length, 1);
		test.equal(res3.message, 'VOTE_TWICE');
		test.equal(res3.status, 'error');

		test.done();
	},

	reportVideoMultiple: function (test) {
		var data = {
			youtubeId: 'repVideo003'
		};

		var res = h.post('/api/video', data, users.user01),
			res2 = h.post('/api/video/report', {id: res._id}, users.user01),
			res3 = h.post('/api/video/report', {id: res._id}, users.user02),
			res4 = h.get('/api/video/' + res._id, undefined, users.admin01);

		test.equal(res4.reports.length, 2);
		test.equal(res4.reports[0], users.user01._id);
		test.equal(res4.reports[1], users.user02._id);

		test.done();
	}
};
