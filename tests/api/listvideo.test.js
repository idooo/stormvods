/**
 * This test suite has to be run with others
 * (DON'T RUN IT ALONE)
 */

var h = require('../api.helpers'),
	users = {
		user01: h.addUser('listVideoUser', 2),
		user02: h.addUser('listVideoUser', 2)
	};

// Create video list

for (var i = 0; i < 22; i++) {
	createVideo('lstVideo0' + ('0' + i).slice(-2));
}

module.exports = {

	getListUnauth: function (test) {
		var list = h.get('/api/video/list');

		// this will fail if you don't have other tests running
		test.equal(list.videos.length, 24);
		test.equal(list.pageCount, 2);
		test.equal(list.currentPage, 1);

		// Check some fields
		var video = h.get('/api/video/' + list.videos[1]._id);

		test.equal(list.videos[1].youtubeId[0], video.youtubeId[0]);
		test.equal(list.videos[1].rating, video.rating);
		test.ok(typeof list.videos[1].creationDate !== 'undefined');
		test.equal(list.videos[1].author._id, video.author._id);
		test.equal(list.videos[1].author.name, video.author.name);
		test.equal(list.videos[1].tournament.name, video.tournament.name);
		test.ok([video.teams.teams[0].name, video.teams.teams[1].name].indexOf(list.videos[1].teams.teams[0].name) !== -1);
		test.ok([video.teams.teams[0].name, video.teams.teams[1].name].indexOf(list.videos[1].teams.teams[1].name) !== -1);
		test.ok([video.casters.casters[0].name, video.casters.casters[1].name].indexOf(list.videos[1].casters.casters[0].name) !== -1);
		test.ok([video.casters.casters[0].name, video.casters.casters[1].name].indexOf(list.videos[1].casters.casters[1].name) !== -1);
		test.equal(list.videos[1].stage.code, video.stage.code);
		test.equal(list.videos[1].format.code, video.format.code);

		// no isVoted fields
		test.ok(typeof list.videos[1].isVoted === 'undefined');
		test.ok(typeof list.videos[1].tournament.isVoted === 'undefined');

		test.done();
	},

	getListPage2: function (test) {
		var list = h.get('/api/video/list?p=2');

		test.equal(list.pageCount, 2);
		test.equal(list.currentPage, 2);

		var video = h.get('/api/video/' + list.videos[1]._id);

		// Check some fields
		test.equal(list.videos[1].youtubeId[0], video.youtubeId[0]);
		test.equal(list.videos[1].rating, video.rating);
		test.ok(typeof list.videos[1].creationDate !== 'undefined');
		test.equal(list.videos[1].author._id, video.author._id);
		test.equal(list.videos[1].author.name, video.author.name);
		test.equal(list.videos[1].tournament.name, video.tournament.name);
		test.ok([video.teams.teams[0].name, video.teams.teams[1].name].indexOf(list.videos[1].teams.teams[0].name) !== -1);
		test.ok([video.teams.teams[0].name, video.teams.teams[1].name].indexOf(list.videos[1].teams.teams[1].name) !== -1);

		// no isVoted fields
		test.ok(typeof list.videos[1].isVoted === 'undefined');
		test.ok(typeof list.videos[1].tournament.isVoted === 'undefined');

		test.done();
	},

	getListAuthSelf: function (test) {
		var list = h.get('/api/video/list', undefined, users.user01);

		// isVoted fields
		test.ok(list.videos[5].isVoted);
		test.ok(!list.videos[5].tournament.isVoted); // no votes for entities in the list
		test.ok(list.videos[2].isVoted);
		test.ok(list.videos[15].isVoted);

		test.done();
	},

	getListAuthOther: function (test) {
		var list = h.get('/api/video/list', undefined, users.user02);

		// isVoted fields
		test.ok(list.videos[5].isVoted === false);
		test.ok(!list.videos[5].tournament.isVoted); // no votes for entities in the list
		test.ok(list.videos[2].isVoted === false);
		test.ok(list.videos[15].isVoted === false);

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
