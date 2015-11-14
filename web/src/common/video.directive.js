/* global angular */

angular
	.module(`${window.APP_NAME}.common`)
	.directive('videoContainer', videoDirective);

const TEMPLATE = `
	<div>
		<iframe 
			width="560" 
			height="315" 
			src="https://www.youtube-nocookie.com/embed/IwoFyRYc_V0?rel=0&amp;controls=0&amp;showinfo=0" 
			frameborder="0" 
			allowfullscreen>
		</iframe>
			
		<div>
			<input type="checkbox" ng-model="ctrl.hideControls">hide controls
		</div>	
	</div>
`;

function videoDirective () {

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
	}
		
}
