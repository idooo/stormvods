var h = require('../api.helpers'),
	users = {
		user01: h.addUser('addVideoUser', 5)
	};

module.exports = {

	addVideoSimple: function (test) {
		var data = {
			youtubeId: 'addVideo000'
		};
		
		var res = h.post('/api/video', data, users.user01),
			user = h.get('/api/users/me', undefined, users.user01);

		test.equal(res.youtubeId[0], 'addVideo000');
		
		// video automatically upvoted by author
		test.equal(res.rating, 1); 
		test.ok(user.votes.video.indexOf(res._id) !== -1); 

		test.done();
	},
	
	addVideoMultipleIds: function (test) {
		var data = {
			youtubeId: ['addVideo100', 'addVideo101', 'addVideo102']
		};
		
		var res = h.post('/api/video', data, users.user01),
			user = h.get('/api/users/me', undefined, users.user01);

		test.equal(res.youtubeId[2], 'addVideo102');
		
		// video automatically upvoted by author
		test.equal(res.rating, 1); 
		test.ok(user.votes.video.indexOf(res._id) !== -1); 

		test.done();
	},
	
	addVideoReqAuth: function (test) {
		var data = {
			youtubeId: 'addVideo099'
		};
		
		var res = h.post('/api/video', data);

		test.equal(res.status, 'error'); 
		test.equal(res.code, 403); 
		test.equal(res.message, 'AUTH_REQUIRED'); 

		test.done();
	},
	
	addVideoPreventSameId: function (test) {
		var data = {
			youtubeId: 'addVideo000'
		};
		
		h.post('/api/video', data, users.user01);
		var	res = h.post('/api/video', data, users.user01);

		test.equal(res.status, 'error'); 
		test.equal(res.code, 400); 
		test.equal(res.message, 'EXPECTED_UNIQUE_VALUE'); 

		test.done();
	},
	
	addVideoPreventSameIdMultipleIds: function (test) {
		h.post('/api/video', {
			youtubeId: ['addVideo200', 'addVideo201']
		}, users.user01);
		
		var	res = h.post('/api/video', {
			youtubeId: ['addVideo202', 'addVideo201']
		}, users.user01);

		test.equal(res.status, 'error'); 
		test.equal(res.code, 400); 
		test.equal(res.message, 'EXPECTED_UNIQUE_VALUE'); 

		test.done();
	},
	
	addVideoLimitVideos: function (test) {
		var data = {
			youtubeId: [
				'addVideo300', 'addVideo301', 'addVideo302', 'addVideo303', 
				'addVideo304', 'addVideo305', 'addVideo306', 'addVideo307'
			]
		};
		
		var	res = h.post('/api/video', data, users.user01);

		test.equal(res.status, 'error'); 
		test.equal(res.code, 400); 
		test.equal(res.message.youtubeId, 'INVALID_VALUE'); 

		test.done();
	},
	
	
	addVideoInvalidId: function (test) {
		var data = {
			youtubeId: ['aaaa']
		};
		
		var	res = h.post('/api/video', data, users.user01);

		test.equal(res.status, 'error'); 
		test.equal(res.code, 400); 
		test.equal(res.message.youtubeId, 'INVALID_VALUE'); 

		test.done();
	},
	
	addVideoTournament: function (test) {
		var data = {
			youtubeId: 'addVideo001',
			tournament: 'addVideoSimpleTest001 Tournament'
		};
		
		var res = h.post('/api/video', data, users.user01),
			res2 = h.get('/api/lookup/tournament?query=addVideoSimpleTest001', undefined, users.user01),
			user = h.get('/api/users/me', undefined, users.user01);
		
		test.equal(res.youtubeId[0], 'addVideo001');  
		
		// should create Tournament and save an _id
		test.equal(res.youtubeId[0], 'addVideo001');
		test.equal(res.tournament[0]._id, res2.values[0]._id);
		test.equal(res2.values[0].name, 'addVideoSimpleTest001 Tournament');  
		
		// tournament automatically upvoted by author
		test.equal(res.tournament[0].rating, 1); 
		test.ok(user.votes.tournament.indexOf(res._id) !== -1); 

		test.done();
	},
	
	addVideoTeams: function (test) {
		var data = {
			youtubeId: 'addVideo002',
			teams: ['Team addVideoSimpleTest002', 'Super addVideoSimpleTest002']
		};
		
		var res = h.post('/api/video', data, users.user01),
			res2 = h.get('/api/lookup/team?query=addVideoSimpleTest002', undefined, users.user01),
			user = h.get('/api/users/me', undefined, users.user01);
		
		test.equal(res.youtubeId[0], 'addVideo002'); 
		
		// should create Teams and save ids
		test.equal(res2.values.length, 2);  
		test.ok(res.teams[0].teams.indexOf(res2.values[0]._id) !== -1);
		test.ok(res.teams[0].teams.indexOf(res2.values[1]._id) !== -1);
		test.ok(data.teams.indexOf(res2.values[0].name) !== -1);
		test.ok(data.teams.indexOf(res2.values[1].name) !== -1);
		
		// teams automatically upvoted by author 
		test.equal(res.teams[0].rating, 1); 
		test.ok(user.votes.teams.indexOf(res._id) !== -1); 
 
		test.done();
	},
	
	addVideoCasters: function (test) {
		var data = {
			youtubeId: 'addVideo003',
			casters: ['addVideoSimpleTest003 Caster', 'addVideoSimpleTest003 Other Caster']
		};
		
		var res = h.post('/api/video', data, users.user01),
			res2 = h.get('/api/lookup/caster?query=addVideoSimpleTest003', undefined, users.user01),
			user = h.get('/api/users/me', undefined, users.user01);

		test.equal(res.youtubeId[0], 'addVideo003');

		// should create Casters and save ids
		test.equal(res2.values.length, 2);  
		test.ok(res.casters[0].casters.indexOf(res2.values[0]._id) !== -1);
		test.ok(res.casters[0].casters.indexOf(res2.values[1]._id) !== -1);
		test.ok(data.casters.indexOf(res2.values[0].name) !== -1);
		test.ok(data.casters.indexOf(res2.values[1].name) !== -1);

		// teams automatically upvoted by author
		test.equal(res.casters[0].rating, 1); 
		test.ok(user.votes.casters.indexOf(res._id) !== -1); 

		test.done();
	},
	
	addVideoStage: function (test) {
		var data = {
			youtubeId: 'addVideo005',
			stage: 'FINAL'
		};
		
		var	res = h.post('/api/video', data, users.user01),
			user = h.get('/api/users/me', undefined, users.user01);

		test.equal(res.stage[0].code, 'FINAL'); 
		test.ok(user.votes.stage.indexOf(res._id) !== -1); 

		test.done();
	},
	
	addVideoFormat: function (test) {
		var data = {
			youtubeId: 'addVideo006',
			format: 'BO3'
		};
		
		var	res = h.post('/api/video', data, users.user01),
			user = h.get('/api/users/me', undefined, users.user01);

		test.equal(res.format[0].code, 'BO3'); 
		test.ok(user.votes.format.indexOf(res._id) !== -1); 

		test.done();
	},
	
	addVideoWrongFormat: function (test) {
		var data = {
			youtubeId: 'addVideo007',
			format: 'BOO'
		};
		
		var	res = h.post('/api/video', data, users.user01);

		test.equal(res.format.length, 0); 

		test.done();
	},
	
	addVideoWrongStage: function (test) {
		var data = {
			youtubeId: 'addVideo008',
			stage: 'FINALOOOO'
		};
		
		var	res = h.post('/api/video', data, users.user01);

		test.equal(res.stage.length, 0); 

		test.done();
	},
	
	/**
	 * Test that system should not create new entities for tournaments/etc
	 * if they are already exist but use existing
	 */
	addVideoReuse: function (test) {
		var data = {
			youtubeId: 'addVideo004',
			tournament: 'addVideo004 Tournament',
			teams: ['Team addVideo004', 'Super addVideo004'],
			casters: ['addVideo004 Caster', 'addVideo004 Other Caster']
		};
		
		var res = h.post('/api/video', data, users.user01);
		
		data.youtubeId = 'AddVideo004'; // different youtube id
		
		var res2 = h.post('/api/video', data, users.user01);

		// ids for entities should be the same
		test.equal(res.tournament[0]._id, res2.tournament[0]._id);   
		test.equal(res.teams[0].teams[0]._id, res2.teams[0].teams[0]._id);   
		test.equal(res.teams[0].teams[1]._id, res2.teams[0].teams[1]._id);   
		test.equal(res.casters[0].casters[0]._id, res2.casters[0].casters[0]._id);
		test.equal(res.casters[0].casters[1]._id, res2.casters[0].casters[1]._id); 
		
		// We should not create entities with same names
		var res3 = h.get('/api/lookup/tournament?query=addVideo004', undefined, users.user01);
		test.equal(res3.values.length, 1); 
		
		res3 = h.get('/api/lookup/team?query=addVideo004', undefined, users.user01);
		test.equal(res3.values.length, 2); 
		
		res3 = h.get('/api/lookup/caster?query=addVideo004', undefined, users.user01);
		test.equal(res3.values.length, 2); 

		test.done();
	}
};
