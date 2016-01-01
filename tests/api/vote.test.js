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
	
	voteTournament: function (test) {
		var data = createVideoAndVoteForTournament({
				youtubeId: 'voteTest003',
				tournament: 'Super voteTest003'
			},
			[users.user01, users.user02],
			function (res) {
				return res.tournament._id;
			});
			
		var res3 = h.get('/api/video/' + data.video._id),
			res4 = h.get('/api/users/me', undefined, users.user02);
	
		test.equal(res3.tournament.rating, 2);
		test.equal(data.video._id, res4.votes.tournament[0]);

		test.done();
	},
	
	voteTournamentTwice: function (test) {
		var data = createVideoAndVoteForTournament({
				youtubeId: 'voteTest005',
				tournament: 'Super voteTest005'
			},
			[users.user01, users.user01],
			function (res) {
				return res.tournament._id;
			});
			
		var res3 = h.get('/api/video/' + data.video._id);
	
		test.equal(data.res.message, 'VOTE_TWICE');
		test.equal(res3.tournament.rating, 1);

		test.done();
	},
	
	voteTeams: function (test) {
		var data = createVideoAndVoteForTeams({
				youtubeId: 'voteTest006',
				teams: ['Team voteTest006', 'Superteam voteTest006']
			},
			[users.user01, users.user02],
			function (video) {
				return [video.teams.teams[1]._id, video.teams.teams[0]._id];
			});
			
		var res3 = h.get('/api/video/' + data.video._id),
			res4 = h.get('/api/users/me', undefined, users.user02);
	
		test.equal(res3.teams.rating, 2);
		test.equal(data.video._id, res4.votes.teams[0]);

		test.done();
	},
	
	voteTeamsTwice: function (test) {
		var data = createVideoAndVoteForTeams({
				youtubeId: 'voteTest007',
				teams: ['Team voteTest007', 'Superteam voteTest007']
			},
			[users.user01, users.user01],
			function (video) {
				return [video.teams.teams[1]._id, video.teams.teams[0]._id];
			});
			
		var res3 = h.get('/api/video/' + data.video._id);
	
		test.equal(data.res.message, 'VOTE_TWICE');
		test.equal(res3.teams.rating, 1);

		test.done();
	},
	
	voteCasters: function (test) {
		var data = createVideoAndVoteForCasters({
				youtubeId: 'voteTest008',
				casters: ['Caster voteTest008', 'AnotherCaster voteTest008']
			},
			[users.user01, users.user02],
			function (video) {
				return [video.casters.casters[0]._id, video.casters.casters[1]._id];
			});
			
		var res3 = h.get('/api/video/' + data.video._id),
			res4 = h.get('/api/users/me', undefined, users.user02);
	
		test.equal(res3.casters.rating, 2);
		test.equal(data.video._id, res4.votes.casters[0]);

		test.done();
	},
	
	// Try to vote only for one caster instead of two of them
	voteCastersWrongCount: function (test) {
		var data = createVideoAndVoteForCasters({
				youtubeId: 'voteTest009',
				casters: ['Caster voteTest009', 'AnotherCaster voteTest009']
			},
			[users.user01, users.user02],
			function (video) {
				return [video.casters.casters[1]._id];
			});
			
		var res3 = h.get('/api/video/' + data.video._id),
			res4 = h.get('/api/users/me', undefined, users.user02);
	
		test.equal(res3.casters.rating, 1);
		test.ok(res4.votes.casters.indexOf(data.video._id.toString()) === -1);

		test.done();
	},
	
	voteCastersTwice: function (test) {
		var data = createVideoAndVoteForCasters({
				youtubeId: 'voteTest010',
				casters: ['Caster voteTest010', 'AnotherCaster voteTest010']
			},
			[users.user01, users.user01],
			function (video) {
				return [video.casters.casters[0]._id, video.casters.casters[1]._id];
			});
			
		var res3 = h.get('/api/video/' + data.video._id);
	
		test.equal(data.res.message, 'VOTE_TWICE');
		test.equal(res3.casters.rating, 1);

		test.done();
	}
};

/**
 * @param {Object} data
 * @param {Array} usersArray First user creates video, second - votes
 * @param {Function} getTournamentIdFunc function (video) { return _id }
 */
function createVideoAndVoteForTournament (data, usersArray, getTournamentIdFunc) {
	var video = h.post('/api/video', data, usersArray[0]),
			
			// Get video to get tournament id
			res2 = h.get('/api/video/' + video._id),
			
			// User 2 votes for tournament
			res = h.post('/api/vote', {
				videoId: video._id,
				entityType: 'tournament',
				entityId: getTournamentIdFunc(res2)
			}, usersArray[1]);
			
	return {video, res};
}

/**
 * @param {Object} data
 * @param {Array} usersArray First user creates video, second - votes
 * @param {Function} getTeamsIdFunc function (video) { return Array }
 */
function createVideoAndVoteForTeams (data, usersArray, getTeamsIdFunc) {
	var video = h.post('/api/video', data, usersArray[0]),
		
		// Get video to get teams ids
		res2 = h.get('/api/video/' + video._id),
		
		// User 2 votes for teams
		res = h.post('/api/vote', {
			videoId: video._id,
			entityType: 'teams',
			entityId: getTeamsIdFunc(res2)
		}, usersArray[1]);
		
	return {video, res};
}

/**
 * @param {Object} data
 * @param {Array} usersArray First user creates video, second - votes
 * @param {Function} getCastersIdsFunc function (video) { return Array }
 */
function createVideoAndVoteForCasters (data, usersArray, getCastersIdsFunc) {
	var video = h.post('/api/video', data, usersArray[0]),
		
		// Get video to get teams ids
		res2 = h.get('/api/video/' + video._id),
		
		// User 2 votes for teams
		res = h.post('/api/vote', {
			videoId: video._id,
			entityType: 'casters',
			entityId: getCastersIdsFunc(res2)
		}, usersArray[1]);
		
	return {video, res};
}