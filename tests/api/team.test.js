var h = require('../api.helpers'),
	users = {
		user01: h.addUser('teamUser1', 2),
		user02: h.addUser('teamUser2', 2),
		user03: h.addUser('teamUser3', 2),
		admin: h.addUser('teamAdmin', 10)
	};

module.exports = {

	createTeam: function (test) {
		var res = h.post('/api/team', {name: 'addTeamTest1'}, users.user01),
			res2 = h.get('/api/lookup/team?query=addTeamTest1', undefined, users.user01);

		test.equal(res.status, 'ok');
		test.equal(res2.values[0].name, 'addTeamTest1');

		test.done();
	},

	createTeamUnique: function (test) {
		var res = h.post('/api/team', {name: 'addTeamTest2'}, users.user01),
			res2 = h.post('/api/team', {name: 'addTeamTest2'}, users.user02),
			res3 = h.get('/api/lookup/team?query=addTeamTest1', undefined, users.user01);

		test.equal(res2.status, 'error');
		test.equal(res2.message.name, 'EXPECTED_UNIQUE_VALUE');
		test.equal(res3.values.length, 1);

		test.done();
	},

	createGetList: function (test) {
		var res = h.post('/api/team', {name: 'addTeamTest30'}, users.user01),
			res2 = h.post('/api/team', {name: 'addTeamTest31'}, users.user02),
			res3 = h.get('/api/teams', undefined, users.user01);

		test.ok(res3.items.length >= 2);
		test.ok(res3.items[0]._id);
		test.ok(res3.items[0].name);
		test.equal(res3.currentPage, 1);

		test.done();
	},

	renameTeam: function (test) {
		var res = h.post('/api/team', {name: 'addTeamTest4'}, users.user01),
			res2 = h.put('/api/team', {update: {name: 'addTeamTestChanged4'}, id: res._id}, users.admin),
			res3 = h.get('/api/lookup/team?query=addTeamTest4', undefined, users.user01),
			res4 = h.get('/api/lookup/team?query=addTeamTestChanged4', undefined, users.user01);

		test.equal(res3.values.length, 0);
		test.equal(res4.values.length, 1);
		test.equal(res4.values[0].name, 'addTeamTestChanged4');

		test.done();
	},

	renameTeamRequireAuth: function (test) {
		var res = h.post('/api/team', {name: 'addTeamTest5'}, users.user01),
			res2 = h.put('/api/team', {update: {name: 'addTeamTestChanged5'}, id: res._id}, users.user01),
			res3 = h.get('/api/lookup/team?query=addTeamTest5', undefined, users.user01),
			res4 = h.get('/api/lookup/team?query=addTeamTestChanged5', undefined, users.user01);

		test.equal(res2.status, 'error');
		test.equal(res2.message, 'ACCESS_DENIED');
		test.equal(res3.values.length, 1);
		test.equal(res4.values.length, 0);
		test.equal(res3.values[0].name, 'addTeamTest5');

		test.done();
	},

	deleteTeam: function (test) {

		var videos = [
			{
				youtubeId: 'teaVideo000',
				teams: ['Team Test 001', 'Team Test 002'],
				tournament: 'teaVideo000 Tournament'
			},
			{
				youtubeId: 'teaVideo100',
				teams: ['Team Test 101', 'Team Test 102'],
				tournament: 'teaVideo000 Tournament'
			},
			{
				youtubeId: 'teaVideo200',
				teams: ['Team Test 201', 'Team Test 001'],
				tournament: 'teaVideo000 Tournament'
			},
			{
				youtubeId: 'teaVideo300',
				teams: ['Team Test 301', 'Team Test 302'],
				tournament: 'teaVideo000 Tournament'
			}
		];

		// Create videos
		videos = videos.map(data => h.post('/api/video', data, users.user01));

		// add new teams to second video
		h.put('/api/video/entity', {
			id: videos[1]._id,
			field: 'teams',
			values: ['Team Test 201', 'Team Test 001']
		}, users.user03);

		// even upvote it ^
		var res = h.get('/api/lookup/team?query=Team Test 001', undefined, users.user01);
		h.post('/api/vote', {
			videoId: videos[1]._id,
			entityType: 'teams',
			entityId: res.values[0]._id
		}, users.user02);

		var res2 = h.delete(`/api/team/${res.values[0]._id}`, undefined, users.admin),
			res3 = h.get('/api/lookup/team?query=Team Test 001', undefined, users.user01),
			resVideo0 = h.get('/api/video/' + videos[0]._id),
			resVideo1 = h.get('/api/video/' + videos[1]._id),
			resVideo2 = h.get('/api/video/' + videos[2]._id),
			resVideo3 = h.get('/api/video/' + videos[3]._id);

		test.equal(resVideo0.teams.length, 0);
		test.ok([resVideo1.teams.teams[1].name, resVideo1.teams.teams[0].name].indexOf('Team Test 101') !== -1);
		test.ok([resVideo1.teams.teams[1].name, resVideo1.teams.teams[0].name].indexOf('Team Test 102') !== -1);
		test.equal(resVideo2.teams.length, 0);
		test.ok([resVideo3.teams.teams[1].name, resVideo3.teams.teams[0].name].indexOf('Team Test 301') !== -1);
		test.ok([resVideo3.teams.teams[1].name, resVideo3.teams.teams[0].name].indexOf('Team Test 302') !== -1);

		test.equal(res3.values.length, 0);

		test.done();
	},

	mergeTeam: function (test) {

		var videos = [
			{
				youtubeId: 'temVideo000',
				teams: ['Team Test 1001', 'Team Test 1002'],
				tournament: 'temVideo000 Tournament'
			},
			{
				youtubeId: 'temVideo100',
				teams: ['Team Test 1101', 'Team Test 1102'],
				tournament: 'temVideo000 Tournament'
			},
			{
				youtubeId: 'temVideo200',
				teams: ['Team Test 1201', 'Team Test 1001'],
				tournament: 'temVideo000 Tournament'
			},
			{
				youtubeId: 'temVideo300',
				teams: ['Team Test 1301', 'Team Test 1302'],
				tournament: 'temVideo000 Tournament'
			}
		];

		// Create videos
		videos = videos.map(data => h.post('/api/video', data, users.user01));

		// add new teams to second video
		h.put('/api/video/entity', {
			id: videos[1]._id,
			field: 'teams',
			values: ['Team Test 1201', 'Team Test 1001']
		}, users.user03);

		// even upvote it ^
		var res = h.get('/api/lookup/team?query=Team Test 1001', undefined, users.user01),
			res2 = h.get('/api/lookup/team?query=Team Test 1301', undefined, users.user01);

		h.post('/api/vote', {
			videoId: videos[1]._id,
			entityType: 'teams',
			entityId: res.values[0]._id
		}, users.user02);

		var res3 = h.post(`/api/team/merge`, {
				src: res.values[0]._id, // 'Team Test 1001'
				target: res2.values[0]._id // 'Team Test 1301'
			}, users.admin),
			res4 = h.get('/api/lookup/team?query=Team Test 1001', undefined, users.user01),
			resVideo0 = h.get('/api/video/' + videos[0]._id),
			resVideo1 = h.get('/api/video/' + videos[1]._id),
			resVideo2 = h.get('/api/video/' + videos[2]._id),
			resVideo3 = h.get('/api/video/' + videos[3]._id);

		test.ok(resVideo0.teams.teams.map(i => i.name).indexOf('Team Test 1301') !== -1);
		test.ok(resVideo0.teams.teams.map(i => i.name).indexOf('Team Test 1002') !== -1);

		test.ok(resVideo1.teams.teams.map(i => i.name).indexOf('Team Test 1101') !== -1);
		test.ok(resVideo1.teams.teams.map(i => i.name).indexOf('Team Test 1102') !== -1);

		test.ok(resVideo2.teams.teams.map(i => i.name).indexOf('Team Test 1201') !== -1);
		test.ok(resVideo2.teams.teams.map(i => i.name).indexOf('Team Test 1301') !== -1);

		test.ok(resVideo3.teams.teams.map(i => i.name).indexOf('Team Test 1301') !== -1);
		test.ok(resVideo3.teams.teams.map(i => i.name).indexOf('Team Test 1302') !== -1);

		test.equal(res4.values.length, 0);

		test.done();
	}
};
