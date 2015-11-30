/* global angular */

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
		Stages: [
			{name: 'Final', value: 'FINAL'},
			{name: 'Semi final', value: 'SEMIFINAL'},
			{name: 'Quarter final', value: 'QUARTERFINAL'},
			{name: 'Round of 16', value: 'RO16'},
			{name: 'Round of 32', value: 'RO32'},
			{name: 'Round of 64', value: 'RO64'},
			{name: 'Group A', value: 'GROUPA'},
			{name: 'Group B', value: 'GROUPB'},
			{name: 'Group C', value: 'GROUPC'},
			{name: 'Group D', value: 'GROUPD'}
		]
		
	});
