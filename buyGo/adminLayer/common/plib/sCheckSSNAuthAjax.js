/****************************************************************************************************
module명: sCheckSSNAuthAjax.js
creator: 안상현
date: 2022.09.6
version 1.0
설명: 본 모듈은 이용약관 및 안내 본문을 DB에서 읽어서 클라이언트에 내려보내는 모듈이다.
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
-------------------------------- (아래는 사업자 진위 및 상태코드 List입니다.) -------------------------
status_code	string
API 상태 코드

Enum:
Array [ 1 ]
match_cnt	integer
조회 매칭 수

request_cnt	integer
조회 요청 수

data	[
xml: OrderedMap { "name": "Data", "wrapped": true }
사업자등록 상태조회 결과

사업자등록 상태조회 결과{
b_no	string
default: 0000000000
xml: OrderedMap { "name": "BNo" }
사업자등록번호


xml:
   name: BNo
b_stt	string
default: 01
xml: OrderedMap { "name": "BStt" }
납세자상태(명칭):
01: 계속사업자,
02: 휴업자,
03: 폐업자


xml:
   name: BStt
b_stt_cd	string
default: 01
xml: OrderedMap { "name": "BSttCd" }
납세자상태(코드):
01: 계속사업자,
02: 휴업자,
03: 폐업자


xml:
   name: BSttCd
tax_type	string
default: 일반과세자
xml: OrderedMap { "name": "TaxType" }
과세유형메세지(명칭):
01:부가가치세 일반과세자,
02:부가가치세 간이과세자,
03:부가가치세 과세특례자,
04:부가가치세 면세사업자,
05:수익사업을 영위하지 않는 비영리법인이거나 고유번호가 부여된 단체,국가기관 등,
06:고유번호가 부여된 단체,
07:부가가치세 간이과세자(세금계산서 발급사업자),
* 등록되지 않았거나 삭제된 경우: "국세청에 등록되지 않은 사업자등록번호입니다"


xml:
   name: TaxType
tax_type_cd	string
default: 1
xml: OrderedMap { "name": "TaxType" }
과세유형메세지(코드):
01:부가가치세 일반과세자,
02:부가가치세 간이과세자,
03:부가가치세 과세특례자,
04:부가가치세 면세사업자,
05:수익사업을 영위하지 않는 비영리법인이거나 고유번호가 부여된 단체,국가기관 등,
06:고유번호가 부여된 단체,
07:부가가치세 간이과세자(세금계산서 발급사업자)


xml:
   name: TaxType
end_dt	string
default: 20000101
xml: OrderedMap { "name": "EndDt" }
폐업일 (YYYYMMDD 포맷)


xml:
   name: EndDt
utcc_yn	string
default: Y
xml: OrderedMap { "name": "UtccYn" }
단위과세전환폐업여부(Y,N)


xml:
   name: UtccYn
tax_type_change_dt	string
default: 20000101
xml: OrderedMap { "name": "TaxTypeChangeDt" }
최근과세유형전환일자 (YYYYMMDD 포맷)


xml:
   name: TaxTypeChangeDt
invoice_apply_dt	string
default: 20000101
xml: OrderedMap { "name": "InvoiceApplyDt" }
세금계산서적용일자 (YYYYMMDD 포맷)


xml:
   name: InvoiceApplyDt
}]
}

****************************************************************************************************/
"use strict";
const appmsg=require("./sapplicatioErrorMessage.json");
const { param } = require("jquery");
const querystring=require("querystring");
var jsdom = require("jsdom");
const {JSDOM}=jsdom;
const {window}=new JSDOM();
const {document}=(new JSDOM("")).window;
const $=require("jquery")(window);

//국가공공 데이터 인증Key
//https://www.data.go.kr/iim/api/selectApiKeyList.do 에서 인증키를 확인해야 한다. (1년마다 재발급 또는 연장 필요할 수 있음)
//id: eumadm, 비번은 운영자가 알고 있음 (기업회원으로 가입되어 있다)
const SSN_CHECK_KEY="nYd%2F9W2KFnnsLO%2F9Hm%2BSMqJ2pK4Z8X3izE7xt8GIk6cq%2BRCaFrzg1m1ybI9L7TYt0f%2BAx7X54bInOIb96TN82w%3D%3D";

var sCheckSSNAuthAjax={
    checkSSNAuthAjax: async function(request,response)
    {
        if(request.body.ssn!=undefined&&request.body.ssn!=null&&request.body.ssn!="")
        {
            //사업자번호 인증관련 참고 사이트 https://www.data.go.kr/iim/api/selectAPIAcountView.do (국가공공데이터)
            let pSSN=request.body.ssn;
            var data = {
                "b_no": [pSSN] // 사업자번호 "xxxxxxx" 로 조회 시, 배열로 넣어야 한다. 최대 100개
            }; 
            
            $.ajax({
            //url: "https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=xxxxxx",  // serviceKey 값을 xxxxxx에 입력
            url: "https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey="+SSN_CHECK_KEY,
            type: "POST",
            data: JSON.stringify(data), // json 을 string으로 변환하여 전송
            dataType: "JSON",
            contentType: "application/json",
            accept: "application/json",
            success: function(result) {
                if(result.data[0].b_stt_cd=="01")
                {
                    //계속 사업자 (정상적인 사업등록번호와 휴폐업이 아닌 경우만 해당)
                    response.json({"errorcode": appmsg[3].messageCode, "errormessage": appmsg[3].messageText, "returnvalue" : ""});
                }
                else
                {
                    response.json({"errorcode": appmsg[86].messageCode, "errormessage": appmsg[86].messageText, "returnvalue" : ""});
                };
            },
            error: function(result) {
                response.json({"errorcode": appmsg[86].messageCode, "errormessage": appmsg[86].messageText, "returnvalue" : ""});
            }
            });
        }
        else
        {
            response.json({"errorcode": appmsg[51].messageCode, "errormessage": appmsg[51].messageText, "returnvalue" : ""});
        };
    }
};
//mvc중 controller 부분을 담당
module.exports=sCheckSSNAuthAjax;