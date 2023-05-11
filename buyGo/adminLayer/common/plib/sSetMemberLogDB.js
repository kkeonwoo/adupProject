/****************************************************************************************************
module명: sSetMemberLogDB.js
creator: 안상현
date: 2022.9.2
version 1.0
설명: 본 모듈은 member log (접속기록, 최근 방문 일시 등을 기록관리하는 공통 모듈임)
      devplatform.tb_p99_member_log 에 Data를 Insert Only로 처리한다.
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
const {param}=require("jquery");
const querystring=require("querystring");
var jsdom=require("jsdom");
const {JSDOM}=jsdom;
const {window}=new JSDOM();
const appmsg=require("./sapplicatioErrorMessage.json");
var sSetMemberLogDB={
    insertMemberLogDB: async function(localBizCompCode, userId, request, callerModule)
    {
        let mydao=require("./sDbCommonDaoForCompanyAreaUPD");

        let myLoginId="";
        if(userId.indexOf("@")>-1){myLoginId=userId.split("@")[0];}else{myLoginId=userId;};

        let tdev = require("./sDbconfigRW");

        //GET USER AGENT - BROWSER INFO
        let myAgent=request.headers["user-agent"];

        //GET IP ADDRESS
        let clientIP=request.socket.remoteAddress;

        //USER TYPE M: Mobile, W:Web, P:POS
        let userType="";
        if(request.body.myrole==undefined||request.body.myrole==null)
        {
            userType="W";
        }
        else
        {
            if(request.body.myrole=="imapos")
            {
                userType="P";
            }
            else
            {
                userType="W";
            };
        };

        //mobile 여부는 agent정보를 기반으로 추출한다.
        let clientDevice="";
        let MPW="";
        if(isMobile())
        {
            clientDevice="Mobile";
            userType="M";   //모바일이면 다시 M으로 바꾼다.
            MPW="M";
        }
        else
        {
            clientDevice="Non_Mobile";
            MPW="N";
        };

        //POS인지 web인지?
        if(MPW!="M")
        {
            if(request.body.myrole==undefined||request.body.myrole==null)
            {
                MPW="W";    //WEB
            }
            else
            {
                if(request.body.myrole=="imapos")
                {
                    MPW="P";    //POS
                }
                else
                {
                    MPW="W";    //WEB
                };
            };
        };

        function isMobile(){return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(myAgent);};

        function isNumber(s)
        {
            s += ''; // 문자열로 변환
            s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
            if (s == '' || isNaN(s)) return false;
            return true;
        };

        //이제 member log에 기록한다.
        let tmpStr =  "INSERT INTO "+tdev.database+".tb_s90_member_log( \n";
        tmpStr=tmpStr+"  LOG_DATE \n";
        tmpStr=tmpStr+" ,USER_TYPE \n";
        tmpStr=tmpStr+" ,USER_ID \n";
        tmpStr=tmpStr+" ,LOG_IP \n";
        tmpStr=tmpStr+" ,LOGIN_TYPE \n";
        tmpStr=tmpStr+" ,USER_AGENT \n";
        tmpStr=tmpStr+" ,CALLER_SAJAGO_MODULE_NAME \n";
        tmpStr=tmpStr+" ,PARTITION_KEY_YYYYMM \n";
        tmpStr=tmpStr+" ) VALUES ( \n";
        tmpStr=tmpStr+" DATE_FORMAT(SYSDATE(),'%Y-%m-%d %H:%i:%s') \n";
        tmpStr=tmpStr+",'"+userType+"' \n";
        tmpStr=tmpStr+",'"+myLoginId+"' \n";
        tmpStr=tmpStr+",'"+clientIP+"' \n";
        tmpStr=tmpStr+",'"+MPW+"' \n";
        tmpStr=tmpStr+",'"+myAgent+"' \n";
        tmpStr=tmpStr+",'"+callerModule+"' \n";
        tmpStr=tmpStr+",((YEAR(SYSDATE())*100)+(MONTH(SYSDATE()))) \n";
        tmpStr=tmpStr+") ";

        let rtn=await mydao.sqlHandlerForCompanyUPD(localBizCompCode, "RW", tdev, tmpStr).then((rows)=>{
                            if(rows.affectedRows>0)
                            {
                                return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":""};
                            }
                            else
                            {
                                return {"errorcode":appmsg[60].messageCode, "errormessage":appmsg[60].messageText, "returnvalue":"DB ISRT ERROR"};
                            };
                        });
        return rtn;
    }
}
module.exports=sSetMemberLogDB;