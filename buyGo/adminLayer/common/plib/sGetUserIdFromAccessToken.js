/****************************************************************************************************
module명: sGetUserIdFromAccessToken.js
creator: 안상현
date: 2022.9.13
version 1.0
설명: 본 모듈은 access 토큰을 가지고 payload안에 들어 있는 로그인 user를 찾아오는 공통 모듈임
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
var sGetUserIdFromAccessToken={
    sGetUserId: function(request, opt)
    {
        if((request.headers.cookie==undefined||request.headers.cookie==null)||
           ((request.headers.cookie.toLowerCase().indexOf("refresh")<0)||
            (request.headers.cookie.toLowerCase().indexOf("access")<0)))
        {
            //emty character return
            return "";
        }
        else
        {
            const cookie=require("cookie");
            let pcookie=cookie.parse(request.headers.cookie);
            let acTokenFromRequest=pcookie.accessToken;

            let base64JWTPayload=acTokenFromRequest.split(".")[1]; //0: header, 1: payload, 2: VERIFY SIGNATURE
            let acessTokenPayload=Buffer.from(base64JWTPayload, "base64");
            let resultParsedAccessToken=JSON.parse(acessTokenPayload.toString());
            let accessTokenUserId=resultParsedAccessToken.email;

            //값이 없으면 없다고 반환
            if(accessTokenUserId.length<1){return "cannot find";};

            if(opt=="short")
            {
                //@가 있으면 @앞부분만 return
                if(accessTokenUserId.length>30)
                {
                    accessTokenUserId=accessTokenUserId.substring(0,30);
                };

                if(accessTokenUserId.indexOf("@")>-1)
                {
                    let tId=accessTokenUserId.substring(0,accessTokenUserId.indexOf("@"));
                    return tId;
                }
                else
                {
                    return accessTokenUserId;
                };
            }
            else
            {
                //@를 포함한 full string으로 return
                return accessTokenUserId;
            };
        };
    }
};

module.exports=sGetUserIdFromAccessToken;

