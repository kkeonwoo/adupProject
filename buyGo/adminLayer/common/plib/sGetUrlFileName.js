/****************************************************************************************************
module명: sGetUrlFileName.js
creator: 안상현
date: 2022.9.2
version 1.0
설명: 요청된 url에서 파일이름 또는 folder이름을 구할때 사용한다.
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************/
"use strict";
var sGetUrlFileName={
    getFileName: function(fullePathName)
    {
        if(fullePathName.length<1)
        {
            return "";
        }
        else
        {
            //20220802 internet explorer 는 뒤에 #이 붙는 경우가 있으니 제거한다.
            fullePathName=fullePathName.replace("#none","");
            fullePathName=fullePathName.replace("#","");
            let pt=fullePathName.lastIndexOf("/");
            if(pt>-1){
                let tmpFileName=fullePathName.substr(pt+1,fullePathName.length-pt-1); 
                //20220629 윤희상 Get방식으로 넘어오는 경우엔 파라미터가 뒤에 붙기때문에 잘라야함.
                if(tmpFileName.indexOf("?")>-1)tmpFileName = tmpFileName.split("?")[0];
                return tmpFileName;
            }
            else{return "";}
        };
    },
    getFolderName: function(reqRef, reqUrl, reqProtocol, reqHost)
    {
        //parameter는 아래 객체 속성을 참고만 하세요
        // console.log("request.headers.referer-->"+request.headers.referer);
        // console.log("request.url-->"+request.url);
        // console.log("request.headers.host-->"+request.headers.host);
        // console.log("request.protocol-->"+request.protocol);
        // console.log("dirname-->"+__dirname);

        //console.log("1111 request.headers.referer-->"+reqRef);
        //console.log("2222 request.url-->"+reqUrl);

        let fullpath=""; let tmp=""; let folderName="";
        //console.log("sGetUrlFileName fillpath="+fullpath);
        if(typeof(reqRef)=="string")
        {
            // //www.theeummall.com 으로 포워딩 된 경우는 예외적으로 eum으로 반환
            // if(reqRef.indexOf("www.theeummall.com")>-1)
            // {
            //     return "eum";
            // };

            if(reqRef.length<1)
            {
                fullpath=reqUrl;
            }
            else
            {
                fullpath=reqRef;
            }
        }
        else
        {
            if(reqRef===undefined||reqRef===null)
            {
                //최초 접속이고 ajax가 아니라면 referer가 null 또는 undefined일 수 있다. 이때는 url을 사용한다.
                fullpath=reqUrl;
            }
            else
            {
                fullpath=reqRef;
            };
        };
        
        //fullpath에 http://domain이 없는 경우
        if(fullpath.indexOf("http")<0)
        {
            //http 문장이 없는 url인 경우
            let fullpathArr = fullpath.split("/");
            if(fullpathArr.length>1){
                folderName=fullpathArr[1];
            }
            //2022.03.17 윤희상 기존 로직 주석
            // let st=fullpath.indexOf("/");
            // let ed=fullpath.lastIndexOf("/");
            // //console.log("sGetUrlFileName fillpath st="+st+" /ed="+ed);
            // if(st!=ed)
            // {
            //     folderName=fullpath.substr(st+1, ed-1);
            // };
        }
        else
        {
            //https로 redirection된 경우는 referer에는 http로만 오므로 주의해야 한다.
            //20220802 안상현 폴더명을 너무 멍청하게 내가 구한 것 같다. http:// 또는 https://가 있으므로 그것을 replace처리 하고
            //그다음에 나타나는 첫번째 /와 두번째 / 또는 마지막일 경우 잘라서 폴더를 구해준다.
            //reverse proxy 설정에 따라 KICC NOTI가 분리 되면서 reqHost 에 http://localhost:3721/ 이렇게 들어가기 때문에 
            //자칫 원하는대로 구해지지 않아서 folder명을 못 구하면서 로그인 버튼이 먹통 (disable시키기 때문)이 되거나, 로그인 유지가
            //안되고 튕겨나가는 문제가 발생하였다. (폴더명은 계속 구한다. 그러다가 request.headers.referer가 http://localhost:3721/ 이
            //되는 경우 에러가 나는 것이 원인이었다. 아래 소스는 주석처리하고 그 아래에 새로이 넣는다.)

            // if(fullpath.substr(0,5)=="https"){tmp=reqProtocol+"s"+"://"+reqHost+"/";}else{tmp=reqProtocol+"://"+reqHost+"/";};
            // fullpath=fullpath.replace(tmp,""); let pt=fullpath.indexOf("/");
            // if(pt>-1)
            // {
            //     folderName=fullpath.substr(0,pt);
            // };

            //2022-08-02 안상현 새로 로직을 넣는다. (https rewrite했을 때는 이런일이 없었는데...)
            tmp = fullpath.replace("http://","");
            let tmp2 = tmp.replace("https://",""); //만일 http로 안지워 지면 https로 한번 더 지원 버린다.
            
            //첫번째 / 위치 오른쪽을 취한다. - 반드시 1개는 있으므로...
            let tmp3 = tmp2.split("/")[1];

            //우측에 /가 있는 경우
            if(tmp3.indexOf("/")>-1)
            {
                //우측 앞까지가 폴더다.
                folderName = tmp3.split("/")[0];
            }
            else
            {
                //끝에 아무것도 없이 자기가 마지막이므로 자기를 반환한다.
                folderName = tmp3;
            };
        };

        return folderName;
    },
    getFolderPath: function(reqRef, reqUrl, reqProtocol, reqHost)
    {
        /* parameter는 아래 객체 속성을 참고만 하세요
        console.log("request.headers.referer-->"+request.headers.referer);
        console.log("request.url-->"+request.url);
        console.log("request.headers.host-->"+request.headers.host);
        console.log("request.protocol-->"+request.protocol);
        console.log("dirname-->"+__dirname);
        */ 

        let fullpath=""; let tmp=""; let folderPath="";
        //console.log("sGetUrlFileName fillpath="+fullpath);
        if(typeof(reqRef)=="string")
        {
            if(reqRef.length<1)
            {
                fullpath=reqUrl;
            }
            else
            {
                fullpath=reqRef;
            }
        }
        else
        {
            if(reqRef===undefined||reqRef===null)
            {
                //최초 접속이고 ajax가 아니라면 referer가 null 또는 undefined일 수 있다. 이때는 url을 사용한다.
                fullpath=reqUrl;
            }
            else
            {
                fullpath=reqRef;
            };
        };
        
        //fullpath에 http://domain이 없는 경우
        if(fullpath.indexOf("http")<0)
        {
            //http 문장이 없는 url인 경우
            let st=fullpath.indexOf("/");
            let ed=fullpath.lastIndexOf("/");
            //console.log("sGetUrlFileName fillpath st="+st+" /ed="+ed);
            if(st!=ed)
            {
                folderPath=fullpath.substr(st+1, ed-1);
            };
        }
        else
        {
            //https로 redirection된 경우는 referer에는 http로만 오므로 주의해야 한다.
            //if(fullpath.substr(0,5)=="https"){tmp=reqProtocol+"s"+"://"+reqHost+"/";}else{tmp=reqProtocol+"://"+reqHost+"/";};
            if(fullpath.substring(0,5)=="https"){tmp=reqProtocol+"s"+"://"+reqHost+"/";}else{tmp=reqProtocol+"://"+reqHost+"/";};
            fullpath=fullpath.replace(tmp,"");
            let pt=fullpath.indexOf("/");
            if(pt>-1)
            {
                //folderPath=fullpath.substr(0,pt);
                folderPath=fullpath.substring(0,pt);
            };
        };

        return folderPath;
    }
};

module.exports=sGetUrlFileName;

