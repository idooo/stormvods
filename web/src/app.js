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
		.state('index', {
			url: '/',
			template: '<index-page/>'
		})
		.state('callback', {
			url: '/callback',
			template: '<callback-page/>'
		})
		.state('addvideo', {
			url: '/addvideo',
			template: '<add-video-page/>'
		})
		.state('video', {
			url: '/video/:id',
			template: '<video-page/>'
		})
		.state('zone', {
			url: '/zone',
			template: '<zone-page/>'
		});
}

function init () {

}
