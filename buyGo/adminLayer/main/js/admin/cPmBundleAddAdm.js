/****************************************************************************************************
module명: cPmBundleAddAdm.js
creator: 안상현
date: 2022.6.7
version 1.0
설명: 상품일괄등록 Client Module
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
server side 개발자 유의사항
1. 모듈(export)시 전역 변수 사용 금지 (http 서비스 유지되는 동안 값 유지됨), 상수는 가능
2. DB에 저장하는 data중 id를 제외한 개인식별 정보는 복호화 가능한 AES Ecrypion을 할 것 (법적 의무사항)
3. password SHA-256 기반 복호화 불가능한 암호를 사용해야 함 (운영자도 볼 수 없음, 법적 의무사항)
4. 가급적 var 선언을 하지말고 var 선언을 사용해야 함 (Type 혼선 방지) 단 safari브라우저 지원등의 문제로
   Client로 내려가는 모듈은 var를 사용한다. (safari가 let을 인지하지 못함)
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

//const e = require("express");

//변경하기 버튼
function btnExcelUpSubmit() {
    var input = document.getElementById("excelFile");
    var reader = new FileReader();
    var rows;
    reader.onload = function () {
        var data = reader.result;
        var workBook = XLSX.read(data, { type: 'binary' });
        if(workBook.SheetNames.length > 1){
            alert("파일의 형태가 잘못되었습니다.");
            //return;
        };

        workBook.SheetNames.forEach(function(sheetName){
            // console.log('SheetName: ' + sheetName);
            rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
        });

        if ($("#excelFile").val()!=""&&$("#excelFile").val().indexOf(".xls")>0)
        {
            
            var tf=checkSalesItemHeadAndDetailInfo(rows);
            if(tf==false)
            {
                //return;
            }
            else
            {
                //JSON생성하고 ajax호출
                var rstRows=createSalesItemObject(rows);
                return;
            };
        }
        else
        {
            alert("업로드할 엑셀파일을 선택하고 열기를 누르세요");
        };
    };

    reader.readAsBinaryString(input.files[0]);
};

function checkSalesItemHeadAndDetailInfo(rows)
{
    //엑셀이 등록된 항목에 대한 컬럼별 정합성 Check
    var tmp1;
    var tmp2;
    var chk=false;
    var tmpNumber=-1;
    var unitPriceCheck1=false;
    var unitPriceCheck2=false;
    var unitPriceCheck3=false;
    var unitPriceCheck4=false;
    var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);

    //(1)빈 서식인가?
    if(rows.length<2)
    {
        alert("서식 안에 데이터가 없습니다.");
        return false;
    };

    //2행부터 Check
    for(var rx=1; rx<rows.length; rx++)
    {
        //매 행마다 체크해야 하는 변수는 초기화한다.
        chk=false;
        tmpNumber=-1;
        unitPriceCheck1=false;
        unitPriceCheck2=false;
        unitPriceCheck3=false;
        unitPriceCheck4=false;

        //(2)필수 항목에 대하여 빈 칸이 있는 가?
        if(rows[rx]["SALES_ITEM_NAME"]==undefined||rows[rx]["SALES_ITEM_NAME"]==null||rows[rx]["SALES_ITEM_NAME"].length<1)
        {
            alert(rx+"행 판매품 명칭은 빈칸이 될 수 없습니다!");
            return false;
        };

        if(rows[rx]["SALES_ITEM_CHANNEL_CATEGORY_ID"]==undefined||rows[rx]["SALES_ITEM_CHANNEL_CATEGORY_ID"]==null||rows[rx]["SALES_ITEM_CHANNEL_CATEGORY_ID"].length<1)
        {
            alert(rx+"행 판매품 노출 카테고리는 빈칸이 될 수 없습니다!");
            return false;
        };

        if(rows[rx]["SALES_ITEM_SORT"]==undefined||rows[rx]["SALES_ITEM_SORT"]==null||rows[rx]["SALES_ITEM_SORT"].length<1)
        {
            alert(rx+"행 정렬순서는 빈칸이 될 수 없습니다!");
            return false;
        };

        if(isNumber(rows[rx]["SALES_ITEM_SORT"])==false)
        {
            alert(rx+"행 정렬순서는 숫자여야 합니다! (공백도 있는지 확인 필요)");
            return false;
        };

        if(rows[rx]["SALES_ITEM_PROGRESS_CODE"]==undefined||rows[rx]["SALES_ITEM_PROGRESS_CODE"]==null||rows[rx]["SALES_ITEM_PROGRESS_CODE"].length<1)
        {
            alert(rx+"행 판매품진행상태코드(0:판매중지, 1:판매중, 2:품절)는 빈칸이 될 수 없습니다!");
            return false;
        };

        //0,1,2 중 하나이어야 함
        if(rows[rx]["SALES_ITEM_PROGRESS_CODE"]!="0"&&rows[rx]["SALES_ITEM_PROGRESS_CODE"]!="1"&&rows[rx]["SALES_ITEM_PROGRESS_CODE"]!="2")
        {
            alert(rx+"행 판매품진행상태코드는 0:판매중지, 1:판매중, 2:품절 중 하나이어야 합니다!");
            return false;
        };

        if((rows[rx]["SALES_ITEM_SALE_START_DATETIME"]==undefined||rows[rx]["SALES_ITEM_SALE_START_DATETIME"]==null||rows[rx]["SALES_ITEM_SALE_START_DATETIME"].length<1)||
           (rows[rx]["SALES_ITEM_SALE_END_DATETIME"]==undefined||rows[rx]["SALES_ITEM_SALE_END_DATETIME"]==null||rows[rx]["SALES_ITEM_SALE_END_DATETIME"].length<1))
        {
            alert(rx+"행 판매시작 및 종료일자는 빈칸이 될 수 없습니다.");
            return false;
        };

        //입력한 형식이 날짜 형식인가?
        tmp1=rows[rx]["SALES_ITEM_SALE_START_DATETIME"];
        chk=regex.test(tmp1);
        if(chk==false)
        {
            alert(rx+"행 판매시작 일자 날짜 형식은 yyyy-mm-dd 여야 합니다.");
            return false;
        };
        
        tmp2=rows[rx]["SALES_ITEM_SALE_END_DATETIME"];
        chk=regex.test(tmp2);
        if(chk==false)
        {
            alert(rx+"행 판매종료 일자 날짜 형식은 yyyy-mm-dd 여야 합니다.");
            return false;
        };

        //날짜 역전여부
        if(tmp1>tmp2)
        {
            alert(rx+"행 판매 시작일자가 종료일자보다 미래 일 수 없습니다!");
            return false;
        };

        if(rows[rx]["SALES_ITEM_REPR_STOCK_MGR_TYPE"]==undefined||rows[rx]["SALES_ITEM_REPR_STOCK_MGR_TYPE"]==null||rows[rx]["SALES_ITEM_REPR_STOCK_MGR_TYPE"].length<1)
        {
            alert(rx+"행 판매품대표재고관리유형(0:상온, 1:냉장, 2:냉동)은 빈칸이 될 수 없습니다!");
            return false;
        };

        if(rows[rx]["SALES_ITEM_REPR_STOCK_MGR_TYPE"]!="0"&&rows[rx]["SALES_ITEM_REPR_STOCK_MGR_TYPE"]!="1"&&rows[rx]["SALES_ITEM_REPR_STOCK_MGR_TYPE"]!="2")
        {
            alert(rx+"행 판매품대표재고관리유형은 0:상온, 1:냉장, 2:냉동중 하나여야 합니다!");
            return false;
        };

        if(rows[rx]["FREE_SHIPPING_YN"]==undefined||rows[rx]["FREE_SHIPPING_YN"]==null||rows[rx]["FREE_SHIPPING_YN"].length<1)
        {
            alert(rx+"행 무료배송여부는 빈칸이 될 수 없습니다!");
            return false;
        };

        if(rows[rx]["FREE_SHIPPING_YN"]!="Y"&&rows[rx]["FREE_SHIPPING_YN"]!="N")
        {
            alert(rx+"행 무료배송여부는 대문자 Y 또는 N중 하나여야 합니다!");
            return false;
        };

        if(rows[rx]["SALES_ITEM_DELIVERY_CODE"]==undefined||rows[rx]["SALES_ITEM_DELIVERY_CODE"]==null||rows[rx]["SALES_ITEM_DELIVERY_CODE"].length<1)
        {
            alert(rx+"행 판매품배송구분은 빈칸이 될 수 없습니다!");
            return false;
        };

        if(rows[rx]["SALES_ITEM_DELIVERY_CODE"]!="D"&&rows[rx]["SALES_ITEM_DELIVERY_CODE"]!="P")
        {
            alert(rx+"행 판매품배송구분은 대문자 (D:직배송, P:위탁배송)중 하나여야 합니다!");
            return false;
        };

        if(rows[rx]["SALES_ITEM_SALE_TYPE"]==undefined||rows[rx]["SALES_ITEM_SALE_TYPE"]==null||rows[rx]["SALES_ITEM_SALE_TYPE"].length<1)
        {
            alert(rx+"행 판매품판매유형코드는 빈칸이 될 수 없습니다!");
            return false;
        };

        if(rows[rx]["SALES_ITEM_SALE_TYPE"]!="WW"&&rows[rx]["SALES_ITEM_SALE_TYPE"]!="CC"&&rows[rx]["SALES_ITEM_SALE_TYPE"]!="XX"&&rows[rx]["SALES_ITEM_SALE_TYPE"]!="SS")
        {
            alert(rx+"행 판매품판매유형코드는 대문자 (WW:주간행상,CC:카테고리,XX:일반상품,SS:특가)중 하나여야 합니다!");
            return false;
        };

        if(rows[rx]["SALES_ITEM_REPR_TAX_YN"]==undefined||rows[rx]["SALES_ITEM_REPR_TAX_YN"]==null||rows[rx]["SALES_ITEM_REPR_TAX_YN"].length<1)
        {
            alert(rx+"행 판매품과세여부는 빈칸이 될 수 없습니다!");
            return false;
        };

        if(rows[rx]["SALES_ITEM_REPR_TAX_YN"]!="0"&&rows[rx]["SALES_ITEM_REPR_TAX_YN"]!="1")
        {
            alert(rx+"행 판매품과세여부는 0(과세) 또는 1(비과세)중 하나여야 합니다!");
            return false;
        };

        if(rows[rx]["SALES_ITEM_QTY_LIMIT_YN"]==undefined||rows[rx]["SALES_ITEM_QTY_LIMIT_YN"]==null||rows[rx]["SALES_ITEM_QTY_LIMIT_YN"].length<1)
        {
            alert(rx+"행 판매품수량제한여부는 빈칸이 될 수 없습니다!");
            return false;
        };

        if(rows[rx]["SALES_ITEM_QTY_LIMIT_YN"]!="Y"&&rows[rx]["SALES_ITEM_QTY_LIMIT_YN"]!="N")
        {
            alert(rx+"행 판매품수량제한여부는 대문자 Y 또는 N중 하나여야 합니다!");
            return false;
        };

        if(rows[rx]["SALES_ITEM_STOCK_QTY"]==undefined||rows[rx]["SALES_ITEM_STOCK_QTY"]==null||rows[rx]["SALES_ITEM_STOCK_QTY"].length<1)
        {
            alert(rx+"행 판매품재고수량은 빈칸이 될 수 없습니다!");
            return false;
        };

        //숫자형식이어야 하고 0보다 커야한다 (max 10만 정도로 잡는다.)
        if(isNumber(rows[rx]["SALES_ITEM_STOCK_QTY"])==false)
        {
            alert(rx+"행 판매품재고수량은 숫자여야 합니다! (공백도 있는지 확인 필요)");
            return false;
        };

        tmpNumber=rows[rx]["SALES_ITEM_STOCK_QTY"]*1;
        if(tmpNumber<1||tmpNumber>100000)
        {
            alert(rx+"행 판매품재고수량은 >0 이고 <=100000 이어야 합니다!");
            return false;
        };

        //정수형인지 Check
        if(Number.isInteger(tmpNumber)==false)
        {
            alert(rx+"행 판매품재고수량은 정수형으로 입력하세요(공백이 있는지도 검사 필요)");
            return false;
        };

        if(rows[rx]["SALES_ITEM_PURCHASE_MIN_QTY"]==undefined||rows[rx]["SALES_ITEM_PURCHASE_MIN_QTY"]==null||rows[rx]["SALES_ITEM_PURCHASE_MIN_QTY"].length<1)
        {
            alert(rx+"행 판매품주문최소수량은 빈칸이 될 수 없습니다!");
            return false;
        };

        //숫자형식이어야 하고 0보다 커야한다 (max 10만 정도로 잡는다.)
        if(isNumber(rows[rx]["SALES_ITEM_PURCHASE_MIN_QTY"])==false)
        {
            alert(rx+"행 판매품주문최소수량은 숫자여야 합니다! (공백도 있는지 확인 필요)");
            return false;
        };

        tmpNumber=rows[rx]["SALES_ITEM_PURCHASE_MIN_QTY"]*1;
        if(tmpNumber<0||tmpNumber>100000)
        {
            alert(rx+"행 판매품주문최소수량은 >=0 이고 <=100000 이어야 합니다!");
            return false;
        };

        //정수형인지 Check
        if(Number.isInteger(tmpNumber)==false)
        {
            alert(rx+"행 판매품주문최소수량은 정수형으로 입력하세요(공백이 있는지도 검사 필요)");
            return false;
        };

        if(rows[rx]["SALES_ITEM_PURCHASE_MAX_QTY"]==undefined||rows[rx]["SALES_ITEM_PURCHASE_MAX_QTY"]==null||rows[rx]["SALES_ITEM_PURCHASE_MAX_QTY"].length<1)
        {
            alert(rx+"행 판매품주문최대수량은 빈칸이 될 수 없습니다!");
            return false;
        };

        //숫자형식이어야 하고 0보다 커야한다 (max 10만 정도로 잡는다.)
        if(isNumber(rows[rx]["SALES_ITEM_PURCHASE_MAX_QTY"])==false)
        {
            alert(rx+"행 판매품주문최대수량은 숫자여야 합니다! (공백도 있는지 확인 필요)");
            return false;
        };

        tmpNumber=rows[rx]["SALES_ITEM_PURCHASE_MAX_QTY"]*1;
        if(tmpNumber<1||tmpNumber>100000)
        {
            alert(rx+"행 판매품주문최대수량은 >0 이고 <=100000 이어야 합니다!");
            return false;
        };

        //정수형인지 Check
        if(Number.isInteger(tmpNumber)==false)
        {
            alert(rx+"행 판매품주문최대수량은 정수형으로 입력하세요(공백이 있는지도 검사 필요)");
            return false;
        };

        if(rows[rx]["SALES_ITEM_PRICE"]==undefined||rows[rx]["SALES_ITEM_PRICE"]==null||rows[rx]["SALES_ITEM_PRICE"].length<1)
        {
            alert(rx+"행 판매품판매가격(VAT포함)은 빈칸이 될 수 없습니다!");
            return false;
        };

        //숫자형식이어야 하고 0보다 커야한다 (max 10만 정도로 잡는다.)
        if(isNumber(rows[rx]["SALES_ITEM_PRICE"])==false)
        {
            alert(rx+"행 판매품판매가격(VAT포함)은 숫자여야 합니다! (공백도 있는지 확인 필요)");
            return false;
        };

        tmpNumber=rows[rx]["SALES_ITEM_PRICE"]*1;
        if(tmpNumber<0)
        {
            alert(rx+"행 판매품판매가격(VAT포함)은 >=0 이어야 합니다!");
            return false;
        };

        //정수형인지 Check
        if(Number.isInteger(tmpNumber)==false)
        {
            alert(rx+"행 판매품판매가격(VAT포함)은 정수형으로 입력하세요(공백이 있는지도 검사 필요)");
            return false;
        };

        if(rows[rx]["NADLE_FATE_PRICE"]==undefined||rows[rx]["NADLE_FATE_PRICE"]==null||rows[rx]["NADLE_FATE_PRICE"].length<1)
        {
            alert(rx+"행 이음몰행사판매가격(VAT포함)은 빈칸이 될 수 없습니다!");
            return false;
        };

        //숫자형식이어야 하고 0보다 커야한다 (max 10만 정도로 잡는다.)
        if(isNumber(rows[rx]["NADLE_FATE_PRICE"])==false)
        {
            alert(rx+"행 이음몰행사판매가격(VAT포함)은 숫자여야 합니다! (공백도 있는지 확인 필요)");
            return false;
        };

        tmpNumber=rows[rx]["NADLE_FATE_PRICE"]*1;
        if(tmpNumber<0)
        {
            alert(rx+"행 이음몰행사판매가격(VAT포함)은 >=0 이어야 합니다!");
            return false;
        };

        //정수형인지 Check
        if(Number.isInteger(tmpNumber)==false)
        {
            alert(rx+"행 이음몰행사판매가격(VAT포함)은 정수형으로 입력하세요(공백이 있는지도 검사 필요)");
            return false;
        };

        if((rows[rx]["FATE_START_DATETIME"]==undefined||rows[rx]["FATE_START_DATETIME"]==null||rows[rx]["FATE_START_DATETIME"].length<1)||
           (rows[rx]["FATE_END_DATETIME"]==undefined||rows[rx]["FATE_END_DATETIME"]==null||rows[rx]["FATE_END_DATETIME"].length<1))
        {
            alert(rx+"행 행사판매시작일 및 종료일자는 빈칸이 될 수 없습니다.");
            return false;
        };

        //입력한 형식이 날짜 형식인가?
        tmp1=rows[rx]["FATE_START_DATETIME"];
        chk=regex.test(tmp1);
        if(chk==false)
        {
            alert(rx+"행 행사판매시작일 날짜 형식은 yyyy-mm-dd 여야 합니다.");
            return false;
        };
        
        tmp2=rows[rx]["FATE_END_DATETIME"];
        chk=regex.test(tmp2);
        if(chk==false)
        {
            alert(rx+"행 행사판매종료일 날짜 형식은 yyyy-mm-dd 여야 합니다.");
            return false;
        };

        //날짜 역전여부
        if(tmp1>tmp2)
        {
            alert(rx+"행 행사판매시작일자가 행사판매종료일자보다 미래 일 수 없습니다!");
            return false;
        };

        if(rows[rx]["FATE_PURCHASE_MIN_QTY"]==undefined||rows[rx]["FATE_PURCHASE_MIN_QTY"]==null||rows[rx]["FATE_PURCHASE_MIN_QTY"].length<1)
        {
            alert(rx+"행 행사최소주문수량은 빈칸이 될 수 없습니다!");
            return false;
        };

        //숫자형식이어야 하고 0보다 커야한다 (max 10만 정도로 잡는다.)
        if(isNumber(rows[rx]["FATE_PURCHASE_MIN_QTY"])==false)
        {
            alert(rx+"행 행사최소주문수량은 숫자여야 합니다! (공백도 있는지 확인 필요)");
            return false;
        };

        tmpNumber=rows[rx]["FATE_PURCHASE_MIN_QTY"]*1;
        if(tmpNumber<0||tmpNumber>100000)
        {
            alert(rx+"행 행사최소주문수량은 >=0 이고 <=100000 이어야 합니다!");
            return false;
        };

        //정수형인지 Check
        if(Number.isInteger(tmpNumber)==false)
        {
            alert(rx+"행 행사최소주문수량은 정수형으로 입력하세요(공백이 있는지도 검사 필요)");
            return false;
        };

        if(rows[rx]["FATE_PURCHASE_MAX_QTY"]==undefined||rows[rx]["FATE_PURCHASE_MAX_QTY"]==null||rows[rx]["FATE_PURCHASE_MAX_QTY"].length<1)
        {
            alert(rx+"행 행사최대주문수량은 빈칸이 될 수 없습니다!");
            return false;
        };

        //숫자형식이어야 하고 0보다 커야한다 (max 10만 정도로 잡는다.)
        if(isNumber(rows[rx]["FATE_PURCHASE_MAX_QTY"])==false)
        {
            alert(rx+"행 행사최대주문수량은 숫자여야 합니다! (공백도 있는지 확인 필요)");
            return false;
        };

        tmpNumber=rows[rx]["FATE_PURCHASE_MAX_QTY"]*1;
        if(tmpNumber<1||tmpNumber>100000)
        {
            alert(rx+"행 행사최대주문수량은 >0 이고 <=100000 이어야 합니다!");
            return false;
        };

        //정수형인지 Check
        if(Number.isInteger(tmpNumber)==false)
        {
            alert(rx+"행 행사최대주문수량은 정수형으로 입력하세요(공백이 있는지도 검사 필요)");
            return false;
        };

        if(rows[rx]["EXPIRATION_DATETIME_FROM"]!=undefined&&rows[rx]["EXPIRATION_DATETIME_FROM"]!=null&&rows[rx]["EXPIRATION_DATETIME_FROM"].length>0)
        {
            //입력한 형식이 날짜 형식인가?
            tmp1=rows[rx]["EXPIRATION_DATETIME_FROM"];
            chk=regex.test(tmp1);
            if(chk==false)
            {
                alert(rx+"행 판매품대표유통기한시작일시 날짜 형식은 yyyy-mm-dd 여야 합니다.");
                return false;
            };
        };

        
        if(rows[rx]["EXPIRATION_DATETIME_TO"]!=undefined&&rows[rx]["EXPIRATION_DATETIME_TO"]!=null&&rows[rx]["EXPIRATION_DATETIME_TO"].length>0)
        {
            tmp2=rows[rx]["EXPIRATION_DATETIME_TO"];
            chk=regex.test(tmp2);
            if(chk==false)
            {
                alert(rx+"행 판매품대표유통기한종료일시 날짜 형식은 yyyy-mm-dd 여야 합니다.");
                return false;
            };
        };

        if(rows[rx]["SALES_ITEM_APPROVE_CODE"]==undefined||rows[rx]["SALES_ITEM_APPROVE_CODE"]==null||rows[rx]["SALES_ITEM_APPROVE_CODE"].length<1)
        {
            alert(rx+"행 판매품승인구분코드는 빈칸이 될 수 없습니다!");
            return false;
        };

        if(rows[rx]["SALES_ITEM_APPROVE_CODE"]!="0"&&rows[rx]["SALES_ITEM_APPROVE_CODE"]!="1")
        {
            alert(rx+"행 판매품승인구분코드는 0:미승인, 1:승인 중 하나여야 합니다!");
            return false;
        };

        if(rows[rx]["SALES_TOTAL_PURCHASE_COST"]==undefined||rows[rx]["SALES_TOTAL_PURCHASE_COST"]==null||rows[rx]["SALES_TOTAL_PURCHASE_COST"].length<1)
        {
            alert(rx+"행 판매품전체공급원가(VAT포함)는 빈칸이 될 수 없습니다!");
            return false;
        };

        //숫자형식이어야 하고 0보다 커야한다 (max 10만 정도로 잡는다.)
        if(isNumber(rows[rx]["SALES_TOTAL_PURCHASE_COST"])==false)
        {
            alert(rx+"행 판매품전체공급원가(VAT포함)는 숫자여야 합니다! (공백도 있는지 확인 필요)");
            return false;
        };

        tmpNumber=rows[rx]["SALES_TOTAL_PURCHASE_COST"]*1;
        if(tmpNumber<0)
        {
            alert(rx+"행 판매품전체공급원가(VAT포함)는 >=0 이어야 합니다!");
            return false;
        };

        //정수형인지 Check
        if(Number.isInteger(tmpNumber)==false)
        {
            alert(rx+"행 판매품전체공급원가(VAT포함)는 정수형으로 입력하세요(공백이 있는지도 검사 필요)");
            return false;
        };

        //아래 3개 중 1개는 반드시 입력 필수임
        //판매품용UNIT당낱개수량_GOODS_MASTER는별도
        //판매품용BUNDLE당낱개수량_GOODS_MASTER는별도
        //판매품용BOX당낱개수량_GOODS_MASTER는별도
        if((rows[rx]["SALES_PIECE_UNIT"]==undefined||rows[rx]["SALES_PIECE_UNIT"]==null||rows[rx]["SALES_PIECE_UNIT"].length<1)&&
           (rows[rx]["SALES_PIECE_BUNDLE"]==undefined||rows[rx]["SALES_PIECE_BUNDLE"]==null||rows[rx]["SALES_PIECE_BUNDLE"].length<1)&&
           (rows[rx]["SALES_PIECE_BOX"]==undefined||rows[rx]["SALES_PIECE_BOX"]==null||rows[rx]["SALES_PIECE_BOX"].length<1))
        {
            alert(rx+"행 판매품용 UNIT당 낱개수량, 판매품용 BUNDLE당 낱개수량, 판매품용 BOX당 낱개수량 중 최소 1개 이상 입력되어야 합니다!");
            return false;
        };

        if(rows[rx]["SALES_PIECE_UNIT"]!=undefined&&rows[rx]["SALES_PIECE_UNIT"]!=null&&rows[rx]["SALES_PIECE_UNIT"].length>0)
        {
            tmpNumber=rows[rx]["SALES_PIECE_UNIT"]*1;

            if(isNumber(tmpNumber)==false)
            {
                alert(rx+"행 판매품용 UNIT당 낱개수량은 숫자여야 합니다! (공백도 있는지 확인 필요)");
                return false;
            };

            if(Number.isInteger(tmpNumber)==false)
            {
                alert(rx+"행 판매품용 UNIT당 낱개수량은 정수형으로 입력하세요(공백이 있는지도 검사 필요)");
                return false;
            };
        };

        if(rows[rx]["SALES_PIECE_BUNDLE"]!=undefined&&rows[rx]["SALES_PIECE_BUNDLE"]!=null&&rows[rx]["SALES_PIECE_BUNDLE"].length>0)
        {
            tmpNumber=rows[rx]["SALES_PIECE_BUNDLE"]*1;

            if(isNumber(tmpNumber)==false)
            {
                alert(rx+"행 판매품용 BUNDLE당 낱개수량은 숫자여야 합니다! (공백도 있는지 확인 필요)");
                return false;
            };

            if(Number.isInteger(tmpNumber)==false)
            {
                alert(rx+"행 판매품용 BUNDLE당 낱개수량은 정수형으로 입력하세요(공백이 있는지도 검사 필요)");
                return false;
            };
        };

        if(rows[rx]["SALES_PIECE_BOX"]!=undefined&&rows[rx]["SALES_PIECE_BOX"]!=null&&rows[rx]["SALES_PIECE_BOX"].length>0)
        {
            tmpNumber=rows[rx]["SALES_PIECE_BOX"]*1;

            if(isNumber(tmpNumber)==false)
            {
                alert(rx+"행 판매품용 BOX당 낱개수량은 숫자여야 합니다! (공백도 있는지 확인 필요)");
                return false;
            };

            if(Number.isInteger(tmpNumber)==false)
            {
                alert(rx+"행 판매품용 BOX당 낱개수량은 정수형으로 입력하세요(공백이 있는지도 검사 필요)");
                return false;
            };
        };

        if(rows[rx]["NADLE_UNIT_PRICE1"]!=undefined&&rows[rx]["NADLE_UNIT_PRICE1"]!=null&&rows[rx]["NADLE_UNIT_PRICE1"].length>0)
        {
            unitPriceCheck1=true;
            //숫자형식이어야 하고 0보다 커야한다 (max 10만 정도로 잡는다.)
            if(isNumber(rows[rx]["NADLE_UNIT_PRICE1"])==false)
            {
                alert(rx+"행 단위당 판매가격1(VAT포함)은 숫자여야 합니다! (공백도 있는지 확인 필요)");
                return false;
            };

            tmpNumber=rows[rx]["NADLE_UNIT_PRICE1"]*1;
            if(tmpNumber<0)
            {
                alert(rx+"행 단위당 판매가격1(VAT포함)은 >=0 이어야 합니다!");
                return false;
            };

            //정수형인지 Check
            if(Number.isInteger(tmpNumber)==false)
            {
                alert(rx+"행 단위당 판매가격1(VAT포함)은 정수형으로 입력하세요(공백이 있는지도 검사 필요)");
                return false;
            };
        };

        if(rows[rx]["NADLE_UNIT_PRICE2"]!=undefined&&rows[rx]["NADLE_UNIT_PRICE2"]!=null&&rows[rx]["NADLE_UNIT_PRICE2"].length>0)
        {
            unitPriceCheck2=true;
            //숫자형식이어야 하고 0보다 커야한다 (max 10만 정도로 잡는다.)
            if(isNumber(rows[rx]["NADLE_UNIT_PRICE2"])==false)
            {
                alert(rx+"행 단위당 판매가격2(VAT포함)는 숫자여야 합니다! (공백도 있는지 확인 필요)");
                return false;
            };

            tmpNumber=rows[rx]["NADLE_UNIT_PRICE2"]*1;
            if(tmpNumber<0)
            {
                alert(rx+"행 단위당 판매가격2(VAT포함)는 >=0 이어야 합니다!");
                return false;
            };

            //정수형인지 Check
            if(Number.isInteger(tmpNumber)==false)
            {
                alert(rx+"행 단위당 판매가격2(VAT포함)는 정수형으로 입력하세요(공백이 있는지도 검사 필요)");
                return false;
            };
        };

        if(rows[rx]["NADLE_UNIT_PRICE3"]!=undefined&&rows[rx]["NADLE_UNIT_PRICE3"]!=null&&rows[rx]["NADLE_UNIT_PRICE3"].length>0)
        {
            unitPriceCheck3=true;
            //숫자형식이어야 하고 0보다 커야한다 (max 10만 정도로 잡는다.)
            if(isNumber(rows[rx]["NADLE_UNIT_PRICE3"])==false)
            {
                alert(rx+"행 단위당 판매가격3(VAT포함)은 숫자여야 합니다! (공백도 있는지 확인 필요)");
                return false;
            };

            tmpNumber=rows[rx]["NADLE_UNIT_PRICE3"]*1;
            if(tmpNumber<0)
            {
                alert(rx+"행 단위당 판매가격3(VAT포함)은 >=0 이어야 합니다!");
                return false;
            };

            //정수형인지 Check
            if(Number.isInteger(tmpNumber)==false)
            {
                alert(rx+"행 단위당 판매가격3(VAT포함)은 정수형으로 입력하세요(공백이 있는지도 검사 필요)");
                return false;
            };
        };

        if(rows[rx]["NADLE_UNIT_PRICE4"]!=undefined&&rows[rx]["NADLE_UNIT_PRICE4"]!=null&&rows[rx]["NADLE_UNIT_PRICE4"].length>0)
        {
            unitPriceCheck4=true;
            //숫자형식이어야 하고 0보다 커야한다 (max 10만 정도로 잡는다.)
            if(isNumber(rows[rx]["NADLE_UNIT_PRICE4"])==false)
            {
                alert(rx+"행 단위당 판매가격4(VAT포함)는 숫자여야 합니다! (공백도 있는지 확인 필요)");
                return false;
            };

            tmpNumber=rows[rx]["NADLE_UNIT_PRICE4"]*1;
            if(tmpNumber<0)
            {
                alert(rx+"행 단위당 판매가격4(VAT포함)는 >=0 이어야 합니다!");
                return false;
            };

            //정수형인지 Check
            if(Number.isInteger(tmpNumber)==false)
            {
                alert(rx+"행 단위당 판매가격4(VAT포함)는 정수형으로 입력하세요(공백이 있는지도 검사 필요)");
                return false;
            };
        };

        if(unitPriceCheck1==true||unitPriceCheck2==true||unitPriceCheck3==true||unitPriceCheck4==true)
        {
            //4개 중 1개라도 입력되었다면 단위당 판매가격 표시구분에 값이 있어야 한다.
            if(rows[rx]["NADLE_UNIT_PRICE_DIV"]==undefined||rows[rx]["NADLE_UNIT_PRICE_DIV"]==null||rows[rx]["NADLE_UNIT_PRICE_DIV"].length<1)
            {
                alert(rx+"행 단위당 판매가격1, 단위당 판매가격2, 단위당 판매가격3, 단위당 판매가격4 중 1개라도 입력이 되어 있는 경우 단위당 판매가격 표시구분은 빈칸일 수 없습니다!");
                return false;
            }
            else
            {
                //개당,세트당,번들당,박스당 이라는 글씨로 들어가야 함
                if(rows[rx]["NADLE_UNIT_PRICE_DIV"]!="개당"&&rows[rx]["NADLE_UNIT_PRICE_DIV"]!="세트당"&&rows[rx]["NADLE_UNIT_PRICE_DIV"]!="번들당"&&rows[rx]["NADLE_UNIT_PRICE_DIV"]!="박스당")
                {
                    alert("rx+행 판매가격 구분은 개당, 세트당, 번들당, 박스당 중 하나로 기술되어야 합니다.");
                    return false;
                };
            };
        };

        if(rows[rx]["SALES_REPR_SUPPLIER_SSN"]==undefined||rows[rx]["SALES_REPR_SUPPLIER_SSN"]==null||rows[rx]["SALES_REPR_SUPPLIER_SSN"].length<1)
        {
            alert(rx+"행 대표공급사SSN (사업자번호)는 빈칸일 수 없습니다!");
            return false;
        };

        //상품 출시일: Optional이며 날짜 형식을 check한다.
        if(rows[rx]["GOODS_LAUNCH_DATE"]!=undefined&&rows[rx]["GOODS_LAUNCH_DATE"]!=null&&rows[rx]["GOODS_LAUNCH_DATE"].length>0)
        {
            tmp2=rows[rx]["GOODS_LAUNCH_DATE"];
            chk=regex.test(tmp2);
            if(chk==false)
            {
                alert(rx+"행 상품MASTER 출시일의 날짜 형식은 yyyy-mm-dd 여야 합니다.");
                return false;
            };
        };

        //Barcode 1 자리를 체크하되, Box, Middle, Unit중 1개만 들어가면 충족한 것으로 본다.
        if((rows[rx]["GOODS_BOX_BARCODE1"]==undefined||rows[rx]["GOODS_BOX_BARCODE1"]==null||rows[rx]["GOODS_BOX_BARCODE1"].length<1)&&
           (rows[rx]["GOODS_MID_BARCODE1"]==undefined||rows[rx]["GOODS_MID_BARCODE1"]==null||rows[rx]["GOODS_MID_BARCODE1"].length<1)&&
           (rows[rx]["GOODS_UNIT_BARCODE1"]==undefined||rows[rx]["GOODS_UNIT_BARCODE1"]==null||rows[rx]["GOODS_UNIT_BARCODE1"].length<1))
        {
            alert(rx+"행 Box, Middle, Unit 항목중 적어도 BARCODE 1번 항목에 값이 입력되어야 합니다!");
            return false;
        };
        
    };

    return true;
};

function isNumber(s){
    s += ''; // 문자열로 변환
    s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
    if (s == '' || isNaN(s)) return false;
    return true;
};

function createSalesItemObject(rows)
{
    //////// 모든 체크가 끝났으면 Header 및 Detail에 자동으로 값을 생성해 주는 것까지 JSON Object로 생성하여 준다.
    var itemDB={};
    var itemArr=new Array();
    for(var rx=1; rx<rows.length; rx++)
    {
        itemDB={};    //초기화
        itemDB.localBizCompCode='eum0001';
        itemDB.agencyCode='EUM_HEAD';
        itemDB.salesItemGoodsCode=-2;   //상품master는 일단 보류
        itemDB.salesItemName=rows[rx]["SALES_ITEM_NAME"];
        itemDB.salesItemNotes=rows[rx]["SALES_ITEM_NOTES"];
        itemDB.salesItemDetailInfo=rows[rx]["SALES_ITEM_DETAIL_INFO"];
        itemDB.salesItemChannelCategoryId=rows[rx]["SALES_ITEM_CHANNEL_CATEGORY_ID"];
        itemDB.salesItemCategoryId=-2;  //판매품관리카테고리ID
        itemDB.salesItemChannelId=-2;   //판매품채널ID
        itemDB.salesItemSort=rows[rx]["SALES_ITEM_SORT"];
        if(rows[rx]["SALES_ITEM_IMAGE_FILE"] != undefined && rows[rx]["SALES_ITEM_IMAGE_FILE"].length > 0){
            itemDB.salesItemImageFile=rows[rx]["SALES_ITEM_IMAGE_FILE"].split(".")[0];
            itemDB.salesItemImageFileExt=rows[rx]["SALES_ITEM_IMAGE_FILE"].split(".")[1];
        }
        else{
            itemDB.salesItemImageFile="";
            itemDB.salesItemImageFileExt="";
        };
        itemDB.salesItemProgressCode=rows[rx]["SALES_ITEM_PROGRESS_CODE"];
        itemDB.salesItemSaleStartDatetime=rows[rx]["SALES_ITEM_SALE_START_DATETIME"];
        itemDB.salesItemSaleEndDatetime=rows[rx]["SALES_ITEM_SALE_END_DATETIME"];
        itemDB.salesItemReprStockMgrType=rows[rx]["SALES_ITEM_REPR_STOCK_MGR_TYPE"];
        itemDB.freeShippingYn=rows[rx]["FREE_SHIPPING_YN"];
        itemDB.salesItemDeliveryCode=rows[rx]["SALES_ITEM_DELIVERY_CODE"];
        itemDB.salesItemSaleType=rows[rx]["SALES_ITEM_SALE_TYPE"];
        itemDB.salesItemReprTaxYn=rows[rx]["SALES_ITEM_REPR_TAX_YN"];
        itemDB.salesItemQtyLimitYn=rows[rx]["SALES_ITEM_QTY_LIMIT_YN"];
        itemDB.salesItemStockQty=rows[rx]["SALES_ITEM_STOCK_QTY"];
        itemDB.salesItemPurchaseMinQty=rows[rx]["SALES_ITEM_PURCHASE_MIN_QTY"];
        itemDB.salesItemPurchaseMaxQty=rows[rx]["SALES_ITEM_PURCHASE_MAX_QTY"];
        itemDB.salesItemPrice=rows[rx]["SALES_ITEM_PRICE"];
        itemDB.nadleFatePrice=rows[rx]["NADLE_FATE_PRICE"];
        itemDB.nadleFateDisrate="-1"; //자동계산항목 - 20220616 여기에서는 그냥 -1로 넣고 서버에 가서 재계산한다.
        itemDB.fateStartDatetime=rows[rx]["FATE_START_DATETIME"];
        itemDB.fateEndDatetime=rows[rx]["FATE_END_DATETIME"];
        itemDB.fatePurchaseMinQty=rows[rx]["FATE_PURCHASE_MIN_QTY"];
        itemDB.fatePurchaseMaxQty=rows[rx]["FATE_PURCHASE_MAX_QTY"];
        itemDB.expirationDatetimeFrom=rows[rx]["EXPIRATION_DATETIME_FROM"];
        itemDB.expirationDatetimeTo=rows[rx]["EXPIRATION_DATETIME_TO"];
        itemDB.expirationComments=rows[rx]["EXPIRATION_COMMENTS"];
        itemDB.salesItemReprBrandName=rows[rx]["SALES_ITEM_REPR_BRAND_NAME"];
        itemDB.priceCurrencyCd="KRW";   //화폐단위코드
        itemDB.salesItemApproveCode=rows[rx]["SALES_ITEM_APPROVE_CODE"];

        //자동생성 항목 시작
        //판매품승인일시 - 승인구분코드에따라 결정
        itemDB.salesItemApproveDatetime=setNowDate();
        itemDB.salesItemApproveCharge="";       //판매품승인자: 서버에서 만들어서 넣어야 함
        itemDB.salesItemEndReason=null;         //판매품종료사유
        itemDB.salesItemEndDatetime=null;       //판매품종료일시
        itemDB.salesItemEndCharger=null;        //판매품종료자
        itemDB.partitionKeyYyyy=-1;             //파티션KEY
        itemDB.nadleCate1Idx=-1;                //구항목_상품카테고리(대분류)
        itemDB.nadleCate2Idx=-1;                //구항목_상품카테고리(중분류)
        itemDB.nadleGoodsCd=null;               //구항목_상품코드
        // 자동생성 항목 끝

        itemDB.salesGoodsMaker=rows[rx]["SALES_GOODS_MAKER"];
        itemDB.salesTotalPurchaseCost=rows[rx]["SALES_TOTAL_PURCHASE_COST"]; //판매품전체공급원가_VAT포함구임므로SELL_COST
        itemDB.salesPieceUnit=rows[rx]["SALES_PIECE_UNIT"];
        itemDB.salesPieceBundle=rows[rx]["SALES_PIECE_BUNDLE"];
        itemDB.salesPieceBox=rows[rx]["SALES_PIECE_BOX"];
        itemDB.nadleUnitPriceDiv=rows[rx]["NADLE_UNIT_PRICE_DIV"];
        itemDB.nadleUnitPrice1=rows[rx]["NADLE_UNIT_PRICE1"];
        itemDB.nadleUnitPrice2=rows[rx]["NADLE_UNIT_PRICE2"];
        itemDB.nadleUnitPrice3=rows[rx]["NADLE_UNIT_PRICE3"];
        itemDB.nadleUnitPrice4=rows[rx]["NADLE_UNIT_PRICE4"];
        itemDB.salesReprSupplierSsn=rows[rx]["SALES_REPR_SUPPLIER_SSN"];
        itemDB.nadleScmDealSsn=-1;   //구이음몰허수SSN

        //############### detail part
        itemDB.goodsOriginPlace=rows[rx]["NADLE_GOODS_ORIGIN_PLACE"];
        itemDB.goodsLaunchDate=rows[rx]["GOODS_LAUNCH_DATE"];
        itemDB.GoodsBoxBarcode1=rows[rx]["GOODS_BOX_BARCODE1"];
        itemDB.GoodsBoxBarcode2=rows[rx]["GOODS_BOX_BARCODE2"];
        itemDB.GoodsBoxBarcode3=rows[rx]["GOODS_BOX_BARCODE3"];
        itemDB.GoodsBoxBarcode4=rows[rx]["GOODS_BOX_BARCODE4"];
        itemDB.GoodsMidBarcode1=rows[rx]["GOODS_MID_BARCODE1"];
        itemDB.GoodsMidBarcode2=rows[rx]["GOODS_MID_BARCODE2"];
        itemDB.GoodsMidBarcode3=rows[rx]["GOODS_MID_BARCODE3"];
        itemDB.GoodsMidBarcode4=rows[rx]["GOODS_MID_BARCODE4"];
        itemDB.GoodsUnitBarcode1=rows[rx]["GOODS_UNIT_BARCODE1"];
        itemDB.GoodsUnitBarcode2=rows[rx]["GOODS_UNIT_BARCODE2"];
        itemDB.GoodsUnitBarcode3=rows[rx]["GOODS_UNIT_BARCODE3"];
        itemDB.GoodsUnitBarcode4=rows[rx]["GOODS_UNIT_BARCODE4"];

        //모두 만들었으면 push
        itemArr.push(itemDB);
    };
    // console.log("itemArr", itemArr);
    if(itemArr.length>0)
    {
        //JSON 이 생성 되었으면 ajax서비스를 호출한다.
        try{
            var result=$.ajax({
                //url: "/uEditSalesItem",
                url: "/uEditSalesItem?" + $.param({"editDataJson" : {"editType" : "ExcelAllItemUpload"}}),
                dataType: "json",
                traditional: true,
                data: JSON.stringify({"itemData": itemArr}),
                type: "POST", async: false, crossOrigin: true, cache: false,
                //contentType: "application/x-www-form-urlencoded; charset=utf-8",
                contentType: "application/json; charset=utf-8",
                success: function(response){
                    if(response.errorcode=="PFERR_CONF_0000")
                    {
                        alert("상품 일괄등록이 정상처리 되었습니다.");
                        console.log($("[name=imgFile]").val());
                        if($("[name=imgFile]").val().length > 0){
                            // alert(response.returnvalue);
                            $("[name=attach_dt]").val(response.returnvalue);
                            $("#frm_multi").submit();
                        }
                        else{
                        };
                    }
                    else
                    {
                        alert(response.errormessage);
                    };
                    return true;
                },
                error: function(xhr, textStatus, e) {
                    console.log("[error]: " + textStatus);
                    return false;
                },
                complete:function(data,textStatus) {
                    console.log("[complete]: " + textStatus);
                }
            });

            return result;
        }
        catch(e)
        {
            console.log(e.message);
        }
    }
    else
    {
        alert("등록할 Data가 존재하지 않습니다. (code-json-null)");
        return false;
    };
};

function setNowDate()
{
    //현재 시각을 yyyy-mm-dd hh:mm:ss 형식으로 반환한다.
    var nowDate=new Date();
    var month = nowDate.getMonth() + 1;
    var day = nowDate.getDate();
    var hour = nowDate.getHours();
    var minute = nowDate.getMinutes();
    var second = nowDate.getSeconds();

    month = month >= 10 ? month : "0" + month;
    day = day >= 10 ? day : "0" + day;
    hour = hour >= 10 ? hour : "0" + hour;
    minute = minute >= 10 ? minute : "0" + minute;
    second = second >= 10 ? second : "0" + second;

    return (nowDate.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second);
};
/* -------------------- end of source --------------------------------------------------------------------- */