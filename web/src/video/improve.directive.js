angular
	.module(`${window.APP_NAME}.common`)
	.directive('improveVideo', improveVideoDirective);

const TEMPLATE = `
	<div>
		
		Is this vod from "{{video.tournament.name}}" tournament?
		
		<button ng-click="answer(true)">Yes</button> <button ng-click="answer(false)">No</button>
		
		<div ng-show="!isInformationCorrect">
			From what tournament then?
			<auto-complete model="tournament" lookup="tournament" limit="1"></auto-complete>
		</div>
		
	</div>
`;

const TYPES = {
	tournament: {
		
	}
};

function improveVideoDirective () {

	return {
		restrict: 'E',
		replace: true,
		scope: {
			video: '=',
			type: '@'
		},
		template: TEMPLATE,
		controller: controller
	};
	
	function controller ($scope, $http, Constants) {
		$scope.isInformationCorrect = true;
		$scope.answer = answer;
		
		console.log($scope.type)
		
		function answer (isCorrect) {
			$scope.isInformationCorrect = isCorrect;
		}
	}
}
