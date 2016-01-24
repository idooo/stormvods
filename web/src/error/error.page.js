angular
	.module(`${window.APP_NAME}.pages`)
	.directive('errorPage', errorPage);

const TEMPLATE = `
	<section style="height: 500px;">

		<h1>Error: {{::ctrl.errorCode}}</h1>

		<p>{{::ctrl.errorText}}</p>

	</section>
`;

const MESSAGES = {
	INACTIVE_USER: 'Oops! You’re banned from Storm Vods. Please send us a message if you think this is a mistake.',
	ACCESS_DENIED: 'Sorry, access denied.',
	AUTH_REQUIRED: 'Auth required to use this feature. Try to login first'
};

function errorPage () {

	return {
		restrict: 'E',
		controllerAs: 'ctrl',
		scope: true,
		template: TEMPLATE,
		controller: controller
	};

	function controller ($state, Page) {
		var self = this;

		self.errorCode = $state.params.error;
		self.errorText = MESSAGES[self.errorCode];

		Page.loaded();

		if (!$state.params.error) $state.go('index');
	}
}
