/****************************************************************************************************
module명: cDeliveryReadyAdm.js
creator: 윤희상
date: 2022.03.31
version 1.0
설명: 관리자 페이지에서 배송준비중 화면용 js
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
        totInnerHTML+=`	<th>배송 준비중 건수</th> \n`;
        totInnerHTML+=`	<td><span class="comma">${(returnTotal[0].ORDER_CNT).toLocaleString('ko-KR')}</span> 건</td> \n`;
        totInnerHTML+=`	<th>배송 준비중 금액</th> \n`;
        totInnerHTML+=`	<td><span class="comma">${(returnTotal[0].VAT_ORDER_PRICE_SUM + returnTotal[0].NONVAT_ORDER_PRICE_SUM).toLocaleString('ko-KR')}</span> 원</td> \n`;
        totInnerHTML+=`	<th>배송 준비중 VAT 미포함</th> \n`;
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
            var Cell12 = newRow.insertCell(12);
            
            Cell1.className = "row";
            Cell2.className = "row";
            Cell3.className = "row";
            Cell4.className = "row";
            Cell5.className = "row";
            Cell9.className = "comma";
            Cell10.className = "comma";
            Cell11.className = "row";

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
            Cell10.innerHTML = (returnSetArray[tx].PAYMENT_POINT).toLocaleString('ko-KR');
            Cell11.innerHTML = `${returnSetArray[tx].BANK_NAME}<br>${returnSetArray[tx].PAYMENT_ACCOUNT}<br>(합계 : <b><span class="comma">${(returnSetArray[tx].PAYMENT_SUM).toLocaleString('ko-KR')}</span></b>)`;
            
            Cell12.innerHTML = returnSetArray[tx].STATUS;
        };
        $('#orderList tbody').mergeClassRowspan(1, 1);
        $('#orderList tbody').mergeClassRowspan(2, 1);
        $('#orderList tbody').mergeClassRowspan(3, 1);
        $('#orderList tbody').mergeClassRowspan(4, 1);
        $('#orderList tbody').mergeClassRowspan(5, 1);
        $('#orderList tbody').mergeClassRowspan(11, 1);
    }
    else if(preturnValue.errorcode == "PFERR_CONF_0050"){
        var totInnerHTML = "";
        document.getElementsByClassName("txt_total")[0].children[0].innerHTML = "0";
        gJSTotalData = 0;
        paging(gJSTotalData, pGetGlobalListCount, pGetCurrentPage);

        totInnerHTML+=`<tr> \n`;
        totInnerHTML+=`	<th>배송 준비중 건수</th> \n`;
        totInnerHTML+=`	<td><span class="comma">0</span> 건</td> \n`;
        totInnerHTML+=`	<th>배송 준비중 금액</th> \n`;
        totInnerHTML+=`	<td><span class="comma">0</span> 원</td> \n`;
        totInnerHTML+=`	<th>배송 준비중 VAT 미포함</th> \n`;
        totInnerHTML+=`	<td><span class="comma">0</span> 원</td> \n`;
        totInnerHTML+=`</tr> \n`;

        tot_tb.innerHTML = totInnerHTML;

        var newRow = tb.insertRow();
        newRow.innerHTML = `<td colspan="13" align="center" style="height:100px;">등록된 데이터가 없습니다</td>`;
    }
    else{
       
    };
};

function callLayerPopUpload(){
    var txt = "";
    txt += `<div class="layerPop" align="center" style="margin-top: 10px; display: block;"> \n`;
    txt += `<style type="text/css">.upFile { width:100%; }</style> \n`;
    txt += `<!-- 상품 정보 --> \n`;
    txt += `<form id="frmPop" name="frmPop" action="/admin/orderManagement/excelUpPop_process" method="post" accept-charset="utf-8" enctype="multipart/form-data"> \n`;
    txt += `<div class="popup pop800"> \n`;
    txt += `	<div class="pop_tit" style="position:relative;"> \n`;
    txt += `		배송정보 일괄 업로드 \n`;
    txt += `	</div> \n`;
    txt += `	 \n`;
    txt += `	<div class="pop_cont"> \n`;
    txt += `		<!-- Excel파일 업로드 --> \n`;
    txt += `		<div class="pop_s_tit mt00"> \n`;
    txt += `			<table class="table_row font11"> \n`;
    txt += `				<colgroup><col width="15%"><col width="*"></colgroup> \n`;
    txt += `				<tbody><tr> \n`;
    txt += `					<th><span>배송대기 리스트</span></th> \n`;
    txt += `					<td> \n`;
    txt += `						<button type="button" class="btn_ss01" onclick="orderListDeliveryToExcel();"><span class="btn_excel">배송대기 상품 리스트 </span></button>  <span class="font11">← 다운받아서 등록하세요</span>			 \n`;
    txt += `					</td> \n`;
    txt += `				</tr> \n`;
    txt += `				<tr> \n`;
    txt += `					<th><span>일괄 등록 파일 <span class="important">*</span></span></th> \n`;
    txt += `					<td> \n`;
    txt += `						<input type="file" name="excelFile" id="excelFile" class="upFile">					 \n`;
    txt += `					</td> \n`;
    txt += `				</tr> \n`;
    txt += `			</tbody></table> \n`;
    txt += `			<span class="font11" style="color:red;font-weight:thin;">* 임의적으로 만든 엑셀은 오류의 원인이 되며, "배송대기 상품 리스트 엑셀 파일"을 다운받은 뒤 편집하여 등록하셔야 합니다.</span> \n`;
    txt += `		</div> \n`;
    txt += `		 \n`;
    txt += `		<div class="table_btns text_c"> \n`;
    txt += `			<button type="button" class="btn01" onclick="javascript:removeLayerPop();"><span>취소</span></button> \n`;
    txt += `			<button type="button" class="btn01 btn_b" onclick="btnExcelUpSubmit();"><span>등록</span></button>  \n`;
    txt += `		</div>				 \n`;
    txt += `	</div>	 \n`;
    txt += `	 \n`;
    txt += `	<div class="pop_close"> \n`;
    txt += `		<a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n`;
    txt += `	</div> \n`;
    txt += `</div> \n`;
    txt += `</form></div> \n`;

    $(".layerPopArea").html(txt);
    $(".layerPopArea").css("display" ,"block");
};

//배송준비중 리스트 엑셀 다운로드
function orderListDeliveryToExcel(){
    eventSearchData("delivery_list_excel");
};

//등록하기 버튼
function btnExcelUpSubmit(){
    var input = document.getElementById("excelFile");
    var reader = new FileReader();
    var rows;
    reader.onload = function () {
        var data = reader.result;
        var workBook = XLSX.read(data, { type: 'binary' });
        if(workBook.SheetNames.length > 1){
            alert("파일의 형태가 잘못되었습니다.");
            return;
        };
        workBook.SheetNames.forEach(function (sheetName) {
            // console.log('SheetName: ' + sheetName);
            rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
        })
        if ($("#excelFile").val() != "" && $("#excelFile").val().indexOf(".xls") > 0)	{
            var tf;
            for(var rx=0; rx<rows.length; rx++){
                //rows로 데이터 정합성 확인한 후 정상이면 AJAX 호출하면 됨.
                if(rows[rx]["택배사"]==""||rows[rx]["송장번호"]==""){
                    tf = false
                    break;
                }
            }
            if(tf==false){
                alert("파일의 내용이 잘못되어있습니다.");
                return;
            }
            else{
                
                $("body").css("cursor" ,"wait");
                //정상임.
                console.log(rows);
                console.log("JSON.stringify(prows)", JSON.stringify(rows));
                formComplete(rows);
            }
        }
        else{
            alert("업로드할 엑셀파일을 등록하세요");
        }	
    }
    reader.readAsBinaryString(input.files[0]);
};

async function formComplete(prows){
    var editDataSetJson = new Object();
    editDataSetJson = {"editType" : "DELIVERY_DOING_EXCEL", "setConditionIndex" : JSON.stringify(prows)};
    var rtnValue = await callEditOrderAjaxCommon(editDataSetJson);
    
    if(rtnValue == "PFERR_CONF_0000"){
        // alert("정상적으로 수정되었습니다.");
        // reDrawData(1);
        
        alert("배송정보 일괄등록이 완료되었습니다.");
        location.reload();
    }
    
    $("body").css("cursor" ,"default");
};