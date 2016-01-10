angular
	.module(`${window.APP_NAME}.common`)
	.constant('Constants', {
		
		Api: {
			AUTH_ME: '/api/users/me',
			USERS: '/api/users',
			USER: '/api/user',
			AUTH_GET_URL: '/api/auth/url',
		
			VIDEO: '/api/video',
			GET_VIDEO_LIST: '/api/video/list',
			GET_VIDEO_TOPLIST: '/api/video/list/top',
			GET_REMOVED_VIDEO_LIST: '/api/video/removed',
			VALIDATE_VIDEO: '/api/video/validate',
			
			LOOKUP: '/api/lookup',
			
			GET_TEAMS: '/api/teams',
			GET_TOURNAMENTS: '/api/tournaments',
			GET_CASTERS: '/api/casters',
			
			VOTE: '/api/vote'
		},
		
		Roles: {
			ADMIN: 10
		},
		
		Top: [
			{name: 'Today', code: 'today'},
			{name: 'Week', code: 'week'},
			{name: 'Month', code: 'month'},
			{name: 'All Time', code: 'alltime'}
		],
		
		Stages: {
			QUALIFIER: 'Qualifier',
			LB: 'Losers Bracket',
			WB: 'Winners Bracket',
			GROUP: 'Group Stage',
			GROUPA: 'Group A',
			GROUPB: 'Group B',
			GROUPC: 'Group C',
			GROUPD: 'Group D',
			RO64: 'Round of 64',
			RO32: 'Round of 32',
			RO16: 'Round of 16',
			QUARTERFINAL: 'Quarter final',
			SEMIFINAL: 'Semi final',
			FINAL: 'Final'
		},
		
		Formats: {
			BO1: 'Best of 1',
			BO3: 'Best of 3',
			BO5: 'Best of 5',
			BO7: 'Best of 7'
		} 
	});
