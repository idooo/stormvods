var h = require('../api.helpers'),
	users = {
		user01: h.addUser('updateVideoUser01', 5),
		user02: h.addUser('updateVideoUser02', 5),
		user03: h.addUser('updateVideoUser03', 5)
	};

module.exports = {

	updateVideoTournament: function (test) {
		var data = {
			youtubeId: 'updVideo001',
			teams: ['Team updVideo001', 'Team updVideo001-2'],
			tournament: 'Test updVideo101'
		};

		// user 1 adds video
		var res = h.post('/api/video', data, users.user01),
			// user 2 updates video adding new tournament
			res2 = h.put('/api/video/entity', {id: res._id, field: 'tournament', values: 'updVideo001 Tournament'}, users.user02),
			// user 3 voted for new tournament
			res5 = h.post('/api/vote', {
				videoId: res._id,
				entityType: 'tournament',
				entityId: res2.value
			}, users.user03),
			res3 = h.get('/api/lookup/tournament?query=updVideo001', undefined, users.user02),
			res4 = h.get('/api/video/' + res._id),
			user = h.get('/api/users/me', undefined, users.user02);

		// should create Tournament and added to the list of video tournaments
		test.equal(res4.tournament._id, res3.values[0]._id);
		test.equal(res3.values[0].name, 'updVideo001 Tournament');

		// tournament automatically upvoted by author + second vote
		test.equal(res4.tournament.rating, 2);
		test.ok(user.votes.tournament.indexOf(res._id) !== -1);

		test.done();
	}

	// TODO: moar tests

};
