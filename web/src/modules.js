// Project third-party dependencies
var modules = [
	'ngAnimate',
	'ngSanitize',
	'ui.router',
	'ui.select',
	'angularMoment',
	'LocalStorageModule',
	'ngDialog'
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
require('./cookies');
require('./common/auth.service');
require('./common/page.service');
require('./common/header.component.js');
require('./common/footer.component.js');
require('./common/videolist.component.js');
require('./common/videolist.item.component.js');
require('./common/autocomplete.directive');
require('./common/spinner.component.js');
require('./common/rating.component.js');
require('./common/topselector.component.js');

require('./index/index.page');
require('./top/top.page');
require('./error/error.page');
require('./callback/callback.page');
require('./addvideo/addvideo.page');
require('./addvideo/videourls.directive');
require('./video/video.page');
require('./video/video.directive');
require('./video/improve.directive');
require('./video/improve.block.directive');
require('./sidebar/sidebar.directive');
require('./tournament/tournament.page');
require('./tournament/tournaments.page');
require('./team/team.page');
require('./team/teams.page');
require('./caster/caster.page');
require('./caster/casters.page');
require('./admin/zone.page');
require('./admin/users.zone.directive');
require('./admin/videos.zone.directive');
require('./admin/entities.zone.component');
require('./admin/tournaments.zone.component');

module.exports = modules.concat(appModules);
