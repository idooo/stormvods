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
require('./common/auth.service.js');
require('./common/auth.directive.js');
require('./common/header.directive.js');
require('./common/video.directive.js');
require('./index/index.page.js');
require('./callback/callback.page.js');

module.exports = modules.concat(appModules);