angular
	.module(`${window.APP_NAME}.common`)
	.directive('autoComplete', autoCompleteDirective);

const DEBOUNCE_LOOKUP = 500;
const MIN_LENGTH = 3;

const TEMPLATE = `
	<div>
		<ui-select 
			tagging 
			tagging-label="(add)" 
			multiple 
			limit="{{limit}}"
			ng-model="$parent.model" 
			theme="select2">
			
			<ui-select-match>{{$item}}</ui-select-match>
			<ui-select-choices 
				refresh="getValues($select.search)"
				refresh-delay="${DEBOUNCE_LOOKUP}"
				repeat="item in items">
				{{item}}
			</ui-select-choices>
		</ui-select>
	</div>
`;

function autoCompleteDirective () {

	return {
		restrict: 'E',
		replace: true,
		scope: {
			lookup: '@',
			limit: '@',
			model: '='
		},
		template: TEMPLATE,
		controller: controller
	};
	
	function controller ($scope, $http, Constants) {
		var endpoint = `${Constants.Api.LOOKUP}/${$scope.lookup}`;
			
		$scope.items = [];
		$scope.getValues = function (newValue) {
			if (!newValue || newValue.length < MIN_LENGTH) return; 
			$http.get(`${endpoint}?query=${newValue}`)
				.then(response => {
					$scope.items = response.data.values.map(i => i.name);
				});
		};
	}
}
