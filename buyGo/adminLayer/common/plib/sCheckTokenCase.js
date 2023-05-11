/****************************************************************************************************
module명: sCheckTokenCase.js
creator: 안상현
date: 2022.9.2
version 1.0
설명: 사용자의 토큰을 체크해서 어떻게 할지를 결정하는 모듈 (아래 Case설명 참고)
      토큰을 체크하면 결론은 다음 중 하나가 넘어온다.
      1. refresh가 유효한 경우 계정의 상태를 일단 검사한다. (계정상태가 정상이 아니면 완전무효, 계정상태가 정상이면 토큰만 무효)
      returnvalue code A: 1번이 완전무효이고 access가 무효이면 무효 처리 (로그인 창으로 이동)
      returnvalue code B: 1번이 토큰만 무효이고 access가 유효이면 계정상태가 정상일 경우 refresh 토큰 재발급 (한동안 로그인 안한 것이므로 자동 로그인 처리) 비정상이면 Error 처리
      returnvalue code C: 1번이 유효이고 access가 무효이면 계정상태를 Check해서 acesss 토큰만 재발급 후 정상진행 (이때 Cookie Update), 계정상태 비정상이면 A로 반환
      returnvalue code D: 1번이 유효이고 access가 유효이면 정상진행
      returnvalue code "": 기타 Error발생시
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
const e = require("express");
let jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM();
const {document} = (new JSDOM("")).window;
//let $ = jQuery = require("jquery")(window);
const memberLogFlag=require("./sMemberLogFlag.js");

var sCheckTokenCase={
    checkTokenStatus: async function(acTokenFromRequest, rfTokenFromRequest, tmpFileName, tmpDirName, nowUrlPage, tmpFolderName, request, callerModule, pCookieMyrole)
    {
        //2022.6.1 안상현
        //member_log갱신을 위해 어쩔 수 없이 request를 받게 되었다. 그 뒤에 callerModule은 누가 나를 부른 것인지? 그리고 member_log의 기록 대상인지를 판단하기 위하여 인자를 추가하였다.

        //refresh token은 DB에서 읽는다 쿠키는 최초 내려는 보내지만 조작의 문제가 있으므로 믿을 수 없음
        //access token header에서 email id를 추출하여 실제 Table에 저장된 refresh token을 확인한다. 클라이언트에서 refresh token을 조작하는 것을 방지하기 위함임
        const jwt=require("jsonwebtoken");
        let appmsg=require("./sapplicatioErrorMessage.json");
        const secretObj=require("./sjwt");
        const mr=require("./sMyRole");

        let myrole="";
        if(request.body.myrole==null||request.body.myrole==undefined)
        {
            //최초 page 일 경우 (referer is null or undefined)는 쿠키에서 parsing된 값을 사용한다.
            myrole=pCookieMyrole;
        }
        else
        {
            //original url에 존재하면 그것을 먼저 사용한다.
            myrole=request.body.myrole;
        };

        //access token이 아예 없는 경우가 있다. 이럴 경우는 refresh token상태를 체크해서 경우의 수를 달리한다.
        if(acTokenFromRequest===undefined||acTokenFromRequest===null)
        {
            //user 식별불가로 로그인으로 돌려보낸다. 이것은 방법이 없음
            return {"errorcode": appmsg[23].messageCode, "errormessage": appmsg[23].messageText, "returnvalue" : "A"};
        }
        else
        {
            let base64JWTPayload=acTokenFromRequest.split(".")[1]; //0: header, 1: payload, 2: VERIFY SIGNATURE
            let acessTokenPayload=Buffer.from(base64JWTPayload, "base64");
            let resultParsedAccessToken=JSON.parse(acessTokenPayload.toString());
            //iss 값으로 bizCode를 찾는다.
            let st=require("./sToken.json");
            const sKey=require("./sKey");
            let tmpTkInfo=st.filter(function(item, index, arr2){return item.uDirectory==resultParsedAccessToken.iss});
            //구해진 폴더 이름으로 소속법인의 스키마를 찾는다.
            const myOwnerSchema=tmpTkInfo[0].ownerSchema;
            const myCommonSchema=tmpTkInfo[0].commonSchema;
            const myLocalBizCompCode=tmpTkInfo[0].localBizCompCode;
            let accessTokenUserId=resultParsedAccessToken.email;

            if(tmpTkInfo.length<1)
            {
                //식별이 안되면 Error처리
                return {"errorcode": appmsg[22].messageCode, "errormessage": appmsg[22].messageText, "returnvalue" : ""};
            }
            else    
            {
                let chkDbByToken=require("./sCheckTokenInfoCommonDB.js");
                let tmpTokenMembership=await chkDbByToken.checkTokenMembership(myLocalBizCompCode,rfTokenFromRequest,myrole);
                if(tmpTokenMembership.errorcode != "PFERR_CONF_0000"){
                    //user 식별불가로 로그인으로 돌려보낸다.
                    return {"errorcode": appmsg[23].messageCode, "errormessage": appmsg[23].messageText, "returnvalue" : "A"};
                };
                //Token을 체크하기 전 화면 사용권한이 있는지 확인한다.
                const roleCheck=require("./sCheckUIAuthByRole");
                let rtn=await roleCheck.checkUIAuthByUserRole(myLocalBizCompCode, accessTokenUserId, tmpFileName, tmpTokenMembership.returnvalue[0].TOKEN_MEMBERSHIP, myrole);
                if(rtn.errorcode=="PFERR_CONF_0000")
                {
                    //refresh token조작을 방지하기 위해서 db에서 읽은 것이다.
                    const ctkn=require("./sGetRefreshTokenFromTable");
                    let rfTokenFromDB=await ctkn.getRefreshTokenFromDB(myLocalBizCompCode, accessTokenUserId, request, myrole);

                    if(rfTokenFromDB.errorcode=="PFERR_CONF_0000")
                    {
                        //2022.6.1 안상현 - member-log를 기록하기 위하여 이곳에 오는 모든 token check에 대한 접속 기록을 관리한다. - start
                        //단 여기에서 하는 이유는 DDOS공격등 권한이 없는 접근 까지 DB Table에 기록되면 full이 날 수 있으므로 rf token접속 기록이 있는 사람만 member_log에 기록한다.
                        //이 정보는 구매자 정보에 한하여 몇번 방문 했는지 등을 함께 outer join으로 정보를 취득할 수 있다는 점을 참고하기 바란다.
                        //접속 기록의 폭주를 막기 위하여 하나의 기록 flag로 수도꼭지 처럼 잠그고 풀 수 있도록 한다.
                        if(memberLogFlag.recordYN=="Y")
                        {
                            //request가 존재할때만 검사 및 기록한다.
                            if(request!=undefined&&request!=null)
                            {
                                //기록 대상인지를 검사한다.
                                let chkLog=require("./sMemberLogCheckYNModuleList.json");
                                //기록여부가 Y이고 모듈명이 일치하면 OK값을 반환하고, 그렇지 않으면 null로 반환한다.
                                let rst=chkLog.filter(function(item, index, arr2){if(item.logYN=="Y"&&item.moduleName==callerModule){return "OK";}});
                                if(rst=="OK")
                                {
                                    //member log기록 함수를 호출한다.
                                    let recordLog=require("./sSetMemberLogDB");
                                    let rstLog=await recordLog.insertMemberLogDB(myLocalBizCompCode, accessTokenUserId, request, callerModule);
                                    //반환결과는 check하지 않는다.
                                };
                            };
                        };
                        //2022.6.1 안상현 - member-log를 기록하기 위하여 이곳에 오는 모든 token check에 대한 접속 기록을 관리한다. - end

                        //전달된 토큰과 DB에 저장된 token을 비교해서 존재할 경우 그 token을 verify한다.
                        let matchedToken="";
                        for(let ix=0; ix<rfTokenFromDB.returnvalue.length; ix++)
                        {
                            if(rfTokenFromRequest==rfTokenFromDB.returnvalue[ix].ACCOUNT_REFRESH_TOKEN)
                            {
                                matchedToken=rfTokenFromDB.returnvalue[ix].ACCOUNT_REFRESH_TOKEN;
                            };
                        };

                        if(matchedToken.length>0)
                        {
                            const {verifyToken}=require("./verifyToken");
                            let verifiedAccessToken=verifyToken(acTokenFromRequest);
                            let verifiedRefreshToken=verifyToken(matchedToken);  //db 에 저장된 것 중 matched 된 refresh 토큰을 verify한다. 
                            let tmpUserAndRefreshTokenIsOK="";
                            let newAccessToken="";
                            let accountStatus="";
                            let licenseStatus="";
                            let b2cb2b="";
                            let needToStatusReleased="";
                            let checkUserStatueFromDB="";

                            //일단 refresh 토큰이 유효라면 사용자 계정 상태를 검사한다.
                            if(verifiedRefreshToken!=null)
                            {
                                if(myOwnerSchema.length>0)
                                {
                                    //사용자가 구해지면 라이센스 상태 등을 검사한다. 먼저 사용자의 DB환경 접속 정보등을 구한다.
                                    const userInfo=require("./sGetUserEnvInfo");
                                    //const sysmode=require("./sPlatformMode.json");
                                    const myDBInfo=await userInfo.getDBEnvInfo(myLocalBizCompCode, accessTokenUserId, myrole);

                                    if(myDBInfo.errorcode=="PFERR_CONF_0000")
                                    {
                                        const tmpMyDBInfo=myDBInfo.returnvalue;
                                        const cu=require("./sCheckUserStatus");
                                        const checkAccount=await cu.checkUserAuth(sKey, myOwnerSchema, tmpMyDBInfo, accessTokenUserId, "", "", tmpFileName , "N", request, "", myrole);

                                        //정상이면 access 토큰을 발번하고 Page를 이동할 수 있도록 한다.
                                        if(checkAccount.errorcode=="PFERR_CONF_0000")
                                        {
                                            const tmpTokenInfo=st.filter(function(item, index, arr2){return item.uDirectory==resultParsedAccessToken.iss});
                                            const tmpAccessTokenCycle=tmpTokenInfo[0].accessTokenCycle;

                                            //새로운 Token도 반환해 준다.
                                            newAccessToken=jwt.sign({email: accessTokenUserId}, secretObj.secret,{expiresIn: tmpAccessTokenCycle,issuer: resultParsedAccessToken.iss}); 
                                            accountStatus=checkAccount.accountStatus;
                                            licenseStatus=checkAccount.licenseStatus;
                                            b2cb2b=checkAccount.b2cb2b;
                                            tmpUserAndRefreshTokenIsOK="Y";
                                            checkUserStatueFromDB="ReadOkStatusOK";
                                            
                                            return {"errorcode": appmsg[3].messageCode, "errormessage": appmsg[3].messageText, "returnvalue" : "C", "returnAccessToken": newAccessToken, "returnAuth" : rtn.returnAuth};
                                        }
                                        else
                                        {
                                            //사용자 정보가 비정상 (라이센스 종료, 정지, 종료)일때 상태 값을 받아둔다.
                                            if(checkAccount.errorcode=="PFERR_CONF_0005")
                                            {
                                                checkUserStatueFromDB="ReadOkStatusNo";
                                                accountStatus=checkAccount.accountStatus;
                                                licenseStatus=checkAccount.licenseStatus;
                                                b2cb2b=checkAccount.b2cb2b;
                                                //b2c사용자의 경우 휴면은 스스로 풀 수 있도록 해준다.
                                                if(b2cb2b=="B2C"){needToStatusReleased="Y";};
                                            };

                                            checkUserStatueFromDB="ReadErrorStatusError";
                                            tmpUserAndRefreshTokenIsOK="N";
                                            return {"errorcode": appmsg[26].messageCode, "errormessage": appmsg[26].messageText, "returnvalue" : ""};
                                        };
                                    }
                                    else
                                    {
                                        //사용자 정보의 소속법인의 환경구성이 존재하지 않으므로 Error처리
                                        checkUserStatueFromDB="ReadError1";
                                        tmpUserAndRefreshTokenIsOK="N";
                                        return {"errorcode": appmsg[25].messageCode, "errormessage": appmsg[25].messageText, "returnvalue" : ""};
                                    };
                                }
                                else
                                {
                                    //owner스카미 못찾으면 환경구성에 문제가 있는 것이므로 admin에게 알린다.
                                    checkUserStatueFromDB="EnvError";
                                    tmpUserAndRefreshTokenIsOK="N";
                                    return {"errorcode": appmsg[24].messageCode, "errormessage": appmsg[24].messageText, "returnvalue" : ""};
                                }
                            }
                            else
                            {
                                tmpUserAndRefreshTokenIsOK="N";  //refresh token이 null이므로 check할 것이 없다.
                            };

                            //사용자 상태도 OK이고 Refresh Token도 정상이라는 전제일때 추가적인 판단을 내린다.
                            if(tmpUserAndRefreshTokenIsOK=="Y")
                            {
                                //refresh token이 유효인 상태인 경우에 access token을 따져본다.
                                if(verifiedAccessToken===undefined||verifiedAccessToken===null)
                                {
                                    //access token이 무효이므로 계정상태를 확인하여 access token을 발급할 것인지를 check
                                    //위에서 refresh 떄문에 check했으므로 check안 했을 때만 읽도록 한다.
                                    if(checkUserStatueFromDB=="")
                                    {
                                        //나올 수 없는 경우 이므로 일단 Error Message처리하고 테스트시에 나오면 확인한다.
                                        return {"errorcode": appmsg[27].messageCode, "errormessage": appmsg[27].messageText, "returnvalue" : ""};
                                        //-------------------------------------------
                                    }
                                    else if(checkUserStatueFromDB=="ReadOkStatusOK")
                                    {
                                        //DB 라이센스 및 계정상태 정상이므로 access token을 재발급 후 정상진행토록 한다.
                                        //반환하는 정보는 이미 위에서 그 시점에 읽었으므로 그 정보를 반환한다.
                                        return {"errorcode": appmsg[3].messageCode, "errormessage": appmsg[3].messageText, "returnvalue" : "C", "returnAccessToken": newAccessToken, "returnAuth" : rtn.returnAuth};
                                    };
                                }
                                else
                                {
                                    //access계정이 유효하므로 둘 다 정상이기 때문에 정상진행한다. 추가 발급 같은 것은 없음
                                    return {"errorcode": appmsg[3].messageCode, "errormessage": appmsg[3].messageText, "returnvalue" : "D", "returnAuth" : rtn.returnAuth};
                                };
                            }
                            else
                            {
                                if(verifiedAccessToken===undefined||verifiedAccessToken===null)
                                {
                                    //둘다 무효이므로 권한없음 처리
                                    return {"errorcode": appmsg[23].messageCode, "errormessage": appmsg[23].messageText, "returnvalue" : "A"};
                                }
                                else
                                {
                                    //access가 비록 유효하나 refresh 를 체크한 결과 계정상태가 정상이 아니므로 이 역시 무효처리 (퇴직, 정지, 휴면 계정일 수 있음)
                                    //만일 향후 Platform에서 휴면일 경우 휴면을 스스로 풀 수 있으면 별도의 Page와 기능을 여기에서 넣을 수는 있다.
                                    //그러나 B2C 가 아니고서는 소속 법인의 확인이 아니고서는 풀 수 없으므로 여기에서 b2c 사용자인 경우에 한해서만 Page를 이동하여 휴면을 풀 수 있도록 한다.
                                    if(needToStatusReleased=="Y")
                                    {
                                        //b2c사용자는 휴면을 스스로 풀 수 있도록 한다.  이 기능은 나중에 B2C를 구현할 때 보완하면 된다. 지금은 방향이 없어서 위치만 기록함
                                        //아래 정보를 활용하여 어떻게 휴면을 풀게 할 것인지는 따로 설계 할 것
                                        //accountStatus=checkAccount.accountStatus;
                                        //licenseStatus=checkAccount.licenseStatus;
                                        //b2cb2b=checkAccount.b2cb2b;
                                    }
                                    else
                                    {
                                        //access token이 유효하고 아직 계정감사가 이루어지지 않았으므로, 계정을 읽어서 정상이면 refresh token을 발급하고 정상진행한다.
                                        const userInfo=require("./sGetUserEnvInfo");
                                        //const sysmode=require("./sPlatformMode.json");
                                        const myDBInfo=await userInfo.getDBEnvInfo(myLocalBizCompCode, accessTokenUserId, myrole);

                                        if(myDBInfo.errorcode=="PFERR_CONF_0000")
                                        {
                                            const tmpMyDBInfo=myDBInfo.returnvalue;
                                            const cu=require("./sCheckUserStatus");
                                            //20220716 ash request object add
                                            const checkAccount=await cu.checkUserAuth(sKey, myOwnerSchema, tmpMyDBInfo, accessTokenUserId, "", "", tmpFileName , "N", request, "");

                                            //정상이면 refresh 토큰을 발번하고 Page를 이동할 수 있도록 한다.
                                            if(checkAccount.errorcode=="PFERR_CONF_0000")
                                            {
                                                const tmpTokenInfo=st.filter(function(item, index, arr2){return item.uDirectory==resultParsedAccessToken.iss});
                                                const tmpRefreshTokenCycle=tmpTokenInfo[0].refreshTokenCycle;
                                                //Refresh Token 발번
                                                let newRefreshToken=jwt.sign({}, secretObj.secret,{expiresIn: tmpRefreshTokenCycle,issuer: resultParsedAccessToken.iss}); 

                                                //발번한 refresh토큰을 해당 계정에 Update한다.
                                                //SQL ------------ refresh token을 저장한다.
                                                const sd=require("./sDateFormat");
                                                let tmpServerTime=sd.sDateFormat_dateFormatChange(new Date(), "YYYY-MM-DD HH:MM:SS");
                                                let sKey=require("./sKey");
                                                let temp_settingObj ={
                                                    host     : tmpMyDBInfo.host,
                                                    user     : tmpMyDBInfo.dbrwuser,          //이때는 rw를 사용한다.
                                                    password : tmpMyDBInfo.dbrwpassword,
                                                    database : tmpMyDBInfo.database,
                                                    port     : tmpMyDBInfo.port,
                                                    connectionLimit : tmpMyDBInfo.connectionLimit,
                                                    multipleStatements : tmpMyDBInfo.multipleStatements
                                                };

                                                const rt=require("./sUpdateRefreshTokenInfo");
                                                //2022.06.02 윤희상 log insert 모듈 호출을 위해 request객체 파라미터에 추가
                                                const rfToeknUpdate=await rt.UpdateRefreshTokenInfo(request, sKey, tmpMyDBInfo, temp_settingObj, accessTokenUserId, tmpServerTime, newRefreshToken);
                                                //SQL ------------ end
                                                if(rfToeknUpdate.errorcode=="PFERR_CONF_0000")
                                                {
                                                    //새로운 Refresh Token도 반환해 준다.
                                                    return {"errorcode": appmsg[3].messageCode, "errormessage": appmsg[3].messageText, "returnvalue" : "B", "returnRefreshToken": newRefreshToken, "returnAuth" : rtn.returnAuth};
                                                }
                                                else
                                                {
                                                    //update error 
                                                    return {"errorcode": appmsg[26].messageCode, "errormessage": appmsg[26].messageText, "returnvalue" : ""};
                                                };
                                            }
                                            else
                                            {
                                                //사용자 정보가 비정상 (라이센스 종료, 정지, 종료)이면 결국 권한없음으로 비정상처리된다.
                                                return {"errorcode": appmsg[23].messageCode, "errormessage": appmsg[23].messageText, "returnvalue" : "A"};
                                            };
                                        }
                                        else
                                        {
                                            //사용자 정보의 소속법인의 환경구성이 존재하지 않으므로 Error처리
                                            return {"errorcode": appmsg[25].messageCode, "errormessage": appmsg[25].messageText, "returnvalue" : ""};
                                        };

                                        //##################################################################################################
                                        //B2B 사용자는 스스로 휴면이나 정지를 풀 수 없으므로 그냥 Error처리한다.
                                        return {"errorcode": appmsg[23].messageCode, "errormessage": appmsg[23].messageText, "returnvalue" : "A"};
                                    };
                                };
                            };
                        }
                        else
                        {
                            return {"errorcode": appmsg[30].messageCode, "errormessage": appmsg[30].messageText, "returnvalue" : "token not found!"};
                        };
                    }
                    else
                    {
                        return {"errorcode": appmsg[30].messageCode, "errormessage": appmsg[30].messageText, "returnvalue" : ""};
                    };
                }
                else
                {
                    return {"errorcode": rtn.errorcode, "errormessage": rtn.errormessage, "returnvalue" : rtn.returnvalue};
                };
            };
        };
    }
};

module.exports=sCheckTokenCase;

