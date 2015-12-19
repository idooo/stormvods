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
				<ul class="navigation-menu" ng-class="{show: !ctrl.isMenuHidden}" ng-click="ctrl.isMenuHidden = true">
					<li class="nav-link" ng-if="ctrl.user.role == 10">
						<a href="#" ui-sref="zone">Secret Zone</a>
					</li>
					<li class="nav-link">
						<a href="#" ui-sref="tournaments">Tournaments</a>
					</li>
					<li class="nav-link">
						<a href="#" ui-sref="teams">Teams</a>
					</li>
					<li class="nav-link">
						<a href="#" ui-sref="casters">Casters</a>
					</li>
					<li class="nav-link mobile-only">
					
						<span style="color: white" ng-if="$root.isAuthorised">
							Welcome, {{$root.username}}
							<a href="#" ng-click="ctrl.logout()">Log out</a>
						</span>
						<a style="color: white" href="#" ng-if="!$root.isAuthorised" ng-click="ctrl.openAuthUrl()">Login</a>
						
					</li>
				</ul>
			</nav>
			
			<div class="navigation-tools">
				
				<div style="color: white" ng-if="$root.isAuthorised">
					Welcome, {{$root.username}}
					<a href="#" ng-click="ctrl.logout()">Log out</a>
				</div>
				<a style="color: white" href="#" ng-if="!$root.isAuthorised" ng-click="ctrl.openAuthUrl()">Login</a>
				
			</div>
		
		</div>	
			
	</header>
`;

// TODO: add top rated item to the header menu

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
		self.logout = Auth.logout;
	}
}
