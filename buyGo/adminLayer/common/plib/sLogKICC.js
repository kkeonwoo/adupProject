/****************************************************************************************************
module명: sLogKICC.js
creator: 안상현
date: 2022.10.26
version 1.0
설명: 당사와 KICC가 계좌오픈, 입금요청, 입금완료 등 kicc와 주고 받은 내용을 기록함
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************
----------------------------------------------수정이력----------------------------------------------
2022.10.26    안상현    최초작성
****************************************************************************************************/
"use strict";
let jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM();
const {document} = (new JSDOM("")).window;
const $=require("jquery")(window);

var sLogKICC={
    insertLog: async function(pIfType, pOrderNo, requestJSON, responeJSON)
    {
        let appmsg=require("./sapplicatioErrorMessage.json");
        let mydb = require("./sDbcommonconfigRW");
        let mydao=require("./sDbCommonDaoForCompanyAreaUPD");

        let tdev ={
            host     : mydb.host,
            user     : mydb.user,
            password : mydb.password,
            database : mydb.database,
            port     : mydb.port,
            connectionLimit: mydb.connectionLimit,   
            multipleStatements: mydb.multipleStatements
        };

        let tmpStr="INSERT INTO "+mydb.database+".tb_p00_kicc_log ( \n";
        tmpStr=tmpStr+"  LOG_DATE \n";
        tmpStr=tmpStr+" ,IF_TYPE \n";
        tmpStr=tmpStr+" ,ORDER_NO \n";
        tmpStr=tmpStr+" ,REQUEST_JSON \n";
        tmpStr=tmpStr+" ,RESPONSE_JSON \n";
        tmpStr=tmpStr+") VALUES ( \n";
        tmpStr=tmpStr+"  SYSDATE() \n";

        if(pIfType!=undefined&&pIfType!=null&&pIfType.length>0)
        {
            tmpStr=tmpStr+" , '"+pIfType+"' \n";
        }
        else
        {
            tmpStr=tmpStr+" ,null \n";
        };

        if(pOrderNo!=undefined&&pOrderNo!=null&&pOrderNo.length>0)
        {
            tmpStr=tmpStr+" , '"+pOrderNo+"' \n";
        }
        else
        {
            tmpStr=tmpStr+" ,null \n";
        };

        if(requestJSON!=undefined&&requestJSON!=null)
        {
            tmpStr=tmpStr+" ,'"+JSON.stringify(requestJSON)+"' \n";
        }
        else
        {
            tmpStr=tmpStr+" ,null \n";
        };

        if(responeJSON!=undefined&&responeJSON!=null)
        {
            tmpStr=tmpStr+" ,'"+JSON.stringify(responeJSON)+"' \n";
        }
        else
        {
            tmpStr=tmpStr+" ,null \n";
        };

        tmpStr=tmpStr+")";

        try
        {
            let getRoleInfo=await mydao.sqlHandlerForCompanyUPD(mydb.localBizCompCode, "RW", tdev, tmpStr,[]).then((rows)=>{
                if(rows!=undefined)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            });
        }
        catch(e)
        {
            return false;
        };
    }
};
module.exports=sLogKICC;