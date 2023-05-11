/****************************************************************************************************
module명: sDbPoolCreatorForCommonArea.js
creator: 안상현
date: 2021.11.29
version 1.0
설명: 본 모듈은 최초 접속하는 User에 대하여 공통 스키마 (sjcommon) db Connection Pool을 생성하는 모듈
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
const mysql = require("mysql");
module.exports = (async function () {
    let sdbPoolCreatorForCommonArea_dbPool;
    //먼저 common 영역의 parameter를 사용한다.
    let sdbPoolCreatorForCommonArea_settingObj=require("./sDbcommonconfig.js");
    const initiate = async () => {
        return mysql.createPool(sdbPoolCreatorForCommonArea_settingObj)
    };
    
    return await{
        getPool: async function () {
            if (!sdbPoolCreatorForCommonArea_dbPool) {
                sdbPoolCreatorForCommonArea_dbPool = await initiate();
                return await sdbPoolCreatorForCommonArea_dbPool
            }
            else
            {
                return await sdbPoolCreatorForCommonArea_dbPool;
            };
        }
    }
})();