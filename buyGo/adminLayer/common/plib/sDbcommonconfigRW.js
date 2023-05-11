/****************************************************************************************************
module명: sDbcommonconfig.js
creator: 안상현
date: 2021.11.29
version 1.0
설명: 본 모듈은 공통영역 접근 DB Configuration
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
module.exports = {
    host     : "127.0.0.1",
    user     : "sjrwcomm",
    password : "sjrwcomm1&",
    database : "sjcommon",
    port     : "3306",
    connectionLimit: 100,
    multipleStatements: true,
    localBizCompCode: "sj001"
}