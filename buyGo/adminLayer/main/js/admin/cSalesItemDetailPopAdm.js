/****************************************************************************************************
module명: cSalesItemListHtmlAdm.js
creator: 윤희상
date: 2022.03.09
version 1.0
설명: ADMIN 상품수정 html
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

async function drawSalesItemEditAdm(pLayerClassName, pSalesItemID){
    var rtn = await getSalesItemDetailInfo(pSalesItemID);

    console.log(rtn);
    if(rtn == null || rtn == ""){
        alert("재조회가 필요합니다.");
        return;
    };
    var attach = CryptoJS.MD5(new Date().toString());
    var txt = '';      
    txt += `<form id="frmEdit" name="frmEdit" action="/single/upload" method="post" enctype="multipart/form-data"> \n`;
    txt += `<input type="hidden" name="idx" value="${pSalesItemID}">  \n`;
    txt += `<input type="hidden" name="type" value="Edit">  \n`;
    txt += `<input type="hidden" name="old_file" value="${rtn[0].SALES_ITEM_IMAGE_FILE}">  \n`;
    txt += `<input type="hidden" name="old_file_ext" value="${rtn[0].SALES_ITEM_IMAGE_FILE_EXT}">  \n`;
    txt += `<input type="hidden" name="storagePath" value="eum/resources/temp/goods/"> \n`;
    txt += `<input type="hidden" name="attach_cd" value='${attach}'>  \n`;
    txt += `<div class="popup pop800">  \n`;
    txt += `<div class="pop_tit">   \n`;
    txt += `상품 정보   \n`;
    txt += `</div>  \n`;
    txt += `<div class="pop_cont">  \n`;
    txt += `<div class="text_r mb05">   \n`;
    txt += `time <span class="important">*</span> 필수입력  \n`;
    txt += `</div>  \n`;
    txt += `<!-- 기본정보 -->   \n`;
    txt += `<table class="table_row">   \n`;
    txt += `<colgroup>  \n`;
    txt += `<col width="15%">   \n`;
    txt += `<col width="35%">   \n`;
    txt += `<col width="16%">   \n`;
    txt += `<col width="34%">   \n`;
    txt += `</colgroup> \n`;
    txt += `<tbody><tr> \n`;
    txt += `<th><span>공급사 <span class="important">*</span></span></th>  \n`;
    txt += `<td>${rtn[0].NADLE_SUPPLIER_TRANSACTION_TYPE}</td>   \n`;
    txt += `<th><span>상품코드</span></th>  \n`;
    txt += `<td>${rtn[0].SALES_ITEM_GOODS_CODE}</td>   \n`;
    txt += `</tr> \n`;
    txt += `<tr>    \n`;
    txt += `<th><span>상품카테고리 <span class="important">*</span></span></th>   \n`;
    txt += `<td colspan="3">    \n`;
    txt += `<select name="cate1_idx" id="cate1_idx" style="width:100px;" value="">   \n`;
    txt += `</select>   \n`;
    txt += `<select name="cate2_idx" id="cate2_idx" style="width:100px;" value="">   \n`;
    txt += `</select>   \n`;
    txt += `<select name="cate3_idx" id="cate3_idx" style="width:100px;" value="">   \n`;
    txt += `</select>   \n`;
    txt += `</td> </tr>   \n`;
    txt += `<tr>    \n`;
    txt += `<th><span>상품명 <span class="important">*</span></span></th>  \n`;
    txt += `<td colspan="3"><input type="text" name="goods_name" maxlength="100" style="width:490px;" value="${rtn[0].SALES_ITEM_NAME}"> <input type="checkbox" name="shipping_free" value="Y"> <label for="" class="font11">무료배송 아이콘 표시</label></td>   \n`;
    txt += `</tr>   \n`;
    txt += `<tr>    \n`;
    txt += `<th><span>단가정보</span></th>  \n`;
    txt += `<td colspan="3">    \n`;
    txt += `<select name="unit_price_div" id="unit_price_div" style="width:100px;"> \n`;
    txt += `<option value="">선택</option>    \n`;
    txt += `<option value="개당">개당</option>  \n`;
    txt += `<option value="세트당">세트당</option>    \n`;
    txt += `<option value="번들당">번들당</option>    \n`;
    txt += `<option value="박스당">박스당</option>    \n`;
    txt += `</select>&nbsp; \n`;
    txt += `<input type="text" name="unit_price1" id="unit_price1" class="w84 text-right padding-right" maxlength="8" value="${rtn[0].NADLE_UNIT_PRICE1}" numberonly="">&nbsp;/    \n`;
    txt += `<input type="text" name="unit_price2" id="unit_price2" class="w84 text-right padding-right" maxlength="8" value="${rtn[0].NADLE_UNIT_PRICE2}" numberonly="">&nbsp;/    \n`;
    txt += `<input type="text" name="unit_price3" id="unit_price3" class="w84 text-right padding-right" maxlength="8" value="${rtn[0].NADLE_UNIT_PRICE3}" numberonly="">&nbsp;/    \n`;
    txt += `<input type="text" name="unit_price4" id="unit_price4" class="w84 text-right padding-right" maxlength="8" value="${rtn[0].NADLE_UNIT_PRICE4}" numberonly=""> 원 \n`;
    txt += `</td></tr>   \n`;
    txt += `<tr>    \n`;
    txt += `<th><span>바코드</span></th>   \n`;
    txt += `<td colspan="3">    \n`;
    txt += `박스<input type="text" name="goods_barcode" class="w100" maxlength="20" value="${rtn[0].GOODS_UNIT_BARCODE1}">&nbsp;/    \n`;
    txt += `미들<input type="text" name="goods_barcode2" class="w100" maxlength="20" value="${rtn[0].GOODS_UNIT_BARCODE2}">&nbsp;/   \n`;
    txt += `유닛<input type="text" name="goods_barcode3" class="w100" maxlength="20" value="${rtn[0].GOODS_UNIT_BARCODE3}">&nbsp;    \n`;
    txt += `*20자(공백포함)  \n`;
    txt += `</td></tr>   \n`;
    txt += `<tr>    \n`;
    txt += `<th><span>원산지</span></th>   \n`;
    txt += `<td>    \n`;
    txt += `<input type="text" name="goods_place" class="w100" maxlength="20" value="${rtn[0].NADLE_GOODS_ORIGIN_PLACE}"> <span class="font11">*20자(공백포함)</span>  \n`;
    txt += `</td>   \n`;
    txt += `<th><span>제조사</span></th>   \n`;
    txt += `<td>    \n`;
    txt += `<input type="text" name="goods_maker" class="w100" maxlength="20" value="${rtn[0].SALES_ITEM_REPR_BRAND_NAME}"> <span class="font11">*20자(공백포함)</span>  \n`;
    txt += `</td></tr>   \n`;
    txt += `<tr>    \n`;
    txt += `<th><span>정렬순서</span></th>  \n`;
    txt += `<td>    \n`;
    txt += `<input type="text" name="dis_sort" class="w100" maxlength="20" value="${rtn[0].SALES_ITEM_SORT}">   \n`;
    txt += `</td>   \n`;
    txt += `<th><span>출시일</span></th>   \n`;
    txt += `<td>    \n`;
    txt += `<input type="text" name="goods_date" class="w100" maxlength="8" value="${rtn[0].GOODS_LAUNCH_DATE}"> <span class="font11">*ex)20150720</span>  \n`;
    txt += `</td></tr>   \n`;
    txt += `<tr>    \n`;
    txt += `<th><span>상품상태 <span class="important">*</span></span></th> \n`;
    txt += `<td class="checks"> \n`;
    txt += `<input type="radio" id="radio01_1" name="sales_chilled" value="0" val="${rtn[0].SALES_ITEM_REPR_STOCK_MGR_TYPE}"> <label for="radio01_1">상온</label>    \n`;
    txt += `<input type="radio" id="radio01_2" name="sales_chilled" value="1" val="${rtn[0].SALES_ITEM_REPR_STOCK_MGR_TYPE}"> <label for="radio01_2">냉장</label>    \n`;
    txt += `<input type="radio" id="radio01_3" name="sales_chilled" value="2" val="${rtn[0].SALES_ITEM_REPR_STOCK_MGR_TYPE}"> <label for="radio01_3">냉동</label>    \n`;
    txt += `</td>   \n`;
    txt += `<th><span>판매상태 <span class="important">*</span></span></th> \n`;
    txt += `<td class="checks"> \n`;
    
    if($("input[name=type]").val() == "SUPER"){
        txt += `<input type="hidden" id="sales_gb" name="sales_gb" value="${rtn[0].SALES_ITEM_PROGRESS_CODE}"> \n`;
        if(rtn[0].SALES_ITEM_PROGRESS_CODE == "1") txt += `   판매중 \n`;
        else if (rtn[0].SALES_ITEM_PROGRESS_CODE == "2") txt += `   판매중지 \n`;
        else if (rtn[0].SALES_ITEM_PROGRESS_CODE == "0") txt += `   품절 \n`;
    }
    else {
        txt += `<input type="radio" id="radio02_1" name="sales_gb" value="1" val="${rtn[0].SALES_ITEM_PROGRESS_CODE}"> <label for="radio02_1">판매중</label>    \n`;
        txt += `<input type="radio" id="radio02_2" name="sales_gb" value="2" val="${rtn[0].SALES_ITEM_PROGRESS_CODE}"> <label for="radio02_2">판매중지</label>   \n`;
        txt += `<input type="radio" id="radio02_3" name="sales_gb" value="0" val="${rtn[0].SALES_ITEM_PROGRESS_CODE}"> <label for="radio02_3">품절</label> \n`;
    };

    txt += `</td></tr>   \n`;
    txt += `<tr>    \n`;
    txt += `<th><span>판매기간</span></th>  \n`;
    txt += `<td>    \n`;
    txt += `<input type="text" name="sales_start" class="w84 datepicker2" maxlength="10" value="${rtn[0].SALES_ITEM_SALE_START_DATETIME}" id="dp1646823323974"> ~  \n`;
    txt += `<input type="text" name="sales_end" class="w84 datepicker2" maxlength="10" value="${rtn[0].SALES_ITEM_SALE_END_DATETIME}" id="dp1646823323975">   \n`;
    txt += `</td>   \n`;
    txt += `<th><span>유통기한</span></th>  \n`;
    txt += `<td>    \n`;
    txt += `<input type="text" name="expiration_date" class="w250" maxlength="25" value=""> \n`;
    txt += `</td>   \n`;
    txt += `</tr>   \n`;
    txt += `</tbody></table> \n`;
    txt += `<!-- //기본정보 --> \n`;
    txt += `<!-- 가격 정보 -->  \n`;
    txt += `<div class="pop_s_tit"> \n`;
    txt += `가격 정보   \n`;
    txt += `</div>  \n`;
    txt += `<table class="table_row">   \n`;
    txt += `<colgroup><col width="15%"><col width="*"></colgroup>   \n`;
    txt += `<tbody><tr> \n`;
    txt += `<th><span>낱개판매가/<br>마진율  <span class="important">*</span></span></th>   \n`;
    txt += `<td>    \n`;
    txt += `<p>고객 낱개 구입가격 입니다.(부가세 포함가격으로 10원 단위까지 입력 가능)</p>   \n`;
    txt += `<p class="mt10">    \n`;
    txt += `<strong>공급원가(VAT포함)</strong>    \n`;
    txt += `<input type="text" name="sell_cost" id="sell_cost" class="w84 text-right padding-right" maxlength="8" value="${rtn[0].SALES_TOTAL_PURCHASE_COST}" numberonly=""> 원  &nbsp;    \n`;
    txt += `<strong>낱개판매가(VAT포함)</strong>   \n`;
    txt += `<input type="text" name="sell_price" id="sell_price" class="w84 text-right padding-right" maxlength="8" value="${rtn[0].SALES_ITEM_PRICE}" numberonly=""> 원 &nbsp; &nbsp;    \n`;
    txt += `<strong>마진율</strong>    \n`;
    txt += `<input type="text" name="sell_margin" id="sell_margin" class="w84 text-right padding-right" maxlength="3" value="${rtn[0].SALES_ITEM_MARGIN_RATE}" readonly="readonly" style="background-color:#FEFDE0;"> % \n`;
    txt += `</p></td></tr>   \n`;
    txt += `<tr>    \n`;
    txt += `<th><span>과세/면세 구분  <span class="important">*</span></span></th>    \n`;
    txt += `<td colspan="3" class="checks"> \n`;
    txt += `<input type="radio" id="radio02_1" name="tax_gb" value="0" val="${rtn[0].SALES_ITEM_REPR_TAX_YN}"> <label for="radio02_1">과세</label>   \n`;
    txt += `<input type="radio" id="radio02_2" name="tax_gb" value="1" val="${rtn[0].SALES_ITEM_REPR_TAX_YN}"> <label for="radio02_2">면세</label>   \n`;
    txt += `</td>   \n`;
    txt += `</tr>   \n`;
    txt += `</tbody></table>    \n`;
    txt += `<!-- //가격 정보 -->    \n`;
    txt += `    \n`;
    txt += `<!-- 재고 정보 -->  \n`;
    txt += `<div class="pop_s_tit"> \n`;
    txt += `재고 정보   \n`;
    txt += `</div>  \n`;
    txt += `<table class="table_row">   \n`;
    txt += `<colgroup><col width="15%"><col width="*"></colgroup>   \n`;
    txt += `<tbody><tr> \n`;
    txt += `<th><span>재고량  <span class="important">*</span></span></th> \n`;
    txt += `<td>    \n`;
    txt += `<input type="text" name="stock_piece" class="w100 text-right padding-right" maxlength="8" value="${rtn[0].SALES_ITEM_STOCK_QTY}"> * 총 낱개 재고량    \n`;
    txt += `</td></tr>   \n`;
    txt += `<tr>    \n`;
    txt += `<th><span>최대/최소수량 <span class="important">*</span></span></th>  \n`;
    txt += `<td>    \n`;
    txt += `최소 <input type="text" name="sell_min" class="w84 text-right padding-right" value="${rtn[0].SALES_ITEM_PURCHASE_MIN_QTY}"> * 0이면 제한없음. &nbsp; &nbsp; \n`;
    txt += `최대 <input type="text" name="sell_max" class="w84 text-right padding-right" value="${rtn[0].SALES_ITEM_PURCHASE_MAX_QTY}"> * 0이면 제한없음.   \n`;
    txt += `</td>   \n`;
    txt += `</tr>   \n`;
    txt += `</tbody></table>    \n`;
    txt += `<!-- //재고 정보 -->    \n`;
    txt += `<!-- 입수량 정보 --> \n`;
    txt += `<div class="pop_s_tit"> \n`;
    txt += `입수량 정보  \n`;
    txt += `</div>  \n`;
    txt += `<table class="table_row">   \n`;
    txt += `<colgroup><col width="15%"><col width="35%"><col width="15%"><col width="*"></colgroup> \n`;
    txt += `<tbody><tr> \n`;
    txt += `<th><span>낱개입수량  <span class="important">*</span></span></th>   \n`;
    txt += `<td>    \n`;
    if(rtn[0].SALES_PIECE_UNIT == "" || rtn[0].SALES_PIECE_UNIT == undefined){
        txt += `<input type="text" name="piece_unit" id="piece_unit" class="w100 text-right padding-right" maxlength="8" value="" numberonly="" disabled="disabled">    \n`;
        txt += `<input type="checkbox" name="piece_unit_none" id="piece_unit_none" value="Y" checked="checked"> <label for="piece_unit_none" class="font11">없음</label>  \n`;
    }
    else {
        txt += `<input type="text" name="piece_unit" id="piece_unit" class="w100 text-right padding-right" maxlength="8" value="${rtn[0].SALES_PIECE_UNIT}" numberonly=""> \n`;
        txt += `<input type="checkbox" name="piece_unit_none" id="piece_unit_none" value="Y"> <label for="piece_unit_none" class="font11">없음</label>   \n`;
    }
    txt += `</td>   \n`;
    txt += `<th><span>볼 입수량  <span class="important">*</span></span></th>   \n`;
    txt += `<td>    \n`;
    if(rtn[0].SALES_PIECE_BUNDLE == "" || rtn[0].SALES_PIECE_BUNDLE == undefined){
        txt += `<input type="text" name="piece_bundle" id="piece_bundle" class="w100 text-right padding-right" maxlength="8" value="" numberonly="" disabled="disabled">    \n`;
        txt += `<input type="checkbox" name="piece_bundle_none" id="piece_bundle_none" value="Y" checked="checked"> <label for="piece_bundle_none" class="font11">없음</label>    \n`;
    }
    else {
        txt += `<input type="text" name="piece_bundle" id="piece_bundle" class="w100 text-right padding-right" maxlength="8" value="${rtn[0].SALES_PIECE_BUNDLE}" numberonly="">    \n`;
        txt += `<input type="checkbox" name="piece_bundle_none" id="piece_bundle_none" value="Y"> <label for="piece_bundle_none" class="font11">없음</label>    \n`;
    }
    txt += `</td>   \n`;
    txt += `</tr>   \n`;
    txt += `<tr>    \n`;
    txt += `<th><span>박스 입수량 <span class="important">*</span></span></th>   \n`;
    txt += `<td colspan="3">    \n`;
    if(rtn[0].SALES_PIECE_BOX == "" || rtn[0].SALES_PIECE_BOX == undefined){
        txt += `<input type="text" name="piece_box" id="piece_box" class="w100 text-right padding-right" maxlength="8" value="" numberonly="" disabled="disabled"> \n`;
        txt += `<input type="checkbox" name="piece_box_none" id="piece_box_none" value="Y" checked="checked"> <label for="piece_box_none" class="font11">없음</label>   \n`;
    }
    else {
        txt += `<input type="text" name="piece_box" id="piece_box" class="w100 text-right padding-right" maxlength="8" value="${rtn[0].SALES_PIECE_BOX}" numberonly=""> \n`;
        txt += `<input type="checkbox" name="piece_box_none" id="piece_box_none" value="Y"> <label for="piece_box_none" class="font11">없음</label>   \n`;
    }
    txt += `</td>   \n`;
    txt += `</tr>   \n`;
    txt += `</tbody></table>    \n`;
    txt += `<!-- //입수량 정보 -->   \n`;
    txt += `<!-- 행사제품 등록 -->    \n`;
    txt += `<div class="pop_s_tit"> \n`;
    txt += `행사제품 등록 \n`;
    txt += `</div>  \n`;
    txt += `<table class="table_row">   \n`;
    txt += `<colgroup><col width="15%"><col width="*"></colgroup>   \n`;
    txt += `<tbody><tr> \n`;
    txt += `<th><span>행사진행 여부  <span class="important">*</span></span></th> \n`;
    txt += `<td class="checks"> \n`;
    txt += `<input type="radio" id="radio04_1" name="fate_yn" value="XX" val="${rtn[0].SALES_ITEM_SALE_TYPE}"> <label for="radio04_1">미진행</label> \n`;
    txt += `<input type="radio" id="radio04_2" name="fate_yn" value="WW" val="${rtn[0].SALES_ITEM_SALE_TYPE}"> <label for="radio04_2">주간행사</label>    \n`;
    txt += `<input type="radio" id="radio04_3" name="fate_yn" value="CC" val="${rtn[0].SALES_ITEM_SALE_TYPE}"> <label for="radio04_3">카테고리 행사</label> \n`;
    txt += `<input type="radio" id="radio04_4" name="fate_yn" value="SS" val="${rtn[0].SALES_ITEM_SALE_TYPE}"> <label for="radio04_4">특가</label> \n`;
    txt += `</td>   \n`;
    txt += `</tr>   \n`;
    txt += `<tr>    \n`;
    txt += `<th><span>행사기간 <span class="important">*</span></span></th> \n`;
    txt += `<td>    \n`;
    txt += `<input type="text" name="fate_start" class="w100 datepicker2" maxlength="8" value="${rtn[0].FATE_START_DATETIME}" numberonly="" id="dp1646823323976"> ~   \n`;
    txt += `<input type="text" name="fate_end" class="w100 datepicker2" maxlength="8" value="${rtn[0].FATE_END_DATETIME}" numberonly="" id="dp1646823323977">   \n`;
    txt += `</td>   \n`;
    txt += `</tr>   \n`;
    txt += `<tr>    \n`;
    txt += `<th><span>행사금액 <span class="important">*</span></span></th> \n`;
    txt += `<td>    \n`;
    txt += `<strong>행사판매가(VAT포함)</strong>   \n`;
    txt += `<input type="text" name="fate_price" id="fate_price" class="w84 text-right padding-right" maxlength="8" value="${rtn[0].NADLE_FATE_PRICE}" numberonly=""> 원 &nbsp; &nbsp;    \n`;
    txt += `<strong>할인율</strong>    \n`;
    txt += `<input type="text" name="fate_disrate" id="fate_disrate" class="w84 text-right padding-right" maxlength="3" value="${rtn[0].NADLE_FATE_DISRATE}" readonly="readonly" style="background-color:#FEFDE0;"> %  \n`;
    txt += `</td>   \n`;
    txt += `</tr> \n`;
    txt += `<tr>    \n`;
    txt += `<th><span>행사기간 최소/<br>최대수량 <span class="important">*</span></span></th> \n`;
    txt += `<td>    \n`;
    txt += `최소 <input type="text" name="fate_sales_min" class="w84 text-right padding-right" maxlength="5" numberonly="" value="${rtn[0].FATE_PURCHASE_MIN_QTY}"> * 필수 &nbsp; &nbsp;  \n`;
    txt += `최대 <input type="text" name="fate_sales_max" class="w84 text-right padding-right" maxlength="5" numberonly="" value="${rtn[0].FATE_PURCHASE_MAX_QTY}"> * 필수    \n`;
    txt += `</td></tr>   \n`;
    txt += `</tbody></table>    \n`;
    txt += `<!-- //행사제품 등록 -->  \n`;
    txt += `<!-- 상품이미지 -->  \n`;
    txt += `<div class="pop_s_tit"> \n`;
    txt += `상품 이미지  \n`;
    txt += `</div>  \n`;
    txt += `<table class="table_row">   \n`;
    txt += `<colgroup><col width="15%"><col width="*"></colgroup>   \n`;
    txt += `<tbody><tr> \n`;
    txt += `<th><span>상품 이미지 </span></th>   \n`;
    txt += `<td>    \n`;
    txt += `<input type="file" id="origin_file" name="ORIGIN" class="imgFile" accept='image/*'> \n`;
    txt += `<input type="hidden" name="key" value="${attach}"> \n`;
    txt += `<input type="hidden" name="code" value="ORIGIN"> \n`;
    txt += `    <span class="filename">( ${rtn[0].FILE_NAME} )</span> \n`;
    txt += `<p>사이즈 : 600 * 600 / 파일 : jpg, gif / 용량 : 최대 10MB</p>   \n`;
    txt += `</td>   \n`;
    txt += `</tr>   \n`;
    txt += `</tbody></table>    \n`;
    txt += `<!-- //상품이미지 -->    \n`;
    txt += `<!-- 참고사항 -->   \n`;
    txt += `<div class="pop_s_tit"> \n`;
    txt += `참고사항    \n`;
    txt += `</div> \n`;
    txt += `<table class="table_row">   \n`;
    txt += `<colgroup><col width="15%"><col width="*"></colgroup>   \n`;
    txt += `<tbody><tr> \n`;
    txt += `<th><span>참고사항</span></th>  \n`;
    txt += `<td>    \n`;
    if(rtn[0].SALES_ITEM_NOTES == "" || rtn[0].SALES_ITEM_NOTES == undefined){
        txt += `<textarea name="goods_summary" style="width:100%; height:100px;" placeholder="제품에 대한 간략한 설명을 입력하세요"></textarea> \n`;
    }
    else {
        txt += `<textarea name="goods_summary" style="width:100%; height:100px;" val="${rtn[0].SALES_ITEM_NOTES}">${rtn[0].SALES_ITEM_NOTES}</textarea> \n`;
    }
    txt += `</td>   \n`;
    txt += `</tr> \n`;
    txt += `</tbody></table>    \n`;
    txt += `<!-- 참고사항 -->   \n`;
    txt += `<!-- 상품상세정보 --> \n`;
    txt += `<div class="pop_s_tit"> \n`;
    txt += `상품상세정보  \n`;
    txt += `</div>  \n`;
    txt += `    <textarea name="editor_textarea" id="editor_textarea">${rtn[0].SALES_ITEM_DETAIL_INFO}</textarea> \n`;
    txt += `<!-- //상품상세정보 -->   \n`;
    txt += `    \n`;
    txt += `<!-- 승인상태 -->   \n`;
    txt += `<div class="pop_s_tit"> \n`;
    txt += `승인상태    \n`;
    txt += `</div>  \n`;
    txt += `<table class="table_row">   \n`;
    txt += `<colgroup><col width="15%"><col width="*"></colgroup>   \n`;
    txt += `<tbody><tr> \n`;
    txt += `<th><span>승인상태  <span class="important">*</span></span></th>    \n`;
    txt += `<td class="checks"> \n`;

    if($("input[name=type]").val() == "SUPER"){
        txt += `<input type="hidden" id="appr_gb" name="appr_gb" value="${rtn[0].SALES_ITEM_APPROVE_CODE}"> \n`;
        if(rtn[0].SALES_ITEM_APPROVE_CODE == "0") txt += `   승인대기 \n`;
        else if (rtn[0].SALES_ITEM_APPROVE_CODE == "1") txt += `   승인 \n`;
    }
    else{
        txt += `<input type="radio" id="radio05_1" name="appr_gb" value="0" val="${rtn[0].SALES_ITEM_APPROVE_CODE}"> <label for="radio05_1">승인대기</label>    \n`;
        txt += `<input type="radio" id="radio05_2" name="appr_gb" value="1" val="${rtn[0].SALES_ITEM_APPROVE_CODE}"> <label for="radio05_2">승인</label>  \n`;
    };

    txt += `</td>   \n`;
    txt += `</tr>   \n`;
    txt += `</tbody></table>    \n`;
    txt += `<!-- //승인상태 --> \n`;
    txt += `<div class="table_btns text_c"> \n`;
    txt += `<button type="button" class="btn01" onclick="javascript:removeLayerPop();"><span>취소</span></button> \n`;
    if($("input[name=type]").val() != "SUPER"){
        txt += `<button type="button" class="btn01 btn_b" onclick="btnSubmit(${pSalesItemID});"><span>수정</span></button>   \n`;
        txt += `<button type="button" class="btn01" onclick="removeGoods('${pSalesItemID}');"><span>삭제</span></button>    \n`;
    };
    txt += `</div>  \n`;
    txt += `</div>  \n`;
    txt += `<div class="pop_close"> \n`;
    txt += `<a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n`;
    txt += `</div>  \n`;
    txt += `</div>  \n`;
    txt += `</form> \n`;
    txt += `<!-- //상품 정보 -->    \n`;

    $(`.${pLayerClassName}`).html(txt);
    
    CKEDITOR.replace("editor_textarea");
    CKEDITOR.instances.editor_textarea.setData(rtn[0].SALES_ITEM_DETAIL_INFO);

    $("input[name=ORIGIN]").change(function(){
        var file = document.getElementById('origin_file');
        // 업로드 파일 읽기
        if(!file.files[0]){
            return;
        }

        if(file.files[0].size > (1024*1024*10)){
            alert("사이즈가 너무 큽니다.");
        };
        
        //크기 제한 해제
        // var reader = new FileReader(); 
        // reader.readAsDataURL(file.files[0]);
        // reader.onload = function(){ 
        //     var image = new Image();
        //     image.src = reader.result;
        //     image.onload=function(){
        //         if(this.width > 600 || this.height > 600){
        //             alert("사이즈가 너무 큽니다.");
        //             file.value = "";
        //         };
        //     };
        // };    
    });

    //초기 카테고리 조회
    searchCategory(0, "", "cate1_idx"); //LV0 카테고리 조회
    searchCategory(1, $("#cate1_idx option:selected").val(), "cate2_idx"); //LV1 카테고리 조회
    searchCategory(2, $("#search_cate2_idx option:selected").val(), "cate3_idx"); //LV2 카테고리 조회

    //LV0 카테고리가 바꼈을 때
    $("#cate1_idx").change(function(){
        searchCategory(1, $(this).val(), "cate2_idx"); //LV1 카테고리 조회
        searchCategory(2, $("#cate2_idx option:selected").val(), "cate3_idx"); //LV2 카테고리 조회
    });

    //LV1 카테고리가 바꼈을 때
    $("#cate2_idx").change(function(){
        searchCategory(2, $(this).val(), "cate3_idx"); //LV2 카테고리 조회
    });
    
    if(rtn[0].MENU_LEVEL == "0"){
        $("#cate1_idx").val(rtn[0].MENU_LEVEL_ID).prop("selectd", true);
    }
    else if(rtn[0].MENU_LEVEL == "1"){
        $("#cate1_idx").val(rtn[0].MENU_LEVEL_P_ID).prop("selectd", true);
        $("#cate2_idx").val(rtn[0].MENU_LEVEL_ID).prop("selectd", true);
    }
    else if(rtn[0].MENU_LEVEL == "2"){
        $("#cate1_idx").val(rtn[0].MENU_LEVEL_PP_ID).prop("selectd", true);
        $("#cate2_idx").val(rtn[0].MENU_LEVEL_P_ID).prop("selectd", true);
        $("#cate3_idx").val(rtn[0].MENU_LEVEL_ID).prop("selectd", true);
    };

    $("select[name=unit_price_div]").val(rtn[0].NADLE_UNIT_PRICE_DIV).prop("selectd", true);

    $(`input:radio[name="sales_chilled"][value="${rtn[0].SALES_ITEM_REPR_STOCK_MGR_TYPE}"]`).prop('checked', true);
    if($("input[name=type]").val() != "SUPER") $(`input:radio[name="sales_gb"][value="${rtn[0].SALES_ITEM_PROGRESS_CODE}"]`).prop('checked', true);
    $(`input:radio[name="tax_gb"][value="${rtn[0].SALES_ITEM_REPR_TAX_YN}"]`).prop('checked', true);
    $(`input:radio[name="fate_yn"][value="${rtn[0].SALES_ITEM_SALE_TYPE}"]`).prop('checked', true);
    if($("input[name=type]").val() != "SUPER") $(`input:radio[name="appr_gb"][value="${rtn[0].SALES_ITEM_APPROVE_CODE}"]`).prop('checked', true);

    if(rtn[0].FREE_SHIPPING_YN == "Y"){
        $("input[name=shipping_free]").prop("checked", true);
    };

    $.datepicker.setDefaults({
        dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'], 
        monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
        monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        yearSuffix: '년',
        dateFormat: 'yy-mm-dd',
        showOn: "both",
        buttonImage : "/eum/resources/images/common/calendar.png",
        buttonImageOnly: true,
        showMonthAfterYear:true,
        constrainInput: true, 
        changeMonth: true,
        changeYear: true    
    });

    $('input[name="sales_start"]').datepicker();
    $('input[name="sales_end"]').datepicker();
    $('input[name="fate_start"]').datepicker();
    $('input[name="fate_end"]').datepicker();

    $("#piece_unit_none").change(function(){
        if($(this).is(":checked"))$("#piece_unit").val("");
        else $("#piece_unit").prop("disabled", false);
    });
    $("#piece_bundle_none").change(function(){
        if($(this).is(":checked"))$("#piece_bundle").val("");
        else $("#piece_bundle").prop("disabled", false);
    });
    $("#piece_box_none").change(function(){
        if($(this).is(":checked"))$("#piece_box").val("");
        else $("#piece_box").prop("disabled", false);
    });

    $(".text-right").keyup(function(){
        var inputVal = $(this).val();
        $(this).val(inputVal.replace(/[^0-9]/gi, ""));
    });

    $("#sell_cost").keyup(function(){
        var inputVal = $(this).val();
        var margin = Math.round((($("#sell_price").val() - inputVal)/$("#sell_price").val()) * 10000)/100;
        $("#sell_margin").val(margin);
    });

    $("#sell_price").keyup(function(){
        var inputVal = $(this).val();
        var margin = Math.round(((inputVal - $("#sell_cost").val())/inputVal) * 10000)/100;
        $("#sell_margin").val(margin);

        var fate_margin = Math.round(((inputVal - $("#fate_price").val())/inputVal) * 10000)/100;
        $("#fate_disrate").val(fate_margin)
    });

    $("#fate_price").keyup(function(){
        var inputVal = $(this).val();
        var margin = Math.round((($("#sell_price").val() - inputVal)/$("#sell_price").val()) * 10000)/100;
        $("#fate_disrate").val(margin);
    });

    $(".layerPopArea").css("display" ,"block");
};

async function getSalesItemDetailInfo(pSalesItemID){
    var rtnvalue;
    await $.ajax({
        url: "/uGetSalesItemDetailInfo?"  + $.param({"authPage" : "cGoodsCategoryAdm.js", "salesItemID" : pSalesItemID}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            if(response.errorcode == "PFERR_CONF_0000"){
                rtnvalue = response.returnvalue;
            }
            else if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            };
        },
        error: function(qXHR, textStatus, errorThrown) {
			alert("[err messager]:" + textStatus);
            rtnvalue = null;
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });

    return rtnvalue;
};

function removeGoods(pSalesItemID){
    $.ajax({
        url: "/uDelSalesItem?"  + $.param({"authPage" : "cGoodsCategoryAdm.js", "editDataJson" : {"editType" : "Delete", "salesItemID" : pSalesItemID}}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            if(response.errorcode == "PFERR_CONF_0000"){
                alert("정상적으로 삭제되었습니다.");
                location.reload();
            }
            else if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            };
        },
        error: function(qXHR, textStatus, errorThrown) {
			alert("[err messager]:" + textStatus);
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
};

function btnSubmit(pSalesItemID){
    //상품카테고리가 전부 설정되어있는지 확인
    if($("#cate1_idx").val() == "9"){
        if($("#cate2_idx").val() == "" || $("#cate3_idx").val() == ""){
            alert("카테고리 선택!");
            return;
        };
    }
    else if($("#cate1_idx").val() == "" || $("#cate2_idx").val() == ""){
        alert("카테고리 선택!");
        return;
    };

    //상품명 입력되어있는지 확인
    if($("input[name=goods_name]").val().length < 1){
        alert("상품명 입력 확인!");
        return;
    };

    //상품상태확인
    if($("input[name=sales_chilled]:checked").val() == ""){
        alert("상품상태선택!");
        return;
    };

    //공급원가, 낱개판매가 입력확인
    if($("#sell_cost").val() < 0 || $("#sell_cost").val() == undefined 
    || $("#sell_price").val() <= 0 || $("#sell_price").val() == undefined){
        alert("공급원가, 낱개판매가 입력확인!");
        return;
    };

    if(Number($("#sell_price").val()) < Number($("#sell_cost").val())){
        alert("판매가가 공급원가보다 낮을 수 없습니다!");
        return;
    };

    //과세 면세 확인
    if($("input[name=tax_gb]:checked").val() == ""){
        alert("상품상태선택!");
        return;
    };

    //재고량 입력확인
    if($("input[name=stock_piece]").val() < 0 || $("input[name=stock_piece]").val() == ""){
        alert("재고량!");
        return;
    };

    //최대/최소수량 확인
    if($("input[name=sell_min]").val() < 0 || $("input[name=sell_max]").val() < 0
    || $("input[name=sell_min]").val() == "" || $("input[name=sell_max]").val() == ""){
        alert("최대/최소수량!");
        return;
    };

    if(Number($("input[name=sell_max]").val()) < Number($("input[name=sell_min]").val())){
        alert("최소 수량이 최대 수량보다 클 수 없습니다.");
        return;
    };

    //낱개입수량
    if(!$("#piece_unit_none").prop("checked")){
        if($("#piece_unit").val() < 0 || $("#piece_unit").val() == ""){
            alert("낱개입수량!");
            return;
        };
    };

    //볼입수량
    if(!$("#piece_bundle_none").prop("checked")){
        if($("#piece_bundle").val() < 0 || $("#piece_bundle").val() == ""){
            alert("박스입수량!");
            return;
        };
    };
 
    
    //박스입수량
    if(!$("#piece_box_none").prop("checked")){
        if($("#piece_box").val() < 0 || $("#piece_box").val() == ""){
            alert("박스입수량!");
            return;
        };
    };

    //행사진행여부 확인
    if($("input[name=fate_yn]:checked").val() == ""){
        alert("행사진행여부!");
        return;
    };

    //여부에따라 기간 및 금액 최소 최대 수량 확인
    if($("input[name=fate_yn]:checked").val() != "XX"){
        //기간확인
        if($("input[name=fate_start]").val() == "" || $("input[name=fate_end]").val() == ""){
            alert("기간확인");
            return;
        };

        if($("input[name=fate_start]").val() > $("input[name=fate_end]").val()){
            alert("기간확인");
            return;
        };

        //금액확인
        if($("#fate_price").val() <= 0 || $("#fate_price").val() == ""){
            alert("금액확인");
            return;
        };

        if(Number($("#sell_price").val()) < Number($("#fate_price").val())){
            alert("할인판매가가 낱개판매가보다 높을 수 없습니다!");
            return;
        };

        //최소최대확인
        if($("input[name=fate_sales_min]").val() <= 0 || $("input[name=fate_sales_min]").val() == ""
         ||$("input[name=fate_sales_max]").val() <= 0 || $("input[name=fate_sales_max]").val() == ""){
            alert("최소최대확인");
            return;
        };

        if(Number($("input[name=fate_sales_max]").val()) < Number($("input[name=fate_sales_min]").val())){
            alert("최소 수량이 최대 수량보다 클 수 없습니다.");
            return;
        };
    };

    var editItemCondition = {};
    editItemCondition = {
        "editType" : "Edit",
        "supplier_ssn" : $("#supplier_ssn").val(),
        "cate1_idx" : $("#cate1_idx").val(),
        "cate2_idx" : $("#cate2_idx").val(),
        "cate3_idx" : $("#cate3_idx").val(),
        "goods_name" : $("input[name=goods_name]").val(),
        "shipping_free" : $("input[name=shipping_free]:checked").val(),
        "unit_price_div" : $("#unit_price_div").val(),
        "unit_price1" : $("#unit_price1").val(),
        "unit_price2" : $("#unit_price2").val(),
        "unit_price3" : $("#unit_price3").val(),
        "unit_price4" : $("#unit_price4").val(),
        "goods_barcode" : $("input[name=goods_barcode]").val(),
        "goods_barcode2" : $("input[name=goods_barcode2]").val(),
        "goods_barcode3" : $("input[name=goods_barcode3]").val(),
        "goods_place" : $("input[name=goods_place]").val(),
        "goods_maker" : $("input[name=goods_maker]").val(),
        "dis_sort" : $("input[name=dis_sort]").val(),
        "sales_chilled" : $("input[name=sales_chilled]:checked").val(),
        "goods_date" : $("input[name=goods_date]").val(),
        "sales_start" : $("input[name=sales_start]").val(),
        "sales_end" : $("input[name=sales_end]").val(),
        "expiration_date" : $("input[name=expiration_date]").val(),
        "sell_cost" : $("input[name=sell_cost]").val(),
        "sell_price" : $("input[name=sell_price]").val(),
        "sell_margin" : $("input[name=sell_margin]").val(),
        "tax_gb" : $("input[name=tax_gb]:checked").val(),
        "stock_piece" : $("input[name=stock_piece]").val(),
        "sell_min" : $("input[name=sell_min]").val(),
        "sell_max" : $("input[name=sell_max]").val(),
        "piece_unit" : $("input[name=piece_unit]").val(),
        "piece_bundle" : $("input[name=piece_bundle]").val(),
        "piece_box" : $("input[name=piece_box]").val(),
        "fate_yn" : $("input[name=fate_yn]:checked").val(),
        "fate_start" : $("input[name=fate_start]").val(),
        "fate_end" : $("input[name=fate_end]").val(),
        "fate_price" : $("input[name=fate_price]").val(),
        "fate_disrate" : $("input[name=fate_disrate]").val(),
        "fate_sales_min" : $("input[name=fate_sales_min]").val(),
        "fate_sales_max" : $("input[name=fate_sales_max]").val(),
        "goods_summary" : $("textarea[name=goods_summary]").val(),
        "goods_detail_info" : CKEDITOR.instances.editor_textarea.getData(),
        "sales_gb" : $("input[name=sales_gb]:checked").val(),
        "appr_gb" : $("input[name=appr_gb]:checked").val(),
        "sales_item_id" : pSalesItemID
    };

    if($("#origin_file").val().length > 0){
        var img = $("#origin_file")[0].files[0].name.split(".");
        editItemCondition.attach_cd = $("input[name=attach_cd]").val();
        editItemCondition.ext = img[img.length-1];
    };
    console.log("editItemCondition", editItemCondition);

    $.ajax({
        url: "/uEditSalesItem?" + $.param({"editDataJson" : editItemCondition}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            console.log("success", response);
            if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
                return;
            }
            else if(response.errorcode == "PFERR_CONF_0000"){
                if($("#origin_file").val().length > 0){
                    var imageUpload = $("#frmEdit").submit();
                    console.log("imageUpload", imageUpload);
                }
                else {
                    alert("수정이 정상적으로 완료되었습니다.");
                    console.log($("#pagingDiv a.on").text());
                    reDrawData($("#pagingDiv a.on").text());
                    removeLayerPop();
                }
            }
        },
        error: function(qXHR, textStatus, errorThrown) {
			alert("[err messager]:" + textStatus);
            return null;
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
};