/****************************************************************************************************
module명: cSearch.js
creator: 안상현
date: 2021.12.28
version 1.0
설명: 사용자가 존재하는지를 Check하는 모듈 
      Client 모듈이므로 각각의 입점한 회사의 폴더에 배치를 시켜야 하며, 함부로 Web으로 보내서는 안되고
      app.get에서 반드시 유효성 검사를 해야 한다. 왜냐하면 내부 상품 검색 정보를 읽어서 내려보내주므로
      소속 직원이나 회원이 아닌 다른 유저나 외부 익명의 접근자가 해당 관련성이 없는 정보를 보게 해서는
      안되기 때문이다.
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
server side 개발자 유의사항
1. 모듈(export)시 전역 변수 사용 금지 (http 서비스 유지되는 동안 값 유지됨), 상수는 가능
2. DB에 저장하는 data중 id를 제외한 개인식별 정보는 복호화 가능한 AES Ecrypion을 할 것 (법적 의무사항)
3. password SHA-256 기반 복호화 불가능한 암호를 사용해야 함 (운영자도 볼 수 없음, 법적 의무사항)
4. 가급적 var 선언을 하지말고 let 선언을 사용해야 함 (Type 혼선 방지)
5. 모든 서버-서버, 서버-클라이언트는 JSON 객체 통신을 원칙으로 함
6. Applicaiton Message JSON을 사용할 것, App Message무단 작성 금지 (표준)
7. 지역 변수 선언시 Server Component명을 prefix로 사용할 것. 다소 길더라도 운영성(Debug용이) 측면 고려임
8. 한글자 변수 사용 금지 (i, j, k등) debug곤란
9. 모든 서버 모듈 Naming은 s*로 시작할 것
10.서버 모듈도 배포시 반드시 JS Compress후 난독화하여 배포해야 한다.

client (front) 개발자 유의 사항
1. 반드시 client package는 압축(JS Compress) 및 난독화 해서 올릴 것 (소스 유출 방지)
2. 보안검사 (SQL Injection, JS Injection)를 받을 것
3. Client 소스에서는 eval() 함수 사용 금지!!!
4. 모든 Client 도듈 Naming은 c*로 시작할 것

기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
//let jsdom = require("jsdom");
//const {JSDOM} = jsdom;
//const {window} = new JSDOM();
//const {document} = (new JSDOM("")).window;

//window.dd = console.log;
 
// 문자열 초성으로 변환
function cho(str)
{
    var res = "", // 초성으로 변환
        choArr = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
    let code;
    for (var ix in str) {
        code = Math.floor((str[ix].charCodeAt() - 44032) / 588);
        res += code >= 0 ? choArr[code] : str[ix];
    };

    return res;
};

/*
var compars = ["가나다라", "나다", "가나", "가", "다다두다", "두두두다다다", "다라", "ㄷㄷ"], // 검색 데이터
    searchArr = "ㄷㄷ두다", // 검색어
    res = []; // 검색 결과
*/

var compars = ["가나다abcd라", "나다", "가나", "가", "다다두다", "두두두다다다", "다라", "abcㄷㄷ"], // 검색 데이터
searchArr = "다abc", // 검색어
res = []; // 검색 결과
 
var searchArr = searchArr.split("|");

searchArr.forEach((search, t) => {
    var searchCho = cho(search);
    let chk;
    /*
        1. 검색어와 비교문자열 모두 초성으로 변환시킨다.
        2. 비교할 문자열에서 검색한 문자열이 포함될 수 있는 위치의 인덱스를 모두 구해온다.
        3. 구한 인덱스들을 반복 시키면서 비교문자열에서 해당 인덱스 위치 부터 검색어의 길이만큼 가져온다 -> 초성으로 바꾼 검색어와 같은 문자열이 나옴
        4. 검색어가 초성이 아닌 글자의 인덱스를 찾고
        5. 초성으로 변환한 비교 문자열의 위에서 나온 인덱스의 문자를 원본 비교문자로 치환
        6. 5번 결과의 문자열과 원본 검색어를 비교해 일치 시 반환
    */
    compars.forEach((compare, i) => {
        var compCho = cho(compare), // 비교문자의 초성
            strIdxs = [], // 비교문자열에서 검색어와 일치하는 부분의 시작 위치
            compare = compare.split(""); // 비교문자
 
        for (var c in compCho) { // 검색어, 비교문자를 초성으로 변환후 일치하는 부분 모두 찾기
            /*
                쉽게말해 
                비교할 문자 : ㄱㄱㄱㄱㄱㄱㄱ
                검색어 : ㄱㄱㄱㄱ일때 
                검색어가 비교할 문자열에 몇번째 문자열에 포함될 수 있는지 모두 구해옴
                0,1,2,3 번째 문자열에 들어갈 수 있음
            */
            var idx = compCho.indexOf(searchCho, c); // 일치하는 부분의 인덱스
 
            if (idx != -1 && strIdxs.indexOf(idx) == -1){strIdxs.push(idx);};
        };

        chk = 0;
        
        strIdxs.forEach((idx, d) => {
            
            var str = searchCho.split("");
 
            for (var e in search) {
                if (search[e].charCodeAt() - 44032 >= 0) // 검색어중에 초성이 아닌부분
                    str[e] = compare[idx + e * 1]; // 초성변환 전의 문자로 치환
            };
 
            if (str.join("") == search) { // 비교문자
                chk = 1;
                for(var q = idx; q < idx + search.length; q++)
                    compare[q] = `<span style="background: yellow">${compare[q]}</span>` // 비교문자 하이라이트
            };
        });
 
        if (chk){res.push(compare.join(""));};
    })
});

res.forEach((el, ix) => {
    document.getElementById("result").innerHTML += "<li>"+el+"</li>";
    //$("ul").innerHTML += "<li>"+el+"</li>";
    //console.log("el="+el);
})
