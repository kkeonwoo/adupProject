/****************************************************************************************************
module명: cSupplierSettlementAdm.js
creator: 윤희상
date: 2022.07.20
version 1.0
설명: 공급자 정산용 페이지
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

function reDrawData(pselectedPage){
    eventSearchData("a", $("#list_cnt option:selected").val(), pselectedPage); //데이터
};

async function eventSearchData(gb, pGetGlobalListCount, pGetCurrentPage){ 
    var getSearchCondition = {
        "GB" : gb,
        "listCount" : pGetGlobalListCount,
        "pageIndex" : pGetCurrentPage,
        "fromDate" : $("[name=search_order_date_start]").val(),
        "toDate" : $("[name=search_order_date_end]").val(),
        "search_supplier_ssn" : $("[name=search_supplier_ssn]").val()
    };

    if(gb == "btn"){
        drawOrderList(await searchOrderList(getSearchCondition, pGetGlobalListCount, 1), pGetGlobalListCount, 1);
    }
    else if(gb == "excel"){
        var rtValueSet = await searchOrderList(getSearchCondition, pGetGlobalListCount, pGetCurrentPage, gb);
        var date_str = date_to_str(new Date());
        var fileName = "공급자정산" + date_str;
        if(rtValueSet.errorcode == "PFERR_CONF_0000"){
            exportExcel(rtValueSet.returnvalue, date_str, fileName);
        }
    }
    else{
        drawOrderList(await searchOrderList(getSearchCondition, pGetGlobalListCount, pGetCurrentPage), pGetGlobalListCount, pGetCurrentPage);
    };
};

async function searchOrderList(pSearchCondition){
    //List조회해서 받아오는 ajax 생성
    var returnvalue;
    $.ajax({
        url: "/uGetSupplierSettlement",
        type: "POST", async: false,  
        data:JSON.stringify(pSearchCondition),
        dataType: "JSON", crossOrigin: false, cache: false,
        contentType: "application/json; charset=utf-8",
        success: function(response){
            if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            };
            returnvalue = response;
        },
        error: function(qXHR, textStatus, errorThrown) {
            alert("[err messager]:" + textStatus);
            returnvalue = null;
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
    
    $("body").css("cursor" ,"default");
    return returnvalue;
};

function orderListToExcel(){
    eventSearchData("excel", $("#list_cnt option:selected").val(), 0);
    
};

function drawOrderList(preturnValue, pGetGlobalListCount, pGetCurrentPage){
    if(preturnValue == null || preturnValue == undefined || preturnValue == ""){
        return;
    };
    console.log("preturnValue", preturnValue);
    var table = document.getElementById("orderList");
    var tb = table.children[2];
    var tot_tb = document.getElementsByClassName("table_summary")[0].children[1];
    tb.innerHTML = "";
    tot_tb.innerHTML = "";

    if(preturnValue.errorcode == "PFERR_CONF_0000"){
        
        var returnSetArray = preturnValue.returnvalue;
        var returnTotal = preturnValue.returnTotalCNT;
        var totInnerHTML = "";
        gJSTotalData = returnTotal[0].CNT + 0;
        paging(gJSTotalData, pGetGlobalListCount, pGetCurrentPage);
        document.getElementsByClassName("txt_total")[0].children[0].innerHTML = gJSTotalData.toLocaleString('ko-KR');
        var cont_vat = Math.round(returnTotal[0].VAT_CONT/1.1);
        var fate_vat = Math.round(returnTotal[0].VAT_FATE/1.1);
        var spec_vat = Math.round(returnTotal[0].VAT_SPEC/1.1);
        var tot_vat = Math.round(returnTotal[0].VAT_TOT/1.1);
        totInnerHTML+=`<tr> \n`;
        totInnerHTML+=`	<th rowspan="2">구분</th> \n`;
        totInnerHTML+=`	<th colspan="3">정산금액</th> \n`;
        totInnerHTML+=`	<th colspan="3">합계</th> \n`;
        totInnerHTML+=`	<th colspan="3">이음몰매출</th> \n`;
        totInnerHTML+=`</tr> \n`;
        totInnerHTML+=`<tr> \n`;
        totInnerHTML+=`	<th>상시</th> \n`;
        totInnerHTML+=`	<th>행사</th> \n`;
        totInnerHTML+=`	<th>특가</th> \n`;
        totInnerHTML+=`	<th>매출</th> \n`;
        totInnerHTML+=`	<th>VAT</th> \n`;
        totInnerHTML+=`	<th>합계</th> \n`;
        totInnerHTML+=`	<th>매출</th> \n`;
        totInnerHTML+=`	<th>VAT</th> \n`;
        totInnerHTML+=`	<th>합계</th> \n`;
        totInnerHTML+=`</tr> \n`;
        totInnerHTML+=`<tr> \n`;
        totInnerHTML+=`	<th>과세</th> \n`;
        totInnerHTML+=`	<td>${(returnTotal[0].VAT_CONT).toLocaleString("ko-KR")}</td> \n`;

        totInnerHTML+=`	<td>${(returnTotal[0].VAT_FATE).toLocaleString("ko-KR")}</td> \n`;

        totInnerHTML+=`	<td>${(returnTotal[0].VAT_SPEC).toLocaleString("ko-KR")}</td> \n`;

        totInnerHTML+=`	<td>${(cont_vat + fate_vat + spec_vat).toLocaleString("ko-KR")}</td> \n`;
        totInnerHTML+=`	<td>${((returnTotal[0].VAT_CONT-cont_vat) + (returnTotal[0].VAT_FATE-fate_vat) + (returnTotal[0].VAT_SPEC-spec_vat)).toLocaleString("ko-KR")}</td> \n`;
        totInnerHTML+=`	<td>${(returnTotal[0].VAT_CONT + returnTotal[0].VAT_FATE + returnTotal[0].VAT_SPEC).toLocaleString("ko-KR")}</td> \n`;

        totInnerHTML+=`	<td>${(tot_vat).toLocaleString("ko-KR")}</td> \n`;
        totInnerHTML+=`	<td>${(returnTotal[0].VAT_TOT-tot_vat).toLocaleString("ko-KR")}</td> \n`;
        totInnerHTML+=`	<td>${(returnTotal[0].VAT_TOT).toLocaleString("ko-KR")}</td> \n`;
        totInnerHTML+=`</tr> \n`;
        totInnerHTML+=`<tr> \n`;
        totInnerHTML+=`	<th>면세</th> \n`;
        totInnerHTML+=`	<td>${(returnTotal[0].NOVAT_CONT).toLocaleString("ko-KR")}</td> \n`;
        totInnerHTML+=`	<td>${(returnTotal[0].NOVAT_FATE).toLocaleString("ko-KR")}</td> \n`;
        totInnerHTML+=`	<td>${(returnTotal[0].NOVAT_SPEC).toLocaleString("ko-KR")}</td> \n`;
        totInnerHTML+=`	<td>${(returnTotal[0].NOVAT_CONT + returnTotal[0].NOVAT_FATE + returnTotal[0].NOVAT_SPEC).toLocaleString("ko-KR")}</td> \n`;
        totInnerHTML+=`	<td>0</td> \n`;
        totInnerHTML+=`	<td>${(returnTotal[0].NOVAT_CONT + returnTotal[0].NOVAT_FATE + returnTotal[0].NOVAT_SPEC).toLocaleString("ko-KR")}</td> \n`;
        totInnerHTML+=`	<td>${(returnTotal[0].NOVAT_TOT).toLocaleString("ko-KR")}</td> \n`;
        totInnerHTML+=`	<td>0</td> \n`;
        totInnerHTML+=`	<td>${(returnTotal[0].NOVAT_TOT).toLocaleString("ko-KR")}</td> \n`;
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
            var Cell12 = newRow.insertCell(12);
            var Cell13 = newRow.insertCell(13);
            var Cell14 = newRow.insertCell(14);
            var Cell15 = newRow.insertCell(15);
            var Cell16 = newRow.insertCell(16);
            var Cell17 = newRow.insertCell(17);
            var Cell18 = newRow.insertCell(18);
            var Cell19 = newRow.insertCell(19);
            var Cell20 = newRow.insertCell(20);
            
            Cell7.className = "comma";
            Cell8.className = "comma";
            Cell9.className = "comma";
            Cell10.className = "comma";
            Cell11.className = "comma";
            Cell12.className = "comma";
            Cell13.className = "comma";
            Cell14.className = "comma";
            Cell15.className = "comma";
            Cell16.className = "comma";
            Cell17.className = "comma";
            Cell18.className = "comma";
            Cell19.className = "comma";
            Cell20.className = "comma";

            Cell0.innerHTML = returnSetArray[tx].ROWNUM;
            Cell1.innerHTML = returnSetArray[tx].SUPPLIER_NAME;
            Cell2.innerHTML = returnSetArray[tx].SUPPLIER_SSN;
            Cell3.innerHTML = returnSetArray[tx].SUPPLIER_CEO;
            Cell4.innerHTML = returnSetArray[tx].SUPPLIER_CHARGER_EMAIL;
            Cell5.innerHTML = returnSetArray[tx].SUPPLIER_CHARGER;
            Cell6.innerHTML = returnSetArray[tx].SUPPLIER_CHARGER_MOBILE;
            
            
            Cell7.innerHTML = (returnSetArray[tx].CONT_FEE_RATE).toLocaleString('ko-KR');
            Cell8.innerHTML = (returnSetArray[tx].WEEK_SPECIAL_FATE_RATE).toLocaleString('ko-KR');
            Cell9.innerHTML = (returnSetArray[tx].CONT_SPECIAL_PRICE_FEE_RATE).toLocaleString('ko-KR');
            Cell10.innerHTML = (returnSetArray[tx].VAT_CONT).toLocaleString('ko-KR');
            Cell11.innerHTML = (returnSetArray[tx].NOVAT_CONT).toLocaleString('ko-KR');
            Cell12.innerHTML = (returnSetArray[tx].VAT_FATE).toLocaleString('ko-KR');
            Cell13.innerHTML = (returnSetArray[tx].NOVAT_FATE).toLocaleString('ko-KR');
            Cell14.innerHTML = (returnSetArray[tx].VAT_SPEC).toLocaleString('ko-KR');
            Cell15.innerHTML = (returnSetArray[tx].NOVAT_SPEC).toLocaleString('ko-KR');
            Cell16.innerHTML = (returnSetArray[tx].VAT_CONT + returnSetArray[tx].VAT_FATE + returnSetArray[tx].VAT_SPEC).toLocaleString('ko-KR');
            Cell17.innerHTML = (returnSetArray[tx].NOVAT_CONT + returnSetArray[tx].NOVAT_FATE + returnSetArray[tx].NOVAT_SPEC).toLocaleString('ko-KR');
            Cell18.innerHTML = (returnSetArray[tx].VAT_TOT).toLocaleString('ko-KR');
            Cell19.innerHTML = (returnSetArray[tx].NOVAT_TOT).toLocaleString('ko-KR');
            Cell20.innerHTML = (returnSetArray[tx].TOT).toLocaleString('ko-KR');
        };
    }
    else if(preturnValue.errorcode == "PFERR_CONF_0050"){
        // var totInnerHTML = "";
        // document.getElementsByClassName("txt_total")[0].children[0].innerHTML = "0";
        // gJSTotalData = 0;
        // paging(gJSTotalData, pGetGlobalListCount, pGetCurrentPage);

        // totInnerHTML+=`<tr> \n`;
        // totInnerHTML+=`	<th rowspan="3">주문 건수</th> \n`;
        // totInnerHTML+=`	<td rowspan="3"><span class="comma">0</span> 건</td> \n`;
        // totInnerHTML+=`	<th>매출 금액</th> \n`;
        // totInnerHTML+=`	<td><span class="comma">0</span> 원</td> \n`;
        // totInnerHTML+=`	<th>매출금액 VAT 미포함</th> \n`;
        // totInnerHTML+=`	<td><span class="comma">0</span> 원</td> \n`;
        // totInnerHTML+=`</tr> \n`;
        // totInnerHTML+=`<tr> \n`;
        // totInnerHTML+=`	<th>주문취소 금액</th> \n`;
        // totInnerHTML+=`	<td><span class="comma">0</span> 원</td> \n`;
        // totInnerHTML+=`	<th>주문취소 VAT 미포함</th> \n`;
        // totInnerHTML+=`	<td><span class="comma">0</span> 원</td> \n`;
        // totInnerHTML+=`</tr> \n`;
        // totInnerHTML+=`<tr> \n`;
        // totInnerHTML+=`	<th>합계 금액</th> \n`;
        // totInnerHTML+=`	<td><span class="comma">0</span> 원</td> \n`;
        // totInnerHTML+=`	<th>합계 금액 VAT 미포함</th> \n`;
        // totInnerHTML+=`	<td><span class="comma">0</span> 원</td> \n`;
        // totInnerHTML+=`</tr> \n`;

        // tot_tb.innerHTML = totInnerHTML;

        var newRow = tb.insertRow();
        newRow.innerHTML = `<td colspan="21" align="center" style="height:100px;">등록된 데이터가 없습니다</td>`;
    }
    else{
       
    };
};