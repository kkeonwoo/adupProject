/****************************************************************************************************
module명: cGetAdminPageMenu.js
creator: 윤희상
date: 2022.03.16
version 1.0
설명: 관리자 페이지에서 권한별 Menu를 가져오기 위한 모듈
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

// function getMenuListAjax(pHtmlName){
//     //adminMenuList만드는 Ajax
//     $.ajax({
//         url: "/uGetAdminMenuLevelList?"  + $.param({}),
//         type: "POST", async: true,  dataType: "JSON", crossOrigin: true, cache: false,
//         contentType: "application/x-www-form-urlencoded; charset=utf-8",
//         success: function(response){
//             if(response.errorcode == "PFERR_CONF_0000"){
//                 //Json이 결과로 넘어옴
//                 var tmpJson = response.returnvalue;
//                 //ul tag
//                 var tmpTagUl;
//                 //li tag
//                 var tmpTagLi;
//                 //a tag
//                 var tmpTagA;
//                 //해당  lnb json
//                 var tmpLiJson;
//                 //lnb title
//                 var tmpTitle;

//                 //결과값 gnb 먼저 만들고
//                 for(var gx=0; gx<tmpJson.gnb.length;gx++){
//                     tmpTagLi = document.createElement("li");
//                     tmpTagA = document.createElement("a");
//                     tmpTagA.href = tmpJson.gnb[gx].href;
//                     tmpTagA.text = tmpJson.gnb[gx].title;
//                     tmpTagLi.appendChild(tmpTagA);
//                     document.getElementById("gnb").appendChild(tmpTagLi);

//                     //gnb 중에서 현재 호출된 화면이 포함된 lnb를 그림
//                     tmpLiJson = tmpJson.gnb[gx].lnb.filter(function(item, index, arr2){return item.href==pHtmlName});
//                     if(tmpLiJson.length > 0){
//                         tmpTitle = document.createElement("h2");
//                         tmpTitle.innerHTML = `<span>${tmpJson.gnb[gx].title}</span>`;
//                         document.getElementById("lnb").appendChild(tmpTitle);
//                         tmpTagUl = document.createElement("ul");
//                         for(var lx=0; lx<tmpJson.gnb[gx].lnb.length; lx++){
//                             tmpTagLi = document.createElement("li");
//                             tmpTagA = document.createElement("a");
//                             //현재 호출된 화면의 경우 on class 추가
//                             if(tmpJson.gnb[gx].lnb[lx].href == pHtmlName){
//                                 tmpTagLi.setAttribute("class", "on");
//                             }
//                             tmpTagA.href = tmpJson.gnb[gx].lnb[lx].href;
//                             tmpTagA.text = tmpJson.gnb[gx].lnb[lx].title;
//                             tmpTagLi.appendChild(tmpTagA);
//                             tmpTagUl.appendChild(tmpTagLi);
//                         }
//                         document.getElementById("lnb").appendChild(tmpTagUl);
//                     }
//                     else{
//                     }
//                 }
//             }
//             else if(response.errorcode == "PFERR_CONF_0059"){
//                 location.href = response.returnpage;
//                 alert(response.errormessage);
//             };
//         },
//         error: function(xhr) {
//            console.log("[error] : " + xhr);
//         },
//         complete:function(data,textStatus) {
//            console.log("[complete] : " + textStatus);
//         }
//      });
// };


var menuJson = [
    {
        "GB" : "ADMIN",
        "gnb":
        [ 
            {
                "title" : "사용자관리"
                , "href" : "buyerListAdm.html"
                , "index" : 0
                , "lnb":[   
                            {"title" : "구매회원", "href" : "buyerListAdm.html", "Lv0Index" : 0},
                            {"title" : "공급사", "href" : "supplierListAdm.html", "Lv0Index" : 0},
                            {"title" : "운영자", "href" : "adminListAdm.html", "Lv0Index" : 0},
                            {"title" : "포인트구분", "href" : "pointTypeListAdm.html", "Lv0Index" : 0},
                            {"title" : "포인트내역", "href" : "pointListAdm.html", "Lv0Index" : 0},
                            {"title" : "구매회원 등급 기준 관리", "href" : "gradeListAdm.html", "Lv0Index" : 0},
                            {"title" : "분기별 회원등급 확인 및 쿠폰 발급 여부", "href" : "gradeCheckListAdm.html", "Lv0Index" : 0},
                            {"title" : "쿠폰 구분", "href" : "couponTypeListAdm.html", "Lv0Index" : 0},
                            {"title" : "쿠폰 내역", "href" : "couponListAdm.html", "Lv0Index" : 0},
                            {"title" : "장바구니 할인 구분", "href" : "cartTypeListAdm.html", "Lv0Index" : 0},
                            {"title" : "장려금 지급 기준", "href" : "subsidyListAdm.html", "Lv0Index" : 0},
                            {"title" : "장려금 지급 예정 내역", "href" : "salesPointListAdm.html", "Lv0Index" : 0}
                        ]
            },
            {
                "title" : "카테고리관리"
                , "href" : "categoryListAdm.html"
                , "index" : 1
                , "lnb":[   
                            {"title" : "카테고리관리", "href" : "categoryListAdm.html", "Lv0Index" : 1}
                        ]
            },
            {
                "title" : "상품관리"
                , "href" : "goodsCategoryAdm.html"
                , "index" : 2
                , "lnb":[   
                            {"title" : "상품조회", "href" : "goodsCategoryAdm.html", "Lv0Index" : 2},
                            {"title" : "상품마스터 조회", "href" : "goodsMasterAdm.html", "Lv0Index" : 2},
                            {"title" : "상품마스터등록", "href" : "addSalesMasterAdm.html", "Lv0Index" : 2},
                            {"title" : "상품등록", "href" : "addSalesItemAdm.html", "Lv0Index" : 2},
                            {"title" : "상품일괄등록", "href" : "pmBundleAddAdm.html", "Lv0Index" : 2},
                            {"title" : "상품일괄변경", "href" : "pmBundleUpdateAdm.html", "Lv0Index" : 2},
                            {"title" : "인기상품관리", "href" : "popularItemListAdm.html", "Lv0Index" : 2},
                            {"title" : "상품정렬", "href" : "sortingSalesItemAdm.html", "Lv0Index" : 2},
                            {"title" : "배너관리", "href" : "bannerListAdm.html", "Lv0Index" : 2},
                            {"title" : "배너상품", "href" : "bannerItemAdm.html", "Lv0Index" : 2}
                        ]
            },
            {
                "title" : "주문관리"
                , "href" : "totalOrderListAdm.html"
                , "index" : 3
                , "lnb":[   
                            {"title" : "전체주문조회", "href" : "totalOrderListAdm.html", "Lv0Index" : 3},
                            {"title" : "입금대기", "href" : "paymentWaitingAdm.html", "Lv0Index" : 3},
                            {"title" : "입금완료", "href" : "paymentCompleteAdm.html", "Lv0Index" : 3},
                            {"title" : "배송준비중", "href" : "deliveryReadyAdm.html", "Lv0Index" : 3},
                            {"title" : "배송중", "href" : "deliveryDoingAdm.html", "Lv0Index" : 3},
                            {"title" : "배송완료", "href" : "deliveryCompletedAdm.html", "Lv0Index" : 3},
                            {"title" : "주문취소/반품", "href" : "orderCancleAdm.html", "Lv0Index" : 3},
                            {"title" : "공급자결품률", "href" : "supplierOrderListAdm.html", "Lv0Index" : 3},
                            {"title" : "취소요청", "href" : "cancelRequestListAdm.html", "Lv0Index" : 3}
                        ]
            },
            {
                "title" : "정산관리"
                , "href" : "settlementManagementAdm.html"
                , "index" : 4
                , "lnb":[   
                            {"title" : "정산관리", "href" : "settlementManagementAdm.html", "Lv0Index" : 4},
                            {"title" : "공급자정산", "href" : "supplierSettlementAdm.html", "Lv0Index" : 4}
                        ]
            },
            {
                "title" : "통계"
                , "href" : ""
                , "index" : 5
                , "lnb":[   
                            {"title" : "매출 현황", "href" : "", "Lv0Index" : 5},
                            {"title" : "방문자 현황", "href" : "", "Lv0Index" : 5},
                            {"title" : "신규회원 현황", "href" : "", "Lv0Index" : 5},
                            {"title" : "판매순위", "href" : "", "Lv0Index" : 5},
                            {"title" : "검색어순위", "href" : "", "Lv0Index" : 5},
                            {"title" : "관심상품", "href" : "", "Lv0Index" : 5},
                            {"title" : "회원 포인트", "href" : "", "Lv0Index" : 5}
                        ]
            },
            {
                "title" : "사이트관리"
                , "href" : "popupListAdm.html"
                , "index" : 6
                , "lnb":[   
                            {"title" : "팝업관리", "href" : "popupListAdm.html", "Lv0Index" : 6},
                            {"title" : "도서산간 배송지역", "href" : "deliveryAreaListAdm.html", "Lv0Index" : 6},
                            {"title" : "직배송지역", "href" : "directDeliveryAreaListAdm.html", "Lv0Index" : 6},
                            {"title" : "공지사항 관리", "href" : "noticeListAdm.html", "Lv0Index" : 6},
                            {"title" : "자주묻는질문 관리", "href" : "FAQListAdm.html", "Lv0Index" : 6},
                            {"title" : "문의하기 관리", "href" : "QnAListAdm.html", "Lv0Index" : 6},
                        ]
            },
            {
                "title" : "기준관리"
                , "href" : "codeManageAdm.html"
                , "index" : 7
                , "lnb":[   
                            {"title" : "기준관리", "href" : "codeManageAdm.html", "Lv0Index" : 7}
                        ]
            }
        ]
    },
    {
        "GB" : "SUPER",
        "gnb":
        [ 
            {
                "title" : "상품관리"
                , "href" : "goodsCategorySuper.html"
                , "index" : 0
                , "lnb":[   
                            {"title" : "상품조회", "href" : "goodsCategorySuper.html", "Lv0Index" : 0},
                            {"title" : "상품등록", "href" : "addSalesItemSuper.html", "Lv0Index" : 0}
                        ]
            },
            {
                "title" : "주문관리"
                , "href" : "paymentCompleteSuper.html"
                , "index" : 1
                , "lnb":[   
                            {"title" : "입금완료", "href" : "paymentCompleteSuper.html", "Lv0Index" : 1},
                            {"title" : "배송준비중", "href" : "deliveryReadySuper.html", "Lv0Index" : 1},
                            {"title" : "배송중", "href" : "deliveryDoingSuper.html", "Lv0Index" : 1},
                            {"title" : "배송완료", "href" : "deliveryCompletedSuper.html", "Lv0Index" : 1},
                            {"title" : "전체주문내역", "href" : "totalOrderListSuper.html", "Lv0Index" : 1}
                        ]
            },
            {
                "title" : "정산관리"
                , "href" : "settlementManagementSuper.html"
                , "index" : 2
                , "lnb":[   
                            {"title" : "정산관리", "href" : "settlementManagementSuper.html", "Lv0Index" : 2}
                        ]
            }
        ]
    }
];

function getMenuListAjax(pHtmlName){
    var tmpJson;
    if(pHtmlName.indexOf('Adm') > -1){
        tmpJson = menuJson[0];
    }
    else {
        tmpJson = menuJson[1];
    }
    //ul tag
    var tmpTagUl;
    //li tag
    var tmpTagLi;
    //a tag
    var tmpTagA;
    //해당  lnb json
    var tmpLiJson;
    //lnb title
    var tmpTitle;

    //결과값 gnb 먼저 만들고
    for(var gx=0; gx<tmpJson.gnb.length;gx++){
        tmpTagLi = document.createElement("li");
        tmpTagA = document.createElement("a");
        tmpTagA.href = tmpJson.gnb[gx].href;
        tmpTagA.text = tmpJson.gnb[gx].title;
        tmpTagLi.appendChild(tmpTagA);
        document.getElementById("gnb").appendChild(tmpTagLi);

        //gnb 중에서 현재 호출된 화면이 포함된 lnb를 그림
        tmpLiJson = tmpJson.gnb[gx].lnb.filter(function(item, index, arr2){return item.href==pHtmlName});
        if(tmpLiJson.length > 0){
            tmpTitle = document.createElement("h2");
            tmpTitle.innerHTML = `<span>${tmpJson.gnb[gx].title}</span>`;
            document.getElementById("lnb").appendChild(tmpTitle);
            tmpTagUl = document.createElement("ul");
            for(var lx=0; lx<tmpJson.gnb[gx].lnb.length; lx++){
                tmpTagLi = document.createElement("li");
                tmpTagA = document.createElement("a");
                //현재 호출된 화면의 경우 on class 추가
                if(tmpJson.gnb[gx].lnb[lx].href == pHtmlName){
                    tmpTagLi.setAttribute("class", "on");
                }
                tmpTagA.href = tmpJson.gnb[gx].lnb[lx].href;
                tmpTagA.text = tmpJson.gnb[gx].lnb[lx].title;
                tmpTagLi.appendChild(tmpTagA);
                tmpTagUl.appendChild(tmpTagLi);
            }
            document.getElementById("lnb").appendChild(tmpTagUl);
        }
        else{
        }
    }
    getUserInfo();
};


function getUserInfo(){
    $.ajax({
        url: "/uGetUserInfoAdm?",  
        type: "POST", async: false,  
        data: "",
        dataType: "JSON", crossOrigin: false, cache: false,
        contentType: "application/json; charset=utf-8",
        success: function(response){
            // console.log("getUserInfo", response)
            if(response.errorcode == "PFERR_CONF_0000"){
                var txt= "";
                txt+=`<b>${response.returnvalue[0].NAME}</b> \n`;
                txt+=`&nbsp;&nbsp; \n`;
                txt+=`(${response.returnvalue[0].TITLE} : ${response.returnvalue[0].ID}) \n`;
                txt+=`&nbsp;&nbsp;&nbsp; \n`;
                txt+=`<a href="/uLogout"><img src="/resources/images/admin/btn_logout.gif" alt="로그아웃"></a> \n`;
                $(".logout").html(txt);
            }
            else if(response.errorcode == "PFERR_CONF_0059"){
                  location.href = response.returnpage;
                  alert(response.errormessage);
            };
        },
        error: function(xhr) {
            console.log("[error] : " + xhr);
        },
        complete:function(data ,textStatus) {
            console.log("[complete] : " + textStatus);
        }
    });
};