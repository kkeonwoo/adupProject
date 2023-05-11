/****************************************************************************************************
module명: cPointTypeListAddPopAdm.js
creator: 정길웅
date: 2022.04.26
version 1.0
설명: ADMIN 포인트 구분 팝업 페이지
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

async function drawPointTypeListPopUp(pPointTypeIDX){
	var txt = "";
    //파라미터 값에 따라 조회해서 데이터 매핑해야하는 경우도 있음
	if(pPointTypeIDX == "" || pPointTypeIDX == undefined){
		txt += '	<input type="hidden" name="idx" value=""> \n';
		txt += '	<input type="hidden" name="POP_TP" id="POP_TP" value=""> \n';
		txt += '	<div class="popup pop800"> \n';
		txt += '		<div class="pop_tit">포인트구분</div> \n';
		txt += '		<div class="pop_cont"> \n';
		txt += '			<div class="text_r mb05"> \n';
		txt += '				<span class="important">*</span> 필수입력 \n';
		txt += '			</div> \n';
		txt += '			<table class="table_row"> \n';
		txt += '				<colgroup><col width="15%"><col width="*"></colgroup> \n';
		txt += '				<tbody> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>포인트명 <span class="important">*</span></span></th> \n';
		txt += '						<td><input type="text" name="point_name_insert" class="w210" maxlength="100" value=""></td> \n';
		txt += '					</tr> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>적립포인트<span class="important">*</span></span></th> \n';
		txt += '						<td><input type="text" onkeypress="return checkNumber(event)" name="formula_point" class="w210" maxlength="100" value=""></td> \n';
		txt += '					</tr> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>유효기간(년)<span class="important">*</span></span></th> \n';
		txt += '					    <td><input type="text" onkeypress="return checkNumber(event)" name="expiration_year" class="w210" maxlength="100" value="">년</td> \n';
		txt += '					</tr> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>적립구분 <span class="important">*</span></span></th> \n';
		txt += '						<td> \n';
		txt += '							<select name="point_chadae_type" id="point_chadae_type_value" style="width:130px;" value="">	\n';
		txt += '								<option value="1">적립</option> \n';
		txt += '								<option value="2">차감</option> \n';
		txt += '							</select> \n';
		txt += '						</td> \n';
		txt += '					</tr> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>상태구분 <span class="important">*</span></span></th> \n';
		txt += '						<td> \n';
		txt += '							<select name="point_status" id="point_status_value" style="width:130px;" value=""> \n';
		txt += '								<option value="1">사용</option> \n';
		txt += '								<option value="2">중단</option> \n';
		txt += '							</select> \n';
		txt += '						</td> \n';
		txt += '					</tr> \n';
		txt += '				</tbody> \n';
		txt += '			</table> \n';
		txt += '			<div class="table_btns text_c"> \n';
		txt += '				<button type="button" class="btn01" onclick="btnSubmitCancel();"><span>취소</span></button> \n';
		txt += '				<button type="button" class="btn01 btn_b" onclick="btnInsert();"><span>등록</span></button> \n';
		txt += '			</div> \n';
		txt += '		</div> \n';
		txt += '		<div class="pop_close"> \n';
		txt += '			<a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n';
		txt += '		</div> \n';
		txt += '	</div> \n';
	}
	else{
		var rtnValue = await viewPointTypeDetail(pPointTypeIDX);
		if(rtnValue == null){
			return false;
		};
		
		// 값이 있을때는 넘어온 ??로 조회해서 해당 내용을 매핑하여 보여줘야 한다.
		txt += '	<input type="hidden" name="idx" value=""> \n';
		txt += '	<input type="hidden" name="POP_TP" id="POP_TP" value=""> \n';
		txt += '	<div class="popup pop800"> \n';
		txt += '		<div class="pop_tit">포인트구분</div> \n';
		txt += '		<div class="pop_cont"> \n';
		txt += '			<div class="text_r mb05"> \n';
		txt += '				<span class="important">*</span> 필수입력 \n';
		txt += '			</div> \n';
		txt += '			<table class="table_row"> \n';
		txt += '				<colgroup><col width="15%"><col width="*"></colgroup> \n';
		txt += '				<tbody> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>포인트명 <span class="important">*</span></span></th> \n';
		txt += `						<td><input type="text" name="point_name_edit" class="w210" maxlength="100" value="`+rtnValue[0].POINT_NAME+`"></td> \n`;
		txt += `						<td id="tmp_point_idx" style="display : none;">`+rtnValue[0].POINT_IDX+`</td> \n`;
		txt += '					</tr> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>적립포인트<span class="important">*</span></span></th> \n';
		txt += `						<td><input type="text" onkeypress="return checkNumber(event)" name="formula_point" class="w210" maxlength="100" value="`+rtnValue[0].FORMULA_POINT+`"></td> \n`;
		txt += '					</tr> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>유효기간(년)<span class="important">*</span></span></th> \n';
		if(rtnValue[0].EXPIRATION_YEAR==null){rtnValue[0].EXPIRATION_YEAR=0};
		txt += `					    <td><input type="text" onkeypress="return checkNumber(event)" name="expiration_year" class="w210" maxlength="100" value="`+rtnValue[0].EXPIRATION_YEAR+`">년</td> \n`;
		txt += '					</tr> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>적립구분 <span class="important">*</span></span></th> \n';
		txt += '						<td> \n';
		txt += '							<select name="point_chadae_type" id="point_chadae_type_value" style="width:130px;" value="">	\n';
		if(rtnValue[0].POINT_CHADAE_TYPE == "1"){
			txt += '								<option value="1" selected>적립</option> \n';
			txt += '								<option value="2">차감</option> \n';
		}
		else if(rtnValue[0].POINT_CHADAE_TYPE == "2"){
			txt += '								<option value="1">적립</option> \n';
			txt += '								<option value="2" selected>차감</option> \n';
		}
		txt += '							</select> \n';
		txt += '						</td> \n';
		txt += '					</tr> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>상태구분 <span class="important">*</span></span></th> \n';
		txt += '						<td> \n';
		txt += '							<select name="point_status" id="point_status_value" style="width:130px;" value=""> \n';
		if(rtnValue[0].POINT_STATUS=="1"){
			txt += '								<option value="1" selected>사용</option> \n';
			txt += '								<option value="2">중단</option> \n';
		}
		else if(rtnValue[0].POINT_STATUS=="2"){
			txt += '								<option value="1">사용</option> \n';
			txt += '								<option value="2" selected>중단</option> \n';
		}
		txt += '							</select> \n';
		txt += '						</td> \n';
		txt += '					</tr> \n';
		txt += '				</tbody> \n';
		txt += '			</table> \n';
		txt += '			<div class="table_btns text_c"> \n';
		txt += '				<button type="button" class="btn01" onclick="btnEditCancel();"><span>취소</span></button> \n';
		txt += '				<button type="button" class="btn01 btn_b" onclick="btnEdit();"><span>수정</span></button> \n';
		txt += '			</div> \n';
		txt += '		</div> \n';
		txt += '		<div class="pop_close"> \n';
		txt += '			<a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n';
		txt += '		</div> \n';
		txt += '	</div> \n';
	};
	
	$(".layerPop").html(txt);
    $(".layerPopArea").css("display" ,"block");
};

//팝업창에서 placeholder처럼 input창에 값을 보여줌
async function viewPointTypeDetail(pPointTypeIDX){
	var JSONData = new Object();
	JSONData.IDX = pPointTypeIDX;
	JSONData.crudGbn = "update_popView";
	var pointTypeDetailDB = await procPointTypeListView(JSONData);
	return pointTypeDetailDB;
};

//팝업 수행이 끝난 후 흰색 배경을 제거함
function removeLayerPop(){
	$(".layerPopArea").css("display" ,"none");
};

//버튼을 눌러 포인트 정보를 삽입
async function btnInsert(){
	var JSONData = new Object();
	var point_name;  //포인트 명칭
	var formula_point;  //적립 포인트
	var expiration_year;  //유효기간
	var point_chadae_type;  //적립 구분(적립 or 차감)
	var point_status;  //포인트 상태(사용 or 중단)

	point_name = document.querySelector("[name='point_name_insert']").value;
	formula_point = document.querySelector("[name='formula_point']").value;
	expiration_year = document.querySelector("[name='expiration_year']").value;
	point_chadae_type = document.getElementById("point_chadae_type_value");
	point_chadae_type = point_chadae_type.options[point_chadae_type.selectedIndex].value;
	point_status = document.getElementById("point_status_value");
	point_status = point_status.options[point_status.selectedIndex].value;
	
	//이름, 적림포인트를 공란으로 비울 경우 alert를 띄움
	if(point_name == "" || point_name == undefined){
		alert("제목을 입력해 주세요");
	}
	else if(formula_point == "" || formula_point == undefined){
		alert("적립포인트를 입력해 주세요");
	}
	//적립으로 놓고 유효기간을 입력하지 않은 경우 alert를 띄움
	else if(point_chadae_type=="1" && (expiration_year == "" || expiration_year == "0")){
		alert("유효기간을 입력하지 않았습니다.");
	}
	//차감으로 놓고 유효기간을 입력한 경우 alert를 띄움
	else if(point_chadae_type=="2" && expiration_year != "" && expiration_year != "0"){
		alert("유효기간을 공란으로 비워야 합니다.")
	}
	else{
		JSONData.point_name = point_name;
		JSONData.formula_point = formula_point;
		JSONData.expiration_year = expiration_year;
		JSONData.point_chadae_type = point_chadae_type;
		JSONData.point_status = point_status;
		JSONData.crudGbn = "update_insert";

		var rtn = await procPointTypeListView(JSONData);
		if(rtn==null){
			alert("포인트구분 등록에 실패하였습니다.");
		}
		else{
			alert("포인트구분이 생성되었습니다.");
		};
		removeLayerPop();
		//1페이지로 돌아감
		eventSearchItem("a", $("#list_cnt option:selected").val(), 1);
	};
};

//팝업 위의 등록 버튼 클릭 시 작동하는 함수
async function btnEdit(){
	var JSONData = new Object();
	var point_idx;  //IDX값
	var point_name;  //포인트명
	var formula_point;  //적립 포인트
	var expiration_year;  //유효기간
	var point_chadae_type; //적립 구분(적립 or 차감)
	var point_status;  //포인트 상태(사용 or 중단)

	point_chadae_type = document.getElementById("point_chadae_type_value");
	point_status = document.getElementById("point_status_value");
	point_idx = document.getElementById("tmp_point_idx");
	point_name = document.querySelector("[name='point_name_edit']").value;
	formula_point = document.querySelector("[name='formula_point']").value;
	expiration_year = document.querySelector("[name='expiration_year']").value;
	point_chadae_type =document.getElementById("point_chadae_type_value").options[point_chadae_type.selectedIndex].value;
	point_status =  point_status.options[point_status.selectedIndex].value;


	if(verifyEdit()=="OK"){
		JSONData.point_idx = point_idx.innerText;
		JSONData.point_name = point_name;
		JSONData.formula_point = formula_point;
		JSONData.expiration_year = expiration_year;
		JSONData.point_chadae_type = point_chadae_type;
		JSONData.point_status = point_status;
		JSONData.crudGbn = "update_edit";
		var ret = await procPointTypeListView(JSONData);
		if(ret==null){
			alert("포인트구분 변경에 실패하였습니다.");
		}
		else{
			alert("포인트구분이 수정되었습니다");
		}
		removeLayerPop();
		eventSearchItem("a", $("#list_cnt option:selected").val(), 1);
	}
};

function verifyEdit(){

	let point_chadae_type = document.getElementById("point_chadae_type_value");
	let point_status = document.getElementById("point_status_value");
	let point_name = document.querySelector("[name='point_name_edit']").value;
	let formula_point = document.querySelector("[name='formula_point']").value;
	let expiration_year = document.querySelector("[name='expiration_year']").value;
	point_chadae_type =document.getElementById("point_chadae_type_value").options[point_chadae_type.selectedIndex].value;
	point_status =  point_status.options[point_status.selectedIndex].value;

	if(point_name == "" || point_name == undefined){
		alert("제목을 입력해 주세요");
	}
	else if(formula_point == "" || formula_point==undefined){
		alert("적립포인트를 입력해 주세요");
	}
	else if(point_chadae_type=="1" && (expiration_year == "" || expiration_year == "0")){
		alert("유효기간을 입력하지 않았습니다.");
	}
	else if(point_chadae_type=="2" && expiration_year != "" && expiration_year != "0"){
		alert("유효기간을 공란으로 비워야 합니다.")
	}
	else{
		return "OK";
	}
};

//팝업 위의 취소 버튼 누를 시 작동함
function btnEditCancel(){
	if (confirm("포인트구분 수정을 취소하시겠습니까?")==true){
		removeLayerPop();
	}
	else{
		return false;
	}
};

function btnSubmitCancel(){
	if (confirm("포인트구분 등록을 취소하시겠습니까?")==true){
		removeLayerPop();
	}
	else{
		return false;
	}
};

//유효기간 입력 시 숫자만 입력되게 만드는 함수
function checkNumber(event) {
	if(event.key >= 0 && event.key <= 9) {
		return true;
	}
	else{
		return false;
	}
};
// ------------------------------------ end of source ------------------------------------------------------------------------
