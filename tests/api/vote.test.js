var h = require('../api.helpers'),
	users = {
		user01: h.addUser('voteVideoUser1', 5),
		user02: h.addUser('voteVideoUser2', 5)
	};
	
module.exports = {

	voteVideo: function (test) {
		var video = h.post('/api/video', {youtubeId: 'voteTest001'}, users.user01),
			res = h.post('/api/vote', {videoId: video._id}, users.user02),
			res2 = h.get('/api/video/' + video._id);
	
		test.equal(res.status, 'ok');
		test.equal(res2.rating, 2);

		test.done();
	},
	
	voteVideoTwice: function (test) {
		var video = h.post('/api/video', {youtubeId: 'voteTest002'}, users.user01),
			res = h.post('/api/vote', {videoId: video._id}, users.user01),
			res2 = h.get('/api/video/' + video._id);
	
		test.equal(res.message, 'VOTE_TWICE');
		test.equal(res2.rating, 1);

		test.done();
	},
	
	voteTournamentTwice: function (test) {
		var video = h.post('/api/video', {
				youtubeId: 'voteTest003',
				tournament: 'Super voteTest003'
			}, users.user01),
			res2 = h.get('/api/video/' + video._id),
			res = h.post('/api/vote', {
				videoId: video._id,
				entityType: 'tournament',
				entityId: res2.tournament._id
			}, users.user01);
	
		test.equal(res.message, 'VOTE_TWICE');
		test.equal(res2.tournament.rating, 1);

		test.done();
	},
	
	voteTeamsTwice: function (test) {
		var video = h.post('/api/video', {
				youtubeId: 'voteTest004',
				teams: ['Team voteTest004', 'Team voteTest004-2']
			}, users.user01),
			res2 = h.get('/api/video/' + video._id),
			res = h.post('/api/vote', {
				videoId: video._id,
				entityType: 'teams',
				entityId: res2.teams.teams[0]._id + ':' + res2.teams.teams[1]._id
			}, users.user01);
	
		test.equal(res.message, 'VOTE_TWICE');
		test.equal(res2.teams.rating, 1);

		test.done();
	}
};
