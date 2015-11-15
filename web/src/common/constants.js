/* global angular, Rx */

angular
	.module(`${window.APP_NAME}.common`)
	.constant('Constants', {
		
		Api: {
			AUTH_ME: '/api/users/me',
			AUTH_GET_URL: '/api/auth/url',
		
			ADD_VIDEO: '/api/video/add',
			GET_VIDEO: '/api/video',
			GET_VIDEO_LIST: '/api/video/list'
		}
	});
