angular
	.module(`${window.APP_NAME}.common`)
	.service('Page', pageService);

function pageService ($rootScope, $timeout) {
	var self = this;
	
	self.loaded = loaded;
	self.loading = loading;
	
	function loaded () {
		$rootScope.loading = false;
		$timeout(() => $rootScope.$digest());
	}
	
	function loading () {
		$rootScope.loading = true;
	}
}
