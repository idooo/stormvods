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


	// TODO: write test
	deleteTeam: function (test) {
		test.equal('ok', 'ok');
		test.done();
	}
};
