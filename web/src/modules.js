// Project third-party dependencies
var modules = [
	'ngAnimate',
	'ui.router',
	'LocalStorageModule'
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
require('./common/constants.js');
require('./common/auth.service.js');
require('./common/header.directive.js');
require('./common/checkbox.directive.js');
require('./common/video.directive.js');
require('./common/autocomplete.directive.js');
require('./common/spinner.directive.js');
require('./index/index.page.js');
require('./callback/callback.page.js');
require('./addvideo/addvideo.page.js');
require('./video/video.page.js');
require('./admin/zone.page');
require('./sidebar/sidebar.directive');

module.exports = modules.concat(appModules);