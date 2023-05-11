/****************************************************************************************************
module명: sSendSMSBulk.js
creator: 안상현
date: 2022.9.19
version 1.0
설명: SMS 단체문자 발송
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
const appmsg=require("./sapplicatioErrorMessage.json");
let jsdom = require("jsdom");
const e = require("express");
const {JSDOM}=jsdom;
const {window}=new JSDOM();
const {document}=(new JSDOM("")).window;
const $=require("jquery")(window);

let sSendSMSBulk={
    sendSMSBulk: async function(request, response)
    {
        let errFlag="";
        if(request.body!=undefined&&request.body!=null)
        {
            let phone=JSON.parse(request.body.phone);
            let message=request.body.message;
            let client=JSON.parse(request.body.client);

            if(phone.length>0&&message.length>10)
            {
                const CryptoJS=require("crypto-js");
                const pginfo=require("./sKiccKey.json");
                //const req=require("request");
                let mypg=pginfo.filter(function(item, index, arr2){
                    if(item.companyUser=="sajago"&&item.syspos==request.body.realTestGbn&&item.usage=="SMS"){
                        return item;
                    };
                });

                if(mypg!=undefined&&mypg!=null)
                {
                    try
                    {
                        const req=require("request-promise");
                        async function sendSMSPromise(){
                                    let authcode;
                                    let sd;
                                    let tmpServerTime;
                                    let pshopTransactionID;
                                    for(let ix=0; ix<phone.length; ix++)
                                    {
                                        authcode=Math.floor(Math.random() * (9999 - 1372)) + 1372;
                                        sd=require("./sDateFormat");
                                        tmpServerTime=sd.sDateFormat_dateFormatChange(new Date(), "YYYYMMDDHHMMSS");
                    
                                        //PK가 되는 키를 만든다. - 현재 시각 정보 + 인증번호를 문자열로 더한다. (19자리)
                                        let pshopTransactionID=tmpServerTime+"b"+authcode;

                                        let sendDataJson = {
                                            "mallId"      : mypg[0].mallid, //가맹점ID
                                            "shopTransactionId" : pshopTransactionID,
                                            "rcvMobileNo" : phone[ix].phone, //수신핸드폰번호 
                                            "sndType"     : "1", //1:SMS, 2:LMS, 3:알림톡
                                            "sndTelNo"    : "16708485", //송신전화번호
                                            "sndMsg"      : message, //전송할메세지
                                            "msgAuthValue": CryptoJS.HmacSHA256(mypg[0].mallid+"|"+pshopTransactionID+"|"+phone[ix].phone, mypg[0].salt).toString(),
                                            "sndSubject"  : "", //LMS 발송시 전송할 제목 (미사용예정임)
                                            "tplCd"       : "", //템플릿코드(?)
                                            "failType"    : "SMS", // 전송 실패 메세지 타입(NO: 미전송, SMS:SMS, LMS:LMS, MMS:MMS)
                                            "failSubject" : "", // 톡 전송 실패 시 전송할 제목 (SMS의 경우 미사용)
                                            "failMsg"     : "단체문자 전송실패" , //톡 전송 실패 시 전송할 내용 (?)
                                            "profileKey"  : "", //@플러스친구 프로파일키(?)
                                            "sndDt"       : "", //전송일시(?)
                                            "regControlNo": "" //SMS 결제 등록 거래번호
                                        };

                                        const options={
                                            headers: { "Content-Type": "application/json; charset=utf-8" },
                                            uri: mypg[0].URL, 
                                            method: "POST",
                                            body: sendDataJson,
                                            json:true,
                                        };

                                        //문자 전송을 요청한다.
                                        await req.post(options, function(err,res,body){
                                            if(err!=undefined)
                                            {
                                                phone[ix].result="FAIL";
                                            }
                                            else
                                            {
                                                phone[ix].result="SUCCESS";
                                            };
                                        });
                                    };
                        };

                        await sendSMSPromise();

                        let chkFlag="true";
                        for(let ix=0; ix<phone.length; ix++)
                        {
                            if(phone[ix].result=="FAIL")
                            {
                                chkFlag="false";
                                break;
                            };
                        };

                        if(chkFlag=="false")
                        {
                            response.json({"errorcode": appmsg[81].messageCode, "errormessage": "일부 문자 전송 실패!", "returnpage":""});
                        }
                        else
                        {
                            response.json({"errorcode": appmsg[3].messageCode, "errormessage": "문자 전송 성공!", "returnpage":"OK"});
                        };
                    }
                    catch(e)
                    {
                        response.json({"errorcode": appmsg[81].messageCode, "errormessage": appmsg[81].messageText, "returnpage":""});
                    };
                }
                else
                {
                    response.json({"errorcode": appmsg[73].messageCode, "errormessage": appmsg[73].messageText, "returnpage":""});
                };
            }
            else
            {
                response.json({"errorcode": appmsg[91].messageCode, "errormessage": appmsg[91].messageText, "returnpage":""});
            };
        }
        else
        {
            response.json({"errorcode": appmsg[91].messageCode, "errormessage": appmsg[91].messageText, "returnpage":""});
        };
    }
};

module.exports=sSendSMSBulk;