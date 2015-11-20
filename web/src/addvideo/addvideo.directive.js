/* global angular */

angular
	.module(`${window.APP_NAME}.common`)
	.directive('addVideo', addVideoDirective);

const TEMPLATE = `
	<form name="ctrl.form" novalidate>
		
		<fieldset>
			<label>Link to video</label>
			<input type="text" name="url" ng-model="ctrl.url" required="">
		
			<label>Tournament</label>
			<input type="text" name="tournament" ng-model="ctrl.tournament" required="">
		</fieldset>
		
		<div>isUnique: {{ctrl.isYoutubeIdUnique}}</div>
		
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
	
	function controller ($scope, $http, $interval, Constants) {
		var self = this,
			isServerValidationInProgress = false,
			serverValidationInterval;
		
		self.youtubeId = '';
		self.isYoutubeIdUnique = false;
		
		self.submit = submit;
		
		$scope.$watch('ctrl.url', function (newValue) {
			self.youtubeId = youtubeUrlParser(newValue);
			if (self.youtubeId) serverValidation();
		});
		
		function submit () {
			if (!self.form.$valid && !self.youtubeId) return;
			$http.post(Constants.Api.VIDEO, {
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
		
		/**
		 * Validate youtube ID on the server side to prevent duplicates
		 */
		function serverValidation () {
			if (isServerValidationInProgress) {
				if (!serverValidationInterval) serverValidationInterval = $interval(serverValidation, 1000);
				return;
			} 	
			
			if (serverValidationInterval) {
				$interval.cancel(serverValidationInterval);
				serverValidationInterval = null;
			}
			isServerValidationInProgress = true;
			
			$http.get(`${Constants.Api.VALIDATE_VIDEO}?id=${self.youtubeId}`)
				.then((response) => {
					self.isYoutubeIdUnique = response.data;
				})
				.finally(() => isServerValidationInProgress = false);
			
		}

	}
		
}
