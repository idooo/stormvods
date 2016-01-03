angular
	.module(`${window.APP_NAME}.common`)
	.directive('improveBlock', improveBlockDirective);

const TEMPLATE = `
	<div class="expander">
	
		<div href="#" 
			class="expander__row"
			ng-class="{'expander__row--content-hidden': !isImproveBlockVisible}">
			
			<span class="expander__trigger" ng-click="toggleImproveVideoBlock()" >Improve video</span>
		</div>
		
		<div class="expander__content" ng-show="isImproveBlockVisible">
			
			<div ng-hide="isImproveBlockLoaded" class="expander__loading">
				<div class="spinner"></div>	
				<span>Loading</span>
			</div>
			
			<div ng-show="isImproveBlockLoaded">
				
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
				
				<div 
					ng-show="additionalInfo.answeredQuestions === 5"
					class="expander__thankyou">
					Thank you for improving quality of content here!
				</div>
			
			</div>
				
		</div>
		
	</div>
`;

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
		scope.isImproveBlockLoaded = false;
		
		scope.toggleImproveVideoBlock = toggleImproveVideoBlock;
		
		function toggleImproveVideoBlock () {
			scope.isImproveBlockVisible = !scope.isImproveBlockVisible;
			
			// load video info only once			
			if (scope.additionalInfo._id) return;
				
			$http.get(`${Constants.Api.VIDEO}/${scope.object._id}/info`)
				.then(response => {
					scope.additionalInfo = response.data;
					scope.additionalInfo.answeredQuestions = 0;
					scope.isImproveBlockLoaded = true;
				});
		}
	}
}
