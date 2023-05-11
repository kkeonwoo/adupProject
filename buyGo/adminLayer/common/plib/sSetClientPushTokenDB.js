/****************************************************************************************************
module명: sSetClientPushTokenDB.js
creator: 안상현
date: 2022.10.21
version 1.0
설명: 본 모듈은 Client push message 송신을 위한 token을 sajago db에 등록하는 서비스 모듈임
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
const { param } = require("jquery");
const querystring=require("querystring");
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
var sSetClientPushTokenDB={
    setClientPushTokenDB: async function(myLocalBizCompCode, myCommonSchema, accessTokenUserId, myroleCode, clientPushToken, clientInfo)
    {
        const appmsg=require("./sapplicatioErrorMessage.json");
        const sd=require("./sDateFormat");
        const tmpServerTime=sd.sDateFormat_dateFormatChange(new Date(), "YYYY-MM-DD HH:MM:SS");

        //user id full name (@가 들어간 이메일 체계가 기본적으로 온다. 사업자번호가 올 경우는 해당이 없음)
        let myLoginIdHeader="";
        if(accessTokenUserId.indexOf("@")>-1){myLoginIdHeader=accessTokenUserId.split("@")[0];}else{myLoginIdHeader=accessTokenUserId;};

        //기존에 등록되어 있는 user에 대한 token을 삭제하고 insert한다.
        //cxcx: 희상씨 디바이스 별로 푸시 알림을 하는게 맞을지는 모르겠습니다. FCM이 접속한 디바이스 별로 토큰을 갱신할 것 같은데
        //      FCM의 동작이 어떤 Device에서 갱신되는지를 알 길이 없네요~ 일단은 user별로 지우고 등록할께요~ (푸시를 여기저기 받는게 맞는지? 도 의문임)

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

        tmpStr="DELETE FROM "+myCommonSchema+".tb_p00_client_push_token WHERE 1=1 \n";
        tmpStr=tmpStr+" AND LOCAL_BIZ_COMP_CODE='"+myLocalBizCompCode+"' \n";
        tmpStr=tmpStr+" AND ACCOUNT_EMAIL_ID='"+accessTokenUserId+"' \n";
        tmpStr=tmpStr+" AND ACCOUNT_ROLE='"+myroleCode+"' \n";

        let rtn;
        try{
            rtn=await mydao.sqlHandlerForCompanyUPD(myLocalBizCompCode, "RW", tdevCommon, tmpStr, [])
            .then((rows)=>{
                return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":"OK"};
            });
        }
        catch(e)
        {
            return {"errorcode":appmsg[60].messageCode, "errormessage":appmsg[60].messageText, "returnvalue":"Exception Code #2133"};
        };

        //정상이면 다시 새로 INSERT
        if(rtn.errorcode=="PFERR_CONF_0000")
        {
            tmpStr="INSERT INTO "+myCommonSchema+".tb_p00_client_push_token ( \n";
            tmpStr+="  LOCAL_BIZ_COMP_CODE \n";
            tmpStr+=" ,ACCOUNT_EMAIL_ID \n";
            tmpStr+=" ,ACCOUNT_ROLE \n";
            tmpStr+=" ,CLIENT_PUSH_TOKEN \n";
            tmpStr+=" ,CLIENT_IP_ADDRESS \n";
            tmpStr+=" ,CLIENT_BROWSER_NAME \n";
            tmpStr+=" ,CLIENT_APP_CODE_NAME \n";
            tmpStr+=" ,CLIENT_PLATFORM \n";
            tmpStr+=" ,CLIENT_USER_AGENT \n";
            tmpStr+=" ,CLIENT_BROWSER_VERSION \n";
            tmpStr+=" ,CLIENT_IS_MOBILE \n";
            tmpStr+=" ,CREATION_DATETIME \n";
            tmpStr+=" ,CREATION_WORKER \n";
            tmpStr+=" ,CREATION_APP_ID \n";
            tmpStr+=" ,UPDATE_DATETIME \n";
            tmpStr+=" ,UPDATE_WORKER \n";
            tmpStr+=" ,UPDATE_APP_ID \n";
            tmpStr+=" ,PURGE_PLAN_DATE \n";
            tmpStr+=" ,PURGE_WORKER \n";
            tmpStr+=" ,PURGE_APP_ID \n";
            tmpStr+=") VALUES \n";
            tmpStr+="( \n";
            tmpStr+=" '"+myLocalBizCompCode+"' \n";
            tmpStr+=" ,'"+accessTokenUserId+"' \n";
            tmpStr+=" ,'"+myroleCode+"' \n";
            tmpStr+=" ,'"+clientPushToken+"' \n";

            //client ipaddress
            if(clientInfo.ipAddress==undefined||clientInfo.ipAddress==null)
            {
                tmpStr+=" ,null \n";
            }
            else
            {
                tmpStr+=" ,'"+clientInfo.ipAddress+"' \n";
            };
            tmpStr+=" ,'"+clientInfo.browserName+"' \n";
            tmpStr+=" ,'"+clientInfo.appCodeName+"' \n";
            tmpStr+=" ,'"+clientInfo.platformName+"' \n";
            tmpStr+=" ,'"+clientInfo.userAgent+"' \n";
            tmpStr+=" ,'"+clientInfo.browserVersion+"' \n";
            tmpStr+=" ,'"+clientInfo.isMobile+"' \n";

            // audit
            tmpStr+=" ,STR_TO_DATE('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s') \n";
            tmpStr+=" ,'"+myLoginIdHeader+"' \n";
            tmpStr+=" ,'sSetClientPushTokenDB' \n";
            tmpStr+=" ,STR_TO_DATE('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s') \n";
            tmpStr+=" ,'"+myLoginIdHeader+"' \n";
            tmpStr+=" ,'sSetClientPushTokenDB' \n";
            tmpStr+=" ,null \n";
            tmpStr+=" ,null \n";
            tmpStr+=" ,null \n";
            tmpStr+=") \n";

            try{
                rtn=await mydao.sqlHandlerForCompanyUPD(myLocalBizCompCode, "RW", tdevCommon, tmpStr, [])
                .then((rows)=>
                {
                    if(rows.affectedRows>0)
                    {
                        return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":"OK"};
                    }
                    else
                    {
                        return {"errorcode":appmsg[95].messageCode, "errormessage":appmsg[95].messageText, "returnvalue":""};
                    };
                });
                return rtn;
    
            }
            catch(e)
            {
                return {"errorcode":appmsg[60].messageCode, "errormessage":appmsg[60].messageText, "returnvalue":"Exception Code #2133"};
            };
        }
        else
        {
            return {"errorcode":appmsg[60].messageCode, "errormessage":appmsg[60].messageText, "returnvalue":"Exception Code #5677"};
        };
        //----------------------------------------------------------------------------------------------------------------
    }
};

module.exports=sSetClientPushTokenDB;