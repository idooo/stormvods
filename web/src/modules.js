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

// Create modules
appModules.forEach((moduleName) => angular.module(moduleName, []));

// Common modules
require('./constants');
require('./common/auth.service');
require('./common/page.service');
require('./common/header.directive');
require('./common/footer.directive');
require('./common/checkbox.directive');
require('./common/video.directive');
require('./common/videolist.directive');
require('./common/autocomplete.directive');
require('./common/spinner.directive');
require('./common/rating.directive');

// Page specific 
require('./index/index.page');
require('./top/top.page');
require('./callback/callback.page');
require('./addvideo/addvideo.page');
require('./video/video.page');
require('./video/improve.directive');
require('./admin/zone.page');
require('./sidebar/sidebar.directive');
require('./tournament/tournament.page');
require('./tournament/tournaments.page');
require('./team/team.page');
require('./team/teams.page');
require('./caster/caster.page');
require('./caster/casters.page');

module.exports = modules.concat(appModules);