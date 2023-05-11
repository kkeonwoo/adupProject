/****************************************************************************************************
module명: cDeliveryCompletedSuper.js
creator: 윤희상
date: 2022.04.12
version 1.0
설명: 공급사 관리자 페이지에서 배송완료 화면용 js
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
        totInnerHTML+=`	<th>배송완료 건수</th> \n`;
        totInnerHTML+=`	<td><span class="comma">${(returnTotal[0].ORDER_CNT).toLocaleString('ko-KR')}</span> 건</td> \n`;
        totInnerHTML+=`	<th>배송완료 금액</th> \n`;
        totInnerHTML+=`	<td><span class="comma">${(returnTotal[0].VAT_ORDER_PRICE_SUM + returnTotal[0].NONVAT_ORDER_PRICE_SUM).toLocaleString('ko-KR')}</span> 원</td> \n`;
        totInnerHTML+=`	<th>배송완료 VAT 미포함</th> \n`;
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
            
            Cell1.className = "row";
            Cell2.className = "row";
            Cell3.className = "row";
            Cell4.className = "row";
            Cell5.className = "row";
            Cell9.className = "comma";

            Cell0.innerHTML = returnSetArray[tx].ROWNUM;

            var aTag = document.createElement("a");
            aTag.href = `javascript:callLayerPop(${returnSetArray[tx].ORDER_IDX});`
            aTag.innerText = returnSetArray[tx].ORDER_IDX;
            Cell1.appendChild(aTag);
            Cell2.innerHTML = returnSetArray[tx].ORDER_DATE + "<br><br>(" + returnSetArray[tx].PAYMENT_DATE + ")";

            if(returnSetArray[tx].ORDER_TYPE == "P") Cell3.innerHTML = "포스";
            else if(returnSetArray[tx].ORDER_TYPE == "M") Cell3.innerHTML = "모바일";
            else if(returnSetArray[tx].ORDER_TYPE == "W") Cell3.innerHTML = "웹";
            else Cell3.innerHTML = "";

            Cell4.innerHTML = `${returnSetArray[tx].ORDERER_BIZ_NAME}<br>[${returnSetArray[tx].ORDERER_BIZ_SSN}]`;
            Cell5.innerHTML = returnSetArray[tx].RECEIVER_NAME;
            Cell6.innerHTML = returnSetArray[tx].SUPPLIER_NAME;

            if(returnSetArray[tx].GOODS_CHILLED == "0") Cell7.innerHTML = "상온";
            else if(returnSetArray[tx].GOODS_CHILLED == "1") Cell7.innerHTML = "냉장";
            else if(returnSetArray[tx].GOODS_CHILLED == "2") Cell7.innerHTML = "냉동";
            else Cell7.innerHTML = "";
            
            Cell8.innerHTML = returnSetArray[tx].SALES_ITEM_NAME;
            Cell9.innerHTML = (returnSetArray[tx].SALES_ITEM_PRICE*returnSetArray[tx].ORDER_PIECE - returnSetArray[tx].SUM_AMOUNT).toLocaleString('ko-KR');

            Cell10.innerHTML = returnSetArray[tx].STATUS;
        };
        $('#orderList tbody').mergeClassRowspan(1, 1);
        $('#orderList tbody').mergeClassRowspan(2, 1);
        $('#orderList tbody').mergeClassRowspan(3, 1);
        $('#orderList tbody').mergeClassRowspan(4, 1);
        $('#orderList tbody').mergeClassRowspan(5, 1);
    }
    else if(preturnValue.errorcode == "PFERR_CONF_0050"){
        var totInnerHTML = "";
        document.getElementsByClassName("txt_total")[0].children[0].innerHTML = "0";
        gJSTotalData = 0;
        paging(gJSTotalData, pGetGlobalListCount, pGetCurrentPage);

        totInnerHTML+=`<tr> \n`;
        totInnerHTML+=`	<th>배송완료 건수</th> \n`;
        totInnerHTML+=`	<td><span class="comma">0</span> 건</td> \n`;
        totInnerHTML+=`	<th>배송완료 금액</th> \n`;
        totInnerHTML+=`	<td><span class="comma">0</span> 원</td> \n`;
        totInnerHTML+=`	<th>배송완료 VAT 미포함</th> \n`;
        totInnerHTML+=`	<td><span class="comma">0</span> 원</td> \n`;
        totInnerHTML+=`</tr> \n`;

        tot_tb.innerHTML = totInnerHTML;

        var newRow = tb.insertRow();
        newRow.innerHTML = `<td colspan="11" align="center" style="height:100px;">등록된 데이터가 없습니다</td>`;
    }
    else{
       
    };
};