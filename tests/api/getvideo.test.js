var h = require('../api.helpers'),
	users = {
		user01: h.addUser('getVideoUser', 2),
		user02: h.addUser('getVideoUser', 2)
	};

module.exports = {

	getVideoUnauth: function (test) {
		var res = createVideo('getVideo001'),
			video = h.get('/api/video/' + res._id);

		// Check some fields
		test.equal(video.youtubeId, 'getVideo001');
		test.ok(typeof video.creationDate !== 'undefined');
		test.equal(video.author._id, users.user01._id);
		test.equal(video.author.name, users.user01.name);
		test.equal(video.tournament.name, 'getVideo001 Tournament');
		test.ok(['Team getVideo001', 'Super getVideo001'].indexOf(video.teams.teams[0].name) !== -1);
		test.ok(['Team getVideo001', 'Super getVideo001'].indexOf(video.teams.teams[1].name) !== -1);
		test.ok(['getVideo001 Caster', 'getVideo001 Other Caster'].indexOf(video.casters.casters[0].name) !== -1);
		test.ok(['getVideo001 Caster', 'getVideo001 Other Caster'].indexOf(video.casters.casters[1].name) !== -1);

		test.equal(video.stage.code, 'FINAL');
		test.equal(video.format.code, 'BO3');

		// no isVoted fields
		test.ok(typeof video.isVoted === 'undefined');
		test.ok(typeof video.tournament.isVoted === 'undefined');
		test.ok(typeof video.teams.isVoted === 'undefined');
		test.ok(typeof video.casters.isVoted === 'undefined');
		test.ok(typeof video.stage.isVoted === 'undefined');
		test.ok(typeof video.format.isVoted === 'undefined');

		test.done();
	},

	getVideoAuthOther: function (test) {
		var res = createVideo('getVideo003'),
			video = h.get('/api/video/' + res._id, undefined, users.user02);

		// isVoted fields
		test.ok(!video.isVoted);
		test.ok(!video.tournament.isVoted);
		test.ok(!video.teams.isVoted);
		test.ok(!video.casters.isVoted);
		test.ok(!video.stage.isVoted);
		test.ok(!video.format.isVoted);

		test.done();
	}
};

function createVideo (videoName) {
	var data = {
			youtubeId: videoName,
			tournament: `${videoName} Tournament`,
			teams: [`Team ${videoName}`, `Super ${videoName}`],
			casters: [`${videoName} Caster`, `${videoName} Other Caster`],
			stage: 'FINAL',
			format: 'BO3'
		};

		var res = h.post('/api/video', data, users.user01);

	return res;
}
