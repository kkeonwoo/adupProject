/****************************************************************************************************
module명: sGetUserEnvInfo.js
creator: 안상현
date: 2022.8.30
version 1.0
설명: 본 모듈은 특정 사용자의 DB 접속환경을 구해주는 모듈
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
const e = require("express");
let jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM();
const {document} = (new JSDOM("")).window;

var sGetUserEnvInfo={
    getDBEnvInfo: async function(pLocalBizCompCode, pUserId, requestBodyRole)
    {
        const skey=require("./sKey");
        const appmsg=require("./sapplicatioerrormessage.json");
        const sc=require("./sDbconfigRO");
        //반환할 객체를 초기화해서 구성한다. return은 반드시 1개이거나 없거나 이다.
        let rtnUserInfo={
            host         : "",
            dbrouser     : "",
            dbropassword : "",
            dbrwuser     : "",
            dbrwpassword : "",
            database     : "",
            port         : "",
            connectionLimit: -1,
            multipleStatements: true,
            pLocalBizCompCode: ""
        };

        //로그인 역할자의 정의를 확인 - 목요일 할일
        const mr=require("./sMyRole.js");
        let myrole=mr.getMyRoleCode(requestBodyRole);
        if(myrole!="ERROR")
        {
            let tmpStr      = "SELECT CONVERT(AES_DECRYPT(UNHEX(a.DB_IP_E),SHA2(CONCAT(DATE_FORMAT(a.CREATION_DATETIME,'%Y-%m-%d %H:%i:%s'),'"+skey.salt_sjgo+"'),512)) USING UTF8) AS DB_IP_ADDRESS \n";
            tmpStr = tmpStr + "     , CONVERT(AES_DECRYPT(UNHEX(a.DB_RO_ID_E),SHA2(CONCAT(DATE_FORMAT(a.CREATION_DATETIME,'%Y-%m-%d %H:%i:%s'),'"+skey.salt_sjgo+"'),512)) USING UTF8) AS DB_RO_ID \n";
            tmpStr = tmpStr + "     , CONVERT(AES_DECRYPT(UNHEX(a.DB_RO_PWD_E),SHA2(CONCAT(DATE_FORMAT(a.CREATION_DATETIME,'%Y-%m-%d %H:%i:%s'),'"+skey.salt_sjgo+"'),512)) USING UTF8) AS DB_RO_PASSWORD \n";
            tmpStr = tmpStr + "     , CONVERT(AES_DECRYPT(UNHEX(a.DB_RW_ID_E),SHA2(CONCAT(DATE_FORMAT(a.CREATION_DATETIME,'%Y-%m-%d %H:%i:%s'),'"+skey.salt_sjgo+"'),512)) USING UTF8) AS DB_RW_ID \n";
            tmpStr = tmpStr + "     , CONVERT(AES_DECRYPT(UNHEX(a.DB_RW_PWD_E),SHA2(CONCAT(DATE_FORMAT(a.CREATION_DATETIME,'%Y-%m-%d %H:%i:%s'),'"+skey.salt_sjgo+"'),512)) USING UTF8) AS DB_RW_PASSWORD \n";
            tmpStr = tmpStr + "     , a.DB_SCHEMA \n";
            tmpStr = tmpStr + "     , a.DB_PORT \n";
            tmpStr = tmpStr + "     , a.DB_CONNECTION_LIMIT \n";
            tmpStr = tmpStr + "     , a.DB_MULTIPLE_STATEMENTS \n";
            tmpStr = tmpStr + "     , a.LOCAL_BIZ_COMP_CODE \n";
            tmpStr = tmpStr + "  FROM "+sc.database+".tb_s00_account_of_member a \n";
            tmpStr = tmpStr + " WHERE 1=1 \n";
            tmpStr = tmpStr + "   AND a.LOCAL_BIZ_COMP_CODE     = ? \n";
            tmpStr = tmpStr + "   AND a.ACCOUNT_ROLE            = ? \n";
            tmpStr = tmpStr + "   AND a.ACCOUNT_EMAIL_ID        = ? ";

            try{
                let tdev ={host: sc.host, user: sc.user, password: sc.password, database: sc.database, port: sc.port, connectionLimit: sc.connectionLimit, multipleStatements: sc.multipleStatements};
                let mydao=require("./sDbCommonDaoForCompanyAreaUPD");
                let rtnEnvInfo=await mydao.sqlHandlerForCompanyUPD(pLocalBizCompCode,"RO",tdev,tmpStr,[pLocalBizCompCode, myrole, pUserId])
                .then((rows)=>{
                    if(rows.length>0)
                    {
                        rtnUserInfo.host             =rows[0].DB_IP_ADDRESS;
                        rtnUserInfo.dbrouser         =rows[0].DB_RO_ID;
                        rtnUserInfo.dbropassword     =rows[0].DB_RO_PASSWORD;
                        rtnUserInfo.dbrwuser         =rows[0].DB_RW_ID;
                        rtnUserInfo.dbrwpassword     =rows[0].DB_RW_PASSWORD;
                        rtnUserInfo.database         =rows[0].DB_SCHEMA;
                        rtnUserInfo.port             =rows[0].DB_PORT;
                        rtnUserInfo.connectionLimit  =rows[0].DB_CONNECTION_LIMIT;
                        rtnUserInfo.pLocalBizCompCode =rows[0].LOCAL_BIZ_COMP_CODE;
                        let tmp=rows[0].DB_MULTIPLE_STATEMENTS;

                        if(tmp.toUpperCase()=="TRUE"){rtnUserInfo.multipleStatements=true;}
                        else{rtnUserInfo.multipleStatements=false;};
                        return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":rtnUserInfo};
                    }
                    else
                    {
                        return {"errorcode":appmsg[12].messageCode, "errormessage":appmsg[12].messageText, "returnvalue":rtnUserInfo};
                    }
                });
                
                return rtnEnvInfo;
            }
            catch(e)
            {
                return {"errorcode":appmsg[81].messageCode, "errormessage":appmsg[81].messageText, "returnvalue":e.message};
            };
        }
        else
        {
            return {"errorcode":appmsg[82].messageCode, "errormessage":appmsg[82].messageText, "returnvalue":""};
        };
    }
};

module.exports=sGetUserEnvInfo;