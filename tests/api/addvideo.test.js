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
			res2 = h.get('/api/users/me', undefined, users.user01);

		test.equal(res.youtubeId, 'addVideo000');
		
		// video automatically upvoted by author
		test.equal(res.rating, 1); 
		test.ok(res2.votes.video.indexOf(res._id) !== -1); 

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
		test.equal(res.message.youtubeId, 'EXPECTED_UNIQUE_VALUE'); 

		test.done();
	},
	
	addVideoTournament: function (test) {
		var data = {
			youtubeId: 'addVideo001',
			tournament: 'addVideoSimpleTest001 Tournament'
		};
		
		var res = h.post('/api/video', data, users.user01),
			res2 = h.get('/api/lookup/tournament?query=addVideoSimpleTest001', undefined, users.user01);
		
		test.equal(res.youtubeId, 'addVideo001');  
		
		// should create Tournament and save an _id
		test.equal(res.youtubeId, 'addVideo001');
		test.equal(res.tournament[0]._id, res2.values[0]._id);
		test.equal(res2.values[0].name, 'addVideoSimpleTest001 Tournament');  

		test.done();
	},
	
	addVideoTeams: function (test) {
		var data = {
			youtubeId: 'addVideo002',
			teams: ['Team addVideoSimpleTest002', 'Super addVideoSimpleTest002']
		};
		
		var res = h.post('/api/video', data, users.user01),
			res2 = h.get('/api/lookup/team?query=addVideoSimpleTest002', undefined, users.user01);
		
		test.equal(res.youtubeId, 'addVideo002'); 
		
		// should create Teams and save ids
		test.equal(res2.values.length, 2);  
		test.ok(res.teams[0].teams.indexOf(res2.values[0]._id) !== -1);
		test.ok(res.teams[0].teams.indexOf(res2.values[1]._id) !== -1);
		test.ok(data.teams.indexOf(res2.values[0].name) !== -1);
		test.ok(data.teams.indexOf(res2.values[1].name) !== -1);

		test.done();
	},
	
	addVideoCasters: function (test) {
		var data = {
			youtubeId: 'addVideo003',
			casters: ['addVideoSimpleTest003 Caster', 'addVideoSimpleTest003 Other Caster']
		};
		
		var res = h.post('/api/video', data, users.user01),
			res2 = h.get('/api/lookup/caster?query=addVideoSimpleTest003', undefined, users.user01);

		test.equal(res.youtubeId, 'addVideo003');

		// should create Casters and save ids
		test.equal(res2.values.length, 2);  
		test.ok(res.casters[0].casters.indexOf(res2.values[0]._id) !== -1);
		test.ok(res.casters[0].casters.indexOf(res2.values[1]._id) !== -1);
		test.ok(data.casters.indexOf(res2.values[0].name) !== -1);
		test.ok(data.casters.indexOf(res2.values[1].name) !== -1);

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
