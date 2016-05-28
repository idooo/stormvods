var h = require('../api.helpers'),
	moment = require('moment'),
	users = {
		user01: h.addUser('teamUser1', 2),
		user02: h.addUser('teamUser2', 2),
		user03: h.addUser('teamUser3', 2),
		admin: h.addUser('teamAdmin', 10)
	};

module.exports = {

	// Most of the entities test covered in team test suite

	deleteTournament: function (test) {

		var videos = [
			{
				youtubeId: 'touVideo000',
				tournament: 'Test Tournament 000',
				teams: ['Team touVideo000', 'Team touVideo001']
			},
			{
				youtubeId: 'touVideo100',
				tournament: 'Test Tournament 100',
				teams: ['Team touVideo000', 'Team touVideo001']
			},
			{
				youtubeId: 'touVideo200',
				tournament: 'Test Tournament 200',
				teams: ['Team touVideo000', 'Team touVideo001']
			},
			{
				youtubeId: 'touVideo300',
				tournament: 'Test Tournament 100',
				teams: ['Team touVideo000', 'Team touVideo001']
			}
		];

		// Create videos
		videos = videos.map(data => h.post('/api/video', data, users.user01));

		// add new teams to third video
		h.put('/api/video/entity', {
			id: videos[2]._id,
			field: 'tournament',
			values: 'Test Tournament 100'
		}, users.user02);

		// even upvote it ^
		var res = h.get('/api/lookup/tournament?query=Test Tournament 100', undefined, users.user01);
		h.post('/api/vote', {
			videoId: videos[1]._id,
			entityType: 'tournament',
			entityId: res.values[0]._id
		}, users.user03);

		var res2 = h.delete(`/api/tournament/${res.values[0]._id}`, undefined, users.admin),
			resVideo0 = h.get('/api/video/' + videos[0]._id),
			resVideo1 = h.get('/api/video/' + videos[1]._id),
			resVideo2 = h.get('/api/video/' + videos[2]._id),
			resVideo3 = h.get('/api/video/' + videos[3]._id);

		test.equal(resVideo0.tournament.name, 'Test Tournament 000');
		test.equal(resVideo1.tournament.length, 0);
		test.equal(resVideo2.tournament.name, 'Test Tournament 200');
		test.equal(resVideo3.tournament.length, 0);

		test.done();
	},

	addVideoTournamentDate: function (test) {
		var data = {
			youtubeId: 'touVideo001',
			tournament: 'touVideo001 Tournament',
			teams: ['touVideo001 team1', 'touVideo001 team2'],
			date: '2015-03'
		};

		var res = h.post('/api/video', data, users.user01),
			res2 = h.get('/api/lookup/tournament?query=touVideo001', undefined, users.user01),
			user = h.get('/api/users/me', undefined, users.user01),
			date = new Date(res2.values[0].date);

		test.equal(res2.values[0].name, 'touVideo001 Tournament');
		test.equal(date.getMonth() + 1, 3);
		test.equal(date.getFullYear(), 2015);

		test.done();
	}
};
