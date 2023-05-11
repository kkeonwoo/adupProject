/****************************************************************************************************
module명: sDbPoolCreatorForCompanyArea.js
creator: 안상현
date: 2021.11.29
version 1.0
설명: 본 모듈은 소속법인별 DB접속에 대하여 db Connection Pool을 생성하는 모듈
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
const mysql = require("mysql");
//const poolMap=new Map();
module.exports = (async function () {
    let dbPool;
    const poolMap=new Map();
    //각 소속법인의 주어진 환경을 사용한다.
    const initiate = async (local_biz_comp_code, ro_rw_gbn, settingObj) => {
        let c_pool=await mysql.createPool(settingObj);

        //소속사 pool을 찾아야 하므로 장부(map)에 이름과 함께 기록한다.
        poolMap.set(local_biz_comp_code+"_"+ro_rw_gbn+"_"+settingObj.user, c_pool);

        return c_pool;
    };
    
    return {
        getPool: async function (local_biz_comp_code, ro_rw_gbn, settingObj) {
            //소속법인의 pool이 없다면 만든다. (RO, RW계정을 구분해야 한다. 그래서 RO, RW구분자까지 붙이고 user까지 붙여서 map에 관리한다.)
            if (!poolMap.has(local_biz_comp_code+"_"+ro_rw_gbn+"_"+settingObj.user))
            {
                //해당 소속사가 없으면 만들고
                dbPool = await initiate(local_biz_comp_code, ro_rw_gbn, settingObj);
                return dbPool;
            }
            else
            {
                //있으면 해당소속법인의 pool객체를 준다.
                let tmpPool=poolMap.get(local_biz_comp_code+"_"+ro_rw_gbn+"_"+settingObj.user);
                return tmpPool;
            };
        }
    }
})();