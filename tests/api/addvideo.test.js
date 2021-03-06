var h = require('../api.helpers'),
	users = {
		user01: h.addUser('addVideoUser', 5)
	};

module.exports = {

	addVideoSimple: function (test) {
		var data = {
			youtubeId: 'addVideo000',
			tournament: 'addVideo000 Tournament',
			teams: ['addVideo000 team1', 'addVideo000 team2']
		};

		var res = h.post('/api/video', data, users.user01),
			user = h.get('/api/users/me', undefined, users.user01);

		test.equal(res.youtubeId[0], 'addVideo000');

		// video automatically upvoted by author
		test.equal(res.rating, 1);

		test.done();
	},

	addVideoRequireTournament: function (test) {
		var data = {
			youtubeId: 'addVideo098',
			teams: ['addVideo098 team1', 'addVideo098 team2']
		};

		var res = h.post('/api/video', data, users.user01);

		test.equal(res.status, 'error');
		test.equal(res.code, 400);
		test.equal(res.message, 'REQUIRED');

		test.done();
	},

	addVideoRequireTeams: function (test) {
		var data = {
			youtubeId: 'addVideo097',
			tournament: 'addVideo097 Tournament'
		};

		var res = h.post('/api/video', data, users.user01);

		test.equal(res.status, 'error');
		test.equal(res.code, 400);
		test.equal(res.message, 'REQUIRED');

		test.done();
	},

	addVideoMultipleIds: function (test) {
		var data = {
			youtubeId: ['addVideo100', 'addVideo101', 'addVideo102'],
			tournament: 'addVideo100 Tournament',
			teams: ['addVideo100 team1', 'addVideo100 team2']
		};

		var res = h.post('/api/video', data, users.user01),
			user = h.get('/api/users/me', undefined, users.user01);

		test.equal(res.youtubeId[2], 'addVideo102');

		// video automatically upvoted by author
		test.equal(res.rating, 1);

		test.done();
	},

	addVideoReqAuth: function (test) {
		var data = {
			youtubeId: 'addVideo099',
			tournament: 'addVideo099 Tournament',
			teams: ['addVideo099 team1', 'addVideo099 team2']
		};

		var res = h.post('/api/video', data);

		test.equal(res.status, 'error');
		test.equal(res.code, 403);
		test.equal(res.message, 'AUTH_REQUIRED');

		test.done();
	},

	addVideoPreventSameId: function (test) {
		var data = {
			youtubeId: 'addVideo000',
			tournament: 'addVideo000 Tournament2',
			teams: ['addVideo000 team3', 'addVideo000 team4']
		};

		h.post('/api/video', data, users.user01);
		var	res = h.post('/api/video', data, users.user01);

		test.equal(res.status, 'error');
		test.equal(res.code, 400);
		test.equal(res.message, 'EXPECTED_UNIQUE_VALUE');

		test.done();
	},

	addVideoPreventSameIdMultipleIds: function (test) {
		h.post('/api/video', {
			youtubeId: ['addVideo200', 'addVideo201'],
			tournament: 'addVideo200 Tournament',
			teams: ['addVideo200 team1', 'addVideo200 team2']
		}, users.user01);

		var	res = h.post('/api/video', {
			youtubeId: ['addVideo202', 'addVideo201']
		}, users.user01);

		test.equal(res.status, 'error');
		test.equal(res.code, 400);
		test.equal(res.message, 'EXPECTED_UNIQUE_VALUE');

		test.done();
	},

	addVideoPreventSameIdMultipleIdsAmongItself: function (test) {
		var	res = h.post('/api/video', {
			youtubeId: ['addVideo210', 'addVideo211', 'addVideo210'],
			tournament: 'addVideo210 Tournament',
			teams: ['addVideo210 team1', 'addVideo210 team2']
		}, users.user01);

		test.equal(res.status, 'error');
		test.equal(res.code, 400);
		test.equal(res.message, 'EXPECTED_UNIQUE_VALUE');

		test.done();
	},

	addVideoLimitVideos: function (test) {
		var data = {
			youtubeId: [
				'addVideo300', 'addVideo301', 'addVideo302', 'addVideo303',
				'addVideo304', 'addVideo305', 'addVideo306', 'addVideo307'
			],
			tournament: 'addVideo300 Tournament',
			teams: ['addVideo300 team1', 'addVideo300 team2']
		};

		var	res = h.post('/api/video', data, users.user01);

		test.equal(res.status, 'error');
		test.equal(res.code, 400);
		test.equal(res.message.youtubeId, 'INVALID_VALUE');

		test.done();
	},

	addVideoInvalidId: function (test) {
		var data = {
			youtubeId: ['aaaa'],
			tournament: 'aaaa Tournament',
			teams: ['aaaa team1', 'aaaa team2']
		};

		var	res = h.post('/api/video', data, users.user01);

		test.equal(res.status, 'error');
		test.equal(res.code, 400);
		test.equal(res.message.youtubeId, 'INVALID_VALUE');

		test.done();
	},

	addVideoTournament: function (test) {
		var data = {
			youtubeId: 'addVideo001',
			tournament: 'addVideoSimpleTest001 Tournament',
			teams: ['addVideo001 team1', 'addVideo001 team2']
		};

		var res = h.post('/api/video', data, users.user01),
			res2 = h.get('/api/lookup/tournament?query=addVideoSimpleTest001', undefined, users.user01),
			user = h.get('/api/users/me', undefined, users.user01);

		test.equal(res.youtubeId[0], 'addVideo001');

		// should create Tournament and save an _id
		test.equal(res.youtubeId[0], 'addVideo001');
		test.equal(res.tournament[0]._id, res2.values[0]._id);
		test.equal(res2.values[0].name, 'addVideoSimpleTest001 Tournament');

		// tournament automatically upvoted by author
		test.equal(res.tournament[0].rating, 1);

		test.done();
	},

	addVideoTeams: function (test) {
		var data = {
			youtubeId: 'addVideo002',
			teams: ['Team Go)', 'Super Team Go) addVideoSimpleTest002'],
			tournament: 'addVideo002 Tournament'
		};

		var res = h.post('/api/video', data, users.user01),
			res2 = h.get('/api/lookup/team?query=Team Go)', undefined, users.user01),
			user = h.get('/api/users/me', undefined, users.user01);

		test.equal(res.youtubeId[0], 'addVideo002');

		// should create Teams and save ids
		test.equal(res2.values.length, 2);
		test.ok(res.teams[0].teams.indexOf(res2.values[0]._id) !== -1);
		test.ok(res.teams[0].teams.indexOf(res2.values[1]._id) !== -1);
		test.ok(data.teams.indexOf(res2.values[0].name) !== -1);
		test.ok(data.teams.indexOf(res2.values[1].name) !== -1);

		// teams automatically upvoted by author
		test.equal(res.teams[0].rating, 1);

		test.done();
	},

	addVideoCasters: function (test) {
		var data = {
			youtubeId: 'addVideo003',
			casters: ['addVideoSimpleTest003 Caster', 'addVideoSimpleTest003 Other Caster'],
			tournament: 'addVideo003 Tournament',
			teams: ['addVideo003 team1', 'addVideo003 team2']
		};

		var res = h.post('/api/video', data, users.user01),
			res2 = h.get('/api/lookup/caster?query=addVideoSimpleTest003', undefined, users.user01),
			user = h.get('/api/users/me', undefined, users.user01);

		test.equal(res.youtubeId[0], 'addVideo003');

		// should create Casters and save ids
		test.equal(res2.values.length, 2);
		test.ok(res.casters[0].casters.indexOf(res2.values[0]._id) !== -1);
		test.ok(res.casters[0].casters.indexOf(res2.values[1]._id) !== -1);
		test.ok(data.casters.indexOf(res2.values[0].name) !== -1);
		test.ok(data.casters.indexOf(res2.values[1].name) !== -1);

		// teams automatically upvoted by author
		test.equal(res.casters[0].rating, 1);

		test.done();
	},

	addVideoStage: function (test) {
		var data = {
			youtubeId: 'addVideo005',
			stage: 'FINAL',
			tournament: 'addVideo005 Tournament',
			teams: ['addVideo005 team1', 'addVideo005 team2']
		};

		var	res = h.post('/api/video', data, users.user01);

		test.equal(res.stage[0].code, 'FINAL');

		test.done();
	},

	addVideoFormat: function (test) {
		var data = {
			youtubeId: 'addVideo006',
			format: 'BO3',
			tournament: 'addVideo006 Tournament',
			teams: ['addVideo006 team1', 'addVideo006 team2']
		};

		var	res = h.post('/api/video', data, users.user01);

		test.equal(res.format[0].code, 'BO3');

		test.done();
	},

	addVideoWrongFormat: function (test) {
		var data = {
			youtubeId: 'addVideo007',
			format: 'BOO',
			tournament: 'addVideo007 Tournament',
			teams: ['addVideo007 team1', 'addVideo007 team2']
		};

		var	res = h.post('/api/video', data, users.user01);

		test.equal(res.format.length, 0);

		test.done();
	},

	addVideoWrongStage: function (test) {
		var data = {
			youtubeId: 'addVideo008',
			stage: 'FINALOOOO',
			tournament: 'addVideo008 Tournament',
			teams: ['addVideo008 team1', 'addVideo008 team2']
		};

		var	res = h.post('/api/video', data, users.user01);

		test.equal(res.stage.length, 0);

		test.done();
	},

	/**
	 * Test that system should not create new entities for tournaments/etc
	 * if they are already exist but use existing
	 */
	addVideoReuse: function (test) {
		var data = {
			youtubeId: 'addVideo004',
			tournament: 'addVideo004 Tournament',
			teams: ['Team addVideo004', 'Super addVideo004'],
			casters: ['addVideo004 Caster', 'addVideo004 Other Caster']
		};

		var res = h.post('/api/video', data, users.user01);

		data.youtubeId = 'AddVideo004'; // different youtube id

		var res2 = h.post('/api/video', data, users.user01);

		// ids for entities should be the same
		test.equal(res.tournament[0]._id, res2.tournament[0]._id);
		test.equal(res.teams[0].teams[0]._id, res2.teams[0].teams[0]._id);
		test.equal(res.teams[0].teams[1]._id, res2.teams[0].teams[1]._id);
		test.equal(res.casters[0].casters[0]._id, res2.casters[0].casters[0]._id);
		test.equal(res.casters[0].casters[1]._id, res2.casters[0].casters[1]._id);

		// We should not create entities with same names
		var res3 = h.get('/api/lookup/tournament?query=addVideo004', undefined, users.user01);
		test.equal(res3.values.length, 1);

		res3 = h.get('/api/lookup/team?query=addVideo004', undefined, users.user01);
		test.equal(res3.values.length, 2);

		res3 = h.get('/api/lookup/caster?query=addVideo004', undefined, users.user01);
		test.equal(res3.values.length, 2);

		test.done();
	}
};
