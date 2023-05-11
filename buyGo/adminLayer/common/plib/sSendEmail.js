/****************************************************************************************************
module명: sSendEmail.js
creator: 안상현
date: 2022.9.15
version 1.0
설명: email 발송 곻통모듈
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
let jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM();
const {document} = (new JSDOM("")).window;
//let $ = jQuery = require("jquery")(window);

var sSendEmail={
    sendEmail: async function(userId, tmpMessage)
    {
        let appmsg=require("./sapplicatioErrorMessage.json");
        const nodemailer=require('nodemailer');
        const sysEmail=require("./sEmailSysInfo");
        
        try
        {
            let transporter=nodemailer.createTransport({
                service: sysEmail.emailService,
                host: sysEmail.emailHost,
                port: sysEmail.emailPort,
                secure: false,
                requireTLS: true,
                auth: {
                    user: sysEmail.emailSysId,
                    pass: sysEmail.emailPassword,
                },
            });
            
            let info = await transporter.sendMail({
                //보낼 곳의 이름, 메일 주소
                //from: `"WDMA Team" <${process.env.NODEMAILER_USER}>`,
                from: sysEmail.emailSysId,
                //받는 곳의 메일 주소
                to: userId,
                //보낼 메일 제목
                subject: "SAJAGO.shop platform 회원 가입 메일 인증 코드 발송 안내입니다.",
                //보낼 메일 내용
                //text:일반 text
                //html:html 내용
                text: tmpMessage,
                //html: `<b>${tmpMessage}</b>`,
                html: "<p>"+tmpMessage+"</p>",
            });

            return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":"OK"};
        }
        catch(e)
        {
            return {"errorcode":appmsg[34].messageCode, "errormessage":appmsg[34].messageText, "returnvalue":e.response};
        };
    }
};

module.exports=sSendEmail;