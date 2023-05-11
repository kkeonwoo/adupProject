/****************************************************************************************************
module명: sAuthCancelPerPhone.js
creator: 안상현
date: 2022.9.14
version 1.0
설명: 기 발번된 인증코드+휴대폰 번호별 무효처리하는 모듈
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

let sAuthCancelPerPhone={
    authCancelPerPhone: async function(request, response)
    {
        if(request.body!=undefined&&request.body!=null)
        {
            const phone=request.body.phone;
            let mydb=require("./sDbcommonconfigRW");
            const myLocalBizCompCode=mydb.localBizCompCode;

            let tdevCommon ={
                host     : mydb.host,
                user     : mydb.user,
                password : mydb.password,
                database : mydb.database,
                port     : mydb.port,
                connectionLimit: mydb.connectionLimit,   
                multipleStatements: mydb.multipleStatements
            };

            let tmpStr   =" UPDATE "+mydb.database+".tb_p00_auth_phone a \n";
            tmpStr=tmpStr+"    SET a.VALID_YN   = 'N' \n";
            tmpStr=tmpStr+"  WHERE a.AUTH_PHONE = '"+phone+"' \n";
            tmpStr=tmpStr+"    AND a.VALID_YN   = 'Y' ";
            let mydao=require("./sDbCommonDaoForCompanyAreaUPD");
            await mydao.sqlHandlerForCompanyUPD(myLocalBizCompCode, "RW", tdevCommon, tmpStr,[]);
            response.json({"errorcode": appmsg[3].messageCode, "errormessage": appmsg[3].messageText, "returnpage":""});
        }
        else
        {
            response.json({"errorcode": appmsg[88].messageCode, "errormessage": appmsg[88].messageText, "returnpage":""});
        };
    }
};

module.exports=sAuthCancelPerPhone;