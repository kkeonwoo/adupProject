/****************************************************************************************************
module명: sPageControlCommonITPage.js
creator: 안상현
date: 2022.9.16
version 1.0
설명: 모든 중 it로 시작하는 Page를 처리할때 수행하는 공통 부분
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
var sPageControlCommonITPage={
    pageProcessIT: async function(request, response, tmpUrl, recUrl, tmpRootdirname, platformMainUrl)
    {
        if(request.headers.referer===undefined||request.headers.referer===null)
        {
            tmpUrl=request.url;
        }
        else
        {
            //만일 이전 페이지로부터 되돌아오는 중이라면 refere에는 이전 page가 들어가고,  request.url은 현재 로딩하려는page 가 들어가므로
            //처음 불러지는 것인지 이전 페이지에서 돌아오는 것인지를 판단해야 한다.
            if(request.url.indexOf(recUrl)>-1)
            {
                tmpUrl=recUrl;
            }
            else
            {
                tmpUrl=request.headers.referer;
                if(tmpUrl.indexOf("https://")>-1){tmpUrl=tmpUrl.replace("https://","");}
                else{tmpUrl=tmpUrl.replace("http://","");};
                tmpUrl=tmpUrl.replace(request.headers.host,"");
            };
        };
        //양끝에 공백을 제거한다.
        tmpUrl=tmpUrl.trim();
        //마지막이 /로 끝났다면 제거한다.
        if(tmpUrl.substr(tmpUrl.length-1,1)=="/")
        {
            tmpUrl=tmpUrl.substr(0,tmpUrl.length-1);
        };

        let nowUrlPage=tmpUrl;
        let pf=require("./sGetUrlFileName");
        let tmpFileName=await pf.getFileName(nowUrlPage);
        let tmpFolderName=pf.getFolderName(request.headers.referer, request.url, request.protocol, request.headers.host);
        if(tmpFolderName.length<1)
        {
            //폴더 못구하면 platform main으로 보낸다.
            response.sendFile(tmpRootdirname+platformMainUrl);
        }
        else
        {
            //이미 로그아웃 상태라면 로그인으로 돌려보낸다.  단 로그아웃 상태에서 동작가능한 페이지는 그냥 사용할 수 있도록 응답하면 된다.
            if(tmpFileName.substr(0,2)=="it")
            {
                if(tmpUrl.indexOf("?") > -1) tmpUrl = tmpUrl.split("?")[0];
                
                response.sendFile(tmpRootdirname+"/"+tmpUrl);
            }
            else
            {
                //20220627 안상현 쿠키Check 방법 변경 (새로운 모듈로 대체)
                let chkCookie=require("./sCheckCookieParams.js");
                let chkRtn=chkCookie.chkTokenExist(request.headers.cookie);
                if(chkRtn==false)
                {
                    response.redirect(302, "/main/login.html");
                }
                else
                {
                    response.sendFile(tmpRootdirname+"/"+tmpUrl);
                };
            };
        };
    }
};

module.exports=sPageControlCommonITPage;

