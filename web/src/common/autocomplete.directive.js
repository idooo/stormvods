var _debounce = require('lodash/function/debounce');

angular
	.module(`${window.APP_NAME}.common`)
	.directive('autoComplete', autoCompleteDirective);

const TEMPLATE = `
	<div ng-show="ctrl.items">
		<ul>
			<li ng-repeat="item in ctrl.items" ng-click="ctrl.select(item)">{{item.name}}</li>
		</ul>
	</div>
`;

const DEBOUNCE_LOOKUP = 1000;

function autoCompleteDirective () {

	return {
		require: 'ngModel',
		restrict: 'A',
		replace: true,
		scope: {
			lookup: '@',
			model: '=ngModel'
		},
		controller: controller,
		controllerAs: 'ctrl'
	};
	
	function controller ($scope, $element, $compile, $http, Constants) {
		var self = this,
			template = angular.element(TEMPLATE),
			endpoint = `${Constants.Api.LOOKUP}/${$scope.lookup}`;
			
		self.items = [];
		self.select = select;
		
		$scope.$watch('model', _debounce(function (newValue, oldValue) {
			if (!newValue || newValue === oldValue) return;
			
			$http.get(`${endpoint}?query=${newValue}`)
				.then(response => self.items = response.data.filter(item => item.name !== newValue));
			
		}, DEBOUNCE_LOOKUP));
		
		$element.after(template);
		$compile(template)($scope);
		
		$element.on('blur', () => self.items = []);
		
		function select (item) {
			$scope.model = item.name;	
		}
	}
}
