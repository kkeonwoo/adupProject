/****************************************************************************************************
module명: sLogout.js
creator: 안상현
date: 2022.9.6
version 1.0
설명: 본 모듈은 Logout을 수행한다.
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
const { createCipheriv } = require("crypto");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
var sLogout={
    fLogout: async function(tdev, myCommonSchema, myLocalBizCompCode, accessTokenUserId, requestBodyRole, pRfTokenFromRequest)
    {
        const appmsg=require("./sapplicatioErrorMessage.json");
        const mr=require("./sMyRole.js");
        let myrole=mr.getMyRoleCode(requestBodyRole);

        let tmpStr   ="DELETE FROM "+myCommonSchema+".TB_P00_ACCOUNT_TOKEN \n";
        tmpStr=tmpStr+" WHERE 1=1 \n";
        tmpStr=tmpStr+"   AND LOCAL_BIZ_COMP_CODE   =   ? \n";
        tmpStr=tmpStr+"   AND ACCOUNT_ROLE          =   ? \n";
        tmpStr=tmpStr+"   AND ACCOUNT_REFRESH_TOKEN =   ? \n";
        tmpStr=tmpStr+"   AND ACCOUNT_EMAIL_ID      =   ?";
        //기존 token을 삭제하고 insert한다.
        let sLogin_mydao=require("./sDbCommonDaoForCompanyAreaUPD");
        try
        {
            let rtnInfo=await sLogin_mydao.sqlHandlerForCompanyUPD(myLocalBizCompCode,"RW",tdev,tmpStr,[myLocalBizCompCode, myrole, pRfTokenFromRequest, accessTokenUserId])
                        .then((rows)=>{
                            return {"errorcode":appmsg[31].messageCode, "errormessage":appmsg[31].messageText, "returnvalue":""};
                        });

            return rtnInfo;
        }
        catch(e)
        {
            return {"errorcode":appmsg[81].messageCode, "errormessage":appmsg[81].messageText, "returnvalue":""};
        };
    }
};

module.exports=sLogout;