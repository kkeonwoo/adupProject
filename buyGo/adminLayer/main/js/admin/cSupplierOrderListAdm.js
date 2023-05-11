/****************************************************************************************************
module명: cSupplierOrderListAdm.js
creator: 정길웅
date: 2022.05.03
version 1.0
설명: 사용자에게 공급자결품률 리스트를 보여주는 화면
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
 * 들어가는 ajax 호출 목록
 * 상품List조회모듈(searchSalesItemListAdmin)
 * Parameter : 검색조건 Data, 한페이지 내 List 갯수(갯수가 변경되면 1페이지로 이동해야함), 보여줄 페이지 Index
 * --------------------------------------------
 * Summary Grid (searchSalesItemSummaryAdmin)
 * Parameter : 검색조건 Data
 * --------------------------------------------
 * 화면목록 조회 모듈
 * --------------------------------------------
 * 카테고리 Lv 조회 모듈(searchCategory)
 * Parameter : 화면목록Lov Data, Level Data
 * --------------------------------------------
**********************************************/
var gJSTotalData;
var gJSGetListCount;
var pGetCurrentPage;
gJSGetListCount = $("#list_cnt option:selected").val();
function reDrawData(pselectedPage){
    eventSupplierOrderList(pselectedPage); //데이터
};

async function eventSupplierOrderList(pselectedPage){
    //결제일자 순서 바뀜 체크
    var date_start = $("input[name=search_order_date_start]").val();
    var date_end =  $("input[name=search_order_date_end]").val();
    if(date_start>date_end){
        alert("결제일자의 순서가 바뀌었습니다.");
    }
    else{
        document.body.style.cursor = "wait";
        await eventTopTable();                  //위쪽 테이블 그려주는 함수
        await eventBottomTable(pselectedPage);  //아래쪽 테이블 그려주는 함수
        await getBottomTotal(pselectedPage);    //아래쪽 테이블 DB의 총 합
        document.body.style.cursor = "default";
    };
};

//윗쪽 테이블 *********************************************************************************/

//위쪽 테이블 만들기 위해 오브젝트 전달 
async function eventTopTable(){
    var searchCondition = {
        date_start : $("input[name=search_order_date_start]").val(),
        date_end :  $("input[name=search_order_date_end]").val(),
        row_sequence : $("#search_supplier_ssn option:selected").val(),
        order_number : $("input[name=search_order_no]").val(),
        tableGBN : "topTable"
    };
    await getSupplierOrderListDB(searchCondition);
};


//공급사 목록 ajax 생성
function searchSupplierList(){
    $.ajax({
        url: "/uGetSupplierDeal?"  + $.param({"authPage" : "cSupplierOrderListAdm.js"}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            var returnSetArray = response.returnvalue;
            var innerText = ``;
            innerText = innerText + `<option value="">-전체-</option>`;
            if(response.errorcode == "PFERR_CONF_0000"){
                for(var hx=0; hx<returnSetArray.length; hx++){
                innerText = innerText + `<option value="${returnSetArray[hx].ROW_SEQUENCE}">${returnSetArray[hx].NADLE_SUPPLIER_TRANSACTION_TYPE}</option>`;
            }
            document.getElementById("search_supplier_ssn").innerHTML = innerText;
            }
            else if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            };
        },
        error: function(xhr) {
            console.log("[error] : " + xhr);
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
};



//공급사결품률 위쪽 테이블의 DB읽어오는 ajax
async function getSupplierOrderListDB(getSearchCondition){
    await $.ajax({
        url: "/uGetSupplierOrderListAdm?" + $.param({"authPage" : "cSupplierOrderListAdm.js", "searchCondition":getSearchCondition}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            if(response.errorcode == "PFERR_CONF_0000"){
                drawSupplierList(response.returnvalue);
            }
            else if(response.errorcode == "PFERR_CONF_0050"){
                var tbody = document.getElementById("topTable_tbody");
                var innerText = "";
                innerText = innerText + "<tr>";
                innerText = innerText + '    <th width="23.5%">협력사</th>';
                innerText = innerText + '    <th width="8.5%">입금완료</th>';
                innerText = innerText + '    <th width="8.5%">배송준비</th>';
                innerText = innerText + '    <th width="8.5%">배송중</th>';
                innerText = innerText + '    <th width="8.5%">배송완료</th>';
                innerText = innerText + '    <th width="8.5%">합계</th>';
                innerText = innerText + '    <th width="8.5%">반품</th>';
                innerText = innerText + '    <th width="8.5%">결품</th>';
                innerText = innerText + '    <th width="8.5%">파손</th>';
                innerText = innerText + '    <th width="8.5%">합계</th>';
                innerText = innerText + "</tr>";
                innerText = innerText + "<tr>";
                innerText = innerText + '    <td colspan="13" style="height:100px;">';
                innerText = innerText + '        <div style="text-align:center" >등록된 데이터가 없습니다.</div>';
                innerText = innerText + "    </td>";
                innerText = innerText + "</tr>";
                tbody.innerHTML=innerText;
            
                // $("#table_summary").find("tr:eq(1)").html(txt);
            }
            else if(response.errorcode == "PFERR_CONF_0059"){
                alert(response.errormessage);
            };
        },
        error: function(xhr, textStatus, e) {
            console.log("[error] : " + textStatus);
            return null;
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
};

//공급자 결품률 위쪽 테이블을 그려주는 함수
function drawSupplierList(pReturnValue){
    if(pReturnValue == null || pReturnValue == undefined || pReturnValue == ""){
        return;
    };
    //table head 하드코딩으로 그려냄
    var tbody = document.getElementById("topTable_tbody");
    var innerText = "";
    innerText = innerText + "<tr>";
    innerText = innerText + '    <th width="20.0%">협력사</th>';
    innerText = innerText + '    <th width="6.5%">입금완료</th>';
    innerText = innerText + '    <th width="6.5%">배송준비</th>';
    innerText = innerText + '    <th width="6.5%">배송중</th>';
    innerText = innerText + '    <th width="6.5%">배송완료</th>';
    innerText = innerText + '    <th width="6.5%">합계</th>';
    innerText = innerText + '    <th width="6.5%">반품</th>';
    innerText = innerText + '    <th width="6.5%">결품</th>';
    innerText = innerText + '    <th width="6.5%">파손</th>';
    innerText = innerText + '    <th width="6.5%">주문취소</th>';
    innerText = innerText + '    <th width="6.5%">합계</th>';
    innerText = innerText + "</tr>";
    tbody.innerHTML=innerText;

    var newRow;
    var tmpSupplierName="-x";

    for(var ix=0;ix<pReturnValue.length;ix++)
    {
        //협력사 이름이 다른 경우 행을 추가한다.
        if(pReturnValue[ix].SUPPLIER_NAME!=tmpSupplierName)
        {
            newRow = tbody.insertRow();
            newRow.insertCell(0);
            newRow.insertCell(1);
            newRow.insertCell(2);
            newRow.insertCell(3);
            newRow.insertCell(4);
            newRow.insertCell(5);
            newRow.insertCell(6);
            newRow.insertCell(7);
            newRow.insertCell(8);
            newRow.insertCell(9);
            newRow.insertCell(10);

            tmpSupplierName = pReturnValue[ix].SUPPLIER_NAME;
            newRow.cells[0].innerText=tmpSupplierName;
            var pos=colPosition(pReturnValue[ix].TMP_DELIVERY_STATUS);
            newRow.cells[pos].innerText=pReturnValue[ix].DELIVERY_PATTERN_COUNT;
        }
        else if(pReturnValue[ix].SUPPLIER_NAME==tmpSupplierName)
        {
            var pos=colPosition(pReturnValue[ix].TMP_DELIVERY_STATUS);
            newRow.cells[pos].innerText=pReturnValue[ix].DELIVERY_PATTERN_COUNT;
        };
        //값이 없는 건 0원처리함 + 총 합계를 구함
        insertRowValue(newRow);
    };
};

//각 column에 맞는 값을 cell에 전달한다.
function colPosition(pTmpDeliveryStatus, pCNT, pNewRow)
{
    if (pTmpDeliveryStatus=="입금완료"){
        return 1;
    }   
    else if (pTmpDeliveryStatus=="배송준비중"){
        return 2;
    }   
    else if (pTmpDeliveryStatus=="배송중"){
        return 3;
    }   
    else if (pTmpDeliveryStatus=="배송완료"){
        return 4;
    }   
    else if (pTmpDeliveryStatus=="반품"){
        return 6;
    }   
    else if (pTmpDeliveryStatus=="결품"){
        return 7;
    }   
    else if (pTmpDeliveryStatus=="파손"){
        return 8;
    }
    else if (pTmpDeliveryStatus=="주문취소"){
        return 9;
    };
};

//주어지지 않은 값을 0으로 처리하고 한 행의 값들을 더하는 함수
function insertRowValue(pNewRow){
    //주문상태~배송완료까지의 값과 그 합을 구한다
    var front_total=0;
    var tmpFront_total=0;
    for(var tx=2;tx<5;tx++){
        if(pNewRow.cells[tx].innerText==""||pNewRow.cells[tx].innerText==undefined){
            pNewRow.cells[tx].innerText=0;
        }
        else{
            tmpFront_total = Number(pNewRow.cells[tx].innerText);
            front_total = front_total + tmpFront_total;
        };
    };
    //20220719 입금완료 이후는 모두 동일하다고 판단함
    pNewRow.cells[1].innerText = front_total;
    pNewRow.cells[5].innerText = front_total;

    //반품~파손까지의 값과 그 합을 구한다
    var back_total=0;
    var tmpBack_total=0;
    for(var tx=6;tx<10;tx++){
        if(pNewRow.cells[tx].innerText==""||pNewRow.cells[tx].innerText==undefined){
            pNewRow.cells[tx].innerText=0;
        }
        else{
            tmpBack_total = Number(pNewRow.cells[tx].innerText);
            back_total = back_total + tmpBack_total;
        };
    };
    pNewRow.cells[10].innerText = back_total;
};


//아래쪽 테이블 *********************************************************************************/
//공급자결품률 아래쪽 테이블을 그리는 함수
function drawOrderList(pReturnValue){
    if(pReturnValue == null || pReturnValue == undefined || pReturnValue == ""){
        return;
    };
    var table = document.getElementById("orderList");
    var tb = table.children[2];
    tb.innerHTML = "";
    console.log("pReturnValue", pReturnValue)
    if(pReturnValue.errorcode == "PFERR_CONF_0000"){

        var returnSetArray = pReturnValue.returnvalue;

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
            
            Cell0.innerHTML = returnSetArray[tx].ROWNUM;
            Cell1.innerHTML = returnSetArray[tx].ORDER_NO;
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
            Cell10.innerHTML = `${returnSetArray[tx].BANK_NAME}<br>${returnSetArray[tx].PAYMENT_ACCOUNT}<br>(합계 : <b><span class="comma">${(returnSetArray[tx].PAYMENT_SUM).toLocaleString('ko-KR')}</span></b>)`;
            
            Cell11.innerHTML = returnSetArray[tx].TMP_DELIVERY_STATUS;

        };
        $('#orderList tbody').mergeClassRowspan(1, 1);
        $('#orderList tbody').mergeClassRowspan(2, 1);
        $('#orderList tbody').mergeClassRowspan(3, 1);
        $('#orderList tbody').mergeClassRowspan(4, 1);
        $('#orderList tbody').mergeClassRowspan(5, 1);
        $('#orderList tbody').mergeClassRowspan(10, 1);
    }
    else if(pReturnValue.errorcode == "PFERR_CONF_0050"){
        var newRow = tb.insertRow();
        newRow.innerHTML = `<td colspan="13" align="center" style="height:100px; padding-right:70px;">등록된 데이터가 없습니다</td>`;
        paging(1,1,1);
    }
    else{
    };
};

//rowspan 같은 명칭일 때 합치는 함수
$.fn.mergeClassRowspan = function (colIdx, porderIdIndex) {
    return this.each(function () {
        var that;
        var rowspan;
        $('tr', this).each(function (row) {
            $('td:eq(' + colIdx + ')', this).filter(':visible').each(function (col) {
                if(($(this).html() == $(that).html()) && ($('td:eq(' + porderIdIndex + ')', $(this).parent()).html() == $('td:eq(' + porderIdIndex + ')', $(that).parent()).html()))  {
                    if ($(that).attr("rowspan") == undefined) {
                        $(that).attr("rowspan",1);
                        rowspan = $(that).attr("rowspan");
                    }
                    else{
                        rowspan = $(that).attr("rowspan"); 
                    }
                    rowspan = Number(rowspan)+1;
                    $(that).attr("rowspan",rowspan);
                    $(this).hide();
                } else {
                    that = this;
                }
                // set the that if not already set
                that = (that == null) ? this : that;
            });
        });
    });
};



//상품 총 건수 계산해주는 함수
async function getBottomTotal(pselectedPage){
    var searchCondition = {
        date_start : $("input[name=search_order_date_start]").val(),
        date_end :  $("input[name=search_order_date_end]").val(),
        row_sequence : $("#search_supplier_ssn option:selected").val(),
        order_number : $("input[name=search_order_no]").val(),
        tableGBN : "bottomTotal",
    };
    var totalValue = await searchOrderTotal(searchCondition);

    if(totalValue.returnvalue[0].COUNT==""||totalValue.returnvalue[0].COUNT==undefined){
        document.getElementsByClassName("comma")[0].innerText = "0";
        paging(1, 1, 1);
    }
    else{
        var totalData = totalValue.returnvalue[0].COUNT
        document.getElementsByClassName("comma")[0].innerText = totalData;
        paging(totalData, $("#list_cnt").val(), pselectedPage);
    }
}

//아래쪽 테이블에 관한 이벤트
async function eventBottomTable(pselectedPage){ 
    var searchCondition = {
        date_start : $("input[name=search_order_date_start]").val(),
        date_end :  $("input[name=search_order_date_end]").val(),
        row_sequence : $("#search_supplier_ssn option:selected").val(),
        order_number : $("input[name=search_order_no]").val(),
        tableGBN : "bottomTable",
        now_page : pselectedPage,
        rows_per_page : $("#list_cnt").val()
    };
    var orderListDetail = await searchOrderList(searchCondition);
    drawOrderList(orderListDetail);
};

//아래쪽 테이블 db 가져오는 ajax
async function searchOrderList(pSearchCondition){
    //List조회해서 받아오는 ajax 생성
    var returnvalue;
    $.ajax({
        url: "/uGetSupplierOrderListAdm?"  + $.param({"authPage" : "cSupplierOrderListAdm.js", "searchCondition":pSearchCondition}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            if(response.errorcode == "PFERR_CONF_0000"){
                //성공 결과값
            };
            returnvalue = response;
        },
        error: function(xhr) {
            console.log("[error] : " + xhr);
            returnvalue = null;
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
    return returnvalue;
};

//상품 total 가져오는 ajax
async function searchOrderTotal(pSearchCondition){
    var returnvalue;
    $.ajax({
        url: "/uGetSupplierOrderListAdm?"  + $.param({"authPage" : "cSupplierOrderListAdm.js", "searchCondition":pSearchCondition}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            if(response.errorcode == "PFERR_CONF_0000"){
                //성공 결과값
            };
            returnvalue = response;
        },
        error: function(xhr) {
            console.log("[error] : " + xhr);
            returnvalue = null;
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
    return returnvalue;
};

function excelDownload()
{
    var searchCondition ={
        date_start : $("input[name=search_order_date_start]").val(),
        date_end :  $("input[name=search_order_date_end]").val(),
        order_number : $("input[name=search_order_no]").val(),
        row_sequence : $("#search_supplier_ssn option:selected").val(),
        "tableGBN" : "excel",
    }
    var returnSetArray;
    $.ajax({
        url: "/uGetSupplierOrderListAdm?" + $.param({"authPage": "cSupplierOrderListAdm.js", "searchCondition": searchCondition}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false, traditional: true,
        contentType: "application/json; charset=utf-8",
        success: function(response){
            var returnSetArray = response.returnvalue;
            if(response.errorcode == "PFERR_CONF_0000"){
                var date_str = date_to_str(new Date());
                var fileName = "공급자결품률_" + date_str;
                exportExcel(returnSetArray, date_str, fileName);
            }
            else{
                //location.href = response.returnpage;
                alert(response.errormessage);
            };
        },
        error: function(xhr, textStatus, e) {
            console.log("[error]: " + textStatus);
            return null;
        },
        complete:function(data,textStatus) {
            console.log("[complete]: " + textStatus);
        }
    });
    return returnSetArray;
};


//end of source *********************************************************************************/
