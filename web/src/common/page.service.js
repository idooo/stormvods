const TITLE = 'Storm Vods';

angular
	.module(`${window.APP_NAME}.common`)
	.service('Page', pageService);

function pageService ($rootScope, $timeout) {
	var self = this;
	
	self.loaded = loaded;
	self.loading = loading;
	self.setTitle = setTitle;
	
	function loaded () {
		$rootScope.loading = false;
		$timeout(() => $rootScope.$digest());
	}
	
	function loading () {
		$rootScope.loading = true;
	}
	
	function setTitle (str) {
		if (!str) $rootScope.title = TITLE;
		else $rootScope.title = `${str} - ${TITLE}`;
	}
}
