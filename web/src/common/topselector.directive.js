angular
	.module(`${window.APP_NAME}.common`)
	.directive('topSelector', topDirective);

const TEMPLATE = `
	<span class="top">
		Top: 
		<a href="#" ui-sref="top({mode: 'week'})">week</a>
		<a href="#" ui-sref="top({mode: 'month'})">month</a>
		<a href="#" ui-sref="top({mode: 'alltime'})">all time</a>
	</span>
`;

function topDirective () {

	return {
		restrict: 'E',
		replace: true,
		template: TEMPLATE
	};
}
