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
require('./router');
require('./constants');
require('./cookies');
require('./common/auth.service');
require('./common/page.service');
require('./common/header.component.js');
require('./common/footer.component.js');
require('./common/autocomplete.directive');
require('./common/spinner.component.js');
require('./common/rating.component.js');
require('./common/topselector.component.js');
require('./common/pagination.component');

require('./index/index.page');
require('./top/top.page');
require('./error/error.page');
require('./callback/callback.page');
require('./addvideo/addvideo.page');
require('./addvideo/videourls.component');
require('./video/video.page');
require('./video/video.directive');
require('./video/improve.directive');
require('./video/improve.block.directive');
require('./videolist/videolist.component.js');
require('./videolist/videolist.item.component.js');
require('./tournament/tournament.page');
require('./tournament/tournaments.page');
require('./team/team.page');
require('./team/teams.page');
require('./caster/caster.page');
require('./caster/casters.page');
require('./admin/zone.page');
require('./admin/users.zone.component');
require('./admin/videos.zone.component');
require('./admin/entities.zone.component');
require('./admin/tournaments.zone.component');

require('./sidebar/addvideo.sidebar.component');
require('./sidebar/addvideorules.sidebar.component');
require('./sidebar/streamers.sidebar.component');

module.exports = modules.concat(appModules);
