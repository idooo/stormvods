/**
 * @description
 * Returns controller for zone entity page component
 * Configuration object MUST looks like:
 * {
 *    getUrl: {String},
 *    mergeUrl: {String},
 *    updateUrl: {String},
 *    fieldsToUpdate: {String},
 *    template: {String},
 * }
 *
 * @param {Object} configuration
 * @returns {Function}
 */
module.exports = function (configuration) {

	return function zoneController ($http, ngDialog, Constants) {

		var self = this;

		self.data = {};
		self.query = '{}';
		self.sort = '{"_id": -1}';

		self.getData = getData;
		self.merge = merge;
		self.openEditPopup = openEditPopup;

		getData();

		function getData () {
			let url = `${Constants.Api.PREFIX}/${configuration.getUrl}?query=${self.query}&sort=${self.sort}`;
			self.data = {};
			$http.get(url).then(response => self.data = response.data);
		}

		function merge (src, target) {
			$http
				.post(`${Constants.Api.PREFIX}/${configuration.mergeUrl}`, {
					src,
					target
				})
				.catch(e => alert(e)); // eslint-disable-line no-alert
		}

		function openEditPopup (item) {
			const TEMPLATE = configuration.template;

			ngDialog.open({
				template: TEMPLATE,
				plain: true,
				controller: modalController
			});

			function modalController ($scope, $http, ngDialog, Constants) {
				var origItem = JSON.parse(JSON.stringify(item));

				$scope.item = item;
				$scope.series = Constants.tournamentSeries;
				$scope.message = '';
				$scope.updateEntity = updateEntity;

				function updateEntity () {
					// Compare existing data with new
					var data = {};
					configuration.fieldsToUpdate.forEach(key => {
						if (origItem[key] !== $scope.item[key]) {
							data[key] = $scope.item[key];
						}
					});
					if (data.date) data.date = new Date(data.date);

					// exit if nothing changed
					if (!Object.keys(data).length) {
						return $scope.message = 'Nothing to change';
					}

					$http
						.put(`${Constants.Api.PREFIX}/${configuration.updateUrl}`, {
							id: item._id,
							update: data
						})
						.then(() => {
							$scope.message = 'Entity has been updated';
							ngDialog.close();
						})
						.catch(err => $scope.message = JSON.stringify(err));

				}
			}
		}
	};
};


