/****************************************************************************************************
module명: cPointListAdm.js
creator: 정길웅
date: 2022.04.05
version 1.0
설명: 사용자에게 판매상품 리스트를 보여주는 화면
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
gJSGetListCount = $("#list_cnt option:selected").val();
function reDrawData(pselectedPage){
    eventSearchPointList($("#list_cnt option:selected").val(), pselectedPage); //데이터
};

async function pointListView(pGetSearchCondition){
    //포인트내역 읽어오기
    await $.ajax({
        url: "/uGetPointListAdm?" + $.param({"authPage" : "cPointListAdm.js", "searchCondition":pGetSearchCondition}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            console.log("33333 " + "gJSTotalData " + gJSTotalData + " pGetSearchCondition.rows_per_page " + pGetSearchCondition.rows_per_page + " pGetSearchCondition.now_page " + pGetSearchCondition.now_page);
            var returnSetArray = response.returnvalue;
            var innerText = "";
            if(response.errorcode == "PFERR_CONF_0000"){
                var start_number=0;

                if (gJSTotalData == "" || gJSTotalData == undefined){
                    start_number = gJSGetListCount;
                }
                else{
                    //페이지당 보여지는 ROWNUM의 최댓값을 start_number로 지정한다
                    start_number= Number(document.getElementById("txt_total_count").innerText) - 
                    gJSGetListCount*(Number($(".page").find("a.on")[0].text)-1);
                }
        
                console.log("returnSetArray "+returnSetArray);
                for(var ix=0; ix<returnSetArray.length; ix++){
                    innerText = innerText + `<tr>`;
                    innerText = innerText + `<td>`+start_number+`</td>`; //번호
                    innerText = innerText + `<td>`+returnSetArray[ix].MEMBER_INFO+`</td>`; //회원
                    innerText = innerText + `<td>`+returnSetArray[ix].NADLE_POINT_TYPE_NAME+`</td>`; //포인트구분

                    //적립 구분에서 적립인 경우
                    if(returnSetArray[ix].NADLE_POINT_CHADAE_TYPE=='1'){
                        innerText = innerText + `<td>`+returnSetArray[ix].NADLE_CHADAE_POINT.toLocaleString('ko-KR')+`</td>`; //적립
                        innerText = innerText + `<td>0</td>`; //차감
                    }
                    //적립 구분에서 차감인 경우
                    else if(returnSetArray[ix].NADLE_POINT_CHADAE_TYPE=='2'){
                        innerText = innerText + `<td>0</td>`; //차감
                        innerText = innerText + `<td>`+returnSetArray[ix].NADLE_CHADAE_POINT.toLocaleString('ko-KR')+`</td>`; //적립
                    }
                    innerText = innerText + `<td>`+returnSetArray[ix].BUYER_BALANCE.toLocaleString('ko-KR')+`</td>`; //잔액
                    innerText = innerText + `<td>`+returnSetArray[ix].REFERENCE_CODE+`</td>`; //참조
                    innerText = innerText + `<td>`+returnSetArray[ix].NADLE_REG_DATE+`</td>`; //일시
                    start_number = start_number-1;
                }
                document.getElementById("adm_point_list").innerHTML = innerText;
            }
            else if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            }
            else{
                innerText = innerText + `<td colspan="8" align="center" style="height:100px;">등록된 데이터가 없습니다</td>`
                document.getElementById("adm_point_list").innerHTML = innerText;
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

async function getpointListTotalData(pSearchCondition){
    //데이터 총 건수 
    await $.ajax({
        url: "/uGetPointListTotalCntAdm?"  + $.param({"authPage" : "cPointListAdm.js", "searchCondition":pSearchCondition}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            };
            var returnSetArray = response.returnvalue;
            gJSTotalData = returnSetArray;
            if(gJSTotalData == "" || gJSTotalData == undefined){
                paging(1,1,1);
                $("#txt_total_count").text(0);
            }
            else{
                $("#txt_total_count").text(gJSTotalData);
                //매번 페이지 처리하는 함수
                console.log("gJSTotalData " + gJSTotalData + " pSearchCondition.rows_per_page " + pSearchCondition.rows_per_page + " pSearchCondition.now_page " + pSearchCondition.now_page);
                paging(gJSTotalData, pSearchCondition.rows_per_page, pSearchCondition.now_page);
            }
        },
        error: function(xhr, textStatus ,e) {
            console.log("[error] : " + textStatus);
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
};

//포인트DB 가져오는 ajax 함수
async function procPointTypeListView(pGetSearchCondition){
    //포인트명 데이터
    var ret;
    await $.ajax({
        url: "/uGetPointTypeListAdm?" + $.param({"authPage" : "cPointListAdm.js", "searchCondition":pGetSearchCondition}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            if(response.errorcode == "PFERR_CONF_0000"){
                ret = response.returnvalue;
            }
            else if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            }
            else{
                ret = null;
            }
        },
        error: function(xhr, textStatus, e) {
            console.log("[error] : " + textStatus);
            ret = null;
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
    return ret;
};

//포인트구분의 select box에 포인트구분 이름을 DB에서 찾음
async function viewPointTypeListOption(){
    var txt = "";
    var getSearchCondition = {
        crudGbn : "view_pointName"
    };
	var point_type_name_option = await procPointTypeListView(getSearchCondition);
    var search_type_list = document.getElementById("search_point_type");
    txt += `<option value=''>전체</option>`
    for(var ix=0;ix<point_type_name_option.length;ix++){
        txt += `<option value="`+point_type_name_option[ix].POINT_IDX+`">`+point_type_name_option[ix].POINT_NAME+`</option> \n`;
    };
    search_type_list.innerHTML = txt;
};


// 상품목록이 재 조회되어야 하는 이벤트가 발생했을 때
async function eventSearchPointList(pGetGlobalListCount, pGetCurrentPage){
    //search_biz_name : 상호, search_biz_ssn : 사업자번호, search_point_type : 포인트구분, search_point_chadae_type : 적립구분
    var getSearchCondition = {
        search_biz_name : $("input[name='search_biz_name']").val(),
        search_biz_ssn : $("input[name='search_biz_ssn']").val(),
        search_reg_date_start : $("input[name=search_reg_date_start]").val(), 
        search_reg_date_end : $("input[name=search_reg_date_end]").val(),
        search_point_type : $("#search_point_type").val(),
        search_point_chadae_type : $("#search_point_chadae_type").val(),
        now_page : pGetCurrentPage,
        rows_per_page : $("#list_cnt").val()
    };

    $('*').css('cursor','wait');
    await getpointListTotalData(getSearchCondition); //검색결과 총 데이터 확인
    await pointListView(getSearchCondition); //검색조건 적용 함수
    $('*').css('cursor','default');

    gJSGetListCount = pGetGlobalListCount;
};

function excelDownload()
{
    //검색인자는 불필요 - ????? 뽀로로
    //var paramsSearchCondition = {"crudGbn" : "excel"};
    var paramsSearchCondition = {
        crudGbn : "excel",
        search_biz_name : $("input[name='search_biz_name']").val(),
        search_biz_ssn : $("input[name='search_biz_ssn']").val(),
        search_reg_date_start : $("input[name=search_reg_date_start]").val(), 
        search_reg_date_end : $("input[name=search_reg_date_end]").val(),
        search_point_type : $("#search_point_type").val(),
        search_point_chadae_type : $("#search_point_chadae_type").val(),
        //now_page : pGetCurrentPage,
        //rows_per_page : $("#list_cnt").val()
    };

    //excel download
    var returnSetArray;
    $.ajax({
        url: "/uGetPointListAdm?" + $.param({"authPage": "cPointListAdm.js", "searchCondition": paramsSearchCondition}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false, traditional: true,
        contentType: "application/json; charset=utf-8",
        success: function(response){
            var returnSetArray = response.returnvalue;
            if(response.errorcode == "PFERR_CONF_0000"){
                var date_str = date_to_str(new Date());
                var fileName = "포인트내역_" + date_str;
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

// ------------------------------------ end of source ------------------------------------------------------------------------