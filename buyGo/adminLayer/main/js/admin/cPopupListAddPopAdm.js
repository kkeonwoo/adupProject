/****************************************************************************************************
module명: cPopupListAddPopAdm.js
creator: 정길웅
date: 2022.04.19
version 1.0
설명: ADMIN 팝업 관리 페이지의 팝업 페이지
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

async function drawPopupListPopUp(pPopupIDX){
	var txt = "";
	//pPopupIDX값이 없는 경우 등록버튼을 누른 것으로 간주하여 등록 화면을 보여준다
	if(pPopupIDX == "" || pPopupIDX == undefined){
		txt += '  <div class="popup pop800">  \n';
		txt += '    <div class="pop_tit"> 팝업 등록</div> \n';
		txt += '    <div class="pop_cont">   \n';
		txt += '    <form id="frm_popup_uploadImage"  name="img_form"  action="/sitePopup" method="post" enctype="multipart/form-data"> \n';
		txt += '      <div class="text_r mb05">   \n';
		txt += '       <span class="important">*</span> 필수입력  \n';
		txt += '      </div>  \n';
		txt += '      <table class="table_row">  \n';
		txt += '        <colgroup>  \n';
		txt += '          <col width="18%">  \n';
		txt += '          <col width="32%">   \n';
		txt += '          <col width="18%">  \n';
		txt += '          <col width="32%"> \n';
		txt += '        </colgroup>  \n';
		txt += '        <tbody><tr>  \n';
		txt += '          <th><span>제목 <span class="important">*</span></span></th>  \n';
		txt += '          <td colspan="3">  \n';
		txt += '            <input type="text" class="w380" name="title">   \n';
		txt += '          </td> \n';
		txt += '        </tr>\n';
		txt += '        <tr> \n';
		txt += '        <th><span>게시여부 <span class="important">*</span></span></th>  \n';
		txt += '        <td>  \n';
		txt += '          <input type="radio" id="radio02_1" name="view_yn" value="Y" checked="checked"> <label for="radio02_1">게시</label> \n';
		txt += '          <input type="radio" id="radio02_2" name="view_yn" value="N"> <label for="radio02_2">미게시</label> \n';
		txt += '        </td>  \n';
		txt += '          <th><span>게시구분 <span class="important">*</span></span></th>  \n';
		txt += '        <td>  \n';
		txt += '          <input type="radio" id="radio03_1" name="view_div" value="W" checked="checked"> <label for="radio03_1">쇼핑몰</label>  \n';
		txt += '          <input type="radio" id="radio03_2" name="view_div" value="A"> <label for="radio03_2">관리자</label>  \n';
		txt += '        </td> \n';
		txt += '      </tr>  \n';
		txt += '  	  <tr>   \n';
		txt += '   	    <th><span>게시기간 <span class="important">*</span></span></th>		\n';
		txt += '        <td colspan="3">   \n';
		txt += '          <input type="text" name="cont_date_start" id="cont_date_start" class="w100 datepicker1" maxlength="10" value=""> ~   \n';
		txt += '          <input type="text" name="cont_date_end" id="cont_date_end" class="w100 datepicker1" maxlength="10" value="">  \n';
		txt += '        </td>  \n';
		txt += '      </tr> \n';
		txt += '      <tr>   \n';
		txt += '        <th><span>팝업창 위치 <span class="important">*</span></span></th>  \n';
		txt += '        <td colspan="3">  \n';
		txt += '          상단부터(TOP) : <input type="text" name="margin_top" value="0" numberonly=""> px   \n';
		txt += '          &nbsp; &nbsp;  \n';
		txt += '          좌측부터(LEFT) : <input type="text" name="margin_left" value="0" numberonly=""> px   \n';
		txt += '        </td>  \n';
		txt += '      </tr>	 \n';
		txt += '   	  <tr>  \n';
		txt += '          <th><span>팝업 이미지<span class="important">*</span></span></th>  \n';
		txt += '          <td colspan="3">   \n';
		txt += '              <input type="hidden" name="type" value="Popup_add">  \n';
		txt += '              <input type="hidden" name="attach_cd" value="">  \n';
		txt += '              <input type="hidden" name="storagePath" value="eum/resources/temp/site/">  \n';
		txt += '              <input type="hidden" name="img_name" value="">  \n';
		txt += '              <input type="hidden" name="img_size" value="">  \n';
		txt += '              <input type="hidden" name="img_ext" value="">  \n';
		txt += '              <input type="hidden" name="crudGbn" value="update_insert">  \n';
		txt += '       		  <input type="file" name="img_file" id="input_image_add" accept="image/*" onChange="img_CheckSize();">\n';
		txt += '            <p>사이즈 : 1000 * 700 이내 / 파일 : jpg / 용량 : 최대 10MB</p>   \n';
		txt += '   	      </td>  \n';
		txt += '   		</tr>  \n';
		txt += '  	  </tbody>   \n';
		txt += '    </table> \n';
		txt += '      <div class="table_btns text_c">  \n';
		txt += '        <button type="button" class="btn01" onclick="btnCancel();"><span>취소</span></button> \n';
		txt += '        <button type="button" class="btn01 btn_b" onClick="btnInsert();"><span>등록</span></button> \n';
		txt += '      </div>   \n';
		txt += '    </div>   \n';
		txt += '    </form>  \n';
		txt += '    <div class="pop_close">   \n';
		txt += '      <a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a>    \n';
		txt += '   	</div>  \n';
		txt += '  </div>  \n';
	}
	else{
		var rtnValue = await viewPopupDetail(pPopupIDX);
		if(rtnValue == null){
			return false;
		};

		console.log("rtnValue", rtnValue);
		//pPopupIDX값이 있을때는 넘어온 IDX로 조회해서 수정 화면을 보여준다.
		txt += '  <div class="popup pop800">  \n';
		txt += '    <div class="pop_tit"> 팝업 수정/삭제</div> \n';
		txt += '    <div class="pop_cont">   \n';
		txt += '      <form id="frm_popup_EditImage"  name="img_form"  action="/sitePopup" method="post" enctype="multipart/form-data"> \n';
		txt += '      <div class="text_r mb05">   \n';
		txt += '       <span class="important">*</span> 필수입력  \n';
		txt += '      </div>  \n';
		txt += '      <table class="table_row">  \n';
		txt += '        <colgroup>  \n';
		txt += '          <col width="18%">  \n';
		txt += '          <col width="32%">   \n';
		txt += '          <col width="18%">  \n';
		txt += '          <col width="32%"> \n';
		txt += '        </colgroup>  \n';
		txt += '        <tbody><tr>  \n';
		txt += '          <th><span>제목 <span class="important">*</span></span></th>  \n';
		txt += '          <td colspan="3">  \n';
		txt += `            <input type="text" class="w380" name="title" value="`+ rtnValue.TITLE +`">   \n`;
		txt += '          </td> \n';
		txt += '        </tr>\n';
		txt += '        <tr> \n';
		txt += '        <th><span>게시여부 <span class="important">*</span></span></th>  \n';
		txt += '        <td>  \n';
		txt += '          <input type="radio" id="radio02_1" name="view_yn" value="Y" val="Y"> <label for="radio02_1">게시</label> \n';
		txt += '          <input type="radio" id="radio02_2" name="view_yn" value="N" val="Y"> <label for="radio02_2">미게시</label> \n';
		txt += '        </td>  \n';
		txt += '          <th><span>게시구분 <span class="important">*</span></span></th>  \n';
		txt += '        <td>  \n';
		txt += '          <input type="radio" id="radio03_1" name="view_div" value="W" val="W" checked="checked"> <label for="radio03_1">쇼핑몰</label>  \n';
		txt += '          <input type="radio" id="radio03_2" name="view_div" value="A" val="A"> <label for="radio03_2">관리자</label>  \n';
		txt += '        </td> \n';
		txt += '      </tr>  \n';
		txt += '  	  <tr>   \n';
		txt += '   	    <th><span>게시기간 <span class="important">*</span></span></th>		\n';
		txt += '        <td colspan="3">   \n';
		txt += `          <input type="text" name="cont_date_start" id="cont_date_start" class="w100 datepicker1" maxlength="10" value="`+rtnValue.VIEW_START +`"> ~   \n`;
		txt += `          <input type="text" name="cont_date_end" id="cont_date_end" class="w100 datepicker1" maxlength="10" value="`+rtnValue.VIEW_END +`">  \n`;
		txt += '        </td>  \n';
		txt += '      </tr> \n';
		txt += '      <tr>   \n';
		txt += '        <th><span>팝업창 위치 <span class="important">*</span></span></th>  \n';
		txt += '        <td colspan="3">  \n';
		txt += '          상단부터(TOP) : <input type="text" name="margin_top" value="'+rtnValue.MARGIN_TOP+'" numberonly=""> px   \n';
		txt += '          &nbsp; &nbsp;  \n';
		txt += '          좌측부터(LEFT) : <input type="text" name="margin_left" value="'+rtnValue.MARGIN_LEFT+'" numberonly=""> px   \n';

		txt += '              <input type="hidden" name="attach_cd" value="">  \n';	//화면 생성부터 만들어진 값
		txt += '              <input type="hidden" name="attach_cd_original" value="'+rtnValue.ATTACH_CD+'"></td> '	//DB에 이미 들어있는 값
		txt += '              <input type="hidden" name="storagePath" value="eum/resources/temp/site/">  \n';
		txt += '              <input type="hidden" name="img_name" value="">  \n';
		txt += '              <input type="hidden" name="img_size" value="">  \n';
		txt += '              <input type="hidden" name="img_ext" value="">  \n';
		txt += '              <input type="hidden" name="popupIDX" value="'+pPopupIDX+'">  \n';
		txt += '              <input type="hidden" name="crudGbn" value="update_edit">  \n';
		txt += '        </td>  \n';
		txt += '      </tr>	 \n';
		txt += '   	  <tr>  \n';
		txt += '          <th><span>팝업 이미지<span class="important">*</span></span></th>  \n';
		txt += '          <td colspan="3">   \n';
		txt += '              <input type="hidden" name="type" value="Popup_edit">  \n';
		txt += '              <input type="file" id="input_image_add" name="img_file" accept="image/*" onChange="img_CheckSize();"> \n';
		txt += '              <span class="filename">('+rtnValue.FILE_NAME+')</span> \n';
		txt += '             <p>사이즈 : 1000 * 700 이내 / 파일 : jpg / 용량 : 최대 10MB</p>   \n';
		txt += '   	      </td>  \n';
		txt += '   		</tr>  \n';
		txt += '  	  </tbody>   \n';
		txt += '    </table> \n';
		txt += '      <div class="table_btns text_c">  \n';
		txt += '        <button type="button" class="btn01" onclick="btnCancel();"><span>취소</span></button> \n';
		txt += '        <button type="button" class="btn01 btn_b" onclick="btnEdit();"><span>수정</span></button> \n';
		txt += '        <button type="button" class="btn01 btn_g" onclick="btnDelete();"><span>삭제</span></button> \n';
		txt += '      </div> \n';
		txt += '    </div> \n';
		txt += '    </form>  \n';
		txt += '    <div class="pop_close">   \n';
		txt += '      <a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n';
		txt += '   	</div>  \n'
		txt += '  </div>  \n';
	};

	$(".layerPop").html(txt);
	if(pPopupIDX == "" || pPopupIDX == undefined){}
	else{
		if(rtnValue.VIEW_YN == "Y"){
			$("#radio02_1").prop("checked", true);
		}
		else{
			$("#radio02_2").prop("checked", true);
		};

	
		if(rtnValue.VIEW_DIV == "W"){
			$("#radio03_1").prop("checked", true);
		}
		else{
			$("#radio03_2").prop("checked", true);
		}
	};

	$.datepicker.setDefaults({
		dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
		dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'], 
		monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
		monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		yearSuffix: '년',
		dateFormat: 'yy-mm-dd',
		showOn: "both",
		buttonImage : "/eum/resources/images/common/calendar.png",
		buttonImageOnly: true,
		showMonthAfterYear:true,
		constrainInput: true,
		changeMonth: true,
		changeYear: true      
    });

    $('input[name="cont_date_start"]').datepicker();
    $('input[name="cont_date_end"]').datepicker();
	if($('input[name="cont_date_start"]').val() == "") $('input[name="cont_date_start"]').datepicker("setDate", "today");
	if($('input[name="cont_date_end"]').val() == "") $('input[name="cont_date_end"]').datepicker("setDate", "today");

	var attach_cd = document.getElementById("attach_cd").innerText;   
	$("input[name=attach_cd]").val(attach_cd);

    $(".layerPopArea").css("display" ,"block");
};

//미리보기 클릭 시 팝업됨
function previewPop(pAttach_CD){

	var txt ="";
	txt += '<div class="popup" style="width:1050px;"> \n'
	txt += '	<div class="pop_tit"> \n'
	txt += '		팝업 이미지 미리보기 \n'
	txt += '	</div> \n'
	txt += '	<div class="pop_cont" style="text-align:center;"> \n'
	txt += '		<img src="/eum/resources/temp/site/'+pAttach_CD+'.jpg"> \n'
	txt += '	</div> \n'
	txt += '	<div class="pop_close"> \n'
	txt += '		<a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n'
	txt += '	</div> \n'
	txt += '</div> \n'

	$(".layerPop").html(txt);
	$(".layerPopArea").css("display" ,"block");
};

//제목 클릭 시 팝업 창에 placeholder처럼 값이 보이게 만듦
async function viewPopupDetail(pIDX){
	var getPopupDetailDB = {
		crudGbn : "inquiry_detail",
		IDX : pIDX
	};
	var popupDetailDB = await getPopupDetailInfo(getPopupDetailDB);
	return popupDetailDB;
};

//DB 정보를 팝업창에 가지고 와서 viewPopupDetail()에 연계함
async function getPopupDetailInfo(pSearchCondition){
	var ret;
	$.ajax({
		url: "/uGetPopupListAdm?"  + $.param({"searchCondition" : pSearchCondition}),
		type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success: function(response){
			if(response.errorcode == "PFERR_CONF_0000"){
				ret = response.returnvalue[0];
			}
			else{
				alert("데이터 조회 오류입니다.");
				ret = null;
			};
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

//팝업창 취소 버튼 누를 시 작동함
function btnCancel(){
	if (confirm("입력을 취소하시겠습니까?")==true){
		removeLayerPop();
	}
	else{
		return false;
	};
};

//팝업창 닫을 시 흰색 바탕 사라짐
function removeLayerPop(){
	$(".layerPopArea").css("display" ,"none");
};

// 등록버튼 누를 시 작동하는 함수
function btnInsert(){
	var insertTest = insertFormValue();   //등록에 들어가는 값 보정하고 필수 값 체크하는 함수
	if(insertTest=="valid"){
		$("#frm_popup_uploadImage").submit();
		alert("팝업을 등록하였습니다.");
		removeLayerPop();        //팝업 레이어 제거
		eventSearchPopupList(1); //1페이지로 이동
	};
};

// 등록에 들어가는 값 보정하고 필수 값 체크하는 함수
function insertFormValue(){
	var title;  //팝업제목
	var cont_date_start;  //게시기간 시작
	var cont_date_end;  //게시기간 끝
	var image; // 이미지 업로드 여부
	var img_ext; //이미지 포멧

	title = document.querySelector("[name='title']").value;
	cont_date_start = document.querySelector("[name='cont_date_start']");
	cont_date_end = document.querySelector("[name='cont_date_end']");

	//날짜 형식 바꾸기
	document.querySelector("[name='cont_date_start']").value = cont_date_start.value.replaceAll("-", "");
	document.querySelector("[name='cont_date_end']").value = cont_date_end.value.replaceAll("-", "");

	//이미지 정보 넣기
	image = document.getElementById('input_image_add'); 
	console.log(image);
	if(image.value==""||image.value==undefined)  
		{
			img_ext =""  
		}
	else{
		img_ext = image.files[0].name.slice(-3);
		document.querySelector("[name='img_name']").value = image.files[0].name;
		document.querySelector("[name='img_size']").value = image.files[0].size;
		document.querySelector("[name='img_ext']").value = img_ext;
	};

	//제목을 공란으로 비웠을 시
	if(title == "" || title==undefined){
		alert("제목을 입력해주시기 바랍니다.");
		return "invalid";
	}
	//사진을 업로드하지 않았을 시
	else if(image.value==""||image.value==undefined){
		alert("사진을 입력해주시기 바랍니다.");
		return "invalid";
	}
	else if(cont_date_start.value>cont_date_end.value){
		alert("게시기간의 순서가 바뀌었습니다.");
	}
	//사진 형식이 jpg가 아닌 경우
	else if(img_ext !="jpg"){
		alert("파일 형식을 지켜주시기 바랍니다.");
		return "invalid";
	}
	else{
		return "valid";
	};
};




// 수정 버튼 클릭 시 작동하는 함수
function btnEdit(){
	var editTest = editFormValue();
	if(editTest =="valid"){
		document.querySelector("[name='crudGbn']").value = "update_edit";
		$("#frm_popup_EditImage").submit();
		alert("팝업이 수정되었습니다.");
		removeLayerPop();
	};
};

// 수정에 들어가는 값 보정하고 필수 값 체크하는 함수
function editFormValue(){
	var title;
	var cont_date_start;  //게시기간 시작
	var cont_date_end;  //게시기간 끝
	var image;
	title = document.querySelector("[name='title']").value;
	cont_date_start = document.querySelector("[name='cont_date_start']").value;
	cont_date_end = document.querySelector("[name='cont_date_end']").value;
	
	//이미지 정보 넣기
	image = document.querySelector("[name='img_file']"); 

	//제목을 공란으로 비웠을 시
	if(title=="" || title==undefined){
		alert("제목을 입력해 주시기 바랍니다.");
		return "invalid";
	}
	if(cont_date_start>cont_date_end){
		alert("게시기간의 순서가 바뀌었습니다.");
		return "invalid";
	}
	//사진을 업로드하지 않았을 시
	if($("[name=attach_cd_original]").val() == undefined || $("[name=attach_cd_original]").val() == ""){
		if(image.value==""||image.value==undefined){
			alert("사진을 입력해 주시기 바랍니다.");
			return "invalid";
		}
		//이미지 정보 넣기
		var img_ext = image.files[0].name.slice(-3);
		document.querySelector("[name='img_name']").value = image.files[0].name;
		document.querySelector("[name='img_size']").value = image.files[0].size;
		document.querySelector("[name='img_ext']").value = img_ext;
		
		//사진 형식이 jpg가 아닌 경우
		if(img_ext !="jpg"){
		alert("파일 형식을 지켜주시기 바랍니다(jpg형식).");
		return "invalid";
		}
		else{
			//날짜 형식 바꾸기
			document.querySelector("[name='cont_date_start']").value = cont_date_start.replaceAll("-", "");
			document.querySelector("[name='cont_date_end']").value = cont_date_end.replaceAll("-", "");
			return "valid";
		};
	}
	else{
		if(image.value!=""&&image.value!=undefined){
			//이미지 정보 넣기
			var img_ext = image.files[0].name.slice(-3);
			document.querySelector("[name='img_name']").value = image.files[0].name;
			document.querySelector("[name='img_size']").value = image.files[0].size;
			document.querySelector("[name='img_ext']").value = img_ext;
		}
		return "valid";
	}	
	
};


// 삭제버튼 누를 시 작동하는 함수
async function btnDelete(){
	if(confirm("팝업을 삭제하시겠습니까?")==true){
		document.querySelector("[name='crudGbn']").value = "update_delete";
		$("#frm_popup_EditImage").submit();
		alert("팝업을 삭제하였습니다");
		removeLayerPop();
		await eventSearchPopupList(1);
	}
	else{
		return false;
	};
};

//팝업 이미지 사이즈가 너무 큰 경우
function img_CheckSize(){
	var file = document.querySelector("[name='img_file']"); 
	// 업로드 파일 읽기
	if(!file.files[0]){
		return;
	}
	var reader = new FileReader(); 
	reader.readAsDataURL(file.files[0]);
	reader.onload = function(){ 
		var image = new Image();
		image.src = reader.result;
		image.onload=function(){
			if(this.width > 1000 || this.height > 700){
				alert("사이즈가 너무 큽니다.");
				file.value = "";
			};
		};
	}; 
};
// ------------------------------------ end of source ------------------------------------------------------------------------
