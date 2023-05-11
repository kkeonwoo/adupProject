/****************************************************************************************************
module명: sLoginAjaxProc.js
creator: 안상현
date: 2022.1.8
version 1.0
설명: login 처리 공통 모듈 (타 법인의 인증규칙이 현재 구현해 놓은 것과 같다면 다른 법인 처리도 가능하지만, 그것을 테스트를 해봐야 함)
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

var sLoginAjaxProc={
    procLoginAjax: async function(request, response)
    {
        //클라이언트에서 입력한 문장을 서버에서 암호화 하여 내려보낸다. 이때는 토큰 체크등은 불필요
        let userId=request.body.user;
        let password=request.body.passw;
        let passwordold="";
        let clientInfo=JSON.parse(request.body.client);
        let myrole=request.body.myrole;
        let responseData={};

        if(userId.length<1||password.length<1)
        {
            //20220426-안상현 자동로그인처리로 변경한다.
            //(1) 자동 로그인인지 쿠키에서 check한다.
            const cookie=require("cookie");
            let pcookie=cookie.parse(request.headers.cookie);
            let autoLoginYN=pcookie.autoLoginYN;

            if(autoLoginYN=="Y")
            {
                //refresh 쿠키로 사용자 id를 찾는다.
                let accessToken=pcookie.accessToken;
                let refreshToken=pcookie.refreshToken;
                let checkUser = new Object();
                if(refreshToken!=undefined&&refreshToken!=null)
                {
                    //local biz comp code를 구하기 위하여 현재의 url을 가져와서 https가 아닌경우 https로 변경해주고
                    let tmpUrl=request.headers.referer;
                    if(tmpUrl.indexOf("https://")>-1){tmpUrl=tmpUrl.replace("https://","");}else{tmpUrl=tmpUrl.replace("http://","");};
                    tmpUrl=tmpUrl.replace(request.headers.host,"");

                    //현재의 url에서 폴더명과 파일명을 가져온다.
                    let nowUrlPage=tmpUrl;
                    let pf=require("./sGetUrlFileName");
                    let tmpFileName=await pf.getFileName(nowUrlPage);
                    let tmpFolderName=pf.getFolderName(request.headers.referer, request.url, request.protocol, request.headers.host);

                    //얻어진 filename을 바탕으로 local biz comp code값을 찾는다.
                    let getLocalCode=require("./sGetDbInfoForAcquireAccount.json");
                    let myLocalPart=getLocalCode.filter(function(item, index, arr2){return item.uDirectory==tmpFolderName});
                    let myLocalBizCompCode=myLocalPart[0].localBizCompCode;

                    //token값을 가지고 사용자 id를 찾은 후 유효성 검사를 수행한다. 유효해야만 로그인 처리가 가능하다.
                    let chkDbByToken=require("./sCheckTokenInfoCommonDB.js");
                    let tmpUserId=await chkDbByToken.checkTokenInfoCommonDB(myLocalBizCompCode,refreshToken,myrole);

                    //얻어진 계정이 유효하고, REFRESH TOKEN이 유효하면 로그인으로 인정한다.
                    //토큰을 체크하는 규칙
                    // refresh가 유효한 경우 계정의 상태를 일단 검사한다. (계정상태가 정상이 아니면 완전무효, 계정상태가 정상이면 토큰만 무효)
                    // returnvalue code A: 1번이 완전무효이고 access가 무효이면 무효 처리 (로그인 창으로 이동)
                    // returnvalue code B: 1번이 토큰만 무효이고 access가 유효이면 계정상태가 정상일 경우 refresh 토큰 재발급 (한동안 로그인 안한 것이므로 자동 로그인 처리) 비정상이면 Error 처리
                    // returnvalue code C: 1번이 유효이고 access가 무효이면 계정상태를 Check해서 acesss 토큰만 재발급 후 정상진행 (이때 Cookie Update), 계정상태 비정상이면 A로 반환
                    // returnvalue code D: 1번이 유효이고 access가 유효이면 정상진행
                    // returnvalue code "": 기타 Error발생시
                    try
                    {
                        let rtnc=require("./sCheckTokenCase");
                        let returnCheckToken=await rtnc.checkTokenStatus(accessToken, refreshToken, tmpFileName, "", nowUrlPage, tmpFolderName, request, "sLoginAjaxProc.js", pcookie.myrole);
                        if(returnCheckToken.returnvalue=="A"||returnCheckToken.returnvalue==""||returnCheckToken.returnvalue==null)
                        {
                            //자동로그인인데 무효이므로 로그인페이지를 그대로 둔다.
                            responseData={"errorcode": appmsg[54].messageCode, "errormessage": appmsg[54].messageText, "returnvalue" : ""};
                            response.json(responseData);
                        }
                        else if(returnCheckToken.returnvalue=="B")
                        {
                            let newRefreshToken=returnCheckToken.returnRefreshToken;
                            response.cookie("refreshToken", newRefreshToken);
                            await this.next_proceed_step_response(request, myLocalBizCompCode, tmpUserId.returnvalue[0].ACCOUNT_EMAIL_ID, tmpFolderName, tmpFileName, response, clientInfo);
                        }
                        else if(returnCheckToken.returnvalue=="C")
                        {
                            //이때는 새로운 access token이 반환된다.
                            let newAccessToken=returnCheckToken.returnAccessToken;
                            response.cookie("accessToken", newAccessToken);
                            await this.next_proceed_step_response(request, myLocalBizCompCode, tmpUserId.returnvalue[0].ACCOUNT_EMAIL_ID, tmpFolderName, tmpFileName, response, clientInfo);
                        }
                        else if(returnCheckToken.returnvalue=="D")
                        {
                            //그 후 next page로 진행하게 한다.
                            await this.next_proceed_step_response(request, myLocalBizCompCode, tmpUserId.returnvalue[0].ACCOUNT_EMAIL_ID, tmpFolderName, tmpFileName, response, clientInfo);
                        }
                        else
                        {
                            //그 외에는 Error이므로 그대로 둔다.
                            responseData={"errorcode": appmsg[54].messageCode, "errormessage": appmsg[54].messageText, "returnvalue" : ""};
                            response.json(responseData);
                        };
                    }
                    catch(e)
                    {
                        response.status(404).send("Auto Login Exception Occurred!");
                    };
                }
                else
                {
                    //자동 로그인인데 쿠키가 없다면 SKIP Code를 주고  Client에서 아무것도 하지 않도록 처리한다.
                    responseData={"errorcode": appmsg[54].messageCode, "errormessage": appmsg[54].messageText, "returnvalue" : ""};
                    response.json(responseData);
                };
            }
            else
            {
                //자동 로그인이 아닌 경우 기존의 메세지를 보여준다
                console.log("input data is invalid!");
                responseData={"errorcode": appmsg[0].messageCode, "errormessage": appmsg[0].messageText, "returnvalue" : ""};
                response.json(responseData);
            };
        }
        else
        {
            //user id에 대한 sql 및 javascrupt injection 대응
            userId=userId.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+|\-/g,"");
            userId=$("<html>").text(userId).html();

            let tmpUrl=request.headers.referer;
            if(tmpUrl.indexOf("https://")>-1){tmpUrl=tmpUrl.replace("https://","");}
            else{tmpUrl=tmpUrl.replace("http://","");};
            tmpUrl=tmpUrl.replace(request.headers.host,"");

            //현재의 url에서 폴더명과 파일명을 가져온다.
            let pf=require("./sGetUrlFileName");
            let nowUrlPage=tmpUrl;
            let tmpFileName=await pf.getFileName(nowUrlPage);
            let folderName=pf.getFolderName(request.headers.referer, request.url, request.protocol, request.headers.host);

            if(folderName.length>0)
            {
                //사용자가 존재하는지 확인하고 암호가 맞는지 확인하고 유효토큰, refresh 토큰을 새로 발번한다.
                //(1) folder에 해당하는 owner schema정보를 먼저구한다.
                let myBizInfo=require("./sToken.json");
                let myTokenInfo=myBizInfo.filter(function(ele, index, arr2){return ele.uDirectory==folderName;});
                let myOwnerSchema=myTokenInfo[0].ownerSchema;
                let myLocalBizCompCode=myTokenInfo[0].localBizCompCode;
                let mySkey=require("./sKey");

                //사용자db환경 구하기
                let ue=require("./sGetUserEnvInfo");
                let myDbInfo=await ue.getDBEnvInfo(myLocalBizCompCode, userId, myrole);

                if(myDbInfo.errorcode=="PFERR_CONF_0000")
                {
                    //사용자 계정 상태 및 비밀번호 Check
                    let scu=require("./sCheckUserStatus");
                    //20220716 ash request object add
                    let checkUser=await scu.checkUserAuth(mySkey, myOwnerSchema, myDbInfo.returnvalue, userId, password, passwordold, tmpFileName, "Y", request, ""); //Y: 비밀번호까지 check

                    //정상이라면 유효 및 refresh 토큰 발급
                    if(checkUser.errorcode=="PFERR_CONF_0000"||checkUser.errorcode=="PFERR_CONF_0007")
                    {
                        //acess_refresh token발급
                        const secretObj=require("./sjwt");
                        const jwt=require("jsonwebtoken");
                        const tmpAccessTokenCycle=myTokenInfo[0].accessTokenCycle;  
                        const tmpRefreshTokenCycle=myTokenInfo[0].refreshTokenCycle;
                        const newAccessToken=jwt.sign({email: userId}, secretObj.secret,{expiresIn: tmpAccessTokenCycle,issuer: folderName});
                        const newRefreshToken=jwt.sign({}, secretObj.secret, {expiresIn: tmpRefreshTokenCycle, issuer: folderName});

                        //발급한 refresh를 저장한다.
                        const sd=require("./sDateFormat");
                        let tmpServerTime=sd.sDateFormat_dateFormatChange(new Date(), "YYYY-MM-DD HH:MM:SS");
                        let tdev ={
                            host     : myDbInfo.returnvalue.host,
                            user     : myDbInfo.returnvalue.dbrwuser,          //이때는 rw를 사용한다.
                            password : myDbInfo.returnvalue.dbrwpassword,
                            database : myDbInfo.returnvalue.database,
                            port     : myDbInfo.returnvalue.port,
                            connectionLimit: myDbInfo.returnvalue.connectionLimit,   
                            multipleStatements: myDbInfo.returnvalue.multipleStatements
                        };

                        const rt=require("./sUpdateRefreshTokenInfo");
                        let clientIpAddress=requestIp.getClientIp(request);
                        const rfTokenUpdate=await rt.UpdateRefreshTokenInfo(request, mySkey, myDbInfo.returnvalue, tdev, userId, tmpServerTime, newRefreshToken, clientIpAddress, clientInfo);
                        if(rfTokenUpdate.errorcode=="PFERR_CONF_0000"||rfTokenUpdate.errorcode=="PFERR_CONF_0007")
                        {
                            response.cookie("accessToken", newAccessToken);
                            response.cookie("refreshToken", newRefreshToken);
                            
                            //user의 권한이 admin이면 admin main으로 분기하고 일반이면 일반 소속 page 로 이동한다.
                            const us=require("./sUIStory.json");
                            let myPage=us.filter(function(item, index, arr2){return item.uDirectory==folderName});

                            if(myPage.length>0)
                            {
                                const mr=require("./sMyRole.js");
                                let myrole=mr.getMyRoleCode(request.body.myrole);

                                if(myrole=="ADMIN")
                                {
                                    //admin으로 분기
                                    //폴더이름 빼는것으로 변경 20221128 heesang
                                    // checkUser.nextpage="/"+folderName+"/"+myPage[0].adminPage;
                                    checkUser.nextpage="/"+myPage[0].adminPage;
                                }
                                else if(myrole=="SUPER")
                                {
                                    //2022.03.15 윤희상 공급사의 admin 화면으로 분기 
                                    //폴더이름 빼는것으로 변경 20221128 heesang
                                    checkUser.nextpage="/"+myPage[0].superPage;
                                }
                                else
                                {
                                    if(request.body.myrole=="imapos")
                                    {
                                        //폴더이름 빼는것으로 변경 20221128 heesang
                                        checkUser.nextpage="/"+myPage[0].posPage;
                                    }
                                    else
                                    {
                                        //폴더이름 빼는것으로 변경 20221128 heesang
                                        checkUser.nextpage="/"+myPage[0].mainPage;
                                    };
                                };

                                response.status(200).send(checkUser);
                            }
                            else
                            {
                                //directory not found
                                response.status(404).send("Directory with Role Not Found!");
                            };
                        }
                        else
                        {
                            //토큰 갱신에 실패했으므로 System 운영자가 확인해야 함 (장애 상황일 수 있음)
                            response.status(404).send(checkUser);
                            response.end();
                        };
                    }
                    else
                    {
                        responseData={"errorcode": checkUser.errorcode, "errormessage": checkUser.errormessage, "returnvalue" : ""};
                        response.json(responseData);
                    };
                }
                else
                {
                    responseData={"errorcode": myDbInfo.errorcode, "errormessage": myDbInfo.errormessage, "returnvalue" : ""};
                    response.json(responseData);
                };
            }
            else
            {
                responseData={"errorcode": appmsg[19].messageCode, "errormessage": appmsg[19].messageText, "returnvalue" : ""};
                response.json(responseData);
            };
        };
    },
    next_proceed_step_response: async function(request, myLocalBizCompCode, tmpUserId, tmpFolderName, tmpFileName, response, clientInfo)
    {
        // const cookie=require("cookie");
        // let pcookie=cookie.parse(request.headers.cookie);
        //그 후 next page로 진행하게 한다.
        const us=require("./sUIStory.json");
        let myPage=us.filter(function(item, index, arr2){return item.uDirectory==tmpFolderName});

        let checkUser={};
        checkUser.errorcode=appmsg[3].messageCode;
        checkUser.errormessage=appmsg[3].messageText;
        checkUser.returnvalue="OK";

        const mr=require("./sMyRole");
        let myrole=mr.getMyRoleCode(request.body.myrole);

        if(myrole=="ADMIN")
        {
            //admin으로 분기
            //폴더이름 빼는것으로 변경 20221128 heesang
            // checkUser.nextpage="/"+tmpFolderName+"/"+myPage[0].adminPage;
            checkUser.nextpage="/"+myPage[0].adminPage;
            response.status(200).send(checkUser);
        }
        else if(myrole=="SUPER")
        {
            //폴더이름 빼는것으로 변경 20221128 heesang
            checkUser.nextpage="/"+myPage[0].superPage;
            response.status(200).send(checkUser);
        }
        else if(myrole=="BUY")
        {
            //POS면 POS Main으로
            if(request.body.myrole=="imaapos")
            {
                //BUY이면서 POS인 경우
                //폴더이름 빼는것으로 변경 20221128 heesang
                checkUser.nextpage="/"+myPage[0].posPage;
                response.status(200).send(checkUser);
            }
            else
            {
                //BUY이면서 POS가 아니면 main으로...
                //폴더이름 빼는것으로 변경 20221128 heesang
                checkUser.nextpage="/"+myPage[0].mainPage;
                response.status(200).send(checkUser);
            }
        }
        else
        {
            //Role 이 파악되지 않으면 Error Page로...
            checkUser.nextpage="/"+myPage[0].errorPage;
            response.status(200).send(checkUser);
        };
    },
    procPosAutoLoginAjax: async function(request, response, pUserIdSSN)
    {
        //2022-05-02 안상현 추가, pos로 부터 로그인 시도가 있을때 이미 있는 회원이라면 정상적으로 로그인 처리를 하고
        //존재하지 않는 회원이라면 return을 반환해서 후속으로 진행하도록 한다 (response object를 반환하지 않음)
        //클라이언트에서 입력한 문장을 서버에서 암호화 하여 내려보낸다. 이때는 토큰 체크등은 불필요
        let userId=pUserIdSSN;
        let password="";        //자동 POS로 넘어오기 때문에 신 비밀번호는 없다.
        let passwordold="";     //자동 POS로 넘어오기 때문에 구 비밀번호는 없다.
        let clientInfo = new Object();         //client info도 없다. 비어 있는 object로 시작한다.
        let responseData;

        //user id에 대한 sql 및 javascrupt injection 대응
        userId=userId.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+|\-/g,"");
        userId=$("<html>").text(userId).html();

        let tmpUrl = "/main/uPos";

        //현재의 url에서 폴더명과 파일명을 가져온다.
        let nowUrlPage=tmpUrl;
        let tmpFileName="uPos";
        let folderName="eum";

        if(folderName.length>0)
        {
            //사용자가 존재하는지 확인하고 암호가 맞는지 확인하고 유효토큰, refresh 토큰을 새로 발번한다.
            //(1) folder에 해당하는 owner schema정보를 먼저구한다.
            let myBizInfo=require("./sToken.json");
            let myTokenInfo=myBizInfo.filter(function(ele, index, arr2){return ele.uDirectory==folderName;});
            let myOwnerSchema=myTokenInfo[0].ownerSchema;
            let myLocalBizCompCode=myTokenInfo[0].localBizCompCode;
            let mySkey=require("./sKey");

            //사용자db환경 구하기
            let ue=require("./sGetUserEnvInfo");
            let myDbInfo=await ue.getDBEnvInfo(myLocalBizCompCode, userId, myrole);

            if(myDbInfo.errorcode=="PFERR_CONF_0000")
            {
                //사용자 계정 상태 및 비밀번호 Check
                let scu=require("./sCheckUserStatus");
                //20220716 ash request object add
                let checkUser=await scu.checkUserAuth(mySkey, myOwnerSchema, myDbInfo.returnvalue, userId, password, passwordold, tmpFileName, "N", request, ""); //Y: 비밀번호까지 check

                //정상이라면 유효 및 refresh 토큰 발급
                if(checkUser.errorcode=="PFERR_CONF_0000"||checkUser.errorcode=="PFERR_CONF_0007")
                {
                    //acess_refresh token발급
                    const secretObj=require("./sjwt");
                    const jwt=require("jsonwebtoken");
                    const tmpAccessTokenCycle=myTokenInfo[0].accessTokenCycle;  
                    const tmpRefreshTokenCycle=myTokenInfo[0].refreshTokenCycle;
                    const newAccessToken=jwt.sign({email: userId}, secretObj.secret,{expiresIn: tmpAccessTokenCycle,issuer: folderName});
                    const newRefreshToken=jwt.sign({}, secretObj.secret, {expiresIn: tmpRefreshTokenCycle, issuer: folderName});

                    //발급한 refresh를 저장한다.
                    const sd=require("./sDateFormat");
                    let tmpServerTime=sd.sDateFormat_dateFormatChange(new Date(), "YYYY-MM-DD HH:MM:SS");
                    let tdev ={
                        host     : myDbInfo.returnvalue.host,
                        user     : myDbInfo.returnvalue.dbrwuser,          //이때는 rw를 사용한다.
                        password : myDbInfo.returnvalue.dbrwpassword,
                        database : myDbInfo.returnvalue.database,
                        port     : myDbInfo.returnvalue.port,
                        connectionLimit: myDbInfo.returnvalue.connectionLimit,   
                        multipleStatements: myDbInfo.returnvalue.multipleStatements
                    };

                    let clientIpAddress=requestIp.getClientIp(request);
                    //20220502 안상현 uPos에서 request Ip가 Null알 수 있다. (2022.7.9 undefined check추가)
                    if(clientIpAddress==null||clientIpAddress==undefined)
                    {
                        clientIpAddress="uPos null";
                    };
                    const rt=require("./sUpdateRefreshTokenInfo");

                    //uPos를 통해서 들어온 경로는 clientInfo가 undefined이므로 여기에서 default로만 set한다.
                    clientInfo.appCodeName = "SloginAjaxProc";
                    clientInfo.browserName = "not defined";
                    clientInfo.browserVersion = "not defined";
                    clientInfo.isMobile = "false";
                    clientInfo.platformName = "not defined";
                    clientInfo.userAgent = "not defined";
                    clientInfo.tokenMembership = "BUY";

                    //20220621 안상현 사용자 해상도 X,Y Set (POS자동 연동은 해상도 정보가 없다)
                    clientInfo.resX = 0;
                    clientInfo.resY = 0;

                    //20220709 안상현 POS Token을 유지하기 위한 pos구분 항목 추가
                    clientInfo.myrole="P";

                    //2022.06.02 윤희상 log insert 모듈 호출을 위해 request객체 파라미터에 추가
                    const rfTokenUpdate=await rt.UpdateRefreshTokenInfo(request, mySkey, myDbInfo.returnvalue, tdev, userId, tmpServerTime, newRefreshToken, clientIpAddress, clientInfo);
                    if(rfTokenUpdate.errorcode=="PFERR_CONF_0000"||rfTokenUpdate.errorcode=="PFERR_CONF_0007")
                    {
                        response.cookie("accessToken", newAccessToken);
                        response.cookie("refreshToken", newRefreshToken);

                        //2022.7.9 안상현 POS Mode를 체크해서 POS모드이면 쿠키에 set을 해서 내려보내준다. 이 이후로는 request요청이 올때마다 POS인지를 체크해서 session을 별도로 처리하게 된다.
                        if(clientInfo.myrole!=undefined&&clientInfo.myrole!=null&&clientInfo.myrole=="P")
                        {
                            response.cookie("myrole", clientInfo.myrole);
                        };
                        
                        //user의 권한이 admin이면 admin main으로 분기하고 일반이면 일반 소속 page 로 이동한다.
                        const us=require("./sUIStory.json");
                        let myPage=us.filter(function(item, index, arr2){return item.uDirectory==folderName});
                        if(myPage.length>0)
                        {
                            if((checkUser.accountRole).substring(0,6)=="NORMAL")
                            {
                                //normal로 분기
                                checkUser.nextpage=myPage[0].posPage;
                                response.redirect(302,"/"+folderName+"/"+checkUser.nextpage);
                                return "success";
                            }
                            else
                            {
                                //normal이 아니면 error임
                                return "fail04_invalid_role_Not_NORMAL_error";
                            };
                        }
                        else
                        {
                            return "role or directory not found!";
                        };
                    }
                    else
                    {
                        //토큰 갱신에 실패했으므로 System 운영자가 확인해야 함 (장애 상황일 수 있음)
                        return "fail03_UpdateRefreshTokenInfo_error";
                    };
                }
                else
                {
                    //user auth error 이므로 일단 반환하고 어떻게 할지 바깥에서 처리해야 함
                    return "fail02_checkUserAuth_error";
                };
            }
            else
            {
                //사용자 환경이 없으므로 일단 fail로 리턴한다.
                return "fail01_getDBEnvInfo_error";
            };
        }
        else
        {
            return "fail05_folderName_error";
        };
    },
};

module.exports=sLoginAjaxProc;