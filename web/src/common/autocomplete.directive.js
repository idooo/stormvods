angular
	.module(`${window.APP_NAME}.common`)
	.directive('autoComplete', autoCompleteDirective);

const TEMPLATE = `
	<div class="autocomplete" ng-show="ctrl.items && ctrl.items.length">
		<ul class="autocomplete__list">
			<li class="autocomplete__item" ng-repeat="item in ctrl.items" ng-click="ctrl.select(item)">{{item.name}}</li>
		</ul>
	</div>
`;

const DEBOUNCE_LOOKUP = 1000;
const MIN_LENGTH = 3;

function autoCompleteDirective () {

	return {
		require: 'ngModel',
		restrict: 'A',
		replace: true,
		scope: {
			lookup: '@',
			model: '=ngModel'
		},
		link: link,
		controller: controller,
		controllerAs: 'ctrl'
	};
	
	function link (scope, element, attrs, controller) {
		controller.$options = {
			updateOnDefault: true,
			debounce: {
				'default': DEBOUNCE_LOOKUP
			}
		};
	}
	
	function controller ($scope, $element, $compile, $timeout, $http, Constants) {
		var self = this,
			justClicked = false,
			template = angular.element(TEMPLATE),
			endpoint = `${Constants.Api.LOOKUP}/${$scope.lookup}`;
			
		self.items = [];
		self.select = select;
		
		$scope.$watch('model', function (newValue, oldValue) {
			if (!newValue || newValue === oldValue || justClicked || newValue.length < MIN_LENGTH) return;
			
			$http.get(`${endpoint}?query=${newValue}`)
				.then(response => self.items = response.data.values.filter(item => item.name !== newValue));
			
		});
		
		$element.after(template);
		$compile(template)($scope);
		
		$element.on('blur', function () {
			justClicked = true;
			$timeout(function () {
				self.items = [];
				justClicked = false;
			}, 150);
		});
		
		function select (item) {
			$scope.model = item.name;	
		}
	}
}
