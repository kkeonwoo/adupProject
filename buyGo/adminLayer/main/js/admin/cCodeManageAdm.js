/****************************************************************************************************
module명: cCodeManageAdm.js
creator: 정길웅
date: 2022.03.31
version 1.0
설명: 사용자에게 공통 코드를 보여주는 화면
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

async function reDrawData(pselectedPage){
    await view_Data(pselectedPage);
};

//조회 함수
async function getCodeManageInfo(pGetSearchCondition){
    try{
        await $.ajax({
            url: "/uGetCodeManageListAdm?" + $.param({"authPage" : "cCodeManageAdm.js", "searchCondition":pGetSearchCondition}),
            type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function(response){
                var returnSetArray = response.returnvalue;
                var innerText = "";
    
                if(response.errorcode == "PFERR_CONF_0000"){
    
                    $("#txt_total_count").text(response.totalCount);
                    paging(response.totalCount, 10, pGetSearchCondition.now_page);
    
                    var start_number=0;
                    if (response.totalCount == "" || response.totalCount == undefined){
                        start_number = response.totalCount;
                    }
                    else{
                        if(Number($(".page").find("a.on")[0].text)==undefined){
                            //화면이 첫 조회될 때는 a.on이 없으니 txt_total_count 값을 넣는다
                            start_number = Number(document.getElementById("txt_total_count").innerText)
                        }
                        else{
                            start_number= Number(document.getElementById("txt_total_count").innerText) - 
                            10*(Number($(".page").find("a.on")[0].text)-1);
                        };
                    };
                    //value에 rowsequence값 넣기
                    for(var ix=0; ix<returnSetArray.length; ix++){
                        innerText = innerText + `<tr>`;
                        innerText = innerText + `<td><input type="checkbox" name="input_codeSelect" id="checkbox_`+ (ix+1) + `" value="${returnSetArray[ix].ROW_SEQUENCE}" onclick="edit_Data()"></td>`;
                        innerText = innerText + `<td>`+ (start_number-ix) + `</td>`;
                        innerText = innerText + `<td id="codeID_`+ (ix+1) + `">${returnSetArray[ix].CODE_ID}</td>`;
                        innerText = innerText + `<td id="codeValue_`+ (ix+1) + `">${returnSetArray[ix].CODE_VALUE}</td>`;
                        innerText = innerText + `<td id="codeDescription_`+ (ix+1) + `">${returnSetArray[ix].CODE_COMMENTS}</td>`;
                        innerText = innerText + `<td id="codeGbn_`+ (ix+1) + `" style="display:none;">1</td>`;
                        innerText = innerText + `<td id="tmpCodeID_`+ (ix+1) + `" style="display:none;">${returnSetArray[ix].CODE_ID}</td>`;
                        innerText = innerText + `<td id="tmpCodeValue_`+ (ix+1) + `" style="display:none;">${returnSetArray[ix].CODE_VALUE}</td>`;
                        innerText = innerText + `<td id="tmpCodeDescription_`+ (ix+1) + `" style="display:none;">${returnSetArray[ix].CODE_COMMENTS}</td>`;
                    }
                    document.getElementById("adm_code_table").innerHTML = innerText;
    
                }
                else if(response.errorcode == "PFERR_CONF_0050"){
                    $("#txt_total_count").text(0);
                    //화면에 1페이지 설정
                    paging(1,10,1);
                    innerText = innerText + `<td colspan="8" align="center" style="height:100px;">등록된 데이터가 없습니다</td>`
                    document.getElementById("adm_code_table").innerHTML = innerText;
                }
                else if(response.errorcode == "PFERR_CONF_0059"){
                    location.href = response.returnpage;
                    alert(response.errormessage);
                }
                else{
    
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
    }
    catch(e){
        console.log(e.message);
    }
};

//등록 함수
async function setCodeUpdateInfo(pSearchCondition, pJsonData){
    try {   
        await $.ajax({
            url: "/uGetCodeManageListAdm?" + $.param({"authPage" : "cCodeManageAdm.js", "searchCondition":pSearchCondition, "pJsonData":pJsonData}),
            type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function(response){
                var returnSetArray = response.returnvalue;
                if(response.errorcode == "PFERR_CONF_0000"){
                    alert(response.errormessage);
                    return "success"; 
                }
                else if(response.errorcode == "PFERR_CONF_0059"){
                    location.href = response.returnpage;
                    alert(response.errormessage);
                }
                else{
                    alert(response.errormessage);
                    return "fail";
                }
            },
            error: function(xhr, textStatus, e) {
                console.log("[error] : " + textStatus);
                alert("에러 : IT 운영자에게 문의 바랍니다");
                return "fail";
            }
        });
        }
    catch(e){
        console.log(e.message);
    }

}

function add_Row(){
    var tbody = document.getElementById("adm_code_table");
    var totalRow = tbody.rows.length;
    var row = tbody.insertRow(totalRow);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);

    if(tbody.innerHTML == '<tr><td colspan="8" align="center" style="height:100px;">등록된 데이터가 없습니다</td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>'){
        tbody.innerHTML = "";
        tbody.innerHTML = `<tr><td><input type="checkbox" name="input_codeSelect" id="checkbox_1" onclick="edit_Data()" checked=""></td><td>추가</td><td><div id="codeID_1"><input type="text" style="width:130px" id="codeID_input1" name="input_codeID" value="" maxlength="20"></div></td><td><div id="codeValue_1"><input type="text" style="width:150px" id="codeValue_input1" name="input_codeValue" value="" maxlength="32"></div></td><td><div id="codeDescription_1"><input type="text" style="width:650px" id="codeDescription_input1" name="input_codeDescription" value="" maxlength="300"></div></td><td><div id="codeGbn_1" style="display:none">0</div></td></tr>`;
    }
    else{
        cell1.innerHTML = `<input type="checkbox" name="input_codeSelect" id="checkbox_`+(totalRow+1)+`" onclick="edit_Data()" checked>`;
        cell2.innerHTML = "추가";
        cell3.innerHTML = `<div id="codeID_`+(totalRow+1)+`"><input type="text" style="width:130px" id="codeID_input`+(totalRow+1)+`" name="input_codeID" value="" maxlength="30" /></div>`;
        cell4.innerHTML = `<div id="codeValue_`+(totalRow+1)+`"><input type="text" style="width:150px" id="codeValue_input`+(totalRow+1)+`" name="input_codeValue" value="" maxlength="32" />`;
        cell5.innerHTML = `<div id="codeDescription_`+(totalRow+1)+`"><input type="text" style="width:650px" id="codeDescription_input`+(totalRow+1)+`" name="input_codeDescription" value="" maxlength="300" />`;
        cell6.innerHTML = `<div id="codeGbn_`+(totalRow+1)+`" style="display:none">0</div>`;
    }
};

//삭제 버튼 누를 때 작동하는 함수
async function delete_Data(){
    var chkVal = $("input:checkbox[name='input_codeSelect']:checked");

    //check할 대상이 있을때만 수행한다.
    if(chkVal.length>0)
    {
        var JSONData = new Array();
        var tmpJsonDataRow ={};
        
        chkVal.each(function(){
            tmpJsonDataRow ={};
            tmpJsonDataRow.checkVal = $(this).val();
            tmpJsonDataRow.uiOrDbCodeGbn = "1";
            JSONData.push(tmpJsonDataRow);
        });

        //수정할 것이 있을때만 수행한다.
        if(JSONData.length>0)
        {
            var getSearchCondition = {
                crudGbn : "update_delete",
                now_page : 1,
                rows_per_page : 10
            };

            var rtn = await setCodeUpdateInfo(getSearchCondition, JSONData);
            if(rtn="success"){
                await view_Data(1);
            };
        };
    };
};

//DB를 화면에 보여주는 함수
//등록버튼, 조회버튼, 화면이 켜질 시 동작함
async function view_Data(pGetCurrentPage){
    var getSearchCondition = {
        crudGbn : "inquiry",
        now_page : pGetCurrentPage,
        rows_per_page : 10
    };
    await getCodeManageInfo(getSearchCondition);
};

// 등록 버튼 누를 때 작동하는 함수
async function update_Data(){
    var checkVal = $("input:checkbox[name='input_codeSelect']:checked");
    //check 처리한 Data가 있다면 수정 대상 또는 등록 대상이 있는지를 검사해서 수행한다.
    if(checkVal.length>0)
    {
        var JSONData = new Array();
        var tmpJsonDataRow ={};
        var checkbox_number;
        var codeID_input;
        var codeValue_input;
        var codeDescription_input;
        var chkAbnormalValue="0";

        checkVal.each(function(index,item)
        {
            checkbox_number = item.id.split("_")[1];
            codeID_input = document.getElementById("codeID_input"+checkbox_number);
            codeValue_input = document.getElementById("codeValue_input"+checkbox_number);
            codeDescription_input = document.getElementById("codeDescription_input"+checkbox_number);
            
            if(codeID_input==null ||codeValue_input==null || codeDescription_input==null){
                chkAbnormalValue="1";
            }
            else if(codeID_input.value=="" || codeValue_input.value=="" || codeDescription_input.value=="")
            {
                chkAbnormalValue="1";
            }
            else
            {
                tmpJsonDataRow ={};
                tmpJsonDataRow.checkVal = $(this).val();
                tmpJsonDataRow.codeID_input = codeID_input.value;
                tmpJsonDataRow.codeValue_input = codeValue_input.value;
                tmpJsonDataRow.codeDescription_input = codeDescription_input.value;
                tmpJsonDataRow.uiOrDbCodeGbn = document.getElementById("codeGbn_"+checkbox_number).innerText;
                JSONData.push(tmpJsonDataRow);
            };
        });

        if(chkAbnormalValue!="0")
        {
            alert("입력 하신 값중에 ID, 값, 설명이 없는 행이 있습니다. 체크 바랍니다.");
        }
        else if(JSONData.length>0)
        {
            //수정할 것이 있다면 그때 수행한다.
            var getSearchCondition = {
                crudGbn : "update_insert",
                now_page : 1,
                rows_per_page : 10
            };

            var rtn = await setCodeUpdateInfo(getSearchCondition, JSONData);
            if(rtn="success"){
                await view_Data(1);
            };
        };
    };
    
};

//체크박스를 눌러 수정을 한 후 등록버튼을 누를 때 작동하는 함수
function edit_Data(){
    var tbody = document.getElementById("adm_code_table");
    var totalRow = tbody.rows.length;
    var codeID_value;
    var codeValue_value;
    var codeDescription_value;
    for(var ix=1; ix<=totalRow; ix++){
        if($("#checkbox_"+ix).prop("checked")){
            if(document.getElementById("codeID_input"+ix) == null || document.getElementById("codeValue_input"+ix)==null || document.getElementById("codeDescription_input"+ix)==null){            //input box로 바꿔주는 함수
                codeID_value = document.getElementById("codeID_"+ix).innerText;
                codeValue_value = document.getElementById("codeValue_"+ix).innerText;
                codeDescription_value = document.getElementById("codeDescription_"+ix).innerText;
                document.getElementById("codeID_"+ix).innerHTML = `<input type='text' style='width:130px' id='codeID_input${ix} name='input_codeID' value='${codeID_value}' maxlength='30'>`
                document.getElementById("codeValue_"+ix).innerHTML = "<input type='text' style='width:150px' id='codeValue_input"+ix+"' name='input_codeValue' value='"+codeValue_value+"' maxlength='32'>"
                document.getElementById("codeDescription_"+ix).innerHTML = "<input type='text' style='width:650px' id='codeDescription_input"+ix+"' name='input_codeDescription' value='"+codeDescription_value+"' maxlength='300'>"
            };
        }
        else if ($("#checkbox_"+ix).prop("checked")==false)
        {
            if(document.getElementById("codeGbn_"+ix).innerText == "1"){
                //기존의 값을 돌려줌
                codeID_value = document.getElementById("tmpCodeID_"+ix).innerText;
                codeValue_value = document.getElementById("tmpCodeValue_"+ix).innerText;
                codeDescription_value = document.getElementById("tmpCodeDescription_"+ix).innerText;
                document.getElementById("codeID_"+ix).innerText = codeID_value;
                document.getElementById("codeValue_"+ix).innerText = codeValue_value;
                document.getElementById("codeDescription_"+ix).innerText = codeDescription_value;
            };
        };
    };
};

//------------------------------------ end of source ------------------------------------------------------------------------