/****************************************************************************************************
module명: sCheckCookieParams.js
creator: 안상현
date: 2022.9.6
version 1.0
설명: 쿠키체크 방법변경 (undefined가 아닌 실제 refreshToken과 accessToken인자가 있는 경우로 변경한다.)
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
let jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM();
const {document} = (new JSDOM("")).window;
//let $ = jQuery = require("jquery")(window);

var sCheckCookieParams={
    chkTokenExist: function(param)
    {
        if(param==undefined||param==null||param=="")
        {
            //존재 자체가 없는 경우
            return false;
        }
        else 
        {
            if(param.indexOf("refreshToken=")>-1&&param.indexOf("accessToken=")>-1)
            {
                //실제로 acess 및 refresh token이 있는 경우
                return true;
            }
            this.else
            {
                //not null 또는 not defined이지만 실제로 Token 은 없다.
                return false;
            }
        };
    }
};

module.exports=sCheckCookieParams;