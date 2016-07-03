const TEMPLATE = `
	<section style="height: 500px;">

		<h1>Error: {{::$ctrl.errorCode}}</h1>

		<p>{{::$ctrl.errorText}}</p>

	</section>
`;

const MESSAGES = {
	DEFAULT: 'Sorry mysterious error happened. Please let us know about this',
	INACTIVE_USER: 'Oops! You’re banned from Storm Vods. Please send us a message if you think this is a mistake.',
	ACCESS_DENIED: 'Sorry, access denied.',
	AUTH_REQUIRED: 'Auth required to use this feature. Try to login first'
};

export class ErrorPage {

	constructor ($state, Page) {
		this.errorCode = $state.params.error;
		this.errorText = MESSAGES[self.errorCode] || MESSAGES.DEFAULT;

		Page.loaded();

		if (!$state.params.error) $state.go('index');
	}
}

export default {
	template: TEMPLATE,
	controller: ErrorPage
}

