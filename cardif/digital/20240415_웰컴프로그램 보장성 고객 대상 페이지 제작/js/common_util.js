//var _tempSendData = "";
var _loadingHtml = "";
var _alertHtml = "";
var _confirmHtml = "";
var _context = "";
var _pathName = location.pathname.substring(0, (location.pathname.indexOf("/", 1)==-1?1:location.pathname.indexOf("/",1)));
var _loadingShow = true;
var _authPopupCallback = null;
var _zipcodePopupCallback = null;
var _movePageHistory = [];
var frmObj = null;//IE첨부파일일때 사용

var ulTag       = ["<ul class=\"depth\">","</ul>"];
var liTag       = ["<li>","</li>"];
var spanTag     = ["<span class=\"menu-tit\">","</span>"];
var aTag        = "<a href=\"{menu_path}\" {popup_yn}>{menu_name}</a>";
var empty       = "  ";
// [2021/12/03 박현진] 접근성 개선 aria 속성 추가

var Util = {
	/**
	 * data 존재여부 체크
	 * @param data
	 * @returns {Boolean}
	 */
	exists: function(data) {
		data += "";

		if (data == null || data == ""
				|| data == "undefined" || data == "null") {
			return false;
		}else {
			return true;
		}
	},
	/**
	 * popup 으로 window open
	 * @param sUrl
	 * @param windowName
	 * @param width
	 * @param height
	 * @param etc
	 * @param portletNameSpace
	 */
	openWindowPop: function (sUrl, windowName, width, height, etc) {
		var stat = "width=" + width + ",height=" + height + ",location=no";

		if (Util.exists(etc)) {
			stat += "," + etc;
		}

		var popupObj = window.open(sUrl, windowName, stat);
		return popupObj;
	},
	/**
	 * Report Popup을 띄운다.
	 * @param sUrl
	 * @param formId
	 * @param windowName
	 * @param width
	 * @param height
	 * @param etc
	 */
	openReportPopup: function(sUrl, formId, windowName, width, height, etc) {
		var frm = $("#" + formId);
		var stat = "width=" + width + ",height=" + height + ",location=no";

		if (Util.exists(etc)) {
			stat += "," + etc;
		}

		var popupObj = window.open('about:blank', windowName, stat);

		frm.attr("target", windowName);
		frm.attr("method", "post");
		frm.attr("action", sUrl);

		frm.submit();
		frm.attr("target", "");

		return popupObj;
	},
	/**
	 * 전화번호 지역국번 추가
	 * @param obj
	 * @param selval
	 */
	addTelNo : function (obj, selval) {

		var opt = "";
		opt = new Option("--", "");
		obj.options[0] = opt;
		obj.options[0].selected = true;
		opt = new Option("02", "02");
		obj.options[1] = opt;
		if (selval == "02") obj.options[1].selected = true;
		opt = new Option("031", "031");
		obj.options[2] = opt;
		if (selval == "031") obj.options[2].selected = true;
		opt = new Option("032", "032");
		obj.options[3] = opt;
		if (selval == "032") obj.options[3].selected = true;
		opt = new Option("033", "033");
		obj.options[4] = opt;
		if (selval == "033") obj.options[4].selected = true;
		opt = new Option("041", "041");
		obj.options[5] = opt;
		if (selval == "041") obj.options[5].selected = true;
		opt = new Option("042", "042");
		obj.options[6] = opt;
		if (selval == "042") obj.options[6].selected = true;
		opt = new Option("043", "043");
		obj.options[7] = opt;
		if (selval == "043") obj.options[7].selected = true;
		opt = new Option("051", "051");
		obj.options[8] = opt;
		if (selval == "051") obj.options[8].selected = true;
		opt = new Option("052", "052");
		obj.options[9] = opt;
		if (selval == "052") obj.options[9].selected = true;
		opt = new Option("053", "053");
		obj.options[10] = opt;
		if (selval == "053") obj.options[10].selected = true;
		opt = new Option("054", "054");
		obj.options[11] = opt;
		if (selval == "054") obj.options[11].selected = true;
		opt = new Option("055", "055");
		obj.options[12] = opt;
		if (selval == "055") obj.options[12].selected = true;
		opt = new Option("061", "061");
		obj.options[13] = opt;
		if (selval == "061") obj.options[13].selected = true;
		opt = new Option("062", "062");
		obj.options[14] = opt;
		if (selval == "062") obj.options[14].selected = true;
		opt = new Option("063", "063");
		obj.options[15] = opt;
		if (selval == "063") obj.options[15].selected = true;
		opt = new Option("064", "064");
		obj.options[16] = opt;
		if (selval == "064") obj.options[16].selected = true;
		opt = new Option("070", "070");
		obj.options[17] = opt;
		if (selval == "070") obj.options[17].selected = true;

			return ;
	},
	/**
	 * 통신사 핸드폰번호 추가
	 *
	 * @param obj
	 * @param selval
	 */
	addMobNo : function (obj, selval) {

		var opt = "";
		opt = new Option("010", "010");
		obj.options[0] = opt;
		obj.options[0].selected = true;
		opt = new Option("011", "011");
		obj.options[1] = opt;
		if (selval == "011") obj.options[1].selected = true;
		opt = new Option("016", "016");
		obj.options[2] = opt;
		if (selval == "016") obj.options[2].selected = true;
		opt = new Option("017", "017");
		obj.options[3] = opt;
		if (selval == "017") obj.options[3].selected = true;
		opt = new Option("018", "018");
		obj.options[4] = opt;
		if (selval == "018") obj.options[4].selected = true;
		opt = new Option("019", "019");
		obj.options[5] = opt;
		if (selval == "019") obj.options[5].selected = true;

		return;

	},
	/**
	 *
	 * @param obj
	 * @returns {Boolean}
	 */
	isNull :  function (obj) {

		if (obj == null) return true;
		if (obj === null) return true;
		if (typeof obj == "undefined") return true;
		if (obj === "") return true;

	},
	/**
	 * onKeyUp 시 사용 (asis 함수사용)
	 * @param FormObj
	 * @param inputId
	 * @returns {Boolean}
	 */
	onlyNumber : function (FormObj, inputId) {
		var insertValue;

		if (inputId != undefined) {
			insertValue = $("#"+inputId).val();
			FormObj = $("#"+inputId);
		} else {
			insertValue = FormObj.value;
		}

		count=0;
		for (i=0; i<insertValue.length; i++) {
			if (insertValue.charAt(i) < '0' || insertValue.charAt(i) > '9') {
				count++;
			}
		}

		if (count != 0) {
			//[접근성_20211121]
			alert('숫자를 입력해주세요',function(){
				if (inputId != undefined) {
					$("#"+inputId).val("");
				} else {
					FormObj.value = "";
				}
				FormObj.select();
			});

			return false;
		} else {
			return true;
		}
	},

	/**
	 *  숫자에서 숫자가 아닌 콤마, 도트 등의
	 * @param input
	 * @returns 수학적인 기호를 제거하고 순수 숫자만 되돌려주는 함수
	 */
	replaceData : function(odata){
		var re = new Array();
		re[0]=/,/g;     //[,] ==> [""]
		re[1]=/\\/g;    //[\] ==> [""]
		re[2]=/:/g;     //[:] ==> [""]
		re[3]=/\//g;    //[/] ==> [""]
		re[4]=/-/g;     //[-] ==> [""]
		for (i=0;i<re.length;i++) {
			odata=odata.replace(re[i],"");
		}
		return odata.trim();
	},

	/**
		* 3자리마다 콤마 찍는 함수
		* @param input (예: 입력:56234, 반환값:56,234)
		* @returns 콤마찍은 값을 반환(예: 입력:56234, 반환값:56,234)
		*/
	f_convAmt : function (sval){
		if (sval == "" || sval == null)
			return  sval;

		sval = Util.f_getRawAmt(sval)+"";

		if(isNaN(parseInt(sval))) return 0;

		var sRst="";  // 결과값
		var iOrd=sval.length;  // 길이
		if((sval.substring(0,1)) == "-") {
			sval = sval.substring(1,iOrd);
			iOrd -= 1; sRst = "-";
		}
		for(var i = 0; i < sval.length; i++) {
			sRst += sval.substring(i,i+1);
			if(iOrd != 1 && (iOrd-1) % 3 == 0) sRst += ",";
			iOrd -= 1;
		}
		return sRst;
	},

    /**
        * 3자리마다 콤마 찍는 함수(소수점 지원)
        * @param input (예: 입력:10000.59, 반환값:10,000.59)
        * @returns 콤마찍은 값을 반환(예: 입력:10000.59, 반환값:10,000.59)
        */
    f_convNumCom : function (num){
        var parts = num.toString().split(".");
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
    },

	/**
		* 금액을 숫자로 변환하기 위한 함수
		* @param  string
		* @returns int
		*/
	f_getRawAmt : function (samt){

		var re = new Array();
		re[0]=/,/g;     //[,] ==> [""]
		if(samt == "") return "0";

		for (i=0;i<re.length;i++) {
			samt=samt.replace(re[i],"");
		}

		return parseInt(samt,10);
	},

	/**
		* 금액을 한글로 표현하는 함수
		* @param string
		* @returns string
		*/
	f_getKorAmt : function(num){
		var hanA = new Array("", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구", "십");
		var danA = new Array("", "십", "백", "천", "", "십", "백", "천", "", "십", "백", "천", "", "십", "백", "천");
		var result = "";

		for(i=0; i< num.length; i++) {
			str ="";
			han = hanA[num.charAt(num.length-(i+1))];
			if(han != "") str+= han+danA[i];
			if(i == 4) str += "만";
			if(i == 8) str += "억";
			if(i == 12) str+= "조";
			result = str + result;
		}
		if(num != 0) result = result + "원";

		return result;
	},

	/**
		*
		* @param date
		* @param dateFormat
		* @returns
		*/
	setDataFormat : function (date, dateFormat){

		if( ( date == null || date === null || typeof date == "undefined" ) && date.length != 8 ){
			return date;
		}

		if ( dateFormat == "년월일") {
			return date.substr(0,4) + "년 " + date.substr(5,2) + "월 " + date.substr(8,2) + "일";
		} else {
			return date.substring(0,4) + dateFormat + date.substring(4,6) + dateFormat + date.substring(6,8);
		}
	},

	/**
		*  날짜 포맷
		*  @param : iptDate     입력일자
		*  @param : formatStr   예)2016-12-30
		*/
	getDateFormat : function(iptDate, formatStr){

		if (iptDate.length == 10) {
			iptDate = iptDate.replace(/[\-./]/gi, "");
		}

		var strYear = iptDate.substring(0,4);
		var strMonth = iptDate.substring(4,6);
		var strDate = iptDate.substring(6,8);

		var tmpStrDate = new String(strYear+formatStr+strMonth+formatStr+strDate);

		return tmpStrDate;

	},
	/**
		* code성 select box를 구성한다.
		* @param targetFormId
		* @param targetSelId
		* @param data
		* @param selectedVal
		* @param allOrSelect
		*/
	makeSelectBox: function(targetFormId, targetSelId, data,
								selectedVal, allOrSelect) {
		var htmlStr = "";

		if (allOrSelect == "a" || allOrSelect == "A") {
			htmlStr = "<option value=''>전체</option>";
		}else {
			htmlStr = "<option value=''>선택</option>";
		}

		$.each(data, function() {
			var key = this.id_code;
			var value = this.code_kor;

			if (selectedVal == key) {
				htmlStr += "<option value='" + key + "' selected>" + value + "</option>";
			}else {
				htmlStr += "<option value='" + key + "'>" + value + "</option>";
			}
		});

		$("#" + targetFormId + " #" + targetSelId).html("");
		$("#" + targetFormId + " #" + targetSelId).html(htmlStr);
	},


	/**
		* 카드유효기간 년도를 구한다.
		* @param targetFormId
		* @param targetSelId
		*/
	makeValidateCardYy  : function (targetFormId, targetSelId) {
		var curDate = new Date();
		var fullYear = new String(curDate.getFullYear());
		var year = Number(fullYear.substring(2, 4));
		var yearCnt = year + 20;
		var htmlStr = "";

		for (var idx = year; idx < yearCnt; idx++) {
			if (idx < 10) idx = "0"+idx;
			if (idx == 1) {
				htmlStr += "<option value='" + idx + "' selected>" + idx + "년</option>";
			} else {
				htmlStr += "<option value='" + idx + "'>" + idx + "년</option>";
			}

		}

		$("#" + targetFormId + " #" + targetSelId).html(htmlStr);

	},

	/**
		* 카드유효기간 월을 구한다.
		* @param targetFormId
		* @param targetSelId
		*/
	makeValidateCardMm  : function (targetFormId, targetSelId) {
		var htmlStr = "";
		for (var idx = 1; idx <= 12; idx++) {
			if (idx < 10) idx = "0"+idx;
			if (idx == 1) {
				htmlStr += "<option value='" + idx + "' selected>" + idx + "월</option>";
			} else {
				htmlStr += "<option value='" + idx + "'>" + idx + "월</option>";
			}

		}

		$("#" + targetFormId + " #" + targetSelId).html(htmlStr);
	},

	/**
		* EmailDomain을 구한다.
		* @param targetFormId
		* @param targetSelId
		*/
	makeEmailDomain : function (targetFormId, targetSelId) {

		var valArray = new Array("선택하세요","daum.net","gmail.com","hanmail.net","nate.com","naver.com","직접입력");
		var htmlStr = "";

		for (var idx = 0; idx < valArray.length; idx++) {
			if (idx == 0 || idx == valArray.length - 1) {
				htmlStr += "<option value=''>" + valArray[idx] + "</option>";
			} else {
				htmlStr += "<option value='" + valArray[idx] + "'>" + valArray[idx] + "</option>";
			}
		}

		$("#" + targetFormId + " #" + targetSelId).html(htmlStr);
	},

	/**
		*  데이터를 HTML에 표시한다.

		Util.setDataInHtml('tbody', {name: 'cardif', age: 10});
		=> tbody 하위에 있는 #name에 'cardif' 데이터를 입력

	* @param targetId      해당 ID 안에 있는 html 태그에 데이터를 표시
	* @param data          JSON 데이터의 key가 id와 동일한 경우 해당 위치에 데이터를 삽입
	*/
	setDataInHtml : function (targetId, data) {
		Object.keys(data).forEach(function (key, i) {
			// value
			$('#' + targetId + ' #' + key).val(data[key]);

			// html
			$('#' + targetId + ' #' + key).html(data[key]);

			// radio
			$('#' + targetId + ' [name=' + key + ']').each(function(i, e) {
				if ($(this).val() == data[key]) {
					$(this).prop('checked', true);
				}
			});

			// checkbox(데이터 저장하는 방식에 따라 각자 구현해야할 수도 있음)
			if ($('#' + targetId + ' #' + key + '[type=checkbox]').val() == data[key]) {
				$('#' + targetId + ' #' + key + '[type=checkbox]').prop('checked', true);
			}
		});
	},

/*****************************************
	*  마스킹
	*****************************************/

	/**
		* 설  명 : 이메일의 끝의 두자리를 *로 만든다.
		* @param : str         - 넘어온 값
		* @return : strVal     - 마스킹된값
		*/
	getEmail : function(str) {
		var strVal = "";
		var arrStr = "";

		if (str == null || str.trim() == "") {

		} else {
			arrStr = str.split("@");
			if (arrStr == null || arrStr == "") {
				arrStr = "";
			} else {
				if (arrStr[0].length > 2) {
					strVal = arrStr[0].substr(0, (arrStr[0].length - 2));
					if (arrStr[1] == null || arrStr[1] == "") {
						strVal = str;
					} else {
						strVal = strVal + "**@" + arrStr[1];
					}
				} else {

				}
			}
		}
		return strVal;
	},


	/**
		* 설  명 : 전화번호(휴대폰)의 맨 뒷짜리 4자리를 *로 만든다.
		* @param : str         - 넘어온 값
		* @return : strVal     - 마스킹된값
		*/
	getPhoneNumber : function(str) {
		var strVal = "";
		var arrStr = "";

		if (str == null || str.trim() == "") {

		} else {
			arrStr = str.split("-");
			if (arrStr == null || arrStr == "") {
				arrStr = "";
			} else {
				if (arrStr[2] == null || arrStr[2] == "") {
					strVal = str;
				} else {
					strVal = arrStr[0] + "-" + arrStr[1] + "-" + "****";
				}
			}
		}
		return strVal;
	},


	/**
		* 설  명 : 계좌번호등 일련숫자의 맨 뒷자리 3자리를 *로 만든다.
		* @param : str         - 넘어온 값
		* @return : strVal     - 마스킹된값
		*/
	getAccountNumber : function(str) {
		var strVal = "";
		var arrStr = "";

		if (str == null || str.trim() == "") {

		} else {
//          if (str.length > 3) {
//              strVal = str.substring(0, (str.length - 3)) + "***";
//          } else {
//              strVal = str;
//          }
			if (str.length > 6) {
				strVal = str.substring(0, str.length-6);
				strVal += str.substring(str.length-6, str.length-3).replace(/[0-9]/gi,"*");
				strVal += str.substring(str.length-3);
			} else {
				strVal = str;
			}
		}
		return strVal;
	},


	/**
		* 설  명 : 카드번호마스킹 (카드유형정보를 포함한 6자리를 제외한 뒷자리 10개 번호이상을 마스킹 처리)
		* @param : str         - 넘어온 값
		* @param : type        - 넘어온 값
		* @return : strVal     - 마스킹된값  (예 type가 input
		*
		*/
	getCardNumber : function(cn, Type){
		var result = "";
		var cardNo = "";

		if(cn != null && !cn == "") {
			cardNo = Util.replaceData(cn);

			if(cardNo.length < 16) {
				result = cardNo;
			} else {
				cardNo = cardNo.substring(0,6) + cardNo.substring(6).replace(/[0-9]/gi,"*");
				var reCardNo1 = cardNo.substring(0,4);
				var reCardNo2 = cardNo.substring(4,8);
				var reCardNo3 = cardNo.substring(8,12);
				var reCardNo4 = cardNo.substring(12,16);

				if(Type == "input") {
					result = cardNo;
				} else {
					result = reCardNo1+"-"+reCardNo2+"-"+reCardNo3+"-"+reCardNo4;
				}
			}
		}
		return result;
	},

	/**
		* 설  명 : 이름 마스킹
		* @param : str         - 넘어온 값
		*/
	nameMasking : function(str){
		var out_str="";

		//널일경우 리턴
		if(str==null)return "";

		str = str.trim();
		var max = str.length;
		if(max!=0 && str!=null){
			if(max<3){
				out_str=str.substring(0, 1)+"*";
			}else{
				out_str+=str.substring(0, max-2);
				out_str+="*";
				out_str+=str.substring(max-1, max);
			}
		}
		return out_str;
	},

	/**
		* 설  명 : 상세주소 마스킹
		* @param : str         - 넘어온 값
		*/
	addressMasking : function(str){
	var out_str="";

		if(str==null)return "";

		for(var i=0;i<str.length;i++){
			out_str+="*";
		}
		return out_str;
	},

	/**
		* 설  명 : 주민번호 마스킹
		* @param : str         - 넘어온 값
		*/
	ssnMasking :function(sn){
		var result = "";
		var temp_ssn = "";
		var sn1  = "";
		var sn2  = "";
		if(sn!="") {
			if(sn.length <= 7) {
				result = sn.substring(0, 1) + sn.substring(1).replace(/[0-9]/gi,"*");
			}else if(sn.length == 14) {
				temp_ssn = sn.replace("-", "");
				sn1 = temp_ssn.substring(0, 6);
				sn2 = temp_ssn.substring(6);
				result = sn1 + "-" + sn2.substring(0, 1) + sn2.substring(1).replace(/[0-9]/gi,"*");
			}else{
				result = sn.substring(0, 7) + sn.substring(7).replace(/[0-9]/gi,"*");
			}
		}

		return result;
	},

	/**
		* 설  명 : 계좌번호 마스킹
		* @param : str         - 넘어온 값
		*/
	accountMasking :function(str){
		var out_str="";

		//널일경우 리턴
		if(str==null)return "";

		str = str.trim();
		var max = str.length;
		if(max!=0 && str!=null){
			if(max < 6){
				return "";
			}else{
				out_str=str.substring(0, max - 6) + '***';
				out_str+=str.substring(max-3, max);
			}
		}
		return out_str;
	},

	/**
		*  입력일자에 계산월을 더해서 날짜를 리턴한다.
		*  @param : iptDate 입력일자
		*  @param : num     계산월
		*/
	calMonDate : function(iptDate, num){

		if (iptDate.length == 10) {
			iptDate = iptDate.replace(/[\-./]/gi, "");
		}

		var strYear = iptDate.substring(0,4);
		var strMonth = iptDate.substring(4,6);
		var strDate = iptDate.substring(6,8);

		var tmpStrDate = new String(strYear+"-"+strMonth+"-"+strDate);
		var tmpDate = new Date(tmpStrDate);
		var iptNumber = new Number(num);

		tmpDate.setMonth(tmpDate.getMonth()+iptNumber);

		var year = tmpDate.getFullYear().toString();
		var month = tmpDate.getMonth()+1;
		var date = tmpDate.getDate().toString();

		if (month < 10) {
			month = '0' + month.toString();
		} else {
			month.toString();
		}

		if (date < 10) {
			date = '0' + date.toString();
		} else {
			date.toString();
		}

		return year + month + date;

	},

	/**
		* 현재일자를 yyyyMMdd 형식으로 리턴한다.
		*/
	getCurrentDate : function(delimiter) {
		if( !delimiter ){ delimiter = ""; }

		var curDate = new Date();

		var year = curDate.getFullYear().toString();
		var month = curDate.getMonth() + 1;
		var date = curDate.getDate();

		if (month < 10) {
			month = "0" + month.toString();
		} else {
			month = month.toString();
		}

		if (date < 10) {
			date = "0" + date.toString();
		} else {
			date = date.toString();
		}

		return year +delimiter+ month +delimiter+ date;

	},

	/* 현재일자 기준 year/month/day 증가 결과값 조회(yyyy-mm-dd) */
	getIncrCurrentDate: function(type, val, sDate) {
		var nowDt = new Date();
		if( sDate ){ nowDt = new Date(this.getFormatDateTime(sDate)); }

		var _year = nowDt.getFullYear();
		var _mon = nowDt.getMonth()+1;
		var _date = nowDt.getDate();

		if( type == "year" ){
			_year = new Date().getFullYear()+parseInt(val);
		}else if( type == "month" ){
			nowDt.setMonth( new Date().getMonth()+parseInt(val) );
			_year = nowDt.getFullYear();
			_mon = nowDt.getMonth()+1;
			_date = nowDt.getDate();
		}else if( type == "day" ){
			nowDt.setMonth(nowDt.getMonth());
			nowDt.setDate( new Date().getDate()+parseInt(val) );
			_year = nowDt.getFullYear();
			_mon = nowDt.getMonth()+1;
			_date = nowDt.getDate();
		}

		if( parseInt(_mon) < 10 ){
			_mon = "0"+_mon;
		}
		if( parseInt(_date) < 10 ){
			_date = "0"+_date;
		}
		return _year+"-"+_mon+"-"+_date;
	},

	getIncrCurrentDay: function(type, val, sDate) {
        var nowDt = new Date(sDate);
        if( sDate ){ nowDt = new Date(this.getFormatDateTime(sDate)); }

        var _year = nowDt.getFullYear();
        var _mon = nowDt.getMonth()+1;
        var _date = nowDt.getDate();

        if( type == "year" ){
            _year = new Date().getFullYear()+parseInt(val);
        }else if( type == "month" ){
            nowDt.setMonth( new Date().getMonth()+parseInt(val) );
            _year = nowDt.getFullYear();
            _mon = nowDt.getMonth()+1;
            _date = nowDt.getDate();
        }else if( type == "day" ){
            nowDt.setMonth(nowDt.getMonth());
            nowDt.setDate( nowDt.getDate()+parseInt(val) );
            _year = nowDt.getFullYear();
            _mon = nowDt.getMonth()+1;
            _date = nowDt.getDate();
        }

        if( parseInt(_mon) < 10 ){
            _mon = "0"+_mon;
        }
        if( parseInt(_date) < 10 ){
            _date = "0"+_date;
        }
        return _year+"-"+_mon+"-"+_date;
    },

	/* 현재일자 기준 year/month/day 감소 결과값 조회(yyyy-mm-dd) */
	getDecrCurrentDate: function(type, val, sDate) {
		var nowDt = new Date();
		if( sDate ){ nowDt = new Date(sDate); }

		var _year = nowDt.getFullYear();
		var _mon = nowDt.getMonth()+1;
		var _date = nowDt.getDate();
		if( type == "year" ){
			_year = new Date().getFullYear()-parseInt(val);
		}else if( type == "month" ){
			nowDt.setMonth( new Date().getMonth()-parseInt(val) );
			_year = nowDt.getFullYear();
			_mon = nowDt.getMonth()+1;
			_date = nowDt.getDate();
		}else if( type == "day" ){
			nowDt.setMonth(nowDt.getMonth());
			nowDt.setDate( new Date().getDate()-parseInt(val) );
			_year = nowDt.getFullYear();
			_mon = nowDt.getMonth()+1;
			_date = nowDt.getDate();
		}

		if( parseInt(_mon) < 10 ){
			_mon = "0"+_mon;
		}
		if( parseInt(_date) < 10 ){
			_date = "0"+_date;
		}
		return _year+"-"+_mon+"-"+_date;
	},

	/**
		* 날짜
		*/
	getFormatDateTime : function(stringVal) {
		var val = this.replaceData(stringVal);
		var length = val.length;
		var replace = "";
		var format = "";
		switch(length) {
			case 8:
				format = "$1-$2-$3";
				replace = /^([0-9]{4})([0-9]{2})([0-9]*)/;
				break;
			case 10:
				format = "$1-$2-$3 $4";
				replace = /^([0-9]{4})([0-9]{2})([0-9]{2})([0-9]*)/;
				break;
			case 12:
				format = "$1-$2-$3 $4:$5";
				replace = /^([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]*)/;
				break;
			case 14:
				format = "$1-$2-$3 $4:$5:$6";
				replace = /^([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]*)/;
				break;
			default:
				return stringVal;
		}

		return val.replace(replace, format);
	},

	/**
		* 주민번호체크
		*/
	jumin_no_check : function(form, H, L, curDate) {
		var hLength = H.length;
		var lLength = L.length;
		var hValue = H.toString();
		var lValue = L.toString();

		var hVal = new Array(6);
		var lVal = new Array(7);

		if (hLength == 8) {

			if (lLength == 7) {
				if (Util.checkDate(hValue, curDate) == false
						|| ("1,2,3,4").indexOf(lValue.substring(0, 1)) == -1) {
					if (("1,2,3,4").indexOf(lValue.substring(0, 1)) == -1)
						alert("주민등록번호 뒷번호 첫째자리는 1 또는 2 또는 3 또는 4 만 입력가능합니다.");
					form.focus();
					return false;
				}

			} else {
				form.focus();
				return false;
			}

		} else {
			form.focus();
			return false;
		}

		return true;
	},

	/**
		* 만 나이 계산
		*
		* @param date
		* 대상일자(주민번호 또는 대상일자)
		*/
	getManAge : function(date) {

		var today = new Date();
		var yyyy  = today.getFullYear();
		var month = today.getMonth() + 1;
		var day   = today.getDate();

		man_age = parseInt(yyyy) - parseInt(date.substring(0, 4));

		var today_month = parseInt(month, 10);
		var birth_month = parseInt(date.substring(4, 6), 10);

		var today_day = parseInt(day, 10);
		var birth_day = parseInt(date.substring(6, 8), 10);

		if (today_month < birth_month) {
			man_age = man_age - 1;
		} else if (today_month == birth_month && today_day < birth_day) {
			man_age = man_age - 1;
		}

		return man_age;
	},

	/**
		* 나이(보험연령:6개월에서 반올림) 계산
		*
		* @param jumin1
		* @param str
		* 나이계산하는 함수
		*/
	AgeCal : function(jumin1, str, curDate) {
		var today = curDate;

		var toyy = today.substring(0, 4);
		var tomm = today.substring(4, 6);
		var todd = today.substring(6, 8);

		var datechk = false;

		var juyy = eval(jumin1.substring(0, 4));
		var jumm = eval(jumin1.substring(4, 6));
		var judd = eval(jumin1.substring(6, 8));
		var juwm = eval(str);

		if (((tomm == 1 || tomm == 3 || tomm == 5 || tomm == 7 || tomm == 8
		|| tomm == 10 || tomm == 12) && todd == 31)
		|| ((tomm == 4 || tomm == 6 || tomm == 9 || tomm == 11) && todd == 30)
		|| (tomm == 2 && todd == 28 && !Util.LeafYearCheck(toyy))
		|| (tomm == 2 && todd == 29 && Util.LeafYearCheck(toyy)))
			datechk = true;

		var caldd = eval(todd) - eval(judd);

		if (caldd < 0 && datechk == false)
			tomm = tomm - 1

		var calmm = eval(tomm) - eval(jumm);

		if (calmm < 0) {
			toyy = toyy - 1;
			calmm = calmm + 12;
		}

		calyy = eval(toyy) - eval(juyy);

		if (calmm > 5)
			calyy = calyy + 1;
		return calyy;
	},

	/**
		* 사용자가 입력한 날짜가 유효한 날짜인지 체크
		*
		* @param str
		*/
	checkDate : function (str, curDate) {
		/*현재 년도*/
		var toyy = curDate.substring(0, 4);

		var yyyy = eval(str.substring(0, 4));
		var mm = eval(str.substring(4, 6));
		var dd = eval(str.substring(6, 8));
		var months = new Array("", "1", "2", "3", "4", "5", "6", "7", "8", "9",
				"10", "11", "12");

		if (yyyy < 1900 || yyyy > toyy) {
			var customer = toyy;
			alert(" 생년월일의 연도를 확인해 주세요.  연도는 1900년 부터 " + customer
					+ "년 까지 입력 할 수 있습니다.");
			return false;
		}

		if (mm < 1 || mm > 12) {
			alert(" 생년월의 달을 확인해 주세요. 달은 1월 ~ 12월 까지만 가능합니다.");
			return false
		}

		if (dd == 00) {
			alert("생년월일의 일자를 확인해주세요. " + months[mm] + "월의 시작일은 1일 입니다.");
			return false;
		}

		if ((mm != 2) && (mm == 4 || mm == 6 || mm == 9 || mm == 11) && dd > 30) {
			alert("생년월일의 달을 확인해주세요.  " + months[mm] + "월의 마지막 날은 30일 입니다.");
			return false;
		} else if ((mm != 2) && (dd > 31)) {
			alert("생년월일의 달을 확인해주세요.  " + months[mm] + "월의 마지막 날은  31일 입니다.");
			return false;
		}

		if (mm == 2) {
			var leap;
			leap = Util.LeafYearCheck(yyyy);
			if (leap == true && dd > 29) {
				alert("생년월일의 달을 확인해주세요.  " + yyyy + "년의  2월은 29일 까지 있습니다.");
				return false;
			} else if (leap == false && dd > 28) {
				alert("생년월일의 달을 확인해주세요.  " + yyyy + "년의 2월은 28일 까지 있습니다.");
				return false;
			}
		}
	},

	/**
		* 윤년 여부 체크
		*
		* @param str
		*/
	LeafYearCheck : function (yyyy) {
		if ((yyyy % 4) == 0) {
			if ((yyyy % 100) == 0) {
				if ((yyyy % 400) == 0)
					return true;
				else
					return false;
			} else
				return true;
		}

		return false;
	},

	/**
		* 숫자여부 체크
		*
		* @param str
		*/
	isNum : function (val) {
		var numic = "0123456789";
		var i = 0;
		for (i = 0; i < val.length; i++) {
			var loc = numic.indexOf(val.charAt(i));
			if (loc == -1) {
				alert('숫자로 입력하여주세요.');
				return false;
			}
		}
		return true;
	},

	/**
		* arugments params 추출 후 formData 반환(첨부파일)
		* @param frm
		*/
	getFormData : function(frm){
		frmObj = frm;
		var formData = new FormData();
		var obj = frm.serializeObject();

		//첨부파일 우선시~
		var cnt = 0;
		var aNames = new Array();
		var len = frm.find("input[name^='atchFiles']").length;
		frm.find("input[name^='atchFiles']").each(function(){
			if( this != null && this.files.length == 1 ){
				cnt++;
				formData.append(this.name, this.files[0]);
				aNames.push(this.files[0].name);
				if( cnt == len ){
					formData.append(this.name+'Name', aNames.join(","));
				}
			}
		});

		//form element 처리~
		if( cnt > 0 ){
			for( var n in Object.keys(obj) ){
				var key = Object.keys(obj)[n];
				if( obj[key] != "" ){
					formData.append(key, obj[key]);
				}
			}
			//formData.append("params", JSON.stringify(obj));
		}else{
			formData = JSON.stringify(obj);
		}

		return formData;
	},

	/**
		* message popup arugments params 추출 #2
		* @param p
		* @param n
		*/
	getCallbackArgsTypeProc : function(p, n){
		var arr = new Array();

		if( p && p[n] ){
			//value 유형 확인 && 파라미터[1] 속성 array 및 배열 갯수 1개 이상
			if( typeof p[n] == "object" && Array.isArray(p[n]) && p[n].length > 0 ){
				//[0]번째 유형 함수 유무
				if( typeof p[n][0] == "function" ){
					arr.push( p[n][0] );
				}else{
					arr.push( null );//yes콜백함수 초기화
				}
				//[1]번째 유형 함수 유무
				if( p[n][1] && typeof p[n][1] == "function" ){
					arr.push( p[n][1] );//[1]번째 배열 push
				}else{
					arr.push( null );//no콜백함수 초기화
				}
			}else if( typeof p[n] == "function" ){
				arr.push( p[n] );//yes콜백함수 세팅
				if( p[n+1] && typeof p[n+1] == "function" ){
					arr.push( p[n+1] );//no콜백함수 세팅
				}else{
					arr.push( null );//콜백함수버튼 초기화
				}
			}
		}

		return arr;
	},

	/**
		* message popup arugments params 추출
		* @param args
		*/
	getMsgArgsParams : function(args){
		var _msg = null;
		var _btn = null;
		var _callback = null;
		var p = [];

		var regExp = /^\s|\s$/g;//양쪽 공백 제거
		var btnYesTxt = "확인";
		var btnNoTxt = "취소";
		var arr = new Array();

		if( args ){
			if( typeof args[0] == "string" ){
				for( var n in args ){
					p.push(args[n]);
				}
			}else if( typeof args[0] == "object" ){
				p.push(args[0]);
			}
		}

		//파라미터 전달 유무
		if( p.length == 0 ){
			//console.log( "[Arguments] is empty" );
			//alert( "[Arguments] is empty" );
			return;
		}
		//파리미터[0] 타입 확인 (object==>{msg:'',btn:'',callback:''}, string==>"메시지","확인","취소", callback)
		if( typeof p[0] != "string" && typeof p[0] != "object" ){
			//console.log( "[Arguments] is not in the correct format" );
			//alert( "[Arguments] is not in the correct format" );
			return;
		}

		//파리미터[0] 타입 확인 (object==>{msg:'',btn:'',callback:''}
		if( typeof p[0] == "object" ){
			//url 속성 유무 확인
			if( !_.has(p[0], "msg") ){
				//console.log( "[message] is not exist" );
				//alert( "[message] is not exist" );
				return;
			}
			//msg 속성 value 유무 확인
			if( !p[0].msg && p[0].msg.replace(regExp,'').length > 0 ){
				//console.log( "[message] is empty" );
				//alert( "[message] is empty" );
				return;
			}
			_msg = p[0].msg;

			//btn 속성 유무 확인 및 btn 속성 value 유무
			if( _.has(p[0], "btn") && p[0].btn ){
				//value 유형 확인 && btn 속성 array 및 배열 갯수 1개 이상
				if( typeof p[0].btn == "object" && Array.isArray(p[0].btn) && p[0].btn.length > 0 ){
					//[0]번째 텍스트 1자 이상
					if( p[0].btn[0].replace(regExp,'').length > 0 ){
						arr.push( p[0].btn[0] );
					}else{
						arr.push( btnYesTxt );//yes버튼 초기값 세팅
					}
					//[1]번째 텍스트 1자 이상
					if( p[0].btn[1] && p[0].btn[1].replace(regExp,'').length > 0 ){
						arr.push( p[0].btn[1] );//[1]번째 배열 push
					}else{
						arr.push( btnNoTxt );//no버튼 초기값 세팅
					}
					_btn = arr.length > 0?arr:null;//push된 배열 0개이면 null세팅
				}else if( typeof p[0].btn == "string" && p[0].btn.replace(regExp,'').length > 0 ){
					_btn = [p[0].btn, btnNoTxt];
				}
			}
			if( !_btn ){
				_btn = [btnYesTxt,btnNoTxt];//버튼 초기값 세팅
			}

			//array 초기화
			arr = new Array();

			//callback 속성 유무 확인 및 callback 속성 value 유무
			if( _.has(p[0], "callback") && p[0].callback ){
				//value 유형 확인 && callback 속성 array 및 배열 갯수 1개 이상
				if( typeof p[0].callback == "object" && Array.isArray(p[0].callback) && p[0].callback.length > 0 ){
					//[0]번째 유형 함수 유무
					if( typeof p[0].callback[0] == "function" ){
						arr.push( p[0].callback[0] );
					}else{
						arr.push( null );//yes콜백함수 초기화
					}
					//[1]번째 유형 함수 유무
					if( p[0].callback[1] && typeof p[0].callback[1] == "function" ){
						arr.push( p[0].callback[1] );//[1]번째 배열 push
					}else{
						arr.push( null );//no콜백함수 초기화
					}
					_callback = arr.length > 0?arr:null;//push된 배열 0개이면 null세팅
				}else if( typeof p[0].callback == "function" ){
					_callback = [p[0].callback, null];
				}
			}
		}else{
			//파라미터[0] 타입 확인 (유형 : "문자열")
			if( typeof p[0] == "string" ){
				_msg = p[0];
			}

			//파라미터[1] 콜백(문자열 또는 배열 ==> 파라미터[1] 문자열의 경우 파라미터[2] value 확인 후 함께 처리)
			if( p[1] ){
				//value 유형 확인 && 파라미터[1] array 및 배열 갯수 1개 이상
				if( typeof p[1] == "object" && Array.isArray(p[1]) && p[1].length > 0 ){
					//[0]번째 텍스트 1자 이상
					if( typeof p[1][0] == "string" ){
						if( p[1][0].replace(regExp,'').length > 0 ){
							arr.push( p[1][0] );
						}else{
							arr.push( btnYesTxt );//yes버튼 초기값 세팅
						}
					}
					if( p[1][1] && typeof p[1][1] == "string" ){
						//[1]번째 텍스트 1자 이상
						if( p[1][1].replace(regExp,'').length > 0 ){
							arr.push( p[1][1] );//[1]번째 배열 push
						}else{
							arr.push( btnNoTxt );//no버튼 초기값 세팅
						}
					}
					_btn = arr.length > 0?arr:null;//push된 배열 0개이면 null세팅
				}else if( typeof p[1] == "string" && p[1].replace(regExp,'').length > 0 ){
					arr.push( p[1] );//yes버튼 세팅
					if( p[2] && typeof p[2] == "string" && p[2].replace(regExp,'').length > 0 ){
						arr.push( p[2] );//no버튼 세팅
					}else{
						arr.push( btnNoTxt );//no버튼 세팅
					}
					_btn = arr;//push된 배열 0개이면 null세팅
				}
			}

			//array 초기화
			arr = new Array();

			if( !_btn ){
				//파라미터[1] 콜백(함수 또는 배열 ==> 버튼텍스트 생략일 경우)
				arr = Util.getCallbackArgsTypeProc(p, 1);
			}else{
				//파라미터[2] 콜백(함수 또는 배열 ==> 버튼텍스트 '배열 또는 문자열1개'일 경우)
				arr = Util.getCallbackArgsTypeProc(p, 2);

				if( arr.length == 0 ){
					//파라미터[3] 콜백(함수 또는 배열 ==> 버튼텍스트 '문자열2개'일 경우)
					arr = Util.getCallbackArgsTypeProc(p, 3);
				}
			}

			_callback = arr.length > 0?arr:null;//push된 배열 0개이면 null세팅
		}

		//msg, btn, callback 결과 value를 object() 형태로 return
		return new Object({"msg":_msg,"btn":(_btn?_btn:[btnYesTxt,btnNoTxt]),"callback":_callback});
	},

	/**
		* arugments params 추출
		* @param args
		*/
	getArgsParams : function(args){
		var _url = null;
		var _data = "{}";
		var _contentType = "application/json;charset=UTF-8";
		var _dataType = "json";
		var _callback = null;
		var _server = "";
		var p = [];

		if( args ){
			if( typeof args[0] == "string" ){
				for( var n in args ){
					p.push(args[n]);
				}
			}else if( typeof args[0] == "object" ){
				p.push(args[0]);
			}
		}

		//파라미터 전달 유무
		if( p.length == 0 ){
			//console.log( "[Arguments] is empty" );
			//alert( "[Arguments] is empty" );
			alert( _Message.get("error.common.001") );
			return;
		}
		//파리미터[0] 타입 확인 (object==>{url:'',data:'',callback:''}, string==>"/admin*/**.do","{\"p1\":\"11\"}")
		if( typeof p[0] != "string" && typeof p[0] != "object" ){
			//console.log( "[Arguments] is not in the correct format" );//error.common.002
			//alert( "[Arguments] is not in the correct format" );
			alert( _Message.get("error.common.002") );
			return;
		}

		//파리미터[0] 타입 확인 (object==>{url:'',data:'',contentType:'',dataType:'',callback:''}
		if( typeof p[0] == "object" ){
			//url 속성 유무 확인
			if( !_.has(p[0], "url") ){
				//console.log( "[URL] is not exist" );//error.common.003
				//alert( "[URL] is not exist" );
				alert( _Message.get("error.common.003") );
				return;
			}
			//url 속성 value 유무 확인
			if( !p[0].url ){
				//console.log( "[URL] is empty" );//error.common.003
				//alert( "[URL] is empty" );
				alert( _Message.get("error.common.003") );
				return;
			}
			//url 속성 value URL포맷 검증
			if( /^\/.*\.do/g.test(p[0].url) == false ){// [/]시작하며 [.do]으로 마무리 포맷 아닌지 확인
				if( /\//g.test(p[0].url) == false && /\.do/g.test(p[0].url) == true ){// [/]미포함+ [.do]으로 마무리 포맷 인지 확인
					p[0].url = location.pathname.substring(0,location.pathname.lastIndexOf("/")+1)+p.url;
					p[0].url = p[0].url.replace(/[/]+/g, "/");// url텍스트에 역슬러시가 연속으로 있으면 1개만 남기고 제거
				}else{
					//console.log( "[URL] is not in the correct format" );//error.common.004
					//alert( "[URL] is not in the correct format" );
					alert( _Message.get("error.common.004") );
					return;
				}
			}
			_url = p[0].url;

			//data 속성 유무 && 속성 value 유무 확인
			if( _.has(p[0], "data") && p[0].data ){
				try{
					// data 속성 value 타입확인 및 검증(object, string만 허용, string일 경우 object으로 변환하여 오류 검증)
					if( (typeof p[0].data != "object" && typeof p[0].data != "string") || ( typeof p[0].data == "string" && typeof JSON.parse(p[0].data) != "object" ) ){
						throw e;
					}

					//if( typeof p[0].data == "object" && p[0].data.has("atchFiles") == false ){
					if( typeof p[0].data == "object" ){
						try{
							p[0].data.has("atchFiles");
							_data = p[0].data;
						}catch(e){
							_data = JSON.stringify(p[0].data);
						}
					}else{
						_data = p[0].data;
					}
				}catch(e){
					//console.log( "[DATA] is not in the correct format" );//error.common.005
					//alert( "[DATA] is not in the correct format" );
					alert( _Message.get("error.common.005") );
					return;
				}
			}

			//contentType 속성 유무 && 속성 value 유무 확인
			if( _.has(p[0], "contentType") && p[0].contentType ){
				//contentType 속성 value 타입확인 (string 타입만 허용)
				if( typeof p[0].contentType == "string" ){
					_contentType = p[0].contentType;
				}else{
					//console.log( "[contentType] is not function" );
					//alert( "[contentType] is not function" );
					//return;
				}
			}

			//dataType 속성 유무 && 속성 value 유무 확인
			if( _.has(p[0], "dataType") && p[0].dataType ){
				//dataType 속성 value 타입확인 (string 타입만 허용)
				if( typeof p[0].dataType == "string" ){
					_dataType = p[0].dataType;
				}else{
					//console.log( "[dataType] is not function" );
					//alert( "[dataType] is not function" );
					//return;
				}
			}

			//callback 속성 유무 && 속성 value 유무 확인
			if( _.has(p[0], "callback") && p[0].callback ){
				//callback 속성 value 타입확인 (function 타입만 허용)
				if( typeof p[0].callback == "function" ){
					_callback = p[0].callback;
				}else{
					//console.log( "[CALLBACK] is not function" );
					//alert( "[CALLBACK] is not function" );
					//return;
				}
			}

			//server 속성 유무 && 속성 value 유무 확인
			if( _.has(p[0], "server") && p[0].server ){
				//dataType 속성 value 타입확인 (string 타입만 허용)
				if( typeof p[0].server == "string" ){
					_server = p[0].server;
					if( /^\//.test(_server) == false ){
						_server = "/"+_server;
					}
					if( p[0].url.indexOf(_server) == -1 ){
						if( /^\//.test(p[0].url) == false ){
							p[0].url = "/"+p[0].url;
						}
						p[0].url = _server+p[0].url;
					}
				}else{
					//console.log( "[dataType] is not function" );
					//alert( "[dataType] is not function" );
					//return;
				}
			}
		}else{
			//파라미터[0] 타입 확인 (string==>"/admin*/**.do","{\"p1\":\"11\"}")
			if( typeof p[0] == "string" ){
				if( /^\/.*\.do/g.test(p[0]) == false ){// [/]시작하며 [.do]으로 마무리 포맷 아닌지 확인
					if( /\//g.test(p[0]) == false && /\.do/g.test(p[0]) == true ){// [/]미포함+ [.do]으로 마무리 포맷 인지 확인
						p[0] = location.pathname.substring(0,location.pathname.lastIndexOf("/")+1)+p[0];
						p[0] = p[0].replace(/[/]+/g, "/");// url텍스트에 역슬러시가 연속으로 있으면 1개만 남기고 제거
					}else{
						//console.log( "[URL] is not in the correct format" );//error.common.004
						//alert( "[URL] is not in the correct format" );
						alert( _Message.get("error.common.004") );
						return;
					}
				}
			}
			_url = p[0];

			//파라미터[1] value 유무 확인
			if( p[1] ){
				try{
					// 파라미터[1] value 타입확인 및 검증(object, string만 허용, string일 경우 object으로 변환하여 오류 검증)
					if( (typeof p[1] != "object" && typeof p[1] != "string") || ( typeof p[1] == "string" && typeof JSON.parse(p[1]) != "object" ) ){
						throw e;
					}

					//if( typeof p[1] == "object" && p[1].has("atchFiles") == false ){
					if( typeof p[1] == "object" ){
						try{
							p[1].has("atchFiles");
							_data = p[1];
						}catch(e){
							_data = JSON.stringify(p[1]);
						}
					}else{
						_data = p[1];
					}
				}catch(e){
					//console.log( "[DATA] is not in the correct format" );//error.common.005
					//alert( "[DATA] is not in the correct format" );
					alert( _Message.get("error.common.005") );
					return;
				}
			}

			//파라미터[2] value 유무 확인
			if( p[2] ){
				//파라미터[2] value 타입확인 (function 타입만 허용)
				if( typeof p[2] == "function" ){
					_callback = p[2];
				}else{
					//console.log( "[CALLBACK] is not function" );
					//alert( "[CALLBACK] is not function" );
					//return;
				}
			}
		}

		var orgData = new Object();
		try{
			orgData = JSON.parse(_data);
		}catch(e){
			Object.keys(_data).forEach(function (k) {
				orgData[k] = _data[k];
			});
		}

		//url, contentType, dataType, data, callback 결과 value를 object() 형태로 return
		return new Object({
			"url":_url,
			"contentType":_contentType,
			"dataType":_dataType,
			"data":_data,
			"oData":orgData,
			"callback":_callback,
			"server":_server
		});
	},

	/**
		* container 화면 이동load()
		* @param string 이동URL
		* @param object 전달데이터
		* or
		* @param object 이동URL, 전달데이터
		* ex) Util.movePage({url:"/ac/com/accom003.do",data: {"use_flag":"1"}});
		*/
	movePage : function(){

		sessionStorage.setItem("_moveSendData", "{}");
		var p = Util.getArgsParams(arguments);

		if( /.*\/(main|index|intro|ogin)\.do$/g.test(p.url) == true ){
			location.href = (_context.length > 1 && p.url.indexOf(_context) == -1 ? _context:"") + p.url;
		}else{
			if( $(".container").length < 1 ){
				//console.log( "[container] element is not exist" );//error.common.006
				//alert( "[container] element is not exist" );
				alert( _Message.get("error.common.006") );
				return;
			}

			var regExp = /.*class\="contents".*/g;
			var regExp_Curr = /.*class\="curr".*/g;
			var regExp_Dis = /\/disclosure\//g;
			$.ajaxSetup(null);
			$.ajaxSetup( {type : "GET"} );

			$.ajax({
				type : "GET",
				data : "",
				url : p.url,
				success:function(res, status, xhr){
					try{
						if( regExp.test(res) == false && /#divCMSBody/ig.test(res) == false ){
							//console.log( "[contents] class attribute is not exist" );//error.common.007
							//alert( "[contents] class attribute is not exist" );
							alert( _Message.get("error.common.007") );
							return;
						}

						if( _context != "/mycardif" && /\/mycardif\//.test(p.url) == true ){//홈페이지 > 마이카디프 이동
							_context = "/mycardif";
						}else if( _context == "/mycardif" && /\/mycardif\//.test(p.url) == false ){//마이카디프 > 홈페이지 이동
							_context = "";
						}

						var pUrl = p.url;
						var queryString = fnQueryStringMessage(p.data);
						var pData = p.data;
						if(typeof queryString != 'undefined' && queryString != ''){
							pUrl += queryString;
						}
						//브라우저 주소창 url 강제 변경
						history.pushState(null, null, pUrl);

						//공시실 페이지 이동(CMS의body의 경우 skip)
						if( /#divCMSBody/ig.test(res) == true ){
							$("#containerWrap").html(res);
						}else{
							if( regExp_Dis.test(p.url) == true ){
								$("#containerWrap").html(res);
							}else{
								if( regExp_Curr.test(res) == true ){//공시실 이외 메뉴 등록 페이지 이동
									$("#containerWrap").html(res);
								}else{                              //공시실 이외 메뉴 미등록 페이지 이동
									$(".contents").replaceWith(res);
								}
							}
						}

						//html 이벤트 재등록
						Util.fnReAddHtmlEvent();

						sessionStorage.setItem('_moveSendData', !_.isEmpty(p["data"]) ? JSON.stringify(p) : "{}");
						if( p.callback ){ p.callback(p); }
					}catch(e){
						alert( _Message.get("b2b.co.0002") );
					}
				}
			});
		}
	},

	/**
		* ajax 모듈
		*
		* ex) Util.sendData({
				url : "/ac/com/rest/selectACCOM002List.do",
			contentType : "application/json;charset=UTF-8",
			dataType : "json",
			data : JSON.stringify({"use_flag":"1"}),
			callback : callback_001,
			server : "homepage"
		});
	*/
	sendData : function(){
		var p = Util.getArgsParams(arguments);

		//IE 첨부파일
		if(navigator.userAgent.toLowerCase().indexOf("trident") > -1 && (frmObj && frmObj.find("input[type='file']") && frmObj.find("input[type='file']").length > 0 && frmObj.find("input[type='file']").val().length > 0)){
			frmObj.attr("method","POST");
			frmObj.attr("action",p.url);
			frmObj.attr("enctype","multipart/form-data");

			frmObj.ajaxSubmit({
				method:"POST",
				enctype:"multipart/form-data",
				contentType : false,
				processData : false,
				cache : false,
				timeout : 600000,
				dataType : 'json',
				url:p.url,
				success:function(res){
					frmObj = null;
					if( p.callback ){ p.callback(res, p); }
				},
				error:function(xhr, err){
					frmObj = null;
					if( p.callback ){ p.callback(null, p, xhr, err); }
				}
			});
		}else{//그외~~~~
			var opt = {
				type : "POST",
				data : p.data,
				url : p.url,
				success:function(res, status, xhr){
					if( p.callback ){ p.callback(res, p, status, xhr); }
				},
				error:function(xhr, status, err){
					if( p.callback ){ p.callback(null, p, xhr, status, err); }
				}
			};

			try{
				p.data.has("atchFiles");

				opt.enctype = "multipart/form-data";
				opt.contentType = false;
				opt.processData = false;
				opt.cache = false;
				opt.timeout = 600000;
				if( _.has(p, "timeout") == true ){
					opt.timeout = p.timeout;
				}
				opt.async = true;
				if( _.has(p, "async") == true ){
					opt.async = p.async;
				}
			}catch(e){
				opt.contentType = p.contentType?p.contentType:"application/json;charset=UTF-8";
				opt.dataType = p.dataType?p.dataType:"json";
				if( _.has(p, "timeout") == true ){
					opt.timeout = p.timeout;
				}
			}

			$.ajax(opt);
		}
	},

	/**
		* 보안프로그램 다운로드(메인 > 고객센터 > 보안프로그램 설치안내)
		*
		* @param _code string 다운로드 파일 일련번호
		* ex) Util.secuFileDownload("002");
		*/
	secuFileDownload : function(_code){
		_LoadingPop.show();
		$("body").append( $("<form/>", {method:"GET",name:"frmDownload",id:"frmDownload",action:_context+"/common/rest/fileDownloadFront.do"}) );
		$("#frmDownload").append( $("<input/>", {type:"hidden",name:"fileId",id:"fileId",value:_code}) );
		$("#frmDownload").submit();
		setTimeout( function(){
			$("#frmDownload").remove();
			_LoadingPop.hide();
		}, 500);   //0.5초 후 form Element 제거
	},

	/**
		* 첨부파일 모듈(backend)
		*
		* @param data Object 전송파라미터
		* ex) Util.fileDownload( {"fileId":"1","atchFileDiv":"DIS"} );
		*/
	fileDownload : function(data){
		//Util.fileDownloadAjax(data, ""); //ajax
		//Util.fileDownloadForm(data, "");    //form action (권장)
		Util.fileExistCheck(data, "");//ajax 실제 파일 존재하는지 체크
	},

	/**
		* 첨부파일 모듈(front)
		*
		* @param data Object 전송파라미터
		* ex) Util.fileDownloadFront( {"fileId":"1","atchFileDiv":"DIS"} );
		*/
	fileDownloadFront : function(data){
		//Util.fileDownloadAjax(data, "Front"); //ajax
		//Util.fileDownloadForm(data, "Front");    //form action (권장)
		Util.fileExistCheck(data, "Front");//ajax 실제 파일 존재하는지 체크
	},

	/**
		* ajax 첨부파일 존재 유무 체크
		* @param data Object 전송파라미터
		* @param div String 프런트 / 백엔드 다운로드 포지션 구분자
		*/
	fileExistCheck : function(data, div){
		if( !data || (_.has(data, "fileId") == false || (_.has(data, "fileId") == true && data["fileId"] == false)) && (_.has(data, "fileEntryId") == false && (_.has(data, "fileEntryId") == true || data["fileEntryId"] == false)) ){
			//alert("다운로드시 오류가 발생하였습니다.<br/>(파일정보가 없습니다.)");//error.common.000
			alert( _Message.get("error.9999",["파일정보가 없습니다."]) );
			return;
		}
		if( !div ) div = "";

		data["frontBackDiv"] = div;
		Util.sendData({
			url : _context+"/common/rest/fileExistCheck.do",
			data : JSON.stringify(data),
			callback : function(_result){
				try{
					if( _result && _result.resultCode > 0 ){
                        //[RBP22100073] (MyCardif) 카디프가이드, 펀드성과분석, 투자리포트 페이지 수정
                        //월간 투자리포트를 앱에서 봐아해서 추가
						if( _result.data && /\/attach_file\//ig.test(_result.data) ){
                            var contextPath = '/mycardif';
                            if( /bnp_android/ig.test(navigator.userAgent) ){
                                window.android.openDocWeb(location.origin+contextPath+_result.data  + '?appYN=Y','download');
                            }else if( /bnp_ios/ig.test(navigator.userAgent) ){
                                window.location = "openinnerpdfviewer://"+location.origin+contextPath+_result.data;
                            }
                            return;
                        }
                        if( data['atchFileDiv'] ){
                            Util.fileDownloadCountAdd(data, div);//ajax 첨부파일 다운로드 카운드 증가
                        }else{
                            Util.fileDownloadForm(data, div);
                        }
					}else{
						//alert("다운로드시 오류가 발생하였습니다.<br/>(파일이 존재하지 않습니다.)");//error.common.008
						alert( _Message.get("error.common.008") );
					}
				}catch(e){
					alert( _Message.get("b2b.co.0002") );
				}
			}
		});
	},

	/**
		* ajax 첨부파일 다운로드 카운드 증가
		* @param data Object 전송파라미터
		* @param div String 프런트 / 백엔드 다운로드 포지션 구분자
		* ※'ASSET'은 카운드 update skip
		*/
	fileDownloadCountAdd : function(data, div){
		if( data.atchFileDiv != "ASSET" && data.atchFileDiv != "CLAIM" && data.atchFileDiv != "VOC"){
			Util.sendData({
				url : _context+"/common/rest/fileDownloadCountAdd.do",
				data : JSON.stringify(data),
				callback : function(_result){
					try{
						if( _result ){
							Util.fileDownloadForm(data, div);
						}else{
							alert( _Message.get("b2b.co.0002") );
						}
					}catch(e){
						alert( _Message.get("b2b.co.0002") );
					}
				}
			});
		}else{
			Util.fileDownloadForm(data, div);
		}
	},

	/**
		* ajax 첨부파일 모듈(front & backend)
		*
		* @param data Object 전송파라미터
		* @param div String 프런트 / 백엔드 다운로드 포지션 구분자
		*/
	fileDownloadForm : function(data, div){
		if( data == null || Object.keys(data).length == 0 ){
			alert( _Message.get("error.9999",["파일정보가 없습니다."]) );
			return;
		}

		$("body").append( $("<form/>", {method:"GET",name:"frmDownload",id:"frmDownload",target:"_blank",action:_context+"/common/rest/fileDownload"+div+".do"}) );
		var obj = Object.keys(data);
		for( var n in obj ){
			var key = obj[n];
			var value = data[key];
			$("#frmDownload").append( $("<input/>", {"type":"hidden","name":key,"id":key,"value":value}) );
		}
		$("#frmDownload").submit();

		setTimeout( function(){
			$("#frmDownload").remove();
			_LoadingPop.hide();
		}, 1000);   //1초 후 form Element 제거
	},

	/**
		* ajax 첨부파일 모듈
		* @param data Object 전송파라미터
		* @param div String 프런트 / 백엔드 다운로드 포지션 구분자
		*/
	fileDownloadAjax : function(data, div){

		if( !div ) div = "";

		$.ajaxSetup(null);
		$.ajax({
			type : "POST",
			url :_context+"/common/rest/fileDownload"+div+".do",
			contentType : "application/json;charset=UTF-8",
			data : JSON.stringify(data),
			xhrFields : { responseType: 'arraybuffer' },
			success : function(data, textStatus, jqXhr){
				try {
					var blob = new Blob([data], { type: jqXhr.getResponseHeader('content-type') });
					var fileName = Util.fnGetFileName(jqXhr.getResponseHeader('content-disposition'));
					fileName = decodeURI(fileName);

					if (window.navigator.msSaveOrOpenBlob) { // IE 10+
						window.navigator.msSaveOrOpenBlob(blob, fileName);
					} else { // not IE
						var link = document.createElement('a');
						var url = window.URL.createObjectURL(blob);
						link.href = url;
						link.target = '_self';
						if (fileName){
							link.download = fileName;
						}
						document.body.append(link);
						link.click();
						link.remove();
						window.URL.revokeObjectURL(url);
					}
				} catch (e) {
					//console.log("다운로드시 오류가 발생하였습니다.");//error.common.000
					//alert("다운로드시 오류가 발생하였습니다.");
					alert( _Message.get("error.common.000") );
					return;
				}
			},
			error: function(ev, xhr, settings, err){
				//console.log("서버 연결이 실패하였습니다.");//error.http.code.000
				//alert("서버 연결이 실패하였습니다.");
				alert( _Message.get("error.http.code.000") );
				return;
			}
		});
	},

	/**
		* 다운로드 파일명 추출
		*
		* ex) Util.fnGetFileName("");
		*/
	fnGetFileName : function(contentDisposition){
		var fileName = contentDisposition
			.split(';')
			.filter(function(ele) {
				return ele.indexOf('filename') > -1
			})
			.map(function(ele) {
				return ele
					.replace(/"/g, '')
					.split('=')[1]
			});
		return fileName[0] ? fileName[0] : null
	},

	getLoadingHtml : function(callback){
		var opt = {
			type : "POST",
			data : "",
			url : "/common/popup/loading.do",
			success:function(result){
				_loadingHtml = result;
				if( callback ) callback();
			},
			error:function(){
				if( callback ) callback();
			}
		};
		$.ajax(opt);
	},

	getConfirmHtml : function(callback){
		var opt = {
			type : "POST",
			data : "",
			url : "/common/popup/confirm.do",
			success:function(result){
				_confirmHtml = result;
				if( callback ) callback();
			},
			error:function(){
				if( callback ) callback();
			}
		};
		$.ajax(opt);
	},

	getAlertHtml : function(callback){
		var opt = {
			type : "POST",
			data : "",
			url : "/common/popup/alert.do",
			success:function(result){
				_alertHtml = result;
				if( callback ) callback();
			},
			error:function(){
				if( callback ) callback();
			}
		};
		$.ajax(opt);
	},

	/**
		* 게시판 페이징
		*
		* ex) Util.setPaing(99999, map);
		*/
	setPagination : function(obj, m){

		var totalCnt = m['t'];
		var pageIndex = m['p'];
		var pageSize = m['s'];
		var pageUnit = m['u'];
		var callback = m['c'];

		if( !pageIndex ){ pageIndex = 1; }
		if( !pageSize  ){ pageSize  = 10; }
		if( !pageUnit  ){ pageUnit  = 10; }

		var _totalCnt = parseInt(totalCnt+"");
		var _pageIndex = parseInt(pageIndex+"");
		var _pageSize = parseInt(pageSize+"");
		var _pageUnit = parseInt(pageUnit+"");

		var _htmlStr = "";//페이징 html tag
		var _totalPageCnt = 0;//전체 페이지 수
		var _pageGroupStart = 0; //화면에 보이는 페이지 번호 목록 중 첫번째 번호
		var _pageGroupEnd = 0;//화면에 보이는 페이지 번호 중 마지막 번호

		//전체 페이지 수 계산
		_totalPageCnt = Math.floor(_totalCnt / _pageSize);
		if( (_totalCnt % _pageSize) > 0 ){
			_totalPageCnt++;
		}

		//화면에 보이는 페이지 번호 목록 중 첫번째 번호 계산
		if( (_pageIndex % _pageUnit) == 0 ){
			_pageGroupStart = ((Math.floor(_pageIndex/_pageUnit)) * _pageUnit) - _pageUnit + 1;
		}else{
			_pageGroupStart = (Math.floor(_pageIndex/_pageUnit)) * _pageUnit + 1;
		}

		//화면에 보이는 페이지 번호 목록 중 마지막 번호 계산
		_pageGroupEnd = _pageGroupStart + _pageUnit - 1;
		if( _totalPageCnt < _pageGroupEnd ){
			_pageGroupEnd = _totalPageCnt;
		}

		_htmlStr += "";
		_htmlStr += "<span>";

		//처음으로(<<)
		if( _pageGroupStart > 0 && _pageGroupStart-_pageUnit > 0 ){
			_htmlStr += "<a href=\"javascript:void(0);\" class=\"previous\" title=\"1페이지\">&lt;&lt;</a>";
		}

		//이전으로(<)
		if( _pageGroupStart > 0 && _pageGroupStart-_pageUnit > 0 ){
			_htmlStr += "<a href=\"javascript:void(0);\" class=\"previous\" title=\""+(_pageGroupStart-_pageUnit)+"페이지\">&lt;</a>";
		}

		for( var ii=_pageGroupStart;ii<=_pageGroupEnd;ii++ ){
			if( _pageIndex == ii ){
				_htmlStr += "<a href=\"javascript:void(0);\" class=\"current\" title=\""+ii+"페이지\">"+ii+"</a>";
			}else{
				_htmlStr += "<a href=\"javascript:void(0);\" title=\""+ii+"페이지\">"+ii+"</a>";
			}
		}

		//다음으로(>)
		if( _totalPageCnt > _pageIndex && _totalPageCnt > _pageGroupEnd ){
			_htmlStr += "<a href=\"javascript:void(0);\" class=\"next\" title=\""+(_pageGroupEnd+1)+"페이지\">&gt;</a>";
		}

		//마지막으로(>>)
		if( _totalPageCnt > _pageIndex && _totalPageCnt > _pageGroupEnd ){
			_htmlStr += "<a href=\"javascript:void(0);\" class=\"next\" title=\""+_totalPageCnt+"페이지\">&gt;&gt;</a>";
		}

		_htmlStr += "</span>";
		_htmlStr += "";

		if( parseInt(_totalCnt) > 0 ){
			// 화면 바인딩
			$(obj).html( _htmlStr );

			//페이지 클릭 이벤트 설정
			$(obj).find("span a").click(function(){
				Util.fnPageNoClick(this, callback);
			});
		}else{
			_htmlStr = "";
		}
	},

	/**
        * 구글 차트 draw 함수
        *
        * ex) Util.fnDrawGoogleChart( {ID:'',ClassName:''}, params:{xx:{title:'',col:''},yy:{title:'',col:''},data:[],tooltip:false}, type:'Line' );
        */
    fnDrawGoogleChart : function(_obj, _params, _type){

        if( !_params ){
            alert("chart 생성 실패하였습니다.\n데이터를 확인해주세요.");
            return;
        }
        if( !_.has(_params,'xx') || !_.has(_params,'yy') || !_.has(_params,'data') ){
            alert("chart 생성 실패하였습니다.\n데이터를 확인해주세요.");
            return;
        }
        if( !_params['data'] || (!_params['xx']|| (_.has(_params['xx'],'col') && !_params['xx']['col'])) || (!_params['yy']|| (_.has(_params['yy'],'col') && !_params['yy']['col'])) ){
            alert("chart 생성 실패하였습니다.\n데이터를 확인해주세요.");
            return;
        }

        if( $("script[src*='gstatic.com/charts/']").length == 0 ){
            //$("head").find("[src*='.gstatic.com/charts/'],[href*='.gstatic.com/charts/']").remove();
            $("head").append("<link type=\"text/css\" href=\"https://www.gstatic.com/charts/51/css/core/tooltip.css\"></link>");
            $("head").append("<link type=\"text/css\" href=\"https://www.gstatic.com/charts/51/css/util/util.css\"></link>");
            $("head").append("<script type=\"text/javascript\" src=\"https://www.gstatic.com/charts/loader.js\"></script>");
            $("head").append("<script type=\"text/javascript\" src=\"https://www.gstatic.com/charts/51/loader.js\"></script>");
            $("head").append("<script type=\"text/javascript\" src=\"https://www.gstatic.com/charts/51/js/jsapi_compiled_default_module.js \"></script>");
            $("head").append("<script type=\"text/javascript\" src=\"https://www.gstatic.com/charts/51/js/jsapi_compiled_graphics_module.js \"></script>");
            $("head").append("<script type=\"text/javascript\" src=\"https://www.gstatic.com/charts/51/js/jsapi_compiled_ui_module.js \"></script>");
            $("head").append("<script type=\"text/javascript\" src=\"https://www.gstatic.com/charts/51/js/jsapi_compiled_corechart_module.js \"></script>");
        }

        var _id = null;
        if( _.has(_obj,"ID") == true && _obj['ID'] ){
            _id = "#"+_obj['ID'];
        }

        if( !_id && _.has(_obj,"ClassName") == true  && _obj['ClassName']){
            _id = "."+_obj['ClassName'];
        }

        if( !_id ){
            alert("차트 그리기 실패하였습니다.");
            return;
        }

        google.charts.load('current', {'packages' : ['corechart','line']});
        google.charts.setOnLoadCallback(function(){
            var _tooltip = _.has(_params,'tooltip')&&_params['tooltip']?_params['tooltip']:false;
            var _pXX = _params['xx'];
            var _pYY = _params['yy'];
            var _pData = _params['data'];

            var options = {
                width:$(_id).width()
                ,height:$(_id).height()
                ,legend:'none'
                //,pointSize:3
                ,hAxis:{
                    title:(!_pXX.title?"":_pXX.title)
                    ,type:(!_pXX.type?"none":_pXX.type)
                    ,format:(!_pXX.format?"none":_pXX.format)
                    ,textStyle:{
                        color:"#000"
                        ,fontSize:9
                        ,bold:true
                        ,italic:false
                        }
                    }
                ,vAxis:{
                    title:(!_pYY.title?"":_pYY.title)
                    ,type:(!_pYY.type?"none":_pYY.type)
                    ,format:(!_pYY.format?"none":_pYY.format)
                    }
                //,tooltop:{/*trigger:'focus'*/}//tooltip trigger 기본값:focus
                ,annotations:{
                    textStyle:{
                        fontSize : 10
                        ,bold : true
                        ,italic : true
                        ,opacity: 0.8
                    }
                }
            };

            var  rowData = [];
            for( var n in _pData ){
                var xx = _pData[n][_pXX.col];
                var yy = _pData[n][_pYY.col];
                var colData = [];
                colData.push(xx);
                colData.push(yy);
                colData.push(xx+'\n'+yy+'%');
                /*if( _tooltip ){
                    if( xx && yy ){
                        colData.push(xx+'\n'+yy);
                    }else{
                        colData.push('');
                    }
                }*/
                rowData.push( colData );
            }

            var data = new google.visualization.DataTable();
            data.addColumn('string','');// array : 0
            data.addColumn('number','');// array : 1
            data.addColumn({type:'string', role:'tooltip'});

            for( var n in rowData ){
                rowData[n][1] = Number(rowData[n][1]);
            }

            /*if( _tooltip ){
                data.addColumn({type:'string', role:'tooltop'});
            }*/
            data.addRows(rowData);

            var target = document.getElementById(_obj.ID);
            if( !_obj.ID && _obj.ClassName ){
                target = document.getElementsByClassName(_obj.ClassName)[0];
            }
            var chart = new google.visualization[''+_type+'Chart'](target);
            chart.draw(data, options);
        });
    },

	/**
		* 게시판 페이지 번호 클릭
		*
		* ex) Util.fnPageNoClick(callback);
		*/
	fnPageNoClick : function(obj, callback){
		var pageNo = $(obj).attr("title").replace(/페이지/g,'');
		if( $(obj).attr("class") == "current" ){
			pageNo = null;
		}
		if( callback && pageNo ){
			callback(pageNo);
		}
	},

	/**
		* 메시지 프로퍼티 session storage 세팅
		*
		* ex) Util.fnSetMessageProperties(callback);
		*/
	fnSetMessageProperties : function(message){
		sessionStorage.setItem('messageProperties', JSON.stringify(message));
		messageProperties = null;
	},

	/**
		* html 이벤트 재등록(퍼블작업 common_ui.js + ui.style.js)
		*
		* ex) Util.fnReAddHtmlEvent();
		*/
	fnReAddHtmlEvent : function(type){

		$(document).off("click",".sbtn")
			.off("click",".btnMenu")
			.off("click",".clauseList .dim")
			.off("click",".clauseList > ul > li > a")
			.off("click",".btnToggle");

		//CMS 컨텐츠 일때 우선 add된 이벤트 삭제
		if( type && type == "CMS" ){ //type == "CMS"
			//$('.gnb-toggle').off();//메인>상단 전체 메뉴 버튼 이벤트 제거
			//$('.page-btn').off();//메인>하단 좌우 슬라이더 배너 이전,다음 버튼 이벤트 제거
			$('a.btn_nt').off(); //메인 > 중간 > 패밀리사이트(combo) 이벤트 제거
		}
		$('.gongsiSelect .select').off();//공시실 location combo 이벤트 제거

		//이벤트 재등록(퍼블)
		uiStyle.init();
		common_ui.init(); //..
	},

	/**
		* 본인 인증 팝업(서버session scard_status '20' 확인 후 return)
		* @param 콜백함수 (함수, 선택사항)
		* ex) Util.authPop(fn_callback);
		*/
	authPop : function(){
		var _callback = arguments[0]||null;
		_AuthPop.all(_callback);
	},
	/**
		* 우편번호 검색 팝업
		* @param 콜백함수 (함수, 선택사항)
		* ex) Util.zipcodePop(fn_callback);
		*/
	zipcodePop : function(){
		var _callback = arguments[0]||null;
		_ZipcodePop(_callback);
	},
	/**
		* 펀드 설명(수익률) 팝업
		* @param 펀드코드, 콜백함수 (함수, 선택사항)
		* ex) Util.zipcodePop(fn_callback);
		*/
	fundRatioPop : function(){
		var _idFundCd = arguments[0]||null + "";
		_FundRatioPop(_idFundCd);
	},

	/**
		* XML 데이터 to JSON 데이터 변환
		* @param XML 형태
		* ex) var jsonObj = Util.xml2json($.parseXML("텍스트"));
		*/
	xml2json : function(xml){
		try{
			var obj = {};
			if( xml.children.length > 0 ){
				for( var i=0;i<xml.children.length;i++ ){
					var item = xml.children.item(i);
					var nodeName = item.nodeName;

					if( typeof (obj[nodeName]) == "undefined" ){
						obj[nodeName] = this.xml2json(item);
					}else{
						if( Array.isArray(obj[nodeName]) == false ){
							var old = obj[nodeName];
							obj[nodeName] = [];
							obj[nodeName].push(old);
						}
						obj[nodeName].push(this.xml2json(item));
					}
				}
			}else{
				obj = xml.textContent;
			}
			return obj;
		}catch(e){
			//console.log(e.message);
		}
	},

	getBirthDay : function ( val ) {
		var result = "";
		var y2k    = ""

		if( !Util.isNull(val) && val.length > 7 ) {
			var jumin1 = val.substring(0, 6);
			var jumin2 = val.substring(6, 7);

			if( jumin2 <= 2 || jumin2 == 5 || jumin2 == 6 ) {
				y2k = "19";
			} else {
				y2k = "20";
			}

			result = y2k + jumin1;

			return result;
		} else {
			return val;
		}
	},

	setMaxLengthToNumbertag : function() {
		$('#containerWrap input[type=number]').each(function(idx, target) {
			var maxlength = $(target).attr('maxlength');
			if (!maxlength || maxlength < 1) {
				return ;
			}
			$(target).off('input').on('input', function() {
				var value = $(target).val();
				if (value.length > maxlength) {
					$(target).val(value.slice(0, maxlength));
				}
			})
		});
	},

	pageLeaveMsg : function(){
		var sURI = location.pathname;
        var agent = CLIENT_TYPE;
		if( /BNP_(ANDROID|IOS)/ig.test(agent) && /\/mycardif\/myage\/my\/age\//ig.test(sURI) == false ){//마이카디프 > 헬스에이지 아닌 mycardif 페이지는 아래 코드 실행!
			confirm({msg:"현재 페이지를 벗어나면 메인화면으로 돌아갑니다.\n이동하시겠습니까?",btn:["예","아니오"], callback:[function(){ location.href="/mycardif/index.do";}]})
		}else{
			history.back();
		}
	},

	moveMainPage : function(){
		var sURI = location.pathname;
		//var agent = navigator.userAgent;
        var agent = CLIENT_TYPE;
		if( /BNP_(ANDROID|IOS)/ig.test(agent)){//mycardif APP 의 경우 mycardif 메인으로 이동
			location.href = "/mycardif/index.do";
		}else{
			location.href = "/";
		}
	},

	addEventToGTM : function(){
		if ( arguments.length > 0 && typeof arguments[0] == "object" ) {
			if (window.dataLayer) {
				window.dataLayer.push( arguments[0] );
			}
		}
	},

	/**
		* 구글 태그매니저 custom 이벤트 등록(완료)
		* 김은별 과장님과 협의하여 마이카디프 > 각종 서비스 신청 완료시 본 이벤트등록 함수 실행하도록 결정
		* ※ 기본 속성은 현재 고정값이므로 수정하면 안됨....
		* ※ 추가 속성은 김은별과장님 외 GTM 관리 담당자와 협의하여 진행토록....
		* 사용법#1) Util.addEndEventToGTM(); //기본속성만 이벤트 등록
		* 사용법#2) Util.addEndEventToGTM({"key1":"value1","key2":"value2" ... }); //기본속성 + 추가 속성(key&value) 세팅
		*/
	addPageViewEventToGTM : function(){
		var p = {"event":"PageView"};//마이카디프 서비스 신청 완료시 고.정.된. 이벤트 명칭
		if ( arguments.length > 0 && typeof arguments[0] == "object" ) {
			p = Object.assign(p, arguments[0]);
		}
		Util.addEventToGTM(p);
	},

	/**
		* 구글 태그매니저 custom 이벤트 등록(완료)
		* 김은별 과장님과 협의하여 마이카디프 > 각종 서비스 신청 완료시 본 이벤트등록 함수 실행하도록 결정
		* ※ 기본 속성은 현재 고정값이므로 수정하면 안됨....
		* ※ 추가 속성은 김은별과장님 외 GTM 관리 담당자와 협의하여 진행토록....
		* 사용법#1) Util.addEndEventToGTM(); //기본속성만 이벤트 등록
		* 사용법#2) Util.addEndEventToGTM({"key1":"value1","key2":"value2" ... }); //기본속성 + 추가 속성(key&value) 세팅
		*/
	addEndEventToGTM : function(){
		var p = {"event":"Completed"};//마이카디프 서비스 신청 완료시 고.정.된. 이벤트 명칭
		if ( arguments.length > 0 && typeof arguments[0] == "object" ) {
			p = Object.assign(p, arguments[0]);
		}
		Util.addEventToGTM(p);
	},

	/**
		* 구글 태그매니저 custom 이벤트 등록(시작)
		* 사용법#1) Util.addEndEventToGTM(); //기본속성만 이벤트 등록
		* 사용법#2) Util.addEndEventToGTM({"key1":"value1","key2":"value2" ... }); //기본속성 + 추가 속성(key&value) 세팅
		*/
	addStartEventToGTM : function(){
		var p = {"event":" Start"};//마이카디프 서비스 신청 완료시 고.정.된. 이벤트 명칭
		if ( arguments.length > 0 && typeof arguments[0] == "object" ) {
			p = Object.assign(p, arguments[0]);
		}
		Util.addEventToGTM(p);
	},

	//메뉴 A태그 링크 유무
	fnIsMenuLink : function(value, type){
		var bResult = true;
		if( value == null || value == "" || value.replace(/\s/,'').length == 0 || /(null|#)/.test(value) == true || /#/g.test(value) == true ){
			bResult = false;
		}
		if( type && type == "mycardif" ){
			bResult = true;
		}
		return bResult;
	},

	//메뉴 A태그 링크 생성
	fnMakeALinkHtml : function(menu, type){
		var sHtml = aTag;
		sHtml = sHtml.replace(/{menu_name}/,menu.menu_name);//menu depth 1 메뉴명
		sHtml = sHtml.replace(/{popup_yn}/,(menu.popup_yn=='Y'?'target="_blank"':''));//menu depth 1 새창유무
		sHtml = sHtml.replace(/{menu_path}/,(Util.fnIsMenuLink(menu.menu_path, type) ? menu.menu_path:'javascript:void(0);'));//menu depth 1 메뉴링크
		return sHtml;
	},

	//메뉴 트리 생성
	fnMakeMenuTree : function(menuLists){
		var menuHtml = "";
		if( menuLists && menuLists.length > 0 ){
			var menuList = menuLists;
			if( isMobileApp == true ){//모바일앱 (피보험자 로그인의 경우 '피보험자서비스' 세팅)
				menuList = menuLists[0].menuList;
			}
			for( var nA in menuList ){//menu depth A
				menuHtml += liTag[0];//<li>
				var menu_A = menuList[nA];
				menuHtml += (empty)+spanTag[0];//<span>
				if( isMobileApp == false ){
					menuHtml += (empty+empty)+Util.fnMakeALinkHtml(menu_A);//<a href="" target=""></a>
				}else{
					menuHtml += menu_A.menu_name;
				}
				menuHtml += (empty)+spanTag[1];//</span>
				if( menu_A.menuList && menu_A.menuList.length > 0 ){
					menuHtml += (empty)+ulTag[0].replace(/depth/,'depth2');//<ul>
					for( var nB in menu_A.menuList ){//menu depth B
						menuHtml += (empty+empty)+liTag[0];//<li>
						var menu_B = menu_A.menuList[nB];
						menuHtml += (empty+empty+empty)+Util.fnMakeALinkHtml(menu_B);//<a href="" target=""></a>
						if( menu_B.menuList && menu_B.menuList.length > 0 ){
							menuHtml += (empty+empty+empty)+ulTag[0].replace(/depth/,'depth3');//<ul>
							for( var nC in menu_B.menuList ){//menu depth C
								menuHtml += (empty+empty+empty+empty)+liTag[0];//<li>
								var menu_C = menu_B.menuList[nC];
								menuHtml += (empty+empty+empty+empty+empty)+Util.fnMakeALinkHtml(menu_C);//<a href="" target=""></a>
								menuHtml += (empty+empty+empty+empty)+liTag[1];//</li>
							}
							menuHtml += (empty+empty+empty)+ulTag[1];//</ul>
						}
						menuHtml += (empty+empty)+liTag[1];//</li>
					}
					menuHtml += (empty)+ulTag[1];//</ul>
				}
				menuHtml += liTag[1];//</li>
			}
		}

		return menuHtml;
	},

	//GNB메뉴 트리 생성
	fnMakeGNBMenuTree : function(menuLists, type){
		/*var menuHtml = "";
		if( menuList && menuList.length > 0 ){
			for( var nA in menuList ){//menu depth A
				var menu_A = menuList[nA];
				if( (menu_A.menu_path != null && (menu_A.menu_path.indexOf('/mycardif') > -1 && menu_A.menu_path.indexOf('.do') == -1)) ){
					menuHtml += liTag[0].replace(/li/,'li class="mycardif"');//<li class="mycardif">
				}else{
					menuHtml += liTag[0];//<li>
				}
				menuHtml += (empty+empty)+Util.fnMakeALinkHtml(menu_A, type);//<a href="" target=""></a>
				menuHtml += liTag[1];//</li>
			}
		}

		return menuHtml;*/

        var menuHtml = "";
        if( menuLists && menuLists.length > 0 ){
            var menuList = menuLists;
            if( isMobileApp == true ){//모바일앱 (피보험자 로그인의 경우 '피보험자서비스' 세팅)
                menuList = menuLists[0].menuList;
            }
            for( var nA in menuList ){//menu depth A
                var menu_A = menuList[nA];
                if(type == "mycardif"){
                    menuHtml += liTag[0].replace(/li/,'li class="mycardif"');//<li class="mycardif">
                }else if(type == "disclosure"){
                    menuHtml += liTag[0].replace(/li/,'li class="gongsisil"');//<li class="gongsisil">
                }else{
                    menuHtml += liTag[0];//<li>
                }

                if( isMobileApp == false ){
                    menuHtml += (empty+empty)+Util.fnMakeALinkHtml(menu_A, type);//<a href="" target=""></a>
                }else{
                    menuHtml += menu_A.menu_name;
                }
                menuHtml += "<div class='sub_menu'>";
                menuHtml += "<div class='sub_menu_inner'>";

                menuHtml += (empty)+spanTag[0];//<span>
                if( isMobileApp == false ){
                    menuHtml += (empty+empty)+Util.fnMakeALinkHtml(menu_A, type);//<a href="" target=""></a>
                }else{
                    menuHtml += menu_A.menu_name;
                }
                menuHtml += (empty)+spanTag[1];//</span>
                if( menu_A.menuList && menu_A.menuList.length > 0 ){
                    menuHtml += (empty)+ulTag[0].replace(/depth/,'depth2');//<ul>
                    for( var nB in menu_A.menuList ){//menu depth B
                        menuHtml += (empty+empty)+liTag[0];//<li>
                        var menu_B = menu_A.menuList[nB];
                        menuHtml += (empty+empty+empty)+Util.fnMakeALinkHtml(menu_B, type);//<a href="" target=""></a>
                        if( menu_B.menuList && menu_B.menuList.length > 0 ){
                            menuHtml += (empty+empty+empty)+ulTag[0].replace(/depth/,'depth3');//<ul>
                            for( var nC in menu_B.menuList ){//menu depth C
                                menuHtml += (empty+empty+empty+empty)+liTag[0];//<li>
                                var menu_C = menu_B.menuList[nC];
                                menuHtml += (empty+empty+empty+empty+empty)+Util.fnMakeALinkHtml(menu_C, type);//<a href="" target=""></a>
                                menuHtml += (empty+empty+empty+empty)+liTag[1];//</li>
                            }
                            menuHtml += (empty+empty+empty)+ulTag[1];//</ul>
                        }
                        menuHtml += (empty+empty)+liTag[1];//</li>
                    }
                    menuHtml += (empty)+ulTag[1];//</ul>
                }
                menuHtml += "</div>";
                menuHtml += "</div>";
                menuHtml += liTag[1];//</li>
            }
        }

        return menuHtml;
	},

	// 전체 메뉴 클릭 이벤트 등록
	fnSetGnbAllMenuEvent : function(){
		if( /MOBILE/ig.test(window.navigator.userAgent) == false ){
			$(".depth2 li a").off();
		}
		$(".depth2 li a").click(function(e){
			var sUrl = $(this).attr("href");
			var popYn = $(this).attr("target");
			if( /void\(0\)/ig.test(sUrl) == false ){
				if( /cmsCommon/ig.test($(this).attr("href")) == false ){
					//sUrl = (sUrl.indexOf(_context) == -1 ? _context:"") + sUrl;//임시처리
				}
				//Util.movePage($(this).attr("href"));
				if( popYn && popYn == '_blank' ){
					window.open(sUrl);
				}else{
					location.href = sUrl;
				}
				e.preventDefault();
			}
		});
	},

    /**
        * 펀드 설명(수익률) 팝업
        * @param 펀드코드, 콜백함수 (함수, 선택사항)
        * ex) Util.zipcodePop(fn_callback);
        */
    fundDescPop : function(){
        var _idFundCd = arguments[0]||null + "";
        var _idFundNm = arguments[1]||null + "";
        _FundDescPop(_idFundCd, _idFundNm);
    },

};

/**
	* message properties session storage getting
	*/
var _Message = {
	/**
		* Message Properteis getter
		* 세션스토리지 저장된 메시지 프로퍼티(서버의 message-b2c-co.properties) 획득
		* @param string 메시지 프로퍼티 key
		* @param array 메시지의 치환 대상 키워드
		* ex) _Message.get("error.0004",["보험계약조회"]);  //error.0004=전문통신중({0}) 오류가 발생하였습니다.
		*/
	get : function(){
		var msg = "";
		var args = arguments;
		if( sessionStorage.getItem('messageProperties') ){
			if ( args.length > 0 ) {
				var msg = JSON.parse(sessionStorage.getItem('messageProperties'))[args[0]];
				if( /{.\d*}/g.test(msg) == true ){
					_.each(args[1],function(s,i){
						msg = msg.split('{' + i + '}').join(Util.isNull(s) ? '' : s);
					});
				}
			}
		}
		return msg;
	}
};

/**
	* loading layer popup
	*/
var _LoadingPop = {
		/**
			* _LoadingPop show
			*/
		show: function() {
			if( !_loadingHtml ){
				/*
				$("div#popupDiv").load("/common/popup/loading.do", function(result){
				_loadingHtml = result;
				});
				*/
				Util.getLoadingHtml(this.show);
			}else{

				//공유하기 팝업 html 삽입될 div 생성
				$("body").append( $("<div/>", {id:"loadingDiv"}) );

				//공유하기 팝업 html 삽입
				$("#loadingDiv").append(_loadingHtml);

			}

			//setTimeout(300);//0.3초 늦춤
		},
		/**
			* _LoadingPop hide
			*/
		hide: function() {
			$("div#loadingDiv").remove();
			//_Layer.setScrollTop();
		}
};

/**
	* layer popup (custom)
	* @param 레이어 팝업 id
	* @param callback
	* ex) _Layer.show("#layer_agree");
	* ex) _Layer.show("#layer_agree", callback);

* ex) _Layer.hide("#layer_agree");
* ex) _Layer.hide("#layer_agree", callback);
*/
var _Layer = {
	show : function(id, target, callback) { //[접근성개선] :target 추가

		//################ dim
		//################ dim
		//################ dim
		var maskClassNm = "";
		var zIndex = "";
		var popId = ".layerwrap";
		if( id ){
			popId = id;
		}

		if( id != "#layer_alert" && id != "#layer_confirm" ){
			//body 스크롤 lock & 스크롤 위치 정보 취득~
			_Layer.getScrollTop();
			maskClassNm = "normal";
			zIndex = "99970";
		}else{
			maskClassNm = "message";
			zIndex = "99990";
		}

		//$('body').append('<div id="layermask" class="'+maskClassNm+'"></div>');
		$('body').append('<div id="layermask" data-popid="'+id.replace('#','')+'" class="'+maskClassNm+'"></div>');

		var maskHeight = $(document).height();
		var maskWidth = $(window).width();

		$('div#layermask.'+maskClassNm+'').css({
			'width' : maskWidth,
			'height' : maskHeight,
			'z-index' : zIndex,
		});
		$('div#layermask.'+maskClassNm+'').show();

		//2021-11-02 팝업의 마지막 확인
		$('#pop_allmenu').find('a').last().parent().addClass('popEnd');
		// 2021-11-01 팝업focus작업중
	//$('.layerwrap,.fullLayerWrap').attr('tabIndex','0').focus();
		//$('.layerwrap .popTitle').attr('tabIndex','1').focus();

		//################ popup
		//################ popup
		//################ popup
		var winH = $(window).height();
		var winW = $(window).width();

		if (winH > $(id).height()) {
			$(id).css('top', window.pageYOffset + (winH / 2 - $(id).height() / 2));
		}else if(winH < $(id).height()){
			$(id).css('top','25px');
			$('body').animate({scrollTop:0}, '500');
		}

		var obj = {'left':(winW / 2 - $(id).width() / 2)};
		if( id != "#layer_alert" && id != "#layer_confirm" ){
			obj['z-index'] = '99971';
		}else{
			obj['z-index'] = '99991';
		}
		$(id).css(obj);
		$(id).show();

		_tabMove(id,false); //[접근성_20211121] tab이동 개별정의

		/* pop-up min-height*/
		$('.pop-inner').each(function(){
			if($(this).find('.pop-contents').outerHeight() <= 120){
				$(this).find('.pop-contents').css({'padding':'41px 16px'})
			}
		});
		/* //pop-up min-height*/

		//레이어 팝업 닫기 이벤트 등록(퍼블 코드 이관 후 적용)
		$(popId+' .close').off("click").on("click", function() {
			_Layer.hide(id,target); //[접근성개선] :target 추가
			_Layer.setScrollTop();
		});

		if( callback ) callback();
	},
	hide : function(id, target, callback){ //[접근성개선] :target 추가

		var maskClassNm = "";
		if( id != "#layer_alert" && id != "#layer_confirm" ){
			maskClassNm = "normal";
		}else{
			maskClassNm = "message";
		}

		//$('div#layermask.'+maskClassNm+'').hide().remove();
	$("div[data-popid='"+id.replace('#','')+"']").hide().remove();
	if( id == "#pop_allmenu" ){
			$('div#layermask').hide().remove();
		}

		if( id ){
			$(id).hide();
		}else{
			$('.layerwrap').hide();
		}

		$(target).focus().removeAttr('data-ui-num'); //[접근성_20211121] removeAttr('data-ui-num') 추가

		if( id != "#layer_alert" && id != "#layer_confirm" ){
			_Layer.setScrollTop();
		}

		if( callback ) callback();
	},

	//스크롤 위치 정보 취득 및 body scroll lock
	getScrollTop : function(){
		if( window.innerHeight < $("body").height() ){
			$('body').addClass('scrolloff');
			uiStyle.getScrollTop();
		}
	},

	//스크롤 위치 정보 반환 및 body scroll unlock
	setScrollTop : function(){
		if( $('body').hasClass('scrolloff') == true ){
			$('body').removeClass('scrolloff');
			uiStyle.setScrollTop();
		}
	}
};

//[접근성_20211121] : tab이동 개별정의
var _tabMove = function(id,reset){
	var popObjTabbable = $(id).find('button:visible, input:not([type="hidden"]):visible, select:visible, textarea:visible, [href]:visible, [tabindex]:not([tabindex="-1"]):visible'); //[접근성] 탭이동가능한 엘리먼트 지정
	var popObjTabbableNum = popObjTabbable.length
	var popObjTabbableFrist = popObjTabbable && popObjTabbable.eq(0); //[접근성] 첫번째 객체
	var popObjTabbableLast = popObjTabbable && popObjTabbable.eq(popObjTabbableNum-1); //[접근성] 마지막 객체

	if(!reset){
		popObjTabbableNum ? popObjTabbableFrist.focus() : $(id).attr('tabIndex','0').focus().on("keydown",function(event){
			event.preventDefault();
			$(id).attr('tabIndex','-1')
		});
	}

	popObjTabbableFrist.on("keydown",function(event){
		if(event.shiftKey && (event.keyCode || event.which) == 9) {
			popObjTabbableLast.focus();
			return false;
		}
	});

	popObjTabbableLast.on("keydown",function(event){
		if(!event.shiftKey && (event.keyCode || event.which) == 9) {
			popObjTabbableFrist.focus();
			return false;
		}
	});

}
/**
	* message layer popup (alert)
	* @param 메시지 텍스트 (필수)
	* @param 버튼 텍스트 (선택, 문자열)
	* @param 콜백함수 (선택, 함수)
	* 파라미터는 object 또는 순차적 나열(생략시 하위 순번이 상위 순번)
	* 버튼텍스트 생략시 : '확인'
	* 콜백함수 생략시 : return false
	* ex) _Alert("메시지<br>11111111입니다.", "OK버튼", function(){alert("111");});
	* ex) _Alert("메시지<br>11111111입니다.", bbb);
	* ex) _Alert( {msg:"내용입니다!!!",btn:"YES버튼", callback:bbb} );
	*    (파라미터 사용법은 해당 util 사용법과 동일)
*/
var _Alert = function(){
	//Alert Message Popup html 획득
	if( !_alertHtml ){
		//Util.getAlertHtml(this._Alert);
		//return;
		window.alert = _orgAlert;
	}

	var p = Util.getMsgArgsParams(arguments);

	//body 스크롤 lock & 스크롤 위치 정보 취득~
	_Layer.getScrollTop();

	$("div#popupMsgDiv").html( _alertHtml.replace(/{message}/g, p.msg).replace(/{btnTxt}/g, p.btn[0]) );

    // [2021/12/08 박현진] alert 팝업 강제 포커스 주석 처리
	//_Layer.show("#layer_alert", function(){ $("div#popupMsgDiv #layer_alert .pop-inner .btnWrap a").focus(); });
	_Layer.show("#layer_alert");

	$("div#popupMsgDiv #layer_alert .pop-inner .btnWrap a").one("click",function(){
		var _num = $('[data-ui-num]').length; //[접근성_20211121]
		var _target = $('[data-ui-num').eq(_num); //[접근성_20211121]
		//$("#layermask").remove(); //임시처리~~
		_Layer.setScrollTop();
		if( p.callback && p.callback[0] ){//확인
			p.callback[0]();
			_Layer.hide("#layer_alert"); //[접근성_20211121]
		}else{
			_Layer.hide("#layer_alert",_target.prevObject[0]); //[접근성_20211121]
		}
	});
};

/**
	* message layer popup (confirm)
	* @param 메시지 텍스트 (필수)
	* @param 버튼 텍스트 (선택, 배열)
	* @param 콜백함수 (선택, 배열 또는 함수)
	* @param 콜백함수 (선택, 함수)
	* 파라미터는 object 또는 순차적 나열(생략시 하위 순번이 상위 순번)
	* yes버튼텍스트 생략시 : '확인'
	* no버튼텍스트 생략시 : '취소'
	* yes콜백함수 생략시 : return false
	* no콜백함수 생략시 : return false
	* ex) _Confirm("메시지<br>11111111입니다.", bbb1);
	* ex) _Confirm("메시지<br>11111111입니다.","YES버튼", bbb1);
	* ex) _Confirm("메시지<br>11111111입니다.","YES버튼","NO버튼", bbb1);
	* ex) _Confirm("메시지<br>11111111입니다.",["YES버튼","NO버튼"], [bbb1]);
	* ex) _Confirm({msg:"내용입니다!!!",btn:"YES버튼", callback:bbb});
	* ex) _Confirm({msg:"내용입니다!!!",btn:["YES버튼"], callback:[bbb,ccc]});
	*    (파라미터 사용법은 해당 util 사용법과 동일)
	*/
var _Confirm = function(){
	//confirm Message Popup html 획득
	if( !_confirmHtml ){
		//Util.getConfirmHtml(this._Confirm);
		//return;
		window.confirm = _orgConfirm;
	}

	var p = Util.getMsgArgsParams(arguments);

	//body 스크롤 lock & 스크롤 위치 정보 취득~
	_Layer.getScrollTop();

	$("div#popupMsgDiv").html( _confirmHtml.replace(/{message}/g, p.msg).replace(/{btnTxtYes}/g, p.btn[0]).replace(/{btnTxtNo}/g, p.btn[1]) );

//	_Layer.show("#layer_confirm", function(){ $("div#popupMsgDiv #layer_confirm .pop-inner .btnWrap a.bgGreen").focus(); });
	_Layer.show("#layer_confirm");

	$("div#popupMsgDiv #layer_confirm .pop-inner .btnWrap a").one("click",function(){
		var btnCloseYn = this.className.search("close");

		var _num = $('[data-ui-num]').length; //[접근성_20211121]
		var _target = $('[data-ui-num').eq(_num); //[접근성_20211121]

		//$("#layermask").remove(); //임시처리~~
		_Layer.setScrollTop();
		if( p.callback ){
			if( btnCloseYn == -1){
				_Layer.hide("#layer_confirm"); //[접근성_20211121]
				if( p.callback[0] ){//확인
					p.callback[0]();
				}
			}else{
				var nextTarget = undefined;
				if (!(nextTarget = window.$util.restoreElement()) && _target.prevObject) {
					nextTarget = _target.prevObject[0];
				}
				_Layer.hide("#layer_confirm", nextTarget); //[접근성_20211121]
				if( p.callback[1] ){//취소
					p.callback[1]();
				}
			}
		}else{
			_Layer.hide("#layer_confirm", _target.prevObject[0]); //[접근성_20211121]
		}
	});
};

/**
	* 본인 인증 팝업(서버session scard_status '20' 확인)
	* @param 콜백함수 (함수, 선택사항)
	* ex) _AuthPop.all(fn_callback);
	*/
var _ZipcodePop = function() {
	_zipcodePopupCallback = null;//본인인증 layer popop 콜백 함수 초기화
	_loadingShow = false;//ajax loading layer popup 노출시키지 않고 처리~
	_LoadingPop.show();
	var handle = setTimeout(function() { _LoadingPop.hide(); }, 10000)

	var args_00 = arguments[0]||null;
	if( typeof args_00 == "function" ){
		_zipcodePopupCallback = args_00;
	}

	if( $("#popupDivZipcode").length > 0 ){
		$("#popupDivZipcode").remove();
	}

	var event = window.event;
	var nextTarget = undefined;
	if (!(nextTarget = window.$util.restoreElement()) && event) {
		nextTarget = event.target;
	}

	$.ajax({
		type : "GET",
		data : "",
		url : "/common/popup/zipcode.do",
		success:function(res){
			try{
				//우편번호 레이어 팝업 html 삽입될 div 생성
				$("body").append( $("<div/>", {id:"popupDivZipcode"}) );

				//우편번호 레이어 팝업 html 삽입
				$("#popupDivZipcode").append(res);

				//우편번호 레이어 팝업 노출
				// //우편번호 레이어 팝업 닫기 시 삽입된 div 제거
				// $("#layer_address .layerInnerB a.popClose").attr("href","javascript:;").on("click", function(e){
				// 	e.preventDefault();
				// 	//_Layer.hide("#layer_address");
				// 	$("#popupDivZipcode").remove();
				// 	if( _zipcodePopupCallback ) { _zipcodePopupCallback(); } //초기화는 공통함수에서 처리
				// });

				window.$util.checkAndLaunch(function(ctx) {
					return ((ctx.control = window._ZipcodeControl))
				}, function(ctx) {
					ctx.control.nextTarget = nextTarget;
					_Layer.show("#layer_address");
					if (handle) { clearTimeout(handle); }
					_LoadingPop.hide();
				})
			}catch(e){
				alert( _Message.get("b2b.co.0002") );
			}finally{
				_loadingShow = true;
			}
		}
	});
};

/**
	* 본인 인증 팝업(서버session scard_status '20' 확인)
	* @param 펀드코드, 콜백함수 (함수, 선택사항)
	* ex) _AuthPop.all(fn_callback);
	*/
var _FundRatioPop = function() {
	_fundCode = ""; //펀드코드 초기화
	_loadingShow = false;//ajax loading layer popup 노출시키지 않고 처리~

	var args_00= arguments[0]||null;
	if( typeof args_00 == "string" && args_00.length > 0){
		_fundCode = args_00;
	} else {
		alert("펀드코드가 없습니다.");
		return;
	}

	if( $("#popupDivFundRatio").length > 0 ){
		$("#popupDivFundRatio").remove();
	}

	$.ajax({
		type : "GET",
		data : {"id_fund_cd":_fundCode,
				"order":"Y"},
		url : '/common/popup/fundRatio.do',
		success:function(res){
			try{
				//우편번호 레이어 팝업 html 삽입될 div 생성
				$("body").append( $("<div/>", {id:"popupDivFundRatio"}) );

				//우편번호 레이어 팝업 html 삽입
				$("#popupDivFundRatio").append(res);

				//우편번호 레이어 팝업 노출
				_Layer.show("#layer_fund");

				//우편번호 레이어 팝업 닫기 시 삽입된 div 제거
				$("#layer_fund .layerInnerB a.popClose").attr("href","javascript:;").on("click", function(e){
					e.preventDefault();
					//_Layer.hide("#layer_address");
					$("#popupDivFundRatio").remove();
				});
			}catch(e){
				alert( _Message.get("b2b.co.0002") );
			}finally{
				_loadingShow = true;
			}
		}
	});
};

/**
	* 본인 인증 팝업(서버session scard_status '20' 확인)
	* @param 콜백함수 (함수, 선택사항)
	* ex) _AuthPop.all(fn_callback);
	*/
var _AuthPop = {
	all : function(){
		_authPopupCallback = null;//본인인증 layer popop 콜백 함수 초기화
		_loadingShow = false;//ajax loading layer popup 노출시키지 않고 처리~

		var args_00 = arguments[0]||null;
		var args_01 = arguments[1]||null;

		if( typeof args_00 == "function" ){
			_authPopupCallback = args_00;
		}

		var regExp = /card|hp/ig;
		var _url = location.origin + "/common/popup/idntyVerify.do";
		_url = "/mycardif/my/cdf/mycdf301.do";
		// if( typeof args_01 == "string" && args_01 && regExp.test(args_01) ){
		//     _url = _url.replace(/\.do/,args_01+".do");
		// }

		if( $("#popupDivCert").length > 0 ){
			$("#popupDivCert").remove();
		}

		_LoadingPop.show();
		var handle = setTimeout(function() { _LoadingPop.hide(); }, 10000)
		var event = window.event;
		var nextTarget = undefined;
		if (!(nextTarget = window.$util.restoreElement()) && event) {
			nextTarget = event.target;
		}
		$.ajax({
			type : "GET",
			data : "",
			url : _url,
			success:function(res){
				try{
					//인증 레이어 팝업 html 삽입될 div 생성
					$("body").append( $("<div/>", {id:"popupDivCert"}) );

					//인증 레이어 팝업 html 삽입
					$("#popupDivCert").append(res);

					if (handle) { clearTimeout(handle); }
					_LoadingPop.hide();

					//인증 레이어 팝업 노출
					//_Layer.show("#layer_certif");r

					//인증 레이어 팝업 닫기 시 삽입된 div 제거
					/*
					$("#layer_certif .layerInnerB").find(".btnWrap a.btn, a.popClose").attr("href","javascript:;").on("click", function(e){
						e.preventDefault();
						//_Layer.hide("#layer_certif");
						$("#popupDivCert").remove();
						//if( _authPopupCallback ) { _authPopupCallback(); } //초기화는 공통함수에서 처리
					});
					*/
					window.$util.checkAndLaunch(function(ctx) {
						return ((ctx.control = window.MYCDF301Control));
					}, function(ctx) {
						ctx.control.nextTarget = nextTarget;
					})
				}catch(e){
					alert( _Message.get("b2b.co.0002") );
				}finally{
					_loadingShow = true;
				}
			}
		});
	},
	/**
		* 본인 인증 팝업(보안카드)
		* @param 콜백함수 (함수, 선택사항)
		* ex) _AuthPop.Card(fn_callback);
		*/
	Card : function(){
		_AuthPop.all(arguments[0], "Card");
	},
	/**
		* 본인 인증 팝업(휴대폰인증)
		* @param 콜백함수 (함수, 선택사항)
		* ex) _AuthPop.Hp(fn_callback);
		*/
	Hp : function(){
		_AuthPop.all(arguments[0], "Hp");
	}
};

/**
	* 공유하기 팝업
	* ex) _SharePop();
	*/
var sharePop_id = "layer_share";
var _SharePop = {
	init : function(event){
		if( $("#"+sharePop_id).length == 0 ){
			_SharePop.load();
		}else{
			_SharePop.show();
		}
	},
	load : function(){
		_loadingShow = false;//ajax loading layer popup 노출시키지 않고 처리~
		$.ajax({
			type : "POST",
			data : "",
			url : "/common/popup/sharePop.do",
			success:function(res){
				try{
					var sharePopDiv = sharePop_id+"Div";

					//공유하기 팝업 html 삽입될 div 생성
					$("body").append( $("<div/>", {id:sharePopDiv}) );

					//공유하기 팝업 html 삽입
					$("#"+sharePopDiv).append(res);

					//공유하기 레이어 팝업 노출
					_SharePop.show();

				}catch(e){
					alert( _Message.get("b2b.co.0002") );
				}finally{
					_loadingShow = true;
				}
			}
		});
	},
	show : function(){
		if( $("#"+sharePop_id).length > 0 ){
			//공유하기 레이어 팝업 노출
			_Layer.show("#"+sharePop_id);

			fnSnsShareFunctions();

			//공유하기 레이어 팝업 닫기 시 삽입된 div 제거
			$("#"+sharePop_id+" .layerInner a.popClose").attr("href","javascript:;").on("click", function(e){
				_SharePop.hide();
				$('.share > a').focus().removeAttr('data-ui-num'); //[접근성_20211121]
			});
		}
	},
	hide : function(){
		_Layer.hide("#"+sharePop_id, $('.share > a')); //[접근성_20211121]
	},

}

/**
	* ServerUtil
	* 서버와의 통신 및 관련 Util
	*/
var ServerUtil = {
	/**,
		* E2E 암호화 처리를 한다.
		* @param formObj
		*/
	encrypE2EField: function(formObj) {
		var tmp = "_raonEncData";

		$("input[data-enc=on]").each(function() {
			e2eEle = findElementByName(formObj, this.name+tmp);
			if (e2eEle == null) {
				var newEle = document.createElement("input");
				newEle.type = "hidden";
				newEle.name = this.name+tmp;
				newEle.id = this.name+tmp;
				newEle.value = $("input[name=E2E_"+this.name+"]").val();
				formObj.appendChild(newEle);
			} else {
				e2eEle.value = $("input[name=E2E_"+this.name+"]").val();
			}
		});

		formObj.submit();
	},
	/**
		* E2E 암호화 처리를 한다.
		* @param formObj
		*/
	ajaxE2EField: function(formObj) {
		var tmp = "_raonEncData";

		$("input[data-enc=on]").each(function() {
			e2eEle = findElementByName(formObj, this.name+tmp);
			if (e2eEle == null) {
				var newEle = document.createElement("input");
				newEle.type = "hidden";
				newEle.name = this.name+tmp;
				newEle.id = this.name+tmp;
				newEle.value = $("input[name=E2E_"+this.name+"]").val();
				formObj.appendChild(newEle);
			} else {
				e2eEle.value = $("input[name=E2E_"+this.name+"]").val();
			}
		});
	}
}

var fnQueryStringMessage = function(data){
	var strParam = '';
	var params = JSON.parse(data);
	var keys = Object.keys(params);
	for(var i=0; i < keys.length; i++){
		var key = keys[i];
		if(key == 'messageid'){
			strParam += "?" + key + "=" + params[key];
		}
//        if(i==0){
//            strParam += "?" + key + "=" + params[key];
//        }else{
//            strParam += "&" + key + "=" + params[key];
//        }
	}
	return strParam;
}

var fnGetQueryStringInput = function(){
	var params = {};
	window.document.location.search.replace(
		/[?&]+([^=&]+)=([^&]*)/gi,
			function(str, key, value){ params[key] = value;}
	);
	return params;
}

var fnGetContextPath = function(){
    var hostIndex = location.href.indexOf(location.host) + location.host.length;
    return location.href.substring(hostIndex, location.href.indexOf('/', hostIndex+1));
}

/**
* 펀드설명 팝업
* @param 펀드코드, 콜백함수 (함수, 선택사항)
* ex) _AuthPop.all(fn_callback);
*/
var _FundDescPop = function() {
    _fundCode = ""; //펀드코드 초기화
    _fundName = ""; //펀드명 초기화
    _loadingShow = false;//ajax loading layer popup 노출시키지 않고 처리~

    var args_00= arguments[0]||null;
    var args_01= arguments[1]||null;
    if( typeof args_00 == "string" && args_00.length > 0){
        _fundCode = args_00;
    } else {
        alert("펀드코드가 없습니다.");
        return;
    }

    if( typeof args_01 == "string" && args_01.length > 0){
        _fundName = args_01;
    }

    if( $("#popupDivFundDesc").length > 0 ){
        $("#popupDivFundDesc").remove();
    }

    $.ajax({
        type : "GET",
        data : {"id_fund_cd":_fundCode,"id_fund_nm":_fundName},
        url : '/common/popup/fundDesc.do',
        success:function(res){
            try{

                $("body").append( $("<div/>", {id:"popupDivFundDesc"}) );

                //우편번호 레이어 팝업 html 삽입
                $("#popupDivFundDesc").append(res);

                //우편번호 레이어 팝업 노출
                _Layer.show("#layer_fund");

                //우편번호 레이어 팝업 닫기 시 삽입된 div 제거
                $("#layer_fund .layerInnerB a.popClose").attr("href","javascript:;").on("click", function(e){
                    e.preventDefault();
                    //_Layer.hide("#layer_address");
                    $("#popupDivFundDesc").remove();
                });
            }catch(e){
                alert( _Message.get("b2b.co.0002") );
            }finally{
                _loadingShow = true;
            }
        }
    });
};
