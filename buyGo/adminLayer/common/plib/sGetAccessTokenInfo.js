/****************************************************************************************************
module명: sGetAccessTokenInfo.js
creator: 안상현
date: 2022.09.13
version 1.0
설명: 본 모듈은 Acess Token을 가지고 관련 정보를 취득하는 공통모듕임
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
var sGetAccessTokenInfo={
    getAccessTokenInfo: function(request)
    {
        if(request.headers.cookie!=undefined&&request.headers.cookie!=null&&request.headers.cookie!="")
        {
            const cookie=require("cookie");
            let pcookie=cookie.parse(request.headers.cookie);
            let accessToken=pcookie.accessToken;
            let refreshToken=pcookie.refreshToken;
            let requestCookieRole="";
            let rtn={};
            rtn.error="ERROR";

            if(accessToken!=undefined&&accessToken!=null&&accessToken!="")
            {
                if(request.body.myrole!=undefined&&request.body.myrole!=null&&request.body.myrole!="")
                {
                    requestCookieRole=request.body.myrole;
                }
                else if(pcookie.myrole!=undefined&&pcookie.myrole!=null&&pcookie.myrole!="")
                {
                    requestCookieRole=pcookie.myrole;
                };

                let base64JWTPayload=accessToken.split(".")[1]; //0: header, 1: payload, 2: VERIFY SIGNATURE
                let acessTokenPayload=Buffer.from(base64JWTPayload, "base64");
                let resultParsedAccessToken=JSON.parse(acessTokenPayload.toString());
                //iss 값으로 bizCode를 찾는다.
                let st=require("./sToken.json");
                let tmpTkInfo=st.filter(function(item, index, arr2){return item.uDirectory==resultParsedAccessToken.iss});
                
                if(tmpTkInfo.length>0)
                {
                    rtn.error="OK";
                    rtn.ownerSchema=tmpTkInfo[0].ownerSchema;
                    rtn.commonSchema=tmpTkInfo[0].commonSchema;
                    rtn.localBizCompCode=tmpTkInfo[0].localBizCompCode;
                    rtn.userId=resultParsedAccessToken.email;
                    rtn.requestCookieRole=requestCookieRole;
                };
            };
            
            return rtn;
        }
        else
        {
            //쿠키가 없으면 null object로 return 한다.
            let rtn={};
            rtn.error="ERROR";
            return rtn;
        };
    }
};

module.exports=sGetAccessTokenInfo;