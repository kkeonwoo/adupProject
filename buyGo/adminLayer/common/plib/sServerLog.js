/****************************************************************************************************
module명: sServerLog.js
creator: 안상현
date: 2021.12.10
version 1.0
설명: HTTP Server Log Exception Logging Module
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
const e = require("express");
var sServerLog={
    serverLogging: async function(nowUrl, req, res, e)
    {
        let refererString="";
        let reqUrl="";
        let reqHost="";
        let reqIpAddress="";
        let errorMessage="";

        //e.message + e.stack 내용을 종합한다.
        if(e.message.length>0)
        {
            if(e.stack.length>0)
            {
                if(e.stack.length>2000)
                {
                    errorMessage=e.message+"/"+e.stack.substring(0,2000);
                }
                else
                {
                    errorMessage=e.message+"/"+e.stack;
                };
            }
            else
            {
                errorMessage=e.message;
            };
        }
        else
        {
            if(e.stack.length>0)
            {
                if(e.stack.length>2000)
                {
                    errorMessage=e.stack.substring(0,2000);
                }
                else
                {
                    errorMessage=e.stack;
                };
            }
            else
            {
                errorMessage="e.message and stack is empty!";
            };
        };

        if(req!=undefined&&req!=null)
        {
            //request referer , request url, request host 를 구한다. 
            if(req.headers.referer!=undefined&&req.headers.referer!=null)
            {
                refererString=req.headers.referer;
                if(refererString.length>200)
                {
                    refererString=refererString.substring(0,200);
                };
            };

            if(req.url!=undefined&&req.url!=null)
            {
                reqUrl=req.url;
                if(reqUrl.length>200)
                {
                    reqUrl=reqUrl.substring(0,200);
                };
            };

            if(req.headers.host!=undefined&&req.headers.host!=null)
            {
                reqHost=req.headers.host;
                if(reqHost.length>50)
                {
                    reqHost=reqHost.substring(0,50);
                };
            };

            if(req.ip!=undefined&&req.ip!=null)
            {
                reqIpAddress=req.ip;
                if(reqIpAddress.length>30)
                {
                    reqIpAddress=reqIpAddress.substring(0,30);
                };
            };
        };
        
        //구해진 문자열로 기록한다.
        const sc=require("./sDbcommonconfigRW");
        let temp_settingObj ={
            host     : sc.host,
            user     : sc.user,          //이때는 rw를 사용한다.
            password : sc.password,
            database : sc.database,
            port     : sc.port,
            connectionLimit: sc.connectionLimit,   
            multipleStatements: sc.multipleStatements
        };
        
        //2022.05.10 reqUrl 2000 over chedk
        if(reqUrl.length>2000)
        {
            reqUrl=reqUrl.substring(0,2000);
        };

        let tmpStr   ="INSERT INTO sjcommon.TB_P00_SERVER_LOG ( \n";
        tmpStr=tmpStr+" REQUEST_REFERER, \n";
        tmpStr=tmpStr+" REQUEST_URL, \n";
        tmpStr=tmpStr+" REQUEST_HOST, \n";
        tmpStr=tmpStr+" REQUEST_IP_ADDRESS, \n";
        tmpStr=tmpStr+" HTTP_SERVER_LOG, \n";
        tmpStr=tmpStr+" PARTITION_KEY_YYYYMM, \n";
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
        tmpStr=tmpStr+" '"+refererString+"', \n";
        tmpStr=tmpStr+" '"+reqUrl+"', \n";
        tmpStr=tmpStr+" '"+reqHost+"', \n";
        tmpStr=tmpStr+" '"+reqIpAddress+"', \n";

        //error문자열에 특수문자 ' 등이 있으면 SQL 처리시 문제가 되기 때문에 제거한다.
        if(errorMessage.length>0)
        {
            errorMessage=errorMessage.replace(/\'/g,"");
            errorMessage=errorMessage.replace(/\"/g,"");
            errorMessage=errorMessage.replace(/\\n/g,"");
        };

        tmpStr=tmpStr+" '"+errorMessage+"', \n";

        const sd=require("./sDateFormat");
        let tmpServerTime=sd.sDateFormat_dateFormatChange(new Date(), "YYYY-MM-DD HH:MM:SS");

        tmpStr=tmpStr+" "+tmpServerTime.substring(0,4)+tmpServerTime.substring(5,7)+", \n";
        tmpStr=tmpStr+" STR_TO_DATE('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'), \n";
        tmpStr=tmpStr+" 'SLOG', \n";
        tmpStr=tmpStr+" 'sServerLog', \n";
        tmpStr=tmpStr+" STR_TO_DATE('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'), \n";
        tmpStr=tmpStr+" 'SLOG', \n";
        tmpStr=tmpStr+" 'sServerLog', \n";
        tmpStr=tmpStr+" null,null,null \n";

        tmpStr=tmpStr+" )";

        let sLogin_mydao=require("./sDbCommonDaoForCompanyAreaUPD");

        try{
            let checkAccount=await sLogin_mydao.sqlHandlerForCompanyUPD("pf0000", "RW", temp_settingObj, tmpStr)
                            .then((rows)=>{
                                return null;
                            });

            //사실 강제로 insert logging하는 것이기 때문에 return할 Error는 없다. 어차피 Error가 나도 더 받아줄 Top Process가 없다.
            return "OK";
        }
        catch(e)
        {
            return e.message;
        };
    }
};

module.exports=sServerLog;