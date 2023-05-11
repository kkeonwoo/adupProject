/****************************************************************************************************
module명: sUpdateRefreshTokenInfo.js
creator: 안상현
date: 2022.9.2
version 1.0
설명: 본 모듈은 refresh 토근을 DB에 저장하는 공통 모듈이다.
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
var sUpdateRefreshTokenInfo={
    UpdateRefreshTokenInfo: async function(request, sKey, envInfo, tdev, userId, tmpServerTime, refreshToken, clientIpAddress, clientInfo)
    {
        try
        {
            if(clientInfo==undefined||clientInfo==""||clientInfo==null)
            {
                //client info가 없으면 error처리: 모든 화면에서는 반드시 넘어와야 하는 object이다.(중요!!!)
                return {"errorcode":appmsg[84].messageCode, "errormessage":appmsg[84].messageText, "returnvalue":""};
            }
            else
            {
                const appmsg=require("./sapplicatioErrorMessage.json");
                let mydao=require("./sDbCommonDaoForCompanyAreaUPD");
                let nowSessionCount=-1;
                let maxSessionCount=1;
                let tmpStr="";

                //접속정보에 대한 max session허용갯수
                const cd=require("./sGetCommonCodeValue")
                const rt=await cd.getCommonCodeValue(envInfo.pLocalBizCompCode, "SESSION_MAX_COUNT", "NUMBER");
                const mr=require("./sMyRole.js");
                let myrole=mr.getMyRoleCode(request.body.myrole);
                let commDB=require("./sDbcommonconfig");
                if(rt!=undefined&&rt!=null&&rt!=""&&rt!="ERROR"&&myrole!="ERROR")
                {
                    maxSessionCount=rt*1; //숫자형으로 변환

                    //로그인에서 넘어오는게 아닌 경우에는 clientIpAddress와 clientInfo가 없기때문에 select 해서 사용해야한다.
                    tmpStr ="SELECT CLIENT_IP_ADDRESS \n";
                    tmpStr+="     , CLIENT_BROWSER_NAME \n";
                    tmpStr+="     , CLIENT_APP_CODE_NAME \n";
                    tmpStr+="     , CLIENT_PLATFORM \n";
                    tmpStr+="     , CLIENT_USER_AGENT \n";
                    tmpStr+="     , CLIENT_BROWSER_VERSION \n";
                    tmpStr+="     , CLIENT_IS_MOBILE \n";
                    tmpStr+="     , TOKEN_MEMBERSHIP \n";
                    tmpStr+="     , RES_X \n";
                    tmpStr+="     , RES_Y \n";
                    tmpStr+="  FROM "+commDB.database+".TB_P00_ACCOUNT_TOKEN \n";
                    tmpStr+=" WHERE LOCAL_BIZ_COMP_CODE      =   ? \n";
                    tmpStr+="   AND ACCOUNT_ROLE             =   ? \n";
                    //tmpStr+="   AND ACCOUNT_REFRESH_TOKEN    =   '"+refreshToken+"' \n";
                    tmpStr+="   AND ACCOUNT_EMAIL_ID         =   ?";

                    nowSessionCount=-1;
                    await mydao.sqlHandlerForCompanyUPD(envInfo.pLocalBizCompCode,"RO",commDB,tmpStr,[envInfo.pLocalBizCompCode,myrole,userId])
                    .then((rows)=>{
                        if(rows.length>0)
                        {
                            nowSessionCount=rows.length;    //얻어진 session수
                        }
                        else
                        {
                            nowSessionCount=0;
                        };
                    });
                    
                    //id+role에 대하여 최대 session수를 넘었다면 가장 오래된 것을 지우고 새로 insert하고 그렇지 않으면 insert한다.
                    let commDBRW=require("./sDbcommonconfigRW");
                    if(nowSessionCount>=maxSessionCount)
                    {
                        //기존 token을 삭제하고 insert한다.
                        //2022.7.9 pos 구분을 체크해서 pos이면 pos 만 지우고, pos가 아니면 not P만 지우도록 변경함
                        tmpStr       ="DELETE FROM "+commDBRW.database+".tb_p00_account_token \n";
                        tmpStr = tmpStr + " WHERE ROW_SEQUENCE IN \n";
                        tmpStr = tmpStr + " ( \n";
                        tmpStr = tmpStr + "     SELECT K.ROW_SEQUENCE \n";
                        tmpStr = tmpStr + "     --     , K.* \n";
                        tmpStr = tmpStr + "       FROM  \n";
                        tmpStr = tmpStr + "           ( \n";
                        tmpStr = tmpStr + "                SELECT @ROWNUM := @ROWNUM + 1 AS ROWNUM  \n";
                        tmpStr = tmpStr + "                     , R.* \n";
                        tmpStr = tmpStr + "                  FROM ( \n";
                        tmpStr = tmpStr + "                               SELECT a.ROW_SEQUENCE \n";
                        tmpStr = tmpStr + "                                    , a.UPDATE_DATETIME \n";
                        tmpStr = tmpStr + "                                    , a.ACCOUNT_REFRESH_TOKEN \n";
                        tmpStr = tmpStr + "                                 FROM "+commDBRW.database+".tb_p00_account_token a \n";
                        tmpStr = tmpStr + "                                    , (SELECT @ROWNUM := 0 ) B \n";
                        tmpStr = tmpStr + "                                WHERE a.LOCAL_BIZ_COMP_CODE  = ? \n";
                        tmpStr = tmpStr + "                                  AND a.ACCOUNT_ROLE         = '"+myrole+"' \n";
                        tmpStr = tmpStr + "                                  AND a.ACCOUNT_EMAIL_ID     = ? \n";
                        tmpStr = tmpStr + "                                ORDER BY a.UPDATE_DATETIME  DESC \n";
                        tmpStr = tmpStr + "                        ) R \n";
                        tmpStr = tmpStr + "            ) K \n";
                        tmpStr = tmpStr + "        WHERE K.ROWNUM > "+(maxSessionCount-1)+" -- MAX SESSION -1 보다 크게 \n";
                        tmpStr = tmpStr + " ) \n";

                        let rtnInfo=await mydao.sqlHandlerForCompanyUPD(envInfo.pLocalBizCompCode,"RW",commDBRW,tmpStr,[envInfo.pLocalBizCompCode, userId]).then((rows)=>{});
                    };
                    
                    //그 다음 refresh token을 INSERT한다.
                    tmpStr       ="INSERT INTO "+commDBRW.database+".TB_P00_ACCOUNT_TOKEN \n";
                    tmpStr=tmpStr+"( \n";
                    tmpStr=tmpStr+" LOCAL_BIZ_COMP_CODE, \n";
                    tmpStr=tmpStr+" ACCOUNT_EMAIL_ID, \n";
                    tmpStr=tmpStr+" ACCOUNT_ROLE, \n";
                    tmpStr=tmpStr+" ACCOUNT_REFRESH_TOKEN, \n";
                    tmpStr=tmpStr+" CLIENT_IP_ADDRESS, \n";
                    tmpStr=tmpStr+" CLIENT_BROWSER_NAME, \n";
                    tmpStr=tmpStr+" CLIENT_APP_CODE_NAME, \n";
                    tmpStr=tmpStr+" CLIENT_PLATFORM, \n";
                    tmpStr=tmpStr+" CLIENT_USER_AGENT, \n";
                    tmpStr=tmpStr+" CLIENT_BROWSER_VERSION, \n";
                    tmpStr=tmpStr+" CLIENT_IS_MOBILE, \n";
                    tmpStr=tmpStr+" TOKEN_MEMBERSHIP, \n";
                    tmpStr=tmpStr+" RES_X, \n";
                    tmpStr=tmpStr+" RES_Y, \n";

                    //2022.7.9 안상현 POS Session 처리를 위한 항목추가
                    tmpStr=tmpStr+" DEVICE_POS_GBN, \n";
                    
                    tmpStr=tmpStr+" PARTITION_KEY_YYYYMM, \n";
                    tmpStr=tmpStr+" CREATION_DATETIME, \n";
                    tmpStr=tmpStr+" CREATION_WORKER, \n";
                    tmpStr=tmpStr+" CREATION_APP_ID, \n";
                    tmpStr=tmpStr+" UPDATE_DATETIME, \n";
                    tmpStr=tmpStr+" UPDATE_WORKER, \n";
                    tmpStr=tmpStr+" UPDATE_APP_ID, \n";
                    tmpStr=tmpStr+" PURGE_PLAN_DATE, \n";
                    tmpStr=tmpStr+" PURGE_WORKER, \n";
                    tmpStr=tmpStr+" PURGE_APP_ID \n";
                    tmpStr=tmpStr+") \n";
                    tmpStr=tmpStr+"VALUES \n";
                    tmpStr=tmpStr+"( \n";
                    tmpStr=tmpStr+" '"+envInfo.pLocalBizCompCode+"', \n";
                    tmpStr=tmpStr+" '"+userId+"', \n";
                    tmpStr=tmpStr+" '"+myrole+"', \n";
                    tmpStr=tmpStr+" '"+refreshToken+"', \n";

                    //client ipaddress
                    if(clientIpAddress==undefined||clientIpAddress==null)
                    {
                        tmpStr=tmpStr+" null, \n";
                    }
                    else
                    {
                        tmpStr=tmpStr+" '"+clientIpAddress+"', \n";
                    };

                    //client info
                    if(clientInfo.browserName==undefined||clientInfo.browserName==null)
                    {
                        tmpStr=tmpStr+" null, \n";
                    }
                    else
                    {
                        let browserName=clientInfo.browserName;
                        if(browserName.length>0){tmpStr=tmpStr+" '"+browserName+"', \n";}
                        else{tmpStr=tmpStr+" null, \n";};
                    };

                    if(clientInfo.appCodeName==undefined||clientInfo.appCodeName==null)
                    {
                        tmpStr=tmpStr+" null, \n";
                    }
                    else
                    {
                        let appCodeName=clientInfo.appCodeName;
                        if(appCodeName.length>0){tmpStr=tmpStr+" '"+appCodeName+"', \n";}
                        else{tmpStr=tmpStr+" null, \n";};
                    };

                    if(clientInfo.platformName==undefined||clientInfo.platformName==null)
                    {
                        tmpStr=tmpStr+" null, \n";
                    }
                    else
                    {
                        let platformName=clientInfo.platformName;
                        if(platformName.length>0){tmpStr=tmpStr+" '"+platformName+"', \n";}
                        else{tmpStr=tmpStr+" null, \n";};
                    };

                    if(clientInfo.userAgent==undefined||clientInfo.userAgent==null)
                    {
                        tmpStr=tmpStr+" null, \n";
                    }
                    else
                    {
                        let userAgent=clientInfo.userAgent;
                        if(userAgent.length>0){tmpStr=tmpStr+" '"+userAgent+"', \n";}
                        else{tmpStr=tmpStr+" null, \n";};
                    };

                    if(clientInfo.browserVersion==undefined||clientInfo.browserVersion==null)
                    {
                        tmpStr=tmpStr+" null, \n";
                    }
                    else
                    {
                        let browserVersion=clientInfo.browserVersion;
                        if(browserVersion.length>0){tmpStr=tmpStr+" '"+browserVersion+"', \n";}
                        else{tmpStr=tmpStr+" null, \n";};
                    };

                    if(clientInfo.isMobile==undefined||clientInfo.isMobile==null)
                    {
                        tmpStr=tmpStr+" null, \n";
                    }
                    else
                    {
                        let isMobile=clientInfo.isMobile;
                        if(isMobile.length>0){tmpStr=tmpStr+" '"+isMobile+"', \n";}
                        else{tmpStr=tmpStr+" null, \n";};
                    };

                    // let loginPage;
                    // let tokenMembership;
                    // if(clientInfo.tokenMembership == "" || clientInfo.tokenMembership == undefined){
                    //     loginPage = clientInfo.loginPage;
                    //     if(loginPage=="login.html"){tokenMembership = "BUY";}
                    //     else tokenMembership = "SCM";
                    // }
                    // else{
                    //     tokenMembership = clientInfo.tokenMembership;
                    // };

                    //membership 을 role명칭과 동일하게 mapping
                    if(myrole=="BUY")
                    {
                        tmpStr=tmpStr+" '"+myrole+"', \n";
                    }
                    else if(myrole=="ADMIN")
                    {
                        tmpStr=tmpStr+" 'ADM', \n";
                    }
                    else if(myrole=="SUPER")
                    {
                        tmpStr=tmpStr+" 'SUP', \n";
                    }
                    else if(myrole=="ERROR")
                    {
                        tmpStr=tmpStr+" 'ERR', \n";
                    };
                    
                    tmpStr=tmpStr+" '"+clientInfo.resX+"', \n";
                    tmpStr=tmpStr+" '"+clientInfo.resY+"', \n";
                    tmpStr+="  '', \n"; //공백문자로 넣는다.

                    //파티션Key (creation일때만 적용, 즉 최초 INSERT에만 한번 적용된다.)
                    let tmpPartitionKey=tmpServerTime.replace(/-/g,"");
                    tmpPartitionKey=tmpPartitionKey.substr(0,6);
                    tmpStr=tmpStr+" "+tmpPartitionKey+", \n";

                    tmpStr=tmpStr+" STR_TO_DATE('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'), \n";
                    if(userId.indexOf("@")>-1){userId=userId.split("@")[0];}; //전체를 넣지 말고 @앞자리만 넣는다.
                    tmpStr=tmpStr+" '"+userId+"', \n";
                    tmpStr=tmpStr+" 'sUpdateRefreshTokenInfo', \n";
                    tmpStr=tmpStr+" STR_TO_DATE('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'), \n";
                    tmpStr=tmpStr+" '"+userId+"', \n";
                    tmpStr=tmpStr+" 'sUpdateRefreshTokenInfo', \n";
                    tmpStr=tmpStr+" null,null,null \n";
                    tmpStr=tmpStr+")";

                    let rtnInfoInsert=await mydao.sqlHandlerForCompanyUPD(envInfo.pLocalBizCompCode,"RW",commDBRW,tmpStr,[]).then((rowsInsert)=>{
                        return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":"OK"};
                    });

                    //2022.06.02 윤희상 token이 발번될때 log Insert형식으로 변경됨에 따라 sMemberLogFlag의 값이 N이 되어 모든 모듈에선 log를 insert하지 않음.
                    //member log기록 함수를 호출한다.
                    let recordLog=require("./sSetMemberLogDB");
                    let rstLog=await recordLog.insertMemberLogDB(envInfo.pLocalBizCompCode, userId, request, "sUpdateRefreshTokenInfo");
                    return rtnInfoInsert;
                }
                else
                {
                    return {"errorcode":appmsg[83].messageCode, "errormessage":appmsg[83].messageText, "returnvalue":""};
                };
            }
        }
        catch(e)
        {
            return {"errorcode":appmsg[81].messageCode, "errormessage":appmsg[81].messageText, "returnvalue":""};
        };
    }
};

module.exports=sUpdateRefreshTokenInfo;