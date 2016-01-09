angular
	.module(`${window.APP_NAME}.pages`)
	.directive('videoUrls', videoUrlsDirective);

const TEMPLATE = `
	<div>
		<div class="field-container" ng-repeat="item in urls track by $index">
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
				ng-show="urls.length < MAX_VIDEOS" ng-click="addVideoRow()">
				Add another url
			</button>
			<span>
				In case if each game of the match is a separate video on YouTube
			</span>
		</div>
		
	</div>
`;

// TODO: docs

const MAX_VIDEOS = 7;

function videoUrlsDirective ($http, $interval, $timeout, Constants) {

	return {
		restrict: 'E',
		scope: {
			urls: '='
		},
		template: TEMPLATE,
		link: link
	};
	
	function link (scope) {
			
		scope.MAX_VIDEOS = MAX_VIDEOS;
		scope.urls = [{
			url: '', 
			youtubeId: '',
			isValid: null, 
			isServerValidationInProgress: false
		}];

		scope.addVideoRow = addVideoRow;

		scope.$watch('urls', function (urls, oldUrls) {
			if (!urls) return;
			
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
					
				if (!urls[i].youtubeId) {
					return urls[i].error = 'INVALID_YOUTUBE_ID';
				}
				
				// Check for duplicates in the list above	
				for (let j = 0; j < i; j++) {
					if (urls[j].youtubeId === urls[i].youtubeId) {
						urls[i].isValid = false;
						return urls[i].error = 'DUPLICATE_YOUTUBE_ID';
					}
				}	
				
				urls[i].error = null;
				
				if (urls[i].isValid) serverValidation(urls[i]);
			}
		}, true);
		
		function addVideoRow () {
			if (scope.urls.length >= MAX_VIDEOS) return;
			scope.urls.push({
				url: '', 
				youtubeId: '',
				isValid: null, 
				isServerValidationInProgress: false
			});
		}
	}

	function youtubeUrlParser (url) {
		if (!url) return false;
		var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
		var match = url.match(regExp);
		return (match && match[1].length === 11) ? match[1] : null;
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
			.then((response) => {
				object.serverVideo = response.data;
				// This is the hack to expand ui-select field to a whole width
				// Do not know how exactly this work
				// if (!self.serverVideo.isFound) $timeout(() => {});
			})
			.finally(() => {
				object.isValid = object.serverVideo.isFound === false;
				if (object.serverVideo.isFound) object.error = 'ALREADY_EXIST';
				object.isServerValidationInProgress = false;
			});

	}
}
