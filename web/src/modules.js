// Project third-party dependencies
var modules = [
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
require('./common/auth.directive.js');
require('./common/header.directive.js');
require('./index/index.page.js');
require('./callback/callback.page.js');
require('./addvideo/addvideo.page.js');
require('./addvideo/addvideo.directive.js');
require('./video/video.page.js');

module.exports = modules.concat(appModules);