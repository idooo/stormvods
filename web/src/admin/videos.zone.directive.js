angular
	.module(`${window.APP_NAME}.pages`)
	.directive('videosZone', videosZoneDirective);

const TEMPLATE = `
	<div>
		<h2>Videos</h2>

		<input class="zone-input" type="text" ng-model="ctrl.query">
		<input class="zone-input" type="text" ng-model="ctrl.sort">
		<button ng-click="ctrl.getVideos(ctrl.data.currentPage)">Update</button>

		<table class="zone-table">
			<thead>
				<tr>
					<th>Creation Date</th>
					<th>Youtube Id</th>
					<th>Author</th>
					<th width="20">Rating</th>

					<th>Tournament</th>
					<th>Stage</th>
					<th>Format</th>
					<th>Teams</th>
					<th>Casters</th>

					<th>Reports</th>

					<th width="50">Removed?</th>
				</tr>
			</thead>
			<tr ng-repeat="video in ctrl.data.videos" ng-class="{'even': $even}">
				<td am-time-ago="video.creationDate"></td>
				<td>
					<div ng-repeat="id in video.youtubeId">
					   <a href="https://www.youtube.com/watch?v={{::id}}" target="_blank">{{::id}}</a>
					</div>
				</td>
				<td>{{::video.author.name}}</td>
				<td>{{::video.rating}}</td>

				<td>
					{{::video.tournament.name}}
					<span>{{::video.tournament.rating}}</span>
				</td>

				<td>
					{{::video.stage.code}}
					<span>{{::video.stage.rating}}</span>
				</td>

				<td>
					{{::video.format.code}}
					<span>{{::video.format.rating}}</span>
				</td>

				<td>
					<div ng-repeat="team in video.teams.teams">
						{{::team.name}}
					</div>
					<span>{{::video.teams.rating}}</span>
				</td>

				<td>
					<div ng-repeat="caster in video.casters.casters">
						{{::caster.name}}
					</div>
					<span>{{::video.casters.rating}}</span>
				</td>

				<td>
					{{::video.reports.length}}
					<div ng-repeat="report in video.reports">{{::report}}</div>
				</td>

				<td>
					<a href="javascript:void(0)"
					   ng-click="ctrl.toggleRemoval(video, !video.isRemoved)">{{video.isRemoved}}</a>
				</td>

			</tr>
		</table>

		<div class="pagination">

			<button
				class="secondary"
				ng-disabled="ctrl.data.currentPage <= 1"
				ng-click="ctrl.getVideos(ctrl.data.currentPage-1)">

				&larr; Prev
			</button>

			<button
				class="secondary"
				ng-disabled="ctrl.data.pageCount == ctrl.data.currentPage"
				ng-click="ctrl.getVideos(ctrl.data.currentPage+1)">

				Next &rarr;
			</button>

		</div>
	</div>
`;

function videosZoneDirective () {

	return {
		restrict: 'E',
		controllerAs: 'ctrl',
		replace: true,
		scope: true,
		template: TEMPLATE,
		controller: controller
	};

	function controller ($http, Constants) {
		var self = this;

		self.query = '{}';
		self.sort = '{"_id": -1}';
		self.data = {};

		self.getVideos = getVideos;
		self.toggleRemoval = toggleRemoval;

		getVideos(1);

		function getVideos (page) {
			let url = `${Constants.Api.GET_VIDEO_LIST}?p=${page}&query=${self.query}&sort=${self.sort}`;
			self.data = [];
			$http.get(url).then(response => self.data = response.data);
		}

		function toggleRemoval (user, value) {
			$http.put(`${Constants.Api.VIDEO}`, {id: user._id, update: {isRemoved: value}});
			user.isRemoved = value;
		}
	}
}
