/****************************************************************************************************
module명: sPageControlCommon.js
creator: 안상현
date: 2022.9.6
version 1.0
설명: 모든 Page를 처리할때 수행하는 공통 부분
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
const {request}=require("http");
var sPageControlCommon={
    pageProcess: async function(tmpFileName, tmpDirName, nowUrlPage, tmpFolderName, myLoginPage, request, response)
    {
        if(nowUrlPage.indexOf("?") > -1) nowUrlPage = nowUrlPage.split("?")[0];
        //it로 시작했거나 주소검색창인 경우는 허용한다.
        if(tmpFileName.substr(0,2)=="it"||tmpFileName=="cAddrPopup.html"||tmpFileName=="main.html")
        {
            //바로 보여준다.
            response.sendFile(tmpDirName+nowUrlPage);
        }
        else
        {
            //토큰 verify
            //토큰 없으면 로그인창으로 redirect한다.
            //20220627 안상현 쿠키Check 방법 변경 (새로운 모듈로 대체)
            let chkCookie=require("./sCheckCookieParams.js")
            let chkRtn=chkCookie.chkTokenExist(request.headers.cookie);
            if(chkRtn==false)
            {
                response.redirect(302,"/main/login.html");
            }
            else
            {
                const cookie=require("cookie");
                let pcookie=cookie.parse(request.headers.cookie);
                
                let acTokenFromRequest=pcookie.accessToken;
                let rfTokenFromRequest=pcookie.refreshToken;

                //토큰을 체크하는 규칙은 아래 sCheckTokenCase 설명란을 참고할 것
                let rtnc=require("./sCheckTokenCase");
                let returnCheckToken=await rtnc.checkTokenStatus(acTokenFromRequest, rfTokenFromRequest, tmpFileName, tmpDirName, nowUrlPage, tmpFolderName, request, "sPageControlCommon.js", pcookie.myrole);

                if(returnCheckToken.returnvalue=="A" || returnCheckToken.returnvalue=="" || returnCheckToken.returnvalue==null)
                {
                    response.redirect(302, "/"+tmpFolderName+"/"+myLoginPage);
                }
                else if(returnCheckToken.returnvalue=="B")
                {
                    let newRefreshToken=returnCheckToken.returnRefreshToken;
                    response.cookie("refreshToken", newRefreshToken);

                    //그 후 정상진행
                    response.status(200).sendFile(tmpDirName+nowUrlPage);
                }
                else if(returnCheckToken.returnvalue=="C")
                {
                    //이때는 새로운 access token이 반환된다.
                    let newAccessToken=returnCheckToken.returnAccessToken;
                    response.cookie("accessToken", newAccessToken);

                    //그후 정상진행
                    response.sendFile(tmpDirName+nowUrlPage);
                }
                else if(returnCheckToken.returnvalue=="D")
                {
                    //별도 조치 없이 정상진행
                    response.status(200).sendFile(tmpDirName+nowUrlPage);
                }
                else
                {
                    response.redirect(302, "/main/login.html");
                };
            };
        };
    }
};

module.exports=sPageControlCommon;

