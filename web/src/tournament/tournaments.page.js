const TEMPLATE = `
	<section class="entity-list">

		<h1>Tournaments</h1>

		<label>Filter</label>
		<input type="text" ng-model="filter" placeholder="eg. World Championship 2015"/>

		<div ng-repeat="tournamentsByYear in $ctrl.tournaments">
			
			<h3>{{tournamentsByYear.year}}</h3>
			
			<div ng-repeat="tournamentsByMonth in tournamentsByYear.months 
							| filter:$ctrl.tournamentsMatch(filter)">
				
				<h4>{{tournamentsByMonth.month}}</h4>
				
				<div class="entity-list__entity"
					 ng-repeat="tournament in tournamentsByMonth.tournaments 
								| filter:filter as results">
					
					
					
					<span class="entity-list__image">
						<img ng-if="tournament.series" 
							ng-src="/dist/images/tournaments/{{tournament.series + '.png'}}">
					</span>
					
					<a href="#" ui-sref="tournament({id: tournament._id})">
						{{tournament.name}}
					</a>
				</div>
				
			</div>
			
		</div>

	</section>
`;

const TITLE = 'Tournaments';

angular
	.module(`${window.APP_NAME}.pages`)
	.component('tournamentsPage', {
		template: TEMPLATE,
		controller: tournamentsPage
	});

function tournamentsPage ($http, Page, Constants) {
	var self = this;

	self.tournaments = [];
	self.currentPage = 1;
	self.pageCount = 1;

	self.tournamentsMatch = tournamentsMatch;

	$http.get(Constants.Api.GET_TOURNAMENTS)
		.then(response => {
			self.tournaments = formatTournaments(response.data.items, Constants);
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
	 * @param Constants
	 * @returns {Array.<*>}
	 */
	function formatTournaments (rawData, Constants) {
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
						tournaments: tournaments[year][month].sort(compareIds)
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

	/**
	 * Sorting function for strings representation of ObjectId
	 * @param {String} a
	 * @param {String} b
	 * @returns {Number}
	 */
	function compareIds (a, b) {
		if (a._id < b._id) return 1;
		else if (a._id > b._id) return -1;
		else return 0;
	}

	/**
	 * Filter function to hide empty months when filtering by tournament name
	 * @param {String} criteria tournament name
	 * @returns {Function}
	 */
	function tournamentsMatch (criteria) {
		return item => {
			if (!criteria || !criteria.trim()) return true;
			criteria = criteria.toLowerCase();

			for (let i = 0; i < item.tournaments.length; i++) {
				if (item.tournaments[i].name.toLowerCase().indexOf(criteria) !== -1) {
					return true;
				}
			}
			return false;
		};
	}
}
