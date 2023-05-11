/****************************************************************************************************
module명: cAdminListPopAdm.js
creator: 정길웅
date: 2022.05.17
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

function drawAdminListPopUp(){
	var txt = "";
		txt += '			<div class="popup pop800"> \n';
		txt += '				<div class="pop_tit">운영자등록</div> \n';
		txt += '				<div class="pop_cont"> \n';
		txt += '					<div class="text_r mb05"> \n';
		txt += '						<span class="important">*</span> 필수입력 \n';
		txt += '					</div> \n';
		txt += '					<table class="table_row" id="table_add"> \n';
		txt += '						<colgroup><col width="15%"><col width="35%"><col width="16%"><col width="*"></colgroup> \n';
		txt += '						<tbody> \n';
		txt += '							<tr> \n';
		txt += '								<th><span>아이디 <span class="important">*</span></span></th> \n';
		txt += '								<td colspan="3"> \n';
		txt += '									<input type="text" name="input_id" id="input_id" class="w210" maxlength="30" value=""> 	 \n';
		txt += '									<button type="button" class="btn_ss01" onclick="chkDupId();"><span>중복확인</span></button> \n';
		txt += '								</td> \n';
		txt += '							</tr> \n';
		txt += '							<tr> \n';
		txt += '								<th><span>비밀번호 <span class="important">*</span></span></th> \n';
		txt += '								<td> \n';
		txt += '									<input type="password" name="input_pwd" class="w210" maxlength="20" value=""> \n';
		txt += '									<p class="font11">영문(대소문자), 숫자, 특수문자 조합으로 8자 이상</p> \n';
		txt += '								</td> \n';
		txt += '								<th><span>비밀번호 재확인 <span class="important">*</span></span></th> \n';
		txt += '								<td><input type="password" name="input_pwd_check" class="w210" maxlength="20" value=""></td> \n';
		txt += '							</tr> \n';
		txt += '							<tr> \n';
		txt += '								<th><span>상호명 <span class="important">*</span></span></th> \n';
		txt += '								<td colspan="1"><input type="text" name="input_supplier_name" class="w210" maxlength="50" value=""></td> \n';
		txt += '								<th><span>ADMIN/SUPER <span class="important">*</span></span></th> \n';
		txt += '								<td> \n';
		txt += '									<select name="input_admin_name" style="width:80px;"> \n';
		txt += '										<option value="ADMIN1">ADMIN1</option> \n';
		txt += '										<option value="ADMIN2">ADMIN2</option> \n';
		txt += '										<option value="SUPER">SUPER</option> \n';
		txt += '									</select> \n';
		txt += '								</td> \n';
		txt += '							</tr> \n';
		txt += '							<tr> \n';
		txt += '								<th><span>대표자 이름 <span class="important">*</span></span></th> \n';
		txt += '								<td colspan="3"><input type="text" name="input_charger_name" class="w210" maxlength="50" value=""></td> \n';
		txt += '							</tr> \n';
		txt += '							<tr> \n';
		txt += '								<th><span>전화번호</span></th> \n';
		txt += '								<td> \n';
		txt += '									<select name="input_tel_1" style="width:70px;"> \n';
		txt += '										<option value="02">02</option> \n';
		txt += '										<option value="031">031</option> \n';
		txt += '										<option value="032">032</option> \n';
		txt += '										<option value="033">033</option> \n';
		txt += '										<option value="041">041</option> \n';
		txt += '										<option value="042">042</option> \n';
		txt += '										<option value="043">043</option> \n';
		txt += '										<option value="051">051</option> \n';
		txt += '										<option value="052">052</option> \n';
		txt += '										<option value="053">053</option> \n';
		txt += '										<option value="054">054</option> \n';
		txt += '										<option value="055">055</option> \n';
		txt += '										<option value="061">061</option> \n';
		txt += '										<option value="062">062</option> \n';
		txt += '										<option value="063">063</option> \n';
		txt += '										<option value="064">064</option> \n';
		txt += '										<option value="0505">0505</option> \n';
		txt += '										<option value="0502">0502</option> \n';
		txt += '										<option value="070">070</option> \n';
		txt += '									</select> \n';
		txt += '									<input type="text" name="input_tel_2" class="w55" maxlength="4" onkeypress="return checkNumber(event)" value=""> -  \n';
		txt += '									<input type="text" name="input_tel_3" class="w55" maxlength="4" onkeypress="return checkNumber(event)" value=""> \n';
		txt += '								</td> \n';
		txt += '								<th><span>휴대폰 <span class="important">*</span></span></th> \n';
		txt += '								<td> \n';
		txt += '									<select name="input_mobile_1" style="width:70px;"> \n';
		txt += '										<option value="010">010</option> \n';
		txt += '										<option value="011">011</option> \n';
		txt += '										<option value="016">016</option> \n';
		txt += '										<option value="017">017</option> \n';
		txt += '										<option value="018">018</option> \n';
		txt += '										<option value="019">019</option> \n';
		txt += '										<option value="0130">0130</option> \n';
		txt += '										<option value="0502">0502</option> \n';
		txt += '										<option value="070">070</option> \n';
		txt += '									</select> \n';
		txt += '									<input type="text" name="input_mobile_2" class="w55" maxlength="4" onkeypress="return checkNumber(event)" value=""> -  \n';
		txt += '									<input type="text" name="input_mobile_3" class="w55" maxlength="4" onkeypress="return checkNumber(event)" value=""> \n';
		txt += '								</td> \n';
		txt += '							</tr> \n';
		txt += '							<tr> \n';
		txt += '								<th><span>이메일 <span class="important">*</span></span></th> \n';
		txt += '								<td colspan="2"> \n';
		txt += '									<input type="text" name="input_email_1" class="w100"> @  \n';
		txt += '									<input type="text" name="input_email_2" id="input_email2" class="w100"> \n';
		txt += '									<select id="input_email3" style="width:100px;" onchange="changeEmail();"> \n';
		txt += '										<option value="">- 직접입력 -</option> \n';
		txt += '										<option value="gmail.com">gmail.com</option> \n';
		txt += '										<option value="naver.com">naver.com</option> \n';
		txt += '										<option value="hanmail.net">hanmail.net</option> \n';
		txt += '										<option value="kakao.com">kakao.com</option> \n';
		txt += '										<option value="nate.com">nate.com</option> \n';
		txt += '									</select> \n';
		txt += '								</td> \n';
		txt += '							</tr> \n';
		txt += '						</tbody> \n';
		txt += '					</table> \n';
		txt += '					<div class="table_btns text_c"> \n';
		txt += '						<button type="button" class="btn01" onclick="btnSubmitCancel();"><span>취소</span></button> \n';
		txt += '						<button type="button" class="btn01 btn_b" onclick="registerAccount();"><span>등록</span></button>  \n';
		txt += '					</div> \n';
		txt += '				</div> \n';
		txt += '				<div class="pop_close"> \n';
		txt += '					<a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n';
		txt += '				</div> \n';
		txt += '			</div> \n';
	$(".layerPop").html(txt);

    $(".layerPopArea").css("display", "block");
};

async function drawAdminEdit(pAdminInfo, account_status, license_status){
	if(pAdminInfo!=undefined&&pAdminInfo!=""){
		var pop_info = {
			supplier_ssn : pAdminInfo,
			crudGbn : "update_popView"
		};
		var rtn = await procAdminListView(pop_info);
		if(rtn[0].CHARGER_MOBILE==null||rtn[0].CHARGER_MOBILE==undefined){
			var mobile_front = "";
			var mobile_back = "";
		}
		else{
			var mobile_front = rtn[0].CHARGER_MOBILE.split("-")[1];
			var mobile_back = rtn[0].CHARGER_MOBILE.split("-")[2];
		};
		if(rtn[0].EMAIL==null||rtn[0].EMAIL==undefined){
			var email_front = "";
			var email_back = "";
		}
		else{
			var email_front = rtn[0].EMAIL.split("@")[0];
			var email_back = rtn[0].EMAIL.split("@")[1];
		}
		if(rtn[0].HEAD_OFFICE_PHONE==null||rtn[0].HEAD_OFFICE_PHONE==undefined||rtn[0].HEAD_OFFICE_PHONE==""){
			var phone_front = "";
			var phone_back = "";
		}
		else{
			var phone_front = rtn[0].HEAD_OFFICE_PHONE.split("-")[1];
			var phone_back = rtn[0].HEAD_OFFICE_PHONE.split("-")[2];
		};

		var txt = "";
		txt += '	<input type="hidden" name="idx" value="1"> \n';
		txt += '	<div class="popup pop800"> \n';
		txt += '		<div class="pop_tit">관리자 수정</div> \n';
		txt += '		<div class="pop_cont"> \n';
		txt += '			<div class="text_r mb05"> \n';
		txt += '				<span class="important">*</span> 필수입력 \n';
		txt += '			</div> \n';
		txt += '			<table class="table_row" id="table_edit" > \n';
		txt += '				<colgroup><col width="15%"><col width="35%"><col width="15%"><col width="35%"></colgroup> \n';
		txt += '				<tbody> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>상태 <span class="important">*</span></span></th> \n';
		txt += '						<td colspan="3"> \n';
		if(account_status=="Active"&&license_status=="계약"){
			txt += '							<input type="radio" id="usetype01" name="reg_status" value="1" val="1" checked> <label for="usetype01">사용</label> \n';
			txt += '							<input type="radio" id="usetype02" name="reg_status" value="2" val="1"> <label for="usetype02">사용중지</label> \n';
		}
		else{
			txt += '							<input type="radio" id="usetype01" name="reg_status" value="1" val="1"> <label for="usetype01">사용</label> \n';
			txt += '							<input type="radio" id="usetype02" name="reg_status" value="2" val="1" checked> <label for="usetype02">사용중지</label> \n';
		}
		txt += '						</td> \n';
		txt += '					</tr> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>상호명</span></th> \n';
		txt += '						<td colspan="3">'+rtn[0].SUPPLIER_NAME+'</td> \n';
		txt += '					</tr> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>사업자번호</span></th> \n';
		txt += '						<td colspan="3" id="popView_SSN">'+rtn[0].SUPPLIER_SSN+'</td> \n';
		txt += '					</tr> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>비밀번호 <span class="important">*</span></span></th> \n';
		txt += '						<td> \n';
		txt += '							<input type="password" name="input_pwd" class="w210" maxlength="20" value=""> \n';
		txt += '							<p class="font11">영문(대소문자), 숫자, 특수문자 조합으로 8자 이상</p> \n';
		txt += '						</td> \n';
		txt += '						<th><span>비밀번호 재확인<span class="important">*</span></span></th> \n';
		txt += '						<td><input type="password" name="input_pwd_check" class="w210" maxlength="20" value=""></td> \n';
		txt += '					</tr> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>이름 <span class="important">*</span></span></th> \n';
		txt += '						<td colspan="3"><input type="text" name="input_charger_name" class="w210" maxlength="50" value="'+rtn[0].HEAD_OFFICE_CHARGER+'"></td> \n';
		txt += '					</tr> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>전화번호</span></th> \n';
		txt += '						<td> \n';
		txt += '							<select name="input_tel_1" style="width:70px;" value="02"> \n';
		txt += '								<option value="02">02</option> \n';
		txt += '								<option value="031">031</option> \n';
		txt += '								<option value="032">032</option> \n';
		txt += '								<option value="033">033</option> \n';
		txt += '								<option value="041">041</option> \n';
		txt += '								<option value="042">042</option> \n';
		txt += '								<option value="043">043</option> \n';
		txt += '								<option value="051">051</option> \n';
		txt += '								<option value="052">052</option> \n';
		txt += '								<option value="053">053</option> \n';
		txt += '								<option value="054">054</option> \n';
		txt += '								<option value="055">055</option> \n';
		txt += '								<option value="061">061</option> \n';
		txt += '								<option value="062">062</option> \n';
		txt += '								<option value="063">063</option> \n';
		txt += '								<option value="064">064</option> \n';
		txt += '								<option value="0505">0505</option> \n';
		txt += '								<option value="0502">0502</option> \n';
		txt += '								<option value="070">070</option> \n';
		txt += '							</select> \n';
		txt += '							<input type="text" name="input_tel_2" class="w55" maxlength="4" onkeypress="return checkNumber(event)" value="'+phone_front+'"> -  \n';
		txt += '							<input type="text" name="input_tel_3" class="w55" maxlength="4" onkeypress="return checkNumber(event)" value="'+phone_back+'"> \n';
		txt += '						</td> \n';
		txt += '						<th><span>휴대폰 <span class="important">*</span></span></th> \n';
		txt += '						<td> \n';
		txt += '							<select name="input_mobile_1" style="width:70px;" value="010"> \n';
		txt += '								<option value="010">010</option> \n';
		txt += '								<option value="011">011</option> \n';
		txt += '								<option value="016">016</option> \n';
		txt += '								<option value="017">017</option> \n';
		txt += '								<option value="018">018</option> \n';
		txt += '								<option value="019">019</option> \n';
		txt += '								<option value="0130">0130</option> \n';
		txt += '								<option value="0502">0502</option> \n';
		txt += '								<option value="070">070</option> \n';
		txt += '							</select> \n';
		txt += '							<input type="text" name="input_mobile_2" class="w55" maxlength="4" onkeypress="return checkNumber(event)" value="'+mobile_front+'"> -  \n';
		txt += '							<input type="text" name="input_mobile_3" class="w55" maxlength="4" onkeypress="return checkNumber(event)" value="'+mobile_back+'"> \n';
		txt += '						</td> \n';
		txt += '					</tr> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>이메일 <span class="important">*</span></span></th> \n';
		txt += '						<td colspan="2"> \n';
		txt += '							<input type="text" name="input_email_1" class="w100" value="'+email_front+'"> @  \n';
		txt += '							<input type="text" name="input_email_2" id="input_email2" class="w100" value="'+email_back+'"> \n';
		txt += '							<select id="input_email3" style="width:100px;" onchange="changeEmail();"> \n'; 
		txt += '								<option value="">- 직접입력 -</option> \n';
		txt += '								<option value="gmail.com">gmail.com</option> \n';
		txt += '								<option value="naver.com">naver.com</option> \n';
		txt += '								<option value="hanmail.net">hanmail.net</option> \n';
		txt += '								<option value="kakao.com">kakao.com</option> \n';
		txt += '								<option value="nate.com">nate.com</option> \n';
		txt += '							</select> \n';
		txt += '						</td> \n';
		txt += '					</tr> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>가입일</span></th> \n';
		txt += '						<td colspan="3">'+rtn[0].CREATION_DATETIME+'</td> \n'; 
		txt += '					</tr> \n';
		txt += '					<tr> \n';
		txt += '						<th><span>등록자 정보</span></th> \n';
		txt += '						<td colspan="3">'+rtn[0].CREATION_WORKER+'</td> \n';
		txt += '					</tr> \n';
		txt += '				</tbody> \n';
		txt += '			</table> \n';
		txt += '			<div class="table_btns text_c"> \n';
		txt += '				<button type="button" class="btn01" onclick="btnEditCancel();"><span>취소</span></button> \n';
		txt += '				<button type="button" class="btn01 btn_b" onclick="editAccount();"><span>수정</span></button>  \n';
		txt += '			</div> \n';
		txt += '		</div> \n';
		txt += '		<div class="pop_close"> \n';
		txt += '			<a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n';
		txt += '		</div> \n';
		txt += '	</div> \n';

		$(".layerPop").html(txt);

		$(".layerPopArea").css("display" ,"block");
	};
};

//취소버튼 클릭 시 팝업창이 사라짐
function removeLayerPop()
{
	$(".layerPopArea").css("display" ,"none");
};

//이메일 select창 선택 시 이메일 뒤쪽 부분이 생성됨
function changeEmail()
{
	var email_back = document.getElementById("input_email3").value;
	document.getElementById("input_email2").value = email_back;
};

//숫자만 입력되게 만드는 함수
function checkNumber(event)
{
	if(event.key >= 0 && event.key <= 9) {
		return true;
	}
	else{		
		return false;
	}
};

//닫기버튼 클릭 시 팝업창이 사라짐
function removeLayerPop()
{
	$(".layerPopArea").css("display" ,"none");
};

//취소 버튼 누를 시 확인시켜줌(수정팝업)
function btnEditCancel()
{
	if (confirm("관리자수정을 취소하시겠습니까?")==true){
		removeLayerPop();
	}
	else{
		return false;
	}
};

//취소 버튼 누를 시 확인시켜줌(등록팝업)
function btnSubmitCancel()
{
	if (confirm("운영자등록을 취소하시겠습니까?")==true){
		removeLayerPop();
	}
	else{
		return false;
	}
};

//아이디 중복확인 누를 시 작동하는 함수
function chkDupId()
{
    var opt={};
    opt.ssn=$("input[name='input_id']").val();
    if(opt.ssn.length>0)
    {
        //입력한 ID로 중복을 Check한다.
		//입력값이 점주이기 때문에 구분자를 B2B_ADMIN으로 둔다.
        opt.checkGbn="B2B_ADMIN";
        opt.procGbn="CHECK_DUP_ID";
        $.ajax({
            url: "/uAddAccountB2B?"  + $.param({"addinfo":opt, "client":getNaviInfo()}),
            type: "POST", async: false, dataType: "JSON", crossOrigin: true, cache: false,
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(response)
            {
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
	};
};

function getNaviInfo()
{
	var info={};
	info.browserName=navigator.appName;
	info.appCodeName=navigator.appCodeName;
	info.platformName=navigator.platform;
	info.userAgent=navigator.userAgent;
	info.browserVersion=navigator.appVersion;
	info.loginPage="loginadm.html";
	var user=navigator.userAgent;
	var is_mobile="false";
	if(user.indexOf("iPhone")>-1||user.indexOf("Android")>-1 ){is_mobile="true";};
	info.isMobile=is_mobile;

	//20220621 resolution check add start
	info.resX=screen.width;
	info.resY=screen.height;
	//20220621 resolution check add end

	return info;
};

//운영자 등록하는 함수
async function registerAccount()
{
	//패스워드 암호화
	var input_password = $("input[name='input_pwd']").val();
	input_password = CryptoJS.SHA256(input_password).toString();

	//패스워드 배열 조합 확인용
	var pId = document.getElementById("input_id").innerText;
	var password_pattern = $("input[name='input_pwd']").val();
	var checkPassword = checkLevel2(pId, password_pattern);
	
	if(pId==undefined||pId=="")
	{
		//아이디 중복확인을 하지 않고 등록을 누르는 경우
		alert("아이디 중복확인을 체크해주시기 바랍니다.");
	}
	else if(checkPassword!="OK")
	{
		//비밀번호 배열 조합
		alert(checkPassword);
	}
	else if($("input[name='input_supplier_name']").val().length<2)
	{
		//상호명 길이
		alert("상호명의 길이를 2자 이상으로 설정해주시기 바랍니다.");
	}
	else if($("input[name='input_charger_name']").val().length<2)
	{
		//대표자 이름 길이
		alert("이름의 길이를 2자 이상으로 설정해주시기 바랍니다.");
	}
	else if($("input[name='input_mobile_2']").val().length<1||$("input[name='input_mobile_3']").val().length<1)
	{
		//휴대폰 번호 작성란
		alert("휴대폰 번호 작성란에 공란이 있습니다.");
	}
	else if($("input[name='input_email_1']").val().length<3||$("input[name='input_email_2']").val().length<4)
	{
		//이메일 작성란
		alert("정상적인 이메일 형식이 아닙니다. 이메일 작성란을 다시 확인해주시기 바랍니다.");
	}
	else if($("input[name='input_pwd']").val() != $("input[name='input_pwd_check']").val() )
	{
		//비밀번호 재확인 값이 다른 경우
		alert("비밀번호의 값이 일치하지 않습니다.");
	}
	else
	{
		if($("input[name='input_tel_2']").val()=="" || $("input[name='input_tel_3']").val()=="")
		{
			var phone ="";
		}
		else
		{
			var phone = $("select[name=input_tel_1]").val() + "-" + $("input[name='input_tel_2']").val() + "-" + $("input[name='input_tel_3']").val();
		};
		var mobile = $("select[name=input_mobile_1]").val() + "-" + $("input[name='input_mobile_2']").val() + "-" + $("input[name='input_mobile_3']").val();
		var email = $("input[name='input_email_1']").val() + "@" + $("input[name=input_email_2]").val();
	
		var adminCondition = {
			pId :  pId,
			pwd :  input_password,
			pwd_original : $("input[name='input_pwd']").val(),
			supplier_name : $("input[name='input_supplier_name']").val(),
			charger : $("input[name='input_charger_name']").val(),
			role :  $("select[name=input_admin_name]").val(),
			phone : phone,
			mobile : mobile,
			charger_email :email,
			crudGbn : "update_insert",
		};
	
		var adminInfo =await procAdminListView(adminCondition); //검색조건 적용 함수
		
		if(adminInfo=="OK")
		{
			alert("운영자 등록이 완료되었습니다.");
			eventSearchAdminList(1);
			removeLayerPop();
		}
		else if(adminInfo==undefined||adminInfo=="")
		{
			alert("DATA 등록 또는 수정 중 오류가 발생했습니다.(IT운영자 문의)");
			removeLayerPop();
		};
	};
};

//관리자 수정하는 함수
async function editAccount()
{
	//패스워드 배열 조합 확인용
	var supplier_ssn = document.getElementById("popView_SSN").innerText;
	var password_pattern = $("input[name='input_pwd']").val();
	var checkPassword="";

	if(password_pattern!=undefined&&password_pattern.length>0)
	{
		checkPassword = checkLevel2(supplier_ssn, password_pattern);
	};
	
	//비밀번호 배열 조합
	if(checkPassword.length>0&&checkPassword!="OK")
	{
		alert(checkPassword);
	}
	else if($("input[name='input_pwd']").val() != $("input[name='input_pwd_check']").val() )
	{
		//비밀번호 값 일치여부
		alert("비밀번호의 값이 일치하지 않습니다.");
	}
	else if($("input[name='input_charger_name']").val().length<2)
	{
		//대표자 이름 길이
		alert("이름의 길이를 2자 이상으로 설정해주시기 바랍니다.");
	}
	else if($("input[name='input_mobile_2']").val().length<1||$("input[name='input_mobile_3']").val().length<1)
	{
		//휴대폰 번호 작성란
		alert("휴대폰 번호 작성란에 공란이 있습니다.");
	}
	else if($("input[name='input_email_1']").val().length<3||$("input[name='input_email_2']").val().length<4)
	{
		//이메일 작성란
		alert("정상적인 이메일 형식이 아닙니다. 이메일 작성란을 다시 확인해주시기 바랍니다.");
	}
	else
	{
		if($("input[name='input_tel_2']").val()=="" || $("input[name='input_tel_3']").val()=="")
		{
			var phone ="";
		}
		else
		{
			var phone = $("select[name=input_tel_1]").val() + "-" + $("input[name='input_tel_2']").val() + "-" + $("input[name='input_tel_3']").val();
		};

		var mobile =  $("select[name=input_mobile_1]").val() + "-" + $("input[name='input_mobile_2']").val() + "-" + $("input[name='input_mobile_3']").val();
		var email = $("input[name='input_email_1']").val() + "@" + $("input[name=input_email_2]").val();
		var input_password = $("input[name='input_pwd']").val();
		input_password = CryptoJS.SHA256(input_password).toString();
		var adminCondition = {
			supplier_ssn : supplier_ssn,
			reg_status : $("input[name=reg_status]:checked").val(),
			pwd :  input_password,
			pwd_check : $("input[name='input_pwd_check']").val(),
			name : $("input[name='input_charger_name']").val(),
			phone : phone,
			mobile : mobile,
			email : email,
			crudGbn : "update_edit"
		};

		var adminInfo =await procAdminListView(adminCondition); //검색조건 적용 함수
		
		if(adminInfo=="OK")
		{
			alert("운영자 수정이 완료되었습니다.");
			eventSearchAdminList(1);
			removeLayerPop();
		};
	};
};
// ------------------------------------ end of source ------------------------------------------------------------------------