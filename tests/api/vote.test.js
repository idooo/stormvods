var h = require('../api.helpers'),
	users = {
		user01: h.addUser('voteVideoUser1', 2),
		user02: h.addUser('voteVideoUser2', 2),
		user03: h.addUser('voteVideoUser3', 2)
	};

module.exports = {

	voteVideo: function (test) {
		var data = {
			youtubeId: 'voteTest001',
			tournament: 'voteTest001 Tournament',
			teams: ['voteTest001 team1', 'voteTest001 team2']
		};

		var video = h.post('/api/video', data, users.user01),
			res = h.post('/api/vote', {videoId: video._id}, users.user02),
			res2 = h.get('/api/video/' + video._id);

		test.equal(res.status, 'ok');
		test.equal(res2.rating, 2);

		test.done();
	},

	voteVideoTwice: function (test) {
		var data = {
			youtubeId: 'voteTest002',
			tournament: 'voteTest002 Tournament',
			teams: ['voteTest002 team1', 'voteTest002 team2']
		};

		var video = h.post('/api/video', data, users.user01),
			res = h.post('/api/vote', {videoId: video._id}, users.user01),
			res2 = h.get('/api/video/' + video._id);

		test.equal(res.message, 'VOTE_TWICE');
		test.equal(res.status, 'error');
		test.equal(res2.rating, 1);

		test.done();
	},

	voteWrongType: function (test) {
		var video = h.post('/api/video', {
				youtubeId: 'voteTest011',
				tournament: 'Super voteTest011',
				teams: ['voteTest011 team1', 'voteTest011 team2']
			}, users.user01),

			// Get video to get tournament id
			res2 = h.get('/api/video/' + video._id),

			// User 2 votes for tournament
			res = h.post('/api/vote', {
				videoId: video._id,
				entityType: 'tournamentblah',
				entityId: res2.tournament._id
			}, users.user02);

		test.equal(res.message, 'WRONG_TYPE');
		test.equal(res.status, 'error');

		test.done();
	},

	voteTournament: function (test) {
		var data = createVideoAndVoteForTournament({
				youtubeId: 'voteTest003',
				tournament: 'Super voteTest003',
				teams: ['voteTest003 team1', 'voteTest003 team2']
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
				tournament: 'Super voteTest005',
				teams: ['voteTest005 team1', 'voteTest005 team2']
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

	voteTournamentSortEntities: function (test) {
		var video = h.post('/api/video', {
				youtubeId: 'voteTest015',
				tournament: 'Super voteTest015',
				teams: ['voteTest015 team1', 'voteTest015 team2']
			}, users.user01),

			// Add second
			res = h.put('/api/video/entity', {id: video._id, field: 'tournament', values: 'Second Tour voteTest015'}, users.user02),

			// User 2 votes for tournament
			res2 = h.post('/api/vote', {
				videoId: video._id,
				entityType: 'tournament',
				entityId: res.value
			}, users.user03),

			// Get video to get tournament id
			res3 = h.get('/api/video/' + video._id);

		// Voting should put second tournament to the top
		test.equal(res3.tournament.rating, 2);
		test.equal(res3.tournament.name, 'Second Tour voteTest015');

		test.done();
	},

	voteTeams: function (test) {
		var data = createVideoAndVoteForTeams({
				youtubeId: 'voteTest006',
				tournament: 'Super voteTest006',
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
				teams: ['Team voteTest007', 'Superteam voteTest007'],
				tournament: 'Super voteTest007'
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
				casters: ['Caster voteTest008', 'AnotherCaster voteTest008'],
				teams: ['Team voteTest008', 'Superteam voteTest008'],
				tournament: 'Super voteTest008'
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
				casters: ['Caster voteTest009', 'AnotherCaster voteTest009'],
				teams: ['Team voteTest009', 'Superteam voteTest009'],
				tournament: 'Super voteTest009'
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
				casters: ['Caster voteTest010', 'AnotherCaster voteTest010'],
				teams: ['Team voteTest010', 'Superteam voteTest010'],
				tournament: 'Super voteTest010'
			},
			[users.user01, users.user01],
			function (video) {
				return [video.casters.casters[0]._id, video.casters.casters[1]._id];
			});

		var res3 = h.get('/api/video/' + data.video._id);

		test.equal(data.res.message, 'VOTE_TWICE');
		test.equal(res3.casters.rating, 1);

		test.done();
	},

	voteStage: function (test) {
		var video = h.post('/api/video', {
				youtubeId: 'voteTest012',
				stage: 'FINAL',
				teams: ['Team voteTest012', 'Superteam voteTest012'],
				tournament: 'Super voteTest012'
			}, users.user01),

			// User 2 votes for tournament
			res = h.post('/api/vote', {
				videoId: video._id,
				entityType: 'stage',
				entityId: 'FINAL'
			}, users.user02),

			res2 = h.get('/api/users/me', undefined, users.user02),
			res3 = h.get('/api/video/' + video._id);

		test.equal(res3.stage.rating, 2);
		test.ok(res2.votes.stage.indexOf(video._id.toString()) !== -1);

		test.done();
	},

	voteStageWrongCode: function (test) {
		var video = h.post('/api/video', {
				youtubeId: 'voteTest013',
				stage: 'FINAL',
				teams: ['Team voteTest013', 'Superteam voteTest013'],
				tournament: 'Super voteTest013'
			}, users.user01),

			// User 2 votes for tournament
			res = h.post('/api/vote', {
				videoId: video._id,
				entityType: 'stage',
				entityId: 'FINALOMG'
			}, users.user02),

			res2 = h.get('/api/users/me', undefined, users.user02),
			res3 = h.get('/api/video/' + video._id);

		test.equal(res3.stage.rating, 1);
		test.equal(res.message, 'NOT_FOUND');
		test.ok(res2.votes.stage.indexOf(video._id.toString()) === -1);

		test.done();
	},

	voteFormat: function (test) {
		var video = h.post('/api/video', {
				youtubeId: 'voteTest014',
				format: 'BO3',
				teams: ['Team voteTest014', 'Superteam voteTest014'],
				tournament: 'Super voteTest014'
			}, users.user01),

			// User 2 votes for tournament
			res = h.post('/api/vote', {
				videoId: video._id,
				entityType: 'format',
				entityId: 'BO3'
			}, users.user02),

			res2 = h.get('/api/users/me', undefined, users.user02),
			res3 = h.get('/api/video/' + video._id);

		test.equal(res3.format.rating, 2);
		test.ok(res2.votes.format.indexOf(video._id.toString()) !== -1);

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
