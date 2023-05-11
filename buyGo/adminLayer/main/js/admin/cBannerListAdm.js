/****************************************************************************************************
module명: cBannerListAdm.js
creator: 정길웅
date: 2022.03.28
version 1.0
설명: 사용자에게 배너 리스트를 보여주는 화면
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
    eventSearchBannerList($("#list_cnt option:selected").val(), pselectedPage);
};

//배너DB 읽어오는 ajax
async function getBannerListView(getSearchCondition){
    var returnSetArray;
    await $.ajax({
        url: "/uGetBannerListAdm?" + $.param({"authPage" : "cBannerListAdm.js", "searchCondition":getSearchCondition}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            if(response.errorcode == "PFERR_CONF_0000"){
                returnSetArray = response.returnvalue;
            }
            else if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
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
    return returnSetArray;
};

async function textTotalData(pSearchCondition){
    //데이터 총 건수 
    await $.ajax({
        url: "/uGetBannerTotalCntAdm?"  + $.param({"authPage" : "cBannerListAdm.js", "searchCondition":pSearchCondition}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            }
            else if(response.errorcode == "PFERR_CONF_0050"){
                //데이터 객체 자체가 없다면 Exception 내용중 일부를 보여준다.
                alert(response.errormessage);
                //0건이면 최초 1 Page로 표시
                $("#txt_total_count").text(0);
                paging(1,1,1);
            }
            else
            {
                var returnSetArray = response.returnvalue;
                if(returnSetArray!="undefined"&&returnSetArray!=null&&returnSetArray!="")
                {
                    //건수가 있는 경우 (1건 이상)
                    if(returnSetArray>0)
                    {
                        gJSTotalData = returnSetArray;
                        $("#txt_total_count").text(gJSTotalData);
                        //매번 페이지 처리하는 함수
                        paging(gJSTotalData, pSearchCondition.rows_per_page, pSearchCondition.now_page);
                    }
                    else
                    {
                        //0건이면 최초 1 Page로 표시
                        gJSTotalData = returnSetArray;
                        paging(1,1,1);
                        $("#txt_total_count").text(gJSTotalData);
                    };
                }
                else
                {
                    //데이터 객체 자체가 없다면 Exception 내용중 일부를 보여준다.
                    alert(response.errormessage);
                    //0건이면 최초 1 Page로 표시
                    $("#txt_total_count").text(gJSTotalData);
                    paging(1,1,1);
                };
            };
        },
        error: function(xhr, textStatus, th) {
            console.log("textTotalData [error]: " + textStatus);
        },
        complete:function(data,textStatus) {
            console.log("[complete]: " + textStatus);
        }
    });
};

//메인 화면에 검색 결과 보여주는 함수
function bannerListView(returnSetArray){
    var innerText = "";

    //값이 없는 경우 데이터가 없다고 표시해줌
    if(returnSetArray==undefined || returnSetArray==""){
        innerText = innerText + `<td colspan="8" align="center" style="height:100px;">등록된 데이터가 없습니다</td>`
        document.getElementById("adm_banner_list").innerHTML = innerText;
    }
    else{
        //start_number : 한 페이지 내에 가장 큰 ROWNUM 값
        var start_number=0;
        var total_count=0;
        var now_page=0;  
        if (gJSTotalData == "" || gJSTotalData == undefined){
            start_number = gJSGetListCount;
        }
        else{
            //페이지당 번호에서 
            total_count = Number(document.getElementById("txt_total_count").innerText);
            now_page = Number($(".page").find("a.on")[0].text);
            start_number= total_count - gJSGetListCount*(now_page-1);
        }

        for(var ix=0; ix<returnSetArray.length; ix++){
            if(returnSetArray[ix].BANNER_STATUS == "1"){
                returnSetArray[ix].BANNER_STATUS = "사용"
            }
            else if(returnSetArray[ix].BANNER_STATUS =="2"){
                returnSetArray[ix].BANNER_STATUS = "중단"
            };

            if(returnSetArray[ix].BANNER_STAGE == "1"){
                returnSetArray[ix].BANNER_STAGE = "등록"
            }
            else if(returnSetArray[ix].BANNER_STAGE =="2"){
                returnSetArray[ix].BANNER_STAGE = "제외"
            }
            else{
                returnSetArray[ix].BANNER_STAGE ="없음"
            };

            innerText = innerText + `<tr>`;
            innerText = innerText + `<td>`+start_number+`</td>`;
            innerText = innerText + `<td><a href="javascript:drawBannerListPopUp(${returnSetArray[ix].BANNER_IDX});">${returnSetArray[ix].BANNER_TITLE}<a></td>`;
            innerText = innerText + `<td>${returnSetArray[ix].BANNER_STATUS}</td>`;
            innerText = innerText + `<td>${returnSetArray[ix].BANNER_STAGE}</td>`;
            innerText = innerText + `<td>${returnSetArray[ix].MOD_DATE}</td>`;   
            start_number = start_number-1;             
        }
        document.getElementById("adm_banner_list").innerHTML = innerText;
    }
}


// 상품목록이 재 조회되어야 하는 이벤트가 발생했을 때
async function eventSearchBannerList(pGetGlobalListCount, pGetCurrentPage){

    //search_banner_title : 배너명, search_banner_status : 배너상태, search_banner_stage : 등록상태
    var getSearchCondition = {
        banner_title : $("input[name=search_banner_title]").val(),
        banner_status : $("#search_banner_status option:selected").val(),
        banner_stage : $("#search_banner_stage option:selected").val(),
        now_page : pGetCurrentPage,
        rows_per_page : $("#list_cnt").val(),
        crudGbn : "update_view"
    };
    
    var bannerDBInfo = await getBannerListView(getSearchCondition); //검색조건 적용 함수
    textTotalData(getSearchCondition); //검색결과 총 데이터 확인
    bannerListView(bannerDBInfo); //검색 후 DB값 표현

    gJSGetListCount = pGetGlobalListCount;
};
// ------------------------------------ end of source ------------------------------------------------------------------------