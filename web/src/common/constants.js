const Stages = [
	{name: 'Final', code: 'FINAL'},
	{name: 'Semi final', code: 'SEMIFINAL'},
	{name: 'Quarter final', code: 'QUARTERFINAL'},
	{name: 'Round of 16', code: 'RO16'},
	{name: 'Round of 32', code: 'RO32'},
	{name: 'Round of 64', code: 'RO64'},
	{name: 'Group A', code: 'GROUPA'},
	{name: 'Group B', code: 'GROUPB'},
	{name: 'Group C', code: 'GROUPC'},
	{name: 'Group D', code: 'GROUPD'},
	{name: 'Qualifier', code: 'QUALIFIER'}
];

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
		
		Stages: Stages,
		
		getStageByCode: code => {
			for (let i = 0; i < Stages.length; i++) {
				if (code === Stages[i].code) return Stages[i].name;
			}
		}
		
	});
