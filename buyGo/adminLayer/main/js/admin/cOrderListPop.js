/****************************************************************************************************
module명: cSupplierAddPopAdm.js
creator: 윤희상
date: 2022.03.28
version 1.0
설명: ADMIN 주문관련 팝업화면용
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
//20220714 ash set comments
//const { from } = require("form-data");
var gOrderID = -1;
var gLedger;
async function drawOrderListPop (pOrderID, pTabClassName, gGoodsIDArr){
    gOrderID = pOrderID;
    //ajax 조회 uGetOrderDetail
    var rtnValue = await getOrderDetailinfo(pOrderID);

    if(rtnValue == null){
        return false;
    };
    
    var tbData = rtnValue.returnvalue;
    var tbMemo = rtnValue.returnordermemo;
    var tbLedger = rtnValue.returnledger;
    gLedger = tbLedger;

    var txt = "";
    //파라미터 값에 따라 조회해서 데이터 매핑해야하는 경우도 있음
    txt += `<script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script> \n`;
    txt += `    <div class="layerPop" align="center" style="margin-top: 10px; display: block;"> \n`;
    txt += `        <!-- <script type="text/javascript" src="/resources/js/common/base.js"></script> \n`;
    txt += `        <script type="text/javascript" src="/resources/js/admin/orderManagement/detailPop.js"></script> --> \n`;
    txt += `        <!-- 상품 정보 --> \n`;
    txt += `        <form id="frmPop" name="frmPop" action="/admin/orderManagement/detailPop_process" method="post"> \n`;
    txt += `        <input type="hidden" id="order_idx" name="order_idx" value="${tbData[0].ORDER_IDX}"> \n`;
    txt += `        <input type="hidden" id="order_goods_idxs" name="order_goods_idxs" value=""> \n`;
    txt += `        <input type="hidden" id="supplier_ssn" value=""> \n`;
    txt += `        <input type="hidden" id="payment_bank" value="${tbData[0].PAYMENT_BANK}"> \n`;
    txt += `        <input type="hidden" id="pgCno" value="${tbData[0].KICC_DEAL_NO_STR}"> \n`;
    txt += `        <input type="hidden" id="payment_bank_name" value="${tbData[0].BANK_NAME}"> \n`;
    txt += `        <input type="hidden" id="payment_account" value="${tbData[0].PAYMENT_ACCOUNT}"> \n`;
    txt += `        <input type="hidden" id="receiver_mobile" value="${tbData[0].RECEIVER_MOBILE.replace(/-/g, "")}"> \n`;
    txt += `        <input type="hidden" id="PG_GBN" value="${tbData[0].PG_GBN}"> \n`;
    txt += `        <div class="popup pop800"> \n`;
    txt += `            <div class="pop_tit" style="position:relative;"> \n`;
    txt += `                상품 정보 \n`;
    txt += `                <div style="position:absolute;right:10px; top:10px;"> \n`;
    txt += `                    <button type="button" class="btn_ss01" onclick="callPrint();"><span><b>인쇄하기</b></span></button> \n`;
    txt += `                </div> \n`;
    txt += `            </div> \n`;
    txt += `            <div class="pop_cont"> \n`;
    txt += `                <!-- 받는분 정보(주문자정보) --> \n`;
    txt += `                <div class="pop_s_tit mt00"> \n`;
    txt += `                    받는분 정보 \n`;
    txt += `                </div> \n`;
    txt += `                <table class="table_row"> \n`;
    txt += `                    <colgroup><col width="20%"><col width="30%"><col width="20%"><col width="*"></colgroup> \n`;
    txt += `                    <tbody><tr> \n`;
    txt += `                        <th><span>이름</span></th> \n`;
    txt += `                        <td colspan="3" id="receiver_name">${tbData[0].RECEIVER_NAME}</td> \n`;
    txt += `                    </tr> \n`;
    txt += `                    <tr> \n`;
    txt += `                        <th><span>전화번호</span></th> \n`;
    txt += `                        <td>${tbData[0].RECEIVER_TEL}</td> \n`;
    txt += `                        <th><span>휴대폰</span></th> \n`;
    txt += `                        <td>${tbData[0].RECEIVER_MOBILE}</td> \n`;
    txt += `                    </tr> \n`;
    txt += `                    <tr> \n`;
    txt += `                        <th><span>주소</span></th> \n`;
    txt += `                        <td colspan="3"> \n`;
    txt += `                            (${tbData[0].RECEIVER_ZIPCODE})<br> \n`;
    txt += `                            ${tbData[0].RECEIVER_ADDR1}  ${tbData[0].RECEIVER_ADDR2} \n`;
    txt += `                        </td> \n`;
    txt += `                    </tr> \n`;
    txt += `                </tbody></table> \n`;
    txt += `                <!-- //받는분 정보(주문자정보) --> \n`;
    txt += `                <!-- 고객 상담메모 --> \n`;
    txt += `                <div class="pop_s_tit"> \n`;
    txt += `                    고객 상담메모 \n`;
    txt += `                </div> \n`;
    txt += `                <table class="table_col"> \n`;
    txt += `                    <colgroup><col width="22%"><col width="18%"><col width="60%"></colgroup> \n`;
    txt += `                    <thead> \n`;
    txt += `                        <tr class="text-center"> \n`;
    txt += `                            <th>작성일자</th> \n`;
    txt += `                            <th>작성자(ID)</th> \n`;
    txt += `                            <th>메모</th> \n`;
    txt += `                        </tr> \n`;
    txt += `                    </thead> \n`;
    txt += `                    <tbody id="orderMemoArea"> \n`;
    for(var mx = tbMemo.length-1; mx >= 0; mx--){
        txt += `<tr> \n`;
        txt += `<td>${tbMemo[mx].REG_DATE}</td> \n`;
        txt += `<td>${tbMemo[mx].REG_NAME}<span class="font11">(${tbMemo[mx].REG_ID})</span></td> \n`;
        txt += `<td class="text_l">${tbMemo[mx].CONSULT_MSG}</td> \n`;
        txt += `</tr> \n`;
    };
    txt += `                    </tbody> \n`;
    txt += `                    <tfoot> \n`;
    txt += `                        <tr> \n`;
    txt += `                            <td colspan="3" class="text_l"> \n`;
    txt += `                                <input type="text" style="display: none"> \n`;
    txt += `                                <input type="text" id="consult_msg" onsubmit="return false" class="w600" onenter="createOrderMemo('${tbData[0].ORDER_IDX}'); " maxlength="300">  \n`;
    txt += `                                <button type="button" class="btn_ss01" onclick="createOrderMemo('${tbData[0].ORDER_IDX}');"><span>등록</span></button> (300자 이내) \n`;
    txt += `                            </td> \n`;
    txt += `                        </tr> \n`;
    txt += `                    </tfoot> \n`;
    txt += `                </table> \n`;
    txt += `                <!-- //고객 상담메모 --> \n`;
    txt += `                <!-- tab --> \n`;
    txt += `                <ul class="tab01 mt30"> \n`;
    txt += `                    <li class="tab01_01 on"><a href="javascript://">주문상품정보</a></li> \n`;
    txt += `                    <li class="tab01_02"><a href="javascript://">입금,배송정보</a></li> \n`;
    txt += `                    <li class="tab01_03"><a href="javascript://">배송 대상</a></li> \n`;
    txt += `                    <li class="tab01_04"><a href="javascript://">배송 진행</a></li> \n`;
    if($("#layoutGB").val() == "paymentWaitingAdm"){
        txt += `                    <li class="tab01_06"><a href="javascript://">주문 수정</a></li> \n`;
    }
    else if(($("#layoutGB").val()).substring($("#layoutGB").val().length-5, $("#layoutGB").val().length) == "Super"){
        
    }
    else{
        txt += `                    <li class="tab01_05"><a href="javascript://">취소/반품 관리</a></li> \n`;
    }
    txt += `                </ul> \n`;
    txt += `                <!-- 주문상품정보 --> \n`;
    txt += `                <div class="tab01_cont01" style="position: relative; display: block;"> \n`;
    if($("#layoutGB").val() == "paymentWaitingAdm"){
        txt += `                    <div> \n`;
        txt += `                        <button type="button" class="btn_ss01" onclick="btn_payment_gb(${tbData[0].ORDER_IDX},'1');"><span>입금완료</span></button>	 \n`;
        txt += `                    </div> \n`;
    }
    else{
        //입금대기에서 열면 해당 div가 안보여야함
        txt += `                    <div style="position:absolute; right:0px; top:28px;"> \n`;
        txt += `                        <button type="button" class="btn_ss01" onclick="btn_delivery_gb('1');"><span>배송 준비중</span></button>	 \n`;
        txt += `                        <button type="button" class="btn_ss01" onclick="btn_delivery_gb('0');"><span>배송 준비중 취소</span></button>					 \n`;
        if(($("#layoutGB").val()).substring($("#layoutGB").val().length-5, $("#layoutGB").val().length) == "Super"){
            txt += `                    </div>	 \n`;
        }
        else {
            txt += `                        <button type="button" class="btn_ss01" onclick="btn_goods_cancel();"><span>주문 취소/반품</span></button> \n`;
            txt += `                    </div>	 \n`;
            txt += `                    <div> \n`;
            txt += `                        <button type="button" class="btn_ss01" onclick="btn_payment_gb(${tbData[0].ORDER_IDX},'0');"><span>입금취소</span></button>	 \n`;
            txt += `                    </div> \n`;
        };
    }
    //입금대기에서 열면 입금완료 버튼으로 바꿔야함 btn_payment_gb(order_idx, 변경되어야 하는 payment_구분 코드 값)
    txt += `                    <p>주문번호 : ${tbData[0].ORDER_IDX}</p> \n`;
    txt += `                    <p>주문일시 : ${tbData[0].ORDER_DATE}</p> \n`;
    txt += `                    <input type="hidden" id="orderdataDetailOrderNo" value=${tbData[0].ORDER_IDX}> \n`;
    txt += `                    <p class="mb10">-전체-</p> \n`;
    txt += `                    <table class="table_col order_goods_list" id="detailPop_orderGoodsList"> \n`;
    txt += `                        <colgroup><col width="30"><col width="40"><col width="70"><col width="*"><col width="70"><col width="55"><col width="55"><col width="80"><col width="80"><col width="70" class="printHide"></colgroup> \n`;
    txt += `                        <thead> \n`;
    txt += `                            <tr class="s_th text-center"> \n`;
    txt += `                                <th rowspan="2"><input type="checkbox" class="checkAll" onclick="selectAll(this, 'gidx')"></th> \n`;
    txt += `                                <th rowspan="2">번호</th> \n`;
    txt += `                                <th rowspan="2">공급사</th> \n`;
    txt += `                                <th rowspan="2">[바코드]<br>상품명</th> \n`;
    txt += `                                <th rowspan="2">판매가(원)</th> \n`;
    txt += `                                <th colspan="3">수량</th> \n`;
    txt += `                                <th rowspan="2">입금금액(원)</th> \n`;
    txt += `                                <th rowspan="2" class="printHide">주문상태</th> \n`;
    txt += `                            </tr> \n`;
    txt += `                            <tr class="s_th text-center"> \n`;
    txt += `                                <th class="bor_l">낱개</th> \n`;
    txt += `                                <th>볼</th> \n`;
    txt += `                                <th>박스</th> \n`;
    txt += `                            </tr> \n`;
    txt += `                        </thead> \n`;
    txt += `                        <tbody> \n`;
    var t_price = 0;
    for(var gx = 0; gx < tbData.length; gx ++){
        txt += `                            <input type="hidden" class="goods_price" value=""> \n`;
        txt += `                            <tr> \n`;
        txt += `                                <td><input type="checkbox" name="gidx" class="checkItem" value=${tbData[gx].ROW_SEQUENCE}></td> \n`;
        txt += `                                <td class="NumAsc">${tbData[gx].ROWNUM}</td> \n`;
        txt += `                                <td class="cancelFld1">${tbData[gx].SUPPLIER_NAME}</td>	 \n`;
        txt += `                                <td class="cancelFld2">[${tbData[gx].GOODS_UNIT_BARCODE}]<br>${tbData[gx].SALES_ITEM_NAME}</td> \n`;
        txt += `                                <td class="cancelFld3"><span class="comma">${(tbData[gx].SALES_ITEM_PRICE).toLocaleString('ko-KR')}</span></td> \n`;
        txt += `                                <td class="cancelFld4"><span class="comma">${(tbData[gx].ORDER_UNIT + tbData[gx].L_CANCLE_ORDER_UNIT).toLocaleString('ko-KR')}</span></td> \n`;
        txt += `                                <td class="cancelFld5"><span class="comma">${(tbData[gx].ORDER_BUNDLE + tbData[gx].L_CANCLE_ORDER_BUNDLE).toLocaleString('ko-KR')}</span></td> \n`;
        txt += `                                <td class="cancelFld6"><span class="comma">${(tbData[gx].ORDER_BOX + tbData[gx].L_CANCLE_ORDER_BOX).toLocaleString('ko-KR')}</span><br>(입수량 <span class="comma">${(tbData[gx].PIECE_BOX).toLocaleString('ko-KR')}</span>)</td> \n`;
        txt += `                                <td class="cancelFld7"><span class="comma">${(tbData[gx].SALES_ITEM_PRICE*(tbData[gx].ORDER_PIECE)-tbData[gx].SUM_AMOUNT).toLocaleString('ko-KR')}</span></td> \n`;
        txt += `                                <td class="printHide">${tbData[gx].STATUS}</td>						 \n`;
        txt += `                            </tr>						 \n`;
        t_price = t_price + (tbData[gx].SALES_ITEM_PRICE*(tbData[gx].ORDER_PIECE)-tbData[gx].SUM_AMOUNT);
    }
    txt += `                        </tbody> \n`;
    txt += `                    </table> \n`;
    txt += `                    <p class="order_total">총 입금 금액(원) : <span id="detailPop_total_sell_amount">${(t_price).toLocaleString('ko-KR')}</span></p> \n`;
    txt += `                </div> \n`;
    txt += `                <!-- //주문상품정보 --> \n`;
    txt += `                <!-- 입금/배송정보 --> \n`;
    txt += `                <div class="tab01_cont02" style="display: none;"> \n`;
    txt += `                    <div class="pop_s_tit"> \n`;
    txt += `                        입금정보 \n`;
    txt += `                    </div> \n`;
    txt += `                    <table class="table_col"> \n`;
    txt += `                        <colgroup><col width="25%"><col width="15%"><col width="20%"><col width="40%"></colgroup> \n`;
    txt += `                        <thead> \n`;
    txt += `                            <tr class="text-center"> \n`;
    txt += `                                <!-- <th>입금방법</th> --> \n`;
    txt += `                                <th>고정계좌(은행)</th> \n`;
    txt += `                                <th>입금금액(원)</th> \n`;
    txt += `                                <th>입금완료일</th> \n`;
    txt += `                                <th>입금TID</th> \n`;
    txt += `                            </tr> \n`;
    txt += `                        </thead> \n`;
    txt += `                        <tbody> \n`;
    txt += `                            <tr> \n`;
    txt += `                                <td>${tbData[0].PAYMENT_ACCOUNT}(${tbData[0].BANK_NAME})</td> \n`;
    txt += `                                <td class="comma">${(tbData[0].PAYMENT_SUM).toLocaleString('ko-KR')}</td> \n`;
    txt += `                                <td>${tbData[0].PAYMENT_DATE}</td> \n`;
    txt += `                                <td>${tbData[0].DEPOSIT_KEY}</td> \n`;
    txt += `                            </tr> \n`;
    txt += `                        </tbody> \n`;
    txt += `                    </table> \n`;
    txt += `                    <div class="pop_s_tit"> \n`;
    txt += `                        받는분 정보 \n`;
    txt += `                    </div> \n`;
    txt += `                        <table class="table_row"> \n`;
    txt += `                            <colgroup><col width="20%"><col width="30%"><col width="20%"><col width="*"></colgroup> \n`;
    txt += `                            <tbody><tr> \n`;
    txt += `                                <th><span>이름</span></th> \n`;
    txt += `                                <td colspan="3"><input type="text" name="reveiver_name" class="w130" value="${tbData[0].RECEIVER_NAME}"></td> \n`;
    txt += `                            </tr> \n`;
    txt += `                            <tr> \n`;
    txt += `                                <th><span>전화번호</span></th> \n`;
    txt += `                                <td> \n`;
    txt += `                                    <select name="receiver_tel1" style="width:70px;" value="">						 \n`;
    txt += `                                        <option value="02">02</option> \n`;
    txt += `                                        <option value="031">031</option> \n`;
    txt += `                                        <option value="032">032</option> \n`;
    txt += `                                        <option value="033">033</option> \n`;
    txt += `                                        <option value="041">041</option> \n`;
    txt += `                                        <option value="042">042</option> \n`;
    txt += `                                        <option value="043">043</option> \n`;
    txt += `                                        <option value="051">051</option> \n`;
    txt += `                                        <option value="052">052</option> \n`;
    txt += `                                        <option value="053">053</option> \n`;
    txt += `                                        <option value="054">054</option> \n`;
    txt += `                                        <option value="055">055</option> \n`;
    txt += `                                        <option value="061">061</option> \n`;
    txt += `                                        <option value="062">062</option> \n`;
    txt += `                                        <option value="063">063</option> \n`;
    txt += `                                        <option value="064">064</option> \n`;
    txt += `                                        <option value="0505">0505</option> \n`;
    txt += `                                        <option value="0502">0502</option> \n`;
    txt += `                                        <option value="070">070</option> \n`;
    txt += `                                    </select> \n`;
    txt += `                                    <input type="text" name="receiver_tel2" class="w55" maxlength="4" value="${tbData[0].RECEIVER_TEL.split('-')[1]}"> -  \n`;
    txt += `                                    <input type="text" name="receiver_tel3" class="w55" maxlength="4" value="${tbData[0].RECEIVER_TEL.split('-')[2]}"> \n`;
    txt += `                                </td> \n`;
    txt += `                                <th><span>휴대폰</span></th> \n`;
    txt += `                                <td> \n`;
    txt += `                                    <select name="receiver_mobile1" style="width:70px;" value="">						 \n`;
    txt += `                                        <option value="010">010</option> \n`;
    txt += `                                        <option value="011">011</option> \n`;
    txt += `                                        <option value="016">016</option> \n`;
    txt += `                                        <option value="017">017</option> \n`;
    txt += `                                        <option value="018">018</option> \n`;
    txt += `                                        <option value="019">019</option> \n`;
    txt += `                                        <option value="0130">0130</option> \n`;
    txt += `                                        <option value="0502">0502</option> \n`;
    txt += `                                        <option value="070">070</option> \n`;
    txt += `                                    </select> \n`;
    txt += `                                    <input type="text" name="receiver_mobile2" class="w55" maxlength="4" value="${tbData[0].RECEIVER_MOBILE.split('-')[1]}"> -  \n`;
    txt += `                                    <input type="text" name="receiver_mobile3" class="w55" maxlength="4" value="${tbData[0].RECEIVER_MOBILE.split('-')[2]}"> \n`;
    txt += `                                </td> \n`;
    txt += `                            </tr> \n`;
    txt += `                            <tr> \n`;
    txt += `                                <th><span>주소</span></th> \n`;
    txt += `                                <td colspan="3"> \n`;
    txt += `                                    <span class="block"> \n`;
    txt += `                                        <input type="text" name="receiver_zipcode" id="receiver_zipcode" class="w55" maxlength="6" placeholder="우편번호" value="${tbData[0].RECEIVER_ZIPCODE}">  \n`;
    txt += `                                        <button type="button" class="btn_ss01" onclick="postPop('receiver_zipcode', 'receiver_addr1', 'receiver_addr2');"><span>우편번호 찾기</span></button> \n`;
    txt += `                                    </span> \n`;
    txt += `                                    <span class="block mt05"> \n`;
    txt += `                                        <input type="text" name="receiver_addr1" id="receiver_addr1" class="w380" maxlength="300" placeholder="주소" value="${tbData[0].RECEIVER_ADDR1}"> \n`;
    txt += `                                        <input type="text" name="receiver_addr2" id="receiver_addr2" class="w210" maxlength="300" placeholder="상세주소" value="${tbData[0].RECEIVER_ADDR2}"> \n`;
    txt += `                                    </span> \n`;
    txt += `                                </td> \n`;
    txt += `                            </tr> \n`;
    txt += `                            <tr> \n`;
    txt += `                                <th><span>배송시 요청사항</span></th> \n`;
    txt += `                                <td colspan="3"> \n`;
    txt += `                                    <input type="text" name="receiver_delivery_demand" style="width:500px" maxlength="50" value="${tbData[0].RECEIVER_DELIVERY_DEMAND}">\n`;
    txt += `                                </td> \n`;
    txt += `                            </tr> \n`;
    txt += `                        </tbody></table> \n`;
    txt += `                    <div class="mt05 text_r"> \n`;
    txt += `                        <button type="button" class="btn01" onclick="btn_reciver_edit();"><span>수정</span></button> \n`;
    txt += `                    </div> \n`;
    txt += `                </div> \n`;
    txt += `                <!-- //입금/배송정보 --> \n`;
    txt += `                <!-- 배송 대상--> \n`;
    txt += `                <div class="tab01_cont03" style="display: none;">			 \n`;
    txt += `                    <div class="pop_s_tit"> \n`;
    txt += `                        배송 번호 입력 \n`;
    txt += `                    </div> \n`;
    txt += `                    <table class="table_col"> \n`;
    txt += `                        <colgroup><col width="25%"><col width="30%"><col width="*"></colgroup> \n`;
    txt += `                        <thead> \n`;
    txt += `                            <tr class="text-center"> \n`;
    txt += `                                <th>배송일</th> \n`;
    txt += `                                <th>택배사</th> \n`;
    txt += `                                <th>송장번호</th>						 \n`;
    txt += `                            </tr> \n`;
    txt += `                        </thead> \n`;
    txt += `                        <tbody> \n`;
    txt += `                            <tr> \n`;
    txt += `                                <td> \n`;
    txt += `                                    <input type="text" name="delivery_date" id="delivery_date" class="w100 datepicker1" value=""> \n`;
    txt += `                                </td> \n`;
    txt += `                                <td> \n`;
    txt += `                                    <select name="delivery_name" id="delivery_name" style="width:150px;" value=""> \n`;
    txt += `                                    <option value="">-- 선택 --</option> \n`;
    txt += `                                    <option value="한진택배">한진택배</option> \n`;
    txt += `                                    <option value="CJ대한통운">CJ대한통운</option> \n`;
    txt += `                                    <option value="KGB택배">KGB택배</option> \n`;
    txt += `                                    <option value="KG로지스">KG로지스</option> \n`;
    txt += `                                    <option value="로젠택배">로젠택배</option> \n`;
    txt += `                                    <option value="경동택배">경동택배</option> \n`;
    txt += `                                    <option value="롯데택배">롯데택배</option> \n`;
    txt += `                                    <option value="현대택배">현대택배</option> \n`;
    txt += `                                    <option value="우체국택배">우체국택배</option> \n`;
    txt += `                                    <option value="대신택배">대신택배</option> \n`;
    txt += `                                    <option value="용마로지스">용마로지스</option> \n`;
    txt += `                                    <option value="합동택배">합동택배</option> \n`;
    txt += `                                    <option value="일양로지스">일양로지스</option> \n`;
    txt += `                                    <option value="천일택배">천일택배</option> \n`;
    txt += `                                    <option value="건영택배">건영택배</option> \n`;
    txt += `                                    </select> \n`;
    txt += `                                </td> \n`;
    txt += `                                <td> \n`;
    txt += `                                    <input type="text" name="delivery_no" id="delivery_no" class="w250" value="">  \n`;
    txt += `                                    <button type="button" class="btn_ss01" onclick="btn_delivery_send();"><span>저장</span></button> \n`;
    txt += `                                </td>						 \n`;
    txt += `                            </tr> \n`;
    txt += `                        </tbody> \n`;
    txt += `                    </table>			 \n`;
    txt += `                    <div class="pop_s_tit"> \n`;
    txt += `                        배송 대상 리스트 \n`;
    txt += `                    </div> \n`;
    txt += `                    <table class="table_col order_goods_list" id="detailPop_orderDeliveryStayList"> \n`;
    txt += `                        <colgroup><col width="30"><col width="100"><col width="*"><col width="80"><col width="80"><col width="80"></colgroup> \n`;
    txt += `                        <thead> \n`;
    txt += `                            <tr class="s_th text-center"> \n`;
    txt += `                                <th rowspan="2"><input type="checkbox" class="checkAll" onclick="selectAll(this, 'ds_idx')"></th> \n`;
    txt += `                                <th rowspan="2">공급사</th> \n`;
    txt += `                                <th rowspan="2">[바코드] 상품명</th> \n`;
    txt += `                                <th colspan="3">수량</th> \n`;
    txt += `                            </tr> \n`;
    txt += `                            <tr class="s_th text-center"> \n`;
    txt += `                                <th class="bor_l">낱개</th> \n`;
    txt += `                                <th>볼</th> \n`;
    txt += `                                <th>박스</th> \n`;
    txt += `                            </tr> \n`;
    txt += `                        </thead> \n`;
    txt += `                        <tbody> \n`;
    var d_count = 0;
    for(var dx=0; dx < tbData.length; dx++){
        if(tbData[dx].DELIVERY_STATUS == '1' && (tbData[dx].ORDER_PIECE - tbData[dx].L_ORDER_PIECE > 0 || tbData[dx].ORDER_PIECE == 0)){
            txt += `                            <tr> \n`;
            txt += `                                <td><input type="checkbox" name="ds_idx" class="checkItem" value="${tbData[dx].ROW_SEQUENCE}"></td> \n`;
            txt += `                                <td> \n`;
            txt += `                                    ${tbData[dx].SUPPLIER_NAME} \n`;
            txt += `                                </td> \n`;
            txt += `                                <td class="text-left"> \n`;
            txt += `                                    <span class="padding-left">[${tbData[dx].GOODS_UNIT_BARCODE}]</span><br> \n`;
            txt += `                                    <span class="padding-left">${tbData[dx].SALES_ITEM_NAME}</span> \n`;
            txt += `                                </td> \n`;
            txt += `                                <td><input type="text" name="ds_Unit_${tbData[dx].ROW_SEQUENCE}" value="${tbData[dx].ORDER_UNIT - tbData[dx].L_ORDER_UNIT}" style="width:40px; text-align:center;" disabled=""><br>(주문량 ${tbData[dx].ORDER_UNIT})</td> \n`;
            txt += `                                <td><input type="text" name="ds_Bundle_${tbData[dx].ROW_SEQUENCE}" value="${tbData[dx].ORDER_BUNDLE - tbData[dx].L_ORDER_BUNDLE}" style="width:40px; text-align:center;" disabled=""><br>(주문량 ${tbData[dx].ORDER_BUNDLE})</td> \n`;
            txt += `                                <td><input type="text" name="ds_Box_${tbData[dx].ROW_SEQUENCE}" value="${tbData[dx].ORDER_BOX - tbData[dx].L_ORDER_BOX}" style="width:40px; text-align:center;"><br>(주문량 ${tbData[dx].ORDER_BOX})</td> \n`;
            txt += `                            </tr>						 \n`;
            d_count ++;
        };
    }
    if(d_count == 0){
        txt += `                            <tr> \n`;
        txt += `                                <td colspan="6">배송 대상 상품이 없습니다.</td> \n`;
        txt += `                            </tr>						 \n`;
    }
    txt += `                        </tbody> \n`;
    txt += `                    </table>			 \n`;
    txt += `                </div>		 \n`;
    txt += `                <!-- 배송 대상 --> \n`;
    txt += `                <!-- 배송 진행--> \n`;
    txt += `                <div class="tab01_cont04" style="position: relative; display: none;">		 \n`;
    txt += `                    <div style="position:absolute; right:0px; top:-5px;"> \n`;
    txt += `                        <button type="button" class="btn_ss01" onclick="btn_delivery_complete();"><span>배송 완료</span></button> \n`;
    txt += `                        <button type="button" class="btn_ss01" onclick="btn_delivery_remove();"><span>배송 취소(삭제)</span></button> \n`;
    txt += `                    </div>	 \n`;
    txt += `                    <div class="pop_s_tit">				 \n`;
    txt += `                        배송 현황 리스트		 \n`;
    txt += `                    </div> \n`;
    txt += `                    <table class="table_col order_goods_list rowspanTbl" id="detailPop_orderDeliveryList"> \n`;
    txt += `                        <colgroup><col width="30"><col width="100"><col width="100"><col width="*"><col width="70"><col width="70"><col width="70"><col width="70"><col width="70"></colgroup> \n`;
    txt += `                        <thead> \n`;
    txt += `                            <tr class="s_th text-center"> \n`;
    txt += `                                <th rowspan="2"><input type="checkbox" class="checkAll" onclick="selectAll(this, 'dn_idx')"></th> \n`;
    txt += `                                <th rowspan="2">택배사<br>송장번호</th> \n`;
    txt += `                                <th rowspan="2">공급사</th> \n`;
    txt += `                                <th rowspan="2">상품명</th> \n`;
    txt += `                                <th colspan="3">수량</th> \n`;
    txt += `                                <th rowspan="2">배송일자</th> \n`;
    txt += `                                <th rowspan="2">완료일자</th> \n`;
    txt += `                            </tr> \n`;
    txt += `                            <tr class="s_th text-center"> \n`;
    txt += `                                <th class="bor_l">낱개</th> \n`;
    txt += `                                <th>볼</th> \n`;
    txt += `                                <th>박스</th> \n`;
    txt += `                            </tr> \n`;
    txt += `                        </thead> \n`;
    txt += `                        <tbody> \n`;

    var cnt = 0;
    for(var ddx=0; ddx<tbLedger.length; ddx++){
        if(tbLedger[ddx].DELIVERY_STATUS == '1' && tbLedger[ddx].LEDGER_STATUS == '1'){
            txt += `                                <tr> \n`;
            txt += `                                    <td><input type="checkbox" name="dn_idx" class="checkItem" value="${tbLedger[ddx].LEDGER_IDX}"></td> \n`;
            txt += `                                    <td>${tbLedger[ddx].DELIVERY_NAME}<br>${tbLedger[ddx].DELIVERY_NO}</td> \n`;
            txt += `                                    <td>${tbLedger[ddx].SUPPLIER_NAME}</td> \n`;
            txt += `                                    <td>${tbLedger[ddx].SALES_ITEM_NAME}</td> \n`;
            txt += `                                    <td>${(tbLedger[ddx].L_ORDER_UNIT).toLocaleString('ko-KR')}<br>(주문량 ${(tbLedger[ddx].ORDER_UNIT).toLocaleString('ko-KR')})</td> \n`;
            txt += `                                    <td>${(tbLedger[ddx].L_ORDER_BUNDLE).toLocaleString('ko-KR')}<br>(주문량 ${(tbLedger[ddx].ORDER_BUNDLE).toLocaleString('ko-KR')})</td> \n`;
            txt += `                                    <td>${(tbLedger[ddx].L_ORDER_BOX).toLocaleString('ko-KR')}<br>(주문량 ${(tbLedger[ddx].ORDER_BOX).toLocaleString('ko-KR')})</td> \n`;
            txt += `                                    <td>${tbLedger[ddx].LEDGER_DATE}</td> \n`;
            if(tbLedger[ddx].ORG_DELIVERY_DT <= tbLedger[ddx].N_DATE)txt += `                                    <td>${tbLedger[ddx].DELIVERY_DT}</td> \n`;
            else txt += `                                    <td></td> \n`;
            txt += `                                </tr> \n`;
            cnt ++;
        }
    }
    if(cnt == 0){
        txt += `                            <tr> \n`;
        txt += `                                <td colspan="9">등록된 배송 진행 내역이 없습니다.</td> \n`;
        txt += `                            </tr> \n`;
    }
    
    txt += `                        </tbody> \n`;
    txt += `                    </table>			 \n`;
    txt += `                </div> \n`;
    txt += `                <!-- 배송 진행--> \n`;
    txt += `                <!-- 취소/환불 관리 --> \n`;
    txt += `                <div class="tab01_cont05" style="display: none;"> \n`;
    txt += `                    <!-- 부분취소 --> \n`;
    txt += `                    <div id="SingleCancelArea" style="display: none;"> \n`;
    //주문상품 정보에서 상품들 중 한개만 선택후에 주문취소/반품을 클릭하는 경우에 생성되는 것이며 후에 add로 해야함
    txt += `                        <div class="pop_s_tit">				 \n`;
    txt += `                            상품 정보	 \n`;
    txt += `                        </div> \n`;
    txt += `                        <table class="table_col order_goods_list" id="detailPop_orderCancelGoods"> \n`;
    txt += `                            <colgroup><col width="100"><col width="*"><col width="70"><col width="80"><col width="80"><col width="80"><col width="80"><col width="80"><col width="70" class="printHide"><col width="*" class="printHide"></colgroup> \n`;
    txt += `                            <thead> \n`;
    txt += `                                <tr class="s_th text-center"> \n`;
    txt += `                                    <th rowspan="2">공급사</th> \n`;
    txt += `                                    <th rowspan="2">상품명<br>[바코드]</th> \n`;
    txt += `                                    <th rowspan="2">판매가(원)</th> \n`;
    txt += `                                    <th colspan="3">수량</th> \n`;
    txt += `                                    <th rowspan="2">입금금액(원)</th> \n`;
    txt += `                                </tr> \n`;
    txt += `                                <tr class="s_th text-center"> \n`;
    txt += `                                    <th class="bor_l">낱개</th> \n`;
    txt += `                                    <th>볼</th> \n`;
    txt += `                                    <th>박스</th> \n`;
    txt += `                                </tr> \n`;
    txt += `                            </thead> \n`;
    txt += `                            <tbody> \n`;
    txt += `                                <tr> \n`;
    txt += `                                    <td class="cancelFld1"></td> \n`;
    txt += `                                    <td class="cancelFld2"></td> \n`;
    txt += `                                    <td class="cancelFld3"></td> \n`;
    txt += `                                    <td class="cancelFld4"></td> \n`;
    txt += `                                    <td class="cancelFld5"></td> \n`;
    txt += `                                    <td class="cancelFld6"></td> \n`;
    txt += `                                    <td class="cancelFld7"></td> \n`;
    txt += `                                </tr> \n`;
    txt += `                            </tbody> \n`;
    txt += `                        </table> \n`;
    txt += `                        <div class="pop_s_tit">				 \n`;
    txt += `                            취소/반품 리스트 \n`;
    txt += `                        </div>				 \n`;
    txt += `                        <table class="table_col order_goods_list" id="detailPop_orderCancelList"> \n`;
    txt += `                            <colgroup><col width="70"><col width="120"><col width="50"><col width="50"><col width="50"><col width="80"><col width="*"><col width="60"></colgroup> \n`;
    txt += `                            <thead> \n`;
    txt += `                                <tr class="s_th text-center"> \n`;
    txt += `                                    <th rowspan="2">구분</th>	 \n`;
    txt += `                                    <th rowspan="2">처리일자</th>						 \n`;
    txt += `                                    <th colspan="3">취소/반품 수량</th> \n`;
    txt += `                                    <th rowspan="2">환불금액</th> \n`;
    txt += `                                    <th rowspan="2">사유</th> \n`;
    txt += `                                    <th rowspan="2">시스템</th> \n`;
    txt += `                                </tr> \n`;
    txt += `                                <tr class="s_th text-center"> \n`;
    txt += `                                    <th class="bor_l">낱개</th> \n`;
    txt += `                                    <th>볼</th> \n`;
    txt += `                                    <th>박스</th> \n`;
    txt += `                                </tr> \n`;
    txt += `                            </thead> \n`;
    txt += `                            <tbody id="cancel_list_area"></tbody> \n`;
    txt += `                            <tfoot>			 \n`;
    txt += `                                <!-- //배송조회있는경우 --> \n`;
    txt += `                                <tr> \n`;
    txt += `                                    <td> \n`;
    txt += `                                        <select name="cancel_status"> \n`;
    txt += `                                            <option value="2">취소</option> \n`;
    txt += `                                            <option value="3">결품</option> \n`;
    txt += `                                            <option value="4">반품</option> \n`;
    txt += `                                            <option value="5">파손</option> \n`;
    txt += `                                        </select> \n`;
    txt += `                                    </td> \n`;
    txt += `                                    <td><input type="text" name="cancel_date" class="w84 datepicker1" value="" id="dp1648429488985"></td> \n`;
    txt += `                                    <td><input type="text" name="cancel_unit" oninput="this.value = this.value.replace(/[^0-9.]/g, '');" style="width:40px; text-align:center;" value="0"></td> \n`;
    txt += `                                    <td><input type="text" name="cancel_bundle" oninput="this.value = this.value.replace(/[^0-9.]/g, '');" style="width:40px; text-align:center;" value="0"></td> \n`;
    txt += `                                    <td><input type="text" name="cancel_box" oninput="this.value = this.value.replace(/[^0-9.]/g, '');" style="width:40px; text-align:center;" value="0"></td> \n`;
    txt += `                                    <td><input type="text" name="cancel_amount" oninput="this.value = this.value.replace(/[^0-9.]/g, '');" style="width:60px; text-align:center;" value="0"></td> \n`;
    txt += `                                    <td><input type="text" name="cancel_msg" style="width:90%;"></td> \n`;
    txt += `                                    <td><button type="button" class="btn_ss01" onclick="btn_cancel_send();"><span>등록</span></button></td> \n`;
    txt += `                                </tr>			 \n`;
    txt += `                            </tfoot> \n`;
    txt += `                        </table>		 \n`;
    //주문상품 정보에서 상품들 중 한개만 선택후에 주문취소/반품을 클릭하는 경우에 생성되는 것이며 후에 add로 해야하는 부분 끝
    txt += `                    </div> \n`;
    txt += `                    <!-- //부분취소 --> \n`;
    txt += `                    <!-- 부분 멀티상품 취소 --> \n`;
    txt += `                    <div id="SingleCancelAreaMulti" style="display: none;"> \n`;
    //주문상품 정보에서 상품들 중 여러개 선택후에 주문취소/반품을 클릭하는 경우 생성되는 것 (FOR문으로)
    // txt += `					<div class="pop_s_tit"> \n`;
    // txt += `						상품 정보	 \n`;
    // txt += `					</div> \n`;
    // txt += `					<table class="table_col order_goods_list" id="detailPop_orderCancelGoods"> \n`;
    // txt += `						<colgroup><col width="100"><col width="*"><col width="70"><col width="80"><col width="80"><col width="80"><col width="80"><col width="80"><col width="70" class="printHide"><col width="*" class="printHide"></colgroup> \n`;
    // txt += `						<thead> \n`;
    // txt += `							<tr class="s_th text-center"> \n`;
    // txt += `								<th rowspan="2">공급사</th> \n`;
    // txt += `								<th rowspan="2">상품명<br>[바코드]</th> \n`;
    // txt += `								<th rowspan="2">판매가(원)</th> \n`;
    // txt += `								<th colspan="3">수량</th> \n`;
    // txt += `								<th rowspan="2">입금금액(원)</th> \n`;
    // txt += `							</tr> \n`;
    // txt += `							<tr class="s_th text-center"> \n`;
    // txt += `								<th class="bor_l">낱개</th> \n`;
    // txt += `								<th>볼</th> \n`;
    // txt += `								<th>박스</th> \n`;
    // txt += `							</tr> \n`;
    // txt += `						</thead> \n`;
    // txt += `						<tbody> \n`;
    // txt += `							<tr> \n`;
    // txt += `								<td class="cancelFld1"> \n`;
    // txt += `									더이음원주센터 \n`;
    // txt += `								</td>	 \n`;
    // txt += `								<td class="cancelFld2">[]<br>★특가★[무배][CJ] 스팸 클래식 200g*6 6개입 &lt;개별바코드 있음&gt;</td> \n`;
    // txt += `								<td class="cancelFld3"><span class="comma">88888888</span></td> \n`;
    // txt += `								<td class="cancelFld4"><span class="comma">0</span></td> \n`;
    // txt += `								<td class="cancelFld5"><span class="comma">0</span></td> \n`;
    // txt += `								<td class="cancelFld6"><span class="comma">2</span><br>(입수량 <span class="comma">1</span>)</td> \n`;
    // txt += `								<td class="cancelFld7" sell_amount="161280"><span class="comma">161,280</span></td> \n`;
    // txt += `							</tr> \n`;
    // txt += `						</tbody> \n`;
    // txt += `					</table> \n`;
    // txt += `					<table class="table_col order_goods_list" id="detailPop_orderCancelList"> \n`;
    // txt += `						<colgroup><col width="70"><col width="120"><col width="50"><col width="50"><col width="50"><col width="80"><col width="*"><col width="60"></colgroup> \n`;
    // txt += `						<thead> \n`;
    // txt += `							<tr class="s_th text-center"> \n`;
    // txt += `								<th rowspan="2">구분</th>	 \n`;
    // txt += `								<th rowspan="2">처리일자</th> \n`;
    // txt += `								<th colspan="3">취소/반품 수량</th> \n`;
    // txt += `								<th rowspan="2">환불금액</th> \n`;
    // txt += `								<th rowspan="2">사유</th> \n`;
    // txt += `								<th rowspan="2">시스템</th> \n`;
    // txt += `							</tr> \n`;
    // txt += `							<tr class="s_th text-center"> \n`;
    // txt += `								<th class="bor_l">낱개</th> \n`;
    // txt += `								<th>볼</th> \n`;
    // txt += `								<th>박스</th> \n`;
    // txt += `							</tr> \n`;
    // txt += `						</thead> \n`;
    // txt += `						 \n`;
    // txt += `						<tbody id="cancel_list_area_multi"> \n`;
    // txt += `							 \n`;
    // txt += `						</tbody> \n`;
    // txt += `						<tfoot>			 \n`;
    // txt += `							<!-- //배송조회있는경우 --> \n`;
    // txt += `							<tr> \n`;
    // txt += `								<td> \n`;
    // txt += `									<select name="cancel_status2132634"> \n`;
    // txt += `										<option value="2">취소</option> \n`;
    // txt += `										<option value="3">결품</option> \n`;
    // txt += `										<option value="4">반품</option> \n`;
    // txt += `										<option value="5">파손</option> \n`;
    // txt += `									</select> \n`;
    // txt += `								</td> \n`;
    // txt += `								<td><input type="text" name="cancel_date2132634" class="w84 datepicker1 hasDatepicker" value="2022-04-07" id="dp1649292641945"><img class="ui-datepicker-trigger" src="/resources/images/common/calendar.png" alt="..." title="..."></td> \n`;
    // txt += `								<td><input type="text" name="cancel_unit2132634" style="width:40px; text-align:center;" value="0"></td> \n`;
    // txt += `								<td><input type="text" name="cancel_bundle2132634" style="width:40px; text-align:center;" value="0"></td> \n`;
    // txt += `								<td><input type="text" name="cancel_box2132634" style="width:40px; text-align:center;" value="0"></td> \n`;
    // txt += `								<td><input type="text" name="cancel_amount2132634" style="width:60px; text-align:center;" value="0"></td> \n`;
    // txt += `								<td><input type="text" name="cancel_msg2132634" style="width:90%;"></td> \n`;
    // txt += `								<td><button type="button" class="btn_ss01" onclick="btn_cancel_send_multi('2132634');"><span>등록</span></button></td> \n`;
    // txt += `							</tr>			 \n`;
    // txt += `						</tfoot> \n`;
    // txt += `					</table>					 \n`;
    //주문상품 정보에서 상품들 중 여러개 선택후에 주문취소/반품을 클릭하는 경우 생성되는 것 끝
    txt += `                    </div> \n`;
    txt += `                    <!-- //부분 멀티상품 취소 -->		 \n`;
    txt += `                    <!-- 일괄취소 --> \n`;
    txt += `                    <div id="MultiCancelArea">			 \n`;
    txt += `                        <div class="pop_s_tit">				 \n`;
    txt += `                            취소/반품 일괄 입력 \n`;
    txt += `                        </div>			 \n`;
    txt += `                        <table class="table_col order_goods_list" id="detailPop_orderCancelList"> \n`;
    txt += `                            <colgroup><col width="120"><col width="150"><col width="*"><col width="60"></colgroup> \n`;
    txt += `                            <thead> \n`;
    txt += `                                <tr class="s_th text-center"> \n`;
    txt += `                                    <th>구분</th>	 \n`;
    txt += `                                    <th>처리일자</th>	 \n`;
    txt += `                                    <th>사유</th> \n`;
    txt += `                                    <th>시스템</th> \n`;
    txt += `                                </tr> \n`;
    txt += `                            </thead> \n`;
    txt += `                            <tbody>					 \n`;
    txt += `                                <tr> \n`;
    txt += `                                    <td> \n`;
    txt += `                                        <select name="multi_cancel_status" style="width:100px;"> \n`;
    txt += `                                            <option value="2">취소</option> \n`;
    txt += `                                            <option value="3">결품</option> \n`;
    txt += `                                            <option value="4">반품</option> \n`;
    txt += `                                            <option value="5">파손</option> \n`;
    txt += `                                        </select> \n`;
    txt += `                                    </td> \n`;
    txt += `                                    <td><input type="text" name="multi_cancel_date" class="w84 datepicker1" value="" id="dp1648429488986"></td>						 \n`;
    txt += `                                    <td><input type="text" name="multi_cancel_msg" style="width:90%;"></td> \n`;
    txt += `                                    <td><button type="button" class="btn_ss01" onclick="btn_multi_cancel_send();"><span>등록</span></button></td> \n`;
    txt += `                                </tr>			 \n`;
    txt += `                            </tbody> \n`;
    txt += `                        </table> \n`;
    txt += `                        <div class="pop_s_tit">				 \n`;
    txt += `                            취소/반품 상품 선택 \n`;
    txt += `                        </div> \n`;
    txt += `                        <table class="table_col order_goods_list" id="detailPop_orderCancelList"> \n`;
    txt += `                            <colgroup><col width="30"><col width="100"><col width="*"><col width="70"><col width="80"><col width="80"><col width="80"><col width="80"><col width="80"><col width="70" class="printHide"><col width="*" class="printHide"></colgroup> \n`;
    txt += `                            <thead> \n`;
    txt += `                                <tr class="s_th text-center"> \n`;
    txt += `                                    <th rowspan="2"><input type="checkbox" class="checkAll" checked="checked" onclick="selectAll(this, 'mc_idx')"></th> \n`;
    txt += `                                    <th rowspan="2">공급사</th> \n`;
    txt += `                                    <th rowspan="2">상품명<br>[바코드]</th> \n`;
    txt += `                                    <th rowspan="2">판매가(원)</th> \n`;
    txt += `                                    <th colspan="3">수량</th> \n`;
    txt += `                                    <th rowspan="2">입금금액(원)</th> \n`;
    txt += `                                </tr> \n`;
    txt += `                                <tr class="s_th text-center"> \n`;
    txt += `                                    <th class="bor_l">낱개</th> \n`;
    txt += `                                    <th>볼</th> \n`;
    txt += `                                    <th>박스</th> \n`;
    txt += `                                </tr> \n`;
    txt += `                            </thead> \n`;
    txt += `                            <tbody> \n`;
    for(var cx=0; cx<tbData.length; cx++){
        //if(tbData[cx].SUM_COUNT == null || tbData[cx].SUM_COUNT > 0){
        //if(tbData[cx].LEDGER_STATUS != "2" && tbData[cx].LEDGER_STATUS != "3" && tbData[cx].LEDGER_STATUS != "4" && tbData[cx].LEDGER_STATUS != "5"){
            txt += `                                <tr> \n`;
            txt += `                                    <td><input type="checkbox" name="mc_idx" class="checkItem" value="${tbData[cx].ROW_SEQUENCE}" checked="checked"></td>									 \n`;
            txt += `                                    <td>${tbData[cx].SUPPLIER_NAME}</td> \n`;
            txt += `                                    <td>[${tbData[cx].GOODS_UNIT_BARCODE}]<br>${tbData[cx].SALES_ITEM_NAME}</td> \n`;
            txt += `                                    <td><span class="comma">${(tbData[cx].SALES_ITEM_PRICE).toLocaleString('ko-KR')}</span></td> \n`;
            txt += `                                    <td><span class="comma">${(tbData[cx].ORDER_UNIT - tbData[cx].L_ORDER_UNIT).toLocaleString('ko-KR')}</span></td> \n`;
            txt += `                                    <td><span class="comma">${(tbData[cx].ORDER_BUNDLE - tbData[cx].L_ORDER_BUNDLE).toLocaleString('ko-KR')}</span></td> \n`;
            txt += `                                    <td><span class="comma">${(tbData[cx].ORDER_BOX - tbData[cx].L_ORDER_BOX).toLocaleString('ko-KR')}</span><br>(입수량 <span class="comma">${(tbData[cx].PIECE_BOX).toLocaleString('ko-KR')}</span>)</td> \n`;
            txt += `                                    <td><span class="comma">${(tbData[cx].SALES_ITEM_PRICE*(tbData[cx].ORDER_PIECE)-tbData[cx].SUM_AMOUNT).toLocaleString('ko-KR')}</span></td>		 \n`;
            txt += `                                </tr>		 \n`;
        //}
    }
    txt += `                            </tbody> \n`;
    txt += `                        </table>						 \n`;
    txt += `                    </div> \n`;
    txt += `                    <!-- //일괄취소 -->		 \n`;
    txt += `                </div> \n`;
    txt += `                <!-- 주문 수정 --> \n`;
    txt += `                <div class="tab01_cont06" style="position:relative; display:none;"> \n`;
    txt += `                    <div style="position:absolute; right:0px; top:-5px;"> \n`;
    txt += `                        <button type="button" class="btn_ss01" onclick="btn_allCancel();"><span class="btn_cancel">전체 주문 삭제</span></button> \n`;
    txt += `                        <button type="button" class="btn_ss01" onclick="btn_rePayment();"><span class="btn_repayment">저장 및 가상계좌 재발급</span></button> \n`;
    txt += `                    </div> \n`;
    txt += `                    <div class="pop_s_tit">				 \n`;
    txt += `                        주문 수정 리스트 \n`;
    txt += `                    </div> \n`;
    txt += `                    <table class="table_col order_goods_list numGroup" id="detailPop_reorderList"> \n`;
    txt += `                        <colgroup><col width="30"><col width="100"><col width="*"><col width="70"><col width="80"><col width="80"><col width="80"><col width="80"><col width="80"><col width="70" class="printHide"><col width="*" class="printHide"><col width="40" class="printHide"></colgroup> \n`;
    txt += `                        <thead> \n`;
    txt += `                            <tr class="s_th text-center"> \n`;
    txt += `                                <th rowspan="2">No</th> \n`;
    txt += `                                <th rowspan="2">공급사</th> \n`;
    txt += `                                <th rowspan="2">상품명<br>[바코드]</th> \n`;
    txt += `                                <th rowspan="2">판매가(원)</th> \n`;
    txt += `                                <th colspan="3">수량</th> \n`;
    txt += `                                <th rowspan="2">입금금액(원)</th> \n`;
    txt += `                                <th rowspan="2">기능</th> \n`;
    txt += `                            </tr> \n`;
    txt += `                            <tr class="s_th text-center"> \n`;
    txt += `                                <th class="bor_l">낱개</th> \n`;
    txt += `                                <th>볼</th> \n`;
    txt += `                                <th>박스</th> \n`;
    txt += `                            </tr> \n`;
    txt += `                        </thead> \n`;
    txt += `                        <tbody> \n`;
    for(var ex=0; ex<tbData.length; ex++){
        txt += `                            <tr> \n`;
        txt += `                                <td class="NumAsc">${ex+1}</td>									 \n`;
        txt += `                                <td> \n`;
        txt += `                                    ${tbData[ex].SUPPLIER_NAME} \n`;
        txt += `                                </td>	 \n`;
        txt += `                                <td>[${tbData[ex].GOODS_UNIT_BARCODE}]<br>${tbData[ex].SALES_ITEM_NAME}</td> \n`;
        txt += `                                <td><span class="comma rol_sell_price">${(tbData[ex].SALES_ITEM_PRICE).toLocaleString('ko-KR')}</span></td> \n`;
        txt += `                                <td> \n`;
        txt += `                                    <input type="text" name="rol_Unit_${tbData[ex].ROW_SEQUENCE}" value="${(tbData[ex].ORDER_UNIT).toLocaleString('ko-KR')}" class="rol_Unit_cnt" style="width:40px; text-align:center;" onchange="changeOrderCnt(this)" `; if(tbData[ex].ORDER_UNIT == 0) txt +=`disabled=""`; txt+=` > \n`;
        txt += `                                    <br>(입수량 <span class="comma rol_Unit_piece">${(tbData[ex].PIECE_UNIT).toLocaleString('ko-KR')}</span>)									 \n`;
        txt += `                                </td> \n`;txt += `                                <td> \n`;
        txt += `                                    <input type="text" name="rol_Bundle_${tbData[ex].ROW_SEQUENCE}" value="${(tbData[ex].ORDER_BUNDLE).toLocaleString('ko-KR')}" class="rol_Bundle_cnt" style="width:40px; text-align:center;" onchange="changeOrderCnt(this)" `; if(tbData[ex].ORDER_BUNDLE == 0) txt +=`disabled=""`; txt+=`> \n`;
        txt += `                                    <br>(입수량 <span class="comma rol_Bundle_piece">${(tbData[ex].PIECE_BUNDLE).toLocaleString('ko-KR')}</span>)</td> \n`;
        txt += `                                <td> \n`;
        txt += `                                    <input type="text" name="rol_Box_${tbData[ex].ROW_SEQUENCE}" value="${(tbData[ex].ORDER_BOX).toLocaleString('ko-KR')}" class="rol_Box_cnt" style="width:40px; text-align:center;" onchange="changeOrderCnt(this)" `; if(tbData[ex].ORDER_BOX == 0) txt +=`disabled=""`; txt+=`> \n`;
        txt += `                                    <br>(입수량 <span class="comma rol_Box_piece">${(tbData[ex].PIECE_BOX).toLocaleString('ko-KR')}</span>)</td> \n`;
        txt += `                                <td><span class="comma detailPop_goods_reorder_amount">${(tbData[ex].SALES_ITEM_PRICE*(tbData[ex].ORDER_PIECE)-tbData[ex].SUM_AMOUNT).toLocaleString('ko-KR')}</span></td> \n`;
        txt += `                                <td> \n`;
        txt += `                                    <button type="button" class="btn_ss01 detailPop_goods_reorder_deleteBtn" onclick="btn_goodsCancel('${tbData[ex].ROW_SEQUENCE}');"><span>주문삭제</span></button> \n`;
        txt += `                                    <input type="hidden" name="rol_idx" value="${tbData[ex].ROW_SEQUENCE}"> \n`;
        txt += `                                </td> \n`;
        txt += `                            </tr>		 \n`;
    }
    txt += `                        </tbody> \n`;
    txt += `                    </table> \n`;
    txt += `                    <p class="order_total">총 입금 금액(원) : <span id="detailPop_total_reorder_amount">${(tbData[0].PAYMENT_SUM).toLocaleString('ko-KR')}</span></p>			 \n`;
    txt += `                </div> \n`;
    txt += `            </div>	 \n`;
    txt += `            <div class="pop_close"> \n`;
    txt += `                <a href="javascript:btn_parentpage_refresh();removeLayerPop();"><img src="/resources/images/admin/btn_pop_close01.gif" alt="닫기"></a> \n`;
    txt += `            </div> \n`;
    txt += `        </div> \n`;
    txt += `        </form> \n`;
    txt += `    <!-- //상품 정보 --> \n`;
    txt += `		<script> \n`;
    txt += `			$(".tab01 li").on("click",function (){ \n`;
    txt += `			    changeTabClass(this); \n`;
    txt += `			}); \n`;
    txt += `		</script> \n`;
    txt += `        </div> \n`;
	
   	$(".layerPopArea").html(txt);
	
    $(".rol_Unit_cnt").keyup(function(){
        var inputVal = $(this).val();
        $(this).val(inputVal.replace(/[^0-9]/gi, ""));
    });

    $(".rol_Bundle_cnt").keyup(function(){
        var inputVal = $(this).val();
        $(this).val(inputVal.replace(/[^0-9]/gi, ""));
    });

    $(".rol_Box_cnt").keyup(function(){
        var inputVal = $(this).val();
        $(this).val(inputVal.replace(/[^0-9]/gi, ""));
    });

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

    $('input[name="delivery_date"]').datepicker();
    $('input[name="cancel_date"]').datepicker();
    $('input[name="multi_cancel_date"]').datepicker();

    $('input[name="delivery_date"]').datepicker("setDate", "today");
    $('input[name="cancel_date"]').datepicker("setDate", "today");
    $('input[name="multi_cancel_date"]').datepicker("setDate", "today");

    $('select[name=receiver_tel1]').val(tbData[0].RECEIVER_TEL.split('-')[0]);
    $('select[name=receiver_mobile1]').val(tbData[0].RECEIVER_MOBILE.split('-')[0]);
    
    $(".layerPopArea").css("display" ,"block");

    if(gGoodsIDArr != "" && gGoodsIDArr != undefined){
        var checkboxes = $("input[name=gidx]");
        checkboxes.each(function(index, checkbox){
            for(var gx=0; gx<gGoodsIDArr.length; gx++){
                if(checkbox.value == gGoodsIDArr[gx]){
                    console.log("checkbox", checkbox);
                    $(`input:checkbox[value="${gGoodsIDArr[gx]}"]`).prop("checked", true);
                }
            };
        });
        //btn_goods_cancel();
    };
    if(pTabClassName!=undefined && pTabClassName != "")changeTabClass($("." + pTabClassName));
};

async function getOrderDetailinfo(pOrderID){
	var rtnreturnvalue;
	$.ajax({
		url: "/uGetOrderDetail?"  + $.param({"searchCondition" : {"orderID" : pOrderID, "GB" : $("#layoutGB").val(), "search_supplier_ssn" : $("#search_supplier_ssn").val()}}),
		type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success: function(response){
			if(response.errorcode == "PFERR_CONF_0000"){
				rtnreturnvalue = response
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
function changeTabClass(pthis){
    var sLiArray = $(".tab01 li");
    var $class = $(pthis).attr("class");
    for(var lx=0; lx<sLiArray.length; lx++){
        sLiArray[lx].className = sLiArray[lx].classList[0];
        $(".tab01_cont"+sLiArray[lx].className.substr(6,2)).css("display", "none");
    }
    $(".tab01_cont" + $class.substr(6,2)).css("display", "block");
    if($class == "tab01_05"){
        var checked_index = new Array();
        var tr_array = new Array();
        var tr;
        var checkboxes = $("input[name=gidx]:checked");

        checkboxes.each(function(index, checkbox){
            checked_index.push(checkbox.value);
            tr = checkboxes.parent().parent().eq(index);
            tr_array.push(tr);
        });

        drawCancleList(checked_index, tr_array);
    };
    
    $(pthis).addClass("on");
}

function btn_goods_cancel(){

    var checked_index = new Array();
    var tr_array = new Array();
    var tr;
    var checkboxes = $("input[name=gidx]:checked");
    var status;

    checkboxes.each(function(index, checkbox){
        checked_index.push(checkbox.value);
        tr = checkboxes.parent().parent().eq(index);
        status = checkboxes.parent().parent().children()[9].innerText;
        tr_array.push(tr);
    });
    var sLiArray = $(".tab01 li");

    sLiArray[0].className = sLiArray[0].classList[0];
    sLiArray[1].className = sLiArray[1].classList[0];
    sLiArray[2].className = sLiArray[2].classList[0];
    sLiArray[3].className = sLiArray[3].classList[0];
    sLiArray[4].className = sLiArray[4].classList[0];

    $(".tab01_cont"+sLiArray[0].className.substr(6,2)).css("display", "none");
    $(".tab01_cont"+sLiArray[1].className.substr(6,2)).css("display", "none");
    $(".tab01_cont"+sLiArray[2].className.substr(6,2)).css("display", "none");
    $(".tab01_cont"+sLiArray[3].className.substr(6,2)).css("display", "none");
    $(".tab01_cont"+sLiArray[4].className.substr(6,2)).css("display", "none");
    
    $(".tab01_cont05").css("display", "block");
    $(".tab01_05").addClass("on");

    drawCancleList(checked_index, tr_array);
};

function drawCancleList(pcheckedIndex, ptrArray){
    //주문취소는 주문상품정보에서 선택하는 row의 갯수에 따라 그려지는것이 다르다.
    //껍데기는 그려져 있기때문에 display css를 바꾸어가면서 바꿔주는 방식으로 함.
    console.log(gLedger);
    console.log(pcheckedIndex);
    if(pcheckedIndex.length == 1){
        var tb = document.getElementById("detailPop_orderCancelGoods").children[2];
        tb.innerHTML = "";
        var td;
        var newRow;
        var cell;
        td = ptrArray[0].children();
        //tbody찾기
        newRow = tb.insertRow();

        var tf = document.getElementById("detailPop_orderCancelList").children[2];
        var txt = "";
        for(var gx=0; gx<gLedger.length; gx++){
            if(gLedger[gx].ROW_SEQUENCE == pcheckedIndex && gLedger[gx].LEDGER_AMOUNT>0){ 

                txt += `<tr> \n`;

                if(gLedger[gx].LEDGER_STATUS== "2") txt += `	<td>취소</td> \n`;
                else if(gLedger[gx].LEDGER_STATUS== "3") txt += `	<td>결품</td> \n`;
                else if(gLedger[gx].LEDGER_STATUS== "4") txt += `	<td>반품</td> \n`;
                else if(gLedger[gx].LEDGER_STATUS== "5") txt += `	<td>파손</td> \n`;
                
                txt += `	<td>${gLedger[gx].LEDGER_DATE}</td> \n`;
                txt += `	<td>${(gLedger[gx].L_ORDER_UNIT*1).toLocaleString("ko-KR")}</td> \n`;
                txt += `	<td>${(gLedger[gx].L_ORDER_BUNDLE*1).toLocaleString("ko-KR")}</td> \n`;
                txt += `	<td>${(gLedger[gx].L_ORDER_BOX*1).toLocaleString("ko-KR")}</td> \n`;
                txt += `	<td><span class="comma">${(gLedger[gx].LEDGER_AMOUNT).toLocaleString("ko-KR")}</span></td> \n`;
                txt += `	<td>${gLedger[gx].LEDGER_MSG}</td> \n`;
                txt += `	<td><button type="button" class="btn_ss01" onclick="btn_cancel_delete('${gLedger[gx].LEDGER_IDX}');"><span>삭제</span></button></td> \n`;
                txt += `</tr> \n`;
            };
        };

        if(txt.length > 0){
            tf.innerHTML = txt;
        };

        for(var tx=0; tx<td.length; tx++){
            if(td[tx].className.substr(0,9) == "cancelFld"){
                cell = newRow.insertCell(tx-2);
                cell.className = td[tx].className;
                cell.innerHTML = td[tx].innerHTML;
            }
        }
        $('#SingleCancelArea').css("display", "block");
        $('#SingleCancelAreaMulti').css("display", "none");
        $('#MultiCancelArea').css("display", "none");
    }
    else if(pcheckedIndex.length > 1){
        document.getElementById("SingleCancelAreaMulti").innerHTML = "";
        var multitxt = "";
        for(var cx=0; cx<pcheckedIndex.length; cx++){
            td = ptrArray[cx].children();
            multitxt += `					<div class="pop_s_tit"> \n`;
            multitxt += `						상품 정보	 \n`;
            multitxt += `					</div> \n`;
            multitxt += `					<table class="table_col order_goods_list" id="detailPop_orderCancelGoods"> \n`;
            multitxt += `						<colgroup><col width="100"><col width="*"><col width="70"><col width="80"><col width="80"><col width="80"><col width="80"><col width="80"><col width="70" class="printHide"><col width="*" class="printHide"></colgroup> \n`;
            multitxt += `						<thead> \n`;
            multitxt += `							<tr class="s_th text-center"> \n`;
            multitxt += `								<th rowspan="2">공급사</th> \n`;
            multitxt += `								<th rowspan="2">상품명<br>[바코드]</th> \n`;
            multitxt += `								<th rowspan="2">판매가(원)</th> \n`;
            multitxt += `								<th colspan="3">수량</th> \n`;
            multitxt += `								<th rowspan="2">입금금액(원)</th> \n`;
            multitxt += `							</tr> \n`;
            multitxt += `							<tr class="s_th text-center"> \n`;
            multitxt += `								<th class="bor_l">낱개</th> \n`;
            multitxt += `								<th>볼</th> \n`;
            multitxt += `								<th>박스</th> \n`;
            multitxt += `							</tr> \n`;
            multitxt += `						</thead> \n`;
            multitxt += `						<tbody> \n`;
            multitxt += `							<tr> \n`;
            multitxt += `								<td class="cancelFld1"> \n`;
            multitxt += `									${td[2].innerHTML} \n`;
            multitxt += `								</td>	 \n`;
            multitxt += `								<td class="cancelFld2">${td[3].innerHTML}</td> \n`;
            multitxt += `								<td class="cancelFld3">${td[4].innerHTML}</td> \n`;
            multitxt += `								<td class="cancelFld4">${td[5].innerHTML}</td> \n`;
            multitxt += `								<td class="cancelFld5">${td[6].innerHTML}</td> \n`;
            multitxt += `								<td class="cancelFld6">${td[7].innerHTML}</td> \n`;
            multitxt += `								<td class="cancelFld7" sell_amount="${td[8].innerText}">${td[8].innerHTML}</td> \n`;
            multitxt += `							</tr> \n`;
            multitxt += `						</tbody> \n`;
            multitxt += `					</table> \n`;
            multitxt += `					<table class="table_col order_goods_list" id="detailPop_orderCancelList"> \n`;
            multitxt += `						<colgroup><col width="70"><col width="120"><col width="50"><col width="50"><col width="50"><col width="80"><col width="*"><col width="60"></colgroup> \n`;
            multitxt += `						<thead> \n`;
            multitxt += `							<tr class="s_th text-center"> \n`;
            multitxt += `								<th rowspan="2">구분</th>	 \n`;
            multitxt += `								<th rowspan="2">처리일자</th> \n`;
            multitxt += `								<th colspan="3">취소/반품 수량</th> \n`;
            multitxt += `								<th rowspan="2">환불금액</th> \n`;
            multitxt += `								<th rowspan="2">사유</th> \n`;
            multitxt += `								<th rowspan="2">시스템</th> \n`;
            multitxt += `							</tr> \n`;
            multitxt += `							<tr class="s_th text-center"> \n`;
            multitxt += `								<th class="bor_l">낱개</th> \n`;
            multitxt += `								<th>볼</th> \n`;
            multitxt += `								<th>박스</th> \n`;
            multitxt += `							</tr> \n`;
            multitxt += `						</thead> \n`;
            multitxt += `						 \n`;
            multitxt += `						<tbody id="cancel_list_area_multi"> \n`;
            for(var gx=0; gx<gLedger.length; gx++){
                if(gLedger[gx].ROW_SEQUENCE == pcheckedIndex[cx] && gLedger[gx].LEDGER_AMOUNT>0){ 
                    
                    multitxt += `<tr> \n`;
                    if(gLedger[gx].LEDGER_STATUS== "2") multitxt += `	<td>취소</td> \n`;
                    else if(gLedger[gx].LEDGER_STATUS== "3") multitxt += `	<td>결품</td> \n`;
                    else if(gLedger[gx].LEDGER_STATUS== "4") multitxt += `	<td>반품</td> \n`;
                    else if(gLedger[gx].LEDGER_STATUS== "5") multitxt += `	<td>파손</td> \n`;
                    multitxt += `	<td>${gLedger[gx].LEDGER_DATE}</td> \n`;
                    multitxt += `	<td>${(gLedger[gx].L_ORDER_UNIT*1).toLocaleString("ko-KR")}</td> \n`;
                    multitxt += `	<td>${(gLedger[gx].L_ORDER_BUNDLE*1).toLocaleString("ko-KR")}</td> \n`;
                    multitxt += `	<td>${(gLedger[gx].L_ORDER_BOX*1).toLocaleString("ko-KR")}</td> \n`;
                    multitxt += `	<td><span class="comma">${(gLedger[gx].LEDGER_AMOUNT).toLocaleString("ko-KR")}</span></td> \n`;
                    multitxt += `	<td>${gLedger[gx].LEDGER_MSG}</td> \n`;
                    multitxt += `	<td><button type="button" class="btn_ss01" onclick="btn_cancel_delete('${gLedger[gx].LEDGER_IDX}');"><span>삭제</span></button></td> \n`;
                    multitxt += `</tr> \n`;
                };
            };
            multitxt += `						</tbody> \n`;
            multitxt += `						<tfoot>			 \n`;
            multitxt += `							<!-- //배송조회있는경우 --> \n`;
            multitxt += `							<tr> \n`;
            multitxt += `								<td> \n`;
            multitxt += `									<select name="cancel_status${td[0].children[0].value}"> \n`;
            multitxt += `										<option value="2">취소</option> \n`;
            multitxt += `										<option value="3">결품</option> \n`;
            multitxt += `										<option value="4">반품</option> \n`;
            multitxt += `										<option value="5">파손</option> \n`;
            multitxt += `									</select> \n`;
            multitxt += `								</td> \n`;
            multitxt += `								<td><input type="text" name="cancel_date${td[0].children[0].value}" class="w84 datepicker1" value="" id="dp1649292641945"></td> \n`;
            multitxt += `								<td><input type="text" name="cancel_unit${td[0].children[0].value}" oninput="this.value = this.value.replace(/[^0-9.]/g, '');" style="width:40px; text-align:center;" value="0"></td> \n`;
            multitxt += `								<td><input type="text" name="cancel_bundle${td[0].children[0].value}" oninput="this.value = this.value.replace(/[^0-9.]/g, '');" style="width:40px; text-align:center;" value="0"></td> \n`;
            multitxt += `								<td><input type="text" name="cancel_box${td[0].children[0].value}" oninput="this.value = this.value.replace(/[^0-9.]/g, '');" style="width:40px; text-align:center;" value="0"></td> \n`;
            multitxt += `								<td><input type="text" name="cancel_amount${td[0].children[0].value}" oninput="this.value = this.value.replace(/[^0-9.]/g, '');" style="width:60px; text-align:center;" value="0"></td> \n`;
            multitxt += `								<td><input type="text" name="cancel_msg${td[0].children[0].value}" style="width:90%;"></td> \n`;
            multitxt += `								<td><button type="button" class="btn_ss01" onclick="btn_cancel_send_multi('${td[0].children[0].value}');"><span>등록</span></button></td> \n`;
            multitxt += `							</tr>			 \n`;
            multitxt += `						</tfoot> \n`;
            multitxt += `					</table>					 \n`;
            
            document.getElementById("SingleCancelAreaMulti").innerHTML += multitxt;

            multitxt = "";
        };

        for(var dx=0; dx<ptrArray.length; dx++){
            //innerHTML로 하면 2번째가 생성될때 처음에 생성된 것에 붙은 이벤트가 사라지기때문에 for문이 끝났을때 새롭게 이벤트를 매달아야 한다.
            $(`input[name="cancel_date${ptrArray[dx].children()[0].children[0].value}"]`).datepicker();
            $(`input[name="cancel_date${ptrArray[dx].children()[0].children[0].value}"]`).datepicker("setDate", "today");
        };
        
        $('#SingleCancelArea').css("display", "none");
        $('#SingleCancelAreaMulti').css("display", "block");
        $('#MultiCancelArea').css("display", "none");
    }
    else{
        //선택한것이 없을때는 전체를 보여주는 default모드임.
        $('#SingleCancelArea').css("display", "none");
        $('#SingleCancelAreaMulti').css("display", "none");
        $('#MultiCancelArea').css("display", "block");
    }
};

async function btn_delivery_gb(pStatus){
    //주문상품정보 탭에 있는 배송준비중이나 배송준비중 취소 버튼
    var checked_index = new Array();
    var status_array = new Array();
    var status;
    var price = 0;
    var checkboxes = $("input[name=gidx]:checked");
    var tf;

    checkboxes.each(function(index, checkbox){
        checked_index.push(checkbox.value);
        status = checkboxes.parent().parent().children()[9].innerText;
        price = Number((checkboxes.parent().parent().children()[8].innerText).replace(/,/g, ""));
        if(pStatus == "1" && price <=0 ){
            tf = false;
        }
        else if(pStatus == "0" && status != "배송준비중"){
            tf = false;
        }
        status_array.push(status);
    });

    if(checked_index.length < 1){
        alert("한개 이상 선택 후에 실행이 가능합니다.");
        return;
    };

    if(tf == false){
        alert("선택된 값이 잘못되었습니다.");
        return;
    };
    var editDataSetJson = new Object();
    editDataSetJson = {"editType" : "DELIVERY_READY", "setConditionIndex" : checked_index, "setStatus" : pStatus};
    var rtnValue = await callEditOrderAjaxCommon(editDataSetJson);

    if(rtnValue == "PFERR_CONF_0000"){
        alert("정상적으로 수정되었습니다.");
        drawOrderListPop(gOrderID);
    }
};

async function btn_reciver_edit(){
    //입금,배송정보 탭에 있는 수정버튼
    var editDataSetJson = new Object();
    editDataSetJson = {"editType" : "RECIVER_EDIT"
                     , "orderID" : $("#order_idx").val()
                     , "reveiver_name" : $("input[name=reveiver_name]").val()
                     , "receiver_tel" : $("select[name=receiver_tel1]").val() + "-" + $("input[name=receiver_tel2]").val() + "-" + $("input[name=receiver_tel3]").val()
                     , "receiver_mobile" : $("select[name=receiver_mobile1]").val() + "-" + $("input[name=receiver_mobile2]").val() + "-" + $("input[name=receiver_mobile3]").val()
                     , "receiver_zipcode" : $("input[name=receiver_zipcode]").val()
                     , "receiver_addr1" : $("input[name=receiver_addr1]").val()
                     , "receiver_addr2" : $("input[name=receiver_addr2]").val()
                     , "receiver_delivery_demand" : $("input[name=receiver_delivery_demand]").val()};
    var rtnValue = await callEditOrderAjaxCommon(editDataSetJson);

    if(rtnValue == "PFERR_CONF_0000"){
        alert("정상적으로 수정되었습니다.");
        drawOrderListPop(gOrderID);
    }
};

async function btn_delivery_send(){
    //배송대상 탭에 있는 저장버튼
    if($("#delivery_name").val() == ""){
        alert("택배사를 선택하여야합니다.");
        return;
    };
    if($("#delivery_no").val() == ""){
        alert("송장번호를 입력해야합니다.");
        return;
    };
    var checked_edit_set_array = new Array();
    var checked_edit_set = new Object();
    var checkboxes = $("input[name=ds_idx]:checked");
    checkboxes.each(function(index, checkbox){
        checked_edit_set = {"checked_index" : checkbox.value
                           ,"order_unit" : $("input[name=ds_Unit_" + checkbox.value + "]").val()
                           ,"order_bundle" : $("input[name=ds_Bundle_" + checkbox.value + "]").val()
                           ,"order_box" : $("input[name=ds_Box_" + checkbox.value + "]").val()};
        checked_edit_set_array.push(checked_edit_set);
    });

    if(checked_edit_set_array.length < 1){
        alert("한개 이상 선택 후에 실행이 가능합니다.");
        return;
    }
    var editDataSetJson = new Object();
    editDataSetJson = {"editType" : "DELIVERY_DOING"
                      ,"setConditionIndex" : checked_edit_set_array
                      ,"orderID" : $("#order_idx").val()
                      ,"delivery_date" : $("#delivery_date").val().replaceAll("-", "")
                      ,"delivery_name" : $("#delivery_name").val()
                      ,"delivery_no" : $("#delivery_no").val()};
    console.log("editDataSetJson", editDataSetJson);
    var rtnValue = await callEditOrderAjaxCommon(editDataSetJson);

    if(rtnValue == "PFERR_CONF_0000"){
        alert("정상적으로 수정되었습니다.");
        drawOrderListPop(gOrderID, "tab01_03");
    };
};

async function btn_delivery_complete(){
    //배송완료버튼
    var checked_index = new Array();
    var checkboxes = $("input[name=dn_idx]:checked");

    checkboxes.each(function(index, checkbox){
        checked_index.push(checkbox.value);
    });

    if(checked_index.length < 1){
        alert("한개 이상 선택 후에 실행이 가능합니다.");
        return;
    };

    var editDataSetJson = new Object();
    editDataSetJson = {"editType" : "DELIVERY_COMPLETE", "setConditionIndex" : checked_index};
    var rtnValue = await callEditOrderAjaxCommon(editDataSetJson);

    if(rtnValue == "PFERR_CONF_0000"){
        alert("정상적으로 수정되었습니다.");
        drawOrderListPop(gOrderID, "tab01_04");
    }
};

async function btn_delivery_remove(){
    //배송취소(삭제)버튼
    var checked_index = new Array();
    var checkboxes = $("input[name=dn_idx]:checked");

    checkboxes.each(function(index, checkbox){
        checked_index.push(checkbox.value);
    });

    if(checked_index.length < 1){
        alert("한개 이상 선택 후에 실행이 가능합니다.");
        return;
    };

    var editDataSetJson = new Object();
    editDataSetJson = {"editType" : "DELIVERY_DELETE", "setConditionIndex" : checked_index};
    var rtnValue = await callEditOrderAjaxCommon(editDataSetJson);

    if(rtnValue == "PFERR_CONF_0000"){
        alert("정상적으로 수정되었습니다.");
        drawOrderListPop(gOrderID, "tab01_04");
    }
};

async function btn_cancel_send(){
    //단일 주문취소
    var checked_index = new Array();
    var checkboxes = $("input[name=gidx]:checked");

    checkboxes.each(function(index, checkbox){
        checked_index.push(checkbox.value);
    });

    if(checked_index.length != 1){
        alert("선택된 값이 한개가 아닙니다. 주문상품정보 탭에서 다시 선택 후 실행해 주십시오.");
        return;
    };
    if($("input[name=cancel_unit]").val() + $("input[name=cancel_bundle]").val() + $("input[name=cancel_box]").val() == 0){
        alert("취소 수량 입력이 필요합니다.");
        return;
    };
    if($("input[name=cancel_amount]").val() <= 0){
        alert("취소 금액을 입력해주세요.");
        return;
    }
    //취소금액이 주문금액보다 큰지 체크 필요?
    //처리일자 체크 필요?
    var editDataSetJson = new Object();
    editDataSetJson = {"editType" : "ORDER_CANCLE_SINGLE"
                      ,"setConditionIndex" : checked_index[0]
                      ,"setStatus" : $("select[name=cancel_status]").val()
                      ,"cancel_order_idx" : gOrderID
                      ,"cancel_date" : $("input[name=cancel_date]").val().replaceAll("-", "")
                      ,"cancel_unit" : Number($("input[name=cancel_unit]").val())
                      ,"cancel_bundle" : Number($("input[name=cancel_bundle]").val())
                      ,"cancel_box" : Number($("input[name=cancel_box]").val())
                      ,"cancel_amount" : Number($("input[name=cancel_amount]").val())
                      ,"cancel_msg" : $("input[name=cancel_msg]").val()};
    console.log(editDataSetJson);
    var rtnValue = await callEditOrderAjaxCommon(editDataSetJson);

    if(rtnValue == "PFERR_CONF_0000"){
        alert("정상적으로 수정되었습니다.");
        drawOrderListPop(gOrderID, "tab01_05", checked_index);
    };
};

async function btn_cancel_send_multi(pOrderGoodsIdx){
    //단일 주문취소
    var checked_index = new Array();
    var checkboxes = $("input[name=gidx]:checked");

    checkboxes.each(function(index, checkbox){
        checked_index.push(checkbox.value);
    });

    //여러건 선택 후 취소
    if($("input[name=cancel_unit"+pOrderGoodsIdx+"]").val() + $("input[name=cancel_bundle"+pOrderGoodsIdx+"]").val() + $("input[name=cancel_box"+pOrderGoodsIdx+"]").val() == 0){
        alert("취소 수량 입력이 필요합니다.");
        return;
    };
    if($("input[name=cancel_amount"+pOrderGoodsIdx+"]").val() == 0){
        alert("취소 금액을 입력해주세요.");
        return;
    }
    var editDataSetJson = new Object();
    editDataSetJson = {"editType" : "ORDER_CANCLE_SINGLE"
                      ,"setConditionIndex" : pOrderGoodsIdx
                      ,"setStatus" : $("select[name=cancel_status"+pOrderGoodsIdx+"]").val()
                      ,"cancel_order_idx" : gOrderID
                      ,"cancel_date" : $("input[name=cancel_date"+pOrderGoodsIdx+"]").val().replaceAll("-", "")
                      ,"cancel_unit" : Number($("input[name=cancel_unit"+pOrderGoodsIdx+"]").val())
                      ,"cancel_bundle" : Number($("input[name=cancel_bundle"+pOrderGoodsIdx+"]").val())
                      ,"cancel_box" : Number($("input[name=cancel_box"+pOrderGoodsIdx+"]").val())
                      ,"cancel_amount" : Number($("input[name=cancel_amount"+pOrderGoodsIdx+"]").val())
                      ,"cancel_msg" : $("input[name=cancel_msg"+pOrderGoodsIdx+"]").val()};
    console.log(editDataSetJson);
    var rtnValue = await callEditOrderAjaxCommon(editDataSetJson);

    if(rtnValue == "PFERR_CONF_0000"){
        alert("정상적으로 수정되었습니다.");
        drawOrderListPop(gOrderID, "tab01_05", checked_index);
        //해당 값들 선택해서 다시 그림 그려야함
    }
};

async function btn_multi_cancel_send(){
    //일괄 취소
    var checked_index = new Array();
    var checkboxes = $("input[name=mc_idx]:checked");

    checkboxes.each(function(index, checkbox){
        checked_index.push(checkbox.value);
    });
    
    //취소금액이 주문금액보다 큰지 체크 필요?
    //처리일자 체크 필요?
    var editDataSetJson = new Object();
    editDataSetJson = {"editType" : "ORDER_CANCLE_MULTI"
                      ,"setConditionIndex" : checked_index
                      ,"setStatus" : $("select[name=multi_cancel_status]").val()
                      ,"cancel_order_idx" : gOrderID
                      ,"cancel_date" : $("input[name=multi_cancel_date]").val().replaceAll("-", "")
                      ,"cancel_msg" : $("input[name=multi_cancel_msg]").val()};

    var rtnValue = await callEditOrderAjaxCommon(editDataSetJson);

    if(rtnValue == "PFERR_CONF_0000"){
        alert("정상적으로 수정되었습니다.");
        drawOrderListPop(gOrderID);
    }
};

async function btn_cancel_delete(pLedgerIdx){

    var checked_index = new Array();
    var checkboxes = $("input[name=gidx]:checked");

    checkboxes.each(function(index, checkbox){
        checked_index.push(checkbox.value);
    });

    //단일 건수 주문취소를 삭제할때
    if(confirm("정말 삭제하시겠습니까?")){
        var editDataSetJson = new Object();
        editDataSetJson = {"editType" : "DELETE_ORDER_CANCLE"
                              ,"ledger_idx" : pLedgerIdx};

        var rtnValue = await callEditOrderAjaxCommon(editDataSetJson);

        if(rtnValue == "PFERR_CONF_0000"){
            alert("정상적으로 수정되었습니다.");
            drawOrderListPop(gOrderID, "tab01_05", checked_index);
        };
    };
};

async function createOrderMemo(pOrderID){
    //메모등록
    var editDataSetJson = {"editType" : "CREATE_ORDER_MEMO"
                          ,"order_idx" : pOrderID
                          , "memo_msg" : $("#consult_msg").val()};

    var rtnValue = await callEditOrderAjaxCommon(editDataSetJson);

    if(rtnValue == "PFERR_CONF_0000"){
        alert("정상적으로 수정되었습니다.");
        drawOrderListPop(gOrderID);
    };
};

async function btn_payment_gb(pOrderID, toPaymentGB){
    //입금,배송정보 탭에 있는 수정버튼
    var editDataSetJson = new Object();
    editDataSetJson = {"editType" : "PAYMENT_COMPLETE"
                     , "orderID" : pOrderID
                     , "payment_status" : toPaymentGB
                    };
    var rtnValue = await callEditOrderAjaxCommon(editDataSetJson);

    if(rtnValue == "PFERR_CONF_0000"){
        alert("정상적으로 수정되었습니다.");
        drawOrderListPop(gOrderID);
    }
};

function changeOrderCnt(pthis){

    var inputVal = $(pthis).val();
    $(pthis).val(inputVal.replace(/[^0-9]/gi, ""));

    console.log($(pthis).parent().parent());
    console.log($(pthis).parent().parent().children().eq(3).text().replace(/,/g, ""));
    var price = Number($(pthis).parent().parent().children().eq(3).text().replace(/,/g, ""));

    $(pthis).parent().parent().children().eq(7).children().text((price*$(pthis).val()).toLocaleString("ko-KR"));

    
    var amount_arr = $(".detailPop_goods_reorder_amount");
    var amount = 0;
    for(var ax=0; ax<amount_arr.length; ax++){
        amount = amount + Number($(amount_arr[ax]).text().replace(/,/g, ""));
    };

    $("#detailPop_total_reorder_amount").text(amount.toLocaleString("ko-KR"));
};

async function btn_rePayment(){
    if(confirm("수정된 정보로 저장하시겠습니까?")){
        var amount = Number($("#detailPop_total_reorder_amount").text().replace(/,/g, ""));
        if($("#PG_GBN").val() == "KICC"){

            var cancletmp={};
            cancletmp.realTestGbn="real";
            cancletmp.ChangeMode="close";
            cancletmp.amount=0;
            cancletmp.goodsName="종료";
            cancletmp.customerName=$("#receiver_name").text();
            cancletmp.bankCode=$("#payment_bank").val();
            cancletmp.account=$("#payment_account").val();
            cancletmp.pgCno=$("#pgCno").val();
            cancletmp.shopOrderNo=gOrderID;

            var canclertn = await callAccountOpenAjax(cancletmp);
            console.log("canclertn", canclertn);
            if(canclertn.resCd == "0000" || canclertn.resCd == "V013"){
                var tmp={};
                tmp.realTestGbn="real";
                tmp.ChangeMode="open";
                tmp.amount=amount;
                tmp.goodsName="주문수정";
                tmp.customerName=$("#receiver_name").text() + "주문수정";
                tmp.bankCode=$("#payment_bank").val();
                tmp.account=$("#payment_account").val();
                tmp.shopOrderNo=gOrderID.toString();

                console.log("주문수정", tmp);

                var rtn = await callAccountOpenAjax(tmp);
                console.log("계좌갱신", rtn);       
            }
            else{
                alert("이전 금액 취소가 정상적으로 진행되지 않았습니다.\nIT 담당자에게 문의바랍니다.");
                return;
            }
        }
        else {
            var rtn = {"resCd" : "0000"};
        };
        if(rtn.resCd == "0000"){
            var editDataSetJson = new Object();
            var row_seq_arr = [];
            var unit_piece = [];
            var bundle_piece = [];
            var box_piece = [];

            for(var rx=0; rx<$("[name=rol_idx]").length; rx++){
                row_seq_arr[rx] = Number($("[name=rol_idx]")[rx].value);
                unit_piece[rx] =  Number($("[name=rol_Unit_" +  row_seq_arr[rx] + "]").val());
                bundle_piece[rx] =  Number($("[name=rol_Bundle_" +  row_seq_arr[rx] + "]").val());
                box_piece[rx] =  Number($("[name=rol_Box_" +  row_seq_arr[rx] + "]").val());
            };


            editDataSetJson = {"editType" : "EDIT_PAYMENTWAITING"
                             , "order_no" : gOrderID
                             , "amount" : amount
                             , "appID" : "cOrderListPop.js"
                             , "responseKICC" : rtn
                             , "goods_row_seq" : row_seq_arr
                             , "unit_piece" : unit_piece
                             , "bundle_piece" : bundle_piece
                             , "box_piece" : box_piece};

            console.log("editDataSetJson", editDataSetJson);

            var rtnValue = await callEditOrderAjaxCommon(editDataSetJson);
            
            if(rtnValue == "PFERR_CONF_0000"){
                alert("정상적으로 수정되었습니다.");

                var tmp={};
                tmp.bankName = $("#payment_bank_name").val();
                tmp.account = $("#payment_account").val();
                tmp.price = amount.toLocaleString("ko-KR");
                tmp.rcvMobileNo=$("#receiver_mobile").val();
                tmp.realTestGbn ="real";
                tmp.pshopTransactionID = gOrderID;

                callSendSMSKICC(tmp);
                drawOrderListPop(gOrderID, "tab01_06");
            }
            else {
                alert("KICC 계좌 갱신엔 성공하였으나, 주문정보 수정엔 실패하였습니다. IT 담당자에게 문의바랍니다.");
            };
        }
        else{
            alert("KICC 계좌 갱신에 실패했습니다. 재시도하여 주십시오.");
        };
    };
};

async function btn_allCancel(){
    //전체주문삭제
    if(confirm("정말 삭제하시겠습니까?")){
        if($("#PG_GBN").val() == "KICC"){
            var tmp={};
            tmp.realTestGbn="real";
            tmp.ChangeMode="close";
            tmp.amount=0;
            tmp.goodsName="종료";
            tmp.customerName=$("#receiver_name").text();
            tmp.bankCode=$("#payment_bank").val();
            tmp.account=$("#payment_account").val();
            tmp.pgCno=$("#pgCno").val();
            tmp.shopOrderNo=gOrderID;
            console.log("tmp", tmp);
            var rtn = await callAccountOpenAjax(tmp);
        }
        else {
            var rtn = {"resCd" : "0000"};
        };

        if(rtn.resCd == "0000" || rtn.resCd == "V013"){
            //V013은 이미 채번취소된 경우임
            var editDataSetJson = new Object();
            editDataSetJson = {"editType" : "DELETE_PAYMENTWAITING"
                            , "appID" : 'cOrderListPop.js'
                            ,"order_no" : gOrderID};

            var rtnValue = await callEditOrderAjaxCommon(editDataSetJson);
            
            if(rtnValue == "PFERR_CONF_0000"){
                alert("정상적으로 수정되었습니다.");
                
                location.reload();
            }
            else{
                alert("KICC 계좌 갱신엔 성공하였으나, 주문취소엔 실패하였습니다. IT 담당자에게 문의바랍니다.");
            };
        }
        else{
            //실패한경우
            alert("KICC 계좌 갱신에 실패했습니다. 재시도하여 주십시오.");
        };
    };
};

async function callAccountOpenAjax(pEditDataJson){
    var rtn = "";
    $.ajax({
        url: "/bAccountStatusChange",  
        type: "POST", async: false,  
        data:JSON.stringify(pEditDataJson),
        dataType: "JSON", crossOrigin: false, cache: false,
        contentType: "application/json; charset=utf-8",
        success: function(response){
            rtn = response;
        },
        error: function(xhr) {
            console.log("[error] : " + xhr);
            rtnCartData = null;
        },
        complete:function(data ,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
    return rtn;
};

function callSendSMSKICC(pEditDataJson){
    $.ajax({
        url: "/callSendSMS",  
        type: "POST", async: false,  
        data:JSON.stringify(pEditDataJson),
        dataType: "JSON", crossOrigin: false, cache: false,
        contentType: "application/json; charset=utf-8",
        success: function(response){
            console.log("SMS", response);
            if(response.resCd == "0000"){
            };
        },
        error: function(xhr) {
            console.log("[error] : " + xhr);
        },
        complete:function(data ,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
};

async function btn_goodsCancel(pGoodsRowSeq){
    var editDataSetJson = new Object();
    editDataSetJson = {"editType" : "CANCLE_GOODS_PAYMENT_WAITING"
                     , "orderID" : gOrderID
                     , "goods_row_seq" : pGoodsRowSeq
                    };
    var rtnValue = await callEditOrderAjaxCommon(editDataSetJson);

    if(rtnValue == "PFERR_CONF_0000"){
        alert("정상적으로 수정되었습니다.");
        drawOrderListPop(gOrderID, "tab01_06");
    }
};

function callPrint() {
    window.print();
};