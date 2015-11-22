/* global angular */

angular
	.module(`${window.APP_NAME}.pages`)
	.directive('addVideoPage', addVideoPage);

const TEMPLATE = `
	<h1>Add video page</h1>
	
	<section class="add-video-page__section-add-video">
		
		<form name="ctrl.form" novalidate>
			
			<fieldset>
				<label>Link to video</label>
				<input type="text" name="url" ng-model="ctrl.url" required="">
			
				<label>Tournament</label>
				<input auto-complete type="text" name="tournament" ng-model="ctrl.tournament" lookup="tournament">
				
			</fieldset>
			
			<div>isUnique: {{ctrl.isYoutubeIdUnique}}</div>
			
			<span ng-show="ctrl.form.$submitted">
				<div ng-show="ctrl.form.url.$error.required">URL is required</div>
			</span>
			
			{{ctrl.form.$valid}}
			
			<br>
			
			<input type="submit" value="Submit" ng-click="ctrl.submit()" >
			
		</form>
		
	</section>
`;

function addVideoPage () {

	return {
		restrict: 'E',
		scope: true,
		template: TEMPLATE,
		link: link,
		controller: controller,
		controllerAs: 'ctrl'
	};
	
	function link () {

	}
	
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
			console.log(self.form.$valid, self.youtubeId )
			if (!self.form.$valid && !self.youtubeId) return;
			$http.post(Constants.Api.VIDEO, {
				url: self.url,
				youtubeId: self.youtubeId,
				tournament: self.tournament
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
