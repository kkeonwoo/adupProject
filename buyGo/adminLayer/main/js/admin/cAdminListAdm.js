/****************************************************************************************************
module명: cAdminListAdm.js
creator: 정길웅
date: 2022.04.06
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
function reDrawData(pselectedPage){
    eventSearchAdminList(pselectedPage); //데이터
};

// view, edit, insert를 담당하는 ajax
async function procAdminListView(opt){
    var ret;
    await $.ajax({
        url: "/uGetAdminListAdm?" + $.param({"authPage" : "cAdminListAdm.js", "opt" : opt}),
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

async function textTotalData(pSearchCondition){
    //데이터 총 건수 
    await $.ajax({
        url: "/uGetAdminListTotalCntAdm?"  + $.param({"authPage" : "cAdminListAdm.js", "opt":pSearchCondition}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            };

            var returnSetArray = response.returnvalue;
            gJSTotalData = returnSetArray[0].TOTAL_COUNT;

            //값이 없는 경우 1페이지로 보이게끔 한다
            if(gJSTotalData==undefined||gJSTotalData==""){
                $("#txt_total_count").text(0);
                paging(1,1,1);
            }
            else{
                $("#txt_total_count").text(gJSTotalData);
                //페이지 처리하는 함수
                paging(gJSTotalData, 10, pSearchCondition.now_page);
            };

        },
        error: function(xhr, textStatus, e) {
            console.log("[error] : " + textStatus);
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
};

async function chkDupIdAjax(adminCondition){

    //입력한 id값이 존재하는 경우 DB값과 대조해본다
    if(adminCondition.pId.length>0)
    {
        await $.ajax({
            url: "/uAddAccountB2B?"  + $.param({"authPage" : "cAdminListAdm.js", "opt" : adminCondition}),
            type: "POST", async: false, dataType: "JSON", crossOrigin: true, cache: false,
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function(response)
            {
                //사용할 수 있는 아이디인 경우 첫번째 줄을 아이디 값으로 고정시킨다(중복확인과 inputBox 삭제)
                if(response.returnvalue=="OK"){
                    alert("사용할 수 있는 아이디입니다.")
                    var txt="";
                    txt  += '<div style="display:flex; height: 22px; line-height: 22px;">'
                    txt  += '    <div id="input_id" style="border : 1px; width: 210px; height: 10px;"> \n';
                    txt  += '        '+$("input[name='input_id']").val()+' \n';
                    txt  += '    </div> \n';
                    txt  += '</div> \n';
                    $("#table_add").find("td:eq(0)").html(txt);
                }
                else{
                    alert(response.errormessage);
                };
            },
            error: function(xhr, textStatus, e)
            {
                alert("[error]: "+textStatus);
            },
            complete:function(data, textStatus)
            {
                console.log("[complete]: "+textStatus);
            }
        });
    }
    else
    {
        alert("아이디를 입력하세요");
    };
};

async function eventSearchAdminList(pGetCurrentPage){

    var getSearchCondition = {
        search_supplier_name : $("input[name='supplier_name']").val(),
        search_supplier_ssn : $("input[name='supplier_ssn']").val(),
        search_account_status : $("select[name=account_status]").val(),
        search_account_role : $("select[name=admin_status]").val(),
        crudGbn : "update_view",
        now_page : pGetCurrentPage
    };

    await textTotalData(getSearchCondition); //검색결과 총 데이터 확인

    var adminInfo =await procAdminListView(getSearchCondition); //검색조건 적용 함수
    
    adminListTableView(adminInfo);
};

//ajax를 가져와서 table을 생성하는 함수
function adminListTableView(returnSetArray){
    var innerText ="";
    if(returnSetArray==undefined || returnSetArray==""){
        //불러온 DB가 없는 경우
        innerText = innerText + `<td colspan="12" align="center" style="height:100px;">등록된 데이터가 없습니다</td>`
        document.getElementById("adm_admin_list").innerHTML = innerText;
    }
    else{
        var supplier_ssn="";
        var supplier_name="";
        var head_office_charger="";
        var array_id="";

        for(var ix=0; ix<returnSetArray.length; ix++){
            
            //값이 없는 경우 공란으로 처리한다
            if(returnSetArray[ix].SUPPLIER_SSN==undefined||returnSetArray[ix].SUPPLIER_SSN==null){
                supplier_ssn="";
            }
            else{
                supplier_ssn = returnSetArray[ix].SUPPLIER_SSN;
            };

            if(returnSetArray[ix].SUPPLIER_NAME==undefined||returnSetArray[ix].SUPPLIER_NAME==null){
                supplier_name="";
            }
            else{
                supplier_name=returnSetArray[ix].SUPPLIER_NAME;
            };

            if(returnSetArray[ix].HEAD_OFFICE_CHARGER==undefined||returnSetArray[ix].HEAD_OFFICE_CHARGER==null){
                head_office_charger="";
            }
            else{
                head_office_charger=returnSetArray[ix].HEAD_OFFICE_CHARGER;
            };

            if(returnSetArray[ix].ID==undefined||returnSetArray[ix].ID==null){
                array_id="";
            }
            else{
                array_id=returnSetArray[ix].ID;
            };
            innerText = innerText + `<tr>`;
            innerText = innerText + `<td>${returnSetArray[ix].ROWNUM}</td>`; // 번호
            innerText = innerText + `<td>`+supplier_ssn+`</td>`; //사업자번호
            innerText = innerText + `<td><a href="javascript:drawAdminEdit('${returnSetArray[ix].SUPPLIER_SSN}', '${returnSetArray[ix].ACCOUNT_STATUS}', '${returnSetArray[ix].LICENSE_STATUS}');">`+supplier_name+`</a></td>`; //상호명
            innerText = innerText + `<td>`+head_office_charger+`</td>`; //담당자
            innerText = innerText + `<td>`+array_id+`</td>`; //ID
            innerText = innerText + `<td>${returnSetArray[ix].ACCOUNT_STATUS}</td>`; //계정상태
            innerText = innerText + `<td>${returnSetArray[ix].LICENSE_STATUS}</td>`; //라이센스상태
            innerText = innerText + `<td>${returnSetArray[ix].ACCOUNT_ROLE}</td>`; //역할
            innerText = innerText + `<td>${returnSetArray[ix].LICENSE_START_DATE}</td>`; //라이센스 시작일자
            innerText = innerText + `<td>${returnSetArray[ix].LICENSE_END_DATE}</td>`; //라이센스 종료일자
            innerText = innerText + `<td>${returnSetArray[ix].UPDATE_WORKER}</td>`; //등록자
        };
        document.getElementById("adm_admin_list").innerHTML = innerText;
    }; 
};



// ------------------------------------ end of source ------------------------------------------------------------------------