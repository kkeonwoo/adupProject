/****************************************************************************************************
module명: cAddSalesItemAdm.js
creator: 윤희상
date: 2022.04.25
version 1.0
설명: 관리자 페이지에서 상품등록 화면용 js
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
function btnSubmit(){
    //공급사목록 선택되어있는지 확인
    if($("#supplier_ssn").val() != undefined && $("#supplier_ssn").val() == ""){
        alert("공급사 선택!");
        return;
    };

    //상품카테고리가 전부 설정되어있는지 확인
    if($("#cate1_idx").val() == "9"){
        if($("#cate2_idx").val() == "" || $("#cate3_idx").val() == ""){
            alert("카테고리 선택!");
            return;
        };
    }
    else if($("#cate1_idx").val() == "" || $("#cate2_idx").val() == ""){
        alert("카테고리 선택!");
        return;
    };

    //상품명 입력되어있는지 확인
    if($("input[name=goods_name]").val().length < 1){
        alert("상품명 입력 확인!");
        return;
    };

    //상품상태확인
    if($("input[name=sales_chilled]:checked").val() == ""){
        alert("상품상태선택!");
        return;
    };

    //공급원가, 낱개판매가 입력확인
    if($("#sell_cost").val() < 0 || $("#sell_cost").val() == undefined 
    || $("#sell_price").val() <= 0 || $("#sell_price").val() == undefined){
        alert("공급원가, 낱개판매가 입력확인!");
        return;
    };
    
    if(Number($("#sell_cost").val()) > Number($("#sell_price").val())){
        alert("판매가가 공급원가보다 낮을 수 없습니다!");
        return;
    };

    //과세 면세 확인
    if($("input[name=tax_gb]:checked").val() == ""){
        alert("상품상태선택!");
        return;
    };

    //재고량 입력확인
    if(Number($("input[name=stock_piece]").val()) < 0 || Number($("input[name=stock_piece]").val()) == ""){
        alert("재고량!");
        return;
    };

    //최대/최소수량 확인
    if($("input[name=sell_min]").val() < 0 || $("input[name=sell_max]").val() < 0
    || $("input[name=sell_min]").val() == "" || $("input[name=sell_max]").val() == ""){
        alert("최대/최소수량!");
        return;
    };

    if($("input[name=sell_max]").val() < $("input[name=sell_min]").val()){
        alert("최소 수량이 최대 수량보다 클 수 없습니다.");
        return;
    };

    //낱개입수량
    if(!$("#piece_unit_none").prop("checked")){
        if($("#piece_unit").val() < 0 || $("#piece_unit").val() == ""){
            alert("낱개입수량!");
            return;
        };
    };

    //볼입수량
    if(!$("#piece_bundle_none").prop("checked")){
        if($("#piece_bundle").val() < 0 || $("#piece_bundle").val() == ""){
            alert("박스입수량!");
            return;
        };
    };
 
    
    //박스입수량
    if(!$("#piece_box_none").prop("checked")){
        if($("#piece_box").val() < 0 || $("#piece_box").val() == ""){
            alert("박스입수량!");
            return;
        };
    };

    //행사진행여부 확인
    if($("input[name=fate_yn]:checked").val() == ""){
        alert("행사진행여부!");
        return;
    };

    //여부에따라 기간 및 금액 최소 최대 수량 확인
    if($("input[name=fate_yn]:checked").val() != "XX"){
        //기간확인
        if($("input[name=fate_start]").val() == "" || $("input[name=fate_end]").val() == ""){
            alert("기간확인");
            return;
        };

        if($("input[name=fate_start]").val() > $("input[name=fate_end]").val()){
            alert("기간확인");
            return;
        };

        //금액확인
        if($("#fate_price").val() <= 0 || $("#fate_price").val() == ""){
            alert("할인판매가확인");
            return;
        };

        if(Number($("#sell_price").val()) < Number($("#fate_price").val())){
            alert("할인판매가가 낱개판매가보다 높을 수 없습니다!");
            return;
        };

        //최소최대확인
        if($("input[name=fate_sales_min]").val() <= 0 || $("input[name=fate_sales_min]").val() == ""
         ||$("input[name=fate_sales_max]").val() <= 0 || $("input[name=fate_sales_max]").val() == ""){
            alert("최소최대확인");
            return;
        };

        if(Number($("input[name=fate_sales_max]").val()) < Number($("input[name=fate_sales_min]").val())){
            alert("최소 수량이 최대 수량보다 클 수 없습니다.");
            return;
        };
    };

    // if($("#origin_file").val().length < 1){
    //     alert("이미지확인!");
    //     return;
    // };

    var addItemCondition = {};
    addItemCondition = {
        "editType" : "Add",
        "attach_cd" : $("input[name=attach_cd]").val(),
        //"supplier_ssn" : $("#supplier_ssn").val(),
        "cate1_idx" : $("#cate1_idx").val(),
        "cate2_idx" : $("#cate2_idx").val(),
        "cate3_idx" : $("#cate3_idx").val(),
        "goods_name" : $("input[name=goods_name]").val(),
        "shipping_free" : $("input[name=shipping_free]:checked").val(),
        "unit_price_div" : $("#unit_price_div").val(),
        "unit_price1" : $("#unit_price1").val(),
        "unit_price2" : $("#unit_price2").val(),
        "unit_price3" : $("#unit_price3").val(),
        "unit_price4" : $("#unit_price4").val(),
        "goods_barcode" : $("input[name=goods_barcode]").val(),
        "goods_barcode2" : $("input[name=goods_barcode2]").val(),
        "goods_barcode3" : $("input[name=goods_barcode3]").val(),
        "goods_barcode4" : $("input[name=goods_barcode4]").val(),
        "goods_place" : $("input[name=goods_place]").val(),
        "goods_maker" : $("input[name=goods_maker]").val(),
        "dis_sort" : $("input[name=dis_sort]").val(),
        "sales_chilled" : $("input[name=sales_chilled]:checked").val(),
        "goods_date" : $("input[name=goods_date]").val(),
        "sales_start" : $("input[name=sales_start]").val(),
        "sales_end" : $("input[name=sales_end]").val(),
        "expiration_date" : $("input[name=expiration_date]").val(),
        "sell_cost" : $("input[name=sell_cost]").val(),
        "sell_price" : $("input[name=sell_price]").val(),
        "sell_margin" : $("input[name=sell_margin]").val(),
        "tax_gb" : $("input[name=tax_gb]:checked").val(),
        "stock_piece" : $("input[name=stock_piece]").val(),
        "sell_min" : $("input[name=sell_min]").val(),
        "sell_max" : $("input[name=sell_max]").val(),
        "piece_unit" : $("input[name=piece_unit]").val(),
        "piece_bundle" : $("input[name=piece_bundle]").val(),
        "piece_box" : $("input[name=piece_box]").val(),
        "fate_yn" : $("input[name=fate_yn]:checked").val(),
        "fate_start" : $("input[name=fate_start]").val(),
        "fate_end" : $("input[name=fate_end]").val(),
        "fate_price" : $("input[name=fate_price]").val(),
        "fate_disrate" : $("input[name=fate_disrate]").val(),
        "fate_sales_min" : $("input[name=fate_sales_min]").val(),
        "fate_sales_max" : $("input[name=fate_sales_max]").val(),
        "goods_summary" : $("textarea[name=goods_summary]").val(),
        "goods_detail_info" : CKEDITOR.instances.editor_textarea.getData()
    };
    if($("#origin_file").val() != "" && $("#origin_file").val() != undefined){
        var img = $("#origin_file")[0].files[0].name.split(".");
        addItemCondition.ext =  img[img.length-1];
    };
    
    if($("#supplier_ssn").val()==undefined){
        addItemCondition.supplier_ssn = "SUPER";
    }
    else {
        addItemCondition.supplier_ssn = $("#supplier_ssn").val();
    }

    console.log("addItemCondition", addItemCondition);

    $.ajax({
        url: "/uEditSalesItem?" + $.param({"editDataJson" : addItemCondition}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
                return;
            }
            else if(response.errorcode == "PFERR_CONF_0000"){
                if($("#origin_file").val() != "" && $("#origin_file").val() != undefined){
                    var imageUpload = $("form").submit();
                    console.log("imageUpload", imageUpload);
                }
                else{
                    location.reload();
                };
            };
        },
        error: function(qXHR, textStatus, errorThrown) {
			alert("[err messager]:" + textStatus)
            return null;
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
};

function btnCopy(){
    var url = "/eum/html/admin/goodsCategoryCopy.html";
    var win = window.open(url,"new_window1","width=1024,height=768,toolba=no");
};