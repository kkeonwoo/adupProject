/****************************************************************************************************
module명: cBannerListAddPopAdm.js
creator: 정길웅
date: 2022.04.23
version 1.0
설명: ADMIN 배너 관리 팝업 페이지
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

async function drawBannerListPopUp(pBannerIDX){
	var txt = "";
    //값이 없을 때는 등록 버튼을 누른 것으로 취급한다
	if(pBannerIDX == "" || pBannerIDX == undefined || pBannerIDX == "undefined"){
		txt += '	  <input type="hidden" name="banner_idx" value=""> \n';
		txt += '      <input type="hidden" name="POP_TP" id="POP_TP" value=""> \n';
		txt += '		<div class="popup pop800"> \n';
		txt += '			<div class="pop_tit">배너등록</div> \n';
		txt += '			<div class="pop_cont"> \n';
		txt += '				<div class="text_r mb05"> \n';
		txt += '					<span class="important">*</span> 필수입력 \n';
		txt += '				</div> \n';
		txt += '				<table class="table_row"> \n';
		txt += '					<colgroup><col width="15%"><col width="*"></colgroup> \n';
		txt += '					<tbody> \n';
		txt += '						<tr> \n';
		txt += '							<th><span>배너제목<span class="important">*</span></span></th> \n';
		txt += '							<td><input type="text" name="banner_title" class="w210" maxlength="100" value=""></td> \n';
		txt += '						</tr> \n';
		txt += '						<tr> \n';
		txt += '							<th><span>배너상태<span class="important">*</span></span></th> \n';
		txt += '							<td> \n';
		txt += '								<select name="banner_status" style="width:130px;" value=""> \n';
		txt += '									<option value="1">사용</option> \n';
		txt += '									<option value="2">중단</option> \n';
		txt += '								</select> \n';
		txt += '							</td> \n';
		txt += '						</tr> \n';
		txt += '						<tr> \n';
		txt += '							<th><span>등록상태<span class="important">*</span></span></th> \n';
		txt += '							<td> \n';
		txt += '								<select name="banner_stage" style="width:130px;" value=""> \n';
		txt += '									<option value="1">등록</option> \n';
		txt += '									<option value="2">제외</option> \n';
		txt += '								</select> \n';
		txt += '							</td> \n';
		txt += '						</tr> \n';
		txt += '					</tbody> \n';
		txt += '				</table>  \n';
		txt += '				<div class="table_btns text_c"> \n';
		txt += '					<button type="button" class="btn01 btn_b" onclick="btnInsert();"><span>등록</span></button> \n';
		txt += '				</div> \n';
		txt += '			</div> \n';
		txt += '			<div class="pop_close"> \n';
		txt += '				<a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n';
		txt += '			</div> \n';
		txt += '		</div> \n';
	}
	else{
		var rtnValue = await viewBannerDetail(pBannerIDX);
		if(rtnValue == null){
			return false;
		};
		
		// 값이 있을때는 수정버튼을 클릭 한 것으로 취급한다
		txt += '		<input type="hidden" name="banner_idx" value="83"> \n';
		txt += '		<input type="hidden" name="POP_TP" id="POP_TP" value=""> \n';
		txt += '		<div class="popup pop800"> \n';
		txt += '			<div class="pop_tit">배너등록</div> \n';
		txt += '			<div class="pop_cont"> \n';
		txt += '				<div class="text_r mb05"> \n';
		txt += '					<span class="important">*</span> 필수입력 \n';
		txt += '				</div> \n';
		txt += '				<table class="table_row"> \n';
		txt += '					<colgroup><col width="15%"><col width="*"></colgroup> \n';
		txt += '					<tbody> \n';
		txt += '						<tr> \n';
		txt += '							<th><span>배너제목<span class="important">*</span></span></th> \n';
		txt += `							<td><input type="text" name="banner_title" class="w210" maxlength="100" value="`+rtnValue[0].BANNER_TITLE+`"></td> \n`;
		txt += '						</tr> \n';
		txt += '						<tr> \n';
		txt += '							<th><span>배너상태<span class="important">*</span></span></th> \n';
		txt += '							<td> \n';
		if(rtnValue[0].BANNER_STATUS=='1'){
			txt += '								<select name="banner_status" style="width:130px;" value="1"> \n';
			txt += '									<option value="1" selected>사용</option> \n';
			txt += '									<option value="2">중단</option> \n';
		}
		else if(rtnValue[0].BANNER_STATUS=='2'){
			txt += '								<select name="banner_status" style="width:130px;" value="2"> \n';
			txt += '									<option value="1">사용</option> \n';
			txt += '									<option value="2" selected>중단</option> \n';
		}
		txt += '								</select> \n';
		txt += '							</td> \n';
		txt += `							<td id="IDX_value_hidden" style="display:none">`+pBannerIDX+`</td> \n`;
		txt += '						</tr> \n';
		txt += '						<tr> \n';
		txt += '							<th><span>등록상태<span class="important">*</span></span></th> \n';
		txt += '							<td> \n';
		if(rtnValue[0].BANNER_STAGE=='1'){
			txt += '								<select name="banner_stage" style="width:130px;" value="1"> \n';
			txt += '									<option value="1" selected>등록</option> \n';
			txt += '									<option value="2">제외</option> \n';
		}
		else if(rtnValue[0].BANNER_STAGE=='2'){
			txt += '								<select name="banner_stage" style="width:130px;" value="2"> \n';
			txt += '									<option value="1">등록</option> \n';
			txt += '									<option value="2" selected>제외</option> \n';
		}
		else if(rtnValue[0].BANNER_STAGE==null){
			txt += '								<select name="banner_stage" style="width:130px;" value="1"> \n';
			txt += '									<option value="1" selected>등록</option> \n';
			txt += '									<option value="2">제외</option> \n';
		};
		txt += '								</select> \n';
		txt += '							</td> \n';
		txt += '						</tr> \n';
		txt += '					</tbody> \n';
		txt += '				</table> \n';
		txt += '				<div class="table_btns text_c"> \n';
		txt += '					<button type="button" class="btn01 btn_b" onclick="btnEdit();"><span>등록</span></button> \n';
		txt += '				</div> \n';
		txt += '			</div> \n';
		txt += '			<div class="pop_close"> \n';
		txt += '				<a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n';
		txt += '			</div> \n';
		txt += '		</div> \n';
	};
	
	$(".layerPop").html(txt);
    $(".layerPopArea").css("display" ,"block");
};

//제목 클릭 시 팝업 창에 placeholder처럼 값이 보이게 만듦
function viewBannerDetail(pBannerIDX){
	var JSONData = new Object();
	JSONData.IDX = pBannerIDX;
	JSONData.crudGbn = "update_popView";
	var bannerDetailDB = getBannerListView(JSONData);
	return bannerDetailDB;
};

//취소버튼 클릭 시 팝업창이 사라짐
function removeLayerPop(){
	$(".layerPopArea").css("display" ,"none");
};

//등록버튼 클릭 시 수행되는 함수
function btnInsert(){
	var JSONData = new Object();
	var banner_title; //배너명
	var banner_status; //배너상태
	var banner_stage; //등록상태

	banner_title = document.querySelector("[name='banner_title']").value;
	banner_status = document.querySelector("[name='banner_status']").value;
	banner_stage= document.querySelector("[name='banner_stage']").value;

	//제목이 공란일 때
	if(banner_title == "" || banner_title==undefined){
		alert("제목을 입력해 주세요");
	}
	else{
		JSONData.banner_title = banner_title;
		JSONData.banner_status = banner_status;
		JSONData.banner_stage = banner_stage;
		JSONData.crudGbn = "update_insert";
		getBannerListView(JSONData);
		alert("배너가 생성되었습니다");
		removeLayerPop();
		//수행 이후 1페이지로 이동
		eventSearchBannerList($("#list_cnt option:selected").val(), 1);
	};
};

//팝업 위의 등록 버튼 클릭 시 작동하는 함수
function btnEdit(){
	var JSONData = new Object();
	var banner_title; //배너명
	var banner_status; //배너상태
	var banner_stage; //등록상태
	var banner_IDX; //DB의 배너 IDX값

	banner_title = document.querySelector("[name='banner_title']").value;
	banner_status = document.querySelector("[name='banner_status']").value;
	banner_stage= document.querySelector("[name='banner_stage']").value;
	banner_IDX = document.getElementById("IDX_value_hidden").innerText;

	//제목이 공란일 때
	if(banner_title == "" || banner_title==undefined){
		alert("제목을 입력해 주세요");
	}
	else{
		JSONData.banner_title = banner_title;
		JSONData.banner_status = banner_status;
		JSONData.banner_stage = banner_stage;
		JSONData.banner_IDX = banner_IDX;
		JSONData.crudGbn = "update_edit";

		getBannerListView(JSONData);
		alert("배너가 수정되었습니다");
		removeLayerPop();
		//1페이지로 이동
		eventSearchBannerList($("#list_cnt option:selected").val(), 1);
	};
};
// ------------------------------------ end of source ------------------------------------------------------------------------
