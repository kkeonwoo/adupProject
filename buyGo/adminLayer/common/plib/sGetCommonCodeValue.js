/****************************************************************************************************
module명: sGetCommonCodeValue.js
creator: 안상현
date: 2022.9.1
version 1.0
설명: 공통코드 테이블중 알고자하는 code에 대한 기준 값을 읽어온다.
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
var sGetCommonCodeValue={
    getCommonCodeValue: async function(pLocalBizCompCode, codeName, getType)
    {
        if(codeName!=undefined&&codeName!=null&&codeName!="")
        {
            let mydao=require("./sDbCommonDaoForCompanyAreaUPD");
            let tdev=require("./sDbconfigRO");
            let tmpStr="";
            if(getType=="NUMBER")
            {
                tmpStr =          "SELECT CAST(A.CODE_VALUE AS INTEGER) AS CODEVALUE \n";
                tmpStr = tmpStr + "  FROM SJGO.TB_S00_COMMON_CODE_MASTER A \n";
                tmpStr = tmpStr + " WHERE A.LOCAL_BIZ_COMP_CODE = '"+pLocalBizCompCode+"' \n";
                tmpStr = tmpStr + "   AND A.CODE_ID = '"+codeName+"' \n";
                tmpStr = tmpStr + "   AND A.CODE_ACTIVE_YN = 'Y' ";
            }
            else
            {
                tmpStr =          "SELECT A.CODE_VALUE AS AS CODEVALUE \n";
                tmpStr = tmpStr + "  FROM SJGO.TB_S00_COMMON_CODE_MASTER A \n";
                tmpStr = tmpStr + " WHERE A.LOCAL_BIZ_COMP_CODE = '"+pLocalBizCompCode+"' \n";
                tmpStr = tmpStr + "   AND A.CODE_ID = '"+codeName+"' \n";
                tmpStr = tmpStr + "   AND A.CODE_ACTIVE_YN = 'Y' ";
            };

            try
            {
                let rtn = await mydao.sqlHandlerForCompanyUPD(pLocalBizCompCode,"RO",tdev,tmpStr,[])
                .then((rows)=>{
                        if(rows!=undefined&&rows.length>0)
                        {
                            return rows[0].CODEVALUE;
                        }
                        else 
                        {
                            return "NULL";
                        };
                    });
                
                return rtn;
            }
            catch(e)
            {
                return "ERROR";
            };
        }
        else
        {
            return "ERROR";
        };
    }
};

module.exports=sGetCommonCodeValue;