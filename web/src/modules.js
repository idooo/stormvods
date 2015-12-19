// Project third-party dependencies
var modules = [
	'ngAnimate',
	'ngSanitize',
	'ui.router',
	'ui.select', 
	'angularMoment'
];

// Application modules list
var appModules = [
	`${window.APP_NAME}.core`,
	`${window.APP_NAME}.pages`,
	`${window.APP_NAME}.common`
];

// Init modules
appModules.forEach((moduleName) => angular.module(moduleName, []));

// App modules
require('./common/constants');
require('./common/auth.service');
require('./common/header.directive');
require('./common/footer.directive');
require('./common/checkbox.directive');
require('./common/video.directive');
require('./common/videolist.directive');
require('./common/autocomplete.directive');
require('./common/spinner.directive');
require('./common/rating.directive');

// Pages
require('./index/index.page');
require('./top/top.page');
require('./callback/callback.page');
require('./addvideo/addvideo.page');
require('./video/video.page');
require('./admin/zone.page');
require('./sidebar/sidebar.directive');
require('./tournament/tournament.page');
require('./tournament/tournaments.page');
require('./team/team.page');
require('./team/teams.page');
require('./caster/caster.page');
require('./caster/casters.page');

module.exports = modules.concat(appModules);