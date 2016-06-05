const TEMPLATE = `
	<section class="entity-list">

		<h1>Teams</h1>

		<label>Filter</label>
		<input type="text" ng-model="filter" placeholder="eg. Cloud 9" />

		<div
			class="entity-list__entity entity-list__entity--team"
			ng-repeat="team in $ctrl.teams | orderBy:'name' | filter:filter as results">

			<span class="entity-list__image">
				<img ng-src="/dist/images/teams/{{team.image || 'unknown.png'}}">
			</span>
			<a href="#" ui-sref="team({id: team._id})">{{team.name}}</a>
		</div>
		
		<pagination 
			current-page="$ctrl.currentPage" 
			page-count="$ctrl.pageCount"
			get-data="$ctrl.getTeams"></pagination>

	</section>
`;

const TITLE = 'Teams';

angular
	.module(`${window.APP_NAME}.pages`)
	.component('teamsPage', {
		template: TEMPLATE,
		controller: teamsPage
	});

function teamsPage ($http, Page, Constants) {
	var self = this;

	self.teams = [];
	self.currentPage = 1;

	self.getTeams = getTeams;

	getTeams(self.currentPage);

	function getTeams (page) {
		self.teams = [];
		$http.get(`${Constants.Api.GET_TEAMS}?p=${page}`)
			.then(response => {
				self.currentPage = page;
				self.teams = response.data.items;
				self.pageCount = response.data.pageCount;
				Page.loaded();
				Page.setTitle(TITLE);
			});
	}
}
