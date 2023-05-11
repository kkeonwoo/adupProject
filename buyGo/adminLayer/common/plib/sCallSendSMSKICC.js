/****************************************************************************************************
module명: sCallSendSMSKICC.js
creator: 안상현
date: 2022.9.13
version 1.0
설명: SMS 송신 모듈 공통 (KICC)
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
const {JSDOM}=jsdom;
const {window}=new JSDOM();
const {document}=(new JSDOM("")).window;
const $=require("jquery")(window);

let sCallSendSMSKICC={
    callSendSMSKICC: async function(request, response)
    {
        const requestIp=require("request-ip");
        let ClientIpAddress=requestIp.getClientIp(request);

        if(request.body!=undefined&&request.body!=null)
        {
            //기존의 로직은 그대로 유지한다.
            if(request.body.gbn==undefined||request.body.gbn==null||request.body.gbn!="PHONE_AUTH")
            {
                const CryptoJS=require("crypto-js");
                const pginfo=require("./sKiccKey.json");
                const req = require("request");
                //클라이언트에서 입력한 문장을 서버에서 암호화 하여 내려보낸다. 이때는 토큰 체크등은 불필요
                // pshopTransactionID :  입금대기 요청시 사용되는 shopTransactionID
                // pshopOrderNo :  입금대기 요청시 사용되는 shopOrderNo
                
                let mypg=pginfo.filter(function(item, index, arr2){
                    if(item.companyUser=="sajago"&&item.syspos==request.body.realTestGbn&&item.usage=="SMS"){
                        return item;
                    };
                });

                if(mypg!=undefined&&mypg!=null)
                {
                    let rcvMobileNo="";
                    if(request.body.realTestGbn=="test")
                    {
                        rcvMobileNo="01035854426";
                    }
                    else
                    {
                        rcvMobileNo=request.body.rcvMobileNo;
                    };

                    let nowDate=new Date();

                    let msgTxt="";
                    if(request.body.limitOrderDate!=undefined&&request.body.limitOrderDate!=null)
                    {
                        //기존 주문에 게좌변경인 경우는 원래 주문일자+3일이 계산된 날짜로 안내한다.
                        msgTxt = request.body.bankName + " " + request.body.account + " 계좌로 " + request.body.limitOrderDate + "까지 " + request.body.price + "원 입금부탁드립니다. (주)더이음"; 
                    }
                    else
                    {
                        //최초 입금 문자는 보내는 시점으로부터 3일을 더한다.
                        nowDate.setDate(nowDate.getDate() + 3);
                        let month = nowDate.getMonth() + 1;
                        let day = nowDate.getDate();

                        month = month >= 10 ? month : "0" + month;
                        day = day >= 10 ? day : "0" + day;

                        let md = month + "월" + day + "일";
                        msgTxt = request.body.bankName + " " + request.body.account + " 계좌로 " + md + "까지 " + request.body.price + "원 입금부탁드립니다. (주)더이음"; 
                    };

                    let sendDataJson = {
                        "mallId"      : mypg[0].mallid, //가맹점ID
                        "shopTransactionId" : request.body.pshopTransactionID,
                        "rcvMobileNo" : rcvMobileNo, //수신핸드폰번호 
                        "sndType"     : "1", //1:SMS, 2:LMS, 3:알림톡
                        "sndTelNo"    : "16708485", //송신전화번호
                        "sndMsg"      : msgTxt, //전송할메세지
                        "msgAuthValue": CryptoJS.HmacSHA256(mypg[0].mallid+"|"+request.body.pshopTransactionID+"|"+rcvMobileNo, mypg[0].salt).toString(), //mallId+"|"+shopTransactionId+"|"+rcvMobileNo(?)
                        "sndSubject"  : "", //LMS 발송시 전송할 제목 (미사용예정임)
                        "tplCd"       : "", //템플릿코드(?)
                        "failType"    : "SMS", // 전송 실패 메세지 타입(NO: 미전송, SMS:SMS, LMS:LMS, MMS:MMS)
                        "failSubject" : "", // 톡 전송 실패 시 전송할 제목 (SMS의 경우 미사용)
                        "failMsg"     : "전송실패" , //톡 전송 실패 시 전송할 내용 (?)
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

                    req.post(options, function(err,res,body){
                        if(err!=undefined)
                        {
                            response.json({"errorcode": appmsg[75].messageCode, "errormessage": appmsg[75].messageText, "returnpage":""});
                        }
                        else
                        {
                            response.json(body);
                        };
                    });
                }
                else
                {
                    response.json({"errorcode": appmsg[73].messageCode, "errormessage": appmsg[73].messageText, "returnpage":""});
                };
            }
            else if(request.body!=undefined&&request.body.gbn=="PHONE_AUTH")
            {
                //휴대폰 본인인증 기능을 추가함 (2022.9.13)
                const CryptoJS=require("crypto-js");
                const pginfo=require("./sKiccPhoneAuth.json");
                const req = require("request");
                
                let mypg=pginfo.filter(function(item, index, arr2){
                    if(item.companyUser=="sajago"&&item.syspos==request.body.realTestGbn&&item.usage=="SMS"){
                        return item;
                    };
                });

                if(mypg!=undefined&&mypg!=null)
                {
                    //1372~9999 사이의 인증번호를 생성한다.
                    const authcode=Math.floor(Math.random() * (9999 - 1372)) + 1372;
                    const sd=require("./sDateFormat");
                    const tmpServerTime=sd.sDateFormat_dateFormatChange(new Date(), "YYYYMMDDHHMMSS");

                    //PK가 되는 키를 만든다. - 현재 시각 정보 + 인증번호를 문자열로 더한다. (19자리)
                    let pshopTransactionID=tmpServerTime+"a"+authcode;

                    let rcvMobileNo="";
                    if(request.body.realTestGbn=="test")
                    {
                        rcvMobileNo="01035854426";
                    }
                    else
                    {
                        rcvMobileNo=request.body.rcvMobileNo;
                    };

                    let msgTxt = "사자고.shop B2B 회원 가입 휴대폰 인증 번호는 "+authcode+" 입니다."; 
                    
                    let sendDataJson = {
                        "mallId"      : mypg[0].mallid, //가맹점ID
                        "shopTransactionId" : pshopTransactionID,
                        "rcvMobileNo" : rcvMobileNo, //수신핸드폰번호 
                        "sndType"     : "1", //1:SMS, 2:LMS, 3:알림톡
                        "sndTelNo"    : "16708485", //송신전화번호
                        "sndMsg"      : msgTxt, //전송할메세지
                        "msgAuthValue": CryptoJS.HmacSHA256(mypg[0].mallid+"|"+pshopTransactionID+"|"+rcvMobileNo, mypg[0].salt).toString(), //mallId+"|"+shopTransactionId+"|"+rcvMobileNo(?)
                        "sndSubject"  : "", //LMS 발송시 전송할 제목 (미사용예정임)
                        "tplCd"       : "", //템플릿코드(?)
                        "failType"    : "SMS", // 전송 실패 메세지 타입(NO: 미전송, SMS:SMS, LMS:LMS, MMS:MMS)
                        "failSubject" : "", // 톡 전송 실패 시 전송할 제목 (SMS의 경우 미사용)
                        "failMsg"     : "전송실패" , //톡 전송 실패 시 전송할 내용 (?)
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

                    req.post(options, function(err,res,body){
                        if(err!=undefined)
                        {
                            response.json({"errorcode": appmsg[75].messageCode, "errormessage": appmsg[75].messageText, "returnpage":""});
                        }
                        else
                        {
                            response.json(body);
                            setAuthCodeToPhone(rcvMobileNo, authcode);
                        };
                    });
                }
                else
                {
                    response.json({"errorcode": appmsg[73].messageCode, "errormessage": appmsg[73].messageText, "returnpage":""});
                };
            }
            else if(request.body!=undefined&&request.body.gbn=="SEND_USER"){
                //메세지 발송기능
                const CryptoJS=require("crypto-js");
                const pginfo=require("./sKiccPhoneAuth.json");
                const req = require("request");
                
                let mypg=pginfo.filter(function(item, index, arr2){
                    if(item.companyUser=="sajago"&&item.syspos==request.body.realTestGbn&&item.usage=="SMS"){
                        return item;
                    };
                });

                if(mypg!=undefined&&mypg!=null)
                {
                    const sd=require("./sDateFormat");
                    const tmpServerTime=sd.sDateFormat_dateFormatChange(new Date(), "YYYYMMDDHHMMSS");

                    //PK가 되는 키를 만든다. - 현재 시각 정보 + 인증번호를 문자열로 더한다. (19자리)

                    let rcvMobileNo="";
                    if(request.body.realTestGbn=="test")
                    {
                        rcvMobileNo="01035854426";
                    }
                    else
                    {
                        rcvMobileNo=request.body.rcvMobileNo;
                    };

                    let pshopTransactionID=tmpServerTime+"a"+authcode;
                    
                    let sendDataJson = {
                        "mallId"      : mypg[0].mallid, //가맹점ID
                        "shopTransactionId" : pshopTransactionID,
                        "rcvMobileNo" : rcvMobileNo, //수신핸드폰번호 
                        "sndType"     : "1", //1:SMS, 2:LMS, 3:알림톡
                        "sndTelNo"    : "16708485", //송신전화번호
                        "sndMsg"      : request.body.message_text, //전송할메세지
                        "msgAuthValue": CryptoJS.HmacSHA256(mypg[0].mallid+"|"+pshopTransactionID+"|"+rcvMobileNo, mypg[0].salt).toString(), //mallId+"|"+shopTransactionId+"|"+rcvMobileNo(?)
                        "sndSubject"  : "", //LMS 발송시 전송할 제목 (미사용예정임)
                        "tplCd"       : "", //템플릿코드(?)
                        "failType"    : "SMS", // 전송 실패 메세지 타입(NO: 미전송, SMS:SMS, LMS:LMS, MMS:MMS)
                        "failSubject" : "", // 톡 전송 실패 시 전송할 제목 (SMS의 경우 미사용)
                        "failMsg"     : "전송실패" , //톡 전송 실패 시 전송할 내용 (?)
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

                    req.post(options, function(err,res,body){
                        if(err!=undefined)
                        {
                            response.json({"errorcode": appmsg[75].messageCode, "errormessage": appmsg[75].messageText, "returnpage":""});
                            insertMessageLog(rcvMobileNo, request.body.user_row_seq, request.body.user_name, request.body.message_text, 'N');
                        }
                        else
                        {
                            response.json(body);
                            insertMessageLog(rcvMobileNo, request.body.user_row_seq, request.body.user_name, request.body.message_text, 'Y');
                        };
                    });
                }
                else
                {
                    response.json({"errorcode": appmsg[73].messageCode, "errormessage": appmsg[73].messageText, "returnpage":""});
                };
            }
            else
            {
                response.json({"errorcode": appmsg[87].messageCode, "errormessage": appmsg[87].messageText, "returnpage":""});
            };
        }
        else
        {
            response.json({"errorcode": appmsg[73].messageCode, "errormessage": appmsg[73].messageText, "returnpage":""});
        };

        async function setAuthCodeToPhone(phone, authcode)
        {
            let tmpStr="";
            let mydb = require("./sDbcommonconfigRW");
            const myLocalBizCompCode = mydb.localBizCompCode;

            let tdevCommon ={
                host     : mydb.host,
                user     : mydb.user,
                password : mydb.password,
                database : mydb.database,
                port     : mydb.port,
                connectionLimit: mydb.connectionLimit,   
                multipleStatements: mydb.multipleStatements
            };

            //전송된 auth code를 기록한다.
            //먼저 3분 경과한 인증 Data는 무효처리한다. 그리고 기록하기전 4개월 초과분은 삭제부터 한다.
            tmpStr       =" UPDATE "+mydb.database+".tb_p00_auth_phone a \n";
            tmpStr=tmpStr+"    SET a.VALID_YN = 'N' \n";
            tmpStr=tmpStr+"  WHERE a.CREATION_DATETIME < DATE_ADD(SYSDATE(), INTERVAL - 3 MINUTE) AND a.LOCAL_BIZ_COMP_CODE = '"+myLocalBizCompCode+"'; COMMIT; ";
            tmpStr=tmpStr+" DELETE FROM "+mydb.database+".tb_p00_auth_phone WHERE LOCAL_BIZ_COMP_CODE = '"+myLocalBizCompCode+"' AND CREATION_DATETIME < DATE_ADD(SYSDATE(), INTERVAL - 120 DAY); COMMIT;";
            let mydao=require("./sDbCommonDaoForCompanyAreaUPD");
            await mydao.sqlHandlerForCompanyUPD(myLocalBizCompCode, "RW", tdevCommon, tmpStr,[]);

            //다음에 인증코드를 등록한다.
            tmpStr       =" INSERT INTO "+mydb.database+".tb_p00_auth_phone ( \n";
            tmpStr=tmpStr+"  LOCAL_BIZ_COMP_CODE \n";
            tmpStr=tmpStr+" ,AUTH_PHONE \n";
            tmpStr=tmpStr+" ,AUTH_CODE \n";
            tmpStr=tmpStr+" ,VALID_YN \n";
            tmpStr=tmpStr+" ,CREATION_DATETIME \n";
            tmpStr=tmpStr+" ,CREATION_WORKER \n";
            tmpStr=tmpStr+" ,CREATION_APP_ID \n";
            tmpStr=tmpStr+" ,UPDATE_DATETIME \n";
            tmpStr=tmpStr+" ,UPDATE_WORKER \n";
            tmpStr=tmpStr+" ,UPDATE_APP_ID \n";
            tmpStr=tmpStr+" ) \n";
            tmpStr=tmpStr+" VALUES \n";
            tmpStr=tmpStr+" ( \n";
            tmpStr=tmpStr+"  '"+myLocalBizCompCode+"' \n";
            tmpStr=tmpStr+" ,'"+phone+"' \n";
            tmpStr=tmpStr+" ,'"+authcode+"' \n";
            tmpStr=tmpStr+" ,'Y' \n";
            tmpStr=tmpStr+" ,SYSDATE() \n";
            tmpStr=tmpStr+" ,'"+ClientIpAddress+"' \n"; //request 내 존재하는 ip로 기록한다.
            tmpStr=tmpStr+" ,'sCallSendSMSKICC' \n";
            tmpStr=tmpStr+" ,SYSDATE() \n";
            tmpStr=tmpStr+" ,'"+ClientIpAddress+"' \n"; //request 내 존재하는 ip로 기록한다.
            tmpStr=tmpStr+" ,'sCallSendSMSKICC' \n";
            tmpStr=tmpStr+" ); \n";

            await mydao.sqlHandlerForCompanyUPD(myLocalBizCompCode, "RW", tdevCommon, tmpStr,[]);
        };

        async function insertMessageLog(phone, user_row_seq, user_name, message_text, send_YN)
        {
            let tmpStr="";
            let mydb = require("./sDbcommonconfigRW");
            const myLocalBizCompCode = mydb.localBizCompCode;

            if(user_row_seq ===undefined) user_row_seq = null;
            if(user_name ===undefined) user_name = null;

            let tdevCommon ={
                host     : mydb.host,
                user     : mydb.user,
                password : mydb.password,
                database : mydb.database,
                port     : mydb.port,
                connectionLimit: mydb.connectionLimit,   
                multipleStatements: mydb.multipleStatements
            };

            //다음에 인증코드를 등록한다.
            tmpStr       =" INSERT INTO sjgo.tb_s99_message_log ( \n";
            tmpStr=tmpStr+"  MESSAGE_TEXT \n";
            tmpStr=tmpStr+" ,PLATFORM_ROW_SEQ_ACCOUNT_OF_MEMBER \n";
            tmpStr=tmpStr+" ,USER_NAME \n";
            tmpStr=tmpStr+" ,MOBILE_PHONE \n";
            tmpStr=tmpStr+" ,SEND_YN \n";
            tmpStr=tmpStr+" ,CREATION_DATETIME \n";
            tmpStr=tmpStr+" ,CREATION_WORKER \n";
            tmpStr=tmpStr+" ,CREATION_APP_ID \n";
            tmpStr=tmpStr+" ,UPDATE_DATETIME \n";
            tmpStr=tmpStr+" ,UPDATE_WORKER \n";
            tmpStr=tmpStr+" ,UPDATE_APP_ID \n";
            tmpStr=tmpStr+" ) \n";
            tmpStr=tmpStr+" VALUES \n";
            tmpStr=tmpStr+" ( \n";
            tmpStr=tmpStr+"  '"+message_text+"' \n";
            tmpStr=tmpStr+" ,'"+user_row_seq+"' \n";
            tmpStr=tmpStr+" ,'"+user_name+"' \n";
            tmpStr=tmpStr+" ,'"+phone+"' \n";
            tmpStr=tmpStr+" ,'"+send_YN+"' \n";
            tmpStr=tmpStr+" ,SYSDATE() \n";
            tmpStr=tmpStr+" ,'"+ClientIpAddress+"' \n"; //request 내 존재하는 ip로 기록한다.
            tmpStr=tmpStr+" ,'sCallSendSMSKICC' \n";
            tmpStr=tmpStr+" ,SYSDATE() \n";
            tmpStr=tmpStr+" ,'"+ClientIpAddress+"' \n"; //request 내 존재하는 ip로 기록한다.
            tmpStr=tmpStr+" ,'sCallSendSMSKICC' \n";
            tmpStr=tmpStr+" ); \n";

            await mydao.sqlHandlerForCompanyUPD(myLocalBizCompCode, "RW", tdevCommon, tmpStr,[]);
        };
    }
};

module.exports=sCallSendSMSKICC;