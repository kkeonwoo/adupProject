/****************************************************************************************************
module명: cSupplierListAdm.js
creator: 윤희상
date: 2022.03.21
version 1.0
설명: 관리자 페이지에서 공급사 목록용 js
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

function reDrawData(pselectedPage){
    eventSearchData("a", $("#list_cnt option:selected").val(), pselectedPage); //데이터
};

function eventSearchData(gb, pGetGlobalListCount, pGetCurrentPage){
  
    var getSearchCondition = setSearchConditionToJson();
    gJSGetListCount = pGetGlobalListCount;

    if(gb == "btn"){
        searchSupplierDealList(getSearchCondition, pGetGlobalListCount, 1);
    }
    else if(gb == "selectBox"){
        searchSupplierDealList(getSearchCondition, pGetGlobalListCount, 1);
    }
    else{
        searchSupplierDealList(getSearchCondition, pGetGlobalListCount, pGetCurrentPage);
    };

};

function setSearchConditionToJson(){
    var searchConditionSet = new Object();
    
    searchConditionSet.search_supplier_name = $("input[name=search_supplier_name]").val(); //공급사명
    searchConditionSet.search_charge_name = $("input[name=search_charge_name]").val(); //대표자/담당자
    searchConditionSet.search_reg_date_start = $("input[name=search_reg_date_start]").val(); //등록일
    searchConditionSet.search_reg_date_end = $("input[name=search_reg_date_end]").val(); //등록일
    return searchConditionSet;
};

function searchSupplierDealList(pSearchCondition, pListCount, pPageIndex){
    //List조회해서 받아오는 ajax 생성
    $.ajax({
        url: "/uGetSupplierDealList?"  + $.param({"authPage" : "cSupplierListAdm.js", "searchCondition":pSearchCondition, "listCount" : pListCount, "pageIndex" : pPageIndex}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            var tb = document.getElementById("table_data");
            tb.innerHTML = "";
            if(response.errorcode == "PFERR_CONF_0000"){
                var returnSetArray = response.returnvalue;
                gJSTotalData = response.returnTotalCNT;
                document.getElementsByClassName("txt_total")[0].children[0].innerHTML = gJSTotalData;
                
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

                    Cell0.innerText = returnSetArray[tx].ROWNUM;

                    var aTag = document.createElement("a");
                    aTag.href = `javascript:callLayerPop(${returnSetArray[tx].ROW_SEQUENCE});`
                    aTag.innerText = returnSetArray[tx].NADLE_SUPPLIER_TRANSACTION_TYPE;
                    Cell1.appendChild(aTag);
                    Cell2.innerText = returnSetArray[tx].SUPPLY_BUSINESS_NICK;
                    Cell3.innerText = returnSetArray[tx].SUPPLIER_CEO;
                    Cell4.innerText = `${returnSetArray[tx].CONT_FEE_RATE} %`;
                    Cell5.innerText = `${returnSetArray[tx].WEEK_SPECIAL_FATE_RATE} %`;
                    Cell6.innerText = `${returnSetArray[tx].CONT_SPECIAL_PRICE_FEE_RATE} %`;
                    Cell7.innerHTML = `${returnSetArray[tx].SUPPLIER_CHARGER}<br>(${returnSetArray[tx].SUPPLIER_CHARGER_PHONE} / ${returnSetArray[tx].SUPPLIER_CHARGER_MOBILE})`;
                    Cell8.innerText = returnSetArray[tx].CREATION_DATETIME;
                    Cell9.innerText = returnSetArray[tx].SUPPLIER_REG_STATUS_NM;
                };
            }
            else if(response.errorcode == "PFERR_CONF_0005"){
                gJSTotalData = response.returnTotalCNT;
                document.getElementsByClassName("txt_total")[0].children[0].innerHTML = gJSTotalData;
            }
            else if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            };
            paging(gJSTotalData, gJSGetListCount, pPageIndex);
        },
        error: function(qXHR, textStatus, errorThrown) {
			alert("[err messager]:" + textStatus);
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
};

function callLayerPop(pDealID){

    drawSupplierPopUp(pDealID);
};

function removeLayerPop(){
    $(".layerPopArea").css("display" ,"none");
};