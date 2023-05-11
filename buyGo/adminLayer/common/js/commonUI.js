// --------------------------- start of source ------------------------
function getDateTime(format, interval)
{
    interval=interval*1;    //숫자형으로 변환
    //format: 일시 표시 서식
    //interval: 현재 시각에서 몇초를 더하거나 뺼 것인지?
    var myDate=new Date();

    //먼저 계산할 초를 set하고나면 myDate Object가 변경되고나서, 나머지 변경된 년,월,일,시,분을 구해야 순서에 맞는다.
    myDate.setSeconds(myDate.getSeconds()+interval);   // interval 만큼 더하고 뺀다.
    var second = myDate.getSeconds();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var hour = myDate.getHours();
    var minute = myDate.getMinutes();
    var milliseconds = myDate.getMilliseconds();

    month = month >= 10 ? month : "0" + month;
    day = day >= 10 ? day : "0" + day;
    hour = hour >= 10 ? hour : "0" + hour;
    minute = minute >= 10 ? minute : "0" + minute;
    second = second >= 10 ? second : "0" + second;
    milliseconds = milliseconds >= 10 ? milliseconds : "0" + milliseconds;

    if(format=="YYYYMMDDHHMMSSnnn")
    {
        //밀리초 까지 붙일 경우
        return ((myDate.getFullYear()+"") + (month+"") + (day+"") + (hour+"") + (minute+"") + (second+"") + (milliseconds+"")); //숫자끼리 더해지지 않도록 문자형으로 변환
    }
    else if(format=="YYYY-MM-DD HH:MM:SS")
    {
        return (myDate.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second);
    }
    else if(format=="YYYYMMDDHHMMSS")
    {
        return ((myDate.getFullYear()+"") + (month+"") + (day+"") + (hour+"") + (minute+"") + (second+"")); //숫자끼리 더해지지 않도록 문자형으로 변환
    }
    else
    {
        //서식이 없거나 Error이면 빈문자를 return
        console.log("getDateTime error! retuern empty, params: format=", format, "/ interval=", interval);
        return "";
    };
};

function getNaviInfo()
{
    var info={};
    info.browserName=navigator.appName;
    info.appCodeName=navigator.appCodeName;
    info.platformName=navigator.platform;
    info.userAgent=navigator.userAgent;
    info.browserVersion=navigator.appVersion;
    info.loginPage="login.html";
    var user=navigator.userAgent;
    var is_mobile="false";
    if(user.indexOf("iPhone")>-1||user.indexOf("Android")>-1 ){is_mobile="true";};
    info.isMobile=is_mobile;
    info.resX=screen.width;
    info.resY=screen.height;
    return info;
};

function setCookie(name, value, exp, path, domain)
{
    var date=new Date();
    date.setTime(date.getTime()+exp*24*60*60*1000);
    var cookieText=escape(name)+'='+escape(value);
    cookieText+=(exp ? '; EXPIRES='+date.toGMTString() : ';EXPIRES='+date.toUTCString());
    cookieText+=(path ? '; PATH='+cookiePath : '; PATH=/');
    cookieText+=(domain ? '; DOMAIN='+cookieDomain : '');
    document.cookie=cookieText;
};

function getCookie(name)
{
    var value=document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? unescape(value[2]) : null;
};

function deleteCookie(name)
{
    $.removeCookie(name, {path:'/'});
};

function drawImgClickPop(){
    var tmpStr = "";
    tmpStr += '<div class="layerPop" align="center" style="display: block;"> \n';
    tmpStr += '<style type="text/css"> \n';
    tmpStr += '.guidebox03 { padding: 20px; background: #fafafa; border: 1px solid #ddd; height: 400px; overflow-y: scroll;} \n';
    tmpStr += '</style> \n';
    tmpStr += '<div class="popup pop380"> \n';
    tmpStr += '	<div style="border-bottom:2px solid #3a3a3a;"> \n';
    tmpStr += '		<div style="float:left; margin:5px;"><h4 style="font-size:14px">개인정보처리방침</h4></div> \n';
    tmpStr += '		<div style="text-align:right;"><a href="javascript:removeLayerPop();"><img style="margin:5px;width:20px; height:20px;"src="/main/resources/images/login_footer_popup_close_30x30.png" alt="팝업닫기"></a></div> \n';
    tmpStr += '	</div> \n';
    tmpStr += '	<div class="pop_cont"> \n';
    tmpStr += '		<div class="guidebox03"> \n';
    tmpStr += '			<h4 style="font-size:12px"> \n';
    tmpStr += '			■ 수집하는 개인정보 항목<br> \n';
    tmpStr += '			회사는 회원가입, 상담, 서비스 신청 등등을 위해 아래와 같은 개인정보를 수집하고 있습니다.<br> \n';
    tmpStr += '			&nbsp;&nbsp;ο 수집항목 : 사업자등록번호, 상호, 대표자, 업태, 종목, 사업자주소, 전화번호, 휴대폰번호, 이메일, 배송지주소<br> \n';
    tmpStr += '			&nbsp;&nbsp;ο 개인정보 수집방법 : 홈페이지(회원가입)<br> \n';
    tmpStr += '			&nbsp;&nbsp;또한, 서비스 이용과정이나 사업 처리 과정에서 아래와 같은 정보들이 생성되어 수집될 수 있습니다.<br> \n';
    tmpStr += '			&nbsp;&nbsp;ο 이용자의 브라우저 종류 및 OS, 검색어, 서비스 이용 기록<br> \n';
    tmpStr += '			&nbsp;&nbsp;ο IP Address, 방문 일시, 서비스 이용기록, 불량 이용 기록<br> \n';
    tmpStr += '			&nbsp;&nbsp;ο 주소, 쿠키<br><br> \n';
    tmpStr += '			■ 개인정보의 수집 및 이용 목적<br> \n';
    tmpStr += '			회사는 다음과 같은 방법으로 개인정보를 수집합니다.<br> \n';
    tmpStr += '			&nbsp;&nbsp;ο 홈페이지, 서면양식, 팩스, 전화, 상담 게시판, 이메일, 이벤트 응모, 배송요청<br> \n';
    tmpStr += '			&nbsp;&nbsp;ο 협력회사로부터의 제공<br> \n';
    tmpStr += '			&nbsp;&nbsp;ο 생성정보 수집 툴을 통한 수집<br> \n';
    tmpStr += '			&nbsp;&nbsp;회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.<br> \n';
    tmpStr += '			&nbsp;&nbsp;ο 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 콘텐츠 제공<br> \n';
    tmpStr += '			&nbsp;&nbsp;ο 회원 관리<br> \n';
    tmpStr += '			&nbsp;&nbsp;- 회원제 서비스 이용에 따른 본인확인 , 개인 식별 , 불량회원의 부정 이용 방지와 비인가 사용 방지 , 가입 의사 확인 , 연령확인, 불만처리 등 민원처리 , 고지사항 전달<br> \n';
    tmpStr += '			&nbsp;&nbsp;ο 마케팅 및 광고에 활용<br> \n';
    tmpStr += '			&nbsp;&nbsp;- 신규 서비스(제품) 개발 및 특화 , 이벤트 등 광고성 정보 전달 , 인구통계학적 특성에 따른 서비스 제공 및 광고 게재 , 접속 빈도 파악 또는 회원의 서비스 이용에 대한 통계<br><br> \n';
    tmpStr += '			■ 개인정보의 보유 및 이용기간<br> \n';
    tmpStr += '			회사는 개인정보 수집 및 이용목적이 달성된 후에는 예외 없이 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.<br> \n';
    tmpStr += '			가. 회사 내부 방침에 의한 정보보유 사유<br> \n';
    tmpStr += '			&nbsp;&nbsp;o 부정이용기록<br> \n';
    tmpStr += '			&nbsp;&nbsp;- 보존 이유 : 부정 이용 방지<br> \n';
    tmpStr += '			&nbsp;&nbsp;- 보존 기간 : 1년<br> \n';
    tmpStr += '			나. 관련법령에 의한 정보보유 사유<br> \n';
    tmpStr += '			상법, 전자상거래 등에서의 소비자보호에 관한 법률 등 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다. 이 경우 회사는<br> \n';
    tmpStr += '			보관하는 정보를 그 보관의 목적으로만 이용하며 보존기간은 아래와 같습니다.<br> \n';
    tmpStr += '			&nbsp;&nbsp;o 계약 또는 청약철회 등에 관한 기록<br> \n';
    tmpStr += '			&nbsp;&nbsp;- 보존 이유 : 전자상거래 등에서의 소비자보호에 관한 법률<br> \n';
    tmpStr += '			&nbsp;&nbsp;- 보존 기간 : 5년<br> \n';
    tmpStr += '			&nbsp;&nbsp;o 대금결제 및 재화 등의 공급에 관한 기록<br> \n';
    tmpStr += '			&nbsp;&nbsp;- 보존 이유 : 전자상거래 등에서의 소비자보호에 관한 법률<br> \n';
    tmpStr += '			&nbsp;&nbsp;- 보존 기간 : 5년<br> \n';
    tmpStr += '			&nbsp;&nbsp;o 소비자의 불만 또는 분쟁처리에 관한 기록<br> \n';
    tmpStr += '			&nbsp;&nbsp;- 보존 이유 : 전자상거래 등에서의 소비자보호에 관한 법률<br> \n';
    tmpStr += '			&nbsp;&nbsp;- 보존 기간 : 3년<br> \n';
    tmpStr += '			&nbsp;&nbsp;o 본인확인에 관한 기록<br> \n';
    tmpStr += '			&nbsp;&nbsp;- 보존 이유 : 정보통신 이용촉진 및 정보보호 등에 관한 법률<br> \n';
    tmpStr += '			&nbsp;&nbsp;- 보존 기간 : 6개월<br> \n';
    tmpStr += '			&nbsp;&nbsp;o 방문에 관한 기록<br> \n';
    tmpStr += '			&nbsp;&nbsp;- 보존 이유 : 통신비밀보호법<br> \n';
    tmpStr += '			&nbsp;&nbsp;- 보존 기간 : 3개월<br><br> \n';
    tmpStr += '			</h4> \n';
    tmpStr += '		</div> \n';
    tmpStr += '	</div> \n';
    tmpStr += '</div></div> \n';

    $(".layerPopArea").html(tmpStr);
    $(".layerPopArea").css("display" ,"block");
};
// --------------------------- end of source ------------------------