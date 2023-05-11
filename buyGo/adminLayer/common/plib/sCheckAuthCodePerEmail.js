/****************************************************************************************************
module명: sCheckAuthCodePerEmail.js
creator: 안상현
date: 2022.9.15
version 1.0
설명: 이메일별 인증코드 확인
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
const appmsg=require("./sapplicatioErrorMessage.json");
let jsdom = require("jsdom");
const {JSDOM}=jsdom;
const {window}=new JSDOM();
const {document}=(new JSDOM("")).window;
const $=require("jquery")(window);

let sCheckAuthCodePerEmail={
    checkAuthCodePerEmail: async function(request, response)
    {
        if(request.body!=undefined&&request.body!=null)
        {
            const email=request.body.email;
            const inputcode=request.body.inputcode;

            let tmpStr="";
            let mydb = require("./sDbcommonconfigRW");
            const myLocalBizCompCode = mydb.localBizCompCode;

            let tdevCommon ={
                host     : mydb.host,
                user     : mydb.user,
                password : mydb.password,
                database : mydb.database,
                port     : mydb.port,
                connectionLimit: mydb.connectionLimit,   
                multipleStatements: mydb.multipleStatements
            };

            //전송된 auth code를 기록한다.
            //먼저 4개월 초과분은 삭제하고 3분 경과한 인증 Data는 무효처리한다. 그리고 기록하기전 4개월 초과분은 삭제부터 한다.
            tmpStr       =" UPDATE "+mydb.database+".TB_P00_EMAIL_AUTH_LOG a \n";
            tmpStr=tmpStr+"    SET a.VALID_YN = 'N' \n";
            tmpStr=tmpStr+"  WHERE a.CREATION_DATETIME < DATE_ADD(SYSDATE(), INTERVAL - 20 MINUTE) AND a.LOCAL_BIZ_COMP_CODE = '"+myLocalBizCompCode+"'; COMMIT; ";
            tmpStr=tmpStr+" DELETE FROM "+mydb.database+".TB_P00_EMAIL_AUTH_LOG WHERE LOCAL_BIZ_COMP_CODE = '"+myLocalBizCompCode+"' AND CREATION_DATETIME < DATE_ADD(SYSDATE(), INTERVAL - 120 DAY); COMMIT;";

            let mydao=require("./sDbCommonDaoForCompanyAreaUPD");
            await mydao.sqlHandlerForCompanyUPD(myLocalBizCompCode, "RW", tdevCommon, tmpStr,[]);

            //그 다음에 20분 이내에 남은 인증번호를 취득한다.
            tmpStr       ="SELECT a.EMAIL_AUTH_CODE \n";
            tmpStr=tmpStr+"  FROM "+mydb.database+".TB_P00_EMAIL_AUTH_LOG a \n";
            tmpStr=tmpStr+" WHERE a.LOCAL_BIZ_COMP_CODE = '"+myLocalBizCompCode+"' \n";
            tmpStr=tmpStr+"   AND a.REQUEST_EMAIL_ID = '"+email+"' \n";
            tmpStr=tmpStr+"   AND a.VALID_YN = 'Y' \n";
            tmpStr=tmpStr+"   AND a.CREATION_DATETIME >= DATE_ADD(SYSDATE(), INTERVAL - 20 MINUTE) \n";
            tmpStr=tmpStr+" ORDER BY a.UPDATE_DATETIME DESC LIMIT 1 ";

            try{
                let rtn =await mydao.sqlHandlerForCompanyUPD(myLocalBizCompCode, "RW", tdevCommon, tmpStr, [])
                        .then((rows)=>{
                            if(rows.length==1)
                            {
                                //해당 인증 코드가 맞으면 무효 처리 후 정상 처리, 맞지 않으면 인증 코드 안 맞다고 Error로 반환
                                if(rows[0].EMAIL_AUTH_CODE==inputcode)
                                {
                                    return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":rows};
                                }
                                else
                                {
                                    //인증코드 불일치
                                    return {"errorcode":appmsg[89].messageCode, "errormessage":appmsg[89].messageText, "returnvalue":rows};
                                };
                            }
                            else
                            {
                                //인증코드가 시간경과 등으로 유효기간이 지났으니 재 인증해달라고 에러로 처리
                                return {"errorcode":appmsg[90].messageCode, "errormessage":appmsg[90].messageText, "returnvalue":""};
                            };
                        });
                        
                if(rtn.errorcode=="PFERR_CONF_0000")
                {
                    //인증 끝났으므로 기존 코드 무효처리
                    await setAuthCodeExpireEmail(email, inputcode);
                };

                //해당 결과를 전송
                response.json( rtn);
            }
            catch(e)
            {
                response.json({"errorcode":appmsg[81].messageCode, "errormessage":appmsg[81].messageText, "returnvalue":""});
            };

        }
        else
        {
            response.json({"errorcode": appmsg[88].messageCode, "errormessage": appmsg[88].messageText, "returnpage":""});
        };

        async function setAuthCodeExpireEmail(email, inputcode)
        {
            let tmpStr="";
            let mydb = require("./sDbcommonconfigRW");
            const myLocalBizCompCode = mydb.localBizCompCode;

            let tdevCommon ={
                host     : mydb.host,
                user     : mydb.user,
                password : mydb.password,
                database : mydb.database,
                port     : mydb.port,
                connectionLimit: mydb.connectionLimit,   
                multipleStatements: mydb.multipleStatements
            };

            tmpStr       =" UPDATE "+mydb.database+".TB_P00_EMAIL_AUTH_LOG a \n";
            tmpStr=tmpStr+"    SET a.VALID_YN = 'N' \n";
            tmpStr=tmpStr+"  WHERE a.REQUEST_EMAIL_ID ='"+email+"' \n";
            tmpStr=tmpStr+"    AND a.EMAIL_AUTH_CODE  ='"+inputcode+"' ";
            let mydao=require("./sDbCommonDaoForCompanyAreaUPD");
            await mydao.sqlHandlerForCompanyUPD(myLocalBizCompCode, "RW", tdevCommon, tmpStr,[]);
        };
    }
};

module.exports=sCheckAuthCodePerEmail;