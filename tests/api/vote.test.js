var h = require('../api.helpers');

module.exports = {

	voteVideo: function (test) {
		var data = {
			youtubeId: 'voteTest001',
			tournament: 'Vote Test 001 Tournament',
			teams: ['Team voteTest001', 'Super voteTest001'],
			casters: ['voteTest001 Caster']
		};
		
		var res = h.post('/api/video', data);

		console.log(res);

		test.done();
	},
	
	voteTournament: function (test) {
		var res = h.get('/api/auth/url');

		test.done();
	},
	
	voteTeams: function (test) {
		var res = h.get('/api/auth/url');

		test.done();
	}
};
