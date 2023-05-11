/****************************************************************************************************
module명: cCategoryListAdm.js
creator: 정길웅
date: 2022.03.21
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

//카테고리관리 화면의 CRUD를 담당하는 ajax함수
function procCategoryList(pCategoryList){
    var ret;
    $.ajax({
        url: "/uGetCategoryListAdm?" + $.param({"authPage" : "cCategoryListAdm.js", "categoryList":pCategoryList}),
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
                if(response.errorcode != "PFERR_CONF_0050")
                {
                    ret = null;
                    alert(response.errormessage);
                };
            };
        },
        error:function(xhr, textStatus, e){
            console.log("[error]: " + textStatus);
            ret = null;
        },
        complete:function(data, textStatus){
            console.log("[complete]: " + textStatus);
        }
    });
    return ret;
};

///////////대메뉴 관련 함수//////////////
//대메뉴 테이블 그리는 함수
function drawBigMenu(){
    //우선 대중소 테이블들을 제거한다
    clearBigTable();
    //clearMediumTable();
    //clearSmallTable();
    var ret = getBigMenu();
    var txt = "";
    if(ret==undefined || ret==""){
        txt += '<tr><td colspan="4" align="center" style="height:30px;">등록된 데이터가 없습니다</td></tr>'
    }
    else{
        for(var ix=0; ix<ret.length; ix++){
            txt += `<tr id="menu_lv_`+ix+`" class="menu_pLv_0"> \n`;
            txt += `	<td id="menu_id_`+ret[ix].MENU_LEVEL_ID+`"style="display : none">`+ret[ix].MENU_LEVEL_ID+`</td> \n`;
            txt += `	<td> \n`;

            if(ix==0)
            {
                txt += `		<button type="button" onclick="orderUp(${-1}, ${-1}, ${ret[ix].MENU_ORDER_NO_BY_SAME_P}, ${ix}, this,${ret[ix].MENU_LEVEL_ID},'${ret[ix].MENU_LEVEL_P_ID}','big');">▲</button> \n`;
            }
            else
            {
                txt += `		<button type="button" onclick="orderUp(${ret[ix-1].MENU_ORDER_NO_BY_SAME_P}, ${ret[ix-1].MENU_LEVEL_ID}, ${ret[ix].MENU_ORDER_NO_BY_SAME_P}, ${ix}, this,${ret[ix].MENU_LEVEL_ID},'${ret[ix].MENU_LEVEL_P_ID}','big');">▲</button> \n`;
            };

            if(ix==(ret.length-1))
            {
                txt += `		<button type="button" onclick="orderDn(${99999}, ${99999}, ${ret[ix].MENU_ORDER_NO_BY_SAME_P}, ${ix}, this,${ret[ix].MENU_LEVEL_ID},'${ret[ix].MENU_LEVEL_P_ID}','big');">▼</button> \n`;
            }
            else
            {
                txt += `		<button type="button" onclick="orderDn(${ret[ix+1].MENU_ORDER_NO_BY_SAME_P}, ${ret[ix+1].MENU_LEVEL_ID}, ${ret[ix].MENU_ORDER_NO_BY_SAME_P}, ${ix}, this,${ret[ix].MENU_LEVEL_ID},'${ret[ix].MENU_LEVEL_P_ID}','big');">▼</button> \n`;
            };
            
            txt += `	</td> \n`;
            txt += `	<td> \n`;
            txt += `		<a href="#" class="big_menu_name" id="menu_name_`+ret[ix].MENU_LEVEL_ID+`" onclick="clickTitle01(`+ret[ix].MENU_LEVEL_ID+`)">`+ret[ix].MENU_NAME+`</a> \n`;
            txt += `	</td> \n`;
            if(ret[ix].MENU_ACTIVE_YN=="Y"){
                txt += `	<td>노출</td> \n`;
            }
            else if(ret[ix].MENU_ACTIVE_YN=="N"){
                txt += `	<td>비노출</td> \n`;
            }
            txt += `	<td><button type="button" class="btn_ss01" onclick="drawBigTitlePop(`+ret[ix].MENU_LEVEL_ID+`);"><span>상세</span></button></td> \n`;
            txt += `</tr> \n`;
        };
    };
    document.getElementById("big_category_tbody").innerHTML = txt;

    //이미 선택더된 하위 중메뉴id가 존재하면 중간메뉴 그리기를 호출한다.
    var tmp=$("#selectedLevel0_menu_id").text();
    if(tmp.length>0)
    {
        var target_menu = document.getElementById(`menu_name_`+tmp+``);
        //글씨 색 변경하기 전에 모든 글씨 CSS를 원상복귀시킨다.
        clearBigMenuNameCSS();
        //클릭 시 글자의 스타일이 변경됨
        target_menu.style.fontSize = "16px";
        target_menu.style.fontWeight = "bold";
        var mediumMenuInfo = getChildSubMenu(tmp);
        drawMediumMenu(mediumMenuInfo);
    };
    
};

//대메뉴의 DB를 가져오기 위해 구분자를 사용한 함수
function getBigMenu(){
    var getCategoryCondition = {
        crudGbn : "view_bigMenu"
    };
    var bigMenuList = procCategoryList(getCategoryCondition);
    return bigMenuList;
};


//대메뉴 등록화면 클릭 시 나오는 팝업창
function drawBigMenuPopup(){
    var txt = "";
		txt += '	<div class="popup pop400"> \n';
		txt += '		<div class="pop_tit">대메뉴 등록</div> \n';
		txt += '		<div class="pop_cont"> \n';
        txt += '			<div class="text_r mb05"> \n';
		txt += '				<span class="important">*</span> 필수입력 \n';
		txt += '			</div> \n';
		txt += '			<table class="table_row"> \n';
		txt += '				<colgroup><col width="25%"><col width="*"></colgroup> \n';
		txt += '				<tbody> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>대메뉴명 <span class="important">*</span></span></th> \n';
		txt += '						<td><input type="text" name="cate_name" class="w210" maxlength="25"></td> \n';
		txt += '					</tr> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>노출여부 <span class="important">*</span></span></th> \n';
		txt += '						<td> \n';
		txt += '							<input type="radio" id="radio01_1" name="view_yn" value="Y" checked="checked"> <label for="radio01_1">노출</label> &nbsp; \n';
		txt += '							<input type="radio" id="radio01_2" name="view_yn" value="N"> <label for="radio01_2">비노출</label> \n';
		txt += '						</td> \n';
		txt += '					</tr> \n';
		txt += '				</tbody> \n';
        txt += '			</table> \n';
		txt += '			<p class="mt05">※ 대메뉴명은 최대 25자(30byte) 입력<br>   줄띄울땐&lt;br&gt;입력</p> \n';
		txt += '			<div class="table_btns text_c"> \n';
		txt += '				<button type="button" class="btn01 btn_b" onclick="insertBigMenu();"><span>등록</span></button> \n';
		txt += '			</div> \n';
		txt += '		</div> \n';
		txt += '		<div class="pop_close"> \n';
		txt += '			<a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n';
		txt += '		</div> \n';
		txt += '	</div> \n';
    $(".layerPopArea").css("display", "block");
	$(".layerPop").html(txt);
};

//대메뉴 상세버튼 클릭 시 나오는 팝업을 그림
function drawBigTitlePop(ret){
    var bigMenuTitle;
    var bigMenuID;
    bigMenuTitle = document.getElementById(`menu_name_`+ret).innerText;
    bigMenuID = document.getElementById(`menu_id_`+ret).innerText;

    var posi = bigMenuTitle.indexOf("\n");
    if(posi > 0) bigMenuTitle = bigMenuTitle.slice(0, posi) + '<br>' + bigMenuTitle.slice(posi, bigMenuTitle.length);

    $("#selectedLevel0_menu_id").text(bigMenuID);
    
    var txt = "";
        txt += '	<input type="hidden" name="idx" value="5"> \n';
        txt += '	<input type="hidden" name="sys" value=""> \n';
		txt += '	<div class="popup pop400"> \n';
        txt += '		<div class="pop_tit">대메뉴 상세/수정</div> \n';
        txt += '		<div class="pop_cont"> \n';
        txt += '			<div class="text_r mb05"> \n';
        txt += '				<span class="important">*</span> 필수입력 \n';
        txt += '			</div> \n';
        txt += '			<table class="table_row"> \n';
        txt += '				<colgroup><col width="25%"><col width="*"></colgroup> \n';
        txt += '				<tbody> \n';
        txt += '					<tr> \n';
        txt += '						<th><span>대메뉴코드</span></th> \n';
        txt += `						<td>`+ret+`</td> \n`;
        txt += '					</tr> \n';
        txt += '					<tr> \n';
        txt += '						<th><span>대메뉴명 <span class="important">*</span></span></th> \n';
        txt += `						<td><input type="text" name="cate_name" class="w210" maxlength="25" value="`+bigMenuTitle+`"></td> \n`;
        txt += '					</tr> \n';
        txt += '					<tr> \n';
        txt += '						<th><span>노출여부 <span class="important">*</span></span></th> \n';
        txt += '						<td> \n';
        txt += '							<input type="radio" id="radio01_1" name="view_yn" value="Y" checked="checked"> <label for="radio01_1">노출</label> \n';
        txt += '							&nbsp; \n';
        txt += '							<input type="radio" id="radio01_2" name="view_yn" value="N"> <label for="radio01_2">비노출</label> \n';
        txt += '						</td> \n';
        txt += '					</tr> \n';
        txt += '				</tbody> \n';
        txt += '			</table> \n';
        txt += '			<p class="mt05">※ 대메뉴명은 최대 25자(30byte) 입력<br>   줄띄울땐&lt;br&gt;입력</p> \n';
        txt += '			<div class="table_btns text_c"> \n';
        txt += `				<button type="button" class="btn01" onclick="deleteMenu(`+bigMenuID+`);"><span>삭제</span></button>  \n`;
        txt += `				<button type="button" class="btn01 btn_b" onclick="editMenu(`+bigMenuID+`);"><span>수정</span></button> \n`;
        txt += '			</div> \n';
        txt += '		</div> \n';
        txt += '		<div class="pop_close"> \n';
        txt += '			<a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n';
        txt += '		</div> \n';
        txt += '	</div> \n';

    $(".layerPopArea").css("display", "block");
	$(".layerPop").html(txt);
};

//팝업창 닫을 시 흰색 바탕 사라짐
function removeLayerPop(){
	$(".layerPopArea").css("display" ,"none");
};

//대메뉴 제목 클릭 시 글자색이 바뀌고 중메뉴의 DB를 가지고옴
function clickTitle01(menu_lv){
    $("#selectedLevel0_menu_id").text(menu_lv);
    clearMediumTable();
    clearSmallTable();
    var target_menu = document.getElementById(`menu_name_`+menu_lv+``);
    //글씨 색 변경하기 전에 모든 글씨 CSS를 원상복귀시킨다.
    clearBigMenuNameCSS();
    //클릭 시 글자의 스타일이 변경됨
    target_menu.style.fontSize = "16px";
    target_menu.style.fontWeight = "bold";
    var mediumMenuInfo = getChildSubMenu(menu_lv);
    drawMediumMenu(mediumMenuInfo);
};

//하위메뉴 만들 때 필요한 구분자 값과 상위메뉴 id값을 전달함
function getChildSubMenu(menu_lv){
    var smaller_menu_id = document.getElementById(`menu_id_`+menu_lv+``).innerHTML;
    var getCategoryCondition = {
        crudGbn : "view_sub",
        menu_id : smaller_menu_id
    };
    var biggerMenuList = procCategoryList(getCategoryCondition);
    return biggerMenuList;
};

///////////중메뉴 관련 함수//////////////
//중메뉴 그리는 함수
function drawMediumMenu(ret){
    var txt = "";
    if(ret==undefined||ret==""){
        var medium_tbody = document.getElementById("medium_category_tbody");
        medium_tbody.innerHTML = '<tr><td colspan="4" align="center" style="height:30px;">등록된 데이터가 없습니다</td></tr>';
    }
    else{
        for(var px=0; px<ret.length; px++){
            txt += `<tr id="menu_lv2_`+px+`"> \n`;
            txt += `	<td id="menu_id_`+ret[px].MENU_LEVEL_ID+`"style="display : none">`+ret[px].MENU_LEVEL_ID+`</td> \n`;
            txt += `	<td id="menu_p_id_`+ret[px].MENU_LEVEL_P_ID+`"style="display : none">`+ret[px].MENU_LEVEL_P_ID+`</td> \n`;
            txt += `	<td> \n`;

            if(px==0)
            {
                txt += `		<button type="button" onclick="orderUp(${-1}, ${-1}, ${ret[px].MENU_ORDER_NO_BY_SAME_P}, ${px}, this,${ret[px].MENU_LEVEL_ID},'${ret[px].MENU_LEVEL_P_ID}','medium');">▲</button> \n`;
            }
            else
            {
                txt += `		<button type="button" onclick="orderUp(${ret[px-1].MENU_ORDER_NO_BY_SAME_P}, ${ret[px-1].MENU_LEVEL_ID}, ${ret[px].MENU_ORDER_NO_BY_SAME_P}, ${px}, this,${ret[px].MENU_LEVEL_ID},'${ret[px].MENU_LEVEL_P_ID}','medium');">▲</button> \n`;
            };

            if(px==(ret.length-1))
            {
                txt += `		<button type="button" onclick="orderDn(${99999}, ${99999}, ${ret[px].MENU_ORDER_NO_BY_SAME_P}, ${px}, this,${ret[px].MENU_LEVEL_ID},'${ret[px].MENU_LEVEL_P_ID}','medium');">▼</button> \n`;
            }
            else
            {
                txt += `		<button type="button" onclick="orderDn(${ret[px+1].MENU_ORDER_NO_BY_SAME_P}, ${ret[px+1].MENU_LEVEL_ID}, ${ret[px].MENU_ORDER_NO_BY_SAME_P}, ${px}, this,${ret[px].MENU_LEVEL_ID},'${ret[px].MENU_LEVEL_P_ID}','medium');">▼</button> \n`;
            };

            txt += `	</td> \n`;
            txt += `	<td><a href="#" id="menu_name_`+ret[px].MENU_LEVEL_ID+`"  class="medium_menu_name" onclick="clickTitle02(`+ret[px].MENU_LEVEL_ID+`)">`+ret[px].MENU_NAME+`</a></td> \n`;
            if(ret[px].MENU_ACTIVE_YN=="Y"){
                txt += `	<td>노출</td> \n`;
            }
            else if(ret[px].MENU_ACTIVE_YN=="N"){
                txt += `	<td>비노출</td> \n`;
            };
            txt += `	<td><button type="button" class="btn_ss01" onclick="drawMediumTitlePop(`+ret[px].MENU_LEVEL_P_ID+`, `+ret[px].MENU_LEVEL_ID+`)"><span>상세</span></button></td> \n`;
            txt += `</tr> \n`;
        };
        document.getElementById("medium_category_tbody").innerHTML = txt;

        //이미 선택더된 하위 중메뉴id가 존재하면 중간메뉴 그리기를 호출한다.
        var tmp=$("#selectedLevel1_menu_id").text();
        if(tmp.length>0)
        {
            var target_menu = document.getElementById(`menu_name_`+tmp+``);
            //글씨 색 변경하기 전에 모든 글씨 CSS를 원상복귀시킨다.
            clearMediumMenuNameCSS();
            //클릭 시 글자의 스타일이 변경됨
            target_menu.style.fontSize = "16px";
            target_menu.style.fontWeight = "bold";
            var smallMenuInfo = getChildSubMenu(tmp);
            clearSmallTable();
            drawSmallMenu(smallMenuInfo);
        };

    };
};

// 중메뉴 상세버튼 클릭 시 나오는 팝업
function drawMediumTitlePop(pParent, pChild)
{
    $("#selectedLevel1_menu_id").text(pChild);
    var pParentMenuTitle;
    var pChildMenuTitle;
    var pChildMenuID;
    pParentMenuTitle = document.getElementById("menu_name_"+pParent).innerText;
    pChildMenuTitle = document.getElementById("menu_name_"+pChild).innerText;
    pChildMenuID = document.getElementById("menu_id_"+pChild).innerText;

    var p_posi = pParentMenuTitle.indexOf("\n");
    if(p_posi > 0) pParentMenuTitle = pParentMenuTitle.slice(0, p_posi) + '<br>' + pParentMenuTitle.slice(p_posi, pParentMenuTitle.length);
    var posi = pChildMenuTitle.indexOf("\n");
    if(posi > 0) pChildMenuTitle = pChildMenuTitle.slice(0, posi) + '<br>' + pChildMenuTitle.slice(posi, pChildMenuTitle.length);

    var txt = "";
        txt += '	<input type="hidden" name="idx" value="5"> \n';
        txt += '	<input type="hidden" name="sys" value=""> \n';
		txt += '	<div class="popup pop400"> \n';
        txt += '		<div class="pop_tit">중메뉴 상세/수정</div> \n';
        txt += '		<div class="pop_cont"> \n';
        txt += '			<div class="text_r mb05"> \n';
        txt += '				<span class="important">*</span> 필수입력 \n';
        txt += '			</div> \n';
        txt += '			<table class="table_row"> \n';
        txt += '				<colgroup><col width="25%"><col width="*"></colgroup> \n';
        txt += '				<tbody> \n';
        txt += '					<tr> \n';
        txt += '						<th><span>대메뉴명</span></th> \n';
        txt += `						<td>`+pParentMenuTitle+`</td> \n`;
        txt += '					</tr> \n';
        txt += '					<tr> \n';
        txt += '						<th><span>중메뉴코드</span></th> \n';
        txt += `						<td>`+pChild+`</td> \n`;
        txt += '					</tr> \n';
        txt += '					<tr> \n';
        txt += '						<th><span>중메뉴명 <span class="important">*</span></span></th> \n';
        txt += `						<td><input type="text" name="cate_name" class="w210" maxlength="25" value="`+pChildMenuTitle+`"></td> \n`;
        txt += '					</tr> \n';
        txt += '					<tr> \n';
        txt += '						<th><span>노출여부 <span class="important">*</span></span></th> \n';
        txt += '						<td> \n';
        txt += '							<input type="radio" id="radio01_1" name="view_yn" value="Y" checked="checked"> <label for="radio01_1">노출</label> \n';
        txt += '							&nbsp; \n';
        txt += '							<input type="radio" id="radio01_2" name="view_yn" value="N"> <label for="radio01_2">비노출</label> \n';
        txt += '						</td> \n';
        txt += '					</tr> \n';
        txt += '				</tbody> \n';
        txt += '			</table> \n';
        txt += '			<p class="mt05">※ 중메뉴명은 최대 25자(30byte) 입력<br>   줄띄울땐&lt;br&gt;입력</p> \n';
        txt += '			<div class="table_btns text_c"> \n';
        txt += `				<button type="button" class="btn01" onclick="deleteMenu(`+pChildMenuID+`);"><span>삭제</span></button>  \n`;
        txt += `				<button type="button" class="btn01 btn_b" onclick="editMenu(`+pChildMenuID+`);"><span>수정</span></button> \n`;
        txt += '			</div> \n';
        txt += '		</div> \n';
        txt += '		<div class="pop_close"> \n';
        txt += '			<a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n';
        txt += '		</div> \n';
        txt += '	</div> \n';

    $(".layerPopArea").css("display", "block");
	$(".layerPop").html(txt);
};

//중메뉴 등록화면 클릭 시 나오는 팝업창
function drawMediumMenuPopup(){
    var bigTbodySize = $("#big_category_tbody tr").length;
    var selectedTitle;
    var pBigMenuName;
    var pMenuID;
    var rows = document.getElementById("big_category_tbody").getElementsByTagName("tr");
    var cells;
    selectedTitle =  document.getElementsByClassName("big_menu_name");
    for(var vx=0; vx<bigTbodySize; vx++){
        cells= rows[vx].getElementsByTagName("td");
        if(selectedTitle[vx].style.fontWeight=='bold'){
            pBigMenuName = selectedTitle[vx].text;
            pMenuID = cells[0].firstChild.data;
        };
    }
    if(pBigMenuName==undefined||pBigMenuName==""){
        alert("대메뉴를 먼저 선택해주시기 바랍니다.");
    }
    else{
        var txt = "";
		txt += '	<div class="popup pop400"> \n';
		txt += '		<div class="pop_tit">중메뉴 등록</div> \n';
		txt += '		<div class="pop_cont"> \n';
        txt += '			<div class="text_r mb05"> \n';
		txt += '				<span class="important">*</span> 필수입력 \n';
		txt += '			</div> \n';
		txt += '			<table class="table_row"> \n';
		txt += '				<colgroup><col width="25%"><col width="*"></colgroup> \n';
		txt += '				<tbody> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>대메뉴명 <span class="important">*</span></span></th> \n';
		txt += `						<td>`+pBigMenuName+`</td> \n`;
        txt += `						<td style="display:none" id="mediumPop_selectedP_id">`+pMenuID+`</td> \n`;
		txt += '					</tr> \n';
        txt += '					<tr> \n';
		txt += '						<th><span>중메뉴명 <span class="important">*</span></span></th> \n';
		txt += '						<td><input type="text" name="cate_name" class="w210" maxlength="25"></td> \n';
		txt += '					</tr> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>노출여부 <span class="important">*</span></span></th> \n';
		txt += '						<td> \n';
		txt += '							<input type="radio" id="radio01_1" name="view_yn" value="Y" checked="checked"> <label for="radio01_1">노출</label> &nbsp; \n';
		txt += '							<input type="radio" id="radio01_2" name="view_yn" value="N"> <label for="radio01_2">비노출</label> \n';
		txt += '						</td> \n';
		txt += '					</tr> \n';
		txt += '				</tbody> \n';
        txt += '			</table> \n';
		txt += '			<p class="mt05">※ 중메뉴명은 최대 25자(30byte) 입력<br>   줄띄울땐&lt;br&gt;입력</p> \n';
		txt += '			<div class="table_btns text_c"> \n';
		txt += '				<button type="button" class="btn01 btn_b" onclick="insertMediumMenu();"><span>등록</span></button> \n';
		txt += '			</div> \n';
		txt += '		</div> \n';
		txt += '		<div class="pop_close"> \n';
		txt += '			<a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n';
		txt += '		</div> \n';
		txt += '	</div> \n';
        $(".layerPopArea").css("display", "block");
        $(".layerPop").html(txt);
    };
};

//중메뉴 제목 클릭 시 글자색이 변하고 소메뉴의 DB를 가지고옴
function clickTitle02(menu_lv){
    $("#selectedLevel1_menu_id").text(menu_lv);
    var target_menu = document.getElementById(`menu_name_`+menu_lv+``);
    //글씨 색 변경하기 전에 모든 글씨 CSS를 원상복귀시킨다.
    clearMediumMenuNameCSS();
    //클릭 시 글자의 스타일이 변경됨
    target_menu.style.fontSize = "16px";
    target_menu.style.fontWeight = "bold";
    var smallMenuInfo = getChildSubMenu(menu_lv);
    clearSmallTable();
    drawSmallMenu(smallMenuInfo);
};

///////////소메뉴 관련 함수//////////////
//소메뉴 그리는 함수
function drawSmallMenu(ret){
    var txt = "";
    if(ret!=undefined&&ret!=null){
        for(var ux=0; ux<ret.length; ux++){
            txt += `<tr id="menu_lv3_`+ux+`"> \n`;
            txt += `	<td id="menu_id_`+ret[ux].MENU_LEVEL_ID+`"style="display : none">`+ret[ux].MENU_LEVEL_ID+`</td> \n`;
            txt += `	<td id="menu_p_id_`+ret[ux].MENU_LEVEL_P_ID+`"style="display : none">`+ret[ux].MENU_LEVEL_P_ID+`</td> \n`;
            txt += `	<td> \n`;

            if(ux==0)
            {
                txt += `		<button type="button" onclick="orderUp(${-1}, ${-1}, ${ret[ux].MENU_ORDER_NO_BY_SAME_P}, ${ux}, this,${ret[ux].MENU_LEVEL_ID},'${ret[ux].MENU_LEVEL_P_ID}','small');">▲</button> \n`;
            }
            else
            {
                txt += `		<button type="button" onclick="orderUp(${ret[ux-1].MENU_ORDER_NO_BY_SAME_P}, ${ret[ux-1].MENU_LEVEL_ID}, ${ret[ux].MENU_ORDER_NO_BY_SAME_P}, ${ux}, this,${ret[ux].MENU_LEVEL_ID},'${ret[ux].MENU_LEVEL_P_ID}','small');">▲</button> \n`;
            };

            if(ux==(ret.length-1))
            {
                txt += `		<button type="button" onclick="orderDn(${99999}, ${99999}, ${ret[ux].MENU_ORDER_NO_BY_SAME_P}, ${ux}, this,${ret[ux].MENU_LEVEL_ID},'${ret[ux].MENU_LEVEL_P_ID}','small');">▼</button> \n`;
            }
            else
            {
                txt += `		<button type="button" onclick="orderDn(${ret[ux+1].MENU_ORDER_NO_BY_SAME_P}, ${ret[ux+1].MENU_LEVEL_ID}, ${ret[ux].MENU_ORDER_NO_BY_SAME_P}, ${ux}, this, ${ret[ux].MENU_LEVEL_ID},'${ret[ux].MENU_LEVEL_P_ID}','small');">▼</button> \n`;
            };

            txt += `	</td> \n`;
            txt += `	<td><a href="#" id="menu_name_`+ret[ux].MENU_LEVEL_ID+`" class="small_menu_name"onclick="clickTitle03(`+ret[ux].MENU_LEVEL_ID+`)">`+ret[ux].MENU_NAME+`</a></td> \n`;
            if(ret[ux].MENU_ACTIVE_YN=="Y"){
                txt += `	<td>노출</td> \n`;
            }
            else if(ret[ux].MENU_ACTIVE_YN=="N"){
                txt += `	<td>비노출</td> \n`;
            };
            txt += `	<td><button type="button" class="btn_ss01" onclick="drawSmallTitlePop(`+ret[ux].MENU_LEVEL_P_ID+`, `+ret[ux].MENU_LEVEL_ID+`)"><span>상세</span></button></td> \n`;
            txt += `</tr> \n`;
        };
        document.getElementById("small_category_tbody").innerHTML = txt;
    };
};

//소메뉴 등록화면 클릭 시 나오는 팝업창
function drawSmallMenuPopup(){
    var bigTbodySize = $("#medium_category_tbody tr").length;
    var selectedTitle;
    var pBigMenuName;
    var pMenuID;
    var rows = document.getElementById("medium_category_tbody").getElementsByTagName("tr");
    var cells;
    selectedTitle =  document.getElementsByClassName("medium_menu_name");
    if(selectedTitle.length>0){
        for(var vx=0; vx<bigTbodySize; vx++){
            cells= rows[vx].getElementsByTagName("td");
            if(selectedTitle[vx].style.fontWeight=='bold'){
                pBigMenuName = selectedTitle[vx].text;
                pMenuID = cells[0].firstChild.data;
            };
        }
        if(pMenuID==undefined||pMenuID==""){
            alert("중메뉴를 선택해 주시기 바랍니다.");
        }
        else{
            var txt = "";
            txt += '	<div class="popup pop400"> \n';
            txt += '		<div class="pop_tit">소메뉴 등록</div> \n';
            txt += '		<div class="pop_cont"> \n';
            txt += '			<div class="text_r mb05"> \n';
            txt += '				<span class="important">*</span> 필수입력 \n';
            txt += '			</div> \n';
            txt += '			<table class="table_row"> \n';
            txt += '				<colgroup><col width="25%"><col width="*"></colgroup> \n';
            txt += '				<tbody> \n';
            txt += '					<tr> \n';
            txt += '						<th><span>중메뉴명 <span class="important">*</span></span></th> \n';
            txt += `						<td>`+pBigMenuName+`</td> \n`;
            txt += `						<td style="display:none" id="smallPop_selectedP_id">`+pMenuID+`</td> \n`;
            txt += '					</tr> \n';
            txt += '					<tr> \n';
            txt += '						<th><span>소메뉴명 <span class="important">*</span></span></th> \n';
            txt += '						<td><input type="text" name="cate_name" class="w210" maxlength="25"></td> \n';
            txt += '					</tr> \n';
            txt += '					<tr> \n';
            txt += '						<th><span>노출여부 <span class="important">*</span></span></th> \n';
            txt += '						<td> \n';
            txt += '							<input type="radio" id="radio01_1" name="view_yn" value="Y" checked="checked"> <label for="radio01_1">노출</label> &nbsp; \n';
            txt += '							<input type="radio" id="radio01_2" name="view_yn" value="N"> <label for="radio01_2">비노출</label> \n';
            txt += '						</td> \n';
            txt += '					</tr> \n';
            txt += '				</tbody> \n';
            txt += '			</table> \n';
            txt += '			<p class="mt05">※ 소메뉴명은 최대 25자(30byte) 입력<br>   줄띄울땐&lt;br&gt;입력</p> \n';
            txt += '			<div class="table_btns text_c"> \n';
            txt += '				<button type="button" class="btn01 btn_b" onclick="insertSmallMenu();"><span>등록</span></button> \n';
            txt += '			</div> \n';
            txt += '		</div> \n';
            txt += '		<div class="pop_close"> \n';
            txt += '			<a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n';
            txt += '		</div> \n';
            txt += '	</div> \n';
            $(".layerPopArea").css("display", "block");
            $(".layerPop").html(txt);
        }
    }
    else{
        alert("대메뉴와 중메뉴를 선택해주시기 바랍니다.");
    };
};


//소메뉴 제목 클릭 시 글자색이 변함
function clickTitle03(menu_lv)
{
    $("#selectedLevel2_menu_id").text(menu_lv);
    var target_menu = document.getElementById(`menu_name_`+menu_lv+``);
    //글씨 색 변경하기 전에 모든 글씨 CSS를 원상복귀시킨다.
    clearSmallMenuNameCSS();
    //클릭 시 글자의 스타일이 변경됨
    target_menu.style.fontSize = "16px";
    target_menu.style.fontWeight = "bold";
};

// 소메뉴 상세버튼 클릭 시 나오는 팝업
function drawSmallTitlePop(pParent, pChild)
{
    $("#selectedLevel2_menu_id").text(pChild);
    var pParentMenuTitle;
    var pChildMenuTitle;
    var pChildMenuID;
    pParentMenuTitle = document.getElementById("menu_name_"+pParent).innerText;
    pChildMenuTitle = document.getElementById("menu_name_"+pChild).innerText;
    pChildMenuID = document.getElementById("menu_id_"+pChild).innerText;

    var p_posi = pParentMenuTitle.indexOf("\n");
    if(p_posi > 0) pParentMenuTitle = pParentMenuTitle.slice(0, p_posi) + '<br>' + pParentMenuTitle.slice(p_posi, pParentMenuTitle.length);
    var posi = pChildMenuTitle.indexOf("\n");
    if(posi > 0) pChildMenuTitle = pChildMenuTitle.slice(0, posi) + '<br>' + pChildMenuTitle.slice(posi, pChildMenuTitle.length);

    var txt = "";
        txt += '	<input type="hidden" name="idx" value="5"> \n';
        txt += '	<input type="hidden" name="sys" value=""> \n';
		txt += '	<div class="popup pop400"> \n';
        txt += '		<div class="pop_tit">소메뉴 상세/수정</div> \n';
        txt += '		<div class="pop_cont"> \n';
        txt += '			<div class="text_r mb05"> \n';
        txt += '				<span class="important">*</span> 필수입력 \n';
        txt += '			</div> \n';
        txt += '			<table class="table_row"> \n';
        txt += '				<colgroup><col width="25%"><col width="*"></colgroup> \n';
        txt += '				<tbody> \n';
        txt += '					<tr> \n';
        txt += '						<th><span>중메뉴명</span></th> \n';
        txt += `						<td>`+pParentMenuTitle+`</td> \n`;
        txt += '					</tr> \n';
        txt += '					<tr> \n';
        txt += '						<th><span>소메뉴코드</span></th> \n';
        txt += `						<td>`+pChild+`</td> \n`;
        txt += '					</tr> \n';
        txt += '					<tr> \n';
        txt += '						<th><span>소메뉴명 <span class="important">*</span></span></th> \n';
        txt += `						<td><input type="text" name="cate_name" class="w210" maxlength="25" value="`+pChildMenuTitle+`"></td> \n`;
        txt += '					</tr> \n';
        txt += '					<tr> \n';
        txt += '						<th><span>노출여부 <span class="important">*</span></span></th> \n';
        txt += '						<td> \n';
        txt += '							<input type="radio" id="radio01_1" name="view_yn" value="Y" checked="checked"> <label for="radio01_1">노출</label> \n';
        txt += '							&nbsp; \n';
        txt += '							<input type="radio" id="radio01_2" name="view_yn" value="N"> <label for="radio01_2">비노출</label> \n';
        txt += '						</td> \n';
        txt += '					</tr> \n';
        txt += '				</tbody> \n';
        txt += '			</table> \n';
        txt += '			<p class="mt05">※ 소메뉴명은 최대 25자(30byte) 입력<br>   줄띄울땐&lt;br&gt;입력</p> \n';
        txt += '			<div class="table_btns text_c"> \n';
        txt += `				<button type="button" class="btn01" onclick="deleteMenu(`+pChildMenuID+`);"><span>삭제</span></button>  \n`;
        txt += `				<button type="button" class="btn01 btn_b" onclick="editMenu(`+pChildMenuID+`);"><span>수정</span></button> \n`;
        txt += '			</div> \n';
        txt += '		</div> \n';
        txt += '		<div class="pop_close"> \n';
        txt += '			<a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n';
        txt += '		</div> \n';
        txt += '	</div> \n';

    $(".layerPopArea").css("display", "block");
	$(".layerPop").html(txt);
};

/////// 데이터 값을 넣거나 변경하는 함수들 /////////
//대메뉴 등록
function insertBigMenu(){
    var insert_menu_name = document.querySelector("[name='cate_name']").value;
    var insert_menu_YN = document.querySelector("[name='view_yn']").value;
    if(insert_menu_name==""||insert_menu_name==undefined){
        alert("메뉴명을 입력해 주시기 바랍니다.")
    }
    else{
        var getCategoryCondition = {
            crudGbn : "update_insert",
            menu_name : insert_menu_name,
            menu_YN : insert_menu_YN,
            menu_level_p_id : 0,
            menu_level : 0
        };
        
        procCategoryList(getCategoryCondition);
        alert("메뉴가 추가되었습니다.");
        $(".layerPopArea").css("display", "none");
        drawBigMenu();
    };
};

//중메뉴 등록
function insertMediumMenu(){
    var insert_menu_name = document.querySelector("[name='cate_name']").value;
    var insert_menu_YN = document.querySelector("[name='view_yn']").value;
    var insert_menu_level_p_id = document.getElementById("mediumPop_selectedP_id").innerText;

    if(insert_menu_name==""||insert_menu_name==undefined){
        alert("메뉴명을 입력해 주시기 바랍니다.")
    }
    else{
        var getCategoryCondition = {
            crudGbn : "update_insert",
            menu_name : insert_menu_name,
            menu_YN : insert_menu_YN,
            menu_level_p_id : insert_menu_level_p_id,
            menu_level : 1
        };
        
        procCategoryList(getCategoryCondition);
        alert("메뉴가 추가되었습니다.");
        $(".layerPopArea").css("display", "none");
        drawBigMenu();
    };
};

//소메뉴 등록
function insertSmallMenu(){
    var insert_menu_name = document.querySelector("[name='cate_name']").value;
    var insert_menu_YN = document.querySelector("[name='view_yn']").value;
    var insert_menu_level_p_id = document.getElementById("smallPop_selectedP_id").innerText;

    if(insert_menu_name==""||insert_menu_name==undefined){
        alert("메뉴명을 입력해 주시기 바랍니다.")
    }
    else{
        var getCategoryCondition = {
            crudGbn : "update_insert",
            menu_name : insert_menu_name,
            menu_YN : insert_menu_YN,
            menu_level_p_id : insert_menu_level_p_id,
            menu_level : 2
        };
        
        procCategoryList(getCategoryCondition);
        alert("메뉴가 추가되었습니다.");
        $(".layerPopArea").css("display", "none");
        drawBigMenu();
    };
};


//상세 버튼 클릭 후 수정버튼을 눌러서 정보를 수정함
function editMenu(menu_lv){
    var edit_menu_id = document.getElementById(`menu_id_`+menu_lv+``).innerText;
    var edit_menu_name = document.querySelector("[name='cate_name']").value;
    var edit_menu_YN = $('input[name=view_yn]:checked').val();
    if(edit_menu_name==""||edit_menu_name==undefined){
        alert("메뉴명을 입력해 주시기 바랍니다.");
    }
    else{
        var getCategoryCondition = {
            crudGbn : "update_edit",
            menu_id : edit_menu_id,
            menu_name : edit_menu_name,
            menu_YN : edit_menu_YN
        };
        
        procCategoryList(getCategoryCondition);
        alert("메뉴가 수정되었습니다.");
        $(".layerPopArea").css("display", "none");
        drawBigMenu();
    };

}

//id값을 찾아 DB에서 내용을 삭제함
function deleteMenu(menu_lv){
    var delete_menu_id = document.getElementById(`menu_id_`+menu_lv+``).innerHTML;
    var getCategoryCondition = {
        crudGbn : "update_delete",
        menu_id : delete_menu_id
    };

    if(confirm("정말 삭제하시겠습니까?")==true){
        procCategoryList(getCategoryCondition);
        alert("메뉴가 삭제되었습니다.");
        $(".layerPopArea").css("display", "none");
        drawBigMenu();
    }
    else{
        return;
    }
};

///////그 외 기능들/////////
//테이블을 비워주는 함수
function clearBigTable(){
    var big_tbody = document.getElementById("big_category_tbody");
    big_tbody.innerHTML = '<tr><td colspan="4" align="center" style="height:30px;">등록된 데이터가 없습니다</td></tr>';
};

function clearMediumTable(){
    var medium_tbody = document.getElementById("medium_category_tbody");
    medium_tbody.innerHTML = '<tr><td colspan="4" align="center" style="height:30px;">등록된 데이터가 없습니다</td></tr>';
};

function clearSmallTable(){
    var small_tbody = document.getElementById("small_category_tbody");
    small_tbody.innerHTML = '<tr><td colspan="4" align="center" style="height:30px;">등록된 데이터가 없습니다</td></tr>';
};

//메뉴 이름 클릭 전 붙어있는 css를 미리 제거해주는 함수
function clearBigMenuNameCSS(){
    $(".big_menu_name").css("font-size", "12px");
    $(".big_menu_name").css("font-weight", "normal");
};

function clearMediumMenuNameCSS(){
    $(".medium_menu_name").css("font-size", "12px");
    $(".medium_menu_name").css("font-weight", "normal");
};

function clearSmallMenuNameCSS(){
    $(".small_menu_name").css("font-size", "12px");
    $(".small_menu_name").css("font-weight", "normal");
};

//선택한 tr을 올려주는 함수
function orderUp(otherDBPosition, otherMenuLevelId, myDBPosition, myIndex, el, myMenuLevelId, myPmenuLevelId, callPos)
{
    if(callPos=="big")
    {
        $("#selectedLevel0_menu_id").text(myMenuLevelId);
    }
    else if(callPos=="medium")
    {
        $("#selectedLevel1_menu_id").text(myMenuLevelId);
    }
    else if(callPos=="small")
    {
        $("#selectedLevel2_menu_id").text(myMenuLevelId);
    };

    if((myIndex-1)>=0)
    {
        otherDBPosition=Number(otherDBPosition);
        otherMenuLevelId=Number(otherMenuLevelId);
        myDBPosition=Number(myDBPosition);
        myMenuLevelId=Number(myMenuLevelId);
        myIndex=Number(myIndex);
        myPmenuLevelId=Number(myPmenuLevelId);

        //var $tr = $(el).parent().parent(); //클릭한 버튼이 속한 tr 요소
        //$tr.prev().before($tr);  //현재 tr의 이전 tr 앞에 선택한 tr 넣기
    
        //menu level id, p level id, 바뀌는 나의 position을 별도 계산하여 ajax로 모두 넘긴다.
        var changePosCodition={};
        changePosCodition.upDownGbn="up";
        changePosCodition.otherDBPosition=otherDBPosition;
        changePosCodition.otherMenuLevelId=otherMenuLevelId;
        changePosCodition.myDBPosition=myDBPosition;
        changePosCodition.myMenuLevelId=myMenuLevelId;
        changePosCodition.myIndex=myIndex;
        changePosCodition.myPmenuLevelId=myPmenuLevelId;

        $.ajax({
            url: "/uChangeCategoryMenu?" + $.param({"authPage" : "cCategoryListAdm.js", "changePosCodition":changePosCodition}),
            type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,  contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function(response){
                console.log("change success response="+response.returnvalue);
                drawBigMenu();
            },
            error:function(xhr, textStatus, e){
                console.log("[error]: response="+response.returnvalue);
            }
        });
        //----------------------------------------------------------
    };
};

//선택한 tr을 내려주는 함수
function orderDn(otherDBPosition, otherMenuLevelId, myDBPosition, myIndex, el, myMenuLevelId, myPmenuLevelId, callPos)
{
    otherDBPosition=Number(otherDBPosition);
    otherMenuLevelId=Number(otherMenuLevelId);
    myDBPosition=Number(myDBPosition);
    myMenuLevelId=Number(myMenuLevelId);
    myIndex=Number(myIndex);
    myPmenuLevelId=Number(myPmenuLevelId);

    var rowCount=-1;
    if(callPos=="big")
    {
        rowCount = $("#big_category_tbody tr").length;
        $("#selectedLevel0_menu_id").text(myMenuLevelId);
    }
    else if(callPos=="medium")
    {
        rowCount = $("#medium_category_tbody tr").length;
        $("#selectedLevel1_menu_id").text(myMenuLevelId);
    }
    else if(callPos=="small")
    {
        rowCount = $("#small_category_tbody tr").length;
        $("#selectedLevel2_menu_id").text(myMenuLevelId);
    };

    //마지막을 벗어나면 안된다.
    if((myIndex+1)<rowCount)
    {
        //var $tr = $(el).parent().parent(); //클릭한 버튼이 속한 tr 요소
        //$tr.next().after($tr);  //현재 tr의 다음 tr 뒤에 선택한 tr 넣기

        //menu level id, p level id, 바뀌는 나의 position을 별도 계산하여 ajax로 모두 넘긴다.
        var changePosCodition={};
        changePosCodition.upDownGbn="down";
        changePosCodition.otherDBPosition=otherDBPosition;
        changePosCodition.otherMenuLevelId=otherMenuLevelId;
        changePosCodition.myDBPosition=myDBPosition;
        changePosCodition.myMenuLevelId=myMenuLevelId;
        changePosCodition.myIndex=myIndex;
        changePosCodition.myPmenuLevelId=myPmenuLevelId;

        $.ajax({
            url: "/uChangeCategoryMenu?" + $.param({"authPage" : "cCategoryListAdm.js", "changePosCodition":changePosCodition}),
            type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,  contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function(response){
                console.log("change success");
                drawBigMenu();
            },
            error:function(xhr, textStatus, e){
                console.log("[error]: " + textStatus);
            }
        });
    };
};
// ------------------------------------ end of source ------------------------------------------------------------------------