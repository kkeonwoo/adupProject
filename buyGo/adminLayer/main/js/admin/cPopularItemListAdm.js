/****************************************************************************************************
module명: cPopularItemListAdm.js
creator: 정길웅
date: 2022.03.21
version 1.0
설명: 사용자에게 인기상품 리스트를 보여주는 화면
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
function reDrawData(pselectedPage){
    eventSearchItem(pselectedPage); //데이터
};

async function popularItemListView(pGetSearchCondition){
    //인기상품DB 읽어오기
    await $.ajax({
        url: "/uGetPopularItemListAdm?" + $.param({"authPage" : "cPopularItemListAdm.js", "searchCondition":pGetSearchCondition}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            var returnSetArray = response.returnvalue;
            var innerText = "";
            if(response.errorcode == "PFERR_CONF_0000"){
                if(returnSetArray[0]==""||returnSetArray[1][0].TOTAL_COUNT==0){
                    //데이터가 존재하지 않을 경우 등록된 데이터가 없다고 표기함
                    innerText = innerText + `<td colspan="8" align="center" style="height:100px;">등록된 데이터가 없습니다</td>`
                    document.getElementById("adm_popular_item_list").innerHTML = innerText;

                    paging(1,1,1); //1페이지로 보이게끔 함
                    $("#txt_total_count").text(0);
                }
                else{
                    var total_count = returnSetArray[1][0].TOTAL_COUNT;
                    var rows_per_page = pGetSearchCondition.rows_per_page;
                    var now_page = pGetSearchCondition.now_page
                    for(var ix=0; ix<returnSetArray[0].length; ix++){
                        innerText = innerText + `<tr>`;
                        innerText = innerText + `<td>${returnSetArray[0][ix].ROWNUM}</td>`;
                        innerText = innerText + `<td><img src="/eum/resources/temp/goods/${returnSetArray[0][ix].SALES_ITEM_IMAGE_FILE}_LIST.${returnSetArray[0][ix].SALES_ITEM_IMAGE_FILE_EXT}" alt=""></td>`;
                        innerText = innerText + `<td>${returnSetArray[0][ix].SALES_ITEM_NAME}</td>`;
                        innerText = innerText + `<td>${returnSetArray[0][ix].SALES_UNIT_PRICE.toLocaleString('ko-KR')}</td>`;
                        innerText = innerText + `<td>${returnSetArray[0][ix].SALES_ITEM_PRICE.toLocaleString('ko-KR')}</td>`;
                        innerText = innerText + `<td>${returnSetArray[0][ix].SALES_ITEM_SALE_TYPE}</td>`;
                        innerText = innerText + `<td>${returnSetArray[0][ix].ORDER_COUNT}</td>`;
                        innerText = innerText + `<td>${returnSetArray[0][ix].SUM_SALES_PRICE.toLocaleString('ko-KR')}</td>`;
                        innerText = innerText + `<td>${returnSetArray[0][ix].NADLE_REG_DATE}</td>`;
                        innerText = innerText + `<td>${returnSetArray[0][ix].NADLE_MOD_DATE}</td>`;
                    }
                    document.getElementById("adm_popular_item_list").innerHTML = innerText;
                    paging(total_count, rows_per_page, now_page);
                    $("#txt_total_count").text(returnSetArray[1][0].TOTAL_COUNT);
                }
            }
            else if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            }
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

//상품목록이 재 조회되어야 하는 이벤트가 발생했을 때
async function eventSearchItem(pGetCurrentPage){

    //search_sort : 순위구분, search_reg_date_start : 등록 시작일, search_reg_date_end : 등록 종료일, now_page : 현 보는 페이지, rows_per_page : 한 화면에 보이는 데이터 수
    var getSearchCondition = {
        search_sort : $("input[name='search_sort']:checked").val(),
        search_reg_date_start : $("input[name=search_reg_date_start]").val(), 
        search_reg_date_end : $("input[name=search_reg_date_end]").val(),
        now_page : pGetCurrentPage,
        rows_per_page : Number($("#list_cnt").val()),
        excelOption : "none"
    };

    await popularItemListView(getSearchCondition); //검색조건 적용 함수
};

function setDateAll(){
	$("#search_reg_date_start").val("1999-01-01");
	$("#search_reg_date_end").val("2100-12-31");
    $("#search_reg_date_start").css("color",  "white");
    $("#search_reg_date_end").css("color",  "white");
};

function excelDownload(){
    //excel download
    var excelGBN = {
        search_sort : $("input[name='search_sort']:checked").val(),
        search_reg_date_start : $("input[name=search_reg_date_start]").val(), 
        search_reg_date_end : $("input[name=search_reg_date_end]").val(),
        "excelOption" : "excel"};
    var returnSetArray;
    $.ajax({
        url: "/uGetPopularItemListAdm?" + $.param({"authPage": "cPopularItemListAdm.js", "searchCondition": excelGBN}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false, traditional: true,
        contentType: "application/json; charset=utf-8",
        success: function(response){
            var returnSetArray = response.returnvalue;
            if(response.errorcode == "PFERR_CONF_0000"){
                var date_str = date_to_str(new Date());
                var fileName = "인기상품_" + date_str;
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

///////////////////end of source/////////////////////////
