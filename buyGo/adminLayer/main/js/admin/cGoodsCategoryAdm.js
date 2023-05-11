/****************************************************************************************************
module명: cGoodsCategoryAdm.js
creator: 윤희상
date: 2022.02.16
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

const { escapeSelector } = require("jquery");

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
    eventSearchSalesItem("a", $("#list_cnt option:selected").val(), pselectedPage); //데이터
};

// 상품목록이 재 조회되어야 하는 이벤트가 발생했을 때
function eventSearchSalesItem(gb, pGetGlobalListCount, pGetCurrentPage){
   
    var getSearchCondition = setSearchConditionToJson();
    gJSGetListCount = pGetGlobalListCount;

    if(gb == "btn"){
        searchSalesItemListAdmin(getSearchCondition, pGetGlobalListCount, 1);
        searchSalesItemSummaryAdmin(getSearchCondition);
    }
    else if(gb == "selectBox"){
        searchSalesItemListAdmin(getSearchCondition, pGetGlobalListCount, 1);
        searchSalesItemSummaryAdmin(getSearchCondition);
    }
    else if(gb == "excel"){
        searchSalesItemListAdmin(getSearchCondition, pGetGlobalListCount, 1, gb);
    }
    else{
        searchSalesItemListAdmin(getSearchCondition, pGetGlobalListCount, pGetCurrentPage);
    };
};

function setSearchConditionToJson(){

    var searchConditionSet = new Object();

    searchConditionSet.type = $("input[name=type]").val(); 
    searchConditionSet.search_html = $("#search_html option:selected").val(); //카테고리1
    searchConditionSet.search_supplier_ssn = $("#search_supplier_ssn option:selected").val();  //공급사
    searchConditionSet.search_goods_name = $("input[name=search_goods_name]").val(); //상품명
    searchConditionSet.search_cate1_idx = $("#search_cate1_idx option:selected").val(); //카테고리1
    searchConditionSet.search_cate2_idx = $("#search_cate2_idx option:selected").val(); //카테고리2
    searchConditionSet.search_cate3_idx = $("#search_cate3_idx option:selected").val(); //카테고리3
    searchConditionSet.search_goods_cd = $("input[name=search_goods_cd]").val(); //상품코드
    searchConditionSet.search_goods_barcode = $("input[name=search_goods_barcode]").val(); //바코드
    searchConditionSet.search_sell_price_min = $("input[name=search_sell_price_min]").val(); //판매가격 최소
    searchConditionSet.search_sell_price_max = $("input[name=search_sell_price_max]").val(); //판매가격 최대
    searchConditionSet.search_fate_yn = $("input[name='search_fate_yn']:checked").val(); //행사여부
    searchConditionSet.search_sales_gb = $("input[name='search_sales_gb']:checked").val(); //판매상태
    searchConditionSet.search_appr_gb = $("input[name='search_appr_gb']:checked").val(); //승인여부
    searchConditionSet.search_sales_chilled = $("input[name='search_sales_chilled']:checked").val(); //상품형태
    searchConditionSet.search_sort = $("input[name='search_sort']:checked").val(); //정렬
    searchConditionSet.search_stock1 = $("input[name=search_stock1]").val(); //재고 최소
    searchConditionSet.search_stock2 = $("input[name=search_stock2]").val(); //재고 최소
    searchConditionSet.search_reg_date_start = $("input[name=search_reg_date_start]").val(); //등록 시작일
    searchConditionSet.search_reg_date_end = $("input[name=search_reg_date_end]").val(); //등록 종료일

    return searchConditionSet;
};

function searchSalesItemListAdmin(pSearchCondition, pListCount, pPageIndex, pgb){
    //List조회해서 받아오는 ajax 생성
    // console.log("pSearchCondition", pSearchCondition);
    // console.log("pListCount", pListCount);
    // console.log("pPageIndex", pPageIndex);
    $.ajax({
        url: "/uGetSalesItemAdm?"  + $.param({"authPage" : "cGoodsCategoryAdm.js", "searchCondition":pSearchCondition, "listCount" : pListCount, "pageIndex" : pPageIndex, "GB":pgb}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            var returnSetArray = response.returnvalue;
            var innerText = "";
            
            if(response.errorcode == "PFERR_CONF_0000"){
                if(pgb == "excel"){
                    var date_str = date_to_str(new Date());
                    var fileName = "상품리스트_" + date_str;
                    if(response.errorcode == "PFERR_CONF_0000"){
                        exportExcel(response.returnvalue, date_str, fileName);
                    };
                }
                else{
                    for(var ix=0; ix<returnSetArray.length; ix++){
                        innerText = innerText + `<tr>`;
                        innerText = innerText + `<td><input type="checkbox" name="idx" value="${returnSetArray[ix].SALES_ITEM_ID}"></td>`;
                        innerText = innerText + `<td>${returnSetArray[ix].SALES_ITEM_ID}</td>`;
                        innerText = innerText + `<td><img src="/eum/resources/temp/goods/${returnSetArray[ix].SALES_ITEM_IMAGE_FILE}_LIST.${returnSetArray[ix].IMG_FILE_EXT}" alt="${returnSetArray[ix].SALES_ITEM_ID}"></td>`;
                        innerText = innerText + `<td>${returnSetArray[ix].SALES_ITEM_CHANNEL_CATEGORY_NAME }</td>`;
                        innerText = innerText + `<td>${returnSetArray[ix].SALES_ITEM_REPR_STOCK_MGR_TYPE}</td>`;
                        innerText = innerText + `<td>`;
                        // innerText = innerText + `<a href='javascript:callLayerPop("/admin/productManagement/pmEditPop","idx=${returnSetArray[ix].SALES_ITEM_ID}", "document", 10);'>`;
                        innerText = innerText + `<a href='javascript:callLayerPop(${returnSetArray[ix].SALES_ITEM_ID});'>`;
                        innerText = innerText + `${returnSetArray[ix].SALES_ITEM_NAME}`;
                        innerText = innerText + `</a></td>`;
                        innerText = innerText + `<td>${returnSetArray[ix].SUPPLIER_SSN_NAME}</td>`;
                        innerText = innerText + `<td><input type="text" name="stock_Piece${returnSetArray[ix].SALES_ITEM_ID}" class="w55 text-center" maxlength="5" value="${returnSetArray[ix].SALES_ITEM_STOCK_QTY}"></td>`;
                        innerText = innerText + `<td><input type="text" name="sell_price${returnSetArray[ix].SALES_ITEM_ID}" class="w55 text-center" maxlength="6" value="${returnSetArray[ix].SALES_ITEM_PRICE}"></td>`;
                        innerText = innerText + `<td><input type="text" name="fate_price${returnSetArray[ix].SALES_ITEM_ID}" class="w55 text-center" maxlength="6" value="${returnSetArray[ix].NADLE_FATE_PRICE}"></td>`;
                        innerText = innerText + `<td><input type="text" name="unit_price1${returnSetArray[ix].SALES_ITEM_ID}" class="w55 text-center" maxlength="6" value="${returnSetArray[ix].NADLE_UNIT_PRICE1}"></td>`;
                        innerText = innerText + `<td><input type="text" name="unit_price2${returnSetArray[ix].SALES_ITEM_ID}" class="w55 text-center" maxlength="6" value="${returnSetArray[ix].NADLE_UNIT_PRICE2}"></td>`;
                        innerText = innerText + `<td><input type="text" name="unit_price3${returnSetArray[ix].SALES_ITEM_ID}" class="w55 text-center" maxlength="6" value="${returnSetArray[ix].NADLE_UNIT_PRICE3}"></td>`;
                        innerText = innerText + `<td><input type="text" name="unit_price4${returnSetArray[ix].SALES_ITEM_ID}" class="w55 text-center" maxlength="6" value="${returnSetArray[ix].NADLE_UNIT_PRICE4}"></td>`;
                        innerText = innerText + `<td>${returnSetArray[ix].SALES_ITEM_SORT}</td>`;
                        innerText = innerText + `<td>${returnSetArray[ix].SALES_ITEM_PROGRESS_NAME}</td>`;
                        innerText = innerText + `<td>${returnSetArray[ix].SALES_ITEM_APPROVE_NAME}</td>`;
                        innerText = innerText + `</tr>`;
                    }
                    paging(gJSTotalData, pListCount, pPageIndex);
                };
            }
            else if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            };
            if(pgb != "excel") document.getElementById("adm_sales_list").innerHTML = innerText;
        },
        error: function(qXHR, textStatus, errorThrown) {
            alert("[err messager]:" + textStatus);
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
};

function searchSalesItemSummaryAdmin(pSearchCondition){
   //Summary 데이터 조회 ajax 생성
    $.ajax({
        url: "/uGetSalesItemTotalCountAdm?"  + $.param({"authPage" : "cGoodsCategoryAdm.js", "searchCondition":pSearchCondition}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            }
            else if(response.errorcode == "PFERR_CONF_0000"){
                var returnSetArray = response.returnvalue;
                var innerText = "";

                var titleArr = $(".table_summary tbody tr")[0].children;
                // console.log($(".table_summary tbody tr")[0].children[0].innerText);
                var cnt=0;
                for(var tx=0; tx<titleArr.length; tx++){
                    cnt=0;
                    for(var cx=0; cx<returnSetArray.length; cx++){
                        if(titleArr[tx].innerText == returnSetArray[cx].TITLE){
                            cnt = returnSetArray[cx].CNT;
                        }
                    }
                    innerText = innerText + `<td class="comma">${(cnt).toLocaleString('ko-KR')}</td>`;
                };
                document.getElementById("summary_count").innerHTML = innerText;
                gJSTotalData = returnSetArray[0].CNT;
                $("#txt_total_count").text(gJSTotalData.toLocaleString('ko-KR'));
                
                paging(gJSTotalData, gJSGetListCount, 1);
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

//일괄수정하기 버튼
function btnAllEdit(){
    var r_salse = "";
    var r_stock = "";
    var r_appr = "";
    var r_sort = "";
    var r_price = "";
    
    r_salse = $("input[name='condiType_SALES']:checked").val(); //판매상태
    r_stock = $("input[name='condiType_STOCK']:checked").val(); //재고량
    if($("input[name=type]").val() != "SUPER"){
        r_appr = $("input[name='condiType_APPR']:checked").val(); //승인여부
        r_sort = $("input[name='condiType_SORT']:checked").val(); //정렬순서
        //<input type="text" name="modi_dis_sort" value=""></input>//정렬순서 변경시 들어갈 sort 값
        r_price = $("input[name='condiType_PRICE']:checked").val(); //상품단가
    };
    
    if(r_salse == "" && r_stock == "" && r_appr == "" && r_sort == "" && r_price == ""){alert("일괄수정할 작업을 선택하세요."); return;}

    var setEditSalesItemJson = new Object();
    setEditSalesItemJson.editType = "Lump";
    setEditSalesItemJson.update_type = "ONE";
    setEditSalesItemJson.sales_type = new Array();
    setEditSalesItemJson.sales_appr = new Array();
    setEditSalesItemJson.sales_sort = new Array();
    setEditSalesItemJson.sales_stock = new Array();
    setEditSalesItemJson.sales_price = new Array();
    setEditSalesItemJson.discounted_price = new Array();
    setEditSalesItemJson.repr_unit_price1 = new Array();
    setEditSalesItemJson.repr_unit_price2 = new Array();
    setEditSalesItemJson.repr_unit_price3 = new Array();
    setEditSalesItemJson.repr_unit_price4 = new Array();

    var checked_index = new Array();

    var checkboxes = $("input[name=idx]:checked");

    var tr;
    var td;

    checkboxes.each(function(index, checkbox){
        checked_index.push(checkbox.value);
        tr = checkboxes.parent().parent().eq(index);
        td = tr.children();

        if(r_salse != ""){
            setEditSalesItemJson.sales_type.push(r_salse);
        };
        if(r_appr != ""){
            setEditSalesItemJson.sales_appr.push(r_appr);
        };
        if(r_sort != ""){
            if($("input[name='modi_dis_sort']").val() == "") {alert("정렬 순서를 확인 하세요."); return;}
            setEditSalesItemJson.sales_sort.push($("input[name='modi_dis_sort']").val());
        };
        if(r_price != ""){
            setEditSalesItemJson.update_type = "LOOP";
            setEditSalesItemJson.sales_price.push(td.eq(8).children().eq(0).val());
            setEditSalesItemJson.discounted_price.push(td.eq(9).children().eq(0).val());
            setEditSalesItemJson.repr_unit_price1.push(td.eq(10).children().eq(0).val());
            setEditSalesItemJson.repr_unit_price2.push(td.eq(11).children().eq(0).val());
            setEditSalesItemJson.repr_unit_price3.push(td.eq(12).children().eq(0).val());
            setEditSalesItemJson.repr_unit_price4.push(td.eq(13).children().eq(0).val());
        };
        if(r_stock != ""){
            setEditSalesItemJson.update_type = "LOOP";
            setEditSalesItemJson.sales_stock.push(td.eq(7).children().eq(0).val());
        };
    });
    
    if(checked_index.length < 1){alert("일괄수정할 제품을 선택하세요."); return;}
    setEditSalesItemJson.checked_index = checked_index;

    if(confirm("정말 수정하시겠습니까?")){
        editSalesItem(setEditSalesItemJson);
    };
};

function btnAllDelete(){
    var checked_index = new Array();
    var checkboxes = $("input[name=idx]:checked");

    var tr;
    var td;

    checkboxes.each(function(index, checkbox){
        checked_index.push(checkbox.value);
        tr = checkboxes.parent().parent().eq(index);
        td = tr.children();
    });

    if(checked_index.length < 1){
        alert("삭제하려는 상품을 선택하세요.");
        return;
    }
    else{
        var setEditSalesItemJson = new Object();
        setEditSalesItemJson.editType = "MultiDelete";
        setEditSalesItemJson.checked_item = checked_index;
        $.ajax({
            url: "/uEditSalesItem?"  + $.param({"authPage" : "cGoodsCategoryAdm.js", "editDataJson" : setEditSalesItemJson}),
            type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function(response){
                if(response.errorcode == "PFERR_CONF_0000"){
                    if(response.returnvalue.length > 0) alert(response.returnvalue);
                    else alert("삭제가 완료되었습니다.");
                    reDrawData($("#pagingDiv a.on").text());
                    if($("#checkAll").prop("checked")){
                        $("#checkAll").click();
                    }
                    else{
                        $("#checkAll").click();
                        $("#checkAll").click();
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
    }
};

function editSalesItem(pEditSalesItemJson){
    $.ajax({
        url: "/uEditSalesItem?"  + $.param({"authPage" : "cGoodsCategoryAdm.js", "editDataJson" : pEditSalesItemJson}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            if(response.errorcode == "PFERR_CONF_0000"){
                alert("수정이 완료되었습니다.");
                reDrawData($("#pagingDiv a.on").text());
                if($("#checkAll").prop("checked")){
                    $("#checkAll").click();
                }
                else{
                    $("#checkAll").click();
                    $("#checkAll").click();
                };
                $('#condiType1').prop('checked', true); 
                $('#condiType8').prop('checked', true); 
                if($("input[name=type]").val() != "SUPER"){
                    $('#condiType5').prop('checked', true); 
                    $('#condiType10').prop('checked', true); 
                    $('#condiType12').prop('checked', true); 
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

function callLayerPop(pSalesItemID){
    // $("#search_reg_date_start,#search_reg_date_end").datepicker("setDate", "");
    drawSalesItemEditAdm("layerPop", pSalesItemID);
    document.documentElement.scrollTop = 210;
};

function removeLayerPop(){
    $(".layerPopArea").css("display" ,"none");
};


function salesItemListToExcel(){
    eventSearchSalesItem("excel", $("#list_cnt option:selected").val(), 0);
};

async function btnAddItemToBanner(){
    
    var checked_index = new Array();
    var checkboxes = $("input[name=idx]:checked");
    checkboxes.each(function(index, checkbox){
        checked_index.push(checkbox.value);
    });

    var editSalesItemJson = {
        "bannertype" : "addSalesItem",
        "appId" : "goodsCategoryBanner.html",
        "sales_itme_arr" : checked_index,
        "banner_idx" : document.getElementById("banner_idx").value
    };

    await $.ajax({
        url: "/uEditBannerInfo?",
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/json; charset=utf-8",
        data:JSON.stringify(editSalesItemJson),
        success: function(response){
            console.log(response);
            if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            }
            else if(response.errorcode == "PFERR_CONF_0000"){
                console.log("response", response);
                alert("상품등록이 완료되었습니다.");
                opener.drawBannerinfo(document.getElementById("banner_idx").value);
                if($("#checkAll").prop("checked")){
                    $("#checkAll").click();
                }
                else{
                    $("#checkAll").click();
                    $("#checkAll").click();
                };
            }
            else if(response.errorcode == "PFERR_CONF_0050"){
                alert("이미 등록된 상품만 선택되어있습니다.");
            }
            else {
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

function btnCopyItem(){

    var checked_index = new Array();
    var checkboxes = $("input[name=idx]:checked");
    checkboxes.each(function(index, checkbox){
        checked_index.push(checkbox.value);
    });

    if(checked_index.length > 1){
        alert("한개만 선택 가능합니다.");
        return;
    };

    opener.document.getElementById("copy_idx").value = checked_index[0];
    //checked_index[0] 값으로 detail 조회하기
    $.ajax({
        url: "/uGetSalesItemDetailInfo?"  + $.param({"authPage" : "cGoodsCategoryAdm.js", "salesItemID" : checked_index[0]}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            if(response.errorcode == "PFERR_CONF_0000"){
                console.log("1111", response.returnvalue);
                var rtn = response.returnvalue;
                opener.document.getElementsByName("goods_name")[0].value = rtn[0].SALES_ITEM_NAME;
                opener.document.getElementById("unit_price_div").value = rtn[0].NADLE_UNIT_PRICE_DIV;
                opener.document.getElementById("unit_price1").value = rtn[0].NADLE_UNIT_PRICE1;
                opener.document.getElementById("unit_price2").value = rtn[0].NADLE_UNIT_PRICE2;
                opener.document.getElementById("unit_price3").value = rtn[0].NADLE_UNIT_PRICE3;
                opener.document.getElementById("unit_price4").value = rtn[0].NADLE_UNIT_PRICE4;
                opener.document.getElementsByName("shipping_free")[0].value = rtn[0].FREE_SHIPPING_YN;
                
                opener.document.getElementsByName("goods_barcode")[0].value = rtn[0].GOODS_UNIT_BARCODE1;
                opener.document.getElementsByName("goods_barcode2")[0].value = rtn[0].GOODS_UNIT_BARCODE2;
                opener.document.getElementsByName("goods_barcode3")[0].value = rtn[0].GOODS_UNIT_BARCODE3;
                
                opener.document.getElementsByName("goods_place")[0].value = rtn[0].NADLE_GOODS_ORIGIN_PLACE;
                opener.document.getElementsByName("goods_maker")[0].value = rtn[0].SALES_ITEM_REPR_BRAND_NAME;
                opener.document.getElementsByName("dis_sort")[0].value = rtn[0].SALES_ITEM_SORT;
                opener.document.getElementsByName("sales_chilled")[0].value = rtn[0].SALES_ITEM_REPR_STOCK_MGR_TYPE;
                opener.document.getElementsByName("goods_date")[0].value = rtn[0].GOODS_LAUNCH_DATE;
                opener.document.getElementsByName("sales_start")[0].value = rtn[0].SALES_ITEM_SALE_START_DATETIME;
                opener.document.getElementsByName("sales_end")[0].value = rtn[0].SALES_ITEM_SALE_END_DATETIME;
                
                opener.document.getElementById("sell_cost").value = rtn[0].SALES_TOTAL_PURCHASE_COST;
                opener.document.getElementById("sell_price").value = rtn[0].SALES_ITEM_PRICE;
                opener.document.getElementById("sell_margin").value = rtn[0].SALES_ITEM_MARGIN_RATE;
                opener.document.getElementsByName("tax_gb")[0].value = rtn[0].SALES_ITEM_REPR_TAX_YN;
                
                opener.document.getElementsByName("stock_piece")[0].value = rtn[0].SALES_ITEM_STOCK_QTY;
                opener.document.getElementsByName("sell_min")[0].value = rtn[0].SALES_ITEM_PURCHASE_MIN_QTY;
                opener.document.getElementsByName("sell_max")[0].value = rtn[0].SALES_ITEM_PURCHASE_MAX_QTY;
                
                if(rtn[0].SALES_ITEM_REPR_TAX_YN == '1')opener.document.getElementById("radio02_2").checked = true;
                else opener.document.getElementById("radio02_1").checked = true;

                if(rtn[0].SALES_PIECE_UNIT == 0 || rtn[0].SALES_PIECE_UNIT == null || rtn[0].SALES_PIECE_UNIT == undefined) {
                    opener.document.getElementById("piece_unit_none").checked = true;
                    opener.document.getElementById("piece_unit").value = "";
                }
                else {
                    opener.document.getElementById("piece_unit").value = rtn[0].SALES_PIECE_UNIT;
                    opener.document.getElementById("piece_unit_none").checked = false;
                };
                if(rtn[0].SALES_PIECE_BUNDLE == 0 || rtn[0].SALES_PIECE_BUNDLE == null || rtn[0].SALES_PIECE_BUNDLE == undefined) {
                    opener.document.getElementById("piece_bundle_none").checked = true;
                    opener.document.getElementById("piece_bundle").value = "";
                }
                else {
                    opener.document.getElementById("piece_bundle").value = rtn[0].SALES_PIECE_BUNDLE;
                    opener.document.getElementById("piece_bundle_none").checked = false;
                };
                if(rtn[0].SALES_PIECE_BOX == 0 || rtn[0].SALES_PIECE_BOX == null || rtn[0].SALES_PIECE_BOX == undefined){
                    opener.document.getElementById("piece_box_none").checked = true;
                    opener.document.getElementById("piece_box").value = "";
                }
                else {
                    opener.document.getElementById("piece_box").value = rtn[0].SALES_PIECE_BOX;
                    opener.document.getElementById("piece_box_none").checked = false;
                };
                
                if(rtn[0].SALES_ITEM_SALE_TYPE != 'XX'){
                    if(rtn[0].SALES_ITEM_SALE_TYPE == 'WW')opener.document.getElementById("radio04_2").checked = true;
                    else if(rtn[0].SALES_ITEM_SALE_TYPE == 'CC')opener.document.getElementById("radio04_3").checked = true;
                    else if(rtn[0].SALES_ITEM_SALE_TYPE == 'SS')opener.document.getElementById("radio04_4").checked = true;
                    opener.document.getElementsByName("fate_start")[0].value = rtn[0].FATE_START_DATETIME;
                    opener.document.getElementsByName("fate_end")[0].value = rtn[0].FATE_END_DATETIME;
                    opener.document.getElementById("fate_price").value = rtn[0].NADLE_FATE_PRICE;
                    opener.document.getElementById("fate_disrate").value = rtn[0].NADLE_FATE_DISRATE;
                    opener.document.getElementsByName("fate_sales_min")[0].value = rtn[0].FATE_PURCHASE_MIN_QTY;
                    opener.document.getElementsByName("fate_sales_max")[0].value = rtn[0].FATE_PURCHASE_MAX_QTY;

                }else{
                    opener.document.getElementById("radio04_1").checked = true;
                };
                opener.document.getElementsByName("goods_summary")[0].value = rtn[0].SALES_ITEM_NOTES;
                opener.document.getElementById("editor_textarea").value = rtn[0].FATE_PURCHASE_MAX_QTY;

                if(rtn[0].MENU_LEVEL == "0"){
                    opener.document.getElementById("cate1_idx").value = rtn[0].MENU_LEVEL_ID;
                }
                else if(rtn[0].MENU_LEVEL == "1"){
                    opener.document.getElementById("cate1_idx").value = rtn[0].MENU_LEVEL_P_ID;
                    opener.document.getElementById("cate2_idx").value = rtn[0].MENU_LEVEL_ID;
                }
                else if(rtn[0].MENU_LEVEL == "2"){
                    opener.document.getElementById("cate1_idx").value = rtn[0].MENU_LEVEL_PP_ID;
                    opener.document.getElementById("cate2_idx").value = rtn[0].MENU_LEVEL_P_ID;
                    opener.document.getElementById("cate3_idx").value = rtn[0].MENU_LEVEL_ID;
                };

                window.close();
            }
            else if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            };
        },
        error: function(qXHR, textStatus, errorThrown) {
            alert("[err messager]:" + textStatus);
            rtnvalue = null;
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
};

