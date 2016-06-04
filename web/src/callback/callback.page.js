const TEMPLATE = `
	<div>
		<div class="callback_message">
			<span ng-if="!$ctrl.isError">
				Logging in...
				<br>
				You will be redirected soon™
			</span>
			<span ng-if="$ctrl.isError">
				Sorry an error happened. Try to login again.
			</span>
		</div>
	</div>
`;

const ENDPOINT_CALLBACK = '/api/auth/callback';

angular
	.module(`${window.APP_NAME}.pages`)
	.component('callbackPage', {
		template: TEMPLATE,
		controller: callbackPage
	});

function callbackPage ($http, $window, Page) {
	var self = this,
		params = {};

	self.isError = false;

	$window.location.search
		.replace('?', '')
		.split('&')
		.forEach(item => {
			var i = item.split('=');
			params[i[0]] = i[1];
		});

	Page.loaded();

	$http.get(ENDPOINT_CALLBACK, {params})
		.then(() => $window.location.assign('/'))
		.catch(() => self.isError = true);
}
