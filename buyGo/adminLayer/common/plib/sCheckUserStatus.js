/****************************************************************************************************
module명: sCheckUserStatus.js
creator: 안상현
date: 2022.8.31
version 1.0
설명: 사용자가 존재하는지를 Check하는 모듈 
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
let jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM();
const {document} = (new JSDOM("")).window;

var sCheckUserStatus={
    checkUserAuth: async function(sKey, myOwnerSchema, tmpMyDBInfo, rtnId, rtnPassword, rtnPasswordold, tmpFileName, checkGbn, request, tmpMembership, pMyRole)
    {
        const appmsg=require("./sapplicatioErrorMessage.json");
        const cookie=require("cookie");
        //얻어진 사용자 환경정보를 라이센스 및 account상태를 검사한다.
        let tmpStr      ="SELECT a.ACCOUNT_STATUS  \n";
        tmpStr = tmpStr + "      , a.LICENSE_STATUS  \n";
        tmpStr = tmpStr + "      , a.ACCOUNT_TYPE  \n";
        tmpStr = tmpStr + "      , a.ACCOUNT_ROLE  \n";
        tmpStr = tmpStr + "      , '' AS MD5_OLD_PASSWORD \n";
        tmpStr = tmpStr + "      , CONVERT(AES_DECRYPT(UNHEX(a.ACCOUNT_PASSWORD_E),SHA2(CONCAT(DATE_FORMAT(a.CREATION_DATETIME,'%Y-%m-%d %H:%i:%s'),'"+sKey.salt_sjgo+"'),512)) USING UTF8) AS USER_PASSWORD  \n";
        tmpStr = tmpStr + "   FROM "+tmpMyDBInfo.database+".TB_s00_ACCOUNT_OF_MEMBER a  \n";
        tmpStr = tmpStr + "  WHERE 1=1  \n";
        tmpStr = tmpStr + "    AND a.LOCAL_BIZ_COMP_CODE = ?  \n";

        //쿠키에 설정된 role code로 판단한다.
        const mr=require("./sMyRole.js");
        let myrole="";

        if(request.body.myrole==undefined||request.body.myrole==null)
        {
            myrole=mr.getMyRoleCode(pMyRole);
        }
        else
        {
            myrole=mr.getMyRoleCode(request.body.myrole);
        };
        
        if(myrole!="ERROR")
        {
            tmpStr=tmpStr+"    AND a.ACCOUNT_ROLE = '"+myrole+"' \n";
            tmpStr=tmpStr+"    AND a.ACCOUNT_EMAIL_ID = ? \n";

            let tdev ={
                host     : tmpMyDBInfo.host,
                user     : tmpMyDBInfo.dbrouser,    //여기서는 RO
                password : tmpMyDBInfo.dbropassword,
                database : tmpMyDBInfo.database,
                port     : tmpMyDBInfo.port,
                connectionLimit: tmpMyDBInfo.connectionLimit,
                multipleStatements: tmpMyDBInfo.multipleStatements
            };

            let sLogin_mydao=require("./sDbCommonDaoForCompanyAreaUPD");
            try
            {
                let checkAccount=await sLogin_mydao.sqlHandlerForCompanyUPD(tmpMyDBInfo.pLocalBizCompCode,"RO",tdev,tmpStr,[tmpMyDBInfo.pLocalBizCompCode, rtnId])
                .then((rows)=>{
                    if(rows.length>0)
                    {
                        //check license & status
                        let accountStatus=rows[0].ACCOUNT_STATUS;
                        let licenseStatus=rows[0].LICENSE_STATUS;
                        let dbUserPassword=rows[0].USER_PASSWORD;
                        let b2cb2b=rows[0].ACCOUNT_TYPE;
                        let accountRole=rows[0].ACCOUNT_ROLE;
                        let dbOldPassword=rows[0].MD5_OLD_PASSWORD;
                        if((licenseStatus!="1"&&licenseStatus!="2")||(accountStatus!="1"))
                        {   
                            //사용자 정보가 비정상 (라이센스 종료, 정지, 종료)
                            return {"errorcode":appmsg[5].messageCode, "errormessage":appmsg[5].messageText, 
                                    "returnvalue":"Error Authentication!", "accountStatus": accountStatus,
                                    "licenseStatus": licenseStatus, "b2cb2b": b2cb2b, "accountRole": accountRole};
                        };
                        
                        //암호 일치여부까지 확인하는 경우
                        if(checkGbn=="Y")
                        {
                            //20220427 ash add - 예전 암호가 있는 경우와 없는 경우로 나눈다.
                            if(dbOldPassword!=undefined&&dbOldPassword!=null&&dbOldPassword!="")
                            {
                                //예전 암호가 있으면 MD5 암호화 문자열이므로 old 비밀번호와 입력한 old에 해당하는 MD5체계와 비교한다. (2022.7.13 아래 if문장을 dbUserPassword-->dbOldPassword로 변경, 안상현)
                                if(dbOldPassword==rtnPasswordold)
                                {
                                    //이전 암호지만 일치한다. OK
                                    return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":"OK",
                                            "accountStatus": accountStatus, "licenseStatus": licenseStatus, "b2cb2b": b2cb2b, "accountRole": accountRole};
                                }
                                else
                                {
                                    //이전 암호로 비교해야 하는 대상이기는 한데, 어쨋든 비밀번호가 다르다 NO
                                    return {"errorcode":appmsg[20].messageCode, "errormessage":appmsg[20].messageText, "returnvalue":"OK",
                                            "accountStatus": accountStatus, "licenseStatus": licenseStatus, "b2cb2b": b2cb2b, "accountRole": accountRole};
                                }
                            }
                            else
                            {
                                //예전 암호가 없으면 기존 SHA256암호 체계와 비교한다.
                                if(dbUserPassword==rtnPassword)
                                {
                                    return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":"OK",
                                            "accountStatus": accountStatus, "licenseStatus": licenseStatus, "b2cb2b": b2cb2b, "accountRole": accountRole};
                                }
                                else
                                {   //불일치
                                    return {"errorcode":appmsg[20].messageCode, "errormessage":appmsg[20].messageText, "returnvalue":"OK",
                                            "accountStatus": accountStatus, "licenseStatus": licenseStatus, "b2cb2b": b2cb2b, "accountRole": accountRole};
                                };
                            };
                        };
                        
                        return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":"OK",
                                "accountStatus": accountStatus, "licenseStatus": licenseStatus, "b2cb2b": b2cb2b, "accountRole": accountRole};
                    }
                    else
                    {
                        //사용자 정보 없음
                        return {"errorcode":appmsg[5].messageCode, "errormessage":appmsg[5].messageText, "returnvalue":"Error Authentication!"};
                    };
                });

                return checkAccount;
            }
            catch(e)
            {
                //exception
                return {"errorcode":appmsg[81].messageCode, "errormessage":appmsg[81].messageText, "returnvalue":e.message};
            };
        }
        else
        {
            //role 없으면 사용자 상태를 파악할 수 없다.
            return {"errorcode":appmsg[76].messageCode, "errormessage":appmsg[76].messageText, "returnvalue":""};
        };
    },
    getUserInfo: async function(sKey, myOwnerSchema, pLocalBizCompCode, tmpMyDBInfo, rtnId, pMyRole)
    {
        const appmsg=require("./sapplicatioErrorMessage.json");
        //얻어진 사용자 환경정보를 라이센스 및 account상태를 검사한다.
        let tmpStr   ="SELECT a.ACCOUNT_TYPE \n";
        tmpStr=tmpStr+"     , a.ACCOUNT_ROLE \n";
        tmpStr=tmpStr+"     , a.ACCOUNT_STATUS \n";
        tmpStr=tmpStr+"     , a.LICENSE_STATUS \n";
        tmpStr=tmpStr+"     , a.DEPARTMENT_CODE \n";
        tmpStr=tmpStr+"  FROM "+myOwnerSchema+".TB_S00_ACCOUNT_OF_MEMBER a \n";
        tmpStr=tmpStr+" WHERE 1=1 \n";
        tmpStr=tmpStr+"   AND a.LOCAL_BIZ_COMP_CODE = ? \n";
        tmpStr=tmpStr+"   AND a.ACCOUNT_STATUS='1' \n";
        tmpStr=tmpStr+"   AND a.LICENSE_STATUS IN ('1','2') \n";
        tmpStr=tmpStr+"   AND a.ACCOUNT_EMAIL_ID = ? \n";
        
        const mr=require("./sMyRole.js");
        let myrole=mr.getMyRoleCode(pMyRole);
        if(myrole!="ERROR")
        {
            tmpStr=tmpStr+"  AND a.ACCOUNT_MEMBERSHIP = '"+myrole+"' \n";
            let tdev ={
                host     : tmpMyDBInfo.host,
                user     : tmpMyDBInfo.dbrouser,    //여기서는 RO
                password : tmpMyDBInfo.dbropassword,
                database : tmpMyDBInfo.database,
                port     : tmpMyDBInfo.port,
                connectionLimit: tmpMyDBInfo.connectionLimit,
                multipleStatements: tmpMyDBInfo.multipleStatements
            };

            let sLogin_mydao=require("./sDbCommonDaoForCompanyAreaUPD");
            try
            {
                let getAccount=await sLogin_mydao.sqlHandlerForCompanyUPD(tmpMyDBInfo.pLocalBizCompCode,"RO",tdev,tmpStr,[pLocalBizCompCode,rtnId])
                .then((rows)=>{
                    if(rows.length==1)
                    {
                        let userInfo={
                            "accountType"   :rows[0].ACCOUNT_TYPE,
                            "accountRole"   :rows[0].ACCOUNT_ROLE,
                            "accountStatus" :rows[0].ACCOUNT_STATUS,
                            "licenseStatus" :rows[0].LICENSE_STATUS,
                            "deparmentCode" :rows[0].DEPARTMENT_CODE
                        };

                        return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":userInfo};
                    }
                    else
                    {
                        //사용자 정보 없거나 비정상임
                        return {"errorcode":appmsg[5].messageCode, "errormessage":appmsg[5].messageText, "returnvalue":"Error Authentication!"};
                    };
                });

                return getAccount;
            }
            catch(e)
            {
                //exception
                return {"errorcode":appmsg[81].messageCode, "errormessage":appmsg[81].messageText, "returnvalue":e.message};
            };
        }
        else
        {
            //role 없으면 사용자 상태를 파악할 수 없다.
            return {"errorcode":appmsg[76].messageCode, "errormessage":appmsg[76].messageText, "returnvalue":""};
        };
    }
};

module.exports=sCheckUserStatus;