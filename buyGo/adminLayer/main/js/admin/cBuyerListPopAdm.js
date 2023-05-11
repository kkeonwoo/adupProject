/****************************************************************************************************
module명: cBuyerListPointPopAdm.js
creator: 정길웅
date: 2022.05.01
version 1.0
설명: ADMIN 구매회원 포인트 팝업 페이지
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
//포인트 클릭 시 등장하는 팝업
async function drawBuyerPointPopUp(){
   var txt = "";
   var point_type_name_option =await getPointTypeToList();
   var buyerTableValue = checkingBuyerName();
   if(buyerTableValue.biz_ssn==""||buyerTableValue.biz_ssn==undefined){
      alert("선택된 데이터가 없습니다. 대표자명을 선택해주시기 바랍니다.");
   }
   else if(buyerTableValue.biz_name==""||buyerTableValue==undefined){
      alert("선택된 데이터가 없습니다. 대표자명을 선택해주시기 바랍니다.");
   }
   else{
      txt += '<form id="frmPop" name="frmPop" action="" method="post"> \n';
      txt += '    <div class="popup pop800"> \n';
      txt += '        <div class="pop_tit">포인트등록</div> \n';
      txt += '        <div class="pop_cont"> \n';
      txt += '            <div class="text_r mb05"> \n';
      txt += '                <span class="important">*</span> 필수입력 \n';
      txt += '            </div> \n';
      txt += '            <table class="table_row"> \n';
      txt += '                <colgroup> \n';
      txt += '                    <col width="15%"><col width="*"> \n';
      txt += '                </colgroup> \n';
      txt += '                <tbody> \n';
      txt += '                    <tr> \n';
      txt += '                        <th><span>구매회원 <span class="important">*</span></span></th> \n';
      txt += `                        <td name="biz_name_value">`+buyerTableValue.biz_name+`</td> \n`;
      txt += `                        <td name="biz_ssn" id="biz_ssn_value" style="display:none">`+buyerTableValue.biz_ssn+`</td> \n`;
      txt += `                        <td id="hidden_reg_status" style="display:none">`+buyerTableValue.reg_status+`</td> \n`;
      txt += '                    </tr> \n';
      txt += '                    <tr> \n';
      txt += '                        <th><span>포인트구분 <span class="important">*</span></span></th> \n';
      txt += '                        <td> \n';
      txt += '                            <select name="point_type_idx"> \n';
      //포인트 구분의 SELECT 항목 넣기
      for(var ix=0;ix<point_type_name_option.length;ix++){
         txt += `                                <option value="`+point_type_name_option[ix].POINT_IDX+`">`+point_type_name_option[ix].POINT_NAME+`</option> \n`;
      };
      txt += '                            </select> \n';
      txt += '                        </td> \n';
      txt += '                    </tr> \n';
      txt += '                    <tr> \n';
      txt += '                        <th><span>포인트 <span class="important">*</span></span></th> \n';
      txt += '                        <td><input type="text" name="point_value" class="w210" maxlength="100" value="0"></td> \n';
      txt += '                    </tr> \n';
      txt += '                    <tr> \n';
      txt += '                        <th><span>관계코드<span class="important">*</span></span></th> \n';
      txt += '                        <td><input type="text" name="reference_code" class="w210" maxlength="100" value=""></td> \n';
      txt += '                    </tr> \n';
      txt += '                    <tr> \n';
      txt += '                        <th><span>메모<span class="important"></span></span></th> \n';
      txt += '                        <td><input type="text" name="point_memo" class="w210" maxlength="100" value=""></td> \n';
      txt += '                    </tr> \n';
      txt += '                    <tr> \n';
      txt += '                        <th><span>유효기간 <span class="important">*</span></span></th> \n';
      txt += '                        <td> \n';
      txt += '                            <input type="text" id="expiration_date" name="expiration_date" class="w84 datepicker1" value=""> \n';
      txt += '                            <span class="search_scope"> \n';
      txt += `                                <button type="button" class="btn_ss01" onclick="setExpYear('expiration_date', 0);"><span>오늘</span></button> \n`
      txt += `                                <button type="button" class="btn_ss01" onclick="setExpYear('expiration_date', 1);"><span>1년</span></button> \n`;
      txt += `                                <button type="button" class="btn_ss01" onclick="setExpYear('expiration_date', 2);"><span>2년</span></button> \n`;
      txt += `                                <button type="button" class="btn_ss01" onclick="setExpYear('expiration_date', 3);"><span>3년</span></button> \n`;
      txt += `                                <button type="button" class="btn_ss01" onclick="setExpYear('expiration_date', 4);"><span>4년</span></button> \n`;
      txt += `                                <button type="button" class="btn_ss01" onclick="setExpYear('expiration_date', 5);"><span>5년</span></button> \n`;
      txt += `                            </span> \n`;
      txt += '                        </td> \n';
      txt += '                    </tr> \n';
      txt += '                </tbody> \n';
      txt += '            </table> \n';
      txt += '            <div class="table_btns text_c"> \n';
      txt += '                <button type="button" class="btn01 btn_b" onclick="editBuyerPoint();"><span>등록</span></button> \n';
      txt += '            </div> \n';
      txt += '        </div> \n';
      txt += '        <div class="pop_close"> \n';
      txt += '            <a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n';
      txt += '        </div> \n';
      txt += '    </div> \n';
      txt += '</form> \n';
      $(".layerPop").html(txt);

      //2022.6.7 안상현 화면에 팝업이 그려진 후 date picker를 설정해야 한다. - start
      $("#expiration_date").datepicker({
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
         constrainInput: true    
      });    
      $('input[name="expiration_date"]').datepicker();
      $('input[name="expiration_date"]').datepicker("setDate", "today");
      //2022.6.7 안상현 화면에 팝업이 그려진 후 date picker를 설정해야 한다. - end

      $(".layerPopArea").css("display" ,"block");
   };
};

//등록버튼을 눌러서 그려지는 팝업 시 그려지는 함수
function drawBuyerRegisterPop(){
   var txt = "";
   txt += '    <input type="hidden" name="temp_zipcode" id="temp_zipcode"> \n';
   txt += '    <input type="hidden" name="temp_addr1" id="temp_addr1"> \n';
   txt += '    <input type="hidden" name="temp_addr2" id="temp_addr2"> \n';
   txt += '    <div class="popup pop800"> \n';
   txt += '        <div class="pop_tit">구매회원등록</div> \n';
   txt += '        <div class="pop_cont"> \n';
   txt += '            <div class="text_r mb05"> \n';
   txt += '                <span class="important">*</span> 필수입력 \n';
   txt += '            </div> \n';
   txt += '            <table class="table_row"> \n';
   txt += '                <colgroup> \n';
   txt += '                    <col width="15%"><col width="35%"><col width="16%"><col width="*"> \n';
   txt += '                </colgroup> \n';
   txt += '                <tbody> \n';
   txt += '                    <tr> \n';
   txt += '                        <th><span>사업자등록번호 <span class="important">*</span></span></th> \n';
   txt += '                        <td id="td_ssn"> \n';

   //20220714 add - start
   //txt  += '<div style="display:flex; height: 22px; line-height: 22px;">'
   //txt  += '    <div id="biz_ssn_checked" style="border : 1px; width: 210px; height: 10px;"> \n';
   //txt  += '    </div> \n';
   txt  += '    <input type="hidden" id="biz_ssn_checked" name="biz_ssn_checked" value=""></input>\n';
   //txt  += '</div> \n';
   //20220714 add - end

   txt += '                            <input type="text" id="chk_biz_ssn" name="chk_biz_ssn" class="w120" maxlength="10" value="" numberonly=""> \n';
   txt += `                            <button type="button" id="duplicationCheck" class="btn_ss01" onclick="chkDupSSN();"><span>중복확인</span></button> \n`;
   txt += '                        </td> \n';
   txt += '                        <th><span>개업연월일 <span class="important">*</span></span></th> \n';
   txt += '                        <td id="td_ssn_date"> \n';
   txt += '                            <input type="text" id="biz_ssn_date" name="biz_ssn_date" class="w120" maxlength="8" value="" numberonly=""> \n';
   txt += '                        </td> \n';
   txt += '                    </tr> \n';
   txt += '                    <tr> \n';
   txt += '                        <th><span>상태 <span class="important">*</span></span></th> \n';
   txt += '                        <td> \n';
   txt += '                            <select name="pop_reg_status" style="width:130px;">    \n';
   txt += '                                <option value="1">승인</option> \n';
   txt += '                                <option value="0">미승인</option> \n';
   txt += '                                <option value="2">사용중지</option> \n';
   txt += '                            </select> \n';
   txt += '                        </td> \n';
   txt += '                        <th><span>유입 <span class="important">*</span></span></th> \n';
   txt += '                        <td> \n';
   txt += '                            <select name="pop_reg_type" style="width:130px;"> \n';
   txt += '                                <option value="W">웹</option> \n';
   txt += '                                <option value="P">포스</option> \n';
   txt += '                                <option value="M">모바일</option> \n';
   txt += '                            </select> \n';
   txt += '                        </td> \n';
   txt += '                    </tr> \n';
   txt += '                    <tr> \n';
   txt += '                        <th><span>비밀번호 <span class="important">*</span></span></th> \n';
   txt += '                        <td> \n';
   txt += '                            <input type="password" name="biz_pwd" class="w210" maxlength="20" value=""> \n';
   txt += '                            <p class="font11">영문, 숫자 조합으로 8자 이상 입력해주세요.</p> \n';
   txt += '                        </td> \n';
   txt += '                        <th><span>비밀번호 재확인 <span class="important">*</span></span></th> \n';
   txt += '                        <td><input type="password" name="biz_pwd_check" class="w210" maxlength="20" value=""></td> \n';
   txt += '                    </tr> \n';
   txt += '                    <tr> \n';
   txt += '                        <th><span>상호 <span class="important">*</span></span></th> \n';
   txt += '                        <td><input type="text" name="biz_name_input" class="w210" maxlength="100" value=""></td> \n';
   txt += '                        <th><span>대표자 <span class="important">*</span></span></th> \n';
   txt += '                        <td><input type="text" name="register_biz_ceo" class="w210" maxlength="100" value=""></td> \n';
   txt += '                    </tr> \n';
   txt += '                    <tr> \n';
   txt += '                        <th><span>업태</span></th> \n';
   txt += '                        <td><input type="text" name="biz_type" class="w210" maxlength="50" value=""></td> \n';
   txt += '                        <th><span>종목</span></th> \n';
   txt += '                  <td><input type="text" name="biz_cate" class="w210" maxlength="50" value=""></td> \n';
   txt += '                    </tr> \n';
   txt += '                    <tr> \n';
   txt += '                        <th><span>사업자주소 <span class="important">*</span></span></th> \n';
   txt += '                        <td colspan="3"> \n';
   txt += '                            <span class="block"> \n';
   txt += '                                <input type="text" name="biz_zipcode" id="biz_zipcode" class="w55" maxlength="6" placeholder="우편번호">  \n';
   txt += `                                <button type="button" class="btn_ss01" onclick="postPop('biz_zipcode', 'biz_addr1', 'biz_addr2');"><span>우편번호 찾기</span></button> \n`;
   txt += '                            </span> \n';
   txt += '                            <span class="block mt05"><input type="text" name="biz_addr1" id="biz_addr1" class="w380" maxlength="300" placeholder="사업자 주소"></span> \n';
   txt += '                            <span class="block mt05"><input type="text" name="biz_addr2" id="biz_addr2" class="w380" maxlength="300" placeholder="사업자 상세주소"></span> \n';
   txt += '                        </td> \n';
   txt += '                    </tr> \n';
   txt += '                    <tr> \n';
   txt += '                        <th><span>전화번호 <span class="important">*</span></span></th> \n';
   txt += '                        <td> \n';
   txt += '                            <select name="biz_tel1" style="width:70px;"> \n';
   txt += '                                <option value="02">02</option> \n';
   txt += '                                <option value="031">031</option> \n';
   txt += '                                <option value="032">032</option> \n';
   txt += '                                <option value="033">033</option> \n';
   txt += '                                <option value="041">041</option> \n';
   txt += '                                <option value="042">042</option> \n';
   txt += '                                <option value="043">043</option> \n';
   txt += '                                <option value="051">051</option> \n';
   txt += '                                <option value="052">052</option> \n';
   txt += '                                <option value="053">053</option> \n';
   txt += '                                <option value="054">054</option> \n';
   txt += '                                <option value="055">055</option> \n';
   txt += '                                <option value="061">061</option> \n';
   txt += '                                <option value="062">062</option> \n';
   txt += '                                <option value="063">063</option> \n';
   txt += '                                <option value="064">064</option> \n';
   txt += '                                <option value="0505">0505</option> \n';
   txt += '                                <option value="0502">0502</option> \n';
   txt += '                                <option value="070">070</option> \n';
   txt += '                            </select> \n';
   txt += '                            <input type="text" name="biz_tel2" class="w55" maxlength="4" value=""> -  \n';
   txt += '                            <input type="text" name="biz_tel3" class="w55" maxlength="4" value=""> \n';
   txt += '                        </td> \n';
   txt += '                        <th><span>휴대폰 <span class="important">*</span></span></th> \n';
   txt += '                        <td> \n';
   txt += '                            <select name="biz_mobile_1" style="width:70px;"> \n';
   txt += '                                <option value="010">010</option> \n';
   txt += '                                <option value="011">011</option> \n';
   txt += '                                <option value="016">016</option> \n';
   txt += '                                <option value="017">017</option> \n';
   txt += '                                <option value="018">018</option> \n';
   txt += '                                <option value="019">019</option> \n';
   txt += '                                <option value="0130">0130</option> \n';
   txt += '                                <option value="0502">0502</option> \n';
   txt += '                                <option value="070">070</option> \n';
   txt += '                            </select> \n';
   txt += '                            <input type="text" name="biz_mobile_2" class="w55" maxlength="4" value=""> -  \n';
   txt += '                            <input type="text" name="biz_mobile_3" class="w55" maxlength="4" value=""> \n';
   txt += '                        </td> \n';
   txt += '                    </tr> \n';
   txt += '                    <tr> \n';
   txt += '                        <th><span>이메일 <span class="important">*</span></span></th> \n';
   txt += '                        <td colspan="3"> \n';
   txt += '                            <input type="text" name="biz_email1" class="w100"> @  \n';
   txt += '                            <input type="text" name="biz_email2" id="biz_email2" class="w100"> \n';
   txt += '                            <select id="biz_email3" style="width:100px;" onchange="onChangeEmail();"> \n';
   txt += '                                <option value="">- 직접입력 -</option> \n';
   txt += '                                <option value="gmail.com">gmail.com</option> \n';
   txt += '                                <option value="naver.com">naver.com</option> \n';
   txt += '                                <option value="hanmail.net">hanmail.net</option> \n';
   txt += '                                <option value="kakao.com">kakao.com</option> \n';
   txt += '                                <option value="nate.com">nate.com</option>   \n';
   txt += '                            </select> \n';
   txt += '                        </td> \n';
   txt += '                    </tr> \n';
   txt += '                    <tr> \n';
   txt += '                        <th><span>배송지 주소 <span class="important">*</span></span></th> \n';
   txt += '                        <td colspan="3"> \n';
   txt += '                            <span class="block"> \n';
   txt += '                                <input type="text" name="deli_zipcode" id="deli_zipcode" class="w55" maxlength="6" placeholder="우편번호">  \n';
   txt += `                                <button type="button" class="btn_ss01" onclick="postPop('deli_zipcode', 'deli_addr1', 'deli_addr2');"><span>우편번호 찾기</span></button> \n`;
   txt += '                                &nbsp;&nbsp;&nbsp;<input type="checkbox" id="copyCheck" onClick="addressCopy();" name="copyCheck">사업자주소와 동일 \n';
   txt += '                            </span> \n';
   txt += '                            <span class="block mt05"><input type="text" name="deli_addr1" id="deli_addr1" class="w380" maxlength="300" placeholder="배송지 주소"></span> \n';
   txt += '                            <span class="block mt05"><input type="text" name="deli_addr2" id="deli_addr2" class="w380" maxlength="300" placeholder="배송지 상세주소"></span> \n';
   txt += '                        </td> \n';
   txt += '                    </tr> \n';
   txt += '                </tbody> \n';
   txt += '            </table> \n';
   txt += '            <div class="table_btns text_c"> \n';
   txt += '                <button type="button" class="btn01" onclick="btnSubmitCancel();"><span>취소</span></button> \n';
   txt += '                <button type="button" class="btn01 btn_b" onclick="registerAccount();"><span>등록</span></button>  \n';
   txt += '            </div> \n';
   txt += '        </div> \n';
   txt += '        <div class="pop_close"> \n';
   txt += '            <a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n';
   txt += '        </div> \n';
   txt += '    </div> \n';

   $(".layerPop").html(txt);
   $(".layerPopArea").css("display" ,"block");
};

async function editBuyerInfo(pBuyer_SSN){
   var buyer_edit = {
      biz_ssn : pBuyer_SSN,
      crudGbn : "view_buyerInfo"
   };
   var returnSetArray = await getBuyerInfo(buyer_edit);
   if(returnSetArray==undefined||returnSetArray==""){
      alert("DB오류! 운영자에게 문의하세요");
   }
   else{
      var phoneNumberArray = changePhoneNumber(returnSetArray[0]);
      var emailArray = splitEmail(returnSetArray[0]);
      var bkCount =0;
      var main_bank_GBN = "positive";  //nadle_mainYN에서 첫 Y에만 값을 주기 위해 구분자 사용
      var main_account_GBN = "positive"; //nadle_mainYN에서 첫 Y에만 값을 주기 위해 구분자 사용
      var txt ="";
      txt += ' \n'; 
      txt += ' <div class="popup pop800"> \n';
      txt += ' <div class="pop_tit">구매회원정보</div> \n';
      txt += ' <div class="pop_cont"> \n';
      txt += ' <div class="text_r mb05"> \n';
      txt += ' <span class="important">*</span> 필수입력 \n';
      txt += ' </div> \n';
      txt += ' <table class="table_row"> \n';
      txt += ' <colgroup><col width="15%"><col width="35%"><col width="15%"><col width="*"></colgroup> \n';
      txt += ' <tbody> \n';
      txt += '             <tr> \n';
      txt += '                <th><span>사업자등록번호</span></th> \n';
      txt += '                <td id="editing_ssn">'+returnSetArray[0].BUYER_SSN+'</td> \n';
      txt += '                <th><span>개업연월일</span></th> \n';
      txt += '                <td id="editing_ssn_date">'+returnSetArray[0].BUYER_SSN_DATE+'</td> \n';
      txt += '             </tr> \n';
      txt += '             <tr> \n';
      txt += '                <th><span>상태 <span class="important">*</span></span></th> \n';
      txt += '                <td> \n';
      txt += '                       <div id="origin_reg_status" style="display : none">'+returnSetArray[0].NADLE_REG_STATUS+'</div> \n';
      txt += '                   <select name="reg_status" id="edit_reg_status" style="width:130px;" value="'+returnSetArray[0].NADLE_REG_STATUS+'">                   \n';
      txt += '                       <option value="0" val="0">승인대기</option> \n';
      txt += '                       <option value="1" val="1">승인</option> \n';
      txt += '                       <option value="2" val="2">사용중지</option> \n';
      txt += '                   </select> \n';
      txt += '                </td> \n';
      txt += '                <th><span>유입 <span class="important">*</span></span></th> \n';
      txt += '                <td> \n';
      txt += '                   <select name="edit_reg_type"  id="edit_reg_type" style="width:130px;" value="'+returnSetArray[0].NADLE_REG_TYPE+'">                   \n';
      txt += '                      <option value="W">웹</option> \n';
      txt += '                      <option value="P">포스</option> \n';
      txt += '                      <option value="M">모바일</option> \n';
      txt += '                   </select> \n';
      txt += '                </td> \n';
      txt += '             </tr> \n';
      txt += '             <tr> \n';
      txt += '                <th><span>비밀번호</span></th> \n';
      txt += '                <td> \n';
      txt += '                   <input type="password" name="biz_pwd" class="w210" maxlength="20" value=""> \n';
      txt += '                   <p class="font11">영문, 숫자 조합으로 6자 이상 입력해주세요.</p> \n';
      txt += '                </td> \n';
      txt += '                <th><span>비밀번호 재확인</span></th> \n';
      txt += '                <td><input type="password" name="biz_pwd_check" class="w210" maxlength="20" value=""></td> \n';
      txt += '             </tr> \n';
      txt += '             <tr> \n';
      txt += '                <th><span>상호 <span class="important">*</span></span></th> \n';
      txt += '                <td><input type="text" id="edit_biz_name" name="biz_name" class="w210" maxlength="100" value="'+returnSetArray[0].BUYER_NAME+'"></td> \n';
      txt += '                <th><span>대표자 <span class="important">*</span></span></th> \n';
      txt += '                <td><input type="text" id="edit_biz_ceo" name="biz_ceo" class="w210" maxlength="100" value="'+returnSetArray[0].BUYER_CEO+'"></td> \n';
      txt += '             </tr> \n';
      txt += '             <tr> \n';
      txt += '                <th><span>업태</span></th> \n';
      if(returnSetArray[0].NADLE_BIZ_TYPE==''){
         txt += '                <td><input type="text" name="biz_type" class="w210" maxlength="50" value=""></td> \n';
      }
      else{
         txt += '                <td><input type="text" name="biz_type" class="w210" maxlength="50" value="'+returnSetArray[0].NADLE_BIZ_TYPE+'"></td> \n';
      }
      txt += '                <th><span>종목</span></th> \n';
      if(returnSetArray[0].NADLE_BIZ_TYPE_DETAIL==''){
         txt += '                <td><input type="text" name="biz_cate" class="w210" maxlength="50" value=""></td> \n';
      }
      else{
         txt += '                <td><input type="text" name="biz_cate" class="w210" maxlength="50" value="'+returnSetArray[0].NADLE_BIZ_TYPE_DETAIL+'"></td> \n';
      }
      txt += '             </tr> \n';
      txt += '             <tr> \n';
      txt += '                <th><span>사업자주소 <span class="important">*</span></span></th> \n';
      txt += '                <td colspan="3"> \n';
      txt += '                   <span class="block"> \n';
      if(returnSetArray[0].HEAD_OFFICE_ZIP_CODE==''||returnSetArray[0].HEAD_OFFICE_ZIP_CODE=='undefined'){
         txt += '                      <input type="text" name="biz_zipcode" id="biz_zipcode" class="w55" maxlength="6" placeholder="">  \n';       
      }
      else{
         txt += '                      <input type="text" name="biz_zipcode" id="biz_zipcode" class="w55" maxlength="6" value="'+returnSetArray[0].HEAD_OFFICE_ZIP_CODE+'">  \n';   
      };
      txt += `                      <button type="button" class="btn_ss01" onclick="postPop('biz_zipcode', 'biz_addr1', 'biz_addr2');"><span>우편번호 찾기</span></button> \n`;
      txt += '                   </span> \n';
      if(returnSetArray[0].HEAD_OFFICE_ADDRESS==''||returnSetArray[0].HEAD_OFFICE_ADDRESS=='undefined'){
         txt += '                   <span class="block mt05"><input type="text" name="biz_addr1" id="biz_addr1" class="w380" maxlength="300" placeholder="사업자 주소" value=""></span> \n';
      }
      else{
         txt += '                   <span class="block mt05"><input type="text" name="biz_addr1" id="biz_addr1" class="w380" maxlength="300" placeholder="사업자 주소" value="'+returnSetArray[0].HEAD_OFFICE_ADDRESS+'"></span> \n';
      };
      if(returnSetArray[0].HEAD_OFFICE_ADDRESS_DETAIL==''||returnSetArray[0].HEAD_OFFICE_ADDRESS_DETAIL=='undefined'){
         txt += '                   <span class="block mt05"><input type="text" name="biz_addr2" id="biz_addr2" class="w380" maxlength="300" placeholder="사업자 상세주소" value=""></span> \n';
      }
      else{
         txt += '                   <span class="block mt05"><input type="text" name="biz_addr2" id="biz_addr2" class="w380" maxlength="300" placeholder="사업자 상세주소" value="'+returnSetArray[0].HEAD_OFFICE_ADDRESS_DETAIL+'"></span> \n';
      };
      txt += '                </td> \n';
      txt += '             </tr> \n';
      txt += '             <tr> \n';
      txt += '                <th><span>전화번호 <span class="important">*</span></span></th> \n';
      txt += '                <td> \n';
      txt += `                   <select name="biz_tel1" style="width:70px;" value="`+phoneNumberArray[0]+`">                   \n`;
      txt += '                      <option value="02">02</option> \n';
      txt += '                      <option value="031">031</option> \n';
      txt += '                      <option value="032">032</option> \n';
      txt += '                      <option value="033">033</option> \n';
      txt += '                      <option value="041">041</option> \n';
      txt += '                      <option value="042">042</option> \n';
      txt += '                      <option value="043">043</option> \n';
      txt += '                      <option value="051">051</option> \n';
      txt += '                      <option value="052">052</option> \n';
      txt += '                      <option value="053">053</option> \n';
      txt += '                      <option value="054">054</option> \n';
      txt += '                      <option value="055">055</option> \n';
      txt += '                      <option value="061">061</option> \n';
      txt += '                      <option value="062">062</option> \n';
      txt += '                      <option value="063">063</option> \n';
      txt += '                      <option value="064">064</option> \n';
      txt += '                      <option value="0505">0505</option> \n';
      txt += '                      <option value="0502">0502</option> \n';
      txt += '                      <option value="070">070</option> \n';
      txt += '                   </select> \n';
      txt += '             <input type="text" name="biz_tel2" class="w55" maxlength="4" value="'+phoneNumberArray[1]+'"> -  \n';
      txt += '             <input type="text" name="biz_tel3" class="w55" maxlength="4" value="'+phoneNumberArray[2]+'"> \n';
      txt += '          </td> \n';
      txt += '          <th><span>휴대폰 <span class="important">*</span></span></th> \n';
      txt += '          <td> \n';
      txt += '             <select name="biz_mobile1" style="width:70px;" value="'+phoneNumberArray[3]+'">                   \n';
      txt += '                <option value="010">010</option> \n';
      txt += '                <option value="011">011</option> \n';
      txt += '                <option value="016">016</option> \n';
      txt += '                <option value="017">017</option> \n';
      txt += '                <option value="018">018</option> \n';
      txt += '                <option value="019">019</option> \n';
      txt += '                <option value="0130">0130</option> \n';
      txt += '                <option value="0502">0502</option> \n';
      txt += '                <option value="070">070</option> \n';
      txt += '             </select> \n';
      txt += '             <input type="text" name="biz_mobile2" class="w55" maxlength="4" value="'+phoneNumberArray[4]+'"> -  \n';
      txt += '             <input type="text" name="biz_mobile3" class="w55" maxlength="4" value="'+phoneNumberArray[5]+'"> \n';
      txt += '          </td> \n';
      txt += '       </tr> \n';
      txt += '       <tr> \n';
      txt += '          <th><span>이메일 <span class="important">*</span></span></th> \n';
      txt += '          <td colspan="3"> \n';
      txt += '             <input type="text" name="biz_email1" class="w100" value="'+emailArray[0]+'"> @  \n';
      txt += '             <input type="text" name="biz_email2" id="biz_email2" class="w100"  value="'+emailArray[1]+'"> \n';
      txt += '             <select id="biz_email3" style="width:100px;" onchange="onChangeEmail();" value="naver.com"> \n';
      txt += '                <option value="">- 직접입력 -</option> \n';
      txt += '                <option value="gmail.com">gmail.com</option> \n';
      txt += '                <option value="naver.com">naver.com</option> \n';
      txt += '                <option value="hanmail.net">hanmail.net</option> \n';
      txt += '                <option value="kakao.com">kakao.com</option> \n';
      txt += '                <option value="nate.com">nate.com</option> \n';
      txt += '             </select> \n';
      txt += '          </td> \n';
      txt += '       </tr> \n';
      txt += '       <tr> \n';
      txt += '          <th><span>배송지 주소 <span class="important">*</span></span></th> \n';
      txt += '          <td colspan="3"> \n';
      txt += '             <span class="block"> \n';
      txt += '                <input type="text" name="deli_zipcode" id="deli_zipcode" class="w55" maxlength="6" placeholder="우편번호" value="">  \n';
      txt += `                <button type="button" class="btn_ss01" onclick="postPop('deli_zipcode', 'deli_addr1', 'deli_addr2');"><span>우편번호 찾기</span></button> \n`;
      txt += '                &nbsp;&nbsp;&nbsp;<input type="checkbox" id="copyCheck" onClick="addressCopy();" name="copyCheck">사업자주소와 동일 \n';
      txt += '             </span> \n';
      txt += '             <span class="block mt05"><input type="text" name="deli_addr1" id="deli_addr1" class="w380" maxlength="300" placeholder="배송지 주소" value="'+returnSetArray[0].DELI_ADDRESS+'"> </span> \n';
      txt += '             <span class="block mt05"><input type="text" name="deli_addr2" id="deli_addr2" class="w380" maxlength="300" placeholder="배송지 상세주소" value=""></span> \n';
      txt += '          </td> \n';
      txt += '       </tr> \n';
      txt += '       <tr> \n';
      txt += '          <th><span>회원가입일</span></th> \n';
      txt += '          <td colspan="3"> \n';
      txt += '             '+returnSetArray[0].NADLE_REG_DATE+' \n';
      txt += '          </td> \n';
      txt += '       </tr> \n';
      txt += '       <tr> \n';
      txt += '          <th><span>최근로그인</span></th> \n';
      txt += '          <td colspan="3"> \n';
      txt += '            '+returnSetArray[0].LAST_CONN_DATE+' ('+returnSetArray[0].CONN_COUNT+'회)                  \n';
      txt += '          </td> \n';
      txt += '       </tr> \n';
      txt += '       <tr> \n';
      txt += '          <th><span>승인자 정보</span></th> \n';
      txt += '          <td colspan="3"> \n';
      if(returnSetArray[0].NADLE_APPROVE_ID!='undefined'&&returnSetArray[0].NADLE_APPROVE_ID!=null){
         txt += '            '+returnSetArray[0].NADLE_APPROVE_ID+' \n';
      }
      else{
         txt += '            DB정보없음 \n';
      };
      txt += '          </td> \n';
      txt += '       </tr> \n';
      txt += '       <tr> \n';
      txt += '          <th><span>메세지 발송여부</span></th> \n';
      txt += '          <td colspan="3"> \n';
      txt += `              <select name="biz_mms_yn" style="width:70px;" value="`+returnSetArray[0].BUYER_INFO_MMS_YN+`">                   \n`;
      txt += '                  <option value="Y">발송</option> \n';
      txt += '                  <option value="N">미발송</option> \n';
      txt += '             </select> \n';
      txt += '          </td> \n';
      txt += '       </tr> \n';
      txt += '    </tbody> \n';
      txt += '       </table> \n';
      if(returnSetArray[0].BANK_NAME!=''&&returnSetArray[0].BANK_NAME!='undefined'){
         txt += '       <div class="pop_s_tit">입금계좌정보</div> \n';
         txt += '       <table class="table_row"> \n';
         txt += '          <colgroup><col width="15%"><col></colgroup> \n';
         txt += '          <tbody> \n';
         txt += '       <tr> \n';
         txt += '          <th><span>대표계좌선택 <span class="important">*</span></span></th> \n';
         txt += '          <td> \n';
         txt += `             <input type="hidden" name="payment_bank" id="bankName_0" value="`+returnSetArray[0].BANK_NAME+`"> \n`;
         txt += `             <input type="hidden" name="payment_account" id="account_0" value="`+returnSetArray[0].BANK_ACCOUNT+`"> \n`;
         txt += `             <div id="main_account" style="display : none"></div>  \n`;
         for(var ix=0;ix<returnSetArray.length;ix++){
            bkCount = bkCount+1;

            txt += `             <input type="hidden" name="payment_bank" id="bankName_`+ix+`" value="`+returnSetArray[ix].BANK_NAME+`"> \n`;
            txt += `             <input type="hidden" name="payment_account" id="account_`+ix+`" value="`+returnSetArray[ix].BANK_ACCOUNT+`"> \n`;
            
            if(returnSetArray[ix].NADLE_MAIN_YN=="Y"&&main_bank_GBN=="positive"){
               txt += `             <input type="radio"  onClick="accountRadioBox(event); getMainAccount(event);" id="bank_code`+ix+`" name="bank_code" value="`+ix+`" account="`+returnSetArray[ix].BANK_ACCOUNT+`" bankname="`+returnSetArray[ix].BANK_NAME+`" checked><label for="bank_code`+ix+`">&nbsp;`+returnSetArray[ix].BANK_NAME+`</label> \n`;
               main_bank_GBN = "negative";
            }else{
               txt += `                <input type="radio"  onClick="accountRadioBox(event); getMainAccount(event);" id="bank_code`+ix+`" name="bank_code" value="`+ix+`" account="`+returnSetArray[ix].BANK_ACCOUNT+`" bankname="`+returnSetArray[ix].BANK_NAME+`"><label for="bank_code`+ix+`">&nbsp;`+returnSetArray[ix].BANK_NAME+`</label> \n`;
            };
         }
         txt += '                <div id="bank_count" style="display : none">'+bkCount+'</div>'
         txt += '          </td> \n';
         txt += '       </tr> \n';
         txt += '       <tr> \n';
         txt += '          <th><span>점포고정계좌 <span class="important">*</span></span></th> \n';
         txt += '          <td id="fixed_account"> \n';
         for(var ix=0;ix<returnSetArray.length;ix++){
            if(returnSetArray[ix].NADLE_MAIN_YN=="Y"&&main_account_GBN=="positive"){
               txt +=  '             <span class="bankInfo" style="font-weight:bold;background-color:#F6F6F6;">'+returnSetArray[ix].BANK_NAME+' : '+returnSetArray[ix].BANK_ACCOUNT+'</span> \n';
               main_account_GBN="negative"
            };

         };
         txt += '          </td> \n';
         txt += '       </tr> \n';
         txt += '    </tbody> \n';
         txt += ' </table> \n';
      };
      txt += ' <div class="pop_s_tit">환불계좌정보</div> \n';
      txt += ' <table class="table_row"> \n';
      txt += '    <colgroup> \n';
      txt += '       <col width="15%"> \n';
      txt += '       <col> \n';
      txt += '    </colgroup> \n';
      txt += '    <tbody> \n';
      txt += '       <tr> \n';
      txt += '          <th><span>은행선택</span></th> \n';
      txt += '          <td> \n';
      txt += '             <select name="refund_bank" style="width:130px;"> \n';
      txt += '                <option value="">- 은행선택 -</option> \n';
      txt += '                <option value="11">농협</option> \n';
      txt += '                <option value="04">국민은행</option> \n';
      txt += '                <option value="88">신한은행</option> \n';
      txt += '                <option value="20">우리은행</option> \n';
      txt += '                <option value="05">외환은행</option> \n';
      txt += '                <option value="39">경남은행</option> \n';
      txt += '                <option value="03">기업은행</option> \n';
      txt += '                <option value="32">부산은행</option> \n';
      txt += '                <option value="07">수협</option> \n';
      txt += '                <option value="71">우체국</option> \n';
      txt += '                <option value="23">SC은행</option> \n';
      txt += '                <option value="81">하나은행</option> \n';
      txt += '                <option value="34">광주은행</option> \n';
      txt += '                <option value="12">단위농협</option> \n';
      txt += '                <option value="31">대구은행</option> \n';
      txt += '                <option value="45">새마을금고</option> \n';
      txt += '                <option value="48">신용협동조합중앙회</option> \n';
      txt += '                <option value="27">한국씨티은행 (구 한미)</option> \n';
      txt += '                <option value="37">전북은행</option> \n';
      txt += '                <option value="16">축협중앙회</option> \n';
      txt += '                <option value="89">케이뱅크</option> \n';
      txt += '                <option value="90">카카오뱅크</option> \n';
      txt += '                <option value="91">토스뱅크</option> \n';
      txt += '             </select> \n';
      txt += '          </td> \n';
      txt += '       </tr> \n';
      txt += '       <tr> \n';
      txt += '          <th><span>계좌번호</span></th> \n';
      txt += '          <td> \n';
      txt += '            <input type="text" name="refund_account" class="w200" value="'+returnSetArray[0].REFUND_BANK_ACCOUNT+'" \n';
      txt += '          </td> \n';
      txt += '       </tr> \n';
      txt += '       <tr> \n';
      txt += '          <th><span>예금주명</span></th> \n';
      txt += '          <td> \n';
      txt += '             <input type="text" name="refund_holder" class="w120" value="'+returnSetArray[0].REFUND_HOLDER+'"> \n';
      txt += '          </td> \n';
      txt += '       </tr> \n';
      txt += '    </tbody> \n';
      txt += ' </table> \n';
      txt += ' <div class="table_btns text_c"> \n';
      txt += '       <button type="button" class="btn01" onclick="btnSubmitCancel();"><span>취소</span></button> \n';
      txt += '       <button type="button" class="btn01 btn_b" onclick="editAccount();"><span>수정</span></button> \n';
      txt += ' </div> \n';
      txt += ' </div> \n';
      txt += ' <div class="pop_close"> \n';
      txt += ' <a href="javascript:removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n';
      txt += ' </div> \n';
      txt += '    </div> \n';
   
      $(".layerPop").html(txt);
      $(".layerPopArea").css("display" ,"block");

      //팝업의 selectbox 초기값 정해주기
      $("select[name=reg_status]").val(returnSetArray[0].NADLE_REG_STATUS).prop("selectd", true);
      $("select[name=edit_reg_type]").val(returnSetArray[0].NADLE_REG_TYPE).prop("selectd", true);

      $("select[name=biz_tel1]").val(phoneNumberArray[0]).prop("selectd", true);
      $("select[name=biz_mobile1]").val(phoneNumberArray[3]).prop("selectd", true);

      $("select[name=refund_bank]").val(returnSetArray[0].REFUND_BANK_CODE).prop("selectd", true);
      $("select[name=biz_mms_yn]").val(returnSetArray[0].BUYER_INFO_MMS_YN).prop("selectd", true);
   };
};


//********************************포인트버튼 관련 함수********************************//

//포인트버튼 팝업에서 등록버튼 클릭 시 작동하는 함수
async function editBuyerPoint(){
   var biz_name; //상호명
   var biz_ssn; //사업자등록번호
   var point_type_idx; //포인트 구분
   var point_value; //포인트 값
   var reference_code; //관계코드
   var point_memo; //메모
   var expiration_date; //유효기간
   var reg_status; //승인여부

   biz_name = document.querySelector("[name='biz_name_value']").innerText;
   biz_ssn = document.getElementById("biz_ssn_value").innerText;
   point_type_idx = document.querySelector("[name='point_type_idx']").value*1;
   point_value = document.querySelector("[name='point_value']").value*1;
   reference_code = document.querySelector("[name='reference_code']").value;
   point_memo = document.querySelector("[name='point_memo']").value;
   expiration_date = document.querySelector("[name='expiration_date']").value;
   reg_status = document.getElementById("hidden_reg_status").innerText;

   if(point_value==""||point_value==undefined){
      alert("포인트값을 입력해주시기 바랍니다.");
   }
   else if(reference_code==""||reference_code==undefined){
      alert("관계코드 값을 입력해주시기 바랍니다.");
   }
   else if(expiration_date==""||expiration_date==undefined){
      alert("유효기간에 공란이 있습니다.");
   }
   else if(reg_status=="미승인"||reg_status=="사용중지"){
      alert("미승인 상태 혹은 사용 중지 상태인 구매회원에게 포인트를 지급할 수 없습니다.")
   }
   else{
      var editDataJson = {
         "biz_name" : biz_name,
         "buyer_ssn" : biz_ssn,
         "point_type_idx" : point_type_idx,
         "point_value" : point_value,
         "reference_code" : reference_code,
         "point_memo" : point_memo,
         "expiration_date" : expiration_date,
         "app_id" : 'buyerListAdm.html',
      };
      
      await $.ajax({
         url: "/uEditPoint?"  + $.param({"editDataJson" : editDataJson}),
         type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
         contentType: "application/x-www-form-urlencoded; charset=utf-8",
         success: function(response){
            if(response.errorcode=='PFERR_CONF_0000'){
               alert(response.errormessage);
               removeLayerPop();
               //1페이지로 이동
               getBuyerData(1);
            }
            else{
               alert(response.errormessage);
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
   };
};

//포인트 팝업에서 포인트종류 리스트 가지고오는 함수
async function getPointTypeToList(){
   var point_name_list;
   var getSearchCondition = {
      crudGbn : "view_pointName"
   }
   point_name_list = await procPointTypeListView(getSearchCondition);
   return point_name_list;
};

//포인트 팝업에서 포인트 리스트를 보여주는 ajax 함수
async function procPointTypeListView(pGetSearchCondition){
   //포인트명 데이터
   var ret;
   await $.ajax({
      url: "/uGetPointTypeListAdm?" + $.param({"authPage" : "cBuyerListPopAdm.js", "searchCondition":pGetSearchCondition}),
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
               ret = null;
         }
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

//포인트 등록 팝업 창의 유효기간 설정하는 버튼 함수
function setExpYear(pDateID, pYearCount){ 

   var date = new Date();

   date.setDate(date.getDate());
   var year = date.getFullYear()+pYearCount;
   var month = ("0" + (1 + date.getMonth())).slice(-2);
   var day = ("0" + date.getDate()).slice(-2);
   
   var resDate = year + "-" + month + "-" + day;

   $("#"+pDateID).val(resDate);
};



//********************************포인트버튼 관련 함수 끝********************************//


//********************************등록버튼 관련 함수********************************//

//등록버튼을 누를 시 사용되는 ajax 함수
async function registerBuyerAjax(pBuyerInfo){
   var crudGBN;
   (pBuyerInfo.reg_status=="1")  ? crudGBN = "inserting_valid" : crudGBN = "inserting_invalid"
   //입력값이 점주이기 때문에 구분자를 B2B_BUYER으로 둔다.
   await $.ajax({
      url: "/uSetBuyerListAdm?" + $.param({"authPage" : "cBuyerListPopAdm.js", "pBuyerInfo":pBuyerInfo, "crudGBN":crudGBN}),
      type: "POST", async: false, dataType: "JSON", crossOrigin: true, cache: false,
      contentType: "application/x-www-form-urlencoded; charset=utf-8",
      success: function(response)
      {
         if(response.errorcode == "PFERR_CONF_0000")
         {
            alert(response.errormessage);
            removeLayerPop();
            getBuyerData(1);
         }
         else
         {
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




//구매회원 등록하는 함수
async function registerAccount(){
   var verifyResult = verifyRegisterInput();
   if(verifyResult=="OK"){
      var reg_json = registerAccountJSON();
      await registerBuyerAjax(reg_json); //검색조건 적용 함수
   }
   else{
      alert(verifyResult);
   };
};

//등록함수를 위해 변수들을 JSON에 넣음
function registerAccountJSON(){
   //패스워드 암호화
   var input_password = $("input[name='biz_pwd']").val();
   input_password = CryptoJS.SHA256(input_password).toString();

   var biz_ssn_chk="";    //사업자등록번호 중복확인 후
   var pwd_original = "";
   var crudGBN="";

   var reg_status = "";    //상태
   var reg_type = "";      //유입
   var biz_name = "";      //상호
   var biz_ceo = "";      //대표자
   var biz_type = "";      //업태
   var biz_cate = "";      //종목
   var biz_zipcode = "";   //사업자 우편번호
   var account_status;  //1.ACTIVE 2.STOP 3.CANCEL 4.EXPIRED
   var license_status;  //1.시험 2.계약 3.종료
   var biz_addr_1 = "";      //사업자주소
   var biz_addr_2 = "";      //사업자 상세주소

   var bizMobile1 = "";
   var bizMobile2 = "";
   var bizMobile3 = "";

   var bizTel1 = "";
   var bizTel2 = "";
   var bizTel3 = "";

   var biz_email1 = "";   //이메일
   var biz_email2 = "";   //이메일
   var deli_zipcode = "";   //배송지 우편번호
   var deli_addr1 = "";   //배송지주소
   var deli_addr2 = "";   //배송지 상세주소
   var inputbiz_ssn="";

   biz_ssn_chk = $("#biz_ssn_checked").val();
   inputbiz_ssn = $("#chk_biz_ssn").val();

   pwd_original =  $("input[name='biz_pwd']").val();

   reg_status = $("select[name=pop_reg_status]").val();
   (reg_status=="1") ? crudGBN="insert_addAccount" : crudGBN="insert_only"; //LOV박스의 승인 버튼을 누른 경우 계좌를 발번해준다.


   //reg_status : 승인
   if(reg_status=="1"){
      account_status = "1";
      license_status = "2";
   }
   //reg_status : 미승인
   else if(reg_status=="0"){
      account_status = "3";
      license_status = "2";
   }  
   else if(reg_status=="2"){
      account_status = "3";
      license_status = "3";
   };

   reg_type = $("select[name=pop_reg_type]").val();
   biz_name = $("input[name='biz_name_input']").val();
   biz_ceo = $("input[name='register_biz_ceo']").val();
   biz_type = $("input[name='biz_type']").val();
   biz_cate = $("input[name='biz_cate']").val();
   biz_zipcode = $("input[name='biz_zipcode']").val();

   biz_addr_1 = $("input[name='biz_addr1']").val();
   biz_addr_2 = $("input[name='biz_addr2']").val();

   biz_email1 = $("input[name='biz_email1']").val();
   biz_email2 = $("input[name='biz_email2']").val();

   bizMobile1 = $("select[name=biz_mobile_1]").val();
   bizMobile2 = $("input[name=biz_mobile_2]").val();
   bizMobile3 = $("input[name=biz_mobile_3]").val();

   bizTel1 = $("select[name=biz_tel1]").val();
   bizTel2 =  $("input[name='biz_tel2']").val();
   bizTel3 = $("input[name='biz_tel3']").val();

   deli_zipcode = $("input[name='deli_zipcode']").val();
   deli_addr1 = $("input[name='deli_addr1']").val();
   deli_addr2 = $("input[name='deli_addr2']").val();


   var bizMobile = bizMobile1 + '-' + bizMobile2 + '-' + bizMobile3;
   var bizEmail = biz_email1 + '@' + biz_email2;
   var bizTel = bizTel1 + '-' + bizTel2 + '-' + bizTel3;
   var deli_addr = deli_zipcode +" "+ deli_addr1 +" "+ deli_addr2;

   var buyerRegisterInfo = {
      biz_ssn : inputbiz_ssn,
      mms_yn:'N',
      biz_ssn_date:$("#biz_ssn_date").val(),
      reg_status : reg_status,
      reg_type : reg_type,
      pwd :  input_password,
      pwd_original : pwd_original,

      biz_name : biz_name,
      biz_ceo : biz_ceo,

      biz_type : biz_type,
      biz_cate : biz_cate,

      license_status : license_status,
      account_status : account_status,

      bizZipCode : biz_zipcode,
      biz_addr_1 : biz_addr_1,
      biz_addr_2 : biz_addr_2,

      deli_addr : deli_addr,
      deli_zipcode : deli_zipcode,
      deli_addr1 : deli_addr1,
      deli_addr2 : deli_addr2,

      bizMobile : bizMobile,
      bizMobile1 : bizMobile1,
      bizMobile2 : bizMobile2,
      bizMobile3 : bizMobile3,

      bizTel : bizTel,
      bizTel1 : bizTel1,
      bizTel2 : bizTel2,
      bizTel3 : bizTel3,

      bizEmail : bizEmail,
      biz_email1 : biz_email1,
      biz_email2 : biz_email2,
      crudGBN : crudGBN
   };

   return buyerRegisterInfo;
};

//등록 팝업에서 SSN 중복확인버튼에 작동하는 함수
function chkDupSSN(){
   if(ssn_comf_check()){
      var opt={};
      opt.ssn=$("input[name='chk_biz_ssn']").val();
      if(opt.ssn.length>0)
      {
      //입력값이 점주이기 때문에 구분자를 B2B_BUYER으로 둔다.
         opt.checkGbn="B2B_BUYER";
         opt.procGbn="CHECK_DUP_ID";
         $.ajax({
            url: "/uAddAccountB2B?"  + $.param({"addinfo":opt, "client":getNaviInfo()}),
            type: "POST", async: false, dataType: "JSON", crossOrigin: true, cache: false,
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function(response)
            {
                  if(response.returnvalue=="OK"){
                     $("#biz_ssn_checked").val("Y");
                     $("#chk_biz_ssn").attr("disabled",true);
                     $("#duplicationCheck").attr("disabled",true);
                     alert("사용할 수 있는 아이디입니다.")
                  }
                  else{
                     alert(response.errormessage);
                  };
            },
            error: function(xhr, textStatus, e)
            {
                  alert("[error]: "+textStatus);
            }
         });
      }
      else{
         alert("사업자번호를 입력하세요");
      };
   }else{
       alert("사업자번호, 개업연월일, 대표자명이 \n바르게 입력되어 있는지 확인 바랍니다.");
   }
};

function ssn_comf_check(){
   if($("input[name='chk_biz_ssn']").val() == "" || $("#biz_ssn_date").val() == ""||$("#register_biz_ceo").val() == ""){
       return false;
   };
   if($("#biz_ssn_date").val().indexOf("-") > -1){
       alert("개업연월일 형식이 잘못되었습니다.");
       return;
   };

   var data = {
           "businesses": [
               {
                   "b_no": $("input[name='chk_biz_ssn']").val(),
                   "start_dt": $("#biz_ssn_date").val(),
                   "p_nm": $("input[name='register_biz_ceo']").val()
               }
           ]
       };

   var rtn = false;
   $.ajax({
      url: "https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=nYd%2F9W2KFnnsLO%2F9Hm%2BSMqJ2pK4Z8X3izE7xt8GIk6cq%2BRCaFrzg1m1ybI9L7TYt0f%2BAx7X54bInOIb96TN82w%3D%3D",  // serviceKey 값을 xxxxxx에 입력
      type: "POST",
      async: false,
      data: JSON.stringify(data), // json 을 string으로 변환하여 전송
      dataType: "JSON",
      contentType: "application/json",
      accept: "application/json",
      success: function(result) {
      //   console.log(result);
      //   console.log(result.data[0].valid); // result.data[0].valid 가 01이면 정상임
         if(result.data[0].valid == "01"){
            rtn = true;
         }
         else{
               rtn = false;
         }
      },
      error: function(result) {
         console.log(result.responseText); //responseText의 에러메세지 확인
      }
   });

   return rtn;
};

//chkDupSSN에 값을 넣어주는 함수
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

//등록시 빠진 사항이 있는지 확인해주는 함수
function verifyRegisterInput(){
   var biz_ssn_chk="";    //사업자등록번호 중복확인 후
   var pwd_original = "";

   var biz_name = "";      //상호
   var biz_ceo = "";      //대표자
   var biz_zipcode = "";   //사업자 우편번호

   var biz_addr_1 = "";      //사업자주소
   var biz_addr_2 = "";      //사업자 상세주소

   var bizMobile2 = "";
   var bizMobile3 = "";

   var bizTel2 = "";
   var bizTel3 = "";

   var biz_email1 = "";   //이메일
   var biz_email2 = "";   //이메일
   var deli_zipcode = "";   //배송지 우편번호
   var deli_addr1 = "";   //배송지주소
   var deli_addr2 = "";   //배송지 상세주소
   var inputbiz_ssn="";

   biz_ssn_chk = $("#biz_ssn_checked").val();
   inputbiz_ssn = $("#chk_biz_ssn").val();
   pwd_original =  $("input[name='biz_pwd']").val();

   biz_name = $("input[name='biz_name_input']").val();
   biz_ceo = $("input[name='register_biz_ceo']").val();

   biz_zipcode = $("input[name='biz_zipcode']").val();
   biz_addr_1 = $("input[name='biz_addr1']").val();
   biz_addr_2 = $("input[name='biz_addr2']").val();

   bizTel2 =  $("input[name='biz_tel2']").val();
   bizTel3 = $("input[name='biz_tel3']").val();

   bizMobile2 = $("input[name=biz_mobile_2]").val();
   bizMobile3 = $("input[name=biz_mobile_3]").val();

   biz_email1 = $("input[name='biz_email1']").val();
   biz_email2 = $("input[name='biz_email2']").val();

   deli_zipcode = $("input[name='deli_zipcode']").val();
   deli_addr1 = $("input[name='deli_addr1']").val();
   deli_addr2 = $("input[name='deli_addr2']").val();




   //패스워드 배열 조합 확인용

   var checkPassword = checkLevel2(inputbiz_ssn, pwd_original);
   
   //비밀번호 배열 조합
   if(checkPassword!="OK"){
      return checkPassword;
   }
   //사업자등록번호를 하지 않고 등록을 누르는 경우
   else if(biz_ssn_chk!="Y")
   {
      return ("사업자등록번호 중복확인을 체크해주시기 바랍니다.");
   }   
   else if(pwd_original==undefined||pwd_original==""){
      return ("비밀번호의 값을 설정해주시기 바랍니다.");
   }
   //비밀번호 값 일치여부
   else if(pwd_original != $("input[name='biz_pwd_check']").val() ){
      return ("비밀번호의 값이 일치하지 않습니다.");
   }
   //상호명 길이
   else if(biz_name.length<2){
      return ("상호명의 길이를 2자 이상으로 설정해주시기 바랍니다.");
   }
   //대표자 길이
   else if(biz_ceo.length<2){
      return ("대표자 이름의 길이를 2자 이상으로 설정해주시기 바랍니다.");
   }
   //사업자 주소(우편번호)
   else if(biz_zipcode.length<1){
      return ("우편번호의 값을 다시 확인해주시기 바랍니다.");
   }
   //사업자주소(사업자 주소)
   else if(biz_addr_1.length<1){
      return ("사업자 주소를 입력해 주시기 바랍니다.");
   }
   //사업자주소(상세주소)
   else if(biz_addr_2.length<1){
      return ("상세 주소의 값을 다시 확인해주시기 바랍니다.");
   }
   //전화번호 작성란
   else if(bizTel2.length<1||bizTel3.length<1){
      return ("전화번호 작성란에 공란이 있습니다.");
   }
   //휴대폰 번호 작성란
   else if(bizMobile2.length<1||bizMobile3.length<1){
      return ("휴대폰 번호 작성란에 공란이 있습니다.");
   }
   //이메일 작성란
   else if(biz_email1.length<3||biz_email2.length<4){
      return ("정상적인 이메일 형식이 아닙니다. 이메일 작성란을 다시 확인해주시기 바랍니다.");
   }
   //배송지 주소(우편번호)
   else if(deli_zipcode.length<1){
      return ("우편번호의 값을 다시 확인해주시기 바랍니다.");
   }
   //배송지주소(배송지 주소)
   else if(deli_addr1.length<1){
      return ("배송지 주소의 값을 다시 확인해주시기 바랍니다.");
   }
   //배송지주소(상세주소)
   else if(deli_addr2.length<1){
      return ("배송지 주소의 값을 다시 확인해주시기 바랍니다.");
   }
   else{
      return "OK";
   };
};
//********************************등록버튼 관련 함수 끝********************************//


//********************************수정버튼 관련 함수********************************//

//구매회원 정보 수정하는 함수
async function editAccount(){
   
   var verifyResult = verifyEditBuyer();
   if(verifyResult=="OK"){
      var reg_json = getEditAccountJSON();
      editBuyerAdminInfo(reg_json);
   }
   else{
      alert(verifyResult);
   };
};

//수정 팝업에서 수정된 내용을 JSON으로 전달해주는 함수
function getEditAccountJSON(){
   //insert변수들과의 변수 구분을 위하여 구매회원정보의 parameter들 앞에 '_'를 붙임
   var crudGBN = "";
   var biz_ssn = document.getElementById("editing_ssn").innerText; //SSN값
   var reg_status = $("#edit_reg_status option:selected").val();   //상태
   var account_status; //1.ACTIVE 2.STOP 3.CANCEL 4.EXPIRED
   var license_status; //1.시험 2.계약 3.종료
   //reg_status : 승인
   if(reg_status=="1"){
      account_status = "1";
      license_status = "2";
   }
   //reg_status : 미승인
   else if(reg_status=="0"){
      account_status = "3";
      license_status = "2";
   }  
   //reg_status : 사용중지
   else if(reg_status=="2"){
      account_status = "3";
      license_status = "3";
   };

   var reg_type =  $("#edit_reg_type option:selected").val();    //유입
   



   var biz_name = $("#edit_biz_name").val();  //상호
   var biz_ceo = $("#edit_biz_ceo").val();    //대표자

   var biz_type = $("input[name=biz_type]").val();  //업태
   var biz_cate =  $("input[name=biz_cate]").val(); //종목

   var biz_zip_code = $("#biz_zipcode").val();  //사업자 우편번호
   var biz_addr_1 = $("#biz_addr1").val();  //사업자주소
   var biz_addr_2 = $("#biz_addr2").val();  //사업자 상세주소

   var deli_addr = $("#deli_zipcode").val()+ " " + $("#deli_addr1").val()+ " "+ $("#deli_addr2").val();  //배송지주소

   var bizMobile_1 = $("select[name=biz_mobile1]").val();  //휴대폰1
   var bizMobile_2 = $("input[name=biz_mobile2]").val();   //휴대폰2
   var bizMobile_3 = $("input[name=biz_mobile3]").val();   //휴대폰3

   var bizTel_1 = $("select[name=biz_tel1]").val();  //휴대폰1
   var bizTel_2 = $("input[name=biz_tel2]").val();   //휴대폰2
   var bizTel_3 = $("input[name=biz_tel3]").val();   //휴대폰3

   var biz_email_1 = $("input[name='biz_email1']").val();  //이메일1
   var biz_email_2 = $("input[name='biz_email2']").val();  //이메일2

   var bank_code = $("select[name=refund_bank]").val();   //은행코드

   var main_bank_account = "";   //대표계좌가 없는 경우 null값을 보낸다
   if(document.getElementById("main_account")!=undefined&&document.getElementById("main_account")!=null){
      main_bank_account = document.getElementById("main_account").innerText; //대표계좌
   };
   

   var refund_account = $("input[name=refund_account]").val();  //계좌번호
   var refund_holder = $("input[name=refund_holder]").val();  //예금주명


   if($("select[name=refund_bank] option:selected").text()=="- 은행선택 -"){
      var refund_bankName = "";
   }
   else{
      var refund_bankName = $("select[name=refund_bank] option:selected").text(); //은행명
   };

   var from_status = document.getElementById("origin_reg_status").innerText;
   var to_status = $("#edit_reg_status option:selected").val();
   (from_status=="0"&&to_status=="1") ? crudGBN="update_addAccount" : crudGBN="update_only";

   var bizMobile = bizMobile_1 + '-' + bizMobile_2 + '-' + bizMobile_3;
   var bizEmail = biz_email_1 + '@' + biz_email_2;
   var bizTel = bizTel_1 + '-' + bizTel_2 + '-' + bizTel_3;

   //패스워드 암호화
   var pwd = $("input[name='biz_pwd']").val();
   var pwd_check =  $("input[name='biz_pwd']").val();
   var pwdObj = {pwd : CryptoJS.SHA256(pwd).toString()}
   var editJSON = {};
   editJSON = {
      biz_ssn : biz_ssn,
      mms_yn:$("select[name=biz_mms_yn] option:selected").val(),

      reg_status : reg_status,
      account_status : account_status,
      license_status : license_status,
      reg_type : reg_type,

      biz_name : biz_name,
      biz_ceo : biz_ceo,

      biz_type : biz_type,
      biz_cate : biz_cate,

      bizZipCode : biz_zip_code,
      biz_addr_1 : biz_addr_1,
      biz_addr_2 : biz_addr_2,

      deli_addr : deli_addr,

      bizTel : bizTel,
      bizMobile : bizMobile,
      bizEmail : bizEmail,
      
      main_bank_account : main_bank_account,

      refund_bank_code : bank_code,
      refund_bank_name : refund_bankName,
      refund_account : refund_account,
      refund_holder : refund_holder,
      crudGBN : crudGBN
   };
   if(pwd!=""&&pwd_check!="") {
      editJSON.pwd = CryptoJS.SHA256(pwd).toString();
   };
   return editJSON;
};

//수정 팝업 클릭 시 등장하는 구매회원 정보를 불러오는 ajax 함수
async function getBuyerInfo(pGetSearchCondition){
   var ret;
   await $.ajax({
      url: "/uGetBuyerListAdm?" + $.param({"authPage" : "cBuyerListPopAdm.js", "searchCondition":pGetSearchCondition}),
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
               ret = null;
         }
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

//구매회원정보 DB 수정하는 ajax 함수
function editBuyerAdminInfo(pBuyerInfo){
   var ret;
   $.ajax({
         url: "/uSetBuyerListAdm?" + $.param({"authPage" : "cBuyerListPopAdm.js", "pBuyerInfo":pBuyerInfo , "crudGBN":"editing"}),
         type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
         contentType: "application/x-www-form-urlencoded; charset=utf-8",
         success: function(response){
            if(response.errorcode == "PFERR_CONF_0000"){
               alert("구매회원정보 변경 완료 되었습니다.");
               removeLayerPop();
               //1페이지로 이동
               reDrawData(1);
            }
            else if(response.errorcode == "PFERR_CONF_0059"){
               location.href = response.returnpage;
               alert(response.errormessage);
            }
            else{
               alert(response.errormessage);
            };
         },
         error: function(xhr, textStatus, e) {
            alert("[error] : " + textStatus);
            ret = null;
         }
   });
   return ret;
};

//대표계좌 선택 시 내용 바꿔주는 함수
function accountRadioBox(event){
   var bank_count = Number(document.getElementById("bank_count").innerText);
   var bankName;
   var account;
   var txt ="";
   for(var ix=0;ix<(bank_count+1);ix++){
      if(ix==event.target.value){
         bankName = document.getElementById("bankName_"+ix).value;
         account = document.getElementById("account_"+ix).value;
         document.getElementById("fixed_account").innerHTML="";
         txt = '<span class="bankInfo" style="font-weight:bold;background-color:#F6F6F6;">'+bankName+' : '+account+'</span> \n';
         document.getElementById("fixed_account").innerHTML=txt;
      };
   };
   return account;
};

//accountRadioBox에서 변경한 값을 html 태그에 넣어주는 함수
function getMainAccount(event){
   var account = accountRadioBox(event);
   var txt = account
   document.getElementById("main_account").innerText = txt;
};



//수정 팝업에서 핸드폰 번호&전화번호 '-' 제거
function changePhoneNumber(returnSetArray){
   var phone = returnSetArray.HEAD_OFFICE_CHARGER_PHONE;
   var mobile = returnSetArray.HEAD_OFFICE_CHARGER_MOBILE;
   if(mobile==undefined||mobile==""){
      var mobile_1 = "";
      var mobile_2 = "";
      var mobile_3 = "";
   }
   else{
      var mobile_1 = mobile.split('-')[0];
      var mobile_2 = mobile.split('-')[1];
      var mobile_3 = mobile.split('-')[2];
   };
   var phone_1 = phone.split('-')[0];
   var phone_2 = phone.split('-')[1];
   var phone_3 = phone.split('-')[2];

   return [phone_1, phone_2, phone_3, mobile_1, mobile_2, mobile_3];
};

//returnSetArray에서 이메일의 @를 기점으로 분리시켜주는 함수
function splitEmail(returnSetArray){
   var repr_email = returnSetArray.HEAD_OFFICE_REPR_EMAIL;
   var email_front="";
   var email_back="";
   if (repr_email!=""&&repr_email!=undefined){
      email_front = repr_email.split('@')[0];
      email_back = repr_email.split('@')[1];
   };
   return [email_front, email_back];
};

//구매회원 수정 시 공란을 체크해주는 함수
function verifyEditBuyer(){
   
   var biz_ssn = document.getElementById("editing_ssn").innerText; //SSN값
   var pwd_original =  $("input[name='biz_pwd']").val();

   var biz_name = $("#edit_biz_name").val();  //상호
   var biz_ceo = $("#edit_biz_ceo").val();    //대표자

   var reg_status = $("#edit_reg_status option:selected").val();   //상태
   var biz_zip_code = $("#biz_zipcode").val();  //사업자 우편번호
   var biz_addr_1 = $("#biz_addr1").val();  //사업자주소
   var biz_addr_2 = $("#biz_addr2").val();  //사업자 상세주소

   var bizMobile_2 = $("input[name=biz_mobile2]").val();   //휴대폰2
   var bizMobile_3 = $("input[name=biz_mobile3]").val();   //휴대폰3

   var bizTel_2 = $("input[name=biz_tel2]").val();   //휴대폰2
   var bizTel_3 = $("input[name=biz_tel3]").val();   //휴대폰3

   var biz_email_1 = $("input[name='biz_email1']").val();  //이메일1
   var biz_email_2 = $("input[name='biz_email2']").val();  //이메일2
   var pwd_check = $("input[name='biz_pwd_check']").val(); //비밀번호 확인 값

   var checkPassword ="";
   //비밀번호 값이 둘 다 공란일 경우 값을 alert를 띄우지 않는다.
   if(pwd_original==""&&pwd_check==""){
      checkPassword="OK";
   }
   else{
      checkPassword = checkLevel2(biz_ssn, pwd_original);
   };

   //비밀번호 배열 조합
   if(checkPassword!="OK"){
      return checkPassword;
   }
   //비밀번호 값 일치여부
   else if(pwd_original != pwd_check){
      return ("비밀번호의 값이 일치하지 않습니다.");
   }
   //상호명 길이
   else if(biz_name.length<2){
      return ("상호명의 길이를 2자 이상으로 설정해주시기 바랍니다.");
   }
   //대표자 길이
   else if(biz_ceo.length<2){
      return ("이름의 길이를 2자 이상으로 설정해주시기 바랍니다.");
   }
   //사업자 주소(우편번호)
   else if(biz_zip_code.length<1){
      return ("사업자 우편번호의 값을 다시 확인해주시기 바랍니다.");
   }
   //사업자주소(사업자 주소)
   else if(biz_addr_1.length<1||biz_addr_2.length<1){
      return ("사업자 주소의 값을 다시 확인해주시기 바랍니다.");
   }
   //전화번호 작성란
   else if(bizTel_2.length<1||bizTel_3.length<1){
      return ("전화번호 작성란에 공란이 있습니다.");
   }
   //휴대폰 번호 작성란
   else if(bizMobile_2.length<1||bizMobile_3.length<1){
      return ("휴대폰 번호 작성란에 공란이 있습니다.");
   }
   //이메일 작성란
   else if(biz_email_1.length<3||biz_email_2.length<3){
      return ("정상적인 이메일 형식이 아닙니다. 이메일 작성란을 다시 확인해주시기 바랍니다.");
   }
   //배송지 주소(우편번호)
   else if(biz_zip_code.length<1){
      return ("배송지 우편번호의 값을 다시 확인해주시기 바랍니다.");
   }
   //배송지주소(배송지 주소)
   else if(biz_addr_1.length<1){
      return ("배송지 주소의 값을 다시 확인해주시기 바랍니다.");
   }
   //배송지주소(상세주소)
   else if(biz_addr_2.length<1){
      return ("배송지 주소의 값을 다시 확인해주시기 바랍니다.");
   }
   // else if(reg_status==0){
   //    return ("수정 시 승인대기로 설정하실 수 없습니다.");
   // }
   else{
      return "OK"
   };
};




//********************************그 외 함수********************************//

//취소버튼 클릭 시 팝업창이 사라짐
function removeLayerPop(){
   $(".layerPopArea").css("display" ,"none");
};

//사업자주소와 동일 클릭 시 발생하는 함수
function addressCopy(){

   var biz_zipcode = $("input[name='biz_zipcode']").val();
   var biz_addr1 = $("input[name='biz_addr1']").val();
   var biz_addr2 = $("input[name='biz_addr2']").val();

   if($("#copyCheck").is(":checked")==true){
      $("input[name='deli_zipcode']").val(biz_zipcode);
      $("input[name='deli_addr1']").val(biz_addr1);
      $("input[name='deli_addr2']").val(biz_addr2);
   }
   else{
      $("input[name='deli_zipcode']").val("");
      $("input[name='deli_addr1']").val("");
      $("input[name='deli_addr2']").val("");
   };
};

//취소 버튼 누를 시 확인시켜줌(등록팝업)
function btnSubmitCancel(){
   if (confirm("구매회원등록을 취소하시겠습니까?")==true){
      removeLayerPop();
   }
   else{
      return false;
   }
};

//이메일 select창 선택 시 이메일 뒤쪽 부분이 생성됨
function onChangeEmail(){
   var email_back = document.getElementById("biz_email3").value;
   document.getElementById("biz_email2").value = email_back;
};



//********************************END OF SOURCE********************************//