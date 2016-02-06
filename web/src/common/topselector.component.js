const TEMPLATE = `
	<span class="top-nav">
		Top:
		<a href="#" ui-sref="top({mode: 'week'})">week</a>
		<a href="#" ui-sref="top({mode: 'month'})">month</a>
		<a href="#" ui-sref="top({mode: 'alltime'})">all time</a>
	</span>
`;

angular
	.module(`${window.APP_NAME}.common`)
	.component('topSelector', {
		template: TEMPLATE
	});
