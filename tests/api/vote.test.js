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
	}
};
