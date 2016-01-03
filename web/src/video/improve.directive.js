angular
	.module(`${window.APP_NAME}.common`)
	.directive('improveVideo', improveVideoDirective);

const TEMPLATE = `
	<div class="improve">
		
		<div class="improve__question-container" ng-show="isInformationCorrect">
			<span class="improve__question">{{TYPES[type].questionCorrectness.message}}?</span>
			
			<button ng-click="answerCorrectness(true)">Yes</button> 
			<button ng-click="answerCorrectness(false)">No</button>
		</div>
		
		<div class="improve__question-container" ng-show="!isInformationCorrect">
			
			<div ng-if="info[type].length && isSuggestionCorrect">
				<span class="improve__question">{{TYPES[type].suggestion.message}}?</span>
				
				<button ng-click="answerSuggestion(true)">Yes</button>
				<button ng-click="answerSuggestion(false)">No</button>
			</div>
	
			<div 
				class="improve__question-advanced-container" 
				ng-show="!info[type].length || isSuggestionCorrect === false">
				
				<span class="improve__question">{{TYPES[type].questionLookup.message}}?</span>
				
				<select 
					ng-show="TYPES[type].questionLookup.isSelect"
					ng-options="k as v for (k, v) in TYPES[type].questionLookup.options"
					ng-model="entity">
					<option value="{{k}}">{{v}}</option>
				</select>
				
				<auto-complete
					ng-show="!TYPES[type].questionLookup.isSelect" 
					model="entity" 
					lookup="{{TYPES[type].questionLookup.lookup}}" 
					limit="{{TYPES[type].questionLookup.limit}}">
				</auto-complete>
					
				<button ng-show="entity.length || entity" ng-click="update(2, entity)">Yep</button>
			</div>
			
		</div>
		
	</div>
`;

const UPDATE_BY_ID = 1;
const UPDATE_BY_VALUES = 2;

/**
 * We have to adjust logic depending on the type of improve field 
 */
const TYPES = require('./improve.directive.types');

function improveVideoDirective () {

	return {
		restrict: 'E',
		replace: true,
		scope: {
			video: '=',
			type: '@',
			info: '='
		},
		template: TEMPLATE,
		controller: controller
	};
	
	function controller ($scope, $http, $element, $timeout, Constants) {
		
		$scope.TYPES = angular.merge({}, TYPES);
		$scope.isInformationCorrect = true;
		$scope.isSuggestionCorrect = true;
		$scope.isAnswered = false;
		
		$scope.answerCorrectness = answerCorrectness;
		$scope.answerSuggestion = answerSuggestion;
		$scope.update = update;
		
		var listener = $scope.$watch('video', function (newValue) {
			if (newValue && newValue._id) {
				
				if (Array.isArray($scope.video[$scope.type])) $scope.isInformationCorrect = false;
				
				$timeout(function () {
					var data = $scope.TYPES[$scope.type];
					data.questionCorrectness.message += ' ' + data.questionCorrectness.func($scope.video);
					data.suggestion.message += ' ' + data.suggestion.func($scope.info);
					
					if (data.questionLookup.isSelect) {
						data.questionLookup.options = data.questionLookup.options(Constants);
					}
				}, 250);
				listener();
			}
		});
		
		function answerCorrectness (isCorrect) {
			$scope.isInformationCorrect = isCorrect;
			if (isCorrect) {
				// Send _id or code (for stage and format only)
				update(UPDATE_BY_ID, $scope.video[$scope.type]._id || $scope.video[$scope.type].code);
			}
			// Set focus to autocomplete field if there is no suggestion
			else if (!$scope.info[$scope.type].length) {
				$timeout(() => $element.find('input')[0].focus());
			}
		}
		
		function answerSuggestion (isCorrect) {
			$scope.isSuggestionCorrect = isCorrect;
			if (isCorrect) {
				var data = $scope.info[$scope.type][0],
					entity;
					
				if (data._id) entity = data._id;
				else entity = data[$scope.type].map(item => item._id);
				
				update(UPDATE_BY_ID, entity);
			}
			// Set focus on autocomplete field
			else $timeout(() => $element.find('input')[0].focus());
		}
		
		function update (type, entity) {
			if ($scope.isAnswered) return;
			
			$scope.info.answeredQuestions += 1;
			
			var data = {
				videoId: $scope.video._id,
				entityType: $scope.type
			};

			if (type === UPDATE_BY_ID) {
				data.entityId = entity;
				$http.post(Constants.Api.VOTE, data);
			}
			
			// TODO: Implement
			else if (type === UPDATE_BY_VALUES) data.values = entity; 
			
			$http.put(`${Constants.Api.VIDEO}/${$scope.video._id}`, data)
				.then(() => {
					// TODO: Handle errors?
					// self.additionalInfo = response.data;
				});
		}
	}
}
