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
					
					<li class="nav-link delimiter"></li>
					
					<li class="nav-link nav-link--secondary">
						<span ng-click="ctrl.toogleShowTeams()">Show Teams: {{$root.isTeamVisible ? 'Yes' : 'No'}}</span>
					</li>
					<li class="nav-link nav-link--secondary">
						<span ng-click="ctrl.toogleHideDuration()">Hide Duration: {{$root.isDurationHidden ? 'Yes': 'No'}}</span>
					</li>
					
					<li class="nav-link mobile-only">
						<span class="navigation__user" ng-if="$root.isAuthorised">
							{{$root.username}}
							<a href="#" ng-click="ctrl.logout()">Logout</a>
						</span>
						<a style="color: white" href="#" ng-if="!$root.isAuthorised" ng-click="ctrl.openAuthUrl()">Login</a>
					</li>
				</ul>
			</nav>
			
			<div class="navigation__user-container">
				<span class="navigation__user" ng-if="$root.isAuthorised">
					{{$root.username}}
					<a href="#" ng-click="ctrl.logout()">Logout</a>
				</span>
				<a style="color: white" href="#" ng-if="!$root.isAuthorised" ng-click="ctrl.openAuthUrl()">Login</a>
			</div>
			
		</div>	
			
	</header>
`;

// TODO: add top rated item to the header menu

const IS_TEAM_VISIBLE_KEY = 'isTeamVisible';
const IS_DURATION_HIDDEN = 'isDurationHidden'; 

function headerDirective () {

	return {
		restrict: 'E',
		replace: true,
		scope: true,
		template: TEMPLATE,
		controller: controller,
		controllerAs: 'ctrl'
	};
	
	function controller ($rootScope, $timeout, localStorageService, Auth) {
		var self = this;
		
		self.isMenuHidden = true;
		
		self.openAuthUrl = Auth.openAuthUrl;
		self.logout = Auth.logout;
		self.toogleShowTeams = toogleShowTeams;
		self.toogleHideDuration = toogleHideDuration;
		
		// Move to the next digest cycle
		$timeout(() => {
			$rootScope.isTeamVisible = localStorageService.get(IS_TEAM_VISIBLE_KEY);
			$rootScope.isDurationHidden = localStorageService.get(IS_DURATION_HIDDEN);
		});
		
		function toogleShowTeams () {
			$rootScope.isTeamVisible = !$rootScope.isTeamVisible;
			localStorageService.set(IS_TEAM_VISIBLE_KEY, $rootScope.isTeamVisible);
		}
		
		function toogleHideDuration () {
			$rootScope.isDurationHidden = !$rootScope.isDurationHidden;
			localStorageService.set(IS_DURATION_HIDDEN, $rootScope.isDurationHidden);
		}
	}
}
