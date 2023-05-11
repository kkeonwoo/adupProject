/****************************************************************************************************
module명: cBuyerListAdm.js
creator: 안상현
date: 2022.04.01
version 1.0
설명: 구매자List화면(어드민용) js
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

//몇 페이지가 눌렸는지를 받아와서 다시 그린다는 의미임
function reDrawData(pselectedPage){
    getBuyerData(pselectedPage);
};

//buyerListTable 읽어오는 ajax
async function getBuyerList(getSearchCondition){ 
    var returnSetArray;
    await $.ajax({
        url: "/uGetBuyerListAdm?" + $.param({"authPage": "cBuyerListAdm.js", "searchCondition": getSearchCondition, "excelOption": "no"}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false, traditional: true,
        contentType: "application/json; charset=utf-8",
        success: function(response){
            if(response.errorcode == "PFERR_CONF_0000"){
                returnSetArray = response.returnvalue;
                gJSTotalData = returnSetArray[1][0].CNT;
                if (gJSTotalData == "" || gJSTotalData == undefined){
                    paging(1,1,1);
                    $("#txt_total_count").text(0);
                }
                else{
                    $("#txt_total_count").text(gJSTotalData);
                    //매번 페이지 처리하는 함수
                    console.log(response);
                    console.log(getSearchCondition);
                    paging(gJSTotalData, 10, getSearchCondition.now_page);
                };
            }
            else if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
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

async function getBuyerData(pGetCurrentPage){
    //오브젝트에 정보를 담음
    var getSearchCondition = setSearchConditionToJson(pGetCurrentPage);     //오브젝트에 정보를 담음
    var alertDate = alertReverseDate(getSearchCondition)
    if(alertDate!="OK"){
        alert(alertDate);
    }
    else if(alertDate=="OK") {
        console.log(getSearchCondition);
        var buyerListDB = await getBuyerList(getSearchCondition);              //ajax에 보냄
        drawBuyerInfo(buyerListDB);                                            //테이블 형성
        // var totalCount = buyerListDB[1][0].CNT;
        // paging(totalCount,10, getSearchCondition.now_page);                     //페이징 처리
    };
};

function alertReverseDate(JSONDB){
    if(JSONDB.join_from_date>JSONDB.join_to_date){
        return ("가입일의 순서가 바뀌었습니다.");
    }
    else{
        return "OK"
    };
};

//화면 초기 값 설정
function setInitValueToUI(){
    //dtp picker 오늘 일자로 초기 설정
    var $datepickerFrom = $("#reg_date_start");
    var $datepickerTo = $("#reg_date_end");
    $datepickerFrom.datepicker(); $datepickerTo.datepicker();
    $datepickerFrom.datepicker("setDate", new Date()); $datepickerTo.datepicker("setDate", new Date());
};

function drawBuyerInfo(returnSetArray){
    var innerText = "";
    var buyer_point = "";
    var last_conn_date = "";
    var last_order_date = "";
    var reg_status = "";
    var reg_type = "";
    if(returnSetArray[0]==undefined||returnSetArray[0]=="")
    {
        //불러온 DB가 없는 경우
        innerText = innerText + `<td colspan="12" align="center" style="height:100px;">해당조건에 맞는 데이터가 없습니다</td>`
        document.getElementById("buyer_tbody_id").innerHTML = innerText;
        document.getElementById("txt_total_count").innerText="0"; //값 없으면 0
    }
    else{
        //console.log(returnSetArray);
        for(var ix=0; ix<returnSetArray[0].length; ix++){

            //포인트가 없는 경우 0으로 처리한다
            if(returnSetArray[0][ix].BUYER_POINT==null){
                buyer_point = "0";
            }
            else{
                buyer_point = returnSetArray[0][ix].BUYER_POINT;
            };

            //최근접속일이 없는 경우 공란으로 한다
            if(returnSetArray[0][ix].LAST_CONN_DATE==null){
                last_conn_date = "";
            }
            else{
                last_conn_date = returnSetArray[0][ix].LAST_CONN_DATE;
            };

            //최근구매일이 없는 경우 공란으로 한다
            if(returnSetArray[0][ix].LAST_ORDER_DATE==null){
                last_order_date = "";
            }
            else{
                last_order_date = returnSetArray[0][ix].LAST_ORDER_DATE;
            };

            if(returnSetArray[0][ix].NADLE_REG_STATUS==0){
                reg_status = "승인대기";
            }
            else if(returnSetArray[0][ix].NADLE_REG_STATUS==1){
                reg_status = "승인";
            }
            else if(returnSetArray[0][ix].NADLE_REG_STATUS==2){
                reg_status = "사용중지";
            };

            if(returnSetArray[0][ix].NADLE_REG_TYPE=="P"){
                reg_type = "포스";
            }
            else if(returnSetArray[0][ix].NADLE_REG_TYPE=="W"){
                reg_type = "웹";
            }
            else if(returnSetArray[0][ix].NADLE_REG_TYPE=="M"){
                reg_type = "모바일";
            };

            innerText = innerText + `<tr>`;
            innerText = innerText + `<td>${returnSetArray[0][ix].ROWNUM}</td>`;
            innerText = innerText + `<td>`+reg_status+`</td>`;
            innerText = innerText + `<td onClick="editBuyerInfo('${returnSetArray[0][ix].BUYER_SSN}');" style="cursor:pointer">${returnSetArray[0][ix].BUYER_NAME}</br>`;
            innerText = innerText + `[${returnSetArray[0][ix].BUYER_SSN}]</td>`;
            innerText = innerText + `<td id="CEO_idx_`+ix+`"onClick="click_CEO(this.id);" style="cursor:pointer">${returnSetArray[0][ix].BUYER_CEO}</td>`;
            innerText = innerText + `<td>${returnSetArray[0][ix].BUYER_INFO_MMS_YN}</td>`; //메세지발송
            innerText = innerText + `<td>`+buyer_point.toLocaleString('ko-KR')+`</td>`;
            innerText = innerText + `<td>${returnSetArray[0][ix].VISIT_CNT}</td>`;
            innerText = innerText + `<td>`+last_conn_date+`</td>`;
            innerText = innerText + `<td>${returnSetArray[0][ix].ORDER_COUNT}</td>`;
            innerText = innerText + `<td>`+last_order_date+`</td>`;
            innerText = innerText + `<td>`+reg_type+`</td>`;
            innerText = innerText + `<td>${returnSetArray[0][ix].NADLE_REG_DATE}</td>`;
        };
        document.getElementById("buyer_tbody_id").innerHTML = innerText;
        //total값 설정
        document.getElementById("txt_total_count").innerText = returnSetArray[1][0].CNT;
    };
};

//화면 검색 조건 설정
function setSearchConditionToJson(pGetCurrentPage){

    var regDate_start = $("input[name=search_reg_date_start]").val();
    var regDate_end = $("input[name=search_reg_date_end]").val();

    //가입일이 정해지지 않을 시(화면이 처음 등장하는 시점) 오늘 날짜로 표시한다
    if(regDate_start==""||regDate_end==""){
        var today = new Date();
        var year = today.getFullYear(); // 년도
        var month = today.getMonth() + 1;  // 월
        var day = today.getDate();  // 날짜
        today = (year + '-' + month + '-' + day);
        regDate_start = today;
        regDate_end = today;
    };

    var searchConditionSet = new Object();
    searchConditionSet.biz_name = $("input[name=biz_name]").val();                      //상호명
    searchConditionSet.biz_ssn = $("input[name=biz_ssn]").val();                        //사업자등록번호
    searchConditionSet.biz_tel = $("input[name=biz_tel]").val();                        //전화번호
    searchConditionSet.biz_ceo = $("input[name=biz_ceo]").val();                        //대표자
    searchConditionSet.biz_addr = $("input[name=biz_addr]").val();                      //주소
    searchConditionSet.status = $("#search_reg_status option:selected").val();                 //상태
    searchConditionSet.media = $("#reg_type option:selected").val();                    //가입매체
    searchConditionSet.join_from_date = regDate_start;   //가입일 From
    searchConditionSet.join_to_date = regDate_end;       //가입일 To
    searchConditionSet.now_page = pGetCurrentPage;
    searchConditionSet.crudGbn = "view_table";
    searchConditionSet.mms_yn = $("#search_mms_yn option:selected").val(); 
    return searchConditionSet;
};

//대표자명을 클릭할 시 회색으로 칠해주는 함수
function click_CEO(clicked_CEO){
    for(var px=0;px<$("#buyer_tbody_id > tr").length;px++){
        document.getElementById(`CEO_idx_`+px).style.backgroundColor = "white";
    }
    document.getElementById(clicked_CEO).style.backgroundColor = "rgb(217,217,217)";
};


function removeLayerPop(){
    $(".layerPopArea").css("display" ,"none");
};

//대표자명 클릭 시 얻는 테이블 값을 포인트 등록으로 넘김
function checkingBuyerName(){
    var tbody_rows = document.getElementById("buyer_tbody_id").getElementsByTagName("tr");  //테이블의 tr값
    var cells;           //테이블의 td값
    var biz_ceo_bg;      //대표자명 바탕색  -- 바탕색을 기준점으로 행값을 가져온다
    var biz_ssn;         //사업자등록번호
    var biz_name;        //상호명
    var tmp_biz_name;    //상호명[사업자등록번호]
    var tmpbiz_ssn;      //임시 사업자등록번호
    var reg_status;      //승인상태

    if(tbody_rows.length<1){
        return "";
    }
    else{
        for(var ix=0; ix<tbody_rows.length; ix++){
            cells = tbody_rows[ix].getElementsByTagName("td");
            biz_ceo_bg = cells[3].attributes[2].value;
            biz_ceo_bg = biz_ceo_bg.split(":")[2];
            reg_status = cells[1].innerText;
    
            //대표자명의 style이 지정되어 있다면 값을 구한다
            if(biz_ceo_bg !=" white;" && biz_ceo_bg !=undefined){
                tmp_biz_name = cells[2].textContent;
    
                //대괄호 []를 기준으로 안쪽에 있는 사업자등록번호를 가지고 옴
                tmpbiz_ssn = tmp_biz_name.split("[")[1];
                biz_ssn = tmpbiz_ssn.split("]")[0];
    
                //대괄호 [를 기준으로 상호명을 가지고 옴
                biz_name = tmp_biz_name.split("[")[0];
            };
        };
        //JSONData에 값을 넣음
        var JSONData = new Object();
        JSONData.biz_ssn = biz_ssn;
        JSONData.biz_name = biz_name;
        JSONData.reg_status = reg_status;
        return JSONData;
    };
};

function setDateAll(){
    var regDate_start = "1999-01-01";
    var regDate_end = "2100-12-31";
    $("#search_reg_date_start").val(regDate_start);
    $("#search_reg_date_end").val(regDate_end);
    $("#search_reg_date_start").css("color",  "white");
    $("#search_reg_date_end").css("color",  "white");
};

function makeBlackFont(){
    $("#search_reg_date_start").css("color",  "black");
    $("#search_reg_date_end").css("color",  "black");
};


function excelDownload()
{
    //검색인자는 불필요
    var paramsSearchCondition = {};

    var regDate_start = $("input[name=search_reg_date_start]").val();
    var regDate_end = $("input[name=search_reg_date_end]").val();
    paramsSearchCondition.biz_name = $("input[name=biz_name]").val();                      //상호명
    paramsSearchCondition.biz_ssn = $("input[name=biz_ssn]").val();                        //사업자등록번호
    paramsSearchCondition.biz_tel = $("input[name=biz_tel]").val();                        //전화번호
    paramsSearchCondition.biz_ceo = $("input[name=biz_ceo]").val();                        //대표자
    paramsSearchCondition.biz_addr = $("input[name=biz_addr]").val();                      //주소
    paramsSearchCondition.status = $("#search_reg_status option:selected").val();                 //상태
    paramsSearchCondition.media = $("#reg_type option:selected").val();                    //가입매체
    paramsSearchCondition.join_from_date = regDate_start;   //가입일 From
    paramsSearchCondition.join_to_date = regDate_end;       //가입일 To
    paramsSearchCondition.mms_yn = $("#search_mms_yn option:selected").val(); 
    
    //excel download
    var returnSetArray;
    $.ajax({
        url: "/uGetBuyerListAdm?" + $.param({"authPage": "cBuyerListAdm.js", "searchCondition": paramsSearchCondition, "excelOption": "excel"}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false, traditional: true,
        contentType: "application/json; charset=utf-8",
        success: function(response){
            var returnSetArray = response.returnvalue;
            if(response.errorcode == "PFERR_CONF_0000"){
                var date_str = date_to_str(new Date());
                var fileName = "구매회원_" + date_str;
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
/* ------------------ end of source ----------------------------*/