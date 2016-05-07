angular
	.module(`${window.APP_NAME}.common`)
	.directive('improveBlock', improveBlockDirective);

const TEMPLATE = `
	<div class="expander">

		<div href="#"
			class="expander__row"
			ng-class="{'expander__row--content-hidden': !isImproveBlockVisible}">

			<span class="expander__trigger" ng-click="toggleImproveVideoBlock()" >Improve video</span>

			<div class="expander__author">Added by {{object.author.name}}</div>
		</div>

		<div class="expander__content" ng-show="isImproveBlockVisible">

			<div ng-hide="isImproveBlockLoaded" class="expander__loading">
				<div class="spinner"></div>
				<span>Loading</span>
			</div>

			<div ng-show="isImproveBlockLoaded">

				<div ng-repeat="type in questions">
					<improve-video
						ng-show="additionalInfo.answeredQuestions === $index"
						type="type"
						video="object"
						info="additionalInfo">
					</improve-video>
				</div>

				<div
					ng-show="additionalInfo.answeredQuestions === questions.length"
					class="expander__thankyou">

					<span ng-if="questions.length">
						Thank you for improving quality of content here!
					</span>

					<span ng-if="!questions.length">
						You already improved this video. Thank you
					</span>
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

		scope.questions = ['tournament', 'stage', 'format', 'teams', 'casters'];

		scope.$watch('object', function (object) {
			if (!object || !object._id) return;
			scope.questions = scope.questions.filter(key => !object[key].isVoted);
		});

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
