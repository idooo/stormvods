angular
	.module(`${window.APP_NAME}.common`)
	.directive('improveVideo', improveVideoDirective);

const TEMPLATE = `
	<div>
		
		<div ng-show="isInformationCorrect">
			{{TYPES[type].questionCorrectness.message}}?
			
			<button ng-click="answerCorrectness(true)">Yes</button> 
			<button ng-click="answerCorrectness(false)">No</button>
		</div>
		
		<div ng-show="!isInformationCorrect">
			
			<div ng-if="info[type].length && isSuggestionCorrect">
				{{TYPES[type].suggestion.message}}?
				
				<button ng-click="answerSuggestion(true)">Yes</button>
				<button ng-click="answerSuggestion(false)">No</button>
			</div>
	
			<div ng-if="!info[type].length || isSuggestionCorrect === false">
				{{TYPES[type].questionLookup.message}}?
				
				<select 
					ng-show="TYPES[type].questionLookup.isSelect"
					ng-options="k as v for (k, v) in TYPES[type].questionLookup.options"
					ng-model="entity">
					<option value="{{k}}">{{v}}</option>
				</select>
				
				<auto-complete
					ng-if="!TYPES[type].questionLookup.isSelect" 
					model="entity" 
					lookup="{{TYPES[type].questionLookup.lookup}}" 
					limit="{{TYPES[type].questionLookup.limit}}">
				</auto-complete>
					
				<button ng-show="entity.length || entity" ng-click="update(2, entity)">Yep</button>
			</div>
			
		</div>
		
	</div>
`;

const UPDATE_BY_TYPE = 0;
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
	
	function controller ($scope, $http, $timeout, Constants) {
		
		$scope.TYPES = angular.merge({}, TYPES);
		$scope.isInformationCorrect = true;
		$scope.isSuggestionCorrect = true;
		
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
			if (isCorrect) update(UPDATE_BY_TYPE, $scope.type);
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
		}
		
		function update (type, entity) {
			var data = {
				field: $scope.type
			};
			
			if (type === UPDATE_BY_ID) data.id = entity;
			else if (type === UPDATE_BY_VALUES) data.values = entity; 
			
			$http.put(`${Constants.Api.VIDEO}/${$scope.video._id}`, data)
				.then(response => {
					//self.additionalInfo = response.data;
				});
		}
	}
}
