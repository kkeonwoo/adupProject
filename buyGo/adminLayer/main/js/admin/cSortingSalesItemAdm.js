/****************************************************************************************************
module명: cSortingSalesItemAdm.js
creator: 윤희상
date: 2022.03.17
version 1.0
설명: 관리자 페이지에서 상품정렬 페이지용 js
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
        
function searchSortingList(){
   var getSearchCondition = setSearchConditionToJson();
   var getListCount = $("#list_cnt option:selected").val();

   getSalesItemSortListAjax(getSearchCondition, getListCount);
   unUseList(["table_row"]);

   // $("#sb-sortable li").on("click",function(){
   //    var blnchecked = $(this).find("input:checkbox").prop("checked");
   //    $(this).find("input:checkbox").prop("checked", !blnchecked);
      
   //    if($(this).find("input:checkbox").prop("checked") == true){
   //       $(this).addClass("sb-selected");
   //    } else {
   //       $(this).removeClass("sb-selected");
   //    }
         
   // });

  
   // $("#sb-sortable li [name=sortidx]").on("click",function(){
   //    var blnchecked = $(this).prop("checked");
   //    $(this).prop("checked", !blnchecked);
      
   //    if($(this).prop("checked") == true){
   //       $(this).addClass("sb-selected");
   //    } 
   //    else {
   //       $(this).removeClass("sb-selected");
   //    };
   // });
  
   // $("#sb-sortable [name=sort_idx]").on("click",function(){
   //    var blnchecked = $(this).prop("checked");
   //    $(this).prop("checked", !blnchecked);
      
   //    if($(this).prop("checked") == true){
   //        $(this).addClass("sb-selected");
   //    } else {
   //        $(this).removeClass("sb-selected");
   //    };
   // });	
};
function reSearch(){
   useList(["table_row"]);
};
function saveSortGoods() {
   var liArr = $("#sb-sortable").find("li").find("span").children("input[name=idx]");
   var valArr = new Array();
   for(var lx=0; lx<liArr.length; lx++){
      valArr.push(liArr[lx].value);
   }

   $.ajax({
      url: "/uEditSalesItemSortList", 
      type: "POST", async: false,  
      data:JSON.stringify({"searchCondition":setSearchConditionToJson(), "list" : valArr}),
      dataType: "JSON", crossOrigin: false, cache: false,
      contentType: "application/json; charset=utf-8",
      success: function(response){
         console.log(response);
         if(response.errorcode == "PFERR_CONF_0000"){
            alert('수정 완료 되었습니다.');
            getSalesItemSortListAjax(setSearchConditionToJson(), $("#list_cnt option:selected").val());
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
   //상품정렬 저장버튼 클릭
   //주간행사 상품의 경우 리스트에 뿌려져 있는 순서대로 10001 부터 순차적으로 부여
   //카테고리행사 상품 : 20001~
   //일반행사 상품 : 30001~
   //sendAjaxTarget("frm", "/admin/productManagement/pmSortList_process", "ajaxHandler");
};
// 상품코드
function ajaxHandler(data) {
   alert('수정 완료 되었습니다.');
   sendSelfForm('frm');
};
function setSearchConditionToJson(){
   var searchConditionSet = new Object();
   
   searchConditionSet.search_fate_yn = $("input[name=search_fate_yn]:checked").val(); //행사여부
   searchConditionSet.search_sales_gb = $("input[name=search_sales_gb]:checked").val(); //판매상태
   searchConditionSet.search_appr_gb = $("input[name=search_appr_gb]:checked").val(); //승인여부

   return searchConditionSet;
};

function getSalesItemSortListAjax(psearchConditionSet, plistCount){
    //List조회해서 받아오는 ajax 생성
   $.ajax({
      url: "/uGetSalesItemSortList?"  + $.param({"searchCondition":psearchConditionSet, "listCount" : plistCount}),
      type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
      contentType: "application/x-www-form-urlencoded; charset=utf-8",
      success: function(response){
         if(response.errorcode == "PFERR_CONF_0000"){
            $(".txt_total").find("strong")[0].innerText = response.returnTotalCNT;
            var rtnArray = response.returnvalue;
            var tmpLiTag;
            var tmpSpanTag;
            var tmpInputTag;
            document.getElementById("sb-sortable").innerHTML = "";
            for(var sx=0; sx<rtnArray.length; sx++){
               tmpLiTag = document.createElement("li");
               tmpLiTag.style = "border:1px solid #356; height:26px; margin:5px; padding:4px;";
               tmpSpanTag = document.createElement("span");
               tmpSpanTag.style = "display:inline-block; width:20px;";

               tmpInputTag = document.createElement("input");
               tmpInputTag.setAttribute("type", "hidden");
               tmpInputTag.setAttribute("name", "idx");
               tmpInputTag.setAttribute("value", rtnArray[sx].SALES_ITEM_ID);

               tmpSpanTag.appendChild(tmpInputTag);

               tmpInputTag = document.createElement("input");
               tmpInputTag.setAttribute("type", "hidden");
               tmpInputTag.setAttribute("name", "db_dis_sort");
               tmpInputTag.setAttribute("value", rtnArray[sx].SALES_ITEM_SORT);
               
               tmpSpanTag.appendChild(tmpInputTag);

               tmpInputTag = document.createElement("input");
               tmpInputTag.setAttribute("type", "checkbox");
               tmpInputTag.setAttribute("name", "sortidx");
               tmpInputTag.setAttribute("value", rtnArray[sx].SALES_ITEM_ID);
               
               tmpSpanTag.appendChild(tmpInputTag);

               tmpLiTag.appendChild(tmpSpanTag);
               
               $("#sb-sortable li").on("click",function(){
                  var blnchecked = $(this).find("input:checkbox").prop("checked");
                  $(this).find("input:checkbox").prop("checked", !blnchecked);
                  
                  if($(this).find("input:checkbox").prop("checked") == true){
                      $(this).addClass("sb-selected");
                  } else {
                      $(this).removeClass("sb-selected");
                  };
               });
  
              
               $("#sb-sortable li [name=sortidx]").on("click",function(){
                  var blnchecked = $(this).prop("checked");
                  $(this).prop("checked", !blnchecked);
                  
                  if($(this).prop("checked") == true){
                     $(this).addClass("sb-selected");
                  } else {
                     $(this).removeClass("sb-selected");
                  };
                     
               });
              
               $("#sb-sortable [name=sort_idx]").on("click",function(){
                  var blnchecked = $(this).prop("checked");
                  $(this).prop("checked", !blnchecked);
                  
                  if($(this).prop("checked") == true){
                     $(this).addClass("sb-selected");
                  } else {
                     $(this).removeClass("sb-selected");
                  };
                     
               });	
               
               tmpSpanTag = document.createElement("span");
               tmpSpanTag.style="display:inline-block; width:150px; height:20px; padding:3px;"
               tmpSpanTag.innerText = rtnArray[sx].MENU_P_NAME;
               tmpLiTag.appendChild(tmpSpanTag);

               tmpSpanTag = document.createElement("span");
               tmpSpanTag.style="display:inline-block; width:150px; height:20px; padding:3px;"
               tmpSpanTag.innerText = rtnArray[sx].MENU_NAME;
               tmpLiTag.appendChild(tmpSpanTag);

               tmpSpanTag = document.createElement("span");
               tmpSpanTag.style="display:inline-block; width:540px; height:20px; padding:3px;"
               tmpSpanTag.innerText = rtnArray[sx].SALES_ITEM_NAME;
               tmpLiTag.appendChild(tmpSpanTag);

               tmpSpanTag = document.createElement("span");
               tmpSpanTag.style="display:inline-block; width:60px; height:20px; padding:3px;"
               tmpSpanTag.innerText = rtnArray[sx].SALES_ITEM_SORT;
               tmpLiTag.appendChild(tmpSpanTag);

               document.getElementById("sb-sortable").appendChild(tmpLiTag);

               $("#sb-sortable li").on("click",function(){
                  var blnchecked = $(this).find("input:checkbox").prop("checked");
                  $(this).find("input:checkbox").prop("checked", !blnchecked);
                  
                  if($(this).find("input:checkbox").prop("checked") == true){
                      $(this).addClass("sb-selected");
                  } else {
                      $(this).removeClass("sb-selected");
                  };
               });
  
              
               $("#sb-sortable li [name=sortidx]").on("click",function(){
                  var blnchecked = $(this).prop("checked");
                  $(this).prop("checked", !blnchecked);
                  
                  if($(this).prop("checked") == true){
                     $(this).addClass("sb-selected");
                  } else {
                     $(this).removeClass("sb-selected");
                  };
                     
               });
              
               $("#sb-sortable [name=sort_idx]").on("click",function(){
                  var blnchecked = $(this).prop("checked");
                  $(this).prop("checked", !blnchecked);
                  
                  if($(this).prop("checked") == true){
                     $(this).addClass("sb-selected");
                  } else {
                     $(this).removeClass("sb-selected");
                  };
                     
               });	
            };
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