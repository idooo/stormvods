const TEMPLATE = `
	<svg
		class="rating"
		ng-class="{
			'rating--not-voted': !$ctrl.video.isVoted,
			'rating--voted': $ctrl.video.isVoted,
			'rating--authorised': $root.isAuthorised
		}"
		ng-click="$ctrl.vote($ctrl.video._id)"
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
		width="42"
		height="42"
		viewBox="0 0 87.59 99.306"
		xml:space="preserve">
		<g>
			<path
				stroke-miterlimit="10" d="M45.377,98.392c-0.953,0.55-2.513,0.552-3.467,0.005l-39.68-22.75
				c-0.954-0.547-1.732-1.895-1.729-2.995l0.139-45.739c0.003-1.1,0.785-2.45,1.738-3l39.837-23c0.953-0.55,2.513-0.552,3.467-0.005
				l39.68,22.75c0.954,0.547,1.732,1.895,1.729,2.995l-0.139,45.739c-0.003,1.1-0.785,2.45-1.738,3L45.377,98.392z"/>
			<text x="44" y="62" fill="#ffffff" text-anchor="middle" font-size="36">{{$ctrl.video.rating}}</text>
			<text x="44" y="70" fill="#ffffff" text-anchor="middle" font-size="60">+</text>
		</g>
	</svg>
`;

angular
	.module(`${window.APP_NAME}.common`)
	.component('rating', {
		template: TEMPLATE,
		controller: controller,
		bindings: {
			video: '<'
		}
	});

function controller ($rootScope, $http, Constants) {
	var self = this;

	if (!$rootScope.isAuthorised) return;

	self.vote = function (_id) {
		if (self.video.isVoted) return;
		$http
			.post(Constants.Api.VOTE, {
				videoId: _id
			})
			.catch(() => {
				self.video.isVoted = false;
				self.video.rating -= 1;
			});

		self.video.isVoted = true;
		self.video.rating += 1;
	};
}
