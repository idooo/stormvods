const REPORT_POPUP_TEMPLATE = `
	<h2>Report video</h2>
	<p>
		Please report video if at least one of the following are true:
		<ul>
			<li>Video is not a recorded match from Heroes Of The Storm game</li>
			<li>Video violates copyrights</li>
			<li>Quality of video is low</li>
		</ul>
	</p>
	<p>
		Reported videos are not automatically taken down by the system so
		our moderators will check it and remove it manually.
	</p>
	<button ng-click="report()">Report</button>
`;

const REPORT_THANKS_POPUP_TEMPLATE = `
	<h2>Thank you</h2>
	<p>
		We will review your report and will remove video
		if it violates our guidelines
	</p>
	<button ng-click="closeThisDialog()">Close</button>
`;

module.exports = {REPORT_POPUP_TEMPLATE, REPORT_THANKS_POPUP_TEMPLATE};
