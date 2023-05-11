/****************************************************************************************************
module명: cBannerItemAdm.js
creator: 윤희상
date: 2022.05.23
version 1.0
설명: 관리자 페이지에서 전체주문조회 화면용 js
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
async function drawBannerinfo(pId){
    var b_info = await bannerinfo();
    var txt="";
    $(".banner-list").html(txt);
    var status;
    for(var bx=0; bx<b_info.length; bx++){
        txt += `    <div class="banner ui-sortable-handle"> \n`;
        txt += `        <div style="width:194px; margin-bottom:10px"><img src="/eum/resources/temp/banner/${b_info[bx].IMAGE_NAME_HASH_WEB}" border="0" width="194" height="60"></div> \n`;
        txt += `        <div style="width:194px; margin-bottom:10px"><img src="/eum/resources/temp/banner/${b_info[bx].IMAGE_NAME_HASH_MOBILE}" border="0" width="194" height="112"></div> \n`;
        if(b_info[bx].BANNER_STATUS == '1') status = "사용";
        else status = "중지";
        txt += `        <div class="banner-title" style="cursor:pointer;" data-banner_idx="${b_info[bx].BANNER_IDX}">${b_info[bx].BANNER_TITLE}(${status})</div> \n`;
        txt += `    </div> \n`;
    };
    $(".banner-list").html(txt);

    $(".banner-title").click(function(){

        console.log(this);
        $(this).css("background-color", "rgb(255, 51, 51)");
        $(this).css("color", "rgb(255, 255, 255)");
        $(this).css("font-weight", "bold");
        $(".banner-title").not($(this)).css("background-color", "");
        $(".banner-title").not($(this)).css("color", "");
        $(".banner-title").not($(this)).css("font-weight", "");

        $("input[name=banner_idx]").val($(this).data("banner_idx"));

        b_info.forEach(item => {
            if(item.BANNER_IDX == $(this).attr("data-banner_idx")){
                $("input[name=banner_title]").val(item.BANNER_TITLE);
                $("input:radio[name=banner_status]:radio[value='"+item.BANNER_STATUS+"']").prop("checked", true);
                
                drawBannerItemInfo(item.BANNER_IDX);
            }
        });

    });

    if(pId != "" && pId != undefined){
        $('.banner-title').each(function(index,item){
            if($(item).attr("data-banner_idx") == pId){
                $(item).click();
            };
        });
    };
};

async function drawBannerItemInfo(pIdx){
    var rtn = await bannerItemInfo(pIdx);
    console.log("rtn", rtn);
    if(rtn != null){
        var txt="";
        var count=0;
        if(rtn.length > $("#list_cnt").val()) count = $("#list_cnt").val();
        else count = rtn.length;
        $(".txt_total strong").text(rtn.length);
        for(var lx=0; lx<count; lx++){
            txt += `<li style="border:1px solid #356; height:26px; margin:5px; padding:4px;"> \n`;
            txt += `	<span style="display:inline-block; width:20px;"> \n`;
            txt += `		<input type="hidden" name="goods_idx" value="${rtn[lx].SALES_ITEM_ID}"> \n`;
            txt += `		<input type="hidden" name="db_dis_sort" value="${rtn[lx].GOODS_DIS}"> \n`;
            txt += `		<input type="checkbox" name="sort_idx" value="${rtn[lx].SALES_ITEM_ID}"> \n`;
            txt += `	</span> \n`;
            if(rtn[lx].SALES_ITEM_REPR_STOCK_MGR_TYPE == "0") txt += `	<span style="display:inline-block; width:150px; height:20px; padding:3px;">상온</span> \n`;
            if(rtn[lx].SALES_ITEM_REPR_STOCK_MGR_TYPE == "1") txt += `	<span style="display:inline-block; width:150px; height:20px; padding:3px;">냉장</span> \n`;
            if(rtn[lx].SALES_ITEM_REPR_STOCK_MGR_TYPE == "2") txt += `	<span style="display:inline-block; width:150px; height:20px; padding:3px;">냉동</span> \n`;
            txt += `	<span style="display:inline-block; width:150px; height:20px; padding:3px;">${rtn[lx].SALES_ITEM_CHANNEL_CATEGORY_NAME}</span> \n`;
            txt += `	<span style="display:inline-block; width:540px; height:20px; padding:3px;">${rtn[lx].SALES_ITEM_NAME}</span> \n`;
            if(rtn[lx].SALES_ITEM_PROGRESS_CODE == "0") txt += `	<span style="display:inline-block; width:60px; height:20px; padding:3px;">품절</span> \n`;
            else if(rtn[lx].SALES_ITEM_PROGRESS_CODE == "1") txt += `	<span style="display:inline-block; width:60px; height:20px; padding:3px;">판매중</span> \n`;
            else if(rtn[lx].SALES_ITEM_PROGRESS_CODE == "2") txt += `	<span style="display:inline-block; width:60px; height:20px; padding:3px;">판매중지</span> \n`;
            txt += `	<span style="display:inline-block; width:60px; height:20px; padding:3px;">${rtn[lx].GOODS_DIS}</span> \n`;
            txt += `</li> \n`;
        };
        
        $("#sb-sortable").html(txt);

        $("#sb-sortable li").on("click",function(){
            var blnchecked = $(this).find("input:checkbox").prop("checked");
            $(this).find("input:checkbox").prop("checked", !blnchecked);
            
            if($(this).find("input:checkbox").prop("checked") == true){
                $(this).addClass("sb-selected");
            } else {
                $(this).removeClass("sb-selected");
            }
        });

        $("#sb-sortable [name=sort_idx]").on("click",function(){
            var blnchecked = $(this).prop("checked");
            $(this).prop("checked", !blnchecked);
            
            if($(this).prop("checked") == true){
                $(this).addClass("sb-selected");
            } else {
                $(this).removeClass("sb-selected");
            }
            
        });	
    }
    else {
        $(".txt_total strong").text(0);
        $("#sb-sortable").html("");
    };
};

async function bannerItemInfo(pIdx){
    var returnvalue;
    await $.ajax({
        url: "/uGetBannerItemInfo?"  + $.param({"bannerIdx" : pIdx}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            }
            else if(response.errorcode == "PFERR_CONF_0000"){
                returnvalue = response.returnvalue;
            }
            else {
                returnvalue = null;
            };
        },
        error: function(qXHR, textStatus, errorThrown) {
            alert("[err messager]:" + textStatus);
            returnvalue = null;
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
    return returnvalue;
};

async function bannerinfo(){
    var returnvalue;
    await $.ajax({
        url: "/uGetBannerInfo?"  + $.param({}),
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(response){
            if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            }
            else if(response.errorcode == "PFERR_CONF_0000"){
                returnvalue = response.returnvalue;
            }
            else {
                returnvalue = null;
            };
        },
        error: function(qXHR, textStatus, errorThrown) {
            alert("[err messager]:" + textStatus);
            returnvalue = null;
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
    return returnvalue;
};

function btnImageUp() {
    //배너 이미지 등록 및 수정
    if($("input[name=banner_idx]").val() == "" || $("input[name=banner_idx]").val() == undefined){
        alert("배너 선택 하세요.");
        return;
    };
    if($("#imgFile").val() == '') {
        alert("이미지 선택 하세요.");
        return;
    };
    $("#frm_banner_image").submit();
};


        
async function btnBannerUpdate(){
    //배너정보수정
    var banner_dis = "";	
    $(".banner-title").each(function(idx, elem){
        
        if(banner_dis.length > 0) {
            banner_dis += ","+$(this).data("banner_idx");
        }else {
            banner_dis = ""+$(this).data("banner_idx");
        }
    });
    
    $("[name=banner_dis]").val(banner_dis);

    console.log(banner_dis);

    var editDataJson = {
        "bannertype" : $("[name=bannertype]").val(), 
        "banner_idx" : $("[name=banner_idx]").val(),
        "banner_dis" : $("[name=banner_dis]").val(),
        "banner_title" : $("[name=banner_title]").val(),
        "banner_status" : $("[name=banner_status]:checked").val()
    };

    var rtn = await callEditBannerInfo(editDataJson);
    console.log("rtn", rtn);
    if(rtn!=null && rtn != ""){
        drawBannerinfo($("[name=banner_idx]").val());
    };
    // $("#frm_Banner").attr("action", "/editBannerInfo");
    // console.log($("#frm_Banner").submit());
};


async function callEditBannerInfo(pEditDataSetJson){ 

    var returnvalue;

    await $.ajax({
        url: "/uEditBannerInfo?",
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/json; charset=utf-8",
        data:JSON.stringify(pEditDataSetJson),
        success: function(response){
            console.log(response);
            if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            }
            else if(response.errorcode == "PFERR_CONF_0000"){
                returnvalue = "OK";
            }
            else {
                returnvalue = null;
            };
        },
        error: function(qXHR, textStatus, errorThrown) {
            alert("[err messager]:" + textStatus);
            returnvalue = null;
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });

    return returnvalue;
};


async function saveSortGoods(){
    var liArr = $("#sb-sortable").find("li").find("span").children("input[name=sort_idx]");
    var valArr = new Array();
    for(var lx=0; lx<liArr.length; lx++){
        valArr.push(liArr[lx].value);
    };

    var editDataSetJson = {
        "appId" : "bannerItemAdm.html",
        "bannertype" : "editGoodsSort",
        "sales_item_arr" : valArr,
        "banner_idx" : $("[name=banner_idx]").val()
    };

    await $.ajax({
        url: "/uEditBannerInfo?",
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/json; charset=utf-8",
        data:JSON.stringify(editDataSetJson),
        success: function(response){
            console.log(response);
            if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            }
            else if(response.errorcode == "PFERR_CONF_0000"){
                drawBannerinfo($("[name=banner_idx]").val());
            }
            else {
            };
        },
        error: function(qXHR, textStatus, errorThrown) {
            alert("[err messager]:" + textStatus);
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
};

async function deleteGoods(){
    var delete_item_arr = [];
    if(confirm("삭제하겠습니까?")) {
        if($("[name=sort_idx]:checked").length > 0){
            for(var cx=0; cx<$("[name=sort_idx]:checked").length; cx++){
                delete_item_arr.push($("[name=sort_idx]:checked")[cx].value);
            };
        };
    };

    var editDataSetJson = {
        "appId" : "bannerItemAdm.html",
        "bannertype" : "deleteGoods",
        "delete_item_arr" : delete_item_arr,
        "banner_idx" : $("[name=banner_idx]").val()
    };

    await $.ajax({
        url: "/uEditBannerInfo?",
        type: "POST", async: false,  dataType: "JSON", crossOrigin: true, cache: false,
        contentType: "application/json; charset=utf-8",
        data:JSON.stringify(editDataSetJson),
        success: function(response){
            console.log(response);
            if(response.errorcode == "PFERR_CONF_0059"){
                location.href = response.returnpage;
                alert(response.errormessage);
            }
            else if(response.errorcode == "PFERR_CONF_0000"){
                drawBannerinfo($("[name=banner_idx]").val());
            }
            else {
            };
        },
        error: function(qXHR, textStatus, errorThrown) {
			alert("[err messager]:" + textStatus);
        },
        complete:function(data,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
};