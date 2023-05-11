/****************************************************************************************************
module명: sCheckTokenInfoCommonDB.js
creator: 안상현
date: 2022.09.02
version 1.0
설명: 본 모듈은 refresh token을 가지고 이용자id를 식별 반환하는 모듈이다.
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
var jsdom=require("jsdom");
const {JSDOM}=jsdom;
const {window}=new JSDOM();
var sCheckTokenInfoCommonDB={
    checkTokenInfoCommonDB: async function(pLocalBizCompCode, rfToken, pMyRole)
    {
        const appmsg=require("./sapplicatioErrorMessage.json");
        const comm=require("./sDbcommonconfig");
        const sKey=require("./sKey");
        const mr=require("./sMyRole");
        let myrole=mr.getMyRoleCode(pMyRole);
        let tdev ={
            host     : comm.host,
            user     : comm.user,          //이때는 ro를 사용한다.
            password : comm.password,
            database : comm.database,
            port     : comm.port,
            connectionLimit: comm.connectionLimit,   
            multipleStatements: comm.multipleStatements
        };

        let tmpStr =      "SELECT a.ACCOUNT_EMAIL_ID AS ACCOUNT_EMAIL_ID \n";
        tmpStr = tmpStr + "  FROM "+comm.database+".tb_p00_account_token a \n";
        tmpStr = tmpStr + " WHERE a.LOCAL_BIZ_COMP_CODE     = ? \n";
        tmpStr = tmpStr + "   AND a.ACCOUNT_REFRESH_TOKEN   = ? \n";
        tmpStr = tmpStr + "   AND a.ACCOUNT_ROLE            = ? \n";
        tmpStr = tmpStr + " ORDER BY a.UPDATE_DATETIME DESC \n";
        tmpStr = tmpStr + " LIMIT 1 ";

        let mydao=require("./sDbCommonDaoForCompanyAreaUPD"); 
        let rtn =await mydao.sqlHandlerForCompanyUPD(pLocalBizCompCode, "RO", tdev, tmpStr, [pLocalBizCompCode, rfToken, myrole])
        .then((rows)=>{
            if(rows.length==1)
            {
                return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":rows};
            }
            else
            {
                //1건이 아니면 Error
                return {"errorcode":appmsg[53].messageCode, "errormessage":appmsg[53].messageText, "returnvalue":""};
            };
        });
        return rtn;
    },
    checkTokenMembership: async function(pLocalBizCompCode, rfToken, pMyRole)
    {
        const appmsg=require("./sapplicatioErrorMessage.json");
        const comm=require("./sDbcommonconfig");
        const sKey=require("./sKey");
        const mr=require("./sMyRole");
        let myrole=mr.getMyRoleCode(pMyRole);
        let tdev ={
            host     : comm.host,
            user     : comm.user,          //이때는 ro를 사용한다.
            password : comm.password,
            database : comm.database,
            port     : comm.port,
            connectionLimit: comm.connectionLimit,   
            multipleStatements: comm.multipleStatements
        };

        let tmpStr      = "SELECT a.TOKEN_MEMBERSHIP AS TOKEN_MEMBERSHIP \n";
        tmpStr = tmpStr + "  FROM "+comm.database+".tb_p00_account_token a \n";
        tmpStr = tmpStr + " WHERE a.LOCAL_BIZ_COMP_CODE   = ? \n";
        tmpStr = tmpStr + "   AND a.ACCOUNT_REFRESH_TOKEN = ?  \n";
        tmpStr = tmpStr + "   AND a.ACCOUNT_ROLE          = ? \n";
        tmpStr = tmpStr + " ORDER BY a.UPDATE_DATETIME DESC \n";
        tmpStr = tmpStr + " LIMIT 1 ";

        let mydao=require("./sDbCommonDaoForCompanyAreaUPD"); 
        let rtn =await mydao.sqlHandlerForCompanyUPD(pLocalBizCompCode, "RO", tdev, tmpStr, [pLocalBizCompCode, rfToken, myrole])
        .then((rows)=>{
            if(rows.length==1)
            {
                return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":rows};
            }
            else
            {
                //1건이 아니면 Error
                return {"errorcode":appmsg[53].messageCode, "errormessage":appmsg[53].messageText, "returnvalue":""};
            };
        });
        return rtn;
    }
};
module.exports=sCheckTokenInfoCommonDB;