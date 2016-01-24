var h = require('../api.helpers'),
	users = {
		user01: h.addUser('updateVideoUser01', 5),
		user02: h.addUser('updateVideoUser02', 5)
	};

module.exports = {

	updateVideoTournament: function (test) {
		var data = {
			youtubeId: 'updVideo001'
		};

		var res = h.post('/api/video', data, users.user01),
			res2 = h.put('/api/video/entity', {id: res._id, field: 'tournament', values: 'updVideo001 Tournament'}, users.user02),
			res3 = h.get('/api/lookup/tournament?query=updVideo001', undefined, users.user02),
			res4 = h.get('/api/video/' + res._id),
			user = h.get('/api/users/me', undefined, users.user02);

		// should create Tournament and added to the list of video tournaments
		test.equal(res4.tournament._id, res3.values[0]._id);
		test.equal(res3.values[0].name, 'updVideo001 Tournament');

		// tournament automatically upvoted by author
		test.equal(res4.tournament.rating, 1);
		test.ok(user.votes.tournament.indexOf(res._id) !== -1);

		test.done();
	}

	// TODO: moar tests

};
