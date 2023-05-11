/****************************************************************************************************
module명: sCheckPasswordPattern.js
creator: 안상현
date: 2021.11.29
version 1.0
설명: 본 모듈은 Client 사용자 회원 가입시 Password설정에 대한 규약을 안내하고, 안내대로 만들었는지를
      검사하는 모듈로 ajax통신을 통해서 응답을 내려 준다. (JSON Return)
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
var sCheckPasswordPattern={
    checkLevel1: function(sCheckPasswordPattern_pw)
    {
        //영문(대소문자) 포함
        //숫자 포함
        //특수 문자 포함
        //공백 X
        //비밀번호 자리 8~20자
        var num = sCheckPasswordPattern_pw.search(/[0-9]/g);
        var eng = sCheckPasswordPattern_pw.search(/[a-z]/ig);
        var spe = sCheckPasswordPattern_pw.search(/[`~!@@#$%^&*|₩₩₩"₩";:₩/?]/gi);

        if(sCheckPasswordPattern_pw.length < 8 || sCheckPasswordPattern_pw.length > 20)
        {
            //console.log("8자리 ~ 20자리 이내로 입력해주세요.");
            return {"p1":"false", "p2":"8자리 ~ 20자리 이내로 입력해주세요."};
        }
        else if(sCheckPasswordPattern_pw.search(/\s/) != -1)
        {
            //console.log("비밀번호는 공백 없이 입력해주세요.");
            return {"p1":"false", "p2":"비밀번호는 공백 없이 입력해주세요."};
        }
        else if(num < 0 || eng < 0 || spe < 0 )
        {
            //console.log("영문,숫자, 특수문자를 혼합하여 입력해주세요.");
            return {"p1":"false", "p2":"영문,숫자, 특수문자를 혼합하여 입력해주세요."};
        }
        else
        {
            //console.log("통과"); 
            return {"p1":"true", "p2":""};
        };
    },
    checkLevel2: function(ssn_id, sCheckPasswordPattern_pw)
    {
        //영문,숫자,특수문자 중 2가지 혼합 (영문,숫자 = 통과) (특문,숫자 = 통과)
        //비밀번호 10~20자리
        var num = sCheckPasswordPattern_pw.search(/[0-9]/g);
        var eng = sCheckPasswordPattern_pw.search(/[a-z]/ig);
        var spe = sCheckPasswordPattern_pw.search(/[`~!@@#$%^&*|₩₩₩"₩";:₩/?]/gi);

        if(sCheckPasswordPattern_pw.length < 6 || sCheckPasswordPattern_pw.length > 20)
        {
            //console.log("10자리 ~ 20자리 이내로 입력해주세요.");
            return {"p1":"false", "p2":"6자리 ~ 20자리 이내로 입력해주세요."};
        }
        else if(sCheckPasswordPattern_pw.search(/\s/) != -1)
        {
            //console.log("비밀번호는 공백 없이 입력해주세요.");
            return {"p1":"false", "p2":"비밀번호는 공백 없이 입력해주세요."};
        }
        else if( (num < 0 && eng < 0) || (eng < 0 && spe < 0) || (spe < 0 && num < 0) )
        {
            //console.log("영문,숫자, 특수문자 중 2가지 이상을 혼합하여 입력해주세요.");
            return {"p1":"false", "p2":"영문,숫자, 특수문자 중 2가지 이상을 혼합하여 입력해주세요."};
        }
        else
        {
            //console.log("통과");
            return {"p1":"true", "p2":""};
        };

    },
    checkLevel3: function(sCheckPasswordPattern_pw)
    {
        //비밀번호 8자리 이상
        //숫자 포함
        //영대 문자 포함
        //영소 문자 포함
        //특수문자 포함
        var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

        if(false === reg.test(sCheckPasswordPattern_pw))
        {
            //console.log("비밀번호는 8자 이상이어야 하며, 숫자/대문자/소문자/특수문자를 모두 포함해야 합니다.");
            return {"p1":"false", "p2":"비밀번호는 8자 이상이어야 하며, 숫자/대문자/소문자/특수문자를 모두 포함해야 합니다."};
        }
        else
        {
            //console.log("통과");
            return {"p1":"true", "p2":""};
        };

    },
    checkLevel4: function(id, sCheckPasswordPattern_pw)
    {
        //비밀번호 8자리 이상
        //숫자 포함
        //영대 문자 포함
        //영소 문자 포함
        //특수문자 포함
	    var checkNumber = sCheckPasswordPattern_pw.search(/[0-9]/g);
	    var checkEnglish = sCheckPasswordPattern_pw.search(/[a-z]/ig);

        if(!/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/.test(sCheckPasswordPattern_pw))
        {            
	        //console.log("숫자+영문자+특수문자 조합으로 8자리 이상 사용해야 합니다.");
	        return {"p1":"false", "p2":"숫자+영문자+특수문자 조합으로 8자리 이상 사용해야 합니다."};
	    }
        else if(checkNumber <0 || checkEnglish <0)
        {
	        //console.log("숫자와 영문자를 혼용하여야 합니다.");
	        return {"p1":"false", "p2":"숫자와 영문자를 혼용하여야 합니다."};
	    }
        else if(/(\w)\1\1\1/.test(sCheckPasswordPattern_pw))
        {
	        //console.log("같은 문자를 4번 이상 사용하실 수 없습니다.");
	        return {"p1":"false", "p2":"같은 문자를 4번 이상 사용하실 수 없습니다."};
	    }
        else if(sCheckPasswordPattern_pw.search(id) > -1)
        {
	        //console.log("비밀번호에 아이디가 포함되었습니다.");
	        return {"p1":"false", "p2":"비밀번호에 아이디가 포함되었습니다."};
	    }
        else
        {
            //console.log("통과");
            return {"p1":"true", "p2":""};
		};

    },
    checkLevel5: function(id, sCheckPasswordPattern_pw)
    {
        //비밀번호 8자리 이상
        //숫자 포함
        //영대 문자 포함
        //영소 문자 포함
        //특수문자 포함
        var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
	    var hangulcheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

        if(false === reg.test(sCheckPasswordPattern_pw))
        {
            //console.log("비밀번호는 8자 이상이어야 하며, 숫자/대문자/소문자/특수문자를 모두 포함해야 합니다.");
            return {"p1":"false", "p2":"비밀번호는 8자 이상이어야 하며, 숫자/대문자/소문자/특수문자를 모두 포함해야 합니다."};
        }
        else if(/(\w)\1\1\1/.test(sCheckPasswordPattern_pw))
        {
            //console.log("같은 문자를 4번 이상 사용하실 수 없습니다.");
            return {"p1":"false", "p2":"같은 문자를 4번 이상 사용하실 수 없습니다."};
        }
        else if(sCheckPasswordPattern_pw.search(id) > -1)
        {
            //console.log("비밀번호에 아이디가 포함되었습니다.");
            return {"p1":"false", "p2":"비밀번호에 아이디가 포함되었습니다."};
        }
        else if(sCheckPasswordPattern_pw.search(/\s/) != -1)
        {
            //console.log("비밀번호는 공백 없이 입력해주세요.");
            return {"p1":"false", "p2":"비밀번호는 공백 없이 입력해주세요."};
        }
        else if(hangulcheck.test(sCheckPasswordPattern_pw))
        {
            //console.log("비밀번호에 한글을 사용 할 수 없습니다."); 
            return {"p1":"false", "p2":"비밀번호에 한글을 사용 할 수 없습니다."};
        }
        else
        {
            //console.log("통과");
            return {"p1":"true", "p2":""};
        };

    },
    
};

module.exports=sCheckPasswordPattern;

