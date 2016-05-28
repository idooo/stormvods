angular
	.module(`${window.APP_NAME}.pages`)
	.directive('tournamentsPage', tournamentsPage);

const TEMPLATE = `
	<section class="entity-list">

		<h1>Tournaments</h1>

		<label>Filter</label>
		<input type="text" ng-model="filter" placeholder="eg. World Championship 2015"/>

		<div ng-repeat="tournamentsByYear in ctrl.tournaments">
			
			<h3>{{tournamentsByYear.year}}</h3>
			
			<div ng-repeat="tournamentsByMonth in tournamentsByYear.months">
				
				<h4>{{tournamentsByMonth.month}}</h4>
				
				<div ng-repeat="tournament in tournamentsByMonth.tournaments | filter:filter as results" 
					class="entity-list__entity">
					
					<a href="#" ui-sref="tournament({id: tournament._id})">{{tournament.name}}</a>
				</div>
				
			</div>
			
		</div>

	</section>
`;

const TITLE = 'Tournaments';

function tournamentsPage () {

	return {
		restrict: 'E',
		controllerAs: 'ctrl',
		scope: true,
		template: TEMPLATE,
		controller: controller
	};

	function controller ($http, Page, Constants) {
		var self = this;

		self.tournaments = [];
		self.currentPage = 1;
		self.pageCount = 1;

		$http.get(Constants.Api.GET_TOURNAMENTS)
			.then(response => {
				self.tournaments = formatTournaments(response.data.items);
				self.pageCount = response.data.pageCount;
				Page.loaded();
				Page.setTitle(TITLE);
			});

		/**
		 * Formats tournaments data and returns them in a sorted way
		 * like this:
		 * [
		 *    {
		 *       year: 2016,
		 *       months: [
		 *          {
		 *              month: December,
		 *              tournaments: [
		 *                  ... // tournament
		 *              ]
		 *          },
		 *          {
		 *              month: May,
		 *              tournaments: [
		 *                  ...
		 *              ]
		 *          },
		 *          ...
		 *       ]
		 *    },
		 *    {
		 *       year: 2015,
		 *       months: [
		 *         ...
		 *       ]
		 *    },
		 *    ...
		 * ]
		 * @param rawData
		 * @returns {Array.<*>}
         */
		function formatTournaments (rawData) {
			var tournaments = {};

			// format
			rawData.forEach(tournament => {
				var date = new Date(tournament.date),
					year = date.getFullYear(),
					month = date.getMonth();

				// if there is no year in result array add it and fill by month names
				if (angular.isUndefined(tournaments[year])) {
					tournaments[year] = {};
					Constants.monthNames.forEach(monthName => tournaments[year][monthName] = []);
				}
				tournaments[year][Constants.monthNames[month]].push(tournament);
			});

			// sort
			var _years = [];
			Object.keys(tournaments).forEach(year => {
				var _months = [];
				Object.keys(tournaments[year]).forEach(month => {
					if (tournaments[year][month].length) {
						_months.push({
							month,
							tournaments: tournaments[year][month]
						});
					}
				});
				_months = _months.sort((a, b) => {
					return Constants.monthNames.indexOf(b.month)
						- Constants.monthNames.indexOf(a.month);
				});
				_years.push({year, months: _months});
			});

			return _years.sort((a, b) => {
				return b.year - a.year;
			});
		}
	}
}
