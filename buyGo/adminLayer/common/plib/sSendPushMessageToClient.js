/****************************************************************************************************
module명: sSendPushMessageToClient.js
creator: 안상현
date: 2022.10.21
version 1.0
설명: admin 등의 화면으로 부터 전송받은 메세지를 push알림 등록된 Client에 push 메세지를 보낸다.
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

let sSendPushMessageToClient={
    sendPushMessageToClient: async function(request, response)
    {
        if(request.body!=undefined&&request.body!=null)
        {
            const functions = require("firebase-functions");
            const admin = require("firebase-admin");
            const serviceAccount = require("./sajagoPushServiceKey.json");
            // Initialize Firebase
            try{
                if (!admin.apps.length) 
                {
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount),
                        databaseURL: "https://eumpushservice-default-rtdb.asia-southeast1.firebasedatabase.app"
                    });
                };
                
                let pushTitle=request.body.pushTitle;
                let pushMessage=request.body.pushMessage;
                //희상님~ sendType 은 all 을 포함하여 업무 설계에 따라 보내는 그룹을 지정하면 되므로 자유롭게 지정하세요~
                //SendType은 제가 임의로 업무 흐름을 예상해서 만든 변수일 뿐입니다.
                let sendType=request.body.sendType;
                let clientInfo=JSON.parse(request.body.client);

                // ########################## 쿠키가 있을때 공통적으로 추출해야 하는 사항 - start
                const jwt=require("jsonwebtoken");
                const secretObj=require("./sjwt");
                const mr=require("./sMyRole.js");
                let myroleCode=mr.getMyRoleCode(request.body.myrole);

                const cookie=require("cookie");
                let pcookie=cookie.parse(request.headers.cookie);
                let acTokenFromRequest=pcookie.accessToken;
                let rfTokenFromRequest=pcookie.refreshToken;

                let base64JWTPayload=acTokenFromRequest.split(".")[1]; //0: header, 1: payload, 2: VERIFY SIGNATURE
                let acessTokenPayload=Buffer.from(base64JWTPayload, "base64");
                let resultParsedAccessToken=JSON.parse(acessTokenPayload.toString());

                //iss 값으로 bizCode를 찾는다.
                let st=require("./sToken.json");
                const sKey=require("./sKey");
                let tmpTkInfo=st.filter(function(item, index, arr2){return item.uDirectory==resultParsedAccessToken.iss});
                //구해진 폴더 이름으로 소속법인의 스키마를 찾는다.
                const myOwnerSchema=tmpTkInfo[0].ownerSchema;
                const myCommonSchema=tmpTkInfo[0].commonSchema;
                const myLocalBizCompCode=tmpTkInfo[0].localBizCompCode;
                let accessTokenUserId=resultParsedAccessToken.email;

                const requestIp=require("request-ip");
                let clientIpAddress=requestIp.getClientIp(request);

                //request object로부터 ip address를 추출하여 client info에 추가한다.
                if(clientInfo.ipAddress==undefined){clientInfo.ipAddress=clientIpAddress;}else{clientInfo.ipAddress="";};
                // ########################## 쿠키가 있을때 공통적으로 추출해야 하는 사항 - end

                try{
                    //token등록에 필요한 인수들이 모두 존재할 경우에 등록이 가능함
                    if(clientInfo!=undefined&&myroleCode.length>0&&accessTokenUserId.length>0&&
                      myLocalBizCompCode.length>0&&myCommonSchema.length>0&&pushTitle.length>0&&pushMessage.length>0)
                    {
                        //const condition = '\'stock-GOOG\' in topics || \'industry-tech\' in topics';
                        const condition = "/sajago";
                        let registrationTokens=[];
                        registrationTokens=await getTokenListFromPushListDB(sendType);

                        if(registrationTokens.length>0)
                        {
                            const message = {
                                notification: {title: pushTitle, body: pushMessage},
                                data: {title: pushTitle, body: pushMessage},
                                tokens: registrationTokens,
                            };

                            try{
                                admin
                                .messaging()
                                .sendMulticast(message)
                                .then((res)=>{
                                    // Response is a message ID string.
                                    console.log("Successfully sent message:", res);

                                    if (res.failureCount > 0) {
                                        const failedTokens = [];
                                        res.responses.forEach((resp, idx)=>{
                                            if(!resp.success)
                                            {
                                                failedTokens.push(registrationTokens[idx]);
                                            };
                                        });
                                        console.log("List of tokens that caused failures: " , failedTokens);
                                    }

                                    response.json({"errorcode": appmsg[3].messageCode, "errormessage": appmsg[3].messageText, "returnvalue":"OK"});
                                })
                                .catch((error)=>{
                                    console.log("Error sending message:", error);
                                    response.json({"errorcode": appmsg[81].messageCode, "errormessage": appmsg[81].messageText, "returnvalue": error.message});
                                });
                            }
                            catch(e)
                            {
                                response.json({"errorcode": appmsg[81].messageCode, "errormessage": appmsg[81].messageText, "returnvalue":e.message});
                            };
                        }
                        else
                        {
                            //송신 대상 List가 없어도 정상으로 보낸다.
                            response.json({"errorcode": appmsg[3].messageCode, "errormessage": appmsg[3].messageText, "returnvalue":"OK"});
                        };
                    }
                    else
                    {
                        response.json({"errorcode": appmsg[94].messageCode, "errormessage": appmsg[94].messageText, "returnvalue":"invalid parameters"});
                    };
                }
                catch(e)
                {
                    response.json({"errorcode": appmsg[81].messageCode, "errormessage": appmsg[81].messageText, "returnvalue":e.message});
                };
            }
            catch(e)
            {
                console.log(e.message);
                response.json({"errorcode": appmsg[81].messageCode, "errormessage": appmsg[81].messageText, "returnvalue":e.message});
            }
        }
        else
        {
            response.json({"errorcode": appmsg[93].messageCode, "errormessage": appmsg[93].messageText, "returnvalue":""});
        };

        async function getTokenListFromPushListDB(pSendType)
        {
            let tmpStr="";
            let mydb = require("./sDbcommonconfigRW");
            let mydao=require("./sDbCommonDaoForCompanyAreaUPD");

            let tdevCommon ={
                host     : mydb.host,
                user     : mydb.user,
                password : mydb.password,
                database : mydb.database,
                port     : mydb.port,
                connectionLimit: mydb.connectionLimit,   
                multipleStatements: mydb.multipleStatements
            };

            tmpStr="SELECT a.CLIENT_PUSH_TOKEN \n";
            tmpStr+=" FROM "+mydb.database+".tb_p00_client_push_token a \n";
            tmpStr+=" WHERE 1=1 \n";
            tmpStr+=" AND a.LOCAL_BIZ_COMP_CODE = '"+mydb.localBizCompCode+"' \n";

            //특정 push 송신 대상 그룹이 있는 경우에는 조건 추가
            if(pSendType!=undefined&&pSendType!=null&&pSendType.length>0&&pSendType!="ALL")
            {
                tmpStr=+" AND a.ACCOUNT_ROLE = '"+pSendType+"'	--  어느 집단으로 보낼 것인지에 따라 설정한다. \n";
            };
            
            let rtn=[];
            try{
                await mydao.sqlHandlerForCompanyUPD(mydb.localBizCompCode, "RO", tdevCommon, tmpStr, [])
                .then((rows)=>{
                    if(rows.length>0)
                    {
                        for(let ix=0; ix<rows.length; ix++)
                        {
                            rtn.push(rows[ix].CLIENT_PUSH_TOKEN);
                        };
                    };
                });

                return rtn;
            }
            catch(e)
            {
                //null object로 반환
                return rtn;
            };
        };
    }
};

module.exports=sSendPushMessageToClient;