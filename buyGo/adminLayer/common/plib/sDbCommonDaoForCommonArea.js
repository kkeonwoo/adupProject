/****************************************************************************************************
module명: sDbCommonDaoForCommonArea.js
creator: 안상현
date: 2021.11.29
version 1.0
설명: 본 모듈은 공통으로 최초 접속하는 user에 대하여 공통스키마(sjcommon)를 Control하는 DAO임
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
const mysql = require("mysql");

class Dao {
    sqlHandler = (sql, q, fn) => {
        if (q) sql = mysql.format(sql, q);
        // console.log(sql)
        return new Promise(async (resolve, reject) => {
            try {
                const db = await require("./sDbPoolCreatorForCommonArea");
            	// pool을 가져오는 과정
                const dbPool = await db.getPool();
                
                // pool에서 연결객체를 가져오는 과정
                await dbPool.getConnection((err, conn) => {
                    if (err) {
                        if (conn) conn.release();
                        return reject(err);
                    }
                    // 내부 콜백에서 쿼리를 수행
                    conn.query(sql, (err, rows, fields) => {
                        conn.release();
                        if (err) return reject(err) || fn(err);
                        resolve(rows) || fn(rows);
                    })
                })
            } catch (err) {
                return await reject(err) || fn(err);
            };
        });
    };
    //그리고 위에서 굉장히 중요한 부분이 있는데, 그것은 바로 this.sqlHandler를 호출하는 findByEmail메서드이다. 
    //현재 필자가 만든 Dao클래스에는 sqlHandler가 있고, 이 메서드가 쿼리 수행을 담당한다. 그리고  findByEmail 같은 메서드는 쿼리문과 인자만 결정하는 역할이고, 기본적으로는 sqlHandler를 사용하게 된다.
    //Dao를 클래스로 만들어서 관리하고 있는데 class내부는 use strict가 디폴트로 적용되기 때문에, 아래처럼 function으로 메서드를 만들게 되면 스코프 관리에서 문제가 발생한다. findByEmail메서드 내부에 있는 this는 이제 Dao가 아니게 되는 것이다.
    //그래서 this.sqlHandler를 사용하고 싶은 경우에는 반드시! 앞서 올린 코드에서처럼 findByEmail = 화살표 함수로 정의해야만 한다.
    findByEmail = async email => {
        return await this.sqlHandler(sqls.sql_findByEmail, email)
    };
}
 
module.exports = new Dao();