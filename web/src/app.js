window.APP_NAME = 'StormVods';

var modules = require('./modules');

// Initial app config
angular
	.module(window.APP_NAME, modules)
	.config(configuration)
	.run(init);

function configuration ($httpProvider, $locationProvider, $stateProvider, $urlRouterProvider, CookieHelper) {

	$httpProvider.interceptors.push($q => {
		return {
			responseError: function (response) {
				if (response.status === 403) {
					CookieHelper.deleteAllCookies();
					window.location.assign(`/#/error/${response.data.message}`);
				}
				return $q.reject(response);
			}
		};
	});

	$locationProvider.html5Mode(true);
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
		.state('error', {
			url: '/error/:error',
			template: '<error-page/>'
		})
		.state('zone', {
			url: '/zone',
			template: '<zone-page/>'
		});
}

function init ($location, $rootScope, $window, Auth, Page) {
	Auth.authorise();

	$window.ga('create', 'UA-38569190-2', 'auto');

	$rootScope.isDurationHidden = true;
	$rootScope.isTeamVisible = false;

	$rootScope.$on('$stateChangeStart', () => {
		window.scrollTo(0, 0);
		Page.loading();
		Page.setTitle();
	});

	$rootScope.$on('$stateChangeSuccess', () => {
		$window.ga('send', 'pageview', $location.path());
	});
}
