/****************************************************************************************************
module명: cPmBundleUpdateAdm.js
creator: 안상현
date: 2022.6.13
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
            var opt={};
            opt.chkSalesItemName=false;
            opt.chkfateStartDate=false;
            opt.chkfateEndDate=false;
            opt.chkSalesItemProgressCode=false;
            opt.setSalesItemProgressCode="x";
            opt.chkSalesItemStockQty=false;
            opt.chkPrice=false;
            opt.chkSalesItemSort=false;
            var tf=checkSalesItemHeadAndDetailInfo(rows, opt);
            if(tf==false)
            {
                //return;
            }
            else
            {
                //JSON생성하고 ajax호출
                var rstRows=updateSalesItemObject(rows, opt);
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

function checkSalesItemHeadAndDetailInfo(rows, opt)
{
    //엑셀이 등록된 항목에 대한 컬럼별 정합성 Check
    var tmp1;
    var tmp2;
    var chk=false;
    var tmpNumber=-1;
    var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);

    //(1)빈 서식인가?
    if(rows.length<2)
    {
        alert("서식 안에 데이터가 없습니다.");
        return false;
    };

    //어떤 것을 수정(검사항목)하고자 하는 것인지를 확인한다.
    if($("#chk_cond1").prop("checked")==true)
    {
        //상품명 변경여부
        opt.chkSalesItemName=true;
    };

    if($("#chk_cond8").prop("checked")==true){

        //판매품행사종류 변경여부
        opt.chkSalesItemFateCode=true;
        //판매상태가 어느 것인지를 결정한다.
        if($("#cond_fate_gb0").prop("checked")==true)
        {
            //일반
            opt.setSalesItemFateCode=$("#cond_fate_gb0").val();
        }
        else if($("#cond_fate_gb1").prop("checked")==true)
        {
            //주간
            opt.setSalesItemFateCode=$("#cond_fate_gb1").val();
        }
        else if($("#cond_fate_gb2").prop("checked")==true)
        {
            //특가
            opt.setSalesItemFateCode=$("#cond_fate_gb2").val();
        }
        else if($("#cond_fate_gb3").prop("checked")==true)
        {
            //카테고리
            opt.setSalesItemFateCode=$("#cond_fate_gb3").val();
        };
    };
    
    if($("#chk_cond2").prop("checked")==true)
    {
        //행사시작일 변경여부
        opt.chkfateStartDate=true;
    };

    if($("#chk_cond3").prop("checked")==true)
    {
        //행사종료일 변경여부
        opt.chkfateEndDate=true;
    };

    if($("#chk_cond4").prop("checked")==true)
    {
        //판매품진행상태코드 변경여부
        opt.chkSalesItemProgressCode=true;

        //판매상태가 어느 것인지를 결정한다.
        if($("#cond_sales_gb1").prop("checked")==true)
        {
            //판매중
            opt.setSalesItemProgressCode="1";
        }
        else if($("#cond_sales_gb2").prop("checked")==true)
        {
            //판매중지
            opt.setSalesItemProgressCode="0";
        }
        else if($("#cond_sales_gb0").prop("checked")==true)
        {
            //품절
            opt.setSalesItemProgressCode="2";
        };

        if(opt.setSalesItemProgressCode=="x")
        {
            //error
            alert("판매품 진행상태를 결정할 수 없습니다. IT 담당자에게 문의 바랍니다. sales-status-code-set-error");
            return false;
        };
    };
    
    if($("#chk_cond7").prop("checked")==true)
    {
        //판매품재고수량 변경여부
        opt.chkSalesItemStockQty=true;
    };

    if($("#chk_cond5").prop("checked")==true)
    {
        //단위당 판매가격 변경여부
        opt.chkPrice=true;
    };

    
    if($("#chk_cond6").prop("checked")==true)
    {
        //판매품 정렬 변경여부
        opt.chkSalesItemSort=true;
    };

    //모두 CHECK가 FALSE이면 수행할 필요가 없음
    if(opt.chkSalesItemName==false&&
       opt.chkfateStartDate==false&&
       opt.chkfateEndDate==false&&
       opt.chkSalesItemProgressCode==false&&
       opt.chkSalesItemStockQty==false&&
       opt.chkPrice==false&&
       opt.chkSalesItemSort==false&&
       opt.chkSalesItemFateCode==false)
    {
        alert("변경할 항목을 아무것도 선택하지 않아 변경 등록을 수행할 수 없습니다.");
        return false;
    };


    //2행부터 Check
    for(var rx=1; rx<rows.length; rx++)
    {
        //매 행마다 체크해야 하는 변수는 초기화한다.
        chk=false;
        tmpNumber=-1;

        //(2)필수 항목에 대하여 빈 칸이 있는 가?
        if(rows[rx]["SALES_ITEM_ID"]==undefined||rows[rx]["SALES_ITEM_ID"]==null||rows[rx]["SALES_ITEM_ID"].length<1)
        {
            alert(rx+"행 판매품 ID는 빈칸이 될 수 없습니다! - 변경해서도 안됨!!");
            return false;
        };

        //숫자형식이어야 하고 0보다 커야한다 (max 10만 정도로 잡는다.)
        if(isNumber(rows[rx]["SALES_ITEM_ID"])==false)
        {
            alert(rx+"행 판매품 ID는 숫자여야 합니다! - 변경해서도 안됨!!");
            return false;
        };

        if(opt.chkSalesItemName==true)
        {
            if(rows[rx]["SALES_ITEM_NAME"]==undefined||rows[rx]["SALES_ITEM_NAME"]==null||rows[rx]["SALES_ITEM_NAME"].length<1)
            {
                alert(rx+"행 판매품 명칭은 빈칸이 될 수 없습니다!");
                return false;
            };
        };

        if(opt.chkSalesItemSort==true)
        {
            if(rows[rx]["SALES_ITEM_SORT"]!=undefined&&rows[rx]["SALES_ITEM_SORT"]!=null&&rows[rx]["SALES_ITEM_SORT"].length>0)
            {
                if(isNumber(rows[rx]["SALES_ITEM_SORT"])==false)
                {
                    alert(rx+"행 정렬순서는 숫자여야 합니다! (공백도 있는지 확인 필요)");
                    return false;
                };
            };
        };

        if(opt.chkfateStartDate==true)
        {
            if(rows[rx]["FATE_START_DATETIME"]!=undefined&&rows[rx]["FATE_START_DATETIME"]!=null&&rows[rx]["FATE_START_DATETIME"].length>0)
            {
                //입력한 형식이 날짜 형식인가?
                tmp1=rows[rx]["FATE_START_DATETIME"];
                chk=regex.test(tmp1);
                if(chk==false)
                {
                    alert(rx+"행 행사판매시작일 날짜 형식은 yyyy-mm-dd 여야 합니다.");
                    return false;
                };
            };
        };

        if(opt.chkfateEndDate==true)
        {
            if(rows[rx]["FATE_END_DATETIME"]!=undefined&&rows[rx]["FATE_END_DATETIME"]!=null&&rows[rx]["FATE_END_DATETIME"].length>0)
            {
                //입력한 형식이 날짜 형식인가?
                tmp2=rows[rx]["FATE_END_DATETIME"];
                chk=regex.test(tmp2);
                if(chk==false)
                {
                    alert(rx+"행 행사판매종료일 날짜 형식은 yyyy-mm-dd 여야 합니다.");
                    return false;
                };
            };
        };

        if(opt.chkPrice==true)
        {
            //2022.09.13 윤희상
            //필수 항목아님.
            // if(rows[rx]["NADLE_UNIT_PRICE_DIV"]==undefined||rows[rx]["NADLE_UNIT_PRICE_DIV"]==null||rows[rx]["NADLE_UNIT_PRICE_DIV"].length<1)
            // {
            //     alert(rx+"행 단위당판매가격표시구분는 빈칸이 될 수 없습니다.");
            //     return false;
            // };

            if(rows[rx]["NADLE_UNIT_PRICE1"]!=undefined&&rows[rx]["NADLE_UNIT_PRICE1"]!=null&&rows[rx]["NADLE_UNIT_PRICE1"].length>0)
            {
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

            //판매가 및 행사가 Check
            //이 가격란을 포함하여 비록 수정 대상으로  check box에 check가 되어 있더라고 실제로 SQL에서는
            //0을 포함한 경우 Update하고, 아무것도 입력하지 않는 경우 (null 또는 '')는 update항목에서 제외한다.
            //따라서 여기에서는 입력된 경우에 한해서 Number타입인가면 검사한다.
            if(rows[rx]["NADLE_FATE_PRICE"]!=undefined&&rows[rx]["NADLE_FATE_PRICE"]!=null&&rows[rx]["NADLE_FATE_PRICE"].length>0)
            {
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
            };

            if(rows[rx]["SALES_ITEM_PRICE"]!=undefined&&rows[rx]["SALES_ITEM_PRICE"]!=null&&rows[rx]["SALES_ITEM_PRICE"].length>0)
            {
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
            };
        };

        if(opt.chkSalesItemStockQty==true)
        {
            if(rows[rx]["SALES_ITEM_STOCK_QTY"]!=undefined&&rows[rx]["SALES_ITEM_STOCK_QTY"]!=null&&rows[rx]["SALES_ITEM_STOCK_QTY"].length>0)
            {
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
            };
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

function updateSalesItemObject(rows, opt)
{
    //////// 모든 체크가 끝났으면 Header 및 Detail에 자동으로 값을 생성해 주는 것까지 JSON Object로 생성하여 준다.
    var itemDB={};
    var itemArr=new Array();
    for(var rx=1; rx<rows.length; rx++)
    {
        itemDB={};    //초기화

        //check option을 배치해준다. - boolean은 전송이 안되므로 문자열로 바꾸어보낸다.
        if(opt.chkSalesItemName==true)
        {
            itemDB.chkSalesItemName="true";
        }
        else
        {
            itemDB.chkSalesItemName="false";
        };

        if(opt.chkSalesItemSort==true)
        {
            itemDB.chkSalesItemSort="true";
        }
        else
        {
            itemDB.chkSalesItemSort="false";
        };
        
        if(opt.chkSalesItemFateCode==true)
        {
            itemDB.chkFateCode="true";
        }
        else
        {
            itemDB.chkFateCode="false";
        };

        if(opt.chkfateStartDate==true)
        {
            itemDB.chkfateStartDate="true";
        }
        else
        {
            itemDB.chkfateStartDate="false";
        };
        
        if(opt.chkfateEndDate==true)
        {
            itemDB.chkfateEndDate="true";
        }
        else
        {
            itemDB.chkfateEndDate="false";
        };

        if(opt.chkSalesItemProgressCode==true)
        {
            itemDB.chkSalesItemProgressCode="true";
        }
        else
        {
            itemDB.chkSalesItemProgressCode="false";
        };

        if(opt.chkSalesItemStockQty==true)
        {
            itemDB.chkSalesItemStockQty="true";
        }
        else
        {
            itemDB.chkSalesItemStockQty="false";
        };

        if(opt.chkPrice==true)
        {
            itemDB.chkPrice="true";
        }
        else
        {
            itemDB.chkPrice="false";
        };

        if(opt.chkSalesItemSort==true)
        {
            itemDB.chkSalesItemSort="true";
        }
        else
        {
            itemDB.chkSalesItemSort="false";
        };

        //그 다음 excel의 값
        itemDB.localBizCompCode='eum0001';
        itemDB.salesItemId=rows[rx]["SALES_ITEM_ID"];
        itemDB.salesItemName=rows[rx]["SALES_ITEM_NAME"];
        itemDB.salesItemSort=rows[rx]["SALES_ITEM_SORT"];
        itemDB.salesItemProgressCode=opt.setSalesItemProgressCode;
        itemDB.salesItemStockQty=rows[rx]["SALES_ITEM_STOCK_QTY"];
        itemDB.salesItemPrice=rows[rx]["SALES_ITEM_PRICE"];
        itemDB.nadleFatePrice=rows[rx]["NADLE_FATE_PRICE"];
        itemDB.fateCode = opt.setSalesItemFateCode;
        itemDB.fateStartDatetime=rows[rx]["FATE_START_DATETIME"];
        itemDB.fateEndDatetime=rows[rx]["FATE_END_DATETIME"];
        itemDB.nadleUnitPriceDiv=rows[rx]["NADLE_UNIT_PRICE_DIV"];
        itemDB.nadleUnitPrice1=rows[rx]["NADLE_UNIT_PRICE1"];
        itemDB.nadleUnitPrice2=rows[rx]["NADLE_UNIT_PRICE2"];
        itemDB.nadleUnitPrice3=rows[rx]["NADLE_UNIT_PRICE3"];
        itemDB.nadleUnitPrice4=rows[rx]["NADLE_UNIT_PRICE4"];
        //모두 만들었으면 push
        itemArr.push(itemDB);
    };

    if(itemArr.length>0)
    {
        //JSON 이 생성 되었으면 ajax서비스를 호출한다.
        var result=$.ajax({
            //url: "/uEditSalesItem",
            url: "/uEditSalesItem?" + $.param({"editDataJson" : {"editType" : "ExcelAllItemUpdate"}}),
            dataType: "json",
            traditional: true,
            data: JSON.stringify({"itemData": itemArr}),
            type: "POST", async: false, crossOrigin: true, cache: false,
            contentType: "application/json; charset=utf-8",
            success: function(response){
                if(response.errorcode=="PFERR_CONF_0000")
                {
                    alert("상품 일괄변경이 정상처리 되었습니다.");
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
    else
    {
        alert("등록할 Data가 존재하지 않습니다. (code-json-null)");
        return false;
    };z
};

/* -------------------- end of source --------------------------------------------------------------------- */