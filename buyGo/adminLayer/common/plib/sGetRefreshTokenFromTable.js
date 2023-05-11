/****************************************************************************************************
module명: sGetRefreshTokenFromTable.js
creator: 안상현
date: 2022.9.2
version 1.0
설명: 주어진 id에 대한 RefreshToken을 DB에서 읽어오는 모듈
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

var sGetRefreshTokenFromTable={
    getRefreshTokenFromDB: async function(localBizCompCode, userId, request, pDeterminedMyrole)
    {
        const appmsg=require("./sapplicatioErrorMessage.json");
        const dbcomm=require("./sDbcommonconfig");

        const mr=require("./sMyRole");
        let myrole=mr.getMyRoleCode(pDeterminedMyrole);

        //주어진 id에 대한 Refresh Token값을 전달한다.
        let tmpStr   ="SELECT ACCOUNT_REFRESH_TOKEN \n";
        tmpStr=tmpStr+"  FROM "+dbcomm.database+".TB_P00_ACCOUNT_TOKEN \n";
        tmpStr=tmpStr+" WHERE 1=1 \n";
        tmpStr=tmpStr+"   AND LOCAL_BIZ_COMP_CODE   = ? \n";
        tmpStr=tmpStr+"   AND ACCOUNT_ROLE          = ? \n";
        tmpStr=tmpStr+"   AND ACCOUNT_EMAIL_ID      = ? \n";

        let tdev ={
            host     : dbcomm.host,
            user     : dbcomm.user,
            password : dbcomm.password,
            database : dbcomm.database,
            port     : dbcomm.port,
            connectionLimit: dbcomm.connectionLimit,
            mutipleStatements: dbcomm.multipleStatements
        };

        let sLogin_mydao=require("./sDbCommonDaoForCompanyAreaUPD");
        let checkAccount=await sLogin_mydao.sqlHandlerForCompanyUPD(localBizCompCode, "RO", tdev, tmpStr, [localBizCompCode, myrole, userId])
        .then((rows)=>{
            if(rows.length>0)
            {   
                //let rfToken=rows[0].REFRESH_TOKEN;
                //20220902 이전과는 달리 refresh token이 복수로 전달된다.
                return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":rows};
            }
            else
            {
                //사용자 정보 없음 (유효하지 않은 접근)- 빈 object로 전달한다.
                return {"errorcode":appmsg[5].messageCode, "errormessage":appmsg[5].messageText, "returnvalue":{}};
            };
        });

        return checkAccount;
    }
};

module.exports=sGetRefreshTokenFromTable;