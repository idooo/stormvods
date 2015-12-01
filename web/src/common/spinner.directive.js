angular
	.module(`${window.APP_NAME}.common`)
	.directive('spinner', checkboxDirective);

const TEMPLATE = `
	<div class="spinner"></div>
`;

function checkboxDirective () {

	return {
		restrict: 'E',
		replace: true,
		template: TEMPLATE
	};
	
}
