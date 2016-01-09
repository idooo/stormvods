var h = require('../api.helpers'),
	users = {
		user01: h.addUser('validateUser', 2),
		user02: h.addUser('validateUser', 2)
	};

module.exports = {

	validateVideoFound: function (test) {
		var data = {
			youtubeId: 'valVideo000'
		};
		
		var res = h.post('/api/video', data, users.user01),
			res2 = h.get('/api/video/validate?id=valVideo000', undefined, users.user02);
			
		test.ok(res2.isFound);
		test.equal(res2.id, res._id);
		
		test.done();
	},
	
	validateVideoNotFound: function (test) {
		var data = {
			youtubeId: 'valVideo001'
		};
		
		var res = h.post('/api/video', data, users.user01),
			res2 = h.get('/api/video/validate?id=valVideo002', undefined, users.user02);
			
		test.ok(!res2.isFound);
		test.ok(typeof res2.id === 'undefined');
		
		test.done();
	},
	
	validateVideoAuthRequired: function (test) {
		var data = {
			youtubeId: 'valVideo001'
		};
		
		var res = h.post('/api/video', data, users.user01),
			res2 = h.get('/api/video/validate?id=valVideo002');
			
		test.ok(typeof res2.isFound === 'undefined');
		test.ok(typeof res2.id === 'undefined');
		
		test.equal(res2.status, 'error'); 
		test.equal(res2.code, 403); 
		test.equal(res2.message, 'AUTH_REQUIRED'); 
		
		test.done();
	}
};

