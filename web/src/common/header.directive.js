/* global angular */

angular
	.module(`${window.APP_NAME}.common`)
	.directive('appHeader', headerDirective);

const TEMPLATE = `
	<header class="navigation" role="banner">
		
		<div class="navigation-wrapper">
			
			<a href="#" ui-sref="index" class="logo">
				<img src="/dist/images/logo.png" alt="Logo Image"> 
			</a>
			
			<a href="#" class="navigation-menu-button" ng-click="ctrl.isMenuHidden = !ctrl.isMenuHidden">MENU</a>
			
			<nav role="navigation">
				<ul class="navigation-menu" ng-class="{show: !ctrl.isMenuHidden}">
					<li class="nav-link" ng-if="ctrl.user.role == 10">
						<a href="#" ui-sref="zone">Secret Zone</a>
					</li>
				</ul>
			</nav>
			
			<div class="navigation-tools">
				
				<div style="color: white" ng-if="$root.isAuthorised">
					Welcome, {{$root.username}}
				</div>
				<a style="color: white" href="#" ng-if="!$root.isAuthorised" ng-click="ctrl.openAuthUrl()">Login</a>
				
			</div>
		
		</div>	
			
	</header>
`;

function headerDirective () {

	return {
		restrict: 'E',
		replace: true,
		scope: true,
		template: TEMPLATE,
		controller: controller,
		controllerAs: 'ctrl'
	};
	
	function controller (Auth) {
		var self = this;
		
		self.isMenuHidden = true;
		self.openAuthUrl = Auth.openAuthUrl;
	}
		
}
