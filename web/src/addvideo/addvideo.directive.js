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
	
	function controller ($scope, $http, Constants) {
		var self = this;
		
		self.submit = submit;
		self.youtubeId = '';
		
		$scope.$watch('ctrl.url', function (newValue) {
			self.youtubeId = youtubeUrlParser(newValue);
		});
		
		// a2Nj9BlJmEs
		// https://www.youtube.com/watch?v=a2Nj9BlJmEs
		
		function submit () {
			if (!self.form.$valid && !self.youtubeId) return;
			$http.post(Constants.Api.ADD_VIDEO, {
				url: self.url,
				youtubeId: self.youtubeId
			});
		}
		
		function youtubeUrlParser (url) {
			if (!url) return false;
			var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
			var match = url.match(regExp);
			return (match && match[1].length === 11) ? match[1] : false;
		}

	}
		
}
