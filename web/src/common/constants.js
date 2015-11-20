/* global angular */

angular
	.module(`${window.APP_NAME}.common`)
	.constant('Constants', {
		
		Api: {
			AUTH_ME: '/api/users/me',
			AUTH_GET_URL: '/api/auth/url',
		
			VIDEO: '/api/video',
			GET_VIDEO_LIST: '/api/video/list',
			VALIDATE_VIDEO: '/api/video/validate'
		},
		Roles: {
			ADMIN: 10
		}
	});
