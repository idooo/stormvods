const UPDATE_INTERVAL = 5 * 60 * 1000;

angular
	.module(`${window.APP_NAME}.common`)
	.service('Streamers', StreamersService);

function StreamersService ($http, $interval, Constants) {
	var self = this,
		streamers = [];

	self.get = () => streamers;

	getStreamersData();
	$interval(getStreamersData, UPDATE_INTERVAL);

	function getStreamersData () {
		$http.get(Constants.Api.TWITCH_STREAMERS)
			.then(response => {
				streamers = response.data.streamers;
			});
	}
}
