/****************************************************************************************************
module명: sSetClientPushToken.js
creator: 안상현
date: 2022.10.21
version 1.0
설명: Client에서 얻은 FCM Token을 sajgo에 등록하는 서비스
전반적인 소스 구성은 아래 Link를 참고하세요
https://github.com/firebase/quickstart-js/blob/a6c60d5b6efd513dd924af15c98e2d67e405ae51/messaging/index.html#L166
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

let sSetClientPushToken={
    setClientPushToken: async function(request, response)
    {
        if(request.body!=undefined&&request.body!=null)
        {

            let clientPushToken=request.body.myPushToken;
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

            //token등록에 필요한 인수들이 모두 존재할 경우에 등록이 가능함
            if(clientInfo!=undefined&&clientPushToken.length>0&&myroleCode.length>0&&accessTokenUserId.length>0&&myLocalBizCompCode.length>0&&myCommonSchema.length>0)
            {
                //DB에 등록한다.
                let rtndb=require("./sSetClientPushTokenDB.js")
                let result=await rtndb.setClientPushTokenDB(myLocalBizCompCode, myCommonSchema, accessTokenUserId, myroleCode, clientPushToken, clientInfo);
                response.json(result);
            }
            else
            {
                response.json({"errorcode": appmsg[94].messageCode, "errormessage": appmsg[94].messageText, "returnvalue":""});
            };
        }
        else
        {
            response.json({"errorcode": appmsg[93].messageCode, "errormessage": appmsg[93].messageText, "returnvalue":""});
        };
    }
};

module.exports=sSetClientPushToken;