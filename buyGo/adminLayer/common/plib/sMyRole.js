/****************************************************************************************************
module명: sMyRole.js
creator: 안상현
date: 2022.9.1
version 1.0
설명: 로그인 화면에서 전달된 roll code를 기반으로 DB 서버측에서 판단가능한 Role Code를 반환하는 모듈
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

var sMyRole={
    getMyRoleCode: function(pMyRole)
    {
        if(pMyRole=="imauser")
        {
            return "BUY";
        }
        else if(pMyRole=="imaseller")
        {
            return "SUPER";
        }
        else if(pMyRole=="imapos")
        {
            return "BUY";
        }
        else if(pMyRole=="iamadmin")
        {
            return "ADMIN";
        }
        else
        {
            return "ERROR";
        };
    }
};

module.exports=sMyRole;