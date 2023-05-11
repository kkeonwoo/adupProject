/****************************************************************************************************
module명: cTotalOrderListAdm.js
creator: 윤희상
date: 2022.03.24
version 1.0
설명: 관리자 페이지에서 전체주문조회 화면용 js
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

/*******주문관리 공통 Start*******/
$(document).ready(function(){
    $("body").css("cursor" ,"wait");
    getMenuListAjax($("#layoutGB").val() + ".html");
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

    $('input[name="search_order_date_start"]').datepicker();
    $('input[name="search_order_date_end"]').datepicker();

    if($("#layoutGB").val() == "settlementManagementAdm" || $("#layoutGB").val() == "settlementManagementSuper"){
        $('input[name="search_order_date_start"]').datepicker("setDate", "today");
        $('input[name="search_order_date_end"]').datepicker("setDate", "today");
    }
    else if($("#layoutGB").val() == "paymentCompleteSuper"){
        $('input[name="search_order_date_start"]').datepicker("setDate", "");
        $('input[name="search_order_date_end"]').datepicker("setDate", "");
    }
    else{
        $('input[name="search_order_date_start"]').datepicker("setDate", -7);
        $('input[name="search_order_date_end"]').datepicker("setDate", "today");
    }

    //초기화면 셋팅
    $('#radio01_1').prop('checked', true); //행사여부 - 전체

    eventSearchData("first", $("#list_cnt option:selected").val(), 1);

    if($("#layoutGB").val().substring($("#layoutGB").val().length-5, $("#layoutGB").val().length) != "Super"){
        searchSupplierList("search_supplier_ssn");
    };
    
    if($("#layoutGB").val() != "settlementManagementAdm" && $("#layoutGB").val() != "settlementManagementSuper" && $("#layoutGB").val() != "supplierOrderListAdm"){
        //초기 카테고리 조회
        searchCategory(0, "", "search_cate1_idx"); //LV0 카테고리 조회
        searchCategory(1, $("#search_cate1_idx option:selected").val(), "search_cate2_idx"); //LV1 카테고리 조회
        searchCategory(2, $("#search_cate2_idx option:selected").val(), "search_cate3_idx"); //LV2 카테고리 조회

        //LV0 카테고리가 바꼈을 때
        $("#search_cate1_idx").change(function(){
            searchCategory(1, $(this).val(), "search_cate2_idx"); //LV1 카테고리 조회
            searchCategory(2, $("#search_cate2_idx option:selected").val(), "search_cate3_idx"); //LV2 카테고리 조회
        });

        //LV1 카테고리가 바꼈을 때
        $("#search_cate2_idx").change(function(){
            searchCategory(2, $(this).val(), "search_cate3_idx"); //LV2 카테고리 조회
        });
    };

    //검색버튼 클릭
    $(".btn_bic").click(function(){
        $("body").css("cursor" ,"wait");
        eventSearchData('btn', $("#list_cnt option:selected").val(), 1);
    });

    //리스트 보여주는 갯수 변경 
    $("#list_cnt").change(function(){
        eventSearchData("selectBox", $("#list_cnt option:selected").val() ,1);
    });

    $(".contents h3")[0].innerText += ` (${new Date()})`; 

});
/*******주문관리 공통 End*******/

function reDrawData(pselectedPage){
    eventSearchData("a", $("#list_cnt option:selected").val(), pselectedPage); //데이터
};

async function eventSearchData(gb, pGetGlobalListCount, pGetCurrentPage){ 
    var getSearchCondition = setSearchConditionToJson();

    if(gb == "btn"){
        drawOrderList(await searchOrderList(getSearchCondition, pGetGlobalListCount, 1), pGetGlobalListCount, 1);
    }
    else if(gb == "selectBox"){
        drawOrderList(await searchOrderList(getSearchCondition, pGetGlobalListCount, 1), pGetGlobalListCount, 1);
    }
    else if(gb == "settlement_excel"){
        var rtValueSet = await searchOrderList(getSearchCondition, pGetGlobalListCount, pGetCurrentPage, gb);
        var date_str = date_to_str(new Date());
        var fileName = "정산리스트_" + date_str;
        
        if(rtValueSet.errorcode == "PFERR_CONF_0000"){
            exportExcel(rtValueSet.returnvalue, date_str, fileName);
        }
    }
    else if(gb == "excel"){
        var rtValueSet = await searchOrderList(getSearchCondition, pGetGlobalListCount, pGetCurrentPage, gb);
        var date_str = date_to_str(new Date());
        var fileName = "주문리스트_" + date_str;
        if(rtValueSet.errorcode == "PFERR_CONF_0000"){
            exportExcel(rtValueSet.returnvalue, date_str, fileName);
        }
    }
    else if(gb == "delivery_list_excel"){

        delete getSearchCondition['search_order_date_start'];
        delete getSearchCondition['search_order_date_end'];

        var rtValueSet = await searchOrderList(getSearchCondition, pGetGlobalListCount, pGetCurrentPage, gb);
        var date_str = date_to_str(new Date());
        var fileName = "배송대기상품_" + date_str;
        
        if(rtValueSet.errorcode != "PFERR_CONF_0060"){
            exportExcel(rtValueSet.returnvalue, date_str, fileName);
        };
    }
    else{
        drawOrderList(await searchOrderList(getSearchCondition, pGetGlobalListCount, pGetCurrentPage), pGetGlobalListCount, pGetCurrentPage);
    };
};

function setSearchConditionToJson(){

    var searchConditionSet = new Object();
    
    searchConditionSet.GB = $("#layoutGB").val(); //화면명

    if($("#layoutGB").val() == "settlementManagementAdm" || $("#layoutGB").val() == "supplierSettlementAdm" || $("#layoutGB").val() == "settlementManagementSuper"){
        searchConditionSet.search_fate_yn =  $("input[name='search_fate_yn']:checked").val(); //행사여부 radioBox
        searchConditionSet.search_order_date_start = $("input[name=search_order_date_start]").val(); //정산일자(from)
        searchConditionSet.search_order_date_end = $("input[name=search_order_date_end]").val(); //정산일자(to)
        searchConditionSet.search_supplier_ssn = $("#search_supplier_ssn option:selected").val();//공급사
        searchConditionSet.search_tax_gb =  $("input[name='search_tax_gb']:checked").val(); //과세여부
    }
    else{
        searchConditionSet.search_fate_yn = $("input[name='search_fate_yn']:checked").val(); //행사여부 radioBox
        searchConditionSet.search_cate1_idx = $("#search_cate1_idx option:selected").val();//상품카테고리1
        searchConditionSet.search_cate2_idx = $("#search_cate2_idx option:selected").val();//상품카테고리2
        searchConditionSet.search_cate3_idx = $("#search_cate3_idx option:selected").val();//상품카테고리3
        searchConditionSet.search_order_date_start = $("input[name=search_order_date_start]").val(); //결제일자(from)
        searchConditionSet.search_order_date_end = $("input[name=search_order_date_end]").val(); //결제일자(to)
        searchConditionSet.search_supplier_ssn = $("#search_supplier_ssn option:selected").val();//공급사
        searchConditionSet.search_order_no = $("input[name=search_order_no]").val();//주문번호
        if($("select[name=search_orderer_type]").val() == "1") searchConditionSet.search_orderer_string = $("input[name=search_orderer_string]").val();//주문자검색(사업자등록번호 or 주문자/상호명 - input)
        else if($("select[name=search_orderer_type]").val() == "2") searchConditionSet.search_orderer_ssn = $("input[name=search_orderer_string]").val();//주문자검색(사업자등록번호 or 주문자/상호명 - input)
        else{};
        //통합검색 select value에 따라 아래에 있는 json 키 값을 변경하는 것으로 작성 $("select[name=]").val();
        searchConditionSet.search_string = $("input[name=search_string]").val(); //상품명 - input
        searchConditionSet.search_payment_sum_from = $("input[name=search_payment_sum_from]").val(); //주문금액(from)
        searchConditionSet.search_payment_sum_to = $("input[name=search_payment_sum_to]").val(); //주문금액(to)
    };

    return searchConditionSet;
};

async function searchOrderList(pSearchCondition, pListCount, pPageIndex, pGB){
    //List조회해서 받아오는 ajax 생성
    var returnvalue;
    $.ajax({
        url: "/uGetOrderList?"  + $.param({"authPage" : "cTotalOrderListAdm.js", "searchCondition":pSearchCondition, "listCount" : pListCount, "pageIndex" : pPageIndex, "GB":pGB}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
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

function callLayerPop(pOrderNum){
    //팝업여는것
    drawOrderListPop(pOrderNum);
};

function removeLayerPop(){
    //팝업 닫기
    $(".layerPopArea").css("display" ,"none");
};

function btn_parentpage_refresh(){
    //??
};
function orderListToExcel(){
    if($("#layoutGB").val() == "settlementManagementSuper" || $("#layoutGB").val() == "settlementManagementAdm"){
        eventSearchData("settlement_excel", $("#list_cnt option:selected").val(), 0);
    }
    else{
        eventSearchData("excel", $("#list_cnt option:selected").val(), 0);
    }
};

async function callEditOrderAjaxCommon(pEditDataSetJson){
    var returnvalue;
    pEditDataSetJson.appID = "cOrderListPop.js";
    await $.ajax({
        url: "/uEditOrderData",  
        type: "POST", async: false,  
        data:JSON.stringify(pEditDataSetJson),
        dataType: "JSON", crossOrigin: false, cache: false,
        contentType: "application/json; charset=utf-8",
        success: function(response){
            if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            };
            returnvalue = response.errorcode;
        },
        error: function(qXHR, textStatus, errorThrown) {
			alert("[err messager]:" + textStatus);
            returnvalue = null;
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
    return returnvalue;
};