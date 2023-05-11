/****************************************************************************************************
module명: sGetUserGuideDB.js
creator: 안상현
date: 2022.09.13
version 1.0
설명: 본 모듈은 이용약관 및 안내 본문을 DB에서 읽어서 클라이언트에 내려보내는 모듈이다.
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
var sGetUserGuideDB={
    getDBUserGuideInfo: async function(request, response, subject)
    {
        const appmsg=require("./sapplicatioErrorMessage.json");
        //현재의 url을 가져와서 https가 아닌경우 https로 변경해주고
		let tmpUrl=request.headers.referer;
        if(tmpUrl.indexOf("https://")>-1){tmpUrl=tmpUrl.replace("https://","");}
        else{tmpUrl=tmpUrl.replace("http://","");};
        tmpUrl=tmpUrl.replace(request.headers.host,"");
        
        //현재의 url에서 폴더명과 파일명을 가져온다.
        let nowUrlPage=tmpUrl;
        let pf=require("./sGetUrlFileName");
        let tmpFileName=await pf.getFileName(nowUrlPage);
        let tmpFolderName=pf.getFolderName(request.headers.referer, request.url, request.protocol, request.headers.host);
        
        let myLoginPage="/main/login.html"
        let tabCode=-1;

        //subject를 tabCode로 치환해준다.
        if(subject=="1"){
            tabCode=7;
        }else if(subject=="2"){
            tabCode=8;
        }else if(subject=="3"){
            tabCode=9;
        }else{
            tabCode=subject;
        };

        //쿼리 입력
        let tmpStr="SELECT A.AGREEMENT_HEADER_COMMENTS \n";
        tmpStr   +="     , A.AGREEMENT_DETAIL_COMMENTS \n";
        tmpStr   +="     , A.AGREEMENT_CONTENTS \n";
        tmpStr   +="  FROM sjgo.TB_S00_AGREEMENTS_MASTER A \n";
        tmpStr   +=" WHERE 1=1 \n";
        tmpStr   +="   AND A.LOCAL_BIZ_COMP_CODE = ? \n";
        tmpStr   +="   AND A.AGREEMENT_HEADER_VERSION = (SELECT MAX(X.AGREEMENT_HEADER_VERSION) \n";
        tmpStr   +="                                       FROM sjgo.TB_S00_AGREEMENTS_MASTER X \n";
        tmpStr   +="                                      WHERE 1=1 \n";
        tmpStr   +="                                        AND X.LOCAL_BIZ_COMP_CODE = ? \n";
        tmpStr   +="                                        AND X.AGREEMENT_HEADER_NO=?) \n";
        tmpStr   +="   AND A.AGREEMENT_HEADER_NO = ? \n";
        tmpStr   +=" ORDER BY A.AGREEMENT_DETAIL_NO ASC ";

        //쿠키 체크 해서
        //20220627 안상현 쿠키Check 방법 변경 (새로운 모듈로 대체)
        let chkCookie=require("./sGetAccessTokenInfo")
        let chkRtn=chkCookie.getAccessTokenInfo(request);
        if(chkRtn.error=="ERROR")
        {
            //쿠키가 없을 때는 강제 지정
            let mydb = require("./sDbconfigRO");
            const myLocalBizCompCode = mydb.localBizCompCode;
            
            let temp_settingObj ={
                host     : mydb.host,
                user     : mydb.user,          //이때는 RO를 사용한다.
                password : mydb.password,
                database : mydb.database,
                port     : mydb.port,
                connectionLimit: mydb.connectionLimit,   
                multipleStatements: mydb.multipleStatements
            };

            let sUserAccount_mydao=require("./sDbCommonDaoForCompanyAreaUPD");
            let resMenuList=await sUserAccount_mydao.sqlHandlerForCompanyUPD(myLocalBizCompCode, "RO", temp_settingObj,tmpStr,[myLocalBizCompCode , myLocalBizCompCode, tabCode, tabCode])
                            .then((rows)=>{
                                if(rows.length>0)
                                {
                                    return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":rows};
                                }
                                else
                                {
                                    //사용자 정보 없음 (유효하지 않은 접근)
                                    return {"errorcode":appmsg[50].messageCode, "errormessage":appmsg[50].messageText, "returnvalue":""};
                                };
                            });
            return resMenuList;
        }
        else{
            //쿠키가 있을 때
            const cookie=require("cookie");
            let pcookie=cookie.parse(request.headers.cookie);
            let acTokenFromRequest=pcookie.accessToken;
            let rfTokenFromRequest=pcookie.refreshToken;

            //토큰을 체크하는 규칙은 아래 sCheckTokenCase 설명란을 참고할 것
            let rtnc= require("./sCheckTokenCase");
            //2022.6.1 안상현 - 뒤에 인자 2개 추가
            let returnCheckToken=await rtnc.checkTokenStatus(acTokenFromRequest, rfTokenFromRequest, tmpFileName, request.headers.host, nowUrlPage, tmpFolderName, request, "sGetUserGuideDB.js", pcookie.myrole);
            
            if(returnCheckToken.returnvalue=="A" || returnCheckToken.returnvalue=="" || returnCheckToken.returnvalue==null)
            {
                let mydb = require("./sDbconfigRO");
                const myLocalBizCompCode = mydb.localBizCompCode;
                
                let temp_settingObj ={
                    host     : mydb.host,
                    user     : mydb.user,          //이때는 RO를 사용한다.
                    password : mydb.password,
                    database : mydb.database,
                    port     : mydb.port,
                    connectionLimit: mydb.connectionLimit,   
                    multipleStatements: mydb.multipleStatements
                };

                let sUserAccount_mydao=require("./sDbCommonDaoForCompanyAreaUPD");
                let resMenuList=await sUserAccount_mydao.sqlHandlerForCompanyUPD(myLocalBizCompCode, "RO", temp_settingObj,tmpStr,[myLocalBizCompCode, myLocalBizCompCode, tabCode, tabCode])
                                .then((rows)=>{
                                    if(rows.length>0)
                                    {
                                        return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":rows};
                                    }
                                    else
                                    {
                                        return {"errorcode":appmsg[50].messageCode, "errormessage":appmsg[50].messageText, "returnvalue":""};
                                    };
                                });

                return resMenuList;
            }
            else
            {  
                if(returnCheckToken.returnvalue=="B"){
                    let newRefreshToken=returnCheckToken.returnRefreshToken;
                    response.cookie("refreshToken", newRefreshToken);
                }
                else if(returnCheckToken.returnvalue=="C"){
                    //이때는 새로운 access token이 반환된다.
                    let newAccessToken=returnCheckToken.returnAccessToken;
                    response.cookie("accessToken", newAccessToken);
                };

                const myOwnerSchema=chkRtn.ownerSchema;
                const myCommonSchema=chkRtn.commonSchema;
                const myLocalBizCompCode=chkRtn.localBizCompCode;
                const accessTokenUserId=chkRtn.userId;
                const requestCookieRole=chkRtn.requestCookieRole;

                //사용자db환경 구하기
                let ue=require("./sGetUserEnvInfo");
                let myDbInfo=await ue.getDBEnvInfo(myLocalBizCompCode, accessTokenUserId, requestCookieRole);
                if(myDbInfo.errorcode=="PFERR_CONF_0000")
                {
                    let temp_settingObj ={
                        host     : myDbInfo.returnvalue.host,
                        user     : myDbInfo.returnvalue.dbrouser,          //이때는 ro를 사용한다.
                        password : myDbInfo.returnvalue.dbropassword,
                        database : myDbInfo.returnvalue.database,
                        port     : myDbInfo.returnvalue.port,
                        connectionLimit: myDbInfo.returnvalue.connectionLimit,   
                        multipleStatements: myDbInfo.returnvalue.multipleStatements
                    };

                    let sUserAccount_mydao=require("./sDbCommonDaoForCompanyAreaUPD");
                    let resMenuList =await sUserAccount_mydao.sqlHandlerForCompanyUPD(myLocalBizCompCode, "RO", temp_settingObj,tmpStr,[myLocalBizCompCode, myLocalBizCompCode, tabCode, tabCode])
                                    .then((rows)=>{
                                        if(rows.length>0)
                                        {
                                            return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":rows};
                                        }
                                        else
                                        {
                                            return {"errorcode":appmsg[50].messageCode, "errormessage":appmsg[50].messageText, "returnvalue":""};
                                        };
                                    });
                    return resMenuList;
                }
                else
                {
                    let retPage="/"+tmpFolderName+"/"+myLoginPage;
                    return {"errorcode": appmsg[59].messageCode, "errormessage": appmsg[59].messageText, "returnpage":retPage};
                };
            };
        };
        //----------------------------------------------------------------------------------------------------------------
    }
};

module.exports=sGetUserGuideDB;