const TEMPLATE = `
	
	<section>
	
		<h1>Quality first</h1>
	
		<div class="sidebar__block">
			<div class="sidebar__header">Short guidelines</div>
			<ul class="numeric">
				<li>
					Video must contain at least one competitive Heroes of the Storm
					full match
				</li>
				<li>
					Should be a match between two professional Heroes of the Storm teams
				</li>
				<li>
					Game should have commentary in English by a caster
				</li>
				<li>
					Use Team Liquid Wiki as a source of correct names
					for <a href="http://wiki.teamliquid.net/heroes/Portal:Teams" target="_blank" >teams</a>
					and <a href="http://wiki.teamliquid.net/heroes/Portal:Tournaments" target="_blank">tournaments</a>
				</li>
			</ul>
	
			<div class="sidebar__header">Please don't</div>
			<ul class="numeric">
				<li>
					Don't add highlight videos, WTF, funny moments or other videos that
					don't contain full competitive Heroes of the Storm match
				</li>
				<li>
					Don't add videos with commentaries on other than English languages
				</li>
			</ul>
		</div>
	
	</secion>
`;

angular
	.module(`${window.APP_NAME}.pages`)
	.component('addvideoRulesSidebar', {
		template: TEMPLATE
	});
