const TEMPLATE = `
	<div class="rating"
		 ng-class="{
			'rating--available-for-vote': $root.isAuthorised && !$ctrl.video.isVoted,
			'rating--voted': $ctrl.video.isVoted
		 }">
		<i class="rating__upvote icon-up-open" ng-click="$ctrl.vote($ctrl.video._id)"></i>
		<div class="rating__votes">
			{{$ctrl.video.rating}}
		</div>
		<i class="rating__downvote icon-down-open"></i>
	</div>
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

function controller ($http, Constants) {
	var self = this;

	self.vote = function (_id) {

		if (self.video.isVoted) return;
		$http
			.post(Constants.Api.VOTE, {
				videoId: _id,
				uuid: window.UUID
			})
			.catch(() => {
				self.video.isVoted = false;
				self.video.rating -= 1;
			});

		self.video.isVoted = true;
		self.video.rating += 1;
	};
}
