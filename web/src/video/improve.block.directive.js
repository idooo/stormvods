angular
	.module(`${window.APP_NAME}.common`)
	.directive('improveBlock', improveBlockDirective);

const TEMPLATE = `
	<div class="expander">
		<a href="#" 
			class="expander__trigger"
			ng-click="toggleImproveVideoBlock()" 
			ng-class="{'expander__trigger--content-hidden': !isImproveBlockVisible}">Improve video</a>
		<div class="expander__content" ng-show="isImproveBlockVisible">
			
			<improve-video
				ng-show="additionalInfo.answeredQuestions === 0"
				type="tournament"
				video="object"
				info="additionalInfo">
			</improve-video>

			<improve-video
				ng-show="additionalInfo.answeredQuestions === 1"
				type="stage"
				video="object"
				info="additionalInfo">
			</improve-video>

			<improve-video
				ng-show="additionalInfo.answeredQuestions === 2"
				type="format"
				video="object"
				info="additionalInfo">
			</improve-video>

			<improve-video
				ng-show="additionalInfo.answeredQuestions === 3"
				type="teams"
				video="object"
				info="additionalInfo">
			</improve-video>

			<improve-video
				ng-show="additionalInfo.answeredQuestions === 4"
				type="casters"
				video="object"
				info="additionalInfo">
			</improve-video>
			
		</div>
	</div>
`;

// TODO: add loading

function improveBlockDirective ($http, Constants) {

	return {
		restrict: 'E',
		replace: true,
		template: TEMPLATE,
		link: link
	};
	
	function link (scope) {
		
		scope.additionalInfo = {};
		scope.isImproveBlockVisible = false;
		
		scope.toggleImproveVideoBlock = toggleImproveVideoBlock;
		
		function toggleImproveVideoBlock () {
			scope.isImproveBlockVisible = !scope.isImproveBlockVisible;
			
			if (!scope.additionalInfo._id) {
				$http.get(`${Constants.Api.VIDEO}/${scope.object._id}/info`)
					.then(response => {
						scope.additionalInfo = response.data;
						scope.additionalInfo.answeredQuestions = 0;
					});
			}
		}
	}
}
