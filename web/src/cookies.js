angular
	.module(`${window.APP_NAME}.common`)
	.constant('CookieHelper', {

		deleteAllCookies: function () {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i];
				var eqPos = cookie.indexOf('=');
				var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
				document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
			}
		},

		setCookie: function (cname, cvalue, exdays) {
			var d = new Date();
			d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
			var expires = `expires=${d.toUTCString()}`;
			document.cookie = `${cname}=${cvalue}; ${expires}`;
		}
});
