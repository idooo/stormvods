angular
	.module(`${window.APP_NAME}.common`)
	.directive('checkbox', checkboxDirective);

const TEMPLATE = `
	<span class="checkbox">
		<span class="checkbox__checker" 
			  ng-class="{'checkbox__checker--active': value}"
			  ng-click="ctrl.toggle()"></span>
		<label class="checkbox__label" ng-click="ctrl.toggle()">{{label}}</label>
	</span>
`;

function checkboxDirective () {

	return {
		restrict: 'E',
		replace: true,
		scope: {
			label: '@',
			value: '='
		},
		template: TEMPLATE,
		controller: controller,
		controllerAs: 'ctrl'
	};
	
	function controller ($scope) {
		this.toggle = () => $scope.value = !$scope.value;
	}
}
