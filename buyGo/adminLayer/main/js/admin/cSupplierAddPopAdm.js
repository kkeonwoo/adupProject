/****************************************************************************************************
module명: cSupplierAddPopAdm.js
creator: 윤희상
date: 2022.03.07
version 1.0
설명: ADMIN 공급사 등록 팝업 페이지
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

async function drawSupplierPopUp(pDealID){
   	var txt = "";
	txt += `<script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script> \n`;
   //파라미터 값에 따라 조회해서 데이터 매핑해야하는 경우도 있음
	if(pDealID == "" || pDealID == undefined || pDealID == "undefined"){
		txt += '<form id="frmPop" name="frmPop" action="/uAddDealInfo" method="post"> \n';
		txt += `<input type="hidden" name="checkSSN"> \n`; //Deal ID
		txt += '   <div class="popup pop800">    \n';
		txt += '  <div class="pop_tit">  \n';
		txt += '공급사등록 \n';
		txt += '  </div> \n';
		txt += ' <div class="pop_cont">  \n';
		txt += '   <div class="text_r mb05"> \n';
		txt += '  <span class="important">*</span> 필수입력    \n';
		txt += '   </div>    \n';
		txt += '   <!-- 기본정보 -->   \n';
		txt += '   <table class="table_row"> \n';
		txt += '  <colgroup><col width="15%"><col width="35%"><col width="16%"><col width="*"></colgroup>    \n';
		txt += '  <tbody><tr>    \n';
		txt += '   <th><span>사업자등록번호 <span class="important">*</span></span></th>    \n';
		txt += '   <td colspan="3">  \n';
		txt += '  <input type="text" name="biz_ssn" class="w210" maxlength="10" value="" numberonly="">  \n';
		txt += `  <button type="button" class="btn_ss01" onclick="checkssn();"><span>중복확인</span></button>    \n`;
		txt += '   </td> \n';
		txt += ' </tr>   \n';
		// txt += ' <tr>    \n';
		// txt += '   <th><span>비밀번호 <span class="important">*</span></span></th> \n';
		// txt += '   <td>  \n';
		// txt += '  <input type="password" name="biz_pwd" class="w210" maxlength="20" value="">    \n';
		// txt += '  <p class="font11">영문, 숫자 조합으로 6자 이상 입력해주세요.</p>  \n';
		// txt += '   </td> \n';
		// txt += '   <th><span>비밀번호 재확인 <span class="important">*</span></span></th>   \n';
		// txt += '   <td><input type="password" name="biz_pwd_check" class="w210" maxlength="20" value=""></td>    \n';
		// txt += ' </tr>   \n';
		txt += ' <tr>    \n';
		txt += '   <th><span>사업자명칭 <span class="important">*</span></span></th>    \n';
		txt += '   <td><input type="text" name="biz_name" class="w210" maxlength="100" value=""></td>    \n';
		txt += '   <th><span>별칭 <span class="important">*</span></span></th>    \n';
		txt += '   <td><input type="text" name="biz_nick" class="w210" maxlength="100" value=""></td>    \n';
		txt += ' </tr>   \n';
		txt += ' <tr>  \n';
		txt += '   <th><span>상호(DEAL) <span class="important">*</span></span></th>    \n';
		txt += '   <td><input type="text" name="transaction_type" class="w210" maxlength="100" value=""></td>    \n';
		txt += '   <th><span>대표자 <span class="important">*</span></span></th>  \n';
		txt += '   <td colspan="3"><input type="text" name="biz_ceo" class="w210" maxlength="100" value=""></td> \n';
		txt += ' </tr>   \n';
		txt += ' <tr>    \n';
		txt += '   <th><span>업태</span></th> \n';
		txt += '   <td><input type="text" name="biz_type" class="w210" maxlength="50" value=""></td> \n';
		txt += '   <th><span>종목</span></th> \n';
		txt += '   <td><input type="text" name="biz_cate" class="w210" maxlength="50" value=""></td> \n';
		txt += ' </tr>   \n';
		txt += ' <tr>    \n';
		txt += '   <th><span>사업자주소 <span class="important">*</span></span></th>   \n';
		txt += '   <td colspan="3">  \n';
		txt += '  <span class="block">   \n';
		txt += ' <input type="text" name="biz_zipcode" id="biz_zipcode" class="w55" maxlength="6" placeholder="우편번호">  \n';
		txt += ` <button type="button" class="btn_ss01" onclick="postPop('biz_zipcode', 'biz_addr1', 'biz_addr2');"><span>우편번호 찾기</span></button> \n`;
		txt += '  </span>    \n';
		txt += '  <span class="block mt05"><input type="text" name="biz_addr1" id="biz_addr1" class="w380" maxlength="300" placeholder="사업자 주소"></span>   \n';
		txt += '  <span class="block mt05"><input type="text" name="biz_addr2" id="biz_addr2" class="w380" maxlength="300" placeholder="사업자 상세주소"></span>    \n';
		txt += '   </td> \n';
		txt += ' </tr>   \n';
		txt += ' <tr>    \n';
		txt += '   <th><span>전화번호 <span class="important">*</span></span></th> \n';
		txt += '   <td>  \n';
		txt += '  <select name="biz_tel1" style="width:70px;">  \n';
		txt += ' <option value="02">02</option>  \n';
		txt += ' <option value="031">031</option>    \n';
		txt += ' <option value="032">032</option>    \n';
		txt += ' <option value="033">033</option>    \n';
		txt += ' <option value="041">041</option>    \n';
		txt += ' <option value="042">042</option>    \n';
		txt += ' <option value="043">043</option>    \n';
		txt += ' <option value="051">051</option>    \n';
		txt += ' <option value="052">052</option>    \n';
		txt += ' <option value="053">053</option>    \n';
		txt += ' <option value="054">054</option>    \n';
		txt += ' <option value="055">055</option>    \n';
		txt += ' <option value="061">061</option>    \n';
		txt += ' <option value="062">062</option>    \n';
		txt += ' <option value="063">063</option>    \n';
		txt += ' <option value="064">064</option>    \n';
		txt += ' <option value="0505">0505</option>  \n';
		txt += ' <option value="0502">0502</option>  \n';
		txt += ' <option value="070">070</option>    \n';
		txt += '  </select>  \n';
		txt += '  <input type="text" name="biz_tel2" class="w55" maxlength="4" value=""> -   \n';
		txt += '  <input type="text" name="biz_tel3" class="w55" maxlength="4" value=""> \n';
		txt += '   </td> \n';
		txt += '   <th><span>휴대폰 <span class="important">*</span></span></th>  \n';
		txt += '   <td>  \n';
		txt += '  <select name="biz_mobile1" style="width:70px;">  \n';
		txt += ' <option value="010">010</option>    \n';
		txt += ' <option value="011">011</option>    \n';
		txt += ' <option value="016">016</option>    \n';
		txt += ' <option value="017">017</option>    \n';
		txt += ' <option value="018">018</option>    \n';
		txt += ' <option value="019">019</option>    \n';
		txt += ' <option value="0130">0130</option>  \n';
		txt += ' <option value="0502">0502</option>  \n';
		txt += ' <option value="070">070</option>    \n';
		txt += '  </select>  \n';
		txt += '  <input type="text" name="biz_mobile2" class="w55" maxlength="4" value=""> -    \n';
		txt += '  <input type="text" name="biz_mobile3" class="w55" maxlength="4" value="">  \n';
		txt += '   </td> \n';
		txt += ' </tr>   \n';
		txt += ' <tr>    \n';
		txt += '   <th><span>팩스번호 <span class="important">*</span></span></th> \n';
		txt += '   <td colspan="3">  \n';
		txt += '  <select name="biz_fax1" style="width:70px;">  \n';
		txt += ' <option value="02">02</option>  \n';
		txt += ' <option value="031">031</option>    \n';
		txt += ' <option value="032">032</option>    \n';
		txt += ' <option value="033">033</option>    \n';
		txt += ' <option value="041">041</option>    \n';
		txt += ' <option value="042">042</option>    \n';
		txt += ' <option value="043">043</option>    \n';
		txt += ' <option value="051">051</option>    \n';
		txt += ' <option value="052">052</option>    \n';
		txt += ' <option value="053">053</option>    \n';
		txt += ' <option value="054">054</option>    \n';
		txt += ' <option value="055">055</option>    \n';
		txt += ' <option value="061">061</option>    \n';
		txt += ' <option value="062">062</option>    \n';
		txt += ' <option value="063">063</option>    \n';
		txt += ' <option value="064">064</option>    \n';
		txt += ' <option value="0505">0505</option>  \n';
		txt += ' <option value="0502">0502</option>  \n';
		txt += ' <option value="070">070</option>    \n';
		txt += '  </select>  \n';
		txt += '  <input type="text" name="biz_fax2" class="w55" maxlength="4" value=""> -   \n';
		txt += '  <input type="text" name="biz_fax3" class="w55" maxlength="4" value=""> \n';
		txt += '   </td> \n';
		txt += ' </tr>   \n';
		txt += ' <tr>    \n';
		txt += '   <th><span>이메일 <span class="important">*</span></span></th>  \n';
		txt += '<td colspan="3"> \n';
		txt += '   <input type="text" name="biz_email1" class="w100"> @  \n';
		txt += '   <input type="text" name="biz_email2" id="biz_email2" class="w100">    \n';
		txt += '   <select id="biz_email3" style="width:100px;" onchange="changeEmail1();">  \n';
		txt += '  <option value="">- 직접입력 -</option>   \n';
		txt += '  <option value="gmail.com">gmail.com</option>   \n';
		txt += '  <option value="naver.com">naver.com</option>   \n';
		txt += '  <option value="daum.net">daum.net</option> \n';
		txt += '  <option value="hotmail.com">hotmail.com</option>   \n';
		txt += '  <option value="nate.com">nate.com</option> \n';
		txt += '   </select> \n';
		txt += '</td>    \n';
		txt += '  </tr>  \n';
		txt += '  <tr>   \n';
		txt += '<th><span>계약기간 <span class="important">*</span></span></th>    \n';
		txt += '<td colspan="3"> \n';
		txt += '   <input type="text" name="cont_date_start" class="w100 datepicker1" maxlength="10" placeholder="" value="" id="dp1646705389232"> -  \n';
		txt += '   <input type="text" name="cont_date_end" class="w100 datepicker1" maxlength="10" placeholder="" value="" id="dp1646705389233">  \n';
		txt += '</td>    \n';
		txt += '  </tr>  \n';
		txt += '  <tr>   \n';
		txt += '<th><span>계약수수료 <span class="important">*</span></span></th>  \n';
		txt += '<td> \n';
		txt += '   <input type="text" name="cont_fee" class="w84 text-right padding-right" value="0" maxlength="2" numberonly=""> %  \n';
		txt += '</td>    \n';
		txt += '<th><span>행사수수료 <span class="important">*</span></span></th>  \n';
		txt += '<td> \n';
		txt += '   <input type="text" name="fate_fee" class="w84 text-right padding-right" value="0" maxlength="2" numberonly=""> %  \n';
		txt += '</td>    \n';
		txt += '  </tr>  \n';
		txt += '  <tr>   \n';
		txt += '<th><span>특가수수료 <span class="important">*</span></span></th>  \n';
		txt += '<td> \n';
		txt += '   <input type="text" name="cont_special_price_fee" class="w84 text-right padding-right" value="0" maxlength="2" numberonly=""> %  \n';
		txt += '</td>    \n';
		txt += '  </tr>  \n';
		txt += '   </tbody>  \n';
		txt += '</table> \n';
		txt += '<!-- //기본정보 -->    \n';
		txt += '<!-- 대표담당자 정보 -->    \n';
		txt += '<div class="pop_s_tit">  \n';
		txt += '   대표 담당자 정보 \n';
		txt += '</div>   \n';
		txt += '<table class="table_row">    \n';
		txt += '   <colgroup><col width="15%"><col width="35%"><col width="15%"><col width="35%"></colgroup> \n';
		txt += '   <tbody>   \n';
		txt += '  <tr>   \n';
		txt += '<th><span>담당자 <span class="important">*</span></span> </th>    \n';
		txt += '<td colspan="3"><input type="text" name="charge_name" class="w100" maxlength="100" value=""></td>    \n';
		txt += '  </tr>  \n';
		txt += '  <tr>   \n';
		txt += '<th><span>연락처</span></th>  \n';
		txt += '<td> \n';
		txt += '   <select name="charge_tel1" style="width:70px;">  \n';
		txt += '  <option value="02">02</option> \n';
		txt += '  <option value="031">031</option>   \n';
		txt += '  <option value="032">032</option>   \n';
		txt += '  <option value="033">033</option>   \n';
		txt += '  <option value="041">041</option>   \n';
		txt += '  <option value="042">042</option>   \n';
		txt += '  <option value="043">043</option>   \n';
		txt += '  <option value="051">051</option>   \n';
		txt += '  <option value="052">052</option>   \n';
		txt += '  <option value="053">053</option>   \n';
		txt += '  <option value="054">054</option>   \n';
		txt += '  <option value="055">055</option>   \n';
		txt += '  <option value="061">061</option>   \n';
		txt += '  <option value="062">062</option>   \n';
		txt += '  <option value="063">063</option>   \n';
		txt += '  <option value="064">064</option>   \n';
		txt += '  <option value="0505">0505</option> \n';
		txt += '  <option value="0502">0502</option> \n';
		txt += '  <option value="070">070</option>   \n';
		txt += '   </select> \n';
		txt += '   <input type="text" name="charge_tel2" class="w55" maxlength="4" value=""> -   \n';
		txt += '   <input type="text" name="charge_tel3" class="w55" maxlength="4" value=""> \n';
		txt += '</td>    \n';
		txt += '<th><span>핸드폰 <span class="important">*</span></span></th> \n';
		txt += '<td> \n';
		txt += '   <select name="charge_mobile1" style="width:70px;">  \n';
		txt += '  <option value="010">010</option>   \n';
		txt += '  <option value="011">011</option>   \n';
		txt += '  <option value="016">016</option>   \n';
		txt += '  <option value="017">017</option>   \n';
		txt += '  <option value="018">018</option>   \n';
		txt += '  <option value="019">019</option>   \n';
		txt += '  <option value="0130">0130</option> \n';
		txt += '  <option value="0502">0502</option> \n';
		txt += '  <option value="070">070</option>   \n';
		txt += '   </select> \n';
		txt += '   <input type="text" name="charge_mobile2" class="w55" maxlength="4" value=""> -    \n';
		txt += '   <input type="text" name="charge_mobile3" class="w55" maxlength="4" value="">  \n';
		txt += '</td>    \n';
		txt += '  </tr>  \n';
		txt += '  <tr>   \n';
		txt += '<th><span>이메일</span></th>  \n';
		txt += '<td colspan="3"> \n';
		txt += '   <input type="text" name="charge_email1" class="w100"> @   \n';
		txt += '   <input type="text" name="charge_email2" id="charge_email2" class="w100">  \n';
		txt += '   <select id="charge_email3" style="width:100px;" onchange="changeEmail2();">   \n';
		txt += '  <option value="">- 직접입력 -</option>   \n';
		txt += '  <option value="gmail.com">gmail.com</option>   \n';
		txt += '  <option value="naver.com">naver.com</option>   \n';
		txt += '  <option value="daum.net">daum.net</option> \n';
		txt += '  <option value="hotmail.com">hotmail.com</option>   \n';
		txt += '  <option value="nate.com">nate.com</option> \n';
		txt += '   </select> \n';
		txt += '</td>    \n';
		txt += '  </tr>  \n';
		txt += '   </tbody>  \n';
		txt += '</table> \n';
		txt += '<!-- //대표담당자 정보 -->  \n';
		txt += ' \n';
		txt += '<!-- 반품지정보 -->    \n';
		txt += '<div class="pop_s_tit">  \n';
		txt += '   반품지 정보 \n';
		txt += '  <span class="block float_r"><input type="checkbox" id="sameadd" onclick="copyBizAddr();"> <label for="sameadd" class="font11">사업자 주소와 동일</label></span>    \n';
		txt += '</div>   \n';
		txt += '<table class="table_row">    \n';
		txt += '   <colgroup><col width="15%"><col width="35%"><col width="15%"><col width="35%"></colgroup> \n';
		txt += '   <tbody>   \n';
		txt += '  <tr>   \n';
		txt += '<th><span>반품지 주소 <span class="important">*</span></span></th> \n';
		txt += '<td colspan="3"> \n';
		txt += '   <span class="block">  \n';
		txt += '  <input type="text" name="turn_zipcode" id="turn_zipcode" class="w55" maxlength="6" placeholder="우편번호">   \n';
		txt += `  <button type="button" class="btn_ss01" onclick="postPop('turn_zipcode', 'turn_addr1', 'turn_addr2');"><span>우편번호 찾기</span></button> \n`;
		txt += '   </span>   \n';
		txt += '   <span class="block mt05"><input type="text" name="turn_addr1" id="turn_addr1" class="w380" maxlength="300" placeholder="반품지 주소"></span>    \n';
		txt += '   <span class="block mt05"><input type="text" name="turn_addr2" id="turn_addr2" class="w380" maxlength="300" placeholder="반품지 상세주소"></span> \n';
		txt += '</td>    \n';
		txt += '  </tr>  \n';
		txt += '  <tr>   \n';
		txt += '<th><span>전화번호 <span class="important">*</span></span></th>    \n';
		txt += '<td> \n';
		txt += '   <select name="turn_tel1" style="width:70px;">  \n';
		txt += '  <option value="02">02</option> \n';
		txt += '  <option value="031">031</option>   \n';
		txt += '  <option value="032">032</option>   \n';
		txt += '  <option value="033">033</option>   \n';
		txt += '  <option value="041">041</option>   \n';
		txt += '  <option value="042">042</option>   \n';
		txt += '  <option value="043">043</option>   \n';
		txt += '  <option value="051">051</option>   \n';
		txt += '  <option value="052">052</option>   \n';
		txt += '  <option value="053">053</option>   \n';
		txt += '  <option value="054">054</option>   \n';
		txt += '  <option value="055">055</option>   \n';
		txt += '  <option value="061">061</option>   \n';
		txt += '  <option value="062">062</option>   \n';
		txt += '  <option value="063">063</option>   \n';
		txt += '  <option value="064">064</option>   \n';
		txt += '  <option value="0505">0505</option> \n';
		txt += '  <option value="0502">0502</option> \n';
		txt += '  <option value="070">070</option>   \n';
		txt += '   </select> \n';
		txt += '   <input type="text" name="turn_tel2" class="w55" maxlength="4" value=""> - \n';
		txt += '   <input type="text" name="turn_tel3" class="w55" maxlength="4" value="">   \n';
		txt += '</td>    \n';
		txt += '<th><span>휴대폰 <span class="important">*</span></span></th> \n';
		txt += '<td> \n';
		txt += '   <select name="turn_mobile1" style="width:70px;">  \n';
		txt += '  <option value="010">010</option>   \n';
		txt += '  <option value="011">011</option>   \n';
		txt += '  <option value="016">016</option>   \n';
		txt += '  <option value="017">017</option>   \n';
		txt += '  <option value="018">018</option>   \n';
		txt += '  <option value="019">019</option>   \n';
		txt += '  <option value="0130">0130</option> \n';
		txt += '  <option value="0502">0502</option> \n';
		txt += '  <option value="070">070</option>   \n';
		txt += '   </select> \n';
		txt += '   <input type="text" name="turn_mobile2" class="w55" maxlength="4" value=""> -  \n';
		txt += '   <input type="text" name="turn_mobile3" class="w55" maxlength="4" value="">    \n';
		txt += '</td>    \n';
		txt += '  </tr>  \n';
		txt += '   </tbody>  \n';
		txt += '</table> \n';
		txt += '<!-- //반품지정보 -->  \n';
		txt += ' \n';
		txt += '<!-- 주문정책 -->  \n';
		txt += '<div class="pop_s_tit">  \n';
		txt += '   주문정책    \n';
		txt += '</div>   \n';
		txt += '<table class="table_row">    \n';
		txt += '   <colgroup><col width="15%"><col width="*"></colgroup> \n';
		txt += '   <tbody>   \n';
		txt += '  <tr>   \n';
		txt += '<th><span>주문정책 <span class="important">*</span></span></th>    \n';
		txt += '<td colspan="3"> \n';
		txt += '   최소 <input type="text" name="cont_min_order" class="w100 text-right padding-right" maxlength="8" value="0" numberonly=""> 원 이상 주문 가능  \n';
		txt += '</td>    \n';
		txt += '  </tr>  \n';
		txt += '   </tbody>  \n';
		txt += '</table> \n';
		txt += '<div class="table_btns text_c">  \n';
		txt += '   <button type="button" class="btn01" onclick="askCancel();"><span>취소</span></button>  \n';
		txt += '   <button type="button" class="btn01 btn_b" onclick="askSubmit();"><span>등록</span></button>    \n';
		txt += '</div>   \n';
		txt += '  </div> \n';
		txt += ' \n';
		txt += '  <div class="pop_close">    \n';
		txt += '<!-- <a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> -->    \n';
		txt += '<a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"> \n';
		txt += '</a> \n';
		txt += '  </div> \n';
		txt += '   </div>    \n';
		txt += '</form>  \n';
   	}
   	else{
		var rtnValue = await setDealDetailInfo(pDealID);
    
		if(rtnValue == null){
			return false;
		};
		
		//값이 있을때는 넘어온 사업자번호로 조회해서 해당 내용을 매핑하여 보여줘야 한다.
		txt += `<form id="frmPop" name="frmPop" action="/uEditDealInfo" method="post"> \n`;
		txt += `<input type="hidden" name="idx" value="${rtnValue.ROW_SEQUENCE}"> \n`; //Deal ID
		txt += `<input type="hidden" name="ssn" value="${rtnValue.SUPPLIER_SSN}"> \n`; //ssn ID
		txt += `<div class="popup pop800"> \n`;
		txt += `	<div class="pop_tit"> \n`;
		txt += `		공급사정보 \n`;
		txt += `	</div> \n`;
		txt += `	<div class="pop_cont"> \n`;
		txt += `		<div class="text_r mb05"> \n`;
		txt += `			<span class="important">*</span> 필수입력 \n`;
		txt += `		</div> \n`;
		txt += `		<!-- 기본정보 --> \n`;
		txt += `		<table class="table_row"> \n`;
		txt += `			<colgroup><col width="15%"><col width="35%"><col width="15%"><col width="35%"></colgroup> \n`;
		txt += `			<tbody><tr> \n`;
		txt += `				<th><span>사업자등록번호</span></th> \n`;
		txt += `				<td>${rtnValue.SUPPLIER_SSN}</td> \n`; //사업자 등록번호
		txt += `				<th><span>사업자명칭</span></th> \n`;
		txt += `				<td>${rtnValue.SUPPLIER_NAME}</td> \n`; //사업자 명칭
		txt += `			</tr> \n`;
		txt += `			<tr> \n`;
		txt += `				<th><span>상태 <span class="important">*</span></span></th> \n`;
		txt += `				<td colspan="3"> \n`;
		txt += `					<select name="reg_status" style="width:130px;" value="${rtnValue.SUPPLIER_REG_STATUS}">						 \n`;
		txt += `						<option value="1">사용중</option> \n`;
		txt += `						<option value="2">사용중지</option> \n`;
		txt += `					</select> \n`;
		txt += `				</td> \n`;
		txt += `			</tr> \n`;
		txt += `			<tr> \n`;
		txt += `				<th><span>사업자명칭 <span class="important">*</span></span></th> \n`;
		txt += `				<td><input type="text" name="biz_name" class="w210" maxlength="100" value="${rtnValue.SUPPLIER_NAME}"></td> \n`;//상호
		txt += `				<th><span>별칭 <span class="important">*</span></span></th> \n`;
		txt += `				<td><input type="text" name="biz_nick" class="w210" maxlength="100" value="${rtnValue.SUPPLY_BUSINESS_NICK}"></td> \n`;//별칭
		txt += `			</tr> \n`;
		txt += `			<tr>				 \n`;
		txt += `				<th><span>상호(DEAL) <span class="important">*</span></span></th> \n`;
		txt += `				<td><input type="text" name="transaction_type" class="w210" maxlength="100" value="${rtnValue.NADLE_SUPPLIER_TRANSACTION_TYPE}"></td> \n`;//상호(DEAL)
		txt += `				<th><span>대표자 <span class="important">*</span></span></th> \n`;
		txt += `				<td><input type="text" name="biz_ceo" class="w210" maxlength="100" value="${rtnValue.SUPPLIER_CEO}"></td> \n`;
		txt += `			</tr> \n`;
		txt += `			<tr> \n`;
		txt += `				<th><span>업태</span></th> \n`;
		txt += `				<td><input type="text" name="biz_type" class="w210" maxlength="50" value="${rtnValue.NADLE_SUPPLY_TYPE}"></td> \n`;
		txt += `				<th><span>종목</span></th> \n`;
		txt += `				<td><input type="text" name="biz_cate" class="w210" maxlength="50" value="${rtnValue.NADLE_SUPPLY_GOODS_CATEGORY}"></td> \n`;
		txt += `			</tr> \n`;
		txt += `			<tr> \n`;
		txt += `				<th><span>사업자주소 <span class="important">*</span></span></th> \n`;
		txt += `				<td colspan="3"> \n`;
		txt += `					<span class="block"> \n`;
		txt += `						<input type="text" name="biz_zipcode" id="biz_zipcode" class="w55" maxlength="6" placeholder="우편번호" value="${rtnValue.SUPPLIER_ZIP_CODE}">  \n`;
		txt += `						<button type="button" class="btn_ss01" onclick="postPop('biz_zipcode', 'biz_addr1', 'biz_addr2');"><span>우편번호 찾기</span></button> \n`;
		txt += `					</span> \n`;
		txt += `					<span class="block mt05"><input type="text" name="biz_addr1" id="biz_addr1" class="w380" maxlength="300" placeholder="사업자 주소" value="${rtnValue.SUPPLIER_ADDRESS}"></span> \n`;
		txt += `					<span class="block mt05"><input type="text" name="biz_addr2" id="biz_addr2" class="w380" maxlength="300" placeholder="사업자 상세주소" value="${rtnValue.SUPPLIER_ADDRESS_DETAIL}"></span> \n`;
		txt += `				</td> \n`;
		txt += `			</tr> \n`;
		txt += `			<tr> \n`;
		txt += `				<th><span>전화번호 <span class="important">*</span></span></th> \n`;
		txt += `				<td> \n`;
		txt += `					<select name="biz_tel1" style="width:70px;" value="${rtnValue.SUPPLIER_CHARGER_PHONE.split("-")[0]}"> \n`;
		txt += `					    <option value="02">02</option> \n`;
		txt += `					    <option value="031">031</option> \n`;
		txt += `					    <option value="032">032</option> \n`;
		txt += `					    <option value="033">033</option> \n`;
		txt += `					    <option value="041">041</option> \n`;
		txt += `					    <option value="042">042</option> \n`;
		txt += `					    <option value="043">043</option> \n`;
		txt += `					    <option value="051">051</option> \n`;
		txt += `					    <option value="052">052</option> \n`;
		txt += `					    <option value="053">053</option> \n`;
		txt += `					    <option value="054">054</option> \n`;
		txt += `					    <option value="055">055</option> \n`;
		txt += `					    <option value="061">061</option> \n`;
		txt += `					    <option value="062">062</option> \n`;
		txt += `					    <option value="063">063</option> \n`;
		txt += `					    <option value="064">064</option> \n`;
		txt += `					    <option value="0505">0505</option> \n`;
		txt += `					    <option value="0502">0502</option> \n`;
		txt += `					    <option value="070">070</option> \n`;
		txt += `					</select> \n`;
		txt += `					<input type="text" name="biz_tel2" class="w55" maxlength="4" value="${rtnValue.SUPPLIER_CHARGER_PHONE.split("-")[1]}"> -  \n`;
		txt += `					<input type="text" name="biz_tel3" class="w55" maxlength="4" value="${rtnValue.SUPPLIER_CHARGER_PHONE.split("-")[2]}"> \n`;
		txt += `				</td> \n`;
		txt += `				<th><span>휴대폰 <span class="important">*</span></span></th> \n`;
		txt += `				<td> \n`;
		txt += `					<select name="biz_mobile1" style="width:70px;" value="${rtnValue.SUPPLIER_CHARGER_MOBILE.split("-")[0]}">						 \n`;
		txt += `						 \n`;
		txt += `<option value="010">010</option> \n`;
		txt += `<option value="011">011</option> \n`;
		txt += `<option value="016">016</option> \n`;
		txt += `<option value="017">017</option> \n`;
		txt += `<option value="018">018</option> \n`;
		txt += `<option value="019">019</option> \n`;
		txt += `<option value="0130">0130</option> \n`;
		txt += `<option value="0502">0502</option> \n`;
		txt += `<option value="070">070</option> \n`;
		txt += `					</select> \n`;
		txt += `					<input type="text" name="biz_mobile2" class="w55" maxlength="4" value="${rtnValue.SUPPLIER_CHARGER_MOBILE.split("-")[1]}"> -  \n`;
		txt += `					<input type="text" name="biz_mobile3" class="w55" maxlength="4" value="${rtnValue.SUPPLIER_CHARGER_MOBILE.split("-")[2]}"> \n`;
		txt += `				</td> \n`;
		txt += `			</tr> \n`;
		txt += `			<tr> \n`;
		txt += `				<th><span>팩스번호 <span class="important">*</span></span></th> \n`;
		txt += `				<td colspan="3"> \n`;
		txt += `					<select name="biz_fax1" style="width:70px;" value="${rtnValue.SUPPLIER_FAX_NO.split("-")[0]}">						 \n`;
		txt += `						 \n`;
		txt += `<option value="02">02</option> \n`;
		txt += `<option value="031">031</option> \n`;
		txt += `<option value="032">032</option> \n`;
		txt += `<option value="033">033</option> \n`;
		txt += `<option value="041">041</option> \n`;
		txt += `<option value="042">042</option> \n`;
		txt += `<option value="043">043</option> \n`;
		txt += `<option value="051">051</option> \n`;
		txt += `<option value="052">052</option> \n`;
		txt += `<option value="053">053</option> \n`;
		txt += `<option value="054">054</option> \n`;
		txt += `<option value="055">055</option> \n`;
		txt += `<option value="061">061</option> \n`;
		txt += `<option value="062">062</option> \n`;
		txt += `<option value="063">063</option> \n`;
		txt += `<option value="064">064</option> \n`;
		txt += `<option value="0505">0505</option> \n`;
		txt += `<option value="0502">0502</option> \n`;
		txt += `<option value="070">070</option> \n`;
		txt += `					</select> \n`;
		txt += `					<input type="text" name="biz_fax2" class="w55" maxlength="4" value="${rtnValue.SUPPLIER_FAX_NO.split("-")[1]}"> -  \n`;
		txt += `					<input type="text" name="biz_fax3" class="w55" maxlength="4" value="${rtnValue.SUPPLIER_FAX_NO.split("-")[2]}"> \n`;
		txt += `				</td> \n`;
		txt += `			</tr> \n`;
		txt += `			<tr> \n`;
		txt += `				<th><span>이메일 <span class="important">*</span></span></th> \n`;
		txt += `				<td colspan="3"> \n`;
		txt += `					<input type="text" name="biz_email1" class="w100" value="${rtnValue.SUPPLIER_CHARGER_EMAIL.split("@")[0]}"> @  \n`;
		txt += `					<input type="text" name="biz_email2" id="biz_email2" class="w100" value="${rtnValue.SUPPLIER_CHARGER_EMAIL.split("@")[1]}"> \n`;
		txt += `					<select id="biz_email3" style="width:100px;" onchange="changeEmail1();"> \n`;
		txt += `						<option value="">- 직접입력 -</option> \n`;
		txt += `						 \n`;
		txt += `<option value="gmail.com">gmail.com</option> \n`;
		txt += `<option value="naver.com">naver.com</option> \n`;
		txt += `<option value="daum.net">daum.net</option> \n`;
		txt += `<option value="hotmail.com">hotmail.com</option> \n`;
		txt += `<option value="nate.com">nate.com</option> \n`;
		txt += `					</select> \n`;
		txt += `				</td> \n`;
		txt += `			</tr> \n`;
		txt += `			<tr> \n`;
		txt += `				<th><span>계약기간 <span class="important">*</span></span></th> \n`;
		txt += `				<td colspan="3"> \n`;
		txt += `					<input type="text" name="cont_date_start" class="w100 datepicker1" maxlength="10" placeholder="" value="${rtnValue.CONTRACT_START_DATE}" id="dp1647905879017"> -  \n`;
		txt += `					<input type="text" name="cont_date_end" class="w100 datepicker1" maxlength="10" placeholder="" value="${rtnValue.CONTRACT_END_DATE}" id="dp1647905879018"> \n`;
		txt += `				</td> \n`;
		txt += `			</tr> \n`;
		txt += `			<tr> \n`;
		txt += `				<th><span>계약수수료 <span class="important">*</span></span></th> \n`;
		txt += `				<td> \n`;
		txt += `					<input type="text" name="cont_fee" class="w84 text-right padding-right" value="${rtnValue.CONT_FEE_RATE}" maxlength="2" numberonly=""> % \n`;
		txt += `				</td> \n`;
		txt += `				<th><span>행사수수료 <span class="important">*</span></span></th> \n`;
		txt += `				<td> \n`;
		txt += `					<input type="text" name="fate_fee" class="w84 text-right padding-right" value="${rtnValue.WEEK_SPECIAL_FATE_RATE}" maxlength="2" numberonly=""> % \n`;
		txt += `				</td> \n`;
		txt += `			</tr> \n`;
		txt += `			<tr> \n`
		txt += `				<th><span>특가수수료 <span class="important">*</span></span></th> \n`;
		txt += `				<td> \n`;
		txt += `					<input type="text" name="cont_special_fee" class="w84 text-right padding-right" value="${rtnValue.CONT_SPECIAL_PRICE_FEE_RATE}" maxlength="2" numberonly=""> % \n`;
		txt += `				</td> \n`;
		txt += `			</tr> \n`;
		txt += `			<tr> \n`;
		txt += `				<th><span>가입일</span></th> \n`;
		txt += `				<td colspan="3"> \n`;
		txt += `					${rtnValue.CREATION_DATETIME} \n`;
		txt += `				</td> \n`;
		txt += `			</tr> \n`;
		txt += `			<tr> \n`;
		txt += `				<th><span>승인자 정보</span></th> \n`;
		txt += `				<td colspan="3"> \n`;
		txt += `					admin (최고관리자) \n`;
		txt += `				</td> \n`;
		txt += `			</tr> \n`;
		txt += `			 \n`;
		txt += `		</tbody></table> \n`;
		txt += `		<!-- //기본정보 --> \n`;txt += ' \n';
		txt += `		<!-- 대표담당자 정보 --> \n`;
		txt += `		<div class="pop_s_tit"> \n`;
		txt += `			대표 담당자 정보 \n`;
		txt += `		</div> \n`;
		txt += `		<table class="table_row"> \n`;
		txt += `			<colgroup><col width="15%"><col width="35%"><col width="15%"><col width="35%"></colgroup> \n`;
		txt += `			<tbody><tr> \n`;
		txt += `				<th><span>담당자 <span class="important">*</span></span> </th> \n`;
		txt += `				<td colspan="3"><input type="text" name="charge_name" class="w100" maxlength="100" value="${rtnValue.HEAD_OFFICE_CHARGER}"></td> \n`;
		txt += `			</tr> \n`;
		txt += `			<tr> \n`;
		txt += `				<th><span>연락처</span></th> \n`;
		txt += `				<td> \n`;
		txt += `					<select name="charge_tel1" style="width:70px;" value="${rtnValue.HEAD_OFFICE_CHARGER_PHONE.split("-")[0]}">						 \n`;
		txt += `						 \n`;
		txt += `<option value="02">02</option> \n`;
		txt += `<option value="031">031</option> \n`;
		txt += `<option value="032">032</option> \n`;
		txt += `<option value="033">033</option> \n`;
		txt += `<option value="041">041</option> \n`;
		txt += `<option value="042">042</option> \n`;
		txt += `<option value="043">043</option> \n`;
		txt += `<option value="051">051</option> \n`;
		txt += `<option value="052">052</option> \n`;
		txt += `<option value="053">053</option> \n`;
		txt += `<option value="054">054</option> \n`;
		txt += `<option value="055">055</option> \n`;
		txt += `<option value="061">061</option> \n`;
		txt += `<option value="062">062</option> \n`;
		txt += `<option value="063">063</option> \n`;
		txt += `<option value="064">064</option> \n`;
		txt += `<option value="0505">0505</option> \n`;
		txt += `<option value="0502">0502</option> \n`;
		txt += `<option value="070">070</option> \n`;
		txt += `					</select> \n`;
		txt += `					<input type="text" name="charge_tel2" class="w55" maxlength="4" value="${rtnValue.HEAD_OFFICE_CHARGER_PHONE.split("-")[1]}"> -  \n`;
		txt += `					<input type="text" name="charge_tel3" class="w55" maxlength="4" value="${rtnValue.HEAD_OFFICE_CHARGER_PHONE.split("-")[2]}"> \n`;
		txt += `				</td> \n`;
		txt += `				<th><span>핸드폰 <span class="important">*</span></span></th> \n`;
		txt += `				<td> \n`;
		txt += `					<select name="charge_mobile1" style="width:70px;" value="${rtnValue.HEAD_OFFICE_CHARGER_MOBILE.split("-")[0]}">						 \n`;
		txt += `						 \n`;
		txt += `<option value="010">010</option> \n`;
		txt += `<option value="011">011</option> \n`;
		txt += `<option value="016">016</option> \n`;
		txt += `<option value="017">017</option> \n`;
		txt += `<option value="018">018</option> \n`;
		txt += `<option value="019">019</option> \n`;
		txt += `<option value="0130">0130</option> \n`;
		txt += `<option value="0502">0502</option> \n`;
		txt += `<option value="070">070</option> \n`;
		txt += `					</select> \n`;
		txt += `					<input type="text" name="charge_mobile2" class="w55" maxlength="4" value="${rtnValue.HEAD_OFFICE_CHARGER_MOBILE.split("-")[1]}"> -  \n`;
		txt += `					<input type="text" name="charge_mobile3" class="w55" maxlength="4" value="${rtnValue.HEAD_OFFICE_CHARGER_MOBILE.split("-")[2]}"> \n`;
		txt += `				</td> \n`;
		txt += `			</tr> \n`;
		txt += `			<tr> \n`;
		txt += `				<th><span>이메일</span></th> \n`;
		txt += `				<td colspan="3"> \n`;
		txt += `					<input type="text" name="charge_email1" class="w100" value="${rtnValue.HEAD_OFFICE_CHARGER_EMAIL.split("@")[0]}"> @  \n`;
		txt += `					<input type="text" name="charge_email2" id="charge_email2" class="w100" value="${rtnValue.HEAD_OFFICE_CHARGER_EMAIL.split("@")[1]}"> \n`;
		txt += `					<select id="charge_email3" style="width:100px;" onchange="changeEmail2();"> \n`;
		txt += `						<option value="">- 직접입력 -</option> \n`;
		txt += `						 \n`;
		txt += `<option value="gmail.com">gmail.com</option> \n`;
		txt += `<option value="naver.com">naver.com</option> \n`;
		txt += `<option value="daum.net">daum.net</option> \n`;
		txt += `<option value="hotmail.com">hotmail.com</option> \n`;
		txt += `<option value="nate.com">nate.com</option> \n`;
		txt += `					</select> \n`;
		txt += `				</td> \n`;
		txt += `			</tr> \n`;
		txt += `		</tbody></table> \n`;
		txt += `		<!-- //대표담당자 정보 --> \n`;
		txt += `		<!-- 반품지정보 --> \n`;
		txt += `		<div class="pop_s_tit"> \n`;
		txt += `			반품지 정보 \n`;
		txt += `			<span class="block float_r"><input type="checkbox" id="sameadd" onclick="copyBizAddr();"> <label for="sameadd" class="font11">사업자 주소와 동일</label></span> \n`;
		txt += `		</div> \n`;
		txt += `		<table class="table_row"> \n`;
		txt += `			<colgroup><col width="15%"><col width="35%"><col width="15%"><col width="35%"></colgroup> \n`;
		txt += `			<tbody><tr> \n`;
		txt += `				<th><span>반품지 주소 <span class="important">*</span></span></th> \n`;
		txt += `				<td colspan="3"> \n`;
		txt += `					<span class="block"> \n`;
		txt += `						<input type="text" name="turn_zipcode" id="turn_zipcode" class="w55" maxlength="6" placeholder="우편번호" value="${rtnValue.REFUND_ZIP_CODE}">  \n`;
		txt += `						<button type="button" class="btn_ss01" onclick="postPop('turn_zipcode', 'turn_addr1', 'turn_addr2');"><span>우편번호 찾기</span></button> \n`;
		txt += `					</span> \n`;
		txt += `					<span class="block mt05"><input type="text" name="turn_addr1" id="turn_addr1" class="w380" maxlength="300" placeholder="반품지 주소" value="${rtnValue.REFUND_ADDRESS}"></span> \n`;
		txt += `					<span class="block mt05"><input type="text" name="turn_addr2" id="turn_addr2" class="w380" maxlength="300" placeholder="반품지 상세주소" value="${rtnValue.REFUND_ADDRESS_DETAIL}"></span> \n`;
		txt += `				</td> \n`;
		txt += `			</tr> \n`;
		txt += `			<tr> \n`;
		txt += `				<th><span>전화번호 <span class="important">*</span></span></th> \n`;
		txt += `				<td> \n`;
		txt += `					<select name="turn_tel1" style="width:70px;" value="${rtnValue.REFUND_CHARGER_PHONE.split("-")[0]}">						 \n`;
		txt += `					 \n`;
		txt += `<option value="02">02</option> \n`;
		txt += `<option value="031">031</option> \n`;
		txt += `<option value="032">032</option> \n`;
		txt += `<option value="033">033</option> \n`;
		txt += `<option value="041">041</option> \n`;
		txt += `<option value="042">042</option> \n`;
		txt += `<option value="043">043</option> \n`;
		txt += `<option value="051">051</option> \n`;
		txt += `<option value="052">052</option> \n`;
		txt += `<option value="053">053</option> \n`;
		txt += `<option value="054">054</option> \n`;
		txt += `<option value="055">055</option> \n`;
		txt += `<option value="061">061</option> \n`;
		txt += `<option value="062">062</option> \n`;
		txt += `<option value="063">063</option> \n`;
		txt += `<option value="064">064</option> \n`;
		txt += `<option value="0505">0505</option> \n`;
		txt += `<option value="0502">0502</option> \n`;
		txt += `<option value="070">070</option> \n`;
		txt += `					</select> \n`;
		txt += `					<input type="text" name="turn_tel2" class="w55" maxlength="4" value="${rtnValue.REFUND_CHARGER_PHONE.split("-")[1]}"> -  \n`;
		txt += `					<input type="text" name="turn_tel3" class="w55" maxlength="4" value="${rtnValue.REFUND_CHARGER_PHONE.split("-")[2]}"> \n`;
		txt += `				</td> \n`;
		txt += `				<th><span>휴대폰 <span class="important">*</span></span></th> \n`;
		txt += `				<td> \n`;
		txt += `					<select name="turn_mobile1" style="width:70px;" value="${rtnValue.REFUND_CHARGER_MOBILE.split("-")[0]}">						 \n`;
		txt += `						 \n`;
		txt += `<option value="010">010</option> \n`;
		txt += `<option value="011">011</option> \n`;
		txt += `<option value="016">016</option> \n`;
		txt += `<option value="017">017</option> \n`;
		txt += `<option value="018">018</option> \n`;
		txt += `<option value="019">019</option> \n`;
		txt += `<option value="0130">0130</option> \n`;
		txt += `<option value="0502">0502</option> \n`;
		txt += `<option value="070">070</option> \n`;
		txt += `					</select> \n`;
		txt += `					<input type="text" name="turn_mobile2" class="w55" maxlength="4" value="${rtnValue.REFUND_CHARGER_MOBILE.split("-")[1]}"> -  \n`;
		txt += `					<input type="text" name="turn_mobile3" class="w55" maxlength="4" value="${rtnValue.REFUND_CHARGER_MOBILE.split("-")[2]}"> \n`;
		txt += `				</td> \n`;
		txt += `			</tr> \n`;
		txt += `		</tbody></table> \n`;
		txt += `		<!-- //반품지정보 --> \n`;
		txt += `		 \n`;
		txt += `		<!-- 주문정책 --> \n`;
		txt += `		<div class="pop_s_tit"> \n`;
		txt += `			주문정책 \n`;
		txt += `		</div> \n`;
		txt += `		<table class="table_row"> \n`;
		txt += `			<colgroup><col width="15%"><col width="*"></colgroup> \n`;
		txt += `			<tbody><tr> \n`;
		txt += `				<th><span>주문정책 <span class="important">*</span></span></th> \n`;
		txt += `				<td colspan="3"> \n`;
		txt += `					최소 <input type="text" name="cont_min_order" class="w100 text-right padding-right" maxlength="8" value="${rtnValue.CONT_ORDER_MIN_PRICE}" numberonly=""> 원 이상 주문 가능 \n`;
		txt += `				</td> \n`;
		txt += `			</tr> \n`;
		txt += `		</tbody></table> \n`;
		txt += `		<!-- //주문정책 --> \n`;
		txt += `		 \n`;
		txt += `	 \n`;
		txt += `		 \n`;
		txt += `		<div class="table_btns text_c"> \n`;
		txt += `			<button type="button" class="btn01" onclick="askCancel();"><span>취소</span></button> \n`;
		txt += `			<button type="button" class="btn01 btn_b" onclick="askSubmit();"><span>수정</span></button>  \n`;
		txt += `		</div> \n`;
		txt += `	</div> \n`;
		txt += `	 \n`;
		txt += `	<div class="pop_close"> \n`;
		txt += `		<a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n`;
		txt += `	</div> \n`;
		txt += `</div> \n`;
		txt += `</form> \n`;
		
   	};
	
   	$(".layerPop").html(txt);
	
	if(pDealID != "" && pDealID != undefined && pDealID != "undefined"){
		$("select[name=biz_tel1]").val(rtnValue.SUPPLIER_CHARGER_PHONE.split("-")[0]).prop("selectd", true);
		$("select[name=biz_mobile1]").val(rtnValue.SUPPLIER_CHARGER_MOBILE.split("-")[0]).prop("selectd", true);
		$("select[name=biz_fax1]").val(rtnValue.SUPPLIER_FAX_NO.split("-")[0]).prop("selectd", true);
		$("select[name=charge_tel1]").val(rtnValue.HEAD_OFFICE_CHARGER_PHONE.split("-")[0]).prop("selectd", true);
		$("select[name=charge_mobile1]").val(rtnValue.HEAD_OFFICE_CHARGER_MOBILE.split("-")[0]).prop("selectd", true);
		$("select[name=turn_tel1]").val(rtnValue.REFUND_CHARGER_PHONE.split("-")[0]).prop("selectd", true);
		$("select[name=turn_mobile1]").val(rtnValue.REFUND_CHARGER_MOBILE.split("-")[0]).prop("selectd", true);
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
	if($('input[name="cont_date_end"]').val() == "") $('input[name="cont_date_end"]').datepicker("setDate", "2090-12-31");

    $(".layerPopArea").css("display" ,"block");
};
                    
async function setDealDetailInfo(pDealID){
	var rtnreturnvalue;
	$.ajax({
		url: "/uGetSupplierDealDetail?"  + $.param({"dealID" : pDealID}),
		type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success: function(response){
			if(response.errorcode == "PFERR_CONF_0000"){
				rtnreturnvalue = response.returnvalue[0];
			}
			else if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            }
			else{
				alert("데이터 조회 오류로 재조회가 필요합니다.");
			};
		},
		error: function(qXHR, textStatus, errorThrown) {
			alert("[err messager]:" + textStatus);
            rtnreturnvalue = null;
		},
		complete:function(data,textStatus) {
			console.log("[complete] : " + textStatus);
		}
	});
	return rtnreturnvalue;
};

function askSubmit(){
	//필수입력창 확인 로직
	if($("input[name=checkSSN]").val() == ""){
		alert("중복확인!");
		return;
	};
	//상호
	if($("input[name=biz_name]").val() == ""){
		alert("상호를 입력하여 주세요.");
		return;
	};
	//별칭
	if($("input[name=biz_nick]").val() == ""){
		alert("별칭을 입력하여 주세요.");
		return;
	};
	//대표자
	if($("input[name=biz_ceo]").val() == ""){
		alert("대표자를 입력하여 주세요.");
		return;
	};
	//사업자주소
	if($("input[name=biz_zipcode]").val() == "" || $("input[name=biz_addr1]").val() == "" || $("input[name=biz_addr2]").val() == ""){
		alert("주소를 입력하여 주세요.");
		return;
	};
	//전화번호
	if($("input[name=biz_tel1]").val() == "" || $("input[name=biz_tel2]").val().length < 3 || $("input[name=biz_tel3]").val().length < 4){
		alert("전화번호를 입력하여 주세요.");
		return;
	};
	//휴대폰
	if($("input[name=biz_mobile1]").val() == "" || $("input[name=biz_mobile2]").val().length < 3 || $("input[name=biz_mobile3]").val().length < 4){
		alert("휴대폰번호를 입력하여 주세요.");
		return;
	};
	//팩스번호
	if($("input[name=biz_fax1]").val() == "" || $("input[name=biz_fax2]").val().length < 3 || $("input[name=biz_fax3]").val().length < 4){
		alert("팩스번호를 입력하여 주세요.");
		return;
	};
	//이메일
	if($("input[name=biz_email1]").val() == "" || $("input[name=biz_email2]").val() == ""){
		alert("이메일을 입력하여 주세요.");
		return;
	};
	//계약기간        
	if($("input[name=cont_date_start]").val() == "" || $("input[name=cont_date_end]").val() == ""){
		alert("계약기간확인");
		return;
	};

	if($("input[name=cont_date_start]").val() > $("input[name=cont_date_end]").val()){
		alert("계약기간확인");
		return;
	};
	//계약수수료
	if($("input[name=cont_fee]").val() < 0){
		alert("계약수수료를 확인하여 주세요.");
		return;
	};
	//행사수수료
	if($("input[name=fate_fee]").val() < 0){
		alert("행사수수료를 확인하여 주세요.");
		return;
	};
	//특가수수료
	if($("input[name=cont_special_price_fee]").val() < 0){
		alert("특가수수료를 확인하여 주세요.");
		return;
	};
	//대표담당자
	if($("input[name=charge_name]").val() == ""){
		alert("대표담당자를 입력하여 주세요.");
		return;
	};
	//대표담당자 핸드폰 번호 
	if($("input[name=charge_mobile1]").val() == "" || $("input[name=charge_mobile2]").val().length < 3 || $("input[name=charge_mobile3]").val().length < 4){
		alert("대표담당자 휴대폰번호를 입력하여 주세요.");
		return;
	};
	//반품지주소
	if($("input[name=turn_zipcode]").val() == "" || $("input[name=turn_addr1]").val() == "" || $("input[name=turn_addr2]").val() == ""){
		alert("주소를 입력하여 주세요.");
		return;
	};
	//반품지 전화번호
	if($("input[name=turn_tel1]").val() == "" || $("input[name=turn_tel2]").val().length < 3 || $("input[name=turn_tel3]").val().length < 4){
		alert("반품지 전화번호를 입력하여 주세요.");
		return;
	};
	//반품지 핸드폰번호
	if($("input[name=turn_mobile1]").val() == "" || $("input[name=turn_mobile2]").val().length < 3 || $("input[name=turn_mobile3]").val().length < 4){
		alert("반품지 핸드폰번호를 입력하여 주세요.");
		return;
	};
	//주문정책
	if($("input[name=cont_min_order]").val() < 0){
		alert("주문정책을 확인하여 주세요.");
		return;
	};
	$("form").submit();
};

function checkssn(){

	var input_ssn = $("input[name=biz_ssn]").val();

	if(input_ssn.length != 10){
		alert("올바른 사업자번호를 입력하여 주세요.");
		return;
	};

	$.ajax({
		url: "/uGetCheckSupplierSSN?"  + $.param({"ssn" : input_ssn}),
		type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success: function(response){
			if(response.errorcode == "PFERR_CONF_0000"){
				$("input[name=checkSSN]").val(response.returnvalue[0].CNT);
				if(response.returnvalue[0].CNT != 0){
					alert("기존에 존재하는 사업자 번호입니다. 등록시 해당 사업자에 Deal을 추가합니다.");

					console.log(response.returnvalue[0]);
					
					$("input[name=biz_name]").val(response.returnvalue[0].SUPPLIER_NAME);
					$("input[name=biz_ceo]").val(response.returnvalue[0].SUPPLIER_CEO);
					$("input[name=charge_name]").val(response.returnvalue[0].HEAD_OFFICE_CHARGER);
					$("select[name=charge_tel1]").val(response.returnvalue[0].HEAD_OFFICE_CHARGER_PHONE.split("-")[0]).prop("selected", true);
					$("input[name=charge_tel2]").val(response.returnvalue[0].HEAD_OFFICE_CHARGER_PHONE.split("-")[1]);
					$("input[name=charge_tel3]").val(response.returnvalue[0].HEAD_OFFICE_CHARGER_PHONE.split("-")[2]);
					$("select[name=charge_mobile1]").val(response.returnvalue[0].HEAD_OFFICE_CHARGER_MOBILE.split("-")[0]).prop("selected", true);
					$("input[name=charge_mobile2]").val(response.returnvalue[0].HEAD_OFFICE_CHARGER_MOBILE.split("-")[1]);
					$("input[name=charge_mobile3]").val(response.returnvalue[0].HEAD_OFFICE_CHARGER_MOBILE.split("-")[2]);
					$("input[name=charge_email1]").val(response.returnvalue[0].HEAD_OFFICE_CHARGER_EMAIL.split("@")[0]);
					$("input[name=charge_email2]").val(response.returnvalue[0].HEAD_OFFICE_CHARGER_EMAIL.split("@")[1]);
				}
				else{
					alert("신규등록입니다!");
				};
			}
			else if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            }
			else{
				alert("데이터 조회 오류로 재조회가 필요합니다.");
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

function changeEmail1(){
	$("#biz_email2").val($("#biz_email3").val());
};

function changeEmail2(){
	$("#charge_email2").val($("#charge_email3").val());
};

function copyBizAddr(){
	if($("#sameadd").prop("checked")){
		$("#turn_zipcode").val($("#biz_zipcode").val());
		$("#turn_addr1").val($("#biz_addr1").val());
		$("#turn_addr2").val($("#biz_addr2").val());
		$("select[name=turn_tel1]").val($("select[name=biz_tel1").val()).prop("selected", true);
		$("input[name=turn_tel2]").val($("input[name=biz_tel2]").val());
		$("input[name=turn_tel3]").val($("input[name=biz_tel3]").val());
		$("select[name=turn_mobile1]").val($("select[name=biz_mobile1").val()).prop("selected", true);
		$("input[name=turn_mobile2]").val($("input[name=biz_mobile2]").val());
		$("input[name=turn_mobile3]").val($("input[name=biz_mobile3]").val());
	}
};