/****************************************************************************************************
module명: sDateFormat.js
creator: 안상현
date: 2021.11.29
version 1.0
설명: 본 모듈은 Platform내 날짜형식을 표준화하기 위한 변환 모듈이다. 따로 날짜 함수를 사용하지 말고
      이 모듈을 사용해야 하며, 형식 추가가 필요한 경우, 공통 자원 담당자 또는 표준화 담당자와 협의하여
      기능을 추가하되, 기존 기능을 수정하지 말고 method를 추가하면서 운영 할 것
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
var sDateFormat={
    sDateFormat_dateFormatChange: function(sDateFormat_date, sDateFormat_frmt)
    {
        //sDateFormat_date는 sDateFormat_date type, sDateFormat_frmt는 string
        if(sDateFormat_frmt=="YYYY-MM-DD HH:MM:SS")
        {
            let month = sDateFormat_date.getMonth() + 1;
            let day = sDateFormat_date.getDate();
            let hour = sDateFormat_date.getHours();
            let minute = sDateFormat_date.getMinutes();
            let second = sDateFormat_date.getSeconds();

            month = month >= 10 ? month : "0" + month;
            day = day >= 10 ? day : "0" + day;
            hour = hour >= 10 ? hour : "0" + hour;
            minute = minute >= 10 ? minute : "0" + minute;
            second = second >= 10 ? second : "0" + second;

            return (sDateFormat_date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second);
        }
        else if(sDateFormat_frmt=="YYYY-MM-DD")
        {
            let month = sDateFormat_date.getMonth() + 1;
            let day = sDateFormat_date.getDate();
            let hour = sDateFormat_date.getHours();
            let minute = sDateFormat_date.getMinutes();
            let second = sDateFormat_date.getSeconds();

            month = month >= 10 ? month : "0" + month;
            day = day >= 10 ? day : "0" + day;
            hour = hour >= 10 ? hour : "0" + hour;
            minute = minute >= 10 ? minute : "0" + minute;
            second = second >= 10 ? second : "0" + second;

            return (sDateFormat_date.getFullYear() + "-" + month + "-" + day);
        }
        else if(sDateFormat_frmt=="YYYYMMDD")
        {
            let month = sDateFormat_date.getMonth() + 1;
            let day = sDateFormat_date.getDate();
            let hour = sDateFormat_date.getHours();
            let minute = sDateFormat_date.getMinutes();
            let second = sDateFormat_date.getSeconds();

            month = month >= 10 ? month : "0" + month;
            day = day >= 10 ? day : "0" + day;
            hour = hour >= 10 ? hour : "0" + hour;
            minute = minute >= 10 ? minute : "0" + minute;
            second = second >= 10 ? second : "0" + second;

            return (sDateFormat_date.getFullYear() + month + day);
        }
        else if(sDateFormat_frmt=="HH:MM:SS")
        {
            let month = sDateFormat_date.getMonth() + 1;
            let day = sDateFormat_date.getDate();
            let hour = sDateFormat_date.getHours();
            let minute = sDateFormat_date.getMinutes();
            let second = sDateFormat_date.getSeconds();

            month = month >= 10 ? month : "0" + month;
            day = day >= 10 ? day : "0" + day;
            hour = hour >= 10 ? hour : "0" + hour;
            minute = minute >= 10 ? minute : "0" + minute;
            second = second >= 10 ? second : "0" + second;

            return (hour + ":" + minute + ":" + second);
        }
        else if(sDateFormat_frmt=="HHMMSS")
        {
            let month = sDateFormat_date.getMonth() + 1;
            let day = sDateFormat_date.getDate();
            let hour = sDateFormat_date.getHours();
            let minute = sDateFormat_date.getMinutes();
            let second = sDateFormat_date.getSeconds();

            month = month >= 10 ? month : "0" + month;
            day = day >= 10 ? day : "0" + day;
            hour = hour >= 10 ? hour : "0" + hour;
            minute = minute >= 10 ? minute : "0" + minute;
            second = second >= 10 ? second : "0" + second;

            return (hour + minute + second);
        }
        else if(sDateFormat_frmt=="GET_KOREAN")
        {
            return (sDateFormat_date.toString());
        }
        else if(sDateFormat_frmt=="GET_GMT")
        {
            return (sDateFormat_date.toGMTString());
        }
        else if(sDateFormat_frmt=="GET_UTC")
        {
            return (sDateFormat_date.toUTCString());
        }
        else if(sDateFormat_frmt=="GET_ISO")
        {
            return (sDateFormat_date.toISOString());
        }
        else if(sDateFormat_frmt=="GET_LOCALE")
        {
            return (sDateFormat_date.toLocaleString());
        }
        else if(sDateFormat_frmt=="YYYYMMDDHHMMSS")
        {
            let month = sDateFormat_date.getMonth() + 1;
            let day = sDateFormat_date.getDate();
            let hour = sDateFormat_date.getHours();
            let minute = sDateFormat_date.getMinutes();
            let second = sDateFormat_date.getSeconds();

            month = month >= 10 ? month : "0" + month;
            day = day >= 10 ? day : "0" + day;
            hour = hour >= 10 ? hour : "0" + hour;
            minute = minute >= 10 ? minute : "0" + minute;
            second = second >= 10 ? second : "0" + second;

            return (sDateFormat_date.getFullYear() + month + day + hour + minute + second);
        }
        else
        {
            return "";
        }
    }
};

module.exports=sDateFormat;

