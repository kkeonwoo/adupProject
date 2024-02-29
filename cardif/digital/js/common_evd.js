
window.$evd = function() {
var keyCodesN = {
	KCODE_SEMICOLON:	186, /* ; */
	KCODE_EQUAL:		187, /* = */
	KCODE_COMMA:		188, /* , */
	KCODE_HYPHEN:		189, /* - */
	KCODE_PERIOD:		190, /* . */
	KCODE_SLASH:		191, /* / */
	KCODE_ACCENT:		192, /* ` */
	KCODE_BRACKETOPEN:	219, /* [ */
	KCODE_BACKSLASH:	220, /* \ */
	KCODE_BRACKETCLOSE:	221, /* ] */
	KCODE_APOSTROPHE:	222, /* ' */
	KCODE_ENTER:		13,
	KCODE_DEL:			46,
	KCODE_TAB:			9,
	KCODE_BS:			8,
	KCODE_SPACE:		32,
	KCODE_LEFT:			37,
	KCODE_RIGHT:		39,
	KCODE_UP:			38,
	KCODE_DOWN:			40,
	KCODE_HOME:			36,
	KCODE_END:			35,
	KCODE_PGUP:			33,
	KCODE_PGDN:			34,
	KCODE_KP0:			96,
	KCODE_KP1:			97,
	KCODE_KP2:			98,
	KCODE_KP3:			99,
	KCODE_KP4:			100,
	KCODE_KP5:			101,
	KCODE_KP6:			102,
	KCODE_KP7:			103,
	KCODE_KP8:			104,
	KCODE_KP9:			105
};
var keyCodes = {};
/* 키코드 역매핑을 추적하기 위한 변수 */
var keyCodesNRev = {};
for (var inx = 'A'.charCodeAt(0); inx <= 'Z'.charCodeAt(0); inx++) {
	/* KEY CODES FOR A~Z */
	keyCodesN["KCODE_" + String.fromCharCode(inx)] = inx;
}
for (var inx = '0'.charCodeAt(0); inx <= '9'.charCodeAt(0); inx++) {
	/* KEY CODES FOR 0~9 */
	keyCodesN["KCODE_" + String.fromCharCode(inx)] = inx;
}
for (var key in keyCodesN) {
	keyCodes[key] = keyCodesN[key];
	keyCodesNRev[keyCodesN[key]] = key;
}
var DATA_NCLICK_COUNT = "data-nclick-count";
var DATA_PUSH_WHILE = "data-push-while";
var isNumberKey = function(keyCode) {
	var ret = false;
	switch(keyCode) {
		case keyCodes.KCODE_KP0:
		case keyCodes.KCODE_KP1:
		case keyCodes.KCODE_KP2:
		case keyCodes.KCODE_KP3:
		case keyCodes.KCODE_KP4:
		case keyCodes.KCODE_KP5:
		case keyCodes.KCODE_KP6:
		case keyCodes.KCODE_KP7:
		case keyCodes.KCODE_KP8:
		case keyCodes.KCODE_KP9:
		case keyCodes.KCODE_0:
		case keyCodes.KCODE_1:
		case keyCodes.KCODE_2:
		case keyCodes.KCODE_3:
		case keyCodes.KCODE_4:
		case keyCodes.KCODE_5:
		case keyCodes.KCODE_6:
		case keyCodes.KCODE_7:
		case keyCodes.KCODE_8:
		case keyCodes.KCODE_9:
			ret = true;
			break;
	}
	return ret;
};
var isNormalKey = function(keyCode) {
	if (keyCodesNRev[keyCode]) {
		return true;
	}
	return false;
};
return {
	KEY_CODES: keyCodes,
	/* maxlength 보다 길게 입력되면 자동으로 다음 input 으로 포커스 */
	nextIfMax: function(evt) {
		var target = evt.target;
		var code = evt.keyCode;
		var $tgt = $(target);
		var value = $tgt.val();
		var mxlen = Number($tgt.attr("maxlength"));
		/* Ctrl + A, Ctrl + C 키는 특수키 이므로 제외 */
		if (
			code == keyCodesN.KCODE_LEFT ||
			code == keyCodesN.KCODE_RIGHT ||
			code == keyCodesN.KCODE_UP ||
			code == keyCodesN.KCODE_DOWN ||
			code == keyCodesN.KCODE_HOME ||
			code == keyCodesN.KCODE_END ||
			code == keyCodesN.KCODE_TAB ||
			(code >= keyCodesN.KCODE_A && code <= keyCodesN.KCODE_Z && evt.ctrlKey)
			) { return; }
		if (isNormalKey(code) && mxlen && value.length >= mxlen) {
			$tgt.val(value.substring(0, mxlen));
			var $inps = $("input[type='text']:visible, input[type='number']:visible, " +
				"input[type='password']:visible, select:visible, " +
				"input[type='checkbox']:visible, input[type='radio']:visible, input:not([type]):visible, " +
				"form a[role='button']:visible, " +
				"ul > li > input[type='checkbox'] + label[for]:visible, " +
				"ul > li > input[type='radio'] + label[for]:visible ");
			for (var iinx = 0; iinx < $inps.length; iinx++) {
				if ($inps[iinx] == $tgt[0] && iinx + 1 < $inps.length) {
					// console.log("INPUT:", iinx, $inps[iinx], $tgt[0], $inps[iinx + 1]);
					/*[# th:if="${commonUtil.isDev() != 0}"]*/
					// console.log("FOCUS:", $inps[iinx + 1]);
					/*[/]*/
					/*[-포커스를 자동으로 넘기지 않음.-]*/
					// $inps[iinx + 1].focus();
					$tgt.val($tgt.val().substring(0, mxlen));
				}
			}
		}
	},
	clear: function(evt) {
		if (evt) {
			evt.preventDefault();
			evt.stopPropagation();
			evt.stopImmediatePropagation();
		}
	},
	nClickOnTime: function(evt, callback, count, time) {
		var elem = evt.target;
		var $elem = $(elem);
		if (!($elem.attr(DATA_NCLICK_COUNT))) {
			if (!time) { time = 500; }
			$elem.attr(DATA_NCLICK_COUNT, Number(count) - 1);
			setTimeout(function() {
				$elem.removeAttr(DATA_NCLICK_COUNT)
			}, time);
		} else {
			count = Number($elem.attr(DATA_NCLICK_COUNT)) - 1;
			if (count < 1) {
				$elem.removeAttr(DATA_NCLICK_COUNT)
				callback();
			} else {
				$elem.attr(DATA_NCLICK_COUNT, count);
			}
		}
	},
	pushWhileTime: function(evt, callback, time) {
		var elem = evt.target;
		var $elem = $(elem);
		if (!($elem.attr(DATA_PUSH_WHILE))) {
			var handle = setTimeout(callback, time);
			$elem.attr(DATA_PUSH_WHILE, handle);
			$elem.mouseup(function(evt) {
				var $elem = $(evt.target);
				clearTimeout(handle);
				$elem.removeAttr(DATA_PUSH_WHILE);
				$elem.unbind("mouseup");
			});
		}
	},
	acceptOnlyNumber: function(evt) {
		var tgt = evt.target;
		var code = evt.keyCode;
		// console.log("VALUE:", tgt.value, /^[0-9]+$/.exec(tgt.value), code);
		/*[-모바일의 경우 키코드가 의미 없음.-]*/
		/*[# th:if="!${commonUtil.mobile}"]*/
		if (!isMobile) {
			if (
				code == keyCodesN.KCODE_ENTER	||
				code == keyCodesN.KCODE_DEL		||
				code == keyCodesN.KCODE_TAB		||
				code == keyCodesN.KCODE_BS		||
				code == keyCodesN.KCODE_LEFT	||
				code == keyCodesN.KCODE_RIGHT	||
				code == keyCodesN.KCODE_UP		||
				code == keyCodesN.KCODE_DOWN	||
				code == keyCodesN.KCODE_HOME	||
				code == keyCodesN.KCODE_END		||
				code == keyCodesN.KCODE_PGUP	||
				code == keyCodesN.KCODE_PGDN	||
				(code >= keyCodesN.KCODE_A && code <= keyCodesN.KCODE_Z && evt.ctrlKey)
			) {
				/*[-엔터키는 받아들임.-]*/
			} else if (!isNumberKey(code)) {
				/*[-숫자가 아니면 무시함..-]*/
				window.$evd.clear(evt);
			}
		}
		/*[/]*/
		/*[-IE에서는 number field 에 숫자가 아닌값의 value는 undefined 로 표현-]*/
		setTimeout(function() {
			// console.log("VALUE:", tgt.value, !tgt.value);
			if (!tgt.value) { tgt.value = ""; }
			if (tgt.value && !/^[0-9]+$/.exec(tgt.value)) {
				/*[-여기서까지 숫자 아닌 값이 검출된다면 경고띄움-]*/
				alert({msg:"숫자만 입력해 주세요.", callback:window.$util.clearMask});
				//tgt.value = "";
				// console.log("", tgt.value.replace(/[^0-9]/g, ""));
				tgt.value = tgt.value.replace(/[^0-9]/g, "");
			}
		}, 0);
	}
}}();

/**
 * 보안/암호화 관련 스크립트 정리
 * @author:정재백
 */
// window.TNK_SR = /*[[${certUtil.getCryptoRandom()}]]*/"";
window.$secureEvd = function() {
/*[-우선순위를 낮추기 위한 방법-]*/
var THIS_FORM = null;
// var TNK_STR = /*[[${certUtil.getCryptoRandom()}]]*/"";
// var MTR_KEY = /*[[${certUtil.secureKeyMTransKey}]]*/"";
return {
	initInputSecurity: function(encType, form, gopt) {
	/*[# th:if="${commonUtil.isDev() != 0}"]*/
	// console.log("initInputSecurity:", encType, form, gopt);
	/*[/]*/
	setTimeout(function() {
		/* 입력암호화, 해당 폼 내 password 타입을 찾아 암호화한다 */
		if (form instanceof jQuery) {
			form = form[0];
		}
		/*[# th:if="${commonUtil.isDev() != 0}"]*/
		// console.log("FORM:", form);
		/*[/]*/
		THIS_FORM = form;
		var $frm = $(form);
		var $encs = $frm.find("input[data-enc='on']");
		if (!$frm.attr("name")) {
			$frm.attr({ name: $frm.attr("id") });
		}
		$frm.attr({ "data-form-encrypt-type": encType });
		if (encType == "nxkey" && !isMobile) {
			/* 엉뚱한 필드를 보안화 하여 한글입력이 되지 않는 현상 수정 */
			$frm.find("input[type='text']").each(function(inx, elm) {
				if ($(elm).attr("data-enc") != "on") {
					$(elm).attr({"data-security":"off"});
				}
			});
			window.$util.checkAndLaunch(function(ctx) {
				/* 보안랜덤키 */
				return (ctx.TNK_SR = window.TNK_SR);
			}, function(ctx) {
				for (var inx = 0; inx < $encs.length; inx++) {
					var $inp = $($encs[inx]);
					var isNum = $inp.attr("data-type") == "num";
					$inp.attr({
						"data-ytwsid": "on",
						"data-dataType": "an"
					});
					if (isNum) {
						$inp.attr({ });
					}
				}
				if ($encs.length > 0) {
					/* NXKEY 초기화 */
					setTimeout(function() {
						if (window.TK_Loading) {
							window.TK_Loading();
							window.makeEncDataEx(form);
							window.TK_Rescan();
						} else {
							console.log("ERROR! NXKEY NOT FOUND!");
							alert({
								msg:"보안프로그램이 정상적으로 작동하지 않았습니다, 현재페이지를 다시 시작 합니다.",
								callback:function() { location.reload();
							}});
						}
					}, 500);
				}
			});
		} else if (encType == "tskey") {
			for (var inx = 0; inx < $encs.length; inx++) {
				var $inp = $($encs[inx]);
				var enm = $inp.attr("name");
				var eid = $inp.attr("id");
				if (!eid && enm) {
					$inp.attr({ "id": enm });
					eid = enm;
				}
				var isNum = $inp.attr("data-type") == "num";
				$inp.attr({
					"data-tk-kbdType": "qwerty",
					"data-tk-groupId": "group" + inx
				});
				if (isNum) {
					$inp.attr({
						"data-tk-kbdType": "number"
					});
				}
				/* 화면키보드로 인식 */
				var fncKbdShow = function(e) {
					var tk = window.tk;
					tk ? tk.onKeyboard(e.target) : null;
					var eid = e.target.id;
					$frm.find("#Tk_" + eid + "_checkbox").click();
					setTimeout(function() {
						$frm.find("#Tk_" + eid + "_checkbox")[0].checked = false;
					}, 10)
				};
				$inp.unbind("click").click(fncKbdShow);
				$inp.unbind("focus").focus(fncKbdShow);
				$inp.on("blur", function(e) {
					$(e.target).unbind("blur");
					var tk = window.tk;
					tk ? tk.inputFillEncData(e.target) : null;
				});
				var sid = eid + "_tk_btn";
				var $span = $("#" + sid);
				if (!$span[0]) {
					$span = $(document.createElement("span"));
					$span.attr({
						"id": sid,
						"class": "hidden"
					});
					$span.insertAfter($inp);
				}
			}
			/* TRANSKEY 초기화  */
			setTimeout(function() {
				if (window.initTranskey) {
					window.initTranskey();
				} else {
					console.log("ERROR! TRANSKEY NOT FOUND!");
				}
			}, 100);
		} else if (encType == "mtskey") {
			var inputObject = null;
			var callMTSKey = function(opt, inp) {
				inputObject = inp;
				var mtrKey = gopt && gopt.mtrKey ? gopt.mtrKey : window.MTR_KEY;
				var data = "keydata=" + mtrKey + ";" + opt;
				if (navigator.userAgent.indexOf("iPhone") != -1 || navigator.userAgent.indexOf("iPad") != -1) {
					/* iphone handleOpenURL */
					window.location = "itranskey://setKey/" + data;
				} else if (navigator.userAgent.indexOf("Android") != -1) {
					/* android userAgent:Android */
					window.android.setKey(data);
				} else if (gopt && gopt.fncMts) {
					gopt.fncMts(inp);
				} else {
					/* wimo */
					window.location = "http://iTransKey.exec/setKey/" + data;
				}
			};
			var inputDummy = function(cnt) {
				var tmp = "";
				for (var inx = 0; inx < cnt; inx++) {
					tmp += "*";
				}
				return tmp;
			};
			/* bind secure input element */
			for (var inx = 0; inx < $encs.length; inx++) {
				var $inp = $($encs[inx]);
				var isNum = $inp.attr("data-type") == "num";
				var enm = $inp.attr("name");
				var eid = $inp.attr("id");
				if (!eid && enm) {
					$inp.attr({ "id": enm });
					eid = enm;
				}
				$inp.unbind("focus").focus(function(e) {
					var t = null;
					var $tgt = $(e.target);
					var itit = (t = $tgt.attr("data-title")) ? t : "";
					var ktyp = (t = $tgt.attr("data-kpad")) ? t : "alpha";
					var ityp = $tgt.attr("data-type") == "num" ? "number" : "password";
					var mxln = (t = $tgt.attr("maxlength")) ? t : 0;
					var hint = (t = $tgt.attr("placeholder")) ? t : "";
					var opt = "";
					if (!itit) { itit = (t = $tgt.attr("aria-label")) ? t : ""; }
					if (itit) { opt = opt + (opt ? ";" : "" ) + "inputTitle=" + itit; }
					if (ktyp) { opt = opt + (opt ? ";" : "" ) + "keypadType=" + ktyp; }
					if (ityp) { opt = opt + (opt ? ";" : "" ) + "inputType=" + ityp; }
					if (mxln) { opt = opt + (opt ? ";" : "" ) + "maxLength=" + mxln; }
					if (hint) { opt = opt + (opt ? ";" : "" ) + "hint=" + hint; }
					// console.log("OPT:", opt);
					$tgt[0].blur();
					callMTSKey(opt, $tgt[0]);
				});
				var hid = "tk_" + eid;
				var $hlm = $("#" + hid);
				if (!$hlm[0]) {
					$hlm = $(document.createElement("input"));
					$hlm.attr({
						"id": hid,
						"name" : hid,
						"type": "hidden"
					});
					$frm.append($hlm);
				}
			}
			/* 네이티브에서 호출되어지는 함수이므로 window 에 bind 한다 */
			window.inputValue = function(cipher, cnt) {
				var cnt = cnt;
				var cipher = cipher;
				var inp = inputObject;
				var eid = inp.id;
				var hid = "tk_" + eid;
				$("#" + hid).val(cipher);
				if (!(gopt && gopt.fncMts)) {
					$("#" + eid).val(inputDummy(cnt));
				}
			};
		}
		var $inps = $frm.find("input[type='text'], input[type='number'], input[type='password']");
		for (var inx = 0; inx < $inps.length; inx++) {
			/*[# th:if="${commonUtil.isDev() != 0}"]*/
			// console.log("INPUT:", $inps[inx]);
			/*[/]*/
			$inp = $($inps[inx]);
			$inp.keydown(function(e) {
				var tgt = e.target;
				var $tgt = $(tgt);
				if ($tgt.attr("data-type") == "num" || $tgt.attr("type") == "number") {
					window.$evd.acceptOnlyNumber(e);
				}

				if (e.keyCode == window.$evd.KEY_CODES.KCODE_TAB ||
					e.keyCode == window.$evd.KEY_CODES.KCODE_ENTER) {
					var tinx = Number($tgt.attr("tabindex"));
					if (!isNaN(tinx) && tinx >= 0) {
						var sub = e.shiftKey ? -1 : 1;
						for (var ainx = 1; ainx < 10; ainx++) {
							var tobj = $("[tabindex='" + (tinx + (ainx * sub)) + "']:visible");
							/*[# th:if="${commonUtil.isDev() != 0}"]*/
							// console.log("TABINDEX:", tinx + (ainx * sub), tobj[0]);
							/*[/]*/
							setTimeout(function() { tobj.focus(); }, 100);
							break;
						}
					}
				}
				/*[-강제 다음엘리먼트 포커싱 하지 않도록. (웹접근성)-]*/
				setTimeout(function() { window.$evd.nextIfMax(e); }, 10);
			});
		}
		// setTimeout(Util.setMaxLengthToNumbertag, 10);
	}, 100);
	},
	formData: function(frm) {
		if (!frm && THIS_FORM)  { frm = THIS_FORM; }
		return window.$util.formData(frm);
	}
}}();

window.$util = function() {
var LOG_BUFFER = [];
var LAST_POSTED = 0;
var HANDLE_CLOG = false;
return {
	loaded: false,
	/*[-전방 공백 치환 유틸, INFO: copy from common_auth.js-]*/
	zpad: function(val, len) {
		val = String(val);
		for (var inx = val.length; inx < len; inx++) {
			val = "0" + val;
		}
		return val;
	},
	numberFormat: function(val) {
		var ret = "";
		if (isNaN(val)) { val = 0; }
		var num = Number(val);
		val = String(num);
		var len = val.length;
		var pos = len % 3;
		ret = val.substring(0, pos);
		for (; pos < len; pos += 3) {
			if (ret.length > 0) { ret += ","; }
			ret += val.substring(pos, pos + 3);
		}
		return ret;
	},
	/*[-특정조건이 완료될 때까지 대기후 실행하는 함수-]*/
	checkAndLaunch: function (check, launch, interval) {
		if (!interval) { interval = 100; }
		var ctx = { __maxc: 100, __intv: interval };
		var fnc = function() {
			if (check(ctx)) {
				launch(ctx);
			} else if (ctx.__maxc > 0) {
				ctx.__maxc--;
				setTimeout(fnc, ctx.__intv);
			}
		};
		setTimeout(fnc, ctx.__intv);
	},
	clearMask: function() {
		_LoadingPop.hide();
		setTimeout(function() {
			/*[# th:if="${commonUtil.isDev() != 0}"]*/
			// console.log("clearMask");
			/*[/]*/
			var maskQty = 0
			if ((maskQty = $("#layermask").length - $("#popupMsgDiv > div.layerwrap:visible, div.layerwrap.popBox:visible").length) > 0) {
				for (var inx = 0; inx < maskQty; inx++) {
					$($("[id='layermask']")[0]).remove();
				}
			}
		}, 10);
	},
	jrest: function(url, data, fnc) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url);
		xhr.onload = fnc;
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.send(JSON.stringify(data));
		// xhr.onLoad = function() { LAST_POSTED = new Date().getTime(); }
	},
	bufferedSend: function(url, data) {
		LOG_BUFFER[LOG_BUFFER.length] = data;
		var current = new Date().getTime();
		/*[-2초에 한번씩-]*/

		if (HANDLE_CLOG) { clearTimeout(HANDLE_CLOG); }
		HANDLE_CLOG = setTimeout(function() {
			/*[-버퍼교체-]*/
			var buffer = LOG_BUFFER;
			LOG_BUFFER = [];
			if (buffer.length > 0) { window.$util.jrest(url, {data: buffer}); }
			LAST_POSTED = new Date().getTime();
		}, 2000);
	},
	clog: function() {
	/*[# th:if="${commonUtil.isDev() != 0}"]*/
	/*[# th:if="${commonUtil.loggingConsole}"]*/
	try {
		var e = new Error();
		if (!e.stack) { try { throw e; } catch (e) { if (!e.stack) { } } }
		var stack = e.stack.toString().split(/\r\n|\n/);
		var called = stack && stack.length > 2 ? stack[2] : "";
		var args = Array.from(arguments);
		window.$util.bufferedSend(SEND_CLOG, {line: called, msg: args});
		// console.log("CLOG!");
		$(window).unbind("unload").unload(function(e) {
			var buffer = LOG_BUFFER;
			LOG_BUFFER = [];
			if (buffer.length > 0) { window.$util.jrest(url, {data: buffer}); }
			LAST_POSTED = new Date().getTime();
		});
	} catch (e) { }
	/*[/]*/
	/*[/]*/
	},
	elog: function(e) {
	/*[# th:if="${commonUtil.isDev() != 0}"]*/
	/*[# th:if="${commonUtil.loggingConsole}"]*/
		if (!e.stack) { try { throw e; } catch (e) { if (!e.stack) { } } }
		window.$util.bufferedSend(SEND_CLOG, {line: "", msg: e.stack.toString()});
	/*[/]*/
	/*[/]*/
	},
	$form: function(form) {
		var $form = null;
		if (form instanceof jQuery) {
			$form = form;
		} else if (typeof form == "string") {
			if (form.substring(0, 1) == "#") {
				$form = $(form);
			} else {
				$form = $("#" + form);
			}
		} else {
			$form = $(form);
		}
		return $form;
	},
	formData: function(form) {
		var $form = this.$form(form);
		if ($form.length > 0) {
			if (!$form.attr("name")) {
				$form.attr("name", $form.attr("id"));
			}
			form = $form[0];
			var data = { };
			/*[-암호화된 폼의 경우-]*/
			var encType = $form.attr("data-form-encrypt-type");
			var $inps = $form.find("input[name],select");
			if (encType == "tskey" && tk && tk.fillEncData) {
				tk.fillEncData();
			}
			for (var iinx = 0; iinx < $inps.length; iinx++) {
				var inp = $inps[iinx];
				var $inp = $(inp);
				var type = inp.type;
				var name = inp.name;
				if (!name) { continue; }
				/*[-키보드보안시 불필요필드 제거-]*/
				if (name == "hid_enc_data" || !name) { continue; }
				var value = $form.find("[name='" + name + "']").val();
				if (type == "checkbox") {
					var cv = data[name];
					if (!cv) { cv = []; }
					if (inp.checked) {
						cv[cv.length] = inp.value;
					}
					if (cv.length > 0) {
						value = cv;
					}
				} else if (type == "radio" && $form.find("input[name='" + name + "']").length && inp.checked) {
					value = inp.value;
				} else if ($inp.attr("data-enc") == "on") {
					value = window.$util.zpad("", value.length);
				} else if (name.length > 3 && name.substring(0, 3) == "Tk_" &&
					name.length > 15 && name.substring(name.length - 15, name.length == "_checkbox_value")) {
					continue;
				} else if (name.length > 4 && name.substring(0, 4) == "E2E_") {
					name = name.substring(4) + "_raonEncData";
				}
				if (value || typeof value == "number") {
					data[name] = value;
				}
			}
		}
		return data;
	},
	merge: function(data1, data2) {
		var data = { };
		if (!data1) { data1 = { }; }
		if (!data2) { data2 = { }; }
		for (var key in data1) {
			data[key] = data1[key];
		}
		for (var key in data2) {
			data[key] = data2[key];
		}
		return data;
	},
	openLink: function(link, type) {
		/*[# th:if="${commonUtil.isDev() != 0}"]*/
		// console.log("LINK:", type, link, typeof link);
		/*[/]*/
		if (link && link instanceof Object && link.target) {
			/*[# th:if="${commonUtil.isDev() != 0}"]*/
			// console.log("ANCHOR:", link.target);
			/*[/]*/
			var $tgt = $(link.target);
			if (!$tgt.attr("data-link-url")) {
				$tgt = $tgt.parents("[data-link-url]");
			}
			if ($tgt.attr("data-link-url")) {
				link = $tgt.attr("data-link-url");
			}
			if ($tgt.attr("data-link-type")) {
				type = $tgt.attr("data-link-type");
			}
		}
		/*[# th:if="${commonUtil.isDev() != 0}"]*/
		// console.log("LINK:", type, link, isMobile, CLIENT_TYPE);
		/*[/]*/
		/*[-type:1 새창 / type:2 이동-]*/
		if (type && String(type) == "2") {
			window.location.href = link;
		} else {
			var host = "";
			var url = String(link);
			if (/^[/.]/g.exec(url)) {
				host = location.origin;
			}
			if (!isMobile) {
				window.open(link);
			} else if (CLIENT_TYPE == BNP_ANDROID) {
				window.android.callWebInfo(host + url);
			} else if (CLIENT_TYPE == BNP_IOS) {
				var url = host + url;
				url = url.replace(/^(http|https):\/\//, "");
				window.location = "webCall://callWebInfo//" + url;
			}
		}
	},
	openCardifLink: function(link) {
		/*[# th:if="${commonUtil.isDev() != 0}"]*/
		// console.log("ISMOBILE:", isMobile);
		/*[/]*/
		if (isMobile) {
			try {
				var orgHome = location.origin;
				var orgMycd = orgHome + "/mycardif";
				/*[# th:if="${commonUtil.isDev() != 0}"]*/
				// console.log("LINK:", orgHome, orgMycd, link);
				/*[/]*/

				if (link.length > 1 && link.substring(0, 1) == "/") {
					link = orgHome + link;
				}
				if (link.length >= orgMycd.length && link.substring(0, orgMycd.length) == orgMycd) {
					/*[-마이카디프링크:이동-]*/
					window.$util.openLink(link, 2);
				} else if (link.length >= orgHome.length && link.substring(0, orgHome.length) == orgHome) {
					/*[-홈페이지링크:새창-]*/
					window.$util.openLink(link, 1);
				} else {
					/*[-외부링크:새창-]*/
					window.$util.openLink(link, 1);
				}
			} catch (e) {
			}
		} else {
			/*[-PC웹에서오픈시:이동-]*/
			window.$util.openLink(link, 2);
		}
	},
	removeCookie: function(value) {
		if (document.cookie.length > 0) {
			if (document.cookie.indexOf( value + "=" ) != -1) {
				document.cookie = value + "=" + ";expires=Thu, 01-Jan-70 00:00:01 GMT";
			}
		}
	},
	removeAllCookies: function() {
		var cookies = document.cookie.split(";");
		for (var inx = 0; inx < cookies.length; inx++) {
			var cookie = cookies[inx];
			var mat = /([a-zA-Z0-9_-]+)=/.exec(cookie);
			var key = mat && mat.length > 0 ? mat[1] : "";
			// console.log("KEY:", key);
			if (key) {
				window.$util.removeCookie(key);
			}
		}
	},
	storeElement: function(event) {
		if (!event) { event = window.event; }
		window.$_nextTarget = event ? event.target : undefined;
	},
	restoreElement: function() {
		var ret = window.$_nextTarget;
		window.$_nextTarget = undefined;
		return ret;
	},
	focus: function(elem) {
		if (elem && elem.focus) {
			try { elem.focus(); } catch (e) { }
		}
	}
}}();

/*[-FIXME:deprecated-]*/
window.$slog = window.$util.clog;


/*[-투자유형진단(HPCOM201P)-]*/
window._DiagInvPop = function() {
	var HPCOM201POPUP_ID = "popupDivDiagInvest";
	return {
	show: function(event) {
		//var url = "/common/popup/diagInvest.do";
        var url = "/hp/com/hpcom201.do";
		var $popup = $("#" + HPCOM201POPUP_ID);
		if ($popup.length > 0) {
			$popup.remove();
		}
		if (!event) { event = window.event; }

		var nextTarget = undefined;
		if (!(nextTarget = window.$util.restoreElement()) && event) {
			nextTarget = event.target;
		}

		var handle = setTimeout(function() { _LoadingPop.hide(); }, 10000)
		$.ajax({
			type: "GET",
			data: "",
			url: url,
			success:function(res) {
				try {
					/* 레이어 팝업 html 삽입될 div 생성 */
					$popup = $(document.createElement("div")).attr({ id: HPCOM201POPUP_ID }).append(res);
					$("body").append($popup);
					/* 인증 레이어 팝업 노출 */
					setTimeout(function() {
						HPCOM201Control.nextTarget = nextTarget;
						_Layer.show("#layer_investType");
						if (handle) { clearTimeout(handle); }
						_LoadingPop.hide();
					}, 10);
				} catch(e) {
					alert({msg:_Message.get("b2b.co.0002"), callback:window.$util.clearMask});
				} finally {
					_loadingShow = true;
				}
			}
		});
	},
}}();

/*[-적합성검사(MYCDF805P)-]*/
window._SuitabilityTestPop = function() {
	var MYCDF805POPUP_ID = "popupDivSuitabilityTest";
	/*[-파라메터정보를 넘긴다.
		다음 메소드를 param 에 구현(혹은 대입)해 주어야 함.
		getSuitFundRate() [업무 -> 팝업 / 값전달]
		suitTestResult(suitData) [팝업 -> 업무 / 값반환]
	  -]*/
	// var SAMPLE_ITEM_NAME = "굿리치ETF변액연금보험";
	var SAMPLE_ITEM_NAME = " 시그니처경영인 정기보험";
	var SAMPLE_SUIT_DIAGN_YMD = "20211105";
	var SAMPLE_SUIT_QUESTION = "1:2:2:1:5:4:3:3:1:2:3:1,2,3,5:3:2:3:2:1:2";
	var SAMPLE_PD_TYPE = "01";
	var SAMPLE_EST_TYPE = "04";
	var SAMPLE_DIAGN_GB = "01";
	var SAMPLE_SUIT_DIAGN_DIFF = "0";
	var SAMPLE_BOND_TYPE_RAT = "100";
	var SAMPLE_CONF_SPE = "";
	var MYCDF805PARAM = {
		/*[-펀드적합성비율(업무 -> 팝업)-]*/
		getSuitFundRate: function() {
			var ret = 50;
			/*[# th:if="${commonUtil.isDev() != 0}"]*/
			// console.log("MYCDF805P getSuitFundRate:", ret);
			/*[/]*/
			return ret;
		},
		/*[-적합성결과(팝업 -> 업무)-]*/
		suitTestResult: function(suitData) {
			/*[# th:if="${commonUtil.isDev() != 0}"]*/
			// console.log("MYCDF805P suitTestResult:", suitData);
			/*[/]*/
		},
		itemName: SAMPLE_ITEM_NAME,
		suit_diagn_ymd: SAMPLE_SUIT_DIAGN_YMD,
		suit_question: SAMPLE_SUIT_QUESTION,
		suit_diagn_gb: SAMPLE_DIAGN_GB,
		suit_diagn_diff: SAMPLE_SUIT_DIAGN_DIFF,
		suit_pd_type: SAMPLE_PD_TYPE,
		suit_est_type: SAMPLE_EST_TYPE,
		bond_type_rat: SAMPLE_BOND_TYPE_RAT,
		cont_conf_spe: SAMPLE_CONF_SPE,
		completed: false,
	};
	return {
	show: function(param) {
		var url = "/common/popup/suitabilityTest.do";
		var $popup = $("#" + MYCDF805POPUP_ID);
		if ($popup.length > 0) {
			$popup.remove();
		}
		var event = param ? param.event : undefined;
		if (!event) { event = window.event; }
		if (!param) { param = MYCDF805PARAM; }

		var nextTarget = undefined;
		if (!(nextTarget = window.$util.restoreElement()) && event) {
			nextTarget = event.target;
		}

		param.nextTarget = nextTarget;

		$.ajax({
			type: "GET",
			data: "",
			url: url,
			success:function(res) {
				try {
					/* 레이어 팝업 html 삽입될 div 생성 */
					$popup = $(document.createElement("div")).attr({ id: MYCDF805POPUP_ID }).append(res);
					$("body").append($popup);
					if (param) {
						MYCDF805PARAM = param;
					}
					/* 인증 레이어 팝업 노출 */
					setTimeout(function() { _Layer.show("#layer_suitabilityTest"); }, 10);
				} catch(e) {
					alert({msg:_Message.get("b2b.co.0002"), callback:window.$util.clearMask});
				} finally {
					_loadingShow = true;
				}
			}
		});
	},
	getFundRateToEstType : function(fundRate) {
		var estType = 8;
		if (fundRate >= 100) {
			estType = 4;
		} else if(fundRate >= 70) {
			estType = 5;
		} else if(fundRate >= 50) {
			estType = 6;
		} else if(fundRate >= 30) {
			estType = 7;
		}
		return estType;
	},
	isSuitTestCheck: function(param) {
		if (_SuitabilityTestPop.completed()) {
			/*[-적합성평가 수행 직후, 중복검사를 건너뛰기 위해-]*/
			/*[# th:if="${commonUtil.isDev() != 0}"]*/
			// console.log("SUIT_TEST_CHECK ALREADY DONE!");
			/*[/]*/
			return false;
		}

		var suitTargetYmd = 20170701;	/* 20170701 */
		var suitDiffDay = 730;			/* 730 */
		var check  = false;
		var fundRate = param.getSuitFundRate();
		var dayDiff = Number(param.suit_diagn_diff);
		var lastDate = param.suit_diagn_ymd;
		if (isNaN(dayDiff)) {
			dayDiff = 0;
		}
		/*[-적합성 진단평가가 2년을 초과-]*/
		/*[# th:if="${commonUtil.isDev() != 0}"]*/
		// console.log("DIAGN_YMD:", lastDate, dayDiff, suitDiffDay);
		/*[/]*/

		if (!dayDiff && lastDate) {
			try {
				if (!lastDate || lastDate.length < 8 || isNaN(Number(lastDate))) {
					lastDate = "00000000";
				}
				var numYear = Number(lastDate.substring(0, 4));
				var numMonth = Number(lastDate.substring(4, 6));
				var numDate = Number(lastDate.substring(6, 8));
				var pdate = new Date();
				var cdate = new Date();
				pdate.setFullYear(numYear);
				pdate.setMonth(numMonth - 1);
				pdate.setDate(numDate);
				var diffVal = cdate.getTime() - pdate.getTime();
				dayDiff = diffVal / (1000 * 60 * 60 * 24);
				/*[# th:if="${commonUtil.isDev() != 0}"]*/
				// console.log("DATE DIFF:", diffVal, dayDiff);
				/*[/]*/
			} catch (e) {
				// console.log(e);
			}
		}

		if (!lastDate || dayDiff > suitDiffDay) {
			check = true;
		}

		/*[# th:if="${commonUtil.isDev() != 0}"]*/
		// console.log("CHECK:", check, lastDate, dayDiff, suitDiffDay, param.suit_diagn_gb);
		/*[/]*/

		var SuitControl = window._SuitabilityTestPop;

		if (!check) {
			if (param.suit_diagn_gb == "02") {
				/* 기존 적합성 검사 시 적합 일 경우 */
				if (SuitControl.isSuitHighRiskChk(param.suit_est_type, fundRate)) {
					check = true;
				}
			} else {
				/* 기존 적합성 검사 시 부적합 또는 거부 일 경우 */
				var bondTypeRat = parseInt(param.bond_type_rat ? 100 : param.bond_type_rat);

				/*[# th:if="${commonUtil.isDev() != 0}"]*/
				// console.log("CHECK:", SuitControl.getFundRateToEstType(bondTypeRat), SuitControl.getFundRateToEstType(fundRate));
				/*[/]*/

				if (SuitControl.getFundRateToEstType(bondTypeRat) < SuitControl.getFundRateToEstType(fundRate)) {
					check = true;
				}
			}
		}

		/*[# th:if="${commonUtil.isDev() != 0}"]*/
		// console.log("CHECK:", check, param.cont_conf_spe, param.cont_conf_spe_skip);
		/*[/]*/

		if (check) {
			if (param.cont_conf_spe == "2") {
				confirm({
					msg: "전문 보험 계약자입니다. 적합성 진단 생략이 가능합니다.\n적합성 진단을 하시겠습니까?",
					callback:[
						function() {
							param.cont_conf_spe_skip = "N";
							SuitControl.show(param);
						},
						function() {
							param.cont_conf_spe_skip = "Y";
							var suitData = {};
							suitData.cont_conf_spe_skip = param.cont_conf_spe_skip;
							param.suitTestResult(suitData);
						}
					]
				});
			 } else {
				confirm({
					msg: "최종 적합성 진단일로부터 2년이 초과하였거나 고위험 자산의 편입 비중을 늘리는 경우 투자성향에 대한 재평가가 필요합니다.\n투자성향에 대한 재평가를 하시겠습니까?",
					callback:[
						function() {
							SuitControl.show(param);
						},
						function() { }
					]
				});
			}
			return true;
		}
	},
	parseSuitInfo: function(form, suitInfo) {
		if (form instanceof jQuery) {
			form = form[0];
		} else if (form instanceof String) {
			form = $("#" + form)[0];
		}
		if (!suitInfo) { return; }
		var $form = $(form);
		var keys = [
			"bond_type_rat",
			"cont_conf_spe",
			"suit_diagn_diff",
			"suit_diagn_gb",
			"suit_diagn_ymd",
			"suit_est_score",
			"suit_est_type",
			"suit_pd_type"
		];

		for (inx in keys) {
			var key = keys[inx];
			var val = suitInfo[key];
			if (!val) { val = ""; }
			$form.find("input[name='" + key + "']").val(val);
		}
		var question = "";

		var max = 0;
		for (key in suitInfo) {
			var mat = /^suit_question_([0-9]+)/.exec(key);
			if (mat && mat[1] && !isNaN(Number(mat[1]))) {
				var v = Number(mat[1]);
				if (v > max) { max = v; }
			}
		}
		for (var inx = 0; inx <= max; inx++) {
			if (question.length > 0) { question += ":"; }
			question += suitInfo["suit_question_" + inx];
		}
		suitInfo["suit_question"] = question;
		/*[# th:if="${commonUtil.isDev() != 0}"]*/
		// console.log("QUESTION:", question);
		/*[/]*/
		$form.find("input[name='suit_question']").val(question);
		return suitInfo;
	},
	isSuitHighRiskChk: function(estType, totRate) {
		estType == null ? "" : estType;
		var ret = false;
		switch (estType) {
			case "01":
			case "02":
			case "03":
				ret = true;
				break;
			case "04":
				if (totRate < 100) { ret = true; }
				break;
			case "05":
				if (totRate < 70) { ret = true; }
				break;
			case "06":
				if (totRate < 50) { ret = true; }
				break;
			case "07":
				if (totRate < 30) { ret = true; }
				break;
			case "08":
				break;
			default:
				ret = true;
				break;
		}
		/*[# th:if="${commonUtil.isDev() != 0}"]*/
		// console.log("HIGHRISKCHK:", estType, totRate, ret);
		/*[/]*/
		return ret;
	},
	param: function() {
		if (!MYCDF805PARAM.isSuitHighRiskChk) {
			MYCDF805PARAM.isSuitHighRiskChk = window._SuitabilityTestPop.isSuitHighRiskChk;
		}
		/*[# th:if="${commonUtil.isDev() != 0}"]*/
		// console.log("SUITPARAM:", MYCDF805PARAM);
		/*[/]*/
		return MYCDF805PARAM;
	},
	completed: function() {
		if (MYCDF805PARAM && MYCDF805PARAM.completed) {
			return true;
		}
		return false;
	}
}}();

$(document).ready(function() {
	/*[-한번만 수행.-]*/
	if (!window.$util.loaded) {
		window.$util.loaded = true;
		window.$util.clearMask();
		$(window).on("beforeunload", function() {
			/*[# th:if="${commonUtil.isDev() != 0}"]*/
			// console.log("PAGE UNLOADING...", document.location);
			/*[/]*/
			_LoadingPop.hide();
			setTimeout(function() {
				/*[# th:if="${commonUtil.isDev() != 0}"]*/
				/*[-DIM삭제는 2중으로 해 주어야 완벽하게 클리어됨..-]*/
				// console.log("REMOVE ALL DIMs...");
				/*[/]*/
				$(".dim").remove();
				$("#layermask").remove();
				$("#loadingDiv").remove();
				setTimeout(function() {
					/*[# th:if="${commonUtil.isDev() != 0}"]*/
					// console.log("SHOW NEW LOADING POP...");
					/*[/]*/
					$(".dim").remove();
					$("#layermask").remove();
					$("#loadingDiv").remove();
					_LoadingPop.show();
				}, 1);
				/*[-10초간 응답이 없으면 해제-]*/
				setTimeout(function() {
					$(window).unbind("beforeunload");
					_LoadingPop.hide();
				}, 10000);
			}, 1);
		});
		setTimeout(function() {
			$("a[href]").each(function(inx, elm) {
				var $elm  = $(elm);
				if (/^tel[:]/.exec($elm.attr("href"))) {
					/*[# th:if="${commonUtil.isDev() != 0}"]*/
					// console.log("E:", elm);
					/*[/]*/
					$elm.click(function() {
						setTimeout(function() {
							_LoadingPop.hide();
							window.$util.clearMask();
						}, 100);
					});
				}
			});
		}, 500)
	}
});
