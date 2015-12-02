/* global angular */

angular
	.module(`${window.APP_NAME}.common`)
	.directive('videoList', videoListDirective);

const TEMPLATE = `
	<div>
		<div ng-repeat="video in videos" ng-if="!skipFirst || skipFirst && !$first">
			<a href="#" ui-sref="video({id: video._id})">{{video.youtubeId}}</a>
			-
			{{video.tournament.name}} 
			- 
			{{video.teams.teams[0].name}} vs {{video.teams.teams[1].name}}	
		</div>
	</div>
`;

function videoListDirective () {

	return {
		restrict: 'E',
		replace: true,
		scope: {
			videos: '=',
			skipFirst: '@'
		},
		template: TEMPLATE,
		controller: controller,
		controllerAs: 'ctrl'
	};
	
	function controller ($scope) {
		this.toggle = () => $scope.value = !$scope.value;
	}
}
