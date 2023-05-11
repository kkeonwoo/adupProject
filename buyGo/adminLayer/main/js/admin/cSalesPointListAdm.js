/****************************************************************************************************
module명: cSalesPointListAdm.js
creator: 정길웅
date: 2022.04.05
version 1.0
설명: 월별 현금 구매 거래 점주를 대상으로 포인트 부여 대상을 확인하고, 시스템에서 부여한 예정 포인트를
      참고하여 실제 포인트를 부여하기 위한 admin화면 소스
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
var gJSTotalData;
var gJSGetListCount = $("#list_cnt option:selected").val();
function reDrawData(pselectedPage){
    eventSearchItem("a", $("#list_cnt option:selected").val(), pselectedPage); //데이터
};

function salesPointListView(paramsSearchCondition){
    $.ajax({
        url: "/uGetSalesPointListAdm?" + $.param({"authPage" : "cSalesPointListAdm.js", "searchCondition":paramsSearchCondition, "excelOption":"no"}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/json; charset=utf-8 ",
        traditional: true,
        success: function(response){
            var returnSetArray = response.returnvalue[0];
            var totalCount = response.returnvalue[1][0].CNT;
            if(response.errorcode == "PFERR_CONF_0000"){
                //전체 건수를 붙인다.
                $("#txt_total_count").text(totalCount);

                //그다음 Data를 list한다.
                if(returnSetArray.length>0)
                {
                    var tmpYear="";
                    var tmpMonth="";
                    var myBody=document.getElementById("result_data");
                    myBody.innerHTML="";    //초기화
                    var col=new Array(11);
                    var row;
                    for(var ix=0; ix<returnSetArray.length; ix++){
                        //행추가
                        row=myBody.insertRow(myBody.rows.length);
                        col[0]=row.insertCell(0);
                        col[0].innerHTML=returnSetArray[ix].ROWNUM;

                        col[1]=row.insertCell(1);
                        tmpYear=returnSetArray[0].PAYMENT_DATE.substring(0,4);
                        tmpMonth=returnSetArray[0].PAYMENT_DATE.substring(5,7);
                        col[1].innerHTML=tmpYear+"-"+tmpMonth;

                        col[2]=row.insertCell(2);
                        col[2].innerHTML=returnSetArray[ix].ORDERER_BIZ_NAME;

                        col[3]=row.insertCell(3);
                        col[3].innerHTML=returnSetArray[ix].ORDERER_BIZ_SSN;

                        col[4]=row.insertCell(4);
                        col[4].innerHTML=priceToString(returnSetArray[ix].CASH_AMOUNT);

                        col[5]=row.insertCell(5);
                        col[5].innerHTML=priceToString(returnSetArray[ix].POINT_AMOUNT);

                        if(returnSetArray[ix].AUTOSET_STATUS=="0")
                        {
                            col[6]=row.insertCell(6);
                            col[6].innerHTML=`<td><input type="checkbox" id="check${ix}" name=check${ix} value=""></td>`;
                        }
                        else
                        {
                            col[6]=row.insertCell(6);
                            col[6].innerHTML=`<td><input type="checkbox" id="check${ix}" name=check${ix} disabled="disabled" value=""></td>`;
                        };

                        col[7]=row.insertCell(7);
                        if(returnSetArray[ix].AUTOSET_CHADAE_POINT!=undefined&&returnSetArray[ix].AUTOSET_CHADAE_POINT!=null)
                        {
                            col[7].innerHTML=priceToString(returnSetArray[ix].AUTOSET_CHADAE_POINT);
                        }
                        else
                        {
                            col[7].innerHTML="";
                        };

                        col[8]=row.insertCell(8);
                        if(returnSetArray[ix].AUTOSET_STATUS!=undefined&&returnSetArray[ix].AUTOSET_STATUS!=null)
                        {
                            if(returnSetArray[ix].AUTOSET_STATUS=="0")
                            {
                                col[8].innerHTML="예정";
                            }
                            else if(returnSetArray[ix].AUTOSET_STATUS=="1")
                            {
                                col[8].innerHTML="확정";
                            }
                            else
                            {
                                col[8].innerHTML="미분류";
                            };
                        }
                        else
                        {
                            col[8].innerHTML="";
                        };

                        col[9]=row.insertCell(9);
                        if(returnSetArray[ix].CONFIRM_DATETIME!=undefined&&returnSetArray[ix].CONFIRM_DATETIME!=null)
                        {
                            col[9].innerHTML=returnSetArray[ix].CONFIRM_DATETIME;
                        }
                        else
                        {
                            col[9].innerHTML="";
                        };

                        col[10]=row.insertCell(10);
                        if(returnSetArray[ix].AUTOSET_REG_DATE!=undefined&&returnSetArray[ix].AUTOSET_REG_DATE!=null)
                        {
                            col[10].innerHTML=returnSetArray[ix].AUTOSET_REG_DATE;
                        }
                        else
                        {
                            col[10].innerHTML="";
                        };
                    };

                    paging(totalCount, Number(paramsSearchCondition.rows_per_page), paramsSearchCondition.now_page);
                }
                else
                {
                    //data count is 0
                    $("#result_data").empty();
                    $("#result_data").append('<tr><td colspan="12" align="center" style="height:100px;">조건에 맞는 데이터가 없습니다</td></tr>');
                };
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
};

function priceToString(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 상품목록이 재 조회되어야 하는 이벤트가 발생했을 때
function eventSearchItem(gb, pgRowNumsPerPage, pCurrentPage){
    //화면상에 선택된 조건의 값들을 읽어서 설정한다.
    var paramsSearchCondition = {
        search_year     : $("#search_year option:selected").val(), 
        search_month    : $("#search_month option:selected").val(), 
        search_sales    : $("#search_sales").val(),
        search_biz_ssn  : $("#search_biz_ssn").val(),
        search_biz_name : $("#search_biz_name").val(),
        now_page        : pCurrentPage,
        rows_per_page   : pgRowNumsPerPage
    };

    salesPointListView(paramsSearchCondition); //검색조건 적용 함수
    
    //현재 목록값을 갱신
    gJSGetListCount = pgRowNumsPerPage;
};

//현업이 포인트 부여를 수행한 경우
async function setPoint(){
    //화면에서 selected된 것이 있는지를 찾는다.
    //만일 미리 부여된 실적이 없는 경우는 얼마를 부여할 수 있는지 알 수 없으므로 Error처리한다.
    if($("#result_data > tr").length<1)
    {
        alert("포인트 지금 대상 선택이 1건도 없습니다.");
    }
    else
    {
        //selected 된 건수가 있으면 전송할 json object를 만든다.
        var ssn_point_arr=new Array();
        var buyerInfo={};
        var tmp="";
        for(var ix=0; ix<$("#result_data > tr").length; ix++)
        {
            buyerInfo={};   //초기화
            if($("#check"+ix).is(":checked")==true)
            {
                //예정일때만 되어야 함 (확정이면 아예 select box를 나오지 않게 한다.)
                buyerInfo.buyer_ssn=$("#result_data > tr:nth-child("+(ix+1)+") > td:nth-child(4)").text();
                tmp=$("#result_data > tr:nth-child("+(ix+1)+") > td:nth-child(8)").text(); //포인트
                tmp=tmp.replace(/,/gi,""); //comma제거
                if(tmp==null||tmp=="")
                {
                    tmp=0;
                };

                buyerInfo.point_value=tmp*1;    //숫자형변환해서 넣는다.
                if(buyerInfo.point_value>0)
                {
                    ssn_point_arr.push(buyerInfo);
                };
            };
        };

        if(ssn_point_arr.length>0)
        {
            var editDataJson = {
                "ssn_point_arr"   : ssn_point_arr,
                "point_type_idx"  : 10, //10: 월 구매 적립
                "reference_code"  : "",
                "point_memo"      : "이음 admin 부여",
                "expiration_date" : '2022-05-03',
                "app_id" : "salesPointListAdm.html"
            };

            //server로 전송
            var rtn="";
            await $.ajax({
                url: "/uEditPoint?" + $.param({"authPage": "cSalesPointListAdm.js", "editDataJson": editDataJson}),
                type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
                contentType: "application/json; charset=utf-8 ",
                traditional: true,
                success: function(response){
                    if(response.errorcode == "PFERR_CONF_0000"){
                        //alert("선택된 구매자에 대한 포인트 일괄 적립이 정상처리 되었습니다.");
                        rtn="ok";
                    }
                    else{
                        alert(response.errormessage);
                    };
                },
                error: function(xhr, textStatus, e) {
                    console.log("[error]: " + textStatus);
                    rtn="error";
                },
                complete:function(data,textStatus) {
                    console.log("[complete]: " + textStatus);
                }
            });

            if(rtn=="ok")
            {
                //정상처리 되고 나면 후보 테이블도 확정처리한다.
                $.ajax({
                    url: "/uSetPointConfirm?" + $.param({"confirmList": editDataJson}),
                    type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
                    contentType: "application/json; charset=utf-8 ",
                    traditional: true,
                    success: function(response){
                        if(response.errorcode == "PFERR_CONF_0000"){
                            alert("선택된 구매자에 대한 포인트 일괄 적립이 정상처리 되었습니다.");
                            //재조회
                            reDrawData(1);
                            return true;
                        }
                        else{
                            alert(response.errormessage);
                        };
                    },
                    error: function(xhr, textStatus, e) {
                        console.log("[error]: " + textStatus);
                        return false;
                    },
                    complete:function(data,textStatus) {
                        console.log("[complete]: " + textStatus);
                    }
                });
            };
        }
        else
        {
            alert("부여하고자 하는 포인트 값이 없습니다.");
        }
    };
};

function excelDownload()
{
    var paramsSearchCondition = {
        search_year     : $("#search_year option:selected").val(), 
        search_month    : $("#search_month option:selected").val(), 
        search_sales    : $("#search_sales").val(),
        search_biz_ssn  : $("#search_biz_ssn").val(),
        search_biz_name : $("#search_biz_name").val(),
        now_page        : 1,
        rows_per_page   : 1
    };

    //excel download
    $.ajax({
        url: "/uGetSalesPointListAdm?" + $.param({"authPage" : "cSalesPointListAdm.js", "searchCondition":paramsSearchCondition, "excelOption":"exceldownload"}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/json; charset=utf-8 ",
        traditional: true,
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
};

function setAllCheckBox()
{
    //전체 선택 및 해제
    if($("#checkAll").is(":checked")==true)
    {
        //전체 선택
        for(var ix=0; ix<$("#result_data > tr").length; ix++)
        {
            $("#check"+ix).prop("checked",true);
        };
    }
    else
    {
        //전체 해제
        for(var ix=0; ix<$("#result_data > tr").length; ix++)
        {
            $("#check"+ix).prop("checked",false);
        };
    };
};
/* ------------------------------ end of source ---------------------------------------- */