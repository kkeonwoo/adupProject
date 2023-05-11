/****************************************************************************************************
module명: sCheckUIAuthByRole.js
creator: 안상현
date: 2022.9.2
version 1.0
설명: 화면 사용자 계정에 따른 권한이 있는지를 Check
***************** 아래는 공통 주석 사항임 (모든 프로그램 주석에 필수)**********************************
기타 본 SW자산은 Plaform 제작사 소유로 소스의 무단복제, 재배포, 사유화를 금지함. 이에 대해서는 
정보보안서약을 반드시 준수하고 위반시 민.형사상 책임을 져야 함 (보안에 각별히 유의할 것)
또한 Open소스를 무단으로 사용하면 안됨 (MIT, Apcahe License여도 IT책임자에게 보고 하고 사용유무에
대해서는 관련 기관의 유권해석을 받아야 함)

본 자산은 (주)더이음의 자산임 Copyrights (c) All rights reserved.
****************************************************************************************************
----------------------------------------------수정이력----------------------------------------------
2022.03.16    윤희상    adminPage에서 Menu가 권한에 따라 다르기 때문에 권한 정보도 같이 내려주도록 수정
****************************************************************************************************/
"use strict";
var sCheckUIAuthByRole={
    checkUIAuthByUserRole: async function(tmpLocalBizCompCode, userId, tmpFileName, tokenMembership, pMyRole)
    {
        let appmsg=require("./sapplicatioErrorMessage.json");

        //user정보를 읽어온다. - auth Check가 아니고 user info를 읽어온다.
        const userInfo=require("./sGetUserEnvInfo");
        //const sysmode=require("./sPlatformMode.json"); 
        const myDBInfo=await userInfo.getDBEnvInfo(tmpLocalBizCompCode, userId, pMyRole);

        if(myDBInfo.errorcode=="PFERR_CONF_0000")
        {
            const tmpMyDBInfo=myDBInfo.returnvalue;
            const cu=require("./sCheckUserStatus");
            const sKey=require("./sKey");
            const accInfo=await cu.getUserInfo(sKey, myDBInfo.returnvalue.database, tmpLocalBizCompCode, tmpMyDBInfo, userId, pMyRole); 

            if(accInfo.errorcode=="PFERR_CONF_0000")
            {
                //파일명으로 권한 설정된 정보를 취득한다.
                let tmpStr=   "SELECT UI_B2B_USE_YN \n";
                tmpStr=tmpStr+"     , UI_B2B_RO_RW \n";
                tmpStr=tmpStr+"     , UI_B2C_USE_YN \n";
                tmpStr=tmpStr+"     , UI_B2C_RO_RW \n";
                tmpStr=tmpStr+"     , UI_ADMIN_USE_YN \n";
                tmpStr=tmpStr+"     , UI_ADMIN_RO_RW \n";
                tmpStr=tmpStr+"     , UI_SUPER_USE_YN \n";
                tmpStr=tmpStr+"     , UI_SUPER_RO_RW \n";
                tmpStr=tmpStr+"     , UI_NORMAL_USE_YN \n";
                tmpStr=tmpStr+"     , UI_NORMAL_RO_RW \n";
                tmpStr=tmpStr+"     , DEPARTMENT_CODE \n";
                tmpStr=tmpStr+"  FROM "+myDBInfo.returnvalue.database+".TB_S00_UI_AUTH_BY_ROLE \n";
                tmpStr=tmpStr+" WHERE 1=1 \n";
                tmpStr=tmpStr+"   AND LOCAL_BIZ_COMP_CODE = ? \n";
                tmpStr=tmpStr+"   AND UI_FILE_NAME = ? \n"; //varchar binary가 아니므로 대소문자를 구분하지 않는다는 점을 유의할 것

                let tdev ={
                    host     : myDBInfo.returnvalue.host,
                    user     : myDBInfo.returnvalue.dbrouser,    //여기서는 RO
                    password : myDBInfo.returnvalue.dbropassword,
                    database : myDBInfo.returnvalue.database,
                    port     : myDBInfo.returnvalue.port,
                    connectionLimit: myDBInfo.returnvalue.connectionLimit,
                    multipleStatements: myDBInfo.returnvalue.multipleStatements
                };
                
                try
                {
                    let sLogin_mydao=require("./sDbCommonDaoForCompanyAreaUPD");
                    let getRoleInfo=await sLogin_mydao.sqlHandlerForCompanyUPD(tmpLocalBizCompCode,"RO",tdev,tmpStr,[tmpLocalBizCompCode,tmpFileName])
                    .then((rows)=>{
                        if(rows.length==1)
                        {
                            let fileAuthInfo={
                                "uiB2bUseYn"        :rows[0].UI_B2B_USE_YN,
                                "uiB2bRoRw"         :rows[0].UI_B2B_RO_RW,
                                "uiB2cUseYn"        :rows[0].UI_B2C_USE_YN,
                                "uiB2cRoRw"         :rows[0].UI_B2C_RO_RW,
                                "uiAdminUseYn"      :rows[0].UI_ADMIN_USE_YN,
                                "uiAdminRoRw"       :rows[0].UI_ADMIN_RO_RW,
                                "uiSuperUseYn"      :rows[0].UI_SUPER_USE_YN,
                                "uiSuperRoRw"       :rows[0].UI_SUPER_RO_RW,
                                "uiNormalUseYn"     :rows[0].UI_NORMAL_USE_YN,
                                "uiNormalRoRw"      :rows[0].UI_NORMAL_RO_RW,
                                "uiDepartmentCode"  :rows[0].DEPARTMENT_CODE
                            };

                            return {"errorcode":appmsg[3].messageCode, "errormessage":appmsg[3].messageText, "returnvalue":fileAuthInfo};
                        }
                        else
                        {
                            //사용자 권한 구성정보 없거나 비정상임, 권한이 필요없는 화면의 경우 A로 return
                            return {"errorcode":appmsg[29].messageCode, "errormessage":appmsg[29].messageText, "returnvalue":""};
                        };
                    });

                    if(getRoleInfo.errorcode=="PFERR_CONF_0000") 
                    {
                        //accInfo 와 getRoleInfo를 검사하여 권한이 어떤 상태인지를 판단한다.
                        if(accInfo.returnvalue.accountType=="B2B")
                        {
                            if(getRoleInfo.returnvalue.uiB2bUseYn=="Y")
                            {
                                //admin / super / normal과 부서 code를 조사한다.
                                //2022.03.03 윤희상 admin의 LV이 DB에서는 나눠질것이기 때문에
                                if((accInfo.returnvalue.accountRole).substring(0,5)=="ADMIN")
                                {
                                    if(getRoleInfo.returnvalue.uiAdminUseYn=="Y")
                                    {
                                        //정상이기는 한데 RO, RW를 식별해서 반환해 준다. return은 정상을 주된 RO, RW를 반환한다. 나중에 return Value를 보고 화면에서 어떻게 통제할지를 결정하면 된다.
                                        return {"errorcode": appmsg[3].messageCode, "errormessage": appmsg[3].messageText, "returnvalue" : getRoleInfo.returnvalue.uiAdminRoRw, "returnAuth": accInfo.returnvalue.accountRole};
                                    }
                                    else
                                    {
                                        return {"errorcode": appmsg[28].messageCode, "errormessage": appmsg[28].messageText, "returnvalue" : ""};
                                    }
                                }
                                //2022.03.03 윤희상 admin의 LV이 DB에서는 나눠질것이기 때문에
                                //SUPER : 공급사 SCM의 의미임
                                else if((accInfo.returnvalue.accountRole).substr(0,5)=="SUPER")
                                {
                                    if(getRoleInfo.returnvalue.uiSuperUseYn=="Y")
                                    {
                                        //부서코드를 Check한다. like pattern으로 한다.
                                        if(getRoleInfo.returnvalue.uiDepartmentCode=="ALL")
                                        {
                                            //정상이기는 한데 RO, RW를 식별해서 반환해 준다. return은 정상을 주된 RO, RW를 반환한다. 나중에 return Value를 보고 화면에서 어떻게 통제할지를 결정하면 된다.
                                            return {"errorcode": appmsg[3].messageCode, "errormessage": appmsg[3].messageText, "returnvalue" : getRoleInfo.returnvalue.uiSuperRoRw, "returnAuth": accInfo.returnvalue.accountRole};
                                        }
                                        else
                                        {
                                            if(accInfo.returnvalue.deparmentCode == "ALL"){
                                                return {"errorcode": appmsg[3].messageCode, "errormessage": appmsg[3].messageText, "returnvalue" : getRoleInfo.returnvalue.uiSuperRoRw, "returnAuth": accInfo.returnvalue.accountRole};
                                            }
                                            else{
                                                //부서코드 권한이 있는가를 본다.
                                                if(getRoleInfo.returnvalue.uiDepartmentCode.indexOf(accInfo.returnvalue.deparmentCode)>-1)
                                                {
                                                    return {"errorcode": appmsg[3].messageCode, "errormessage": appmsg[3].messageText, "returnvalue" : getRoleInfo.returnvalue.uiSuperRoRw, "returnAuth": accInfo.returnvalue.accountRole};
                                                }
                                                else
                                                {
                                                    return {"errorcode": appmsg[28].messageCode, "errormessage": appmsg[28].messageText, "returnvalue" : ""};
                                                };
                                            };
                                        };
                                    }
                                    else
                                    {
                                        return {"errorcode": appmsg[28].messageCode, "errormessage": appmsg[28].messageText, "returnvalue" : ""};
                                    };
                                }
                                else if(accInfo.returnvalue.accountRole=="BUY")
                                {
                                    if(getRoleInfo.returnvalue.uiNormalUseYn=="Y")
                                    {
                                        //부서코드를 Check한다. like pattern으로 한다.
                                        if(getRoleInfo.returnvalue.uiDepartmentCode=="ALL")
                                        {
                                            //정상이기는 한데 RO, RW를 식별해서 반환해 준다. return은 정상을 주된 RO, RW를 반환한다. 나중에 return Value를 보고 화면에서 어떻게 통제할지를 결정하면 된다.
                                            return {"errorcode": appmsg[3].messageCode, "errormessage": appmsg[3].messageText, "returnvalue" : getRoleInfo.returnvalue.uiNormalRoRw, "returnAuth": accInfo.returnvalue.accountRole};
                                        }
                                        else
                                        {
                                            //부서코드 권한이 있는가를 본다.
                                            if(getRoleInfo.returnvalue.uiDepartmentCode==accInfo.returnvalue.deparmentCode)
                                            {
                                                return {"errorcode": appmsg[3].messageCode, "errormessage": appmsg[3].messageText, "returnvalue" : getRoleInfo.returnvalue.uiNormalRoRw, "returnAuth": accInfo.returnvalue.accountRole};
                                            }
                                            else
                                            {
                                                return {"errorcode": appmsg[28].messageCode, "errormessage": appmsg[28].messageText, "returnvalue" : ""};
                                            };
                                        };
                                    }
                                    else
                                    {
                                        return {"errorcode": appmsg[28].messageCode, "errormessage": appmsg[28].messageText, "returnvalue" : ""};
                                    };
                                }
                                else
                                {
                                    return {"errorcode": appmsg[28].messageCode, "errormessage": appmsg[28].messageText, "returnvalue" : ""};
                                };
                            }
                            else
                            {
                                return {"errorcode": appmsg[28].messageCode, "errormessage": appmsg[28].messageText, "returnvalue" : ""}; /*권한 없음*/
                            };
                        }
                        else if(accInfo.returnvalue.accountType=="B2C")
                        {
                            if(getRoleInfo.returnvalue.uiB2cUseYn=="Y")
                            {
                                //정상이기는 한데 RO, RW를 식별해서 반환해 준다. return은 정상을 주된 RO, RW를 반환한다. 나중에 return Value를 보고 화면에서 어떻게 통제할지를 결정하면 된다.
                                return {"errorcode": appmsg[3].messageCode, "errormessage": appmsg[3].messageText, "returnvalue" : getRoleInfo.returnvalue.uiB2cRoRw, "returnAuth": accInfo.returnvalue.accountRole};
                            }
                            else
                            {
                                return {"errorcode": appmsg[28].messageCode, "errormessage": appmsg[28].messageText, "returnvalue" : ""}; /*권한 없음*/
                            };
                        };

                        //여기까지 오는 Case는 무조건 Error가 된다.
                        return {"errorcode": appmsg[29].messageCode, "errormessage": appmsg[29].messageText, "returnvalue" : ""};
                    }
                    else
                    {
                        return getRoleInfo; //error정보는 그냥 전달하면 된다.
                    };
                }
                catch(e)
                {
                    return {"errorcode": appmsg[81].messageCode, "errormessage": appmsg[81].messageText, "returnvalue" : ""};
                };
                //-------------------------------------
            }
            else
            {
                //check error (권한을 판단 할 수 없으므로 Error)
                return {"errorcode": appmsg[29].messageCode, "errormessage": appmsg[29].messageText, "returnvalue" : ""};
            };
        }
        else
        {
            //사용자 정보 취득 실패이므로 오류를 반환한다.
            return {"errorcode": appmsg[25].messageCode, "errormessage": appmsg[25].messageText, "returnvalue" : ""};
        };
    }
};

module.exports=sCheckUIAuthByRole;