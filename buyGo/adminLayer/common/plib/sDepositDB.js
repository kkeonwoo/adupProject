/****************************************************************************************************
module명: sDepositDB.js
creator: 안상현
date: 2022.10.26
version 1.0
설명: KICC NOTI를 수신받아 입금완료 처리를 함
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

var sDepositDB={
    depositDB : async function(dbParams, pmyLoginPage, pmyLocalBizCompCode, paccessTokenUserId, pEditDataSetJson)
    {
        //주문에 대한 입금 완료 처리
        const sKey=require("./sKey");
        let mydb = require("./sDbconfigRW");
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

        // 희상님~ 여기서부터는 주문에 대한 정보 갱신이므로 사자고 플랫폼 상품 테이블 구조에 따라 맞게 수정하셔야 합니다.
        // biz_comp, database, sKey값, AES_DECRY 부분은 제가 현재 버전으로 바꾸어 놨으니, 확인 해 봐 주세요~
        let tmpStr = "";
        tmpStr += "UPDATE "+mydb.database+".tb_p30_order_data o \n";
        tmpStr += "   SET o.PAYMENT_STATUS = '1' \n";
        tmpStr += "     , o.ORDER_STATUS = '1' \n";
        tmpStr += "     , o.PAYMENT_DATE = SYSDATE() \n";
        tmpStr += "     , o.KICC_DEAL_NO_STR = '"+dbParams.r_tlf_sno+"' \n";
        tmpStr += "     , o.KICC_DEAL_ORDER_NO_STR = '"+dbParams.r_order_no+"' \n";
        tmpStr += "     , o.UPDATE_DATETIME = SYSDATE() \n";
        tmpStr += "     , o.UPDATE_WORKER = '' \n";
        tmpStr += "     , o.UPDATE_APP_ID = 'sDepositDB.js' \n";
        tmpStr += "WHERE o.ORDER_NO = '"+dbParams.r_order_no+"' \n";
        tmpStr += "  AND o.LOCAL_BIZ_COMP_CODE = '"+mydb.localBizCompCode+"' ";
        
        try{
            let rtn=await mydao.sqlHandlerForCompanyUPD(mydb.localBizCompCode, "RW", tdev, tmpStr, [])
                .then((rows)=>{
                    if(rows!=undefined&&rows!=null)
                    {
                        return {"errorcode": appmsg[3].messageCode, "errormessage": appmsg[3].messageText, "returnvalue":""};
                    }
                    else
                    {
                        return {"errorcode": appmsg[52].messageCode, "errormessage": appmsg[52].messageText, "returnvalue":""};
                    };
                });
            
            // 희상님 사자고 가동일자를 예상해서 임의로 설정한 것이니까 나중에 적절하게 바꾸시면 됩니다.
            // 그리고 첫 구매 정책에 따라서 테이블이 어떻게 될지 몰라서 그대로 두었으니, 여기는 나중에 수정하셔야 합니다.
            let limitDate = "2023-01-01";
            let getSSN="";
            if(rtn.errorcode=="PFERR_CONF_0000")
            {
                //(0) 첫구매 운영 기준이 유효한가?
                let checkFlag="false";
                tmpStr = "SELECT t.POINT_STATUS FROM "+mydb.database+".tb_p99_member_point_type t WHERE t.POINT_IDX = 2";

                checkFlag=await mydao.sqlHandlerForCompanyUPD(mydb.localBizCompCode, "RW", tdev, tmpStr, [])
                .then((rows)=>{
                    if(rows!=undefined&&rows!=null&&rows.length>0)
                    {
                        if(rows[0].POINT_STATUS=="1")
                        {
                            //1 이면 사용중
                            return "true";
                        }
                        else
                        {
                            //1이 아니면 false
                            return "false";
                        };
                    }
                    else
                    {
                        //기준이 없으면 false
                        return "false";
                    };
                });

                if(checkFlag=="false")
                {
                    return rtn;
                }
                else
                {
                    //(1) 첫구매 주문인가를 판단
                    //7월29일 이후 가입한 점주분들 중 첫 구매 주문만을 대상으로 판단한다.
                    //우선 해당 점주의 사업자 번호가 존재해야 한다. (7월29일 이후 가입한 회원에 대하여)
                    tmpStr  = " SELECT o.orderer_biz_ssn as ORDERER_BIZ_SSN \n";
                    tmpStr += "   FROM "+mydb.database+".tb_p30_order_data o  \n";
                    tmpStr += "      , "+mydb.database+".tb_p00_buyer_master b \n";
                    tmpStr += "  WHERE 1=1 \n";
                    tmpStr += "    AND o.order_no='"+dbParams.r_order_no+"' \n";
                    tmpStr += "    AND o.ORDERER_BIZ_SSN = b.BUYER_SSN \n";
                    tmpStr += "    AND b.NADLE_REG_DATE >= STR_TO_DATE('"+limitDate+"','%Y-%m-%d') ";

                    getSSN=await mydao.sqlHandlerForCompanyUPD(mydb.localBizCompCode, "RW", tdev, tmpStr, [])
                    .then((rows)=>{
                        if(rows!=undefined&&rows!=null&&rows.length>0)
                        {
                            return rows[0].ORDERER_BIZ_SSN;
                        }
                        else
                        {
                            return "";
                        };
                    });

                    if(getSSN.length>0)
                    {

                        //(2) 전달된 order 번호 이외의 입금완료 된 주문이력이 없어야 한다.
                        let orderCount=-1;
                        tmpStr = "SELECT COUNT(1) AS CNT FROM "+mydb.database+".tb_p30_order_data o WHERE o.ORDERER_BIZ_SSN = '"+getSSN+"' AND o.ORDER_NO <> '"+dbParams.r_order_no+"' AND o.PAYMENT_STATUS = '1' ";

                        orderCount=await mydao.sqlHandlerForCompanyUPD(mydb.localBizCompCode, "RW", tdev, tmpStr, [])
                        .then((rows)=>{
                            if(rows!=undefined&&rows!=null&&rows.length>0)
                            {
                                return rows[0].CNT;
                            }
                            else
                            {
                                return -1;
                            };
                        });

                        if(orderCount<1)
                        {
                            let divCount="";
                            //해당 점주번호(ssn)이 있다면 null은 아닌 정상 주문이므로 해당 주문으로 첫 구매 주문인지를 판단한다.
                            tmpStr  = " SELECT CASE(ifnull((SELECT o.orderer_biz_ssn \n";
                            tmpStr += "                       FROM "+mydb.database+".tb_p30_order_data o  \n";
                            tmpStr += "                          , "+mydb.database+".tb_p00_buyer_master b \n";
                            tmpStr += "                      WHERE 1=1 \n";
                            tmpStr += "                        AND o.order_no='"+dbParams.r_order_no+"' \n";
                            tmpStr += "                        AND o.ORDERER_BIZ_SSN = b.BUYER_SSN \n";
                            tmpStr += "                        AND b.NADLE_REG_DATE >= STR_TO_DATE('"+limitDate+"','%Y-%m-%d')),'xxx')) \n";
                            tmpStr += "        WHEN 'xxx' then 'Not Exist' \n";
                            tmpStr += "        ELSE ( \n";
                            tmpStr += "                SELECT CAST(COUNT(1) AS CHAR) \n";
                            tmpStr += "                  FROM "+mydb.database+".tb_p99_nadle_member_buyer_point_chadae p \n";
                            tmpStr += "                 WHERE p.PLATFORM_ROW_SEQ_ACCOUNT_OF_MEMBER = ( \n";
                            tmpStr += "                                            SELECT m.ROW_SEQUENCE  \n";
                            tmpStr += "                                              FROM "+mydb.database+".tb_p30_order_data o  \n";
                            tmpStr += "                                                 , "+mydb.database+".tb_p00_buyer_master b \n";
                            tmpStr += "                                                 , "+mydb.database+".tb_p00_account_of_member m \n";
                            tmpStr += "                                             WHERE 1=1 \n";
                            tmpStr += "                                               AND o.order_no='"+dbParams.r_order_no+"' \n";
                            tmpStr += "                                               AND o.ORDERER_BIZ_SSN = b.BUYER_SSN \n";
                            tmpStr += "                                               AND o.ORDERER_BIZ_SSN = CONVERT(AES_DECRYPT(UNHEX(m.ACCOUNT_EMAIL_ID),SHA2(CONCAT(DATE_FORMAT(m.CREATION_DATETIME,'%Y-%m-%d %H:%i:%s'),"+sKey.salt_sjgo+"),512)) USING UTF8) \n";
                            tmpStr += "                                               AND b.NADLE_REG_DATE >= STR_TO_DATE('"+limitDate+"','%Y-%m-%d') \n";
                            tmpStr += "                                         ) \n";
                            tmpStr += "             ) \n";
                            tmpStr += "       END AS DIV_POINT \n";
                            tmpStr += "  FROM DUAL ";

                            divCount=await mydao.sqlHandlerForCompanyUPD(mydb.localBizCompCode, "RW", tdev, tmpStr, [])
                            .then((rows)=>{
                                if(rows!=undefined&&rows!=null&&rows.length>0)
                                {
                                    return rows[0].DIV_POINT;
                                }
                                else
                                {
                                    return "Not Exist"; //이 자체는 완전 무효 (나올 수 없는 case)
                                };
                            });
        
                            if(divCount=="0"||divCount==0)
                            {
                                //이때만 조건을 충족하므로 여기에서 포인트를 부여하고 양쪽 처리 결과를 판단해서 반환해 주어야 한다.
                                tmpStr  = " INSERT INTO "+mydb.database+".tb_p99_nadle_member_buyer_point_cha_mln ( \n";
                                tmpStr += "   CHA_IDX \n";
                                tmpStr += " , PLATFORM_ROW_SEQ_ACCOUNT_OF_MEMBER \n";
                                tmpStr += " , NADLE_POINT_TYPE_IDX \n";
                                tmpStr += " , NADLE_CHA_POINT \n";
                                tmpStr += " , NADLE_CHADAE_BALANCE \n";
                                tmpStr += " , NADLE_EXPIRATION_DATE \n";
                                tmpStr += " , NADLE_REG_DATE \n";
                                tmpStr += " , NADLE_USER_TYPE \n";
                                tmpStr += " , NADLE_USER_ID \n";
                                tmpStr += " , NADLE_LOGIN_TYPE \n";
                                tmpStr += " , TEMP_INSPECT_ACCOUNT_EMAIL_ID \n";
                                tmpStr += " , CREATION_DATETIME \n";
                                tmpStr += " , CREATION_WORKER \n";
                                tmpStr += " , CREATION_APP_ID \n";
                                tmpStr += " , UPDATE_DATETIME \n";
                                tmpStr += " , UPDATE_WORKER \n";
                                tmpStr += " , UPDATE_APP_ID  \n";
                                tmpStr += " ) \n";
                                tmpStr += " VALUE \n";
                                tmpStr += " ( \n";
                                tmpStr += "   (SELECT MAX(C.CHA_IDX)+1 FROM "+mydb.database+".tb_p99_nadle_member_buyer_point_cha_mln C) \n";
                                tmpStr += " , (SELECT M.ROW_SEQUENCE  \n";
                                tmpStr += "      FROM "+mydb.database+".tb_p00_account_of_member M  \n";
                                tmpStr += "     WHERE M.LOCAL_BIZ_COMP_CODE = '"+mydb.localBizCompCode+"'  \n";
                                tmpStr += "       AND M.ACCOUNT_MEMBERSHIP = 'BUY' \n";
                                tmpStr += "       AND M.ACCOUNT_TYPE = 'B2B' \n";
                                tmpStr += "       AND M.ACCOUNT_ROLE = 'NORMAL' \n";
                                tmpStr += "       AND M.LICENSE_STATUS = '2' \n";
                                tmpStr += "       AND M.ACCOUNT_STATUS = '1' \n";
                                tmpStr += "       AND M.ACCOUNT_EMAIL_ID = HEX(AES_ENCRYPT('"+getSSN+"',SHA2(CONCAT(M.CREATION_DATETIME, '"+sKey.salt_sjgo+"'), 512)))) \n";
                                tmpStr += " , 2 -- 첫구매적립 \n";
                                tmpStr += " , (SELECT CAST(t.formula_point AS INTEGER) FROM "+mydb.database+".tb_p99_member_point_type t WHERE t.POINT_IDX = 2) -- cha point \n";
                                tmpStr += " , (SELECT CAST(t.formula_point AS INTEGER) FROM "+mydb.database+".tb_p99_member_point_type t WHERE t.POINT_IDX = 2) -- cha dae balance 첫구매이므로 chapoint = chadae balance \n";
                                tmpStr += " , (SELECT str_to_date( \n";
                                tmpStr += "              date_format(DATE_ADD(SYSDATE(), INTERVAL (SELECT t.expiration_year FROM "+mydb.database+".tb_p99_member_point_type t WHERE t.POINT_IDX = 2) YEAR),'%Y-%m-%d') \n";
                                tmpStr += "          ,'%Y-%m-%d')) -- 유효기간을 더한 날짜 \n";
                                tmpStr += " , SYSDATE() \n";
                                tmpStr += " , 'BUY' \n";
                                tmpStr += " , '"+getSSN+"' \n";
                                tmpStr += " , 'W' \n";
                                tmpStr += " , '"+getSSN+"' \n";
                                tmpStr += " , SYSDATE(), 'NOTIFICATION', 'sDepositDB_addPoint' \n";
                                tmpStr += " , SYSDATE(), 'NOTIFICATION', 'sDepositDB_addPoint' \n";
                                tmpStr += " );";

                                tmpStr += " INSERT INTO "+mydb.database+".tb_p99_nadle_member_buyer_point_chadae \n";
                                tmpStr += " ( \n";
                                tmpStr += "   CHADAE_IDX \n";
                                tmpStr += " , PLATFORM_ROW_SEQ_ACCOUNT_OF_MEMBER \n";
                                tmpStr += " , NADLE_POINT_TYPE_IDX \n";
                                tmpStr += " , NADLE_POINT_CHADAE_TYPE \n";
                                tmpStr += " , NADLE_CHADAE_POINT \n";
                                tmpStr += " , BUYER_BALANCE \n";
                                tmpStr += " , NADLE_USER_TYPE \n";
                                tmpStr += " , NADLE_USER_ID \n";
                                tmpStr += " , NADLE_REG_DATE \n";
                                tmpStr += " , NADLE_LOGIN_TYPE \n";
                                tmpStr += " , POINT_MEMO \n";
                                tmpStr += " , RECOM_BUYER_SSN \n";
                                tmpStr += " , ORDER_NO \n";
                                tmpStr += " , SALES_YEAR_MONTH \n";
                                tmpStr += " , REFERENCE_CODE \n";
                                tmpStr += " , CREATION_DATETIME \n";
                                tmpStr += " , CREATION_WORKER \n";
                                tmpStr += " , CREATION_APP_ID \n";
                                tmpStr += " , UPDATE_DATETIME \n";
                                tmpStr += " , UPDATE_WORKER \n";
                                tmpStr += " , UPDATE_APP_ID  \n";
                                tmpStr += " ) \n";
                                tmpStr += " VALUE \n";
                                tmpStr += " ( \n";
                                tmpStr += "   (SELECT MAX(CD.CHADAE_IDX)+1 FROM "+mydb.database+".tb_p99_nadle_member_buyer_point_chadae CD) \n";
                                tmpStr += " , (SELECT M.ROW_SEQUENCE  \n";
                                tmpStr += "      FROM "+mydb.database+".tb_p00_account_of_member M  \n";
                                tmpStr += "     WHERE M.LOCAL_BIZ_COMP_CODE = '"+mydb.localBizCompCode+"'  \n";
                                tmpStr += "       AND M.ACCOUNT_MEMBERSHIP = 'BUY' \n";
                                tmpStr += "       AND M.ACCOUNT_TYPE = 'B2B' \n";
                                tmpStr += "       AND M.ACCOUNT_ROLE = 'NORMAL' \n";
                                tmpStr += "       AND M.LICENSE_STATUS = '2' \n";
                                tmpStr += "       AND M.ACCOUNT_STATUS = '1' \n";
                                tmpStr += "       AND M.ACCOUNT_EMAIL_ID = HEX(AES_ENCRYPT('"+getSSN+"',SHA2(CONCAT(M.CREATION_DATETIME, '"+sKey.salt_sjgo+"'), 512)))) \n";
                                tmpStr += " , 2 -- 첫구매적립 (point type idx) \n";
                                tmpStr += " , '1' \n";
                                tmpStr += " , (SELECT CAST(t.formula_point AS INTEGER) FROM "+mydb.database+".tb_p99_member_point_type t WHERE t.POINT_IDX = 2) -- chadae point \n";
                                tmpStr += " , (SELECT IFNULL(SUM(C.NADLE_CHADAE_BALANCE),0) \n";
                                tmpStr += "      FROM "+mydb.database+".tb_p99_nadle_member_buyer_point_cha_mln C \n";
                                tmpStr += "     WHERE 1=1 \n";
                                tmpStr += "       AND C.NADLE_EXPIRATION_DATE >= DATE_FORMAT(SYSDATE(), '%Y-%m-%d') \n";
                                tmpStr += "       AND C.PLATFORM_ROW_SEQ_ACCOUNT_OF_MEMBER = (SELECT M.ROW_SEQUENCE  \n";
                                tmpStr += "                                                     FROM "+mydb.database+".tb_p00_account_of_member M  \n";
                                tmpStr += "                                                    WHERE M.LOCAL_BIZ_COMP_CODE = '"+mydb.localBizCompCode+"'  \n";
                                tmpStr += "                                                      AND M.ACCOUNT_MEMBERSHIP = 'BUY' \n";
                                tmpStr += "                                                      AND M.ACCOUNT_TYPE = 'B2B' \n";
                                tmpStr += "                                                      AND M.ACCOUNT_ROLE = 'NORMAL' \n";
                                tmpStr += "                                                      AND M.LICENSE_STATUS = '2' \n";
                                tmpStr += "                                                      AND M.ACCOUNT_STATUS = '1' \n";
                                tmpStr += "                                                      AND M.ACCOUNT_EMAIL_ID = HEX(AES_ENCRYPT('"+getSSN+"',SHA2(CONCAT(M.CREATION_DATETIME, '"+sKey.salt_sjgo+"'), 512))))) \n";
                                tmpStr += " , 'BUY' \n";
                                tmpStr += " , '"+getSSN+"' \n";
                                tmpStr += " , SYSDATE() \n";
                                tmpStr += " , 'W' \n";
                                tmpStr += " , (SELECT t.point_name FROM "+mydb.database+".tb_p99_member_point_type t WHERE t.POINT_IDX = 2) \n";
                                tmpStr += " , NULL \n";
                                tmpStr += " , '"+dbParams.r_order_no.substring(6,dbParams.r_order_no.length)+"' \n";    //20220922 ash 실제로는 order idx로 바꾸어야 한다.
                                tmpStr += " , NULL \n";
                                tmpStr += " , NULL \n";
                                tmpStr += " , SYSDATE(), 'NOTIFICATION', 'sDepositDB_addPoint' \n";
                                tmpStr += " , SYSDATE(), 'NOTIFICATION', 'sDepositDB_addPoint' \n";
                                tmpStr += " ); ";

                                let returnIncludeSetPoint=await mydao.sqlHandlerForCompanyUPD(mydb.localBizCompCode, "RW", tdev, tmpStr, [])
                                .then((rows)=>{
                                    if(rows!=undefined&&rows!=null)
                                    {
                                        //입금완료, 첫구매포인트 정상등록
                                        return {"errorcode": appmsg[3].messageCode, "errormessage": appmsg[3].messageText, "returnvalue":""};
                                    }
                                    else
                                    {
                                        //입금완료(NOTI)는 처리하였으나, 첫구매포인트 등록은 실패했습니다.
                                        return {"errorcode": appmsg[80].messageCode, "errormessage": appmsg[80].messageText, "returnvalue":""};
                                    };
                                });

                                return returnIncludeSetPoint;

                            }
                            else
                            {
                                //조건을 만족하지 못하면 처리할 것이 없으므로 원래 판단결과로 반환해 주어야 한다.
                                return rtn;
                            };
                        }
                        else
                        {
                            //조건을 만족하지 못하면 처리할 것이 없으므로 원래 판단결과로 반환해 주어야 한다.
                            return rtn;
                        };
                    }
                    else
                    {
                        //조건을 만족하지 못하면 처리할 것이 없으므로 원래 판단결과로 반환해 주어야 한다.
                        return rtn;
                    };
                };
            }
            else
            {
                //error가 나면 나는대로 반환해 주어햐 한다.
                return rtn;
            };
            //2022-08-23 첫구매 포인트 적립 로직 추가 - ash - end
        }
        catch(e)
        {
            return {"errorcode": appmsg[60].messageCode, "errormessage": appmsg[60].messageText+" / "+e.message, "returnvalue":""};
        };
    }
};

module.exports=sDepositDB;