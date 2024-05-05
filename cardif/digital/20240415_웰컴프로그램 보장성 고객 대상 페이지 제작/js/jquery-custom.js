/**
 * javascript system message alert overried
 */
var _orgAlert = window.alert;
window.alert = function(){
    if( arguments.length > 0 ){
        var p = Util.getMsgArgsParams(arguments);
        if( !p && typeof arguments[0] == "object" ){
            p = {"msg": JSON.stringify(arguments[0])};
        }
        _Alert(p);
    }
};

/**
 * javascript system message confirm overried
 */
var _orgConfirm = window.confirm;
window.confirm = function(){
    if( arguments.length > 0 ){
        var p = Util.getMsgArgsParams(arguments);
        _Confirm(p);
    }else{
        _Confirm("");
    }
};

jQuery.browser = {};
(function() {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();

/**
 * jQuery UI IE9 이상 version 에서 mouse move를 위해
 */
 /*
(function($) {
    var a = $.ui.mouse.prototype._mouseMove;
    $.ui.mouse.prototype._mouseMove = function(b) {
        if ($.browser.msie && document.documentMode >= 9) {
            b.button = 1;
        };
        a.apply(this, [b]);
    };
}(jQuery));
*/

$.fn.serializeObject = function() {
    "use strict"
    var result = {}
    var extend = function(i, element) {
        var node = result[element.name]
        if ("undefined" !== typeof node && node !== null) {
            if ($.isArray(node)) {
                  node.push(element.value)
            } else {
                  result[element.name] = [node, element.value]
            }
        } else {
               result[element.name] = element.value
        }
    }
    $.each(this.serializeArray(), extend);
    return result;
}

$.fn.serializeString = function() {
    var data = "";
    var formData = this.serializeObject();
    for( var n in Object.keys(formData) ){
        var key = Object.keys(formData)[n];
        var value = formData[key];
        if( Array.isArray(value) == true ){
            value = value.filter(function(s){
                return s.length > 0;
            });
            if( value.length == 0 ){
                value = "";
            }
        }

        if( value != "" ){
            if( data != "" ){
                data += "&";
            }
            data += key+"="+value;
        }
    }
    return data;
};

/**
 * 게시판 페이징 처리
 * [0] : totalCount 전체 게시물 갯수(필수)
 * [1] : pageIndex  현재 페이지 번호(선택, 기본값 : 1)
 * [2] : pageSize   페이지 게시물 갯수(선택, 기본값 : 10)
 * [3] : pageUnit   페이징 블럭당 페이지 번호 갯수(선택, 기본값 : 10)
 * [4] : callback   페이지 번호 클릭시 호출되는 함수(필수)
 * 예1) $("div.paginate").pagination(99999, callback);
 * 예2) $("div.paginate").pagination(99999, 1, callback);
 * 예3) $("div.paginate").pagination(99999, 1, 10, callback);
 * 예4) $("div.paginate").pagination(99999, 1, 10, 10, callback);
 */
$.fn.pagination = function() {
    var map = {
        "t":null, //totalCount
        "p":null, //pageIndex
        "s":null, //pageSize
        "u":null, //pageUnit
        "c":null  //callback
    };
    var args = [];
    for( var n in arguments ){
        args.push(arguments[n]);
    }

    for( var n in args ){
        if( args[n] ){
            if( n == 0 && ( (typeof args[n] == "number" && parseInt(args[n]) > 0) || (typeof args[n] == "string" && args[n].length > 0)) ){
                if( new String(args[n]) ){
                    map['t'] = args[n];//totalCnt
                }
            }
            if( n == 1 ){
                if( (typeof args[n] == "number" && parseInt(args[n]) > 0) || (typeof args[n] == "string" && args[n].length > 0) ){
                    map['p'] = args[n];//pageIndex
                }else if( typeof args[n] == "function" ){
                    map['c'] = args[n];//callback
                }
            }
            if( n == 2 ){
                if( (typeof args[n] == "number" && parseInt(args[n]) > 0) || (typeof args[n] == "string" && args[n].length > 0) ){
                    map['s'] = args[n];//pageSize
                }else if( typeof args[n] == "function" ){
                    map['c'] = args[n];//callback
                }
            }
            if( n == 3 ){
                if( (typeof args[n] == "number" && parseInt(args[n]) > 0) || (typeof args[n] == "string" && args[n].length > 0) ){
                    map['u'] = args[n];//pageUnit
                }else if( typeof args[n] == "function" ){
                    map['c'] = args[n];//callback
                }
            }
            if( n == 4 ){
                if( typeof args[n] == "function" ){
                    map['c'] = args[n];//callback
                }
            }
        }
    }

    //totalCount 필수!!
    if( !map['t'] ){
        //alert("[pagination] totalCount is empty");
        alert("[페이징]페이지 카운드가 없습니다.")
        return;
    }

    //callback 필수!!
    if( !map['c'] ){
        //alert("[pagination] callback is empty");
        alert("[페이징]callback이 없습니다.")
        return;
    }

    //Util.setPagination(obj, totalCnt, pageIndex, pageSize, pageUnit, callback);
    Util.setPagination(this, map);
};

/**
 * 구글 차트 draw
 * [0] : params {xx:'',yy:'',data:[],tooltip:false} ==> xx:x축 데이터 컬럼명+제목, yy:y축 데이터 컬럼명+제목, data:배열형태 데이터, tooltip:툴팁노출 유무(true/false)
 * [1] : type  차트 유형(형태, Line, Bar, Column, Pie, Area ... , 필수아님)
 * 예1) $("div.chart_div").drawChart(params);
 * 예2) $("div.chart_div").drawChart({data:[],xx:{title:'',col:''},yy:{title:'',cols:''}});
 * 예3) $("div.chart_div").drawChart({data:[],xx:{title:'',col:''},yy:{title:'',cols:''}}, 'Line');
 */
$.fn.drawChart = function(){
    if( this.length != 1 ){
        //alert("차트 생성 Element가 없거나 여러개 입니다.");
        //alert( _Message.get("error.chart.no.element") );
        //return;
    }
    Util.fnDrawGoogleChart( {ID:this[0].id,ClassName:this[0].className}, arguments[0], (arguments[1]||"Line") );
};

$(document).ajaxStart(function(ev, xhr, settings) {
        //로딩 이미지 보임 처리
        if( _loadingShow ){
            _LoadingPop.show();
        }
});

$(document).ajaxStop(function() {
    //로딩 이미지 숨김 처리(로딩 팝업 제외)
    _LoadingPop.hide();

    //로딩 숨김으로 ajax 처리 완료시 자동 숨김 취소 설정
    if( _loadingShow == false ){
        _loadingShow = true;
    }
});

$(document).ajaxSuccess(function(ev, xhr, settings, data) {
});

$(document).ajaxComplete(function(ev, xhr, settings) {

    if( xhr && xhr.responseText && xhr.responseText.length > 0 && xhr.responseText.indexOf("common.js") > -1 ){
        $('.gnb-toggle').off();//상단 전체 메뉴 버튼 이벤트 제거
        if( /\/|\/index.do/.test(location.pathname) ){
            $('.page-btn').off();//메인>하단 좌우 슬라이더 배너 이전,다음 버튼 이벤트 제거
        }
    }

    if( settings.url.indexOf("https://127.0.0.1:10757/ntum/reqeust") == -1 ){
        if( xhr.status === 200 && (xhr.statusText == "OK" || xhr.statusText == "load") && xhr.responseJSON === undefined ){
        }else if( xhr.status === 0 ){
            //console.log( "Connection Refused" );
            //alert( "Connection Refused" );
            //console.log( _Message.get("error.http.code.000") );
            alert( _Message.get("error.http.code.000") );
        }else if( xhr.status >= 400 && xhr.status <= 499 ){//400 ~ 415
            if( xhr.status == 404 ){
                //console.log( "File Not Found(404)" );
                //alert( "File Not Found(404)" );
                if( /\/cmsHtml\//ig.test(settings.url) == false) {  //cms페이지는 404메시지 안나오게 처리~
                    //console.log( _Message.get("error.http.code.404") );
                    alert( _Message.get("error.http.code.404") );
                }
            }else if( xhr.status == 403 ) {
                //console.log( _Message.get("error.http.code.999") );
                alert( _Message.get("error.http.code.999") );
            }else{
                //console.log( xhr.statusText+"("+xhr.status+")" );
                //alert( xhr.statusText+"("+xhr.status+")" );
                //console.log( _Message.get("error.http.code.404") );
                alert( _Message.get("error.http.code.404") );
            }
        }else if( xhr.status >= 500 && xhr.status <= 599 ){ //500 ~ 505
            if( xhr.status == 500 ){
                //console.log( "Intenal Server Error(500)" );
                //alert( "Intenal Server Error(500)" );
                //console.log( _Message.get("error.http.code.500") );
                alert( _Message.get("error.http.code.500") );
            }else{
                //console.log( xhr.statusText+"("+xhr.status+")" );
                //alert( xhr.statusText+"("+xhr.status+")" );
                //console.log( _Message.get("error.http.code.500") );
                alert( _Message.get("error.http.code.500") );
            }
        }else if( xhr.status == 999 ){ //999
                //console.log( _Message.get("error.http.code.999") );
                alert( _Message.get("error.http.code.999") );
        }else{
            if( xhr.statusText != "OK" && xhr.statusText != "success" ){
                var msg = _Message.get("error.0005",["http "+xhr.status+""]);
                if( xhr.responseText && xhr.responseText.length > 0 ){
                    msg += "<br/>"+xhr.responseText;
                }
                //console.log( msg );
                alert( msg );
            }
        }
    }
});

$(document).ajaxError(function(ev, xhr, settings, err) {
        if( xhr.status == -1 || xhr.status == 0  ){
            //console.log( _Message.get("error.session.expired") );
            alert( _Message.get("error.session.expired") );
        }else{
            //console.log( _Message.get("b2c.co.0002") );
        }

        _LoadingPop.hide();
});

$(document).ajaxSend(function(ev, xhr, settings) {
    if( /^http/g.test(settings.url) == false ){
        if( /^\//g.test(settings.url) == false ){
            settings.url = "/"+settings.url;
        }
        if( settings.url.indexOf(_context) == -1 ){
            settings.url = _context+settings.url;
        }
    }

    //var errStack = new Error().stack.split("\n");
    var regExp = /at.*(j|k)/g;
    var errStack = new Error().stack;
    var _moveSendData = JSON.parse(sessionStorage.getItem('_moveSendData'));

    //movePage 이후 document.ready 함수 호출시 movePage 넘겨준 파라미터 초기화
    if( regExp.test(errStack) == true && settings.type == "POST" && (_moveSendData && _.has(_moveSendData,"data") && _.isEmpty(JSON.parse(_moveSendData.data)) == false) ){
        settings.data = _moveSendData['data'];
        //sessionStorage.setItem("_moveSendData", "{}");
    }
    sessionStorage.setItem("_moveSendData", "{}");
});