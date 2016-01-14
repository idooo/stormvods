/* global angular */

angular
	.module(`${window.APP_NAME}.common`)
	.directive('appFooter', footerDirective);

const TEMPLATE = `
	<footer class="footer" role="contentinfo">
		<div class="footer-logo">
			<img src="/dist/images/logo.png" alt="Logo Image">
		</div>
		<div class="footer-links">
			<ul>
				<li><h3>Content</h3></li>
				<li><a href="#">Home</a></li>
				<li class="nav-link">
					<a href="#" ui-sref="tournaments">Tournaments</a>
				</li>
				<li class="nav-link">
					<a href="#" ui-sref="teams">Teams</a>
				</li>
				<li class="nav-link">
					<a href="#" ui-sref="casters">Casters</a>
				</li>
			</ul>
			<ul>
				<li><h3>Community links</h3></li>
				<li><a href="http://us.heroesofthestorm.com/esports/en/">HoTS eSports</a></li>
				<li><a href="https://www.reddit.com/r/heroesofthestorm/">/r/heroesofthestorm</a></li>
				<li><a href="https://www.hotslogs.com">HoTS Logs</a></li>
				<li><a href="http://www.heroescounters.com/">Heroes Counters</a></li>
				<li><a href="http://www.heroesfire.com/">HeroesFire</a></li>
			</ul>
			<ul>
				<li><h3>Social</h3></li>
				<li><a href="https://www.reddit.com/user/stormvods">/u/stormvods</a></li>
				<li><a href="https://twitter.com/stormvods">@stormvods</a></li>
			</ul>
		</div>
		
		<hr>
		
		<p>All videos and copyrights belong to their respective owners.</p>
	</footer>
`;

function footerDirective () {

	return {
		restrict: 'E',
		replace: true,
		scope: true,
		template: TEMPLATE
	};
}
