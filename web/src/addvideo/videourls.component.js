const MAX_VIDEOS = 7;
const TEMPLATE = `
	<div class="video-urls-container">
		<div class="field-container" ng-repeat="item in $ctrl.urls track by $index">
			<spinner ng-show="item.isServerValidationInProgress"></spinner>
			<input
				type="text"
				ng-model="item.url"
				ng-model-options="{ debounce: 1000 }"
				autocomplete="off"
				required>

			<div
				class="flash-error"
				ng-show="item.error">

				<span ng-show="item.error == 'ALREADY_EXIST'">
					This video is <a href="#" target="_blank" ui-sref="video({id: item.serverVideo.id})">already uploaded</a>.
					<br>
					You can help <a href="#" target="_blank" ui-sref="video({id: item.serverVideo.id})">improve</a>
					its description or upload another one
				</span>

				<span ng-show="item.error == 'INVALID_YOUTUBE_ID'">
					Video URL looks wrong. Are you sure you are trying to add a correct link?
					<br>
					Please drop me a message if you think there is error in our side
				</span>

				<span ng-show="item.error == 'DUPLICATE_YOUTUBE_ID'">
					You've already added video with the same id above
				</span>
			</div>
		</div>

		<div>
			<button
				class="secondary"
				ng-show="$ctrl.urls.length < ${MAX_VIDEOS}" ng-click="$ctrl.addVideoRow()">
				Add another url
			</button>
			<span class="disclaimer">
				In case if each game of the match is a separate video on YouTube
			</span>
		</div>

	</div>
`;


angular
	.module(`${window.APP_NAME}.pages`)
	.component('videoUrls', {
		bindings: {
			urls: '='
		},
		template: TEMPLATE,
		controller: videoUrlsComponent
	});

function videoUrlsComponent ($scope, $http, $interval, Constants) {
	var self = this;

	self.MAX_VIDEOS = MAX_VIDEOS;
	self.urls = [{
		url: '',
		youtubeId: '',
		isValid: null,
		isServerValidationInProgress: false
	}];

	self.addVideoRow = addVideoRow;

	$scope.$watch('$ctrl.urls', function (urls, oldUrls) {
		if (!urls) return;

		// Go through all the urls we have and validate them
		for (let i = 0; i < urls.length; i++) {

			// reset entity when user clean the input
			if (urls[i] && !urls[i].url) {
				urls[i].isValid = null;
				urls[i].error = null;
				urls[i].youtubeId = '';
				urls[i].serverVideo = undefined;
				return urls[i].isServerValidationInProgress = false;
			}

			// skip validation if it is already in progress
			if (!urls[i] || urls[i].isServerValidationInProgress) continue;
			if (urls[i].isValid !== null && urls[i].url === oldUrls[i].url) continue;

			// Validate youtube Id
			urls[i].youtubeId = youtubeUrlParser(urls[i].url);
			urls[i].isValid = !!urls[i].youtubeId;

			if (!urls[i].youtubeId) return urls[i].error = 'INVALID_YOUTUBE_ID';

			// Check for duplicates in the list above
			for (let j = 0; j < i; j++) {
				if (urls[j].youtubeId === urls[i].youtubeId) {
					urls[i].isValid = false;
					return urls[i].error = 'DUPLICATE_YOUTUBE_ID';
				}
			}

			urls[i].error = null;

			// Validate on the server if everything ok in browser
			if (urls[i].isValid) serverValidation(urls[i]);
		}
	}, true);

	function addVideoRow () {
		if (self.urls.length >= MAX_VIDEOS) return;
		self.urls.push({
			url: '',
			youtubeId: '',
			isValid: null,
			isServerValidationInProgress: false
		});
	}

	/**
	 * Validate youtube ID on the server side to prevent duplicates
	 */
	function serverValidation (object) {
		if (object.isServerValidationInProgress) {
			if (!object.serverValidationInterval) {
				object.serverValidationInterval = $interval(() => serverValidation(object), 1000);
			}
			return;
		}

		if (object.serverValidationInterval) {
			$interval.cancel(object.serverValidationInterval);
			object.serverValidationInterval = null;
		}
		object.isServerValidationInProgress = true;

		$http.get(`${Constants.Api.VALIDATE_VIDEO}?id=${object.youtubeId}`)
			.then(response => object.serverVideo = response.data)
			.finally(() => {
				object.isValid = object.serverVideo.isFound === false;
				if (object.serverVideo.isFound) object.error = 'ALREADY_EXIST';
				object.isServerValidationInProgress = false;
			});

	}

	function youtubeUrlParser (url) {
		if (!url) return false;
		var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
		var match = url.match(regExp);
		return (match && match[1].length === 11) ? match[1] : null;
	}
}

