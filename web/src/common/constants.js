angular
	.module(`${window.APP_NAME}.common`)
	.constant('Constants', {
		
		Api: {
			AUTH_ME: '/api/users/me',
			AUTH_GET_URL: '/api/auth/url',
		
			VIDEO: '/api/video',
			GET_VIDEO_LIST: '/api/video/list',
			GET_REMOVED_VIDEO_LIST: '/api/video/removed',
			VALIDATE_VIDEO: '/api/video/validate',
			
			LOOKUP: '/api/lookup'
		},
		
		Roles: {
			ADMIN: 10
		},
		
		Stages: {
			FINAL: 'Final',
			SEMIFINAL: 'Semi final',
			QUARTERFINAL: 'Quarter final',
			RO16: 'Round of 16',
			RO32: 'Round of 32',
			RO64: 'Round of 64',
			GROUPA: 'Group A',
			GROUPB: 'Group B',
			GROUPC: 'Group C',
			GROUPD: 'Group D',
			QUALIFIER: 'Qualifier'
		},
		
		Formats: {
			BO1: 'Best of 1',
			BO3: 'Best of 3',
			BO5: 'Best of 5',
			BO7: 'Best of 7'
		} 
	});
