/****************************************************************************************************
module명: sAddAccountB2B.js
creator: 안상현
date: 2022.9.13
version 1.0
설명: B2B회원 전용 (점주, SCM공급사 운영자) 회원가입 공통모듈
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
const appmsg=require("./sapplicatioErrorMessage.json");
const jsdom=require("jsdom");
const {JSDOM}=jsdom;
const {window}=new JSDOM();
const {document}=(new JSDOM("")).window;
//const $=require("jquery")(window);
const mydao=require("./sDbCommonDaoForCompanyAreaUPD");
const sKey=require("./sKey");
//const agencyCode="sj001"; cxcxcx ?????
const sd=require("./sDateFormat");
const {parse}=require("cookie");
const tmpServerTime=sd.sDateFormat_dateFormatChange(new Date(), "YYYY-MM-DD HH:MM:SS");

var sAddAccountB2B={
    addAccountB2B: async function(request, response, internalParams)
    {
        let commonParams={};
        let rtn;
        let tdev=require("./sDbconfigRW");
        const localBizCompCode=tdev.localBizCompCode;
        if(request.body!=undefined&&request.body!=null)
        {
            let accToken=require("./sGetUserIdFromAccessToken");
            let myLoginId=accToken.sGetUserId(request, "short"); //login 한 admin 계정을 알기 위하여 호출한다.

            //단 화면에서 오는 경우는 SCM운영자 항목은 chEmail까지만 존재한다. (admin 관리용 화면 항목구성이 그러함)
            //USER용의 경우는 화면 입력란이 더 많기 때문에
            commonParams=request.body;
            commonParams.UIYN="UI";
            //checkGbn  모든 경우에서 필수 - 점주면 B2B_BUYER, 점주가 아니면 B2B_ADMIN 이라고 SET되어져서 이곳으로 전달된다.
            //procGbn   모든 경우에서 필수 - 화면에서 ID중복 Check를 부를때는 CHECK_DUP_ID 라고 Set한다., 중복 검사가 아니고 회원 가입이면 ADD_ACCOUNT라고 SET한다.
            commonParams.myLoginId=myLoginId;

            var tmpClientInfo=JSON.parse(request.body.clientInfo);

            //client정보를 부가적으로 넣는다.
            commonParams.appCodeName=tmpClientInfo.appCodeName;
            commonParams.browserName=tmpClientInfo.browserName;
            commonParams.browserVersion=tmpClientInfo.browserVersion;
            commonParams.isMobile=tmpClientInfo.isMobile;
            commonParams.loginPage=tmpClientInfo.loginPage;
            commonParams.platformName=tmpClientInfo.platformName;
            commonParams.userAgent=tmpClientInfo.userAgent;
        }
        else if(internalParams!=undefined&&internalParams!=null)
        {
            myLoginId="";
            //내부에서 불려진 것이라면
            commonParams=internalParams;
            commonParams.UIYN="NON_UI";
        }
        else
        {
            return {"errorcode":appmsg[51].messageCode, "errormessage":appmsg[51].messageText, "returnvalue":""};
        };

        //회원 중복 가입 여부 Check
        if(commonParams.procGbn=="CHECK_DUP_ID")
        {
            //id중복 check를 한다. 맨끝에 UI option은 화면에서 불렀을 때는 response.json을 사용하고, UI가 아닌경우 내부 return을 하기 위한 구분자임
            rtn=await check_id_duplication(localBizCompCode, commonParams.ssn, commonParams.checkGbn, commonParams.UIYN, "can ui response", "imauser");
        }
        else if(commonParams.procGbn=="ADD_ACCOUNT")
        {
            //회원 가입 처리
            //(1) INPUT CHECK는 화면단에서 처리한다.
            //(2) ID 중복 CHECK
            rtn=await check_id_duplication(localBizCompCode, commonParams.ssn, commonParams.checkGbn, commonParams.UIYN, "cannot ui response", "imauser");

            if(rtn!=undefined&&rtn!=null)
            {
                //만일 return 된 값이 존재하고 정상이 아니면 Error처리한다. - 중복으로 가입되면 안됨!
                if(rtn.errorcode!="PFERR_CONF_0000")
                {
                    return rtn;
                };
            };

            //(3) 비밀번호 PATTERN CHECK
            if(commonParams.pwd2!=undefined&&commonParams.pwd2!=null)
            {
                let tt=require("./sCheckPasswordPattern");
                let rst=tt.checkLevel2(commonParams.ssn, commonParams.pwd2);
                if(rst.p1!="true"){return {"errorcode":appmsg[67].messageCode, "errormessage":appmsg[67].messageText, "returnvalue":rst.p2};};
            };

            //(4) 회원 등록처리 (이때 점주, 공급사 운영자를 구분한다.)
            //    점주는 회원가입 신청으로 등록하고, 공급사 운영자는 정식 회원으로 등록한다.
            rtn=await insert_account_of_member(localBizCompCode, commonParams);
            if(rtn.errorcode=="PFERR_CONF_0000")
            {
                if(request!=undefined&&request!=null)
                {
                    //화면이면 response로 응답한다.
                    response.json(rtn);
                }
                else
                {
                    return rtn;
                };
            }
            else
            {
                if(request!=undefined&&request!=null)
                {
                    //화면이면 response로 응답한다.
                    response.json(rtn);
                }
                else
                {
                    return rtn;
                };
            };
        };

        function isNumber(s){s+=''; s=s.replace(/^\s*|\s*$/g,''); if(s==''||isNaN(s)){ return false;}; return true;};

        async function insert_account_of_member(pLocalBizCompCode, opt)
        {
            let tstr="";
            if(opt.checkGbn=="B2B_BUYER")
            {
                //점주로 등록할 때는 가입 신청상태로 등록한다.
                tstr="INSERT INTO "+tdev.database+".tb_s00_account_of_member ( \n";
                tstr+="   LOCAL_BIZ_COMP_CODE \n";
                tstr+="  ,AGENCY_CODE \n";
                tstr+="  ,ACCOUNT_TYPE \n";
                tstr+="  ,ACCOUNT_MEMBERSHIP \n";
                tstr+="  ,ACCOUNT_LEVEL \n";
                tstr+="  ,ACCOUNT_ROLE \n";
                tstr+="  ,DEPARTMENT_CODE \n";
                tstr+="  ,ACCOUNT_STATUS \n";
                tstr+="  ,ACCOUNT_EMAIL_ID \n";
                tstr+="  ,ACCOUNT_PASSWORD_E \n";
                tstr+="  ,ACCOUNT_NAME_E \n";
                tstr+="  ,AUTH_EMAIL_ID_E \n";
                tstr+="  ,LICENSE_STATUS \n";
                tstr+="  ,LICENSE_START_DATE \n";
                tstr+="  ,LICENSE_END_DATE \n";
                tstr+="  ,ACCOUNT_PHONE1_E \n";
                tstr+="  ,ACCOUNT_PHONE2_E \n";
                tstr+="  ,ACCOUNT_OLD_PASSWORD \n";
                tstr+="  ,BIZ_SSN_NO1 \n";
                tstr+="  ,BIZ_SSN_NO2 \n";
                tstr+="  ,BIZ_SSN_NO3 \n";
                tstr+="  ,BIZ_SSN_NO4 \n";
                tstr+="  ,BIZ_SSN_NO5 \n";
                tstr+="  ,DB_RO_ID_E \n";
                tstr+="  ,DB_RO_PWD_E \n";
                tstr+="  ,DB_RW_ID_E \n";
                tstr+="  ,DB_RW_PWD_E \n";
                tstr+="  ,DB_IP_E \n";
                tstr+="  ,DB_PORT \n";
                tstr+="  ,DB_CONNECTION_LIMIT \n";
                tstr+="  ,DB_MULTIPLE_STATEMENTS \n";
                tstr+="  ,DB_COMMON_SCHEMA \n";
                tstr+="  ,DB_SCHEMA \n";
                tstr+="  ,CREATION_DATETIME \n";
                tstr+="  ,CREATION_WORKER \n";
                tstr+="  ,CREATION_APP_ID \n";
                tstr+="  ,UPDATE_DATETIME \n";
                tstr+="  ,UPDATE_WORKER \n";
                tstr+="  ,UPDATE_APP_ID \n";
                tstr+="  ,PURGE_PLAN_DATE \n";
                tstr+="  ,PURGE_WORKER \n";
                tstr+="  ,PURGE_APP_ID \n";
                tstr+=") VALUES \n";
                tstr+="( \n";
                tstr+="  '"+pLocalBizCompCode+"' \n";
                tstr+=" ,'"+pLocalBizCompCode+"' \n";        //compcode를 default로 일단 agency code로 설정
                tstr+=" ,'B2B'\n";              //기업간 회원
                tstr+=" ,'BUY' \n";             //구매 점주 멤버십
                tstr+=" ,'LV_PURCHASE' \n";     //점주 구매자 레벨
                tstr+=" ,'BUY' \n";             //ROLE: 구매자 (중요한 항목임)
                tstr+=" ,null \n";             //부서는 NULL
                tstr+=" ,'1' \n";               //일단 ACTIVE로 신청을 받음
                tstr+=" ,'"+opt.ssn+"' \n";     //USER ID
                tstr+=" ,HEX(AES_ENCRYPT('"+opt.pwd1+"' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'), '"+sKey.salt_sjgo+"'), 512))) \n";
                tstr+=" ,HEX(AES_ENCRYPT('"+opt.ceo+"' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'), '"+sKey.salt_sjgo+"'), 512))) \n"; //대표자
                tstr+=" ,HEX(AES_ENCRYPT('"+opt.bizEmail1+"@"+opt.bizEmail2+"' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'), '"+sKey.salt_sjgo+"'), 512))) \n"; //인증당시 입력한 사용자 이메일
                tstr+=" ,'3' \n";   //일단 가입 신청시 3 종료로 초기 설정함
                tstr+=" ,STR_TO_DATE(SYSDATE(),'%Y-%m-%d %H:%i:%s') \n";    //현재시각으로 라이센스 개시설정
                tstr+=" ,STR_TO_DATE('2200-12-31 23:59:59','%Y-%m-%d %H:%i:%s') \n";    //향후 약 100년
                tstr+=" ,HEX(AES_ENCRYPT('"+opt.bizTel1+opt.bizTel2+opt.bizTel3+"' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'), '"+sKey.salt_sjgo+"'), 512))) \n"; //유선전화번호
                tstr+=" ,HEX(AES_ENCRYPT('"+opt.bizMobile1+opt.bizMobile2+opt.bizMobile3+"' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'), '"+sKey.salt_sjgo+"'), 512))) \n"; //휴대전화번호
                tstr+=" ,null \n"; //old password - 나중에 특정 업체 입점시 이전에 사용했던 비밀번호가 보존되어야 한다면 여기 부분을 수정해서 이용하면 된다.

                //입력한 id가 숫자 10자리면 사업자번호로 간주해서 사업자번호에 등록한다. 아니면 그냥 null이다.
                if(isNumber(opt.ssn)==true&&opt.ssn.length<11)
                {
                    tstr+=" ,'"+opt.ssn+"',null,null,null,null \n";
                }
                else
                {
                    tstr+=" ,null,null,null,null,null \n";
                };

                //DB 접속정보
                tstr+=" ,HEX(AES_ENCRYPT('sjrodbd01' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'),  '"+sKey.salt_sjgo+"'), 512))) \n";
                tstr+=" ,HEX(AES_ENCRYPT('sjro8428!' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'),  '"+sKey.salt_sjgo+"'), 512))) \n";
                tstr+=" ,HEX(AES_ENCRYPT('sjrwdbd01' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'),  '"+sKey.salt_sjgo+"'), 512))) \n";
                tstr+=" ,HEX(AES_ENCRYPT('sjrw8485%' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'),  '"+sKey.salt_sjgo+"'), 512))) \n";
                tstr+=" ,HEX(AES_ENCRYPT('127.0.0.1' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'),  '"+sKey.salt_sjgo+"'), 512))) \n";
                tstr+=" ,3306 ,10 ,'TRUE','sjcommon','sjgo' \n";

                tstr+=" ,STR_TO_DATE('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s') \n";
                if(opt.myLoginId.length<1)
                {
                    opt.myLoginId="Unknown";
                };
                tstr+=" ,'"+opt.myLoginId+"' \n";
                tstr+=" ,'addAccountUI' \n";
                tstr+=" ,STR_TO_DATE('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s') \n";
                tstr+=" ,'"+opt.myLoginId+"' \n";
                tstr+=" ,'addAccountUI' \n";
                tstr+=" ,null \n";
                tstr+=" ,null \n";
                tstr+=" ,null \n";
                tstr+=") \n";
            }
            else if(opt.checkGbn=="B2B_SUPER")
            {
                //공급사 운영자로 등록할 때는 가입 완료 상태로 등록한다.  
                tstr="INSERT INTO "+tdev.database+".tb_s00_account_of_member ( \n";
                tstr+="   LOCAL_BIZ_COMP_CODE \n";
                tstr+="  ,AGENCY_CODE \n";
                tstr+="  ,ACCOUNT_TYPE \n";
                tstr+="  ,ACCOUNT_MEMBERSHIP \n";
                tstr+="  ,ACCOUNT_LEVEL \n";
                tstr+="  ,ACCOUNT_ROLE \n";
                tstr+="  ,DEPARTMENT_CODE \n";
                tstr+="  ,ACCOUNT_STATUS \n";
                tstr+="  ,ACCOUNT_EMAIL_ID \n";
                tstr+="  ,ACCOUNT_PASSWORD_E \n";
                tstr+="  ,ACCOUNT_NAME_E \n";
                tstr+="  ,AUTH_EMAIL_ID_E \n";
                tstr+="  ,LICENSE_STATUS \n";
                tstr+="  ,LICENSE_START_DATE \n";
                tstr+="  ,LICENSE_END_DATE \n";
                tstr+="  ,ACCOUNT_PHONE1_E \n";
                tstr+="  ,ACCOUNT_PHONE2_E \n";
                tstr+="  ,ACCOUNT_OLD_PASSWORD \n";
                tstr+="  ,BIZ_SSN_NO1 \n";
                tstr+="  ,BIZ_SSN_NO2 \n";
                tstr+="  ,BIZ_SSN_NO3 \n";
                tstr+="  ,BIZ_SSN_NO4 \n";
                tstr+="  ,BIZ_SSN_NO5 \n";
                tstr+="  ,DB_RO_ID_E \n";
                tstr+="  ,DB_RO_PWD_E \n";
                tstr+="  ,DB_RW_ID_E \n";
                tstr+="  ,DB_RW_PWD_E \n";
                tstr+="  ,DB_IP_E \n";
                tstr+="  ,DB_PORT \n";
                tstr+="  ,DB_CONNECTION_LIMIT \n";
                tstr+="  ,DB_MULTIPLE_STATEMENTS \n";
                tstr+="  ,DB_COMMON_SCHEMA \n";
                tstr+="  ,DB_SCHEMA \n";
                tstr+="  ,CREATION_DATETIME \n";
                tstr+="  ,CREATION_WORKER \n";
                tstr+="  ,CREATION_APP_ID \n";
                tstr+="  ,UPDATE_DATETIME \n";
                tstr+="  ,UPDATE_WORKER \n";
                tstr+="  ,UPDATE_APP_ID \n";
                tstr+="  ,PURGE_PLAN_DATE \n";
                tstr+="  ,PURGE_WORKER \n";
                tstr+="  ,PURGE_APP_ID \n";
                tstr+="( \n";
                tstr+="  '"+pLocalBizCompCode+"' \n";
                tstr+=" ,'"+pLocalBizCompCode+"' \n";        //compcode를 default로 일단 agency code로 설정
                tstr+=" ,'B2B'\n";              //기업간 회원
                tstr+=" ,'SCM' \n";             //공급사 담당자 멤버십
                tstr+=" ,'LV_SELL' \n";     //공급사 레벨
                tstr+=" ,'SUPER' \n";             //ROLE: 공급사 (중요한 항목임)
                tstr+=" ,null \n";             //부서는 NULL
                tstr+=" ,'2' \n";               //공급사는 바로 2
                tstr+=" ,'"+opt.ssn+"' \n";     //USER ID
                tstr+=" ,HEX(AES_ENCRYPT('"+opt.pwd1+"' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'), '"+sKey.salt_sjgo+"'), 512))) \n";
                tstr+=" ,HEX(AES_ENCRYPT('"+opt.ceo+"' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'), '"+sKey.salt_sjgo+"'), 512))) \n"; //대표자
                tstr+=" ,HEX(AES_ENCRYPT('"+opt.bizEmail1+"@"+opt.bizEmail2+"' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'), '"+sKey.salt_sjgo+"'), 512))) \n"; //인증당시 입력한 사용자 이메일
                tstr+=" ,'3' \n";   //일단 가입 신청시 3 종료로 초기 설정함
                tstr+=" ,STR_TO_DATE(SYSDATE(),'%Y-%m-%d %H:%i:%s') \n";    //현재시각으로 라이센스 개시설정
                tstr+=" ,STR_TO_DATE('2200-12-31 23:59:59','%Y-%m-%d %H:%i:%s') \n";    //향후 약 100년
                tstr+=" ,HEX(AES_ENCRYPT('"+opt.bizTel1+opt.bizTel2+opt.bizTel3+"' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'), '"+sKey.salt_sjgo+"'), 512))) \n"; //유선전화번호
                tstr+=" ,HEX(AES_ENCRYPT('"+opt.bizMobile1+opt.bizMobile2+opt.bizMobile3+"' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'), '"+sKey.salt_sjgo+"'), 512))) \n"; //휴대전화번호
                tstr+=" ,null \n"; //old password - 나중에 특정 업체 입점시 이전에 사용했던 비밀번호가 보존되어야 한다면 여기 부분을 수정해서 이용하면 된다.

                //입력한 id가 숫자 10자리면 사업자번호로 간주해서 사업자번호에 등록한다. 아니면 그냥 null이다.
                if(isNumber(opt.ssn)==true&&opt.ssn.length<11)
                {
                    tstr+=" ,'"+opt.ssn+"',null,null,null,null \n";
                }
                else
                {
                    tstr+=" ,null,null,null,null,null \n";
                };

                //DB 접속정보
                tstr+=" ,HEX(AES_ENCRYPT('sjrodbd01' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'),  '"+sKey.salt_sjgo+"'), 512))) \n";
                tstr+=" ,HEX(AES_ENCRYPT('sjro8428!' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'),  '"+sKey.salt_sjgo+"'), 512))) \n";
                tstr+=" ,HEX(AES_ENCRYPT('sjrwdbd01' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'),  '"+sKey.salt_sjgo+"'), 512))) \n";
                tstr+=" ,HEX(AES_ENCRYPT('sjrw8485%' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'),  '"+sKey.salt_sjgo+"'), 512))) \n";
                tstr+=" ,HEX(AES_ENCRYPT('127.0.0.1' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'),  '"+sKey.salt_sjgo+"'), 512))) \n";
                tstr+=" ,3306 ,10 ,'TRUE','sjcommon','sjgo' \n";

                tstr+=" ,STR_TO_DATE('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s') \n";
                if(opt.myLoginId.length<1)
                {
                    opt.myLoginId="Unknown";
                };
                tstr+=" ,'"+opt.myLoginId+"' \n";
                tstr+=" ,'addAccountUI' \n";
                tstr+=" ,STR_TO_DATE('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s') \n";
                tstr+=" ,'"+opt.myLoginId+"' \n";
                tstr+=" ,'addAccountUI' \n";
                tstr+=" ,null \n";
                tstr+=" ,null \n";
                tstr+=" ,null \n";
                tstr+=") \n";
            }
            else if(opt.checkGbn=="B2B_ADMIN")
            {
                //공급사 운영자로 등록할 때는 가입 완료 상태로 등록한다.
                tstr="INSERT INTO "+tdev.database+".tb_s00_account_of_member ( \n";
                tstr+="   LOCAL_BIZ_COMP_CODE \n";
                tstr+="  ,AGENCY_CODE \n";
                tstr+="  ,ACCOUNT_TYPE \n";
                tstr+="  ,ACCOUNT_MEMBERSHIP \n";
                tstr+="  ,ACCOUNT_LEVEL \n";
                tstr+="  ,ACCOUNT_ROLE \n";
                tstr+="  ,DEPARTMENT_CODE \n";
                tstr+="  ,ACCOUNT_STATUS \n";
                tstr+="  ,ACCOUNT_EMAIL_ID \n";
                tstr+="  ,ACCOUNT_PASSWORD_E \n";
                tstr+="  ,ACCOUNT_NAME_E \n";
                tstr+="  ,AUTH_EMAIL_ID_E \n";
                tstr+="  ,LICENSE_STATUS \n";
                tstr+="  ,LICENSE_START_DATE \n";
                tstr+="  ,LICENSE_END_DATE \n";
                tstr+="  ,ACCOUNT_PHONE1_E \n";
                tstr+="  ,ACCOUNT_PHONE2_E \n";
                tstr+="  ,ACCOUNT_OLD_PASSWORD \n";
                tstr+="  ,BIZ_SSN_NO1 \n";
                tstr+="  ,BIZ_SSN_NO2 \n";
                tstr+="  ,BIZ_SSN_NO3 \n";
                tstr+="  ,BIZ_SSN_NO4 \n";
                tstr+="  ,BIZ_SSN_NO5 \n";
                tstr+="  ,DB_RO_ID_E \n";
                tstr+="  ,DB_RO_PWD_E \n";
                tstr+="  ,DB_RW_ID_E \n";
                tstr+="  ,DB_RW_PWD_E \n";
                tstr+="  ,DB_IP_E \n";
                tstr+="  ,DB_PORT \n";
                tstr+="  ,DB_CONNECTION_LIMIT \n";
                tstr+="  ,DB_MULTIPLE_STATEMENTS \n";
                tstr+="  ,DB_COMMON_SCHEMA \n";
                tstr+="  ,DB_SCHEMA \n";
                tstr+="  ,CREATION_DATETIME \n";
                tstr+="  ,CREATION_WORKER \n";
                tstr+="  ,CREATION_APP_ID \n";
                tstr+="  ,UPDATE_DATETIME \n";
                tstr+="  ,UPDATE_WORKER \n";
                tstr+="  ,UPDATE_APP_ID \n";
                tstr+="  ,PURGE_PLAN_DATE \n";
                tstr+="  ,PURGE_WORKER \n";
                tstr+="  ,PURGE_APP_ID \n";
                tstr+=") VALUES \n";
                tstr+="( \n";
                tstr+="  '"+pLocalBizCompCode+"' \n";
                tstr+=" ,'"+pLocalBizCompCode+"' \n";        //compcode를 default로 일단 agency code로 설정
                tstr+=" ,'B2B'\n";              //기업간 회원
                tstr+=" ,'ADMIN' \n";             //ADMIN 멤버십
                tstr+=" ,'LV_ADM' \n";     //ADMIN 레벨
                tstr+=" ,'ADMIN' \n";             //ROLE: ADMIN (중요한 항목임)
                tstr+=" ,null \n";             //부서는 NULL
                tstr+=" ,'1' \n";               //일단 ACTIVE로 신청을 받음
                tstr+=" ,'"+opt.ssn+"' \n";     //USER ID
                tstr+=" ,HEX(AES_ENCRYPT('"+opt.pwd1+"' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'), '"+sKey.salt_sjgo+"'), 512))) \n";
                tstr+=" ,HEX(AES_ENCRYPT('"+opt.ceo+"' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'), '"+sKey.salt_sjgo+"'), 512))) \n"; //대표자
                tstr+=" ,HEX(AES_ENCRYPT('"+opt.bizEmail1+"@"+opt.bizEmail2+"' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'), '"+sKey.salt_sjgo+"'), 512))) \n"; //인증당시 입력한 사용자 이메일
                tstr+=" ,'2' \n";   //ADMIN은 바로 2
                tstr+=" ,STR_TO_DATE(SYSDATE(),'%Y-%m-%d %H:%i:%s') \n";    //현재시각으로 라이센스 개시설정
                tstr+=" ,STR_TO_DATE('2200-12-31 23:59:59','%Y-%m-%d %H:%i:%s') \n";    //향후 약 100년
                tstr+=" ,HEX(AES_ENCRYPT('"+opt.bizTel1+opt.bizTel2+opt.bizTel3+"' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'), '"+sKey.salt_sjgo+"'), 512))) \n"; //유선전화번호
                tstr+=" ,HEX(AES_ENCRYPT('"+opt.bizMobile1+opt.bizMobile2+opt.bizMobile3+"' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'), '"+sKey.salt_sjgo+"'), 512))) \n"; //휴대전화번호
                tstr+=" ,null \n"; //old password - 나중에 특정 업체 입점시 이전에 사용했던 비밀번호가 보존되어야 한다면 여기 부분을 수정해서 이용하면 된다.

                //입력한 id가 숫자 10자리면 사업자번호로 간주해서 사업자번호에 등록한다. 아니면 그냥 null이다.
                if(isNumber(opt.ssn)==true&&opt.ssn.length<11)
                {
                    tstr+=" ,'"+opt.ssn+"',null,null,null,null \n";
                }
                else
                {
                    tstr+=" ,null,null,null,null,null \n";
                };

                //DB 접속정보
                tstr+=" ,HEX(AES_ENCRYPT('sjrodbd01' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'),  '"+sKey.salt_sjgo+"'), 512))) \n";
                tstr+=" ,HEX(AES_ENCRYPT('sjro8428!' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'),  '"+sKey.salt_sjgo+"'), 512))) \n";
                tstr+=" ,HEX(AES_ENCRYPT('sjrwdbd01' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'),  '"+sKey.salt_sjgo+"'), 512))) \n";
                tstr+=" ,HEX(AES_ENCRYPT('sjrw8485%' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'),  '"+sKey.salt_sjgo+"'), 512))) \n";
                tstr+=" ,HEX(AES_ENCRYPT('127.0.0.1' ,SHA2(CONCAT(str_to_date('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s'),  '"+sKey.salt_sjgo+"'), 512))) \n";
                tstr+=" ,3306 ,10 ,'TRUE','sjcommon','sjgo' \n";

                tstr+=" ,STR_TO_DATE('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s') \n";
                if(opt.myLoginId.length<1)
                {
                    opt.myLoginId="Unknown";
                };
                tstr+=" ,'"+opt.myLoginId+"' \n";
                tstr+=" ,'addAccountUI' \n";
                tstr+=" ,STR_TO_DATE('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s') \n";
                tstr+=" ,'"+opt.myLoginId+"' \n";
                tstr+=" ,'addAccountUI' \n";
                tstr+=" ,null \n";
                tstr+=" ,null \n";
                tstr+=" ,null \n";
                tstr+=") \n";
            };

            try{
                rtn=await mydao.sqlHandlerForCompanyUPD(pLocalBizCompCode, "RW", tdev, tstr, [])
                .then((rows)=>
                {
                    if(rows.affectedRows>0)
                    {
                        return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":"OK"};
                    }
                    else
                    {
                        return {"errorcode":appmsg[38].messageCode, "errormessage":appmsg[38].messageText, "returnvalue":""};
                    };
                });
                return rtn;

            }
            catch(e)
            {
                return {"errorcode":appmsg[60].messageCode, "errormessage":appmsg[60].messageText, "returnvalue":"Exception Code #2133"};
            };
        }
        
        async function check_id_duplication(pLocalBizCompCode, pUser, pCheckGbn, opt, rtnOption, cookieRole)
        {
            let rtn;
            let mr=require("./sMyRole");
            let myrole=mr.getMyRoleCode(cookieRole);
            //공급사 운영자 또는 점주(BUYER)인 경우에 대한 회원 중복 가입 여부 검사
            let tstr=" SELECT COUNT(1) AS CNT\n";
            tstr=tstr+"  FROM sjgo.tb_s00_account_of_member a \n";
            tstr=tstr+" WHERE a.LOCAL_BIZ_COMP_CODE = ? \n";
            tstr=tstr+"   AND a.ACCOUNT_MEMBERSHIP = '"+myrole+"' \n";
            tstr=tstr+"   AND a.ACCOUNT_EMAIL_ID = ? ";

            let rest;
            try{
                rtn=await mydao.sqlHandlerForCompanyUPD(pLocalBizCompCode, "RW", tdev, tstr, [pLocalBizCompCode, pUser])
                .then((rows)=>
                {
                    if(rows[0].CNT>0)
                    {
                        //중복이 있음
                        rest={"errorcode":appmsg[66].messageCode, "errormessage":appmsg[66].messageText, "returnvalue":""};
                        if(rtnOption=="can ui response"){response.json(rest);}else{return rest;};
                    }
                    else
                    {
                        rest={"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":"OK"};
                        if(rtnOption=="can ui response"){response.json(rest);}else{return rest;};
                    };
                });

                if(rtn!=undefined&&rtn!=null)
                {
                    return rtn;
                };
            }
            catch(e)
            {
                rest={"errorcode":appmsg[60].messageCode, "errormessage":appmsg[60].messageText, "returnvalue":"Exception Code #2131"};
                if(rtnOption=="can ui response"){response.json(rest);}else{return rest;};
            };
        };
        
    },
    addBuyerAccountB2B: async function(request, response, internalParams)
    {
        ////////////////////////////////////////////// 이것은 ADMIN이 최종 승인처리할 때 ??????????????????????????????????????????????
        let commonParams={};
        let rtn;
        let tdev=require("./sDbconfigRW");

        if(request!=undefined&&request!=null)
        {
            let accToken=require("./sGetUserIdFromAccessToken");
            let myLoginId=accToken.sGetUserId(request, "short"); //login 한 admin 계정을 알기 위하여 호출한다.
            //화면에서 온 것이라면
            //단 화면에서 오는 경우는 SCM운영자 항목은 chEmail까지만 존재한다. (admin 관리용 화면 항목구성이 그러함)
            //점주용의 경우는 화면 입력란이 더 많기 때문에
            commonParams=request.query.addinfo;
            commonParams.UIYN="UI";
            //checkGbn  모든 경우에서 필수 - 점주면 B2B_BUYER, 점주가 아니면 B2B_ADMIN 이라고 SET되어져서 이곳으로 전달된다.
            //procGbn   모든 경우에서 필수 - 화면에서 ID중복 Check를 부를때는 CHECK_DUP_ID 라고 Set한다., 중복 검사가 아니고 회원 가입이면 ADD_ACCOUNT라고 SET한다.
            commonParams.myLoginId=myLoginId;

            //client정보를 부가적으로 넣는다.
            commonParams.appCodeName=request.query.client.appCodeName
            commonParams.browserName=request.query.client.browserName
            commonParams.browserVersion=request.query.client.browserVersion
            commonParams.isMobile=request.query.client.isMobile
            commonParams.loginPage=request.query.client.loginPage
            commonParams.platformName=request.query.client.platformName
            commonParams.userAgent=request.query.client.userAgent
        }
        else if(internalParams!=undefined&&internalParams!=null)
        {
            myLoginId="";
            //내부에서 불려진 것이라면
            commonParams=internalParams;
            commonParams.UIYN="NON_UI";
        }
        else
        {
            return {"errorcode":appmsg[51].messageCode, "errormessage":appmsg[51].messageText, "returnvalue":""};
        };

        //회원 중복 가입 여부 Check
        if(commonParams.procGbn=="CHECK_DUP_ID")
        {
            //id중복 check를 한다. 맨끝에 UI option은 화면에서 불렀을 때는 response.json을 사용하고, UI가 아닌경우 내부 return을 하기 위한 구분자임
            rtn=await check_id_duplication(localBizCompCode, commonParams.ssn, commonParams.checkGbn, commonParams.UIYN, "can ui response", "imauser");
        }
        else if(commonParams.procGbn=="ADD_ACCOUNT")
        {
            //회원 가입 처리
            //(1) INPUT CHECK는 화면단에서 처리한다.
            //(2) ID 중복 CHECK
            rtn=await check_id_duplication(localBizCompCode, commonParams.ssn, commonParams.checkGbn, commonParams.UIYN, "cannot ui response", "imauser");

            if(rtn!=undefined&&rtn!=null)
            {
                //만일 return 된 값이 존재하고 정상이 아니면 Error처리한다. - 중복으로 가입되면 안됨!
                if(rtn.errorcode!="PFERR_CONF_0000")
                {
                    return rtn;
                };
            };

            //(3) 비밀번호 PATTERN CHECK
            if(commonParams.pwd2!=undefined&&commonParams.pwd2!=null)
            {
                let tt=require("./sCheckPasswordPattern");
                let rst=tt.checkLevel2(commonParams.ssn, commonParams.pwd2);
                if(rst.p1!="true"){return {"errorcode":appmsg[67].messageCode, "errormessage":appmsg[67].messageText, "returnvalue":rst.p2};};
            };

            //(4) 회원 등록처리 (이때 점주, 공급사 운영자를 구분한다.)
            //    점주는 회원가입 신청으로 등록하고, 공급사 운영자는 정식 회원으로 등록한다.
            rtn=await insert_account_of_member(localBizCompCode, commonParams);
            if(rtn.errorcode=="PFERR_CONF_0000")
            {
                //supplier master에도 등록한다.
                rtn=await insert_supplier_and_buyer_master(localBizCompCode, commonParams);

                if(request!=undefined&&request!=null)
                {
                    //화면이면 response로 응답한다.
                    response.json(rtn);
                }
                else
                {
                    return rtn;
                };
            }
            else
            {
                if(request!=undefined&&request!=null)
                {
                    //화면이면 response로 응답한다.
                    response.json(rtn);
                }
                else
                {
                    return rtn;
                };
            };
        };

        async function insert_account_of_member(pLocalBizCompCode, opt)
        {
            let tstr="";
            if(opt.checkGbn=="B2B_BUYER")
            {
                //점주로 등록할 때는 가입 신청상태로 등록한다.
                tstr="INSERT INTO sjgo.tb_s00_account_of_member ( \n";
                tstr+="    LOCAL_BIZ_COMP_CODE \n";
                tstr+=" , AGENCY_CODE  \n";
                tstr+=" , ACCOUNT_TYPE  \n";
                tstr+=" , ACCOUNT_MEMBERSHIP \n";
                tstr+=" , ACCOUNT_LEVEL  \n";
                tstr+=" , ACCOUNT_ROLE \n";
                tstr+=" , DEPARTMENT_CODE \n";
                tstr+=" , ACCOUNT_STATUS \n";
                tstr+=" , ACCOUNT_EMAIL_ID \n";
                tstr+=" , ACCOUNT_PASSWORD \n";
                tstr+=" , LICENSE_STATUS \n";
                tstr+=" , LICENSE_START_DATE \n";
                tstr+=" , LICENSE_END_DATE  \n";
                tstr+=" , ACCOUNT_PHONE1 \n";
                tstr+=" , ACCOUNT_ADDRESS1 \n";
                tstr+=" , ACCOUNT_ADDRESS2 \n";
                tstr+=" , ACCOUNT_ADDRESS3 \n";
                tstr+=" , ACCOUNT_ADDRESS4 \n";
                tstr+=" , ACCOUNT_ADDRESS5 \n";
                tstr+=" , ACCOUNT_ADDRESS6 \n";
                tstr+=" , ACCOUNT_ADDRESS7 \n";
                tstr+=" , ACCOUNT_ADDRESS8 \n";
                tstr+=" , ACCOUNT_ADDRESS9 \n";
                tstr+=" , MD5_OLD_PASSWORD \n";
                tstr+=" , NADLE_ACCOUNT_IDX \n";
                tstr+=" , REF_SSN \n";
                tstr+=" , CREATION_DATETIME \n";
                tstr+=" , CREATION_WORKER \n";
                tstr+=" , CREATION_APP_ID \n";
                tstr+=" , UPDATE_DATETIME \n";
                tstr+=" , UPDATE_WORKER \n";
                tstr+=" , UPDATE_APP_ID \n";
                tstr+=" , PURGE_PLAN_DATE \n";
                tstr+=" , PURGE_WORKER \n";
                tstr+=" , PURGE_APP_ID \n";
                tstr+=") VALUES \n";
                tstr+="( \n";
                tstr+="   '"+pLocalBizCompCode+"' \n";
                tstr+=" ,'EUM_HEAD' \n";        //본사 소속으로 설정
                tstr+=" ,'B2B'\n";              //기업간 회원
                tstr+=" ,'BUY' \n";             //구매 점주 멤버십
                tstr+=" ,'LV_PURCHASE' \n";     //점주 구매자 레벨
                tstr+=" ,'NORMAL' \n";          //일반회원
                tstr+=" , null \n";             //부서는 NULL
                tstr+=" ,'1' \n";               //일단 ACTIVE로 신청을 받음
                tstr+=" ,AES_ENCRYPT('"+opt.ssn+"' ,SHA2(CONCAT('"+tmpServerTime+"',  '"+sKey.save_id_aes_db+"'), 512))  \n";
                tstr+=" ,AES_ENCRYPT('"+opt.pwd1+"' ,SHA2(CONCAT('"+tmpServerTime+"',  '"+sKey.save_id_aes_db+"'), 512)) \n";
                tstr+=" ,'3' \n";   //일단 가입 신청시 3 종료로 초기 설정함
                tstr+=" ,STR_TO_DATE(SYSDATE(),'%Y-%m-%d %H:%i:%s') \n";    //현재시각으로 라이센스 개시설정
                tstr+=" ,STR_TO_DATE('2200-12-31 23:59:59','%Y-%m-%d %H:%i:%s') \n";    //향후 약 100년
                tstr+=" ,AES_ENCRYPT('"+(opt.bizMobile1+"-"+opt.bizMobile2+"-"+opt.bizMobile3)+"' ,SHA2(CONCAT('"+tmpServerTime+"',  '"+sKey.save_id_aes_db+"'), 512))  \n";  //휴대폰으로 등록
                tstr+=" ,AES_ENCRYPT('"+opt.bizZipCode+" "+opt.bizAddr1+" "+opt.bizAddr2+"' ,SHA2(CONCAT('"+tmpServerTime+"',  '"+sKey.save_id_aes_db+"'), 512))  \n";    //1에는 소재지 주소를 넣고
                tstr+=" ,AES_ENCRYPT('"+opt.deliZipCode+" "+opt.deliAddr1+" "+opt.deliAddr2+"' ,SHA2(CONCAT('"+tmpServerTime+"',  '"+sKey.save_id_aes_db+"'), 512))  \n";    //2에는 배송지 주소를 넣는다
                tstr+=" ,'' \n";
                tstr+=" ,'' \n";
                tstr+=" ,'' \n";
                tstr+=" ,'' \n";
                tstr+=" ,'' \n";
                tstr+=" ,'' \n";
                tstr+=" ,'' \n";
                tstr+=" ,null \n";
                tstr+=" ,-1 \n";

                //20220623 ASH REF_SSN ADD
                tstr+=" ,'"+opt.ssn+"' \n";

                tstr+=" ,STR_TO_DATE('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s') \n";
                if(opt.myLoginId.length<1)
                {
                    opt.myLoginId="NOT_DEF7";
                };
                tstr+=" ,'"+opt.myLoginId+"' \n";
                tstr+=" ,'adminListAdm' \n";
                tstr+=" ,STR_TO_DATE('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s') \n";
                tstr+=" ,'"+opt.myLoginId+"' \n";
                tstr+=" ,'adminListAdm' \n";
                tstr+=" ,null \n";
                tstr+=" ,null \n";
                tstr+=" ,null \n";
                tstr+=") \n";
            }
            else
            {
                //공급사 운영자로 등록할 때는 가입 완료 상태로 등록한다.
                tstr="INSERT INTO sjgo.tb_s00_account_of_member ( \n";
                tstr+="    LOCAL_BIZ_COMP_CODE \n";
                tstr+=" , AGENCY_CODE  \n";
                tstr+=" , ACCOUNT_TYPE  \n";
                tstr+=" , ACCOUNT_MEMBERSHIP \n";
                tstr+=" , ACCOUNT_LEVEL  \n";
                tstr+=" , ACCOUNT_ROLE \n";
                tstr+=" , DEPARTMENT_CODE \n";
                tstr+=" , ACCOUNT_STATUS \n";
                tstr+=" , ACCOUNT_EMAIL_ID \n";
                tstr+=" , ACCOUNT_PASSWORD \n";
                tstr+=" , LICENSE_STATUS \n";
                tstr+=" , LICENSE_START_DATE \n";
                tstr+=" , LICENSE_END_DATE  \n";
                tstr+=" , ACCOUNT_PHONE1 \n";
                tstr+=" , ACCOUNT_ADDRESS1 \n";
                tstr+=" , ACCOUNT_ADDRESS2 \n";
                tstr+=" , ACCOUNT_ADDRESS3 \n";
                tstr+=" , ACCOUNT_ADDRESS4 \n";
                tstr+=" , ACCOUNT_ADDRESS5 \n";
                tstr+=" , ACCOUNT_ADDRESS6 \n";
                tstr+=" , ACCOUNT_ADDRESS7 \n";
                tstr+=" , ACCOUNT_ADDRESS8 \n";
                tstr+=" , ACCOUNT_ADDRESS9 \n";
                tstr+=" , MD5_OLD_PASSWORD \n";
                tstr+=" , NADLE_ACCOUNT_IDX \n";
                tstr+=" , REF_SSN \n";
                tstr+=" , CREATION_DATETIME \n";
                tstr+=" , CREATION_WORKER \n";
                tstr+=" , CREATION_APP_ID \n";
                tstr+=" , UPDATE_DATETIME \n";
                tstr+=" , UPDATE_WORKER \n";
                tstr+=" , UPDATE_APP_ID \n";
                tstr+=" , PURGE_PLAN_DATE \n";
                tstr+=" , PURGE_WORKER \n";
                tstr+=" , PURGE_APP_ID \n";
                tstr+=") VALUES \n";
                tstr+="( \n";
                tstr+="   '"+pLocalBizCompCode+"' \n";
                tstr+=" ,'EUM_HEAD' \n";        //본사 소속으로 설정
                tstr+=" ,'B2B'\n";              //기업간 회원
                tstr+=" ,'SCM' \n";             //공급사 운영자 멤버십
                tstr+=" ,'LV_SELL' \n";         //공급사 판매자 레벨
                tstr+=" ,'SUPER' \n";           //super회원
                tstr+=" , '"+pLocalBizCompCode+"' \n";             //부서는 이음몰 동일부서로
                tstr+=" ,'1' \n";               //ACTIVE로 가입처리
                tstr+=" ,AES_ENCRYPT('"+opt.ssn+"' ,SHA2(CONCAT('"+tmpServerTime+"',  '"+sKey.save_id_aes_db+"'), 512))  \n";
                tstr+=" ,AES_ENCRYPT('"+opt.pwd1+"' ,SHA2(CONCAT('"+tmpServerTime+"',  '"+sKey.save_id_aes_db+"'), 512)) \n";
                tstr+=" ,'2' \n";   //라이센스 바로 활성화
                tstr+=" ,STR_TO_DATE(SYSDATE(),'%Y-%m-%d %H:%i:%s') \n";    //현재시각으로 라이센스 개시설정
                tstr+=" ,STR_TO_DATE('2200-12-31 23:59:59','%Y-%m-%d %H:%i:%s') \n";    //향후 약 100년
                tstr+=" ,AES_ENCRYPT('"+(opt.bizMobile1+"-"+opt.bizMobile2+"-"+opt.bizMobile3)+"' ,SHA2(CONCAT('"+tmpServerTime+"',  '"+sKey.save_id_aes_db+"'), 512))  \n";  //담당자 휴대폰으로 등록
                tstr+=" ,'' \n";   //공급사에서 등록할 때는 배송지, 주소지 자체가 화면에 없음
                tstr+=" ,null \n";
                tstr+=" ,null \n";
                tstr+=" ,null \n";
                tstr+=" ,null \n";
                tstr+=" ,null \n";
                tstr+=" ,null \n";
                tstr+=" ,null \n";
                tstr+=" ,null \n";
                tstr+=" ,null \n";
                tstr+=" ,-1 \n";

                //20220623 ASH REF_SSN ADD
                tstr+=" ,'"+opt.ssn+"' \n";

                tstr+=" ,STR_TO_DATE('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s') \n";
                if(opt.myLoginId.length<1)
                {
                    opt.myLoginId="NOT_DEF6";
                };
                tstr+=" ,'"+opt.myLoginId+"' \n";
                tstr+=" ,'sAddAccountB2B' \n";
                tstr+=" ,STR_TO_DATE('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s') \n";
                tstr+=" ,'"+opt.myLoginId+"' \n";
                tstr+=" ,'sAddAccountB2B' \n";
                tstr+=" ,null \n";
                tstr+=" ,null \n";
                tstr+=" ,null \n";
                tstr+=") \n";
            };

            try{
                rtn=await mydao.sqlHandlerForCompanyUPD(pLocalBizCompCode, "RW", tdev, tstr, [])
                .then((rows)=>
                {
                    if(rows.affectedRows>0)
                    {
                        return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":"OK"};
                    }
                    else
                    {
                        return {"errorcode":appmsg[38].messageCode, "errormessage":appmsg[38].messageText, "returnvalue":""};
                    };
                });
                return rtn;

            }
            catch(e)
            {
                return {"errorcode":appmsg[60].messageCode, "errormessage":appmsg[60].messageText, "returnvalue":"Exception Code #2133"};
            };
        };

        async function insert_supplier_and_buyer_master(pLocalBizCompCode, opt)
        {
            //점주인가 아닌가에 따라 buyer master 또는 supplier master에 등록한다.
            let tstr="";
            if(opt.checkGbn=="B2B_BUYER")
            {
                //buyer master
                tstr = "INSERT INTO devplatform.tb_p00_buyer_master \n";
                tstr=tstr+"( \n";
                tstr=tstr+"LOCAL_BIZ_COMP_CODE \n";
                tstr=tstr+",AGENCY_CODE \n";
                tstr=tstr+",BUYER_SSN \n";
                tstr=tstr+",BUYER_NAME \n";
                tstr=tstr+",OFFICIAL_REGION_CODE \n";
                tstr=tstr+",BUYER_CEO \n";
                tstr=tstr+",HEAD_OFFICE_ZIP_CODE \n";
                tstr=tstr+",HEAD_OFFICE_REPR_EMAIL \n";
                tstr=tstr+",HEAD_OFFICE_ADDRESS \n";
                tstr=tstr+",HEAD_OFFICE_ADDRESS_DETAIL \n";
                tstr=tstr+",HEAD_OFFICE_CHARGER \n";
                tstr=tstr+",HEAD_OFFICE_CHARGER_MOBILE \n";
                tstr=tstr+",HEAD_OFFICE_CHARGER_PHONE \n";
                tstr=tstr+",HEAD_OFFICE_CHARGER_EMAIL \n";
                tstr=tstr+",NADLE_BIZ_CODE \n";
                tstr=tstr+",NADLE_BIZ_TYPE \n";
                tstr=tstr+",NADLE_BIZ_TYPE_DETAIL \n";
                tstr=tstr+",NADLE_REG_STATUS \n";
                tstr=tstr+",NADLE_APPROVE_ID \n";
                tstr=tstr+",NADLE_REG_TYPE \n";
                tstr=tstr+",NADLE_REG_DATE \n";
                tstr=tstr+",NADLE_ACCOUNT_IDX \n";
                tstr=tstr+",NADLE_REFUND_BANK_CODE \n";
                tstr=tstr+",NADLE_REFUND_BANK_ACCOUNT \n";
                tstr=tstr+",NADLE_REFUND_BANK_NAME \n";
                tstr=tstr+",NADLE_REFUND_HOLDER \n";
                tstr=tstr+",NADLE_NSARIA_TYPE \n";
                tstr=tstr+",CREATION_DATETIME \n";
                tstr=tstr+",CREATION_WORKER \n";
                tstr=tstr+",CREATION_APP_ID \n";
                tstr=tstr+",UPDATE_DATETIME \n";
                tstr=tstr+",UPDATE_WORKER \n";
                tstr=tstr+",UPDATE_APP_ID \n";
                tstr=tstr+",PURGE_PLAN_DATE \n";
                tstr=tstr+",PURGE_WORKER \n";
                tstr=tstr+",PURGE_APP_ID \n";
                tstr=tstr+") \n";
                tstr=tstr+"VALUES \n";
                tstr=tstr+"( \n";
                tstr=tstr+"  '"+pLocalBizCompCode+"' \n";
                tstr=tstr+" ,'"+agencyCode+"' \n";
                tstr=tstr+" ,'"+opt.ssn+"' \n";
                tstr=tstr+" ,'"+opt.bizName+"' \n";   //상호
                tstr=tstr+" ,'Not Def4' \n";
                tstr=tstr+" ,'"+opt.ceo+"' \n";       //CEO
                tstr=tstr+" ,'"+opt.bizZipCode+"' \n";
                tstr=tstr+" ,AES_ENCRYPT('"+(opt.bizEmail1+"@"+opt.bizEmail2)+"' ,SHA2(CONCAT('"+tmpServerTime+"',  '"+sKey.save_id_aes_db+"'), 512))  \n";
                tstr=tstr+" ,'"+opt.bizAddr1+"' \n";    //대표주소
                tstr=tstr+" ,'"+opt.bizAddr2+"'  \n"; //주소상세
                tstr=tstr+" ,'"+opt.ceo+"' \n";   //담당자
                tstr=tstr+" ,'"+(opt.bizMobile1+"-"+opt.bizMobile2+"-"+opt.bizMobile3)+"' \n";
                tstr=tstr+" ,'"+(opt.bizTel1+"-"+opt.bizTel2+"-"+opt.bizTel3)+"' \n";
                tstr=tstr+" ,AES_ENCRYPT('"+(opt.bizEmail1+"@"+opt.bizEmail2)+"' ,SHA2(CONCAT('"+tmpServerTime+"', '"+sKey.save_id_aes_db+"'), 512))  \n";
                tstr=tstr+" ,null \n";  //NADLE_BIZ_CODE는 null

                //업태 NADLE_BIZ_TYPE
                if(opt.bizType!=undefined&&opt.bizType.length>0)
                {
                    tstr=tstr+" ,'"+opt.bizType+"' \n";
                }
                else
                {
                    tstr=tstr+" ,null \n";
                };
                
                //NADLE_BIZ_TYPE_DETAIL는 종목으로 간주한다.
                if(opt.bizCategory!=undefined&&opt.bizCategory.length>0)
                {
                    tstr=tstr+" ,'"+opt.bizCategory+"' \n";
                }
                else
                {
                    tstr=tstr+" ,null \n";
                };

                tstr=tstr+" ,'0' \n";                   //NADLE_REG_STATUS : 0 미승인 상태로 등록

                if(opt.myLoginId.length<1)
                {
                    opt.myLoginId="NOT_DEF8";
                };

                tstr=tstr+" ,'"+opt.myLoginId+"' \n";   //NADLE_APPROVE_ID

                //NADLE_REG_TYPE W: Web, P:POS, M:Mobile
                tstr=tstr+" ,'W' \n";   //화면에서는 WEB으로 설정
                tstr=tstr+" ,STR_TO_DATE('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s') \n";

                tstr=tstr+" ,-1 \n";    //계좌 연결 안함
                tstr=tstr+" ,null \n";
                tstr=tstr+" ,null \n";
                tstr=tstr+" ,null \n";
                tstr=tstr+" ,null \n";  //환불 담당자는 일단 null
                tstr=tstr+" ,'1' \n";   //NADLE_NSARIA_TYPE : 일단 1
                tstr=tstr+" ,STR_TO_DATE('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s') \n";
                
                tstr=tstr+" ,'"+opt.myLoginId+"' \n";
                tstr=tstr+" ,'sAddAccountB2B' \n";
                tstr=tstr+" ,STR_TO_DATE('"+tmpServerTime+"','%Y-%m-%d %H:%i:%s') \n";
                tstr=tstr+" ,'"+opt.myLoginId+"' \n";
                tstr=tstr+" ,'sAddAccountB2B' \n";
                tstr=tstr+" ,null \n";
                tstr=tstr+" ,null \n";
                tstr=tstr+" ,null \n";
                tstr=tstr+") \n";

                try{
                    rtn=await mydao.sqlHandlerForCompanyUPD(pLocalBizCompCode, "RW", tdev, tstr, [])
                    .then((rows)=>
                    {
                        if(rows.affectedRows>0)
                        {
                            return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":"OK"};
                        }
                        else
                        {
                            return {"errorcode":appmsg[38].messageCode, "errormessage":appmsg[38].messageText, "returnvalue":"isrt error code 400"};
                        };
                    });
                    return rtn;
    
                }
                catch(e)
                {
                    return {"errorcode":appmsg[60].messageCode, "errormessage":appmsg[60].messageText, "returnvalue":"Exception Code #2133"};
                };
            }
            else
            {
                //supplier master
            };
        };

        async function check_id_duplication(pLocalBizCompCode, pUser, pCheckGbn, opt, rtnOption, cookieRole)
        {
            let rtn;
            //공급사 운영자 또는 점주(BUYER)인 경우에 대한 회원 중복 가입 여부 검사
            let tstr=" SELECT COUNT(1) AS CNT\n";
            tstr=tstr+"  FROM sjgo.tb_s00_account_of_member a \n";
            tstr=tstr+" WHERE a.LOCAL_BIZ_COMP_CODE = ? \n";
            if(pCheckGbn=="B2B_BUYER")
            {
                //점주(Buyer)인 경우
                tstr=tstr+"   AND a.ACCOUNT_MEMBERSHIP = 'BUY' \n";
            }
            else
            {
                //점주(Buyer)가 아닌 경우
                tstr=tstr+"   AND a.ACCOUNT_MEMBERSHIP <> 'BUY' \n";
            };
            
            tstr=tstr+"   AND CONVERT(AES_DECRYPT(ACCOUNT_EMAIL_ID,SHA2(CONCAT(DATE_FORMAT(CREATION_DATETIME,'%Y-%m-%d %H:%i:%s'),'"+sKey.save_id_aes_db+"'),512)) USING UTF8) = ? ";

            let rest;
            try{
                rtn=await mydao.sqlHandlerForCompanyUPD(pLocalBizCompCode, "RW", tdev, tstr, [pLocalBizCompCode, pUser])
                .then((rows)=>
                {
                    if(rows[0].CNT>0)
                    {
                        //중복이 있음
                        rest={"errorcode":appmsg[66].messageCode, "errormessage":appmsg[66].messageText, "returnvalue":""};
                        if(rtnOption=="can ui response"){response.json(rest);}else{return rest;};
                    }
                    else
                    {
                        rest={"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":"OK"};
                        if(rtnOption=="can ui response"){response.json(rest);}else{return rest;};
                    };
                });

                if(rtn!=undefined&&rtn!=null)
                {
                    return rtn;
                };
            }
            catch(e)
            {
                rest={"errorcode":appmsg[60].messageCode, "errormessage":appmsg[60].messageText, "returnvalue":"Exception Code #2131"};
                if(rtnOption=="can ui response"){response.json(rest);}else{return rest;};
            };
        };
        
    }
};

module.exports=sAddAccountB2B;