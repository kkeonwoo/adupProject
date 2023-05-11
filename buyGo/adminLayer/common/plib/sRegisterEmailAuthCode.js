/****************************************************************************************************
module명: sRegisterEmailAuthCode.js
creator: 안상현
date: 2022.9.15
version 1.0
설명: 이메일 인증모듈(회원가입 등)
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
let jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM();
const {document} = (new JSDOM("")).window;

var sRegisterEmailAuthCode={
    RegisterAuthCode: async function(tmpFolderName, request, userId, authcode)
    {
        let appmsg=require("./sapplicatioErrorMessage.json");
        let refererString="";
        let requestUrl="";
        let requestHost="";
        let requestIpAddress="";

        if(request!=undefined&&request!=null)
        {
            //request referer , request url, request host 를 구한다. 
            if(request.headers.referer!=undefined&&request.headers.referer!=null)
            {
                refererString=request.headers.referer;
                if(refererString.length>200)
                {
                    refererString=refererString.substring(0,200);
                };
            };

            if(request.url!=undefined&&request.url!=null)
            {
                requestUrl=request.url;
                if(requestUrl.length>200)
                {
                    requestUrl=requestUrl.substring(0,200);
                };
            };

            if(request.headers.host!=undefined&&request.headers.host!=null)
            {
                requestHost=request.headers.host;
                if(requestHost.length>50)
                {
                    requestHost=requestHost.substring(0,50);
                };
            };

            if(request.ip!=undefined&&request.ip!=null)
            {
                requestIpAddress=request.ip;
                if(requestIpAddress.length>30)
                {
                    requestIpAddress=requestIpAddress.substring(0,30);
                };
            };
        };

        //구해진 문자열로 기록한다.
        const mydb=require("./sDbcommonconfigRW");
        let tdevCommon ={
            host     : mydb.host,
            user     : mydb.user,          //이때는 rw를 사용한다.
            password : mydb.password,
            database : mydb.database,
            port     : mydb.port,
            connectionLimit: mydb.connectionLimit,   
            multipleStatements: mydb.multipleStatements
        };
        
        const localBizCompCode=mydb.localBizCompCode;
        let tmpStr="";

        //4개월 지난 것은 삭제, 20분 경과한 것은 무효처리부터 한다.
        tmpStr       =" UPDATE "+mydb.database+".TB_P00_EMAIL_AUTH_LOG a \n";
        tmpStr=tmpStr+"    SET a.VALID_YN = 'N' \n";
        tmpStr=tmpStr+"  WHERE a.CREATION_DATETIME < DATE_ADD(SYSDATE(), INTERVAL - 20 MINUTE) AND a.LOCAL_BIZ_COMP_CODE = '"+localBizCompCode+"'; COMMIT; ";
        tmpStr=tmpStr+" DELETE FROM "+mydb.database+".TB_P00_EMAIL_AUTH_LOG WHERE LOCAL_BIZ_COMP_CODE = '"+localBizCompCode+"' AND CREATION_DATETIME < DATE_ADD(SYSDATE(), INTERVAL - 120 DAY); COMMIT;";

        tmpStr=tmpStr+" INSERT INTO "+mydb.database+".TB_P00_EMAIL_AUTH_LOG ( \n";
        tmpStr=tmpStr+" LOCAL_BIZ_COMP_CODE, \n";
        tmpStr=tmpStr+" REQUEST_REFERER, \n";
        tmpStr=tmpStr+" REQUEST_URL, \n";
        tmpStr=tmpStr+" REQUEST_HOST, \n";
        tmpStr=tmpStr+" REQUEST_IP_ADDRESS, \n";
        tmpStr=tmpStr+" REQUEST_FOLDER_NAME, \n";
        tmpStr=tmpStr+" REQUEST_EMAIL_ID, \n";
        tmpStr=tmpStr+" EMAIL_AUTH_CODE, \n";
        tmpStr=tmpStr+" VALID_YN, \n";
        tmpStr=tmpStr+" EMAIL_AUTH_LOG, \n";
        tmpStr=tmpStr+" CREATION_DATETIME, \n";
        tmpStr=tmpStr+" CREATION_WORKER, \n";
        tmpStr=tmpStr+" CREATION_APP_ID, \n";
        tmpStr=tmpStr+" UPDATE_DATETIME, \n";
        tmpStr=tmpStr+" UPDATE_WORKER, \n";
        tmpStr=tmpStr+" UPDATE_APP_ID, \n";
        tmpStr=tmpStr+" PURGE_PLAN_DATE, \n";
        tmpStr=tmpStr+" PURGE_WORKER, \n";
        tmpStr=tmpStr+" PURGE_APP_ID \n";
        tmpStr=tmpStr+" ) VALUES ( \n";
        tmpStr=tmpStr+" '"+localBizCompCode+"', \n";
        tmpStr=tmpStr+" '"+refererString+"', \n";
        tmpStr=tmpStr+" '"+requestUrl+"', \n";
        tmpStr=tmpStr+" '"+requestHost+"', \n";
        tmpStr=tmpStr+" '"+requestIpAddress+"', \n";
        tmpStr=tmpStr+" '"+tmpFolderName+"', \n";
        tmpStr=tmpStr+" '"+userId+"', \n";
        tmpStr=tmpStr+" '"+authcode+"', \n";
        tmpStr=tmpStr+" 'Y', \n";
        tmpStr=tmpStr+" null, \n";
        tmpStr=tmpStr+" sysdate(), \n";
        tmpStr=tmpStr+" 'SLOG', \n";
        tmpStr=tmpStr+" 'sRegisterEmailAuthCode', \n";
        tmpStr=tmpStr+" sysdate(), \n";
        tmpStr=tmpStr+" 'SLOG', \n";
        tmpStr=tmpStr+" 'sRegisterEmailAuthCode', \n";
        tmpStr=tmpStr+" null,null,null \n";
        tmpStr=tmpStr+" )";

        let mydao=require("./sDbCommonDaoForCompanyAreaUPD");

        try
        {
            let rtn=await mydao.sqlHandlerForCompanyUPD("pf0000", "RW", tdevCommon, tmpStr)
            .then((rows)=>{
                if(rows!=undefined)
                {
                    return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":"OK"};
                }
                else
                {
                    return {"errorcode":appmsg[33].messageCode, "errormessage":appmsg[33].messageText, "returnvalue":"email_auth_fail"};
                };
            });
            
            return rtn;
        }
        catch(e)
        {
            return {"errorcode":appmsg[33].messageCode, "errormessage":appmsg[33].messageText, "returnvalue":"email_auth_exception"};
        };
    }
};

module.exports=sRegisterEmailAuthCode;