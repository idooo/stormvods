/* global angular */

angular
	.module(`${window.APP_NAME}.common`)
	.directive('addVideo', addVideoDirective);

const TEMPLATE = `
	<form name="ctrl.form" novalidate>
		
		<label>Link to video</label>
		<input type="text" name="url" ng-model="ctrl.url" required="">
		
		<span ng-show="ctrl.form.$submitted">
			<div ng-show="ctrl.form.url.$error.required">URL is required</div>
		</span>
		
		<input type="submit" value="Submit" ng-click="ctrl.submit()" >
		
	</form>
`;

function addVideoDirective () {

	return {
		restrict: 'E',
		replace: true,
		scope: true,
		template: TEMPLATE,
		controller: controller,
		controllerAs: 'ctrl'
	};
	
	function controller ($http, Constants) {
		var self = this;
		
		self.submit = submit;
		
		function submit () {
			if (!self.form.$valid) return;
			$http.post(Constants.Api.ADD_VIDEO, {
				url: self.url
			});
		}
	}
		
}
