// Project third-party dependencies
const modules = [
	'ngAnimate',
	'ngSanitize',
	'ui.router',
	'ui.select',
	'angularMoment',
	'LocalStorageModule',
	'ngDialog'
];

// Application modules list
const appModules = [
	`${window.APP_NAME}.core`,
	`${window.APP_NAME}.pages`,
	`${window.APP_NAME}.common`
];

// Create modules
appModules.forEach(moduleName => angular.module(moduleName, []));

// Common modules
// require('./router');
require('./constants');
require('./cookies');
require('./common/auth.service');
require('./common/page.service');
require('./common/header.component');
require('./common/footer.component');
require('./common/autocomplete.directive');
require('./common/spinner.component');
require('./common/rating.component');
require('./common/topselector.component');
require('./common/pagination.component');

// require('./top/top.page');
// require('./error/error.page');
require('./callback/callback.page');
require('./addvideo/addvideo.page');
require('./addvideo/videourls.component');
require('./video/video.page');
require('./video/video.directive');
require('./video/improve.directive');
require('./video/improve.block.directive');
require('./videolist/videolist.component');
require('./videolist/videolist.item.component');
require('./tournament/tournament.page');
require('./tournament/tournaments.page');
require('./team/team.page');
require('./team/teams.page');
require('./caster/caster.page');
require('./caster/casters.page');

require('./admin/zone.page');
require('./admin/users.zone.component');
require('./admin/videos.zone.component');
require('./admin/teams.zone.component');
require('./admin/tournaments.zone.component');
require('./admin/casters.zone.component');

require('./sidebar/addvideo.sidebar.component');
require('./sidebar/addvideorules.sidebar.component');
require('./sidebar/streamers.sidebar.component');
require('./sidebar/tournament.sidebar.component');
require('./sidebar/casters.sidebar.component');

import IndexPageComponent from './index/index.page';
import TopPageComponent from './top/top.page';
import ErrorPageComponent from './error/error.page';

angular
	.module(`${window.APP_NAME}.pages`)
	.component('indexPage', IndexPageComponent)
	.component('topPage', TopPageComponent)
	.component('errorPage', ErrorPageComponent);


const MODULES_LIST = modules.concat(appModules);

export default MODULES_LIST;
