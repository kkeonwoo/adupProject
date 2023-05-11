/****************************************************************************************************
module명: sLogoutAjaxProc.js
creator: 안상현
date: 2022.9.5
version 1.0
설명: logout 처리 공통 모듈 (타 법인의 인증규칙이 현재 구현해 놓은 것과 같다면 다른 법인 처리도 가능하지만, 그것을 테스트를 해봐야 함)
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
const requestIp=require("request-ip");
const appmsg=require("./sapplicatioErrorMessage.json"); 
let jsdom = require("jsdom");
const {JSDOM}=jsdom;
const {window}=new JSDOM();
const {document}=(new JSDOM("")).window;
const $=require("jquery")(window);

var sLogoutAjaxProc={
    procLogoutAjax: async function(request, response)
    {
        // let tmpUrl=request.headers.referer;
        // if(tmpUrl.indexOf("https://")>-1){tmpUrl=tmpUrl.replace("https://","");}
        // else{tmpUrl=tmpUrl.replace("http://","");};
        // tmpUrl=tmpUrl.replace(request.headers.host,"");
        // let nowUrlPage=tmpUrl;
        // let pf=require("./sGetUrlFileName");
        // let tmpFileName=await pf.getFileName(nowUrlPage);
        // let tmpFolderName=pf.getFolderName(request.headers.referer, request.url, request.protocol, request.headers.host);

        // let myLoginPage=chkLog.getMyLoginPage(request.headers.referer, request.url, request, tmpFolderName);
        // let chkRtn=chkCookie.chkTokenExist(request.headers.cookie);
        const cookie=require("cookie");
        let pcookie=cookie.parse(request.headers.cookie);
        
        let acTokenFromRequest=pcookie.accessToken;
        let rfTokenFromRequest=pcookie.refreshToken;

        if(acTokenFromRequest===undefined||acTokenFromRequest===null||acTokenFromRequest==="")
        {
            //쿠키가 없으므로 로그인으로 돌려보낸다.
            response.redirect(302,"/main/login.html");
        }
        else
        {
            //모든 쿠키를 destroy 하고 db에서도 delete처리한다.
            let base64JWTPayload=acTokenFromRequest.split(".")[1]; //0: header, 1: payload, 2: VERIFY SIGNATURE
            let acessTokenPayload=Buffer.from(base64JWTPayload, "base64");
            let resultParsedAccessToken=JSON.parse(acessTokenPayload.toString());
            //iss 값으로 bizCode를 찾는다.
            let st=require("./sToken.json");
            let tmpTkInfo=st.filter(function(item, index, arr2){return item.uDirectory==resultParsedAccessToken.iss});
            //구해진 폴더 이름으로 소속법인의 스키마를 찾는다.
            const myOwnerSchema=tmpTkInfo[0].ownerSchema;
            const myCommonSchema=tmpTkInfo[0].commonSchema;
            const myLocalBizCompCode=tmpTkInfo[0].localBizCompCode;
            let accessTokenUserId=resultParsedAccessToken.email;

            //사용자db환경 구하기
            let ue=require("./sGetUserEnvInfo");
            let myDbInfo=await ue.getDBEnvInfo(myLocalBizCompCode, accessTokenUserId, request.body.myrole);
            let responseData;
            if(myDbInfo.errorcode=="PFERR_CONF_0000")
            {
                let tdev=require("./sDbcommonconfigRW");
                let logout=require("./sLogout.js");
                let rtn=await logout.fLogout(tdev, myCommonSchema, myLocalBizCompCode, accessTokenUserId, request.body.myrole, rfTokenFromRequest)

                response.clearCookie("accessToken");
                response.clearCookie("refreshToken");
                response.clearCookie("autoLoginYN");
                response.clearCookie("myrole");
                response.clearCookie("autoLoginYN");
                response.clearCookie("resX");
                //return value에 로그아웃하고 넘어갈 다음 page정보를 제공한다.
                let retPage="http://"+request.headers.host+"/main/login.html";
                responseData={"errorcode": rtn.errorcode, "errormessage": rtn.errormessage, "returnvalue" : retPage};
                response.json(responseData);
                //response.redirect("/main/login.html");
            }
            else
            {
                //사용자 환경을 못 구했을 경우 쿠키만 초기화한다.
                response.clearCookie("accessToken");
                response.clearCookie("refreshToken");
                response.clearCookie("autoLoginYN");
                response.clearCookie("myrole");
                response.clearCookie("autoLoginYN");
                response.clearCookie("resX");
                let retPage="http://"+request.headers.host+"/main/login.html";
                responseData={"errorcode": appmsg[31].messageCode, "errormessage": appmsg[31].messageText, "returnvalue" : retPage};
                response.json(responseData);
                //response.redirect("/main/login.html");
            };
        };
    }
};

module.exports=sLogoutAjaxProc;