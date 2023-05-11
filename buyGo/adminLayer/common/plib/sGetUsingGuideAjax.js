/****************************************************************************************************
module명: sGetUsingGuideAjax.js
creator: 안상현
date: 2022.09.6
version 1.0
설명: 본 모듈은 이용약관 및 안내 본문을 DB에서 읽어서 클라이언트에 내려보내는 모듈이다.
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
const appmsg=require("./sapplicatioErrorMessage.json");
const { param } = require("jquery");
const querystring=require("querystring");
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
var sGetUsingGuideAjax={
    procUserGuide: async function(request,response)
    {
        //subject = 페이지의 제목 1: 이용안내 2: 주문방법 3: 이용약관
        let subject=request.body.subject;
        //detail = 부제목
        let detail=request.body.detail;
        
        if(subject==null||subject==undefined)
        {
            //return error
            response.json({"errorcode": appmsg[85].messageCode, "errormessage": appmsg[85].messageText, "returnvalue" : ""});
        }
        else{
            //구분자(이용안내, 주문방법, 이용약관)에 따라 sql을 각각 부른다 
            let rtn=require("./sGetUserGuideDB");
            let dbRtn=await rtn.getDBUserGuideInfo(request, response, subject);
            //json 보내는 방식
            response.json(dbRtn);
        }
    }
};
//mvc중 controller 부분을 담당
module.exports=sGetUsingGuideAjax;