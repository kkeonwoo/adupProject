/****************************************************************************************************
module명: cPaymentCompleteSuper.js
creator: 윤희상
date: 2022.04.12
version 1.0
설명: 공급사 관리자 페이지에서 입금완료 화면용 js
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
server side 개발자 유의사항
1. 모듈(export)시 전역 변수 사용 금지 (http 서비스 유지되는 동안 값 유지됨), 상수는 가능
2. DB에 저장하는 data중 id를 제외한 개인식별 정보는 복호화 가능한 AES Ecrypion을 할 것 (법적 의무사항)
3. password SHA-256 기반 복호화 불가능한 암호를 사용해야 함 (운영자도 볼 수 없음, 법적 의무사항)
4. 가급적 var 선언을 하지말고 var 선언을 사용해야 함 (Type 혼선 방지) 단 safari브라우저 지원등의 문제로
   Client로 내려가는 모듈은 var를 사용한다. (safari가 let을 인지하지 못함)
5. 모든 서버-서버, 서버-클라이언트는 JSON 객체 통신을 원칙으로 함
6. Applicaiton Message JSON을 사용할 것, App Message무단 작성 금지 (표준)
7. 지역 변수 선언시 Server Component명을 prefix로 사용할 것. 다소 길더라도 운영성(Debug용이) 측면 고려임
8. 한글자 변수 사용 금지 (i, j, k등) debug곤란
9. 모든 서버 모듈 Naming은 s*로 시작할 것
10.서버 모듈도 배포시 반드시 JS Compress후 난독화하여 배포해야 한다.

client (front) 개발자 유의 사항
1. 반드시 client package는 압축(JS Compress) 및 난독화 해서 올릴 것 (소스 유출 방지)
2. 보안검사 (SQL Injection, JS Injection)를 받을 것
3. Client 소스에서는 eval() 함수 사용 금지!!!
4. 모든 Client 도듈 Naming은 c*로 시작할 것

기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";

/**********************************************
**********************************************/
var gJSTotalData;
var gJSGetListCount;
gJSGetListCount = $("#list_cnt option:selected").val();

function drawOrderList(preturnValue, pGetGlobalListCount, pGetCurrentPage){
    if(preturnValue == null || preturnValue == undefined || preturnValue == ""){
        return;
    };

    var table = document.getElementById("orderList");
    var tb = table.children[2];
    var tot_tb = document.getElementsByClassName("table_summary")[0].children[1];
    tb.innerHTML = "";
    tot_tb.innerHTML = "";

    if(preturnValue.errorcode == "PFERR_CONF_0000"){
        var returnSetArray = preturnValue.returnvalue;
        var returnTotal = preturnValue.returnTotalCNT;
        var totInnerHTML = "";
        gJSTotalData = returnTotal[0].GOODS_CNT + 0;
        paging(gJSTotalData, pGetGlobalListCount, pGetCurrentPage);
        document.getElementsByClassName("txt_total")[0].children[0].innerHTML = gJSTotalData.toLocaleString('ko-KR');

        totInnerHTML+=`<tr> \n`;
        totInnerHTML+=`	<th>입금완료 건수</th> \n`;
        totInnerHTML+=`	<td><span class="comma">${(returnTotal[0].ORDER_CNT).toLocaleString('ko-KR')}</span> 건</td> \n`;
        totInnerHTML+=`	<th>입금완료 금액</th> \n`;
        totInnerHTML+=`	<td><span class="comma">${(returnTotal[0].VAT_ORDER_PRICE_SUM + returnTotal[0].NONVAT_ORDER_PRICE_SUM).toLocaleString('ko-KR')}</span> 원</td> \n`;
        totInnerHTML+=`	<th>입금완료 VAT 미포함</th> \n`;
        totInnerHTML+=`	<td><span class="comma">${(Math.round(returnTotal[0].VAT_ORDER_PRICE_SUM/1.1) + returnTotal[0].NONVAT_ORDER_PRICE_SUM).toLocaleString('ko-KR')}</span> 원</td> \n`;
        totInnerHTML+=`</tr> \n`;

        tot_tb.innerHTML = totInnerHTML;
        
        for(var tx=0; tx<returnSetArray.length; tx++){
            var newRow = tb.insertRow();
            var Cell0 = newRow.insertCell(0);
            var Cell1 = newRow.insertCell(1);
            var Cell2 = newRow.insertCell(2);
            var Cell3 = newRow.insertCell(3);
            var Cell4 = newRow.insertCell(4);
            var Cell5 = newRow.insertCell(5);
            var Cell6 = newRow.insertCell(6);
            var Cell7 = newRow.insertCell(7);
            var Cell8 = newRow.insertCell(8);
            var Cell9 = newRow.insertCell(9);
            var Cell10 = newRow.insertCell(10);
            var Cell11 = newRow.insertCell(11);
            
            Cell2.className = "row";
            Cell3.className = "row";
            Cell4.className = "row";
            Cell5.className = "row";
            Cell6.className = "row";
            Cell10.className = "comma";

            Cell0.innerHTML = `<input type="checkbox" name="gidx" class="checkItem" value="${returnSetArray[tx].ROW_SEQUENCE}">`;
            Cell1.innerHTML = returnSetArray[tx].ROWNUM;

            var aTag = document.createElement("a");
            aTag.href = `javascript:callLayerPop(${returnSetArray[tx].ORDER_IDX});`
            aTag.innerText = returnSetArray[tx].ORDER_IDX;
            Cell2.appendChild(aTag);
            Cell3.innerHTML = returnSetArray[tx].ORDER_DATE + "<br><br>(" + returnSetArray[tx].PAYMENT_DATE + ")";

            if(returnSetArray[tx].ORDER_TYPE == "P") Cell4.innerHTML = "포스";
            else if(returnSetArray[tx].ORDER_TYPE == "M") Cell4.innerHTML = "모바일";
            else if(returnSetArray[tx].ORDER_TYPE == "W") Cell4.innerHTML = "웹";
            else Cell4.innerHTML = "";

            Cell5.innerHTML = `${returnSetArray[tx].ORDERER_BIZ_NAME}<br>[${returnSetArray[tx].ORDERER_BIZ_SSN}]`;
            Cell6.innerHTML = returnSetArray[tx].RECEIVER_NAME;
            Cell7.innerHTML = returnSetArray[tx].SUPPLIER_NAME;

            if(returnSetArray[tx].GOODS_CHILLED == "0") Cell8.innerHTML = "상온";
            else if(returnSetArray[tx].GOODS_CHILLED == "1") Cell8.innerHTML = "냉장";
            else if(returnSetArray[tx].GOODS_CHILLED == "2") Cell8.innerHTML = "냉동";
            else Cell8.innerHTML = "";
            
            Cell9.innerHTML = returnSetArray[tx].SALES_ITEM_NAME;
            Cell10.innerHTML = (returnSetArray[tx].SALES_ITEM_PRICE*returnSetArray[tx].ORDER_PIECE - returnSetArray[tx].SUM_AMOUNT).toLocaleString('ko-KR');
            
            Cell11.innerHTML = returnSetArray[tx].STATUS;
        };
        $('#orderList tbody').mergeClassRowspan(2, 2);
        $('#orderList tbody').mergeClassRowspan(3, 2);
        $('#orderList tbody').mergeClassRowspan(4, 2);
        $('#orderList tbody').mergeClassRowspan(5, 2);
        $('#orderList tbody').mergeClassRowspan(6, 2);
    }
    else if(preturnValue.errorcode == "PFERR_CONF_0050"){
        var totInnerHTML = "";
        document.getElementsByClassName("txt_total")[0].children[0].innerHTML = "0";
        gJSTotalData = 0;
        paging(gJSTotalData, pGetGlobalListCount, pGetCurrentPage);

        totInnerHTML+=`<tr> \n`;
        totInnerHTML+=`	<th>입금완료 건수</th> \n`;
        totInnerHTML+=`	<td><span class="comma">0</span> 건</td> \n`;
        totInnerHTML+=`	<th>입금완료 금액</th> \n`;
        totInnerHTML+=`	<td><span class="comma">0</span> 원</td> \n`;
        totInnerHTML+=`	<th>입금완료 VAT 미포함</th> \n`;
        totInnerHTML+=`	<td><span class="comma">0</span> 원</td> \n`;
        totInnerHTML+=`</tr> \n`;

        tot_tb.innerHTML = totInnerHTML;

        var newRow = tb.insertRow();
        newRow.innerHTML = `<td colspan="12" align="center" style="height:100px;">등록된 데이터가 없습니다</td>`;
    }
    else{
       
    };
};

async function orderPicking(){
    console.log("배송준비중 클릭");
    //배송준비중 일괄 수정하기 버튼
    var checked_index = new Array();
    // var tr_array = new Array();
    // var tr;
    var checkboxes = $("input[name=gidx]:checked");

    checkboxes.each(function(index, checkbox){
        checked_index.push(checkbox.value);
        // tr = checkboxes.parent().parent().eq(index);
        // tr_array.push(tr);
    });

    if(checked_index.length < 1){
        alert("한개 이상 선택 후에 수정이 가능합니다.");
        return;
    }
    var editDataSetJson = new Object();
    editDataSetJson = {"editType" : "DELIVERY_READY", "setConditionIndex" : checked_index, "setStatus":"1"};
    var rtnValue = await callEditOrderAjaxCommon(editDataSetJson);
    if(rtnValue == "PFERR_CONF_0000"){
        alert("정상적으로 수정되었습니다.");
        reDrawData(1);
    }

    console.log("checked_index", checked_index);
};

// 20220721 ash sitepopup script add - start
function popupClose(popupIdx)
{
    //$("#sitePopupBox").empty();
    $("#sitePopup"+popupIdx).remove();
    //쿠키를 set한다.
    setCookie("sitePopup"+popupIdx, "hidden", 1);  //1: 1 day
};

function getCookie(name)
{
    var value=document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? unescape(value[2]) : null;
};

function setCookie(name, value, days)
{
    var interval=0;
    if(days) 
    {
        interval = days * 24 * 60 * 60;   //현재 시각으로 부터 전달된 day를 초로 환산하여 max age로 설정
        //interval = interval + (9*60*60);    //한국시간이므로 9시간을 더해 주어야 현재시각이 기준점 (브라우저가 GMT기준으로 판단하므로 한국 시각은 막았음)
    }
    else
    {
        var expires = "";
    };
    
    //document.cookie = name + "=" + value + expires + "; path=/; max-age=60";
    document.cookie = name + "=" + value + "; path=/; max-age="+interval;
};

function findCookieKey(name)
{
    //var nameOfCookie = name + "="; //쿠키는 "쿠키=값" 형태로 가지고 있어서 뒤에 있는 값을 가져오기 위해 = 포함
    var nameOfCookie=name;
    var x=0; 
    var endOfCookie=0;
    var position=-1;
    while(x<=document.cookie.length)
    {
        //현재 세션에 가지고 있는 쿠키의 총 길이를 가지고 반복
        var y=(x + nameOfCookie.length); // substring으로 찾아낼 쿠키의 이름 길이 저장
        //if(document.cookie.substring(x, y)==nameOfCookie)
        if(document.cookie.substring(x, y).indexOf(nameOfCookie)>-1)
        {
            //잘라낸 쿠키와 쿠키의 이름이 같다면 (여기서는 같은게 아니고 유사한 경우로 검색)
            // x지점부터 = 으로 끝나는 사이의 값이 내가 찾으려는 쿠키의 key 값이다.
            position = document.cookie.substring(x, document.cookie.length).indexOf("=");
            if(position>-1)
            {
                //찾으려는 cookie key 값을 반환한다.
                return unescape(document.cookie.substring(x,x+position));
            }
            else
            {
                break;
            };

            //if ((endOfCookie = document.cookie.indexOf(";", y)) == -1) //y의 위치로부터 ;값까지 값이 있으면 
            //endOfCookie = document.cookie.length; //쿠키의 길이로 적용하고
            //return unescape(document.cookie.substring(y, endOfCookie)); //쿠키의 시작점과 끝점을 찾아서 값을 반환
        };

        x=document.cookie.indexOf(" ", x) + 1; //다음 쿠키를 찾기 위해 시작점을 반환
        if(x==0)
        {
            //쿠키 마지막이면 나오기
            break;
        };
    };

    return ""; //빈값 반환
};

//20220721 ash site popup function add
function getSitePopup(who)
{
    //div panel 초기화
    $("#sitePopupBox").empty();

    //(1) cookie check
    var popupcookieKey = findCookieKey("sitePopup");
    var popupcookieVal= getCookie(popupcookieKey);

    //cookie가 살아 있으면 아무것도 표시하지 않음
    if(popupcookieKey==undefined||popupcookieKey==null||popupcookieKey=="")
    {
        // popup으로 보여줄 정보가 있는지 확인하여 정보를 얻어온다.
        var returnvalue = "";
        $.ajax({
            url: "/uGetMySitePopup", type: "POST", async: false, data: JSON.stringify({"who" : who}),
            dataType: "JSON", crossOrigin: false, cache: false, contentType: "application/json; charset=utf-8",
            success: function(response)
            {
                if(response.errorcode == "PFERR_CONF_0000")
                {
                    //보여 줄게 있으면 div 를 동적으로 생성한다. popup의 수만큼 loop
                    if(response.returnvalue.length>0)
                    {
                        let returnSetArray = response.returnvalue;
                        //div insertion
                        var x=0; var y=0;
                        var innerText="";
                        var interval=0;
                        for(var ix=0; ix<returnSetArray.length; ix++)
                        {
                            interval=ix*(50);   //팝업이 여러개면 겹쳐 띄우도록 좌표 변경
                            x=Number(returnSetArray[ix].MARGIN_TOP)+interval;
                            y=Number(returnSetArray[ix].MARGIN_LEFT)+interval;
                            innerText ='<div id="sitePopup'+returnSetArray[ix].IDX+'" class="sitePopup ui-draggable ui-draggable-handle" style="top: '+x+'px; left: '+y+'px; z-index: 991735; display: block;" value="'+returnSetArray[ix].IDX+'">';
                            innerText+='<div class="popupLayout">';
                            innerText+='<div class="close" onclick="popupClose('+"'"+returnSetArray[ix].IDX+"'"+');">닫기</div>';
                            innerText+='<div class="title">'+returnSetArray[ix].TITLE+'</div>';
                            innerText+='<img alt="이미지를 보여 줄 수 없습니다." src="/eum/resources/temp/site/'+returnSetArray[ix].IMAGE_FILE_NAME+'" style="border:none;">';
                            innerText+='</div>';
                            innerText+='</div>';

                            $("#sitePopupBox").append(innerText);
                        };
                    }
                }
                else
                {
                    //alert(response.errormessage);
                };
            },
            error: function(xhr) {
                console.log("[error] : " + xhr);
            }
        });
    };
};
// 20220721 ash sitepopup script add - end
/* ----------------------- end of source ---------------------------------------------------- */