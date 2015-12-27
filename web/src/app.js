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
		.state('tournament', {
			url: '/tournament/:id',
			template: '<tournament-page/>'
		})
		.state('tournaments', {
			url: '/tournaments',
			template: '<tournaments-page/>'
		})
		.state('team', {
			url: '/team/:id',
			template: '<team-page/>'
		})
		.state('teams', {
			url: '/teams',
			template: '<teams-page/>'
		})
		.state('caster', {
			url: '/caster/:id',
			template: '<caster-page/>'
		})
		.state('casters', {
			url: '/casters',
			template: '<casters-page/>'
		})
		.state('top', {
			url: '/top/:mode',
			template: '<top-page/>'
		})
		.state('zone', {
			url: '/zone',
			template: '<zone-page/>'
		});
}

function init ($rootScope, Page, Auth) {
	Auth.authorise();
	
	$rootScope.$on('$stateChangeStart', () => {
		window.scrollTo(0, 0);
		Page.loading();
	});
	
	$rootScope.isDurationHidden = true;
	$rootScope.isTeamVisible = false;
}
