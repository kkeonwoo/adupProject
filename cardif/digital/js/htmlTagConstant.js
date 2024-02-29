String.prototype.format = function () {
    let thisVal = this.toString();
    let args = arguments[0];
    if (!args) {
        return thisVal;
    }
    Object.keys(args).forEach(function (e, i) {
        thisVal = thisVal.split('{' + e + '}').join(Util.isNull(args[e]) ? '' : args[e]);
    })

    return thisVal.replace(/{\w+}/ig, '');
}

/* 필요한 HTML Tag를 추가하시고 공지해주세요 */
var htmlTag = {
    DIV_SELECT : ''
        + '<div class="{divCls}">'
        +   '<select name="{selectCls}" id="{selectId}">'
        +   '</select>'
        + '</div>'

    , OPTION: '<option value="{optVal}" {selected}>{label}</option>'
    , INPUT_BASIC: '<input type="{type}" class="{cls}" id="{id}" name="{name}" value="{val}">'
    , INPUT_DATE: '<input type="date" class="{cls}" id="{id}" value="{val}">'
    , INPUT_HIDDEN: '<input type="hidden" class="{cls}" id="{id}" value="{val}">'

    , DIV_TABLE: ''
        + '<div class="{divCls}" id="{divId}">'
        +   '<table cellpadding="0" cellspacing="0" border="0" class="{tblCls}" id="{tblId}">'
        +   '</table>'
        + '</div>'
}


