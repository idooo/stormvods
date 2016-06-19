window.APP_NAME = 'StormVods';

var modules = require('./modules'),
	router = require('./router');

// Initial app config
angular
	.module(window.APP_NAME, modules)
	.config(configuration)
	.config(router)
	.run(init);

function configuration ($httpProvider, $locationProvider, $urlRouterProvider, CookieHelper) {

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
}

function init ($location, $rootScope, $window, Auth, Page) {
	Auth.authorise();

	$window.ga('create', 'UA-38569190-2', 'auto');

	$rootScope.isDurationHidden = true;
	$rootScope.isTeamVisible = true;

	$rootScope.$on('$stateChangeStart', () => {
		window.scrollTo(0, 0);
		Page.loading();
		Page.setTitle();
	});

	$rootScope.$on('$stateChangeSuccess', () => {
		$window.ga('send', 'pageview', $location.path());
	});
}
