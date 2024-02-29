/**
 * 로그인 및 인증 관련 스크립트 정리
 * @author:정재백
 */
window.$auth = function() {
	var lastSync = -1;
	var fncZpad = window.$util.zpad;
	return {
	baseUri:"/mycardif",
	/* 타이머엘리먼트 */
	$timerElement: undefined,
	/* 만료시간(서버시간, millisec) */
	expires: 0,
	/* 현재시간(서버시간, millisec) */
	curtime: 0,
	/* 타이머 핸들 */
	timerHandle: undefined,
	/* 1분후 만료 경고여부 */
	notifyExpire: false,
	/* 로그아웃 */
	logout: function(callback) {
		_LoadingPop.show();
		var self = window.$auth;
		var baseUri = self.baseUri;
		if (!callback) {
			callback = function() {
				_LoadingPop.hide();
				location.href = "/logout.do";
			}
		}
		/* Util.sendData 사용시 */
		Util.sendData({
			url:("/mycardif/my/lgi/rest/processLogout.do").replace(/[/]+/g, "/"),
			data:{},
			callback: function(res) {
				window.$util.removeAllCookies();
				callback(res);
			}
		});
	},
	/* 만료시간연장 */
	extend: function() {
		var self = window.$auth;
		var baseUri = self.baseUri;
		var callback = function(result) {
			// console.log("RESULT:", result);
			if (!result) {
				alert("잘못된 통신입니다.");
				return;
			}
			if (result.resultCode != 1) {
				if (result.errorMsg == "ALREADY_LOGOUT") {
					alert("로그아웃 되었습니다.");
					location.reload();
				}
				return;
			}
			if (result.resultCode == 1) {
				var data = result.data;
				self.expires = data.expires;
				self.curtime = data.curtime;
				self.timerProcess(self.expires, self.curtime, self.$timerElement);
			}
		};
		/* Util.sendData 사용시 */
		Util.sendData({
			url:(baseUri + "/my/lgi/rest/extendAuthTime.do").replace(/[/]+/g, "/"),
			data:{},
			callback: callback
		});
	},
	/* 서버시간동기화 */
	syncTime: function() {
		var self = window.$auth;
		var baseUri = self.baseUri;
		var callback = function(result) {
			// console.log("RESULT:", result);
			if (!result) {
				alert("잘못된 통신입니다.");
				return;
			}
			if (result.resultCode != 1) {
				if (result.errorMsg == "ALREADY_LOGOUT") {
					alert("로그아웃 되었습니다.");
					location.reload();
				}
				return;
			}
			if (result.resultCode == 1) {
				var data = result.data;
				self.expires = data.expires;
				self.curtime = data.curtime;
				self.timerProcess(self.expires, self.curtime, self.$timerElement);
			}
		};
		/* 서버시간 동기화, 암전이 보이면 안되므로 별도의 xhr 을 사용 */
		var xhr = new XMLHttpRequest();
		xhr.open("POST", (baseUri + "/my/lgi/rest/syncTime.do").replace(/[/]+/g, "/"));
		xhr.onload = function(res) { callback(JSON.parse(res.target.response)); };
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.send("{}");
	},
	/* 타이머 수행. 실제 세션타임은 서버에서 발생하므로 유저 Noti용 */
	timerProcess: function(expires, curtime, $timerElement) {
		/* 최초시간과 분, 초 계산 */
		var self = window.$auth;
		var time = Math.floor((expires - curtime) / 1000);
		var minute = Math.floor(time / 60);
		var second = time - (minute * 60);
		// console.log("TIME:", time, minute, second);
		/* 기존에 수행되는 타이머가 있다면 종료해 준다 */
		if (self.timerHandle) {
			clearTimeout(self.timerHandle);
		}
		self.notifyExpire = false;
		var fncTimer = function() {
			second -= 1;
			if (second == 0 && lastSync != minute) {
				lastSync = minute;
				self.syncTime();
			}
			if (minute > 0 && second <= 0) {
				second = 59
				minute -= 1;
			}
			if (minute < 1 && second <= 60) {
				if (!self.notifyExpire) {
					confirm({
						msg: "로그인 만료 <br/> 1분 전입니다<br/>연장하시겠습니까?",
						btn: ["예", "아니오"],
						callback: [self.extend, function() { }]
					});
					self.notifyExpire = true;
				}
			}
			if (minute <= 0 && second <= 0) {
				// console.log("TIMEOUT!");
				window.$auth.logout(function() { location.href = self.baseUri; });
				return;
			}
			/* 지정된 엘리먼트에 텍스트 입력 */
			$timerElement.html(fncZpad(minute, 2) + ":" + fncZpad(second, 2));
			/* 1초마다 호출 */
			self.timerHandle = setTimeout(fncTimer, 1000);
		};
		self.timerHandle = setTimeout(fncTimer, 0);
	},
	/* 이벤트 엘리먼트에 타이머 할당하여 시동 */
	timecheck: function(e) {
		var cnl = window.$util.checkAndLaunch;
		if (e && e.target) {
			var self = window.$auth;
			var $el = $(e.target);
			cnl(function() { return uiStyle; },
				function() {
					self.baseUri = $el.attr("data-uri-base");
					self.expires = $el.attr("data-session-expires");
					self.curtime = $el.attr("data-session-curtime");
					self.$timerElement = $el.parent();
					self.timerProcess(self.expires, self.curtime, self.$timerElement);
			});
		}
	}
	};
}();
