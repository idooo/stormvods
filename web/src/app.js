/* global angular */

window.APP_NAME = 'hotsVideos';

var modules = require('./modules');

// Initial app config
angular
	.module(window.APP_NAME, modules)
	.config(configuration)
	.run(init);
	
function configuration ($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('app', {
			url: '/',
			template: '<index-page/>'
		})
		.state('callback', {
			url: '/callback',
			template: '<callback-page/>'
		});
}

function init () {

}
