/****************************************************************************************************
module명: sKICCResNoti.js
creator: 안상현
date: 2022.6.24
version 1.0
설명: KICC Response Notification Receiving Service Module
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
const jsdom=require("jsdom");
const {JSDOM}=jsdom;
const {window}=new JSDOM();
const {document}=(new JSDOM("")).window;
const $=require("jquery")(window);

var sKICCResNoti={
    getNotificationKICC: async function(request, response)
    {
        //파라미터 체크 메소드
        function getNullToSpace(param) {
            return (param == null) ? "" : param.trim();
        };

        const DELI_US           = 0x1f;
        const RESULT_SUCCESS    = "0000";
        const RESULT_FAIL 	    = "5001";

        //노티수신 일반
        //let result_msg = ""; -- 여기서는 미사용
        //let bDBProc = "true"; -- 여기서는 미사용

        let dbParamsObj={};
        dbParamsObj.r_res_cd            = getNullToSpace(request.body.res_cd         );  // 응답코드           
        dbParamsObj.r_res_msg           = getNullToSpace(request.body.res_msg        );  // 응답메시지         
        dbParamsObj.r_cno               = getNullToSpace(request.body.cno            );  // PG거래번호         
        dbParamsObj.r_memb_id           = getNullToSpace(request.body.memb_id        );  // 가맹점 ID          
        dbParamsObj.r_amount            = getNullToSpace(request.body.amount         );  // 총 결제금액        
        dbParamsObj.r_order_no          = getNullToSpace(request.body.order_no       );  // 주문번호           
        dbParamsObj.r_noti_type         = getNullToSpace(request.body.noti_type      );  // 노티구분           
        dbParamsObj.r_auth_no           = getNullToSpace(request.body.auth_no        );  // 승인번호           
        dbParamsObj.r_tran_date         = getNullToSpace(request.body.tran_date      );  // 승인/변경 일시     
        dbParamsObj.r_card_no           = getNullToSpace(request.body.card_no        );  // 카드번호           
        dbParamsObj.r_issuer_cd         = getNullToSpace(request.body.issuer_cd      );  // 발급사코드         
        dbParamsObj.r_issuer_nm         = getNullToSpace(request.body.issuer_nm      );  // 발급사명           
        dbParamsObj.r_acquirer_cd       = getNullToSpace(request.body.acquirer_cd    );  // 매입사코드         
        dbParamsObj.r_acquirer_nm       = getNullToSpace(request.body.acquirer_nm    );  // 매입사명           
        dbParamsObj.r_install_period    = getNullToSpace(request.body.install_period );  // 할부개월           
        dbParamsObj.r_noint             = getNullToSpace(request.body.noint          );  // 무이자여부         
        dbParamsObj.r_bank_cd           = getNullToSpace(request.body.bank_cd        );  // 은행코드           
        dbParamsObj.r_bank_nm           = getNullToSpace(request.body.bank_nm        );  // 은행명             
        dbParamsObj.r_account_no        = getNullToSpace(request.body.account_no     );  // 계좌번호           
        dbParamsObj.r_deposit_nm        = getNullToSpace(request.body.deposit_nm     );  // 입금자명           
        dbParamsObj.r_escrow_yn         = getNullToSpace(request.body.escrow_yn      );  // 에스크로 사용유무  
        dbParamsObj.r_pay_type          = getNullToSpace(request.body.pay_type       );  // 결제수단           
        dbParamsObj.r_cash_issue_yn     = getNullToSpace(request.body.cash_issue_yn  );  // 현금영수증 발급유무
        dbParamsObj.r_cash_res_cd       = getNullToSpace(request.body.cash_res_cd    );  // 현금영수증 결과코드
        dbParamsObj.r_cash_tran_date    = getNullToSpace(request.body.cash_tran_date );  // 현금영수증 발행일시
        dbParamsObj.r_cash_auth_no      = getNullToSpace(request.body.cash_auth_no   );  // 현금영수증 승인번호
        dbParamsObj.r_stat_cd           = getNullToSpace(request.body.stat_cd        );  // 에스크로 상태코드  
        dbParamsObj.r_stat_msg          = getNullToSpace(request.body.stat_msg       );  // 에스크로 상태메시지
        dbParamsObj.r_tlf_sno           = getNullToSpace(request.body.tlf_sno        );  // 채번 거래번호      
        dbParamsObj.r_account_type      = getNullToSpace(request.body.account_type   );  // 채번계좌 타입      
        dbParamsObj.r_user_id           = getNullToSpace(request.body.user_id        );  // 고객ID(거래처코드) 
        dbParamsObj.r_user_nm           = getNullToSpace(request.body.user_nm        );  // 고객명(영업자코드) 
        dbParamsObj.r_reserve3          = getNullToSpace(request.body.reserve3       );  // 가맹점 DATA        
        dbParamsObj.r_canc_date         = getNullToSpace(request.body.canc_date      );  // 취소일시           
        dbParamsObj.r_reserve1          = getNullToSpace(request.body.reserve1       );  // 가맹점 DATA        
        dbParamsObj.r_reserve2          = getNullToSpace(request.body.reserve2       );  // 가맹점 DATA        
        dbParamsObj.r_reserve4          = getNullToSpace(request.body.reserve4       );  // 가맹점 DATA        
        dbParamsObj.r_reserve5          = getNullToSpace(request.body.reserve5       );  // 가맹점 DATA        
        dbParamsObj.r_reserve6          = getNullToSpace(request.body.reserve6       );  // 가맹점 DATA        
        dbParamsObj.r_noti_subtype      = getNullToSpace(request.body.noti_subtype   );  // 결제상세수단       
        dbParamsObj.r_depo_bkcd         = getNullToSpace(request.body.depo_bkcd      );  // 입금은행코드       
        dbParamsObj.r_depo_bknm         = getNullToSpace(request.body.depo_bknm      );  // 입금은행명    

        //(1) 전달 받은 메세지를 로깅한다.
        let insertOrderLog = require("./sLogKICC");
        if(dbParamsObj.r_order_no!=undefined&&dbParamsObj.r_order_no.length>0)
        {
            // !!!!! 희상님 sDepositDB.js 는 업무 프로그램이므로 제가 고칠 수 있는 부분까지는 고쳤으나,
            // 지금은 테스트를 해야 해서 전체를 주석처리 했으므로 참고하세요~ (업무 테이블이 어떻게 바뀔지 모르므로....)
            //주문을 입금완료 상태로 변경한다.
            // let dp=require("./sDepositDB")
            // let rtn=dp.depositDB(dbParamsObj);

            // if(rtn.errorcode=="PFERR_CONF_0000")
            // {
            //     await insertOrderLog.insertLog("입금완료NOTI", dbParamsObj.r_order_no, request.body, {"result": "ERROR_"+rtn.errormessage}); //여기에서 response 처리 결과를 넣는다.
            //     response.end("ERROR_"+rtn.errormessage);
            // }
            // else
            // {
            //     await insertOrderLog.insertLog("입금완료NOTI", dbParamsObj.r_order_no, request.body, {"result":"SUCCESS: 당사 처리 OK"}); //여기에서 response 처리 결과를 넣는다.
            //     response.end("SUCCESS: 당사 처리 OK");
            // };

            response.end("SUCCESS: 당사 처리 (테스트로 강제 Pass한 것이므로 윗쪽 주석 블록을 참고하세요~ OK");
        }
        else
        {
            await insertOrderLog.insertLog("입금완료NOTI", dbParamsObj.r_order_no, request.body, {"result":"ERROR: 주문번호 없음"}); //여기에서 response 처리 결과를 넣는다.
            response.end("ERROR_주문번호 없음");
        };
    }
};

module.exports=sKICCResNoti;