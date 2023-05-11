/****************************************************************************************************
module명: cGetAdminCommonModule.js
creator: 윤희상
date: 2022.03.07
version 1.0
설명: ADMIN 검색조건 가져오기 위한 함수 모음
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
 * --------------------------------------------
 * 카테고리 Lv 조회 모듈(searchCategory)
 * Parameter : 화면목록Lov Data, Level Data
 * --------------------------------------------
 * 공급사 목록 조회 모듈(searchSupplierList)
**********************************************/
function useList(pclassName){
   //활성화 할 가장 겉 껍데기의 className을 배열로 넘김
   for(var px = 0; px < pclassName.length; px++){
      $(`.${pclassName[px]} *`).removeAttr('disabled');
   };
};

function unUseList(pclassName){
   //비활성화 할 가장 겉 껍데기의 className을 배열로 넘김
   for(var px = 0; px < pclassName.length; px++){
      $(`.${pclassName[px]} *`).prop('disabled',true);
   };
};

function searchCategory(pLevel, pSelectPMenu, pTagId){
   //Category ajax 생성
   $.ajax({
      url: "/uGetAdminMenuInfo?"  + $.param({"menuLevel":pLevel, "selectPMenu":pSelectPMenu}),
      type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
      contentType: "application/x-www-form-urlencoded; charset=utf-8",
      success: function(response){
         var innerText = `<option value="">-전체-</option>`;
         var returnSetArray = response.returnvalue;

         if(response.errorcode == "PFERR_CONF_0000"){
            for(var mx=0; mx<returnSetArray.length; mx++){
               innerText = innerText + `<option value="${returnSetArray[mx].MENU_LEVEL_ID}">${returnSetArray[mx].MENU_NAME}</option>`;
            }
         }
         else if(response.errorcode == "PFERR_CONF_0059"){
            location.href = response.returnpage;
            alert(response.errormessage);
         };
         
         document.getElementById(pTagId).innerHTML = innerText;
      },
      error: function(qXHR, textStatus, errorThrown) {
         alert("[err messager]:" + textStatus);
      },
      complete:function(data,textStatus) {
         console.log("[complete] : " + textStatus);
      }
   });
};

function searchSupplierList(pTagId){
   //공급사 목록 ajax 생성
   $.ajax({
      url: "/uGetSupplierDeal?"  + $.param({"authPage" : "cGoodsCategoryAdm.js"}),
      type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
      contentType: "application/x-www-form-urlencoded; charset=utf-8",
      success: function(response){
         var returnSetArray = response.returnvalue;
         var innerText = ``;
         innerText = innerText + `<option value="">-전체-</option>`;
         if(response.errorcode == "PFERR_CONF_0000"){
            for(var hx=0; hx<returnSetArray.length; hx++){
               innerText = innerText + `<option value="${returnSetArray[hx].ROW_SEQUENCE}">${returnSetArray[hx].NADLE_SUPPLIER_TRANSACTION_TYPE}</option>`;
            }
            document.getElementById(pTagId).innerHTML = innerText;
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

function searchHtmlList(){
   //화면 목록 생성
   $.ajax({
      url: "/uGetHtmlList?"  + $.param({"authPage" : "cGoodsCategoryAdm.js"}),
      type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
      contentType: "application/x-www-form-urlencoded; charset=utf-8",
      success: function(response){
         if(response.errorcode == "PFERR_CONF_0000"){
            var returnSetArray = response.returnvalue;
            var innerText = ``;
            innerText = innerText + `<option value="aaa">test</option>`;
            for(var hx=0; hx<returnSetArray.length; hx++){
               innerText = innerText + `<option value="${returnSetArray[hx].UI_PAGE_ID}">${returnSetArray[hx].UI_PAGE_ID}</option>`;
            }
            document.getElementById("search_html").innerHTML = innerText;
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

function setDatePrev(pDateID, pDayCount){ 
   //원하는 날짜로 설정
   //pDateID : inputTag ID
   //pDayCount : -day 할 값
   var date = new Date();
   date.setDate(date.getDate()-pDayCount);
   console.log("date", date);
   var year = date.getFullYear();
   var month = ("0" + (1 + date.getMonth())).slice(-2);
   var day = ("0" + date.getDate()).slice(-2);
   
   var resDate = year + "-" + month + "-" + day;

   $("#"+pDateID).val(resDate);
};

//현재날짜로 설정
function setToday(pSetTodayDateID){
   var date = new Date();
   var year = date.getFullYear();
   var month = ("0" + (1 + date.getMonth())).slice(-2);
   var day = ("0" + date.getDate()).slice(-2);

   var resDate = year + "-" + month + "-" + day;

   $("#"+pSetTodayDateID).val(resDate);
};

//날짜 초기화
function clearRegDate(pStartDateId, pEndDateID){
   $("#"+pStartDateId).val("");
   $("#"+pEndDateID).val("");
};

//전체 체크 및 해제
function selectAll(pselectAll, pName){
   var checkboxes = document.getElementsByName(pName);
   checkboxes.forEach((checkbox) => {
      checkbox.checked = pselectAll.checked;
   });
};

function postPop(pzipCodeName, pAdressName1, pAdressName2) {
   new daum.Postcode({
       oncomplete: function(data) {
           // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

           // 각 주소의 노출 규칙에 따라 주소를 조합한다.
           // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
           var addr = ''; // 주소 변수
           var extraAddr = ''; // 참고항목 변수

           //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
           if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
               addr = data.roadAddress;
           } else { // 사용자가 지번 주소를 선택했을 경우(J)
               addr = data.jibunAddress;
           }

           // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
           if(data.userSelectedType === 'R'){
               // 법정동명이 있을 경우 추가한다. (법정리는 제외)
               // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
               if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                   extraAddr += data.bname;
               }
               // 건물명이 있고, 공동주택일 경우 추가한다.
               if(data.buildingName !== '' && data.apartment === 'Y'){
                   extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
               }
               // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
               if(extraAddr !== ''){
                   extraAddr = ' (' + extraAddr + ')';
               }
               // 조합된 참고항목을 해당 필드에 넣는다.
               //document.getElementById("sample6_extraAddress").value = extraAddr;
           
           } else {
               //document.getElementById("sample6_extraAddress").value = '';
           }

           // 우편번호와 주소 정보를 해당 필드에 넣는다.
           document.getElementById(pzipCodeName).value = data.zonecode;
           document.getElementById(pAdressName1).value = addr + extraAddr;
           // 커서를 상세주소 필드로 이동한다.
           document.getElementById(pAdressName2).focus();
       }
   }).open();
};

//rowspan용
$.fn.mergeClassRowspan = function (colIdx, porderIdIndex) {
   return this.each(function () {
       var that;
       var rowspan;
       $('tr', this).each(function (row) {
           $('td:eq(' + colIdx + ')', this).filter(':visible').each(function (col) {
               if(($(this).html() == $(that).html()) && ($('td:eq(' + porderIdIndex + ')', $(this).parent()).html() == $('td:eq(' + porderIdIndex + ')', $(that).parent()).html()))  {
                   if ($(that).attr("rowspan") == undefined) {
                       $(that).attr("rowspan",1);
                       rowspan = $(that).attr("rowspan");
                   }
                   else{
                       rowspan = $(that).attr("rowspan"); 
                   }
                   rowspan = Number(rowspan)+1;
                   $(that).attr("rowspan",rowspan);
                   $(this).hide();

               } else {
                   that = this;
               }

               // set the that if not already set
               that = (that == null) ? this : that;
           });
       });
   });
};

function date_to_str(format)
{
   var year = format.getFullYear();
   var month = format.getMonth() + 1;
   if(month<10) month = '0' + month;
   var date = format.getDate();
   if(date<10) date = '0' + date;
   var hour = format.getHours();
   if(hour<10) hour = '0' + hour;
   var min = format.getMinutes();
   if(min<10) min = '0' + min;
   var sec = format.getSeconds();
   if(sec<10) sec = '0' + sec;

   return year + "" + month + "" + date + "_" + hour + "" + min + "" + sec;

}