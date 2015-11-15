/* global angular */

angular
	.module(`${window.APP_NAME}.common`)
	.directive('appHeader', headerDirective);

const TEMPLATE = `
	<header class="navigation" role="banner">
		
		<div class="navigation-wrapper">
			
			<a href="#" ui-sref="index" class="logo">
				<img src="https://raw.githubusercontent.com/thoughtbot/refills/master/source/images/placeholder_logo_1.png" alt="Logo Image"> 
			</a>
			
			<a href="#" class="navigation-menu-button" ng-click="ctrl.isMenuHidden = !ctrl.isMenuHidden">MENU</a>
			
			<nav role="navigation">
				<ul class="navigation-menu" ng-class="{show: !ctrl.isMenuHidden}">
					<li class="nav-link" ng-repeat="link in ctrl.links">
						<a href="#" ui-sref="{{link.state}}">{{link.caption}}</a>
					</li>
				</ul>
			</nav>
			
			<div class="navigation-tools">
				<auth></auth>
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
	
	function controller () {
		this.isMenuHidden = true;
		
		this.links = [
			{
				state: 'addvideo',
				caption: 'Add video'
			}	
		];
	}
		
}
