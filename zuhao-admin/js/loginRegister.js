/**
 * Created by ching on 2017/11/5.
 */
$(function () {
    inputBlurFocusTest('#user_name',[{isShow:testEmpty,errText:'用户名不能为空'},{isShow:testUserNameRegular,errText:'用户名要以字母开头且长度为6-16'}]);
    inputBlurFocusTest('#user_pwd',[{isShow:testEmpty,errText:'密码不能为空'},{isShow:testPwdRegular,errText:'密码须含数字、字母、标点符号中的两者以上'},{isShow:testPwdLength,errText:'密码长度为6-16个字符'}]);
    inputBlurFocusTest('#phone',[{isShow:testEmpty,errText:'手机号码不能为空'},{isShow:testPhoneRegular,errText:'手机号格式有误'}]);
    inputBlurFocusTest('#user_repeat_pwd',[{isShow:testEmpty,errText:'密码不能为空'},{isShow:testTwoPwd,errText:'两次密码不一样'}]);
    inputBlurFocusTest('#phoneCode',[{isShow:testEmpty,errText:'手机验证码不能为空'},{isShow:testPhoneCodeRegular,errText:'手机验证码为6位数字'}]);
    inputBlurFocusTest('#shopName',[{isShow:testEmpty,errText:'店铺名不能为空'},{isShow:testShopNameLength,errText:'店铺名不得超过12字'}]);
    inputBlurFocusTest('#payPwd',[{isShow:testEmpty,errText:'支付密码不能为空'},{isShow:testPhoneCodeRegular,errText:'支付密码为6位数字'}]);
    inputBlurFocusTest('#imgCode',[{isShow:testEmpty,errText:'图片验证码不能为空'},{isShow:testImgCodeRegular,errText:'图片验证码为4位数字'}]);
});
function showInputError(id,msg) {
    id.append('<div class="error-box"><i class="imgfont img-mistake"></i>'+msg+'</div>')
}
function hideInputError(id) {
    id.remove()
}
function testEmpty(val) {
    if(val == '') return true;
    else return false;
}
function testUserNameRegular(val) {
    if(!/^[a-zA-Z][0-9a-zA-Z]{5,15}$/.test(val) && val != '') return true;
    else return false;
}
function testPwdRegular(val) {
    var psw=val;
    var pswCharRegx = new RegExp("[a-zA-Z]{"+ psw.length +"}");
    var pswNumRegx = new RegExp('[0-9]{'+ psw.length +'}');
    var pswPuncRegx = new RegExp('[-`=\\;\',./~!@#$%^&*()_+|{}:"<>?]{' + psw.length + '}');
    if ((pswCharRegx.test(psw) || pswPuncRegx.test(psw) || pswNumRegx.test(psw)) && psw.length <= 16 && psw.length >= 6 ){
        return true;
    }else{
        return false;
    }

}
function testPwdLength(val){
    if(val.length > 16 || val.length < 6 && val != ''){
        return true;
    }else {
        return false;
    }
}
function testPhoneRegular(val) {
    if(!/^(13|14|15|17|18|19)\d{9}$/.test(val)  && val != '') return true;
    else return false;
}
function testTwoPwd(val){
    if(val != $('#user_pwd').val() && $('#user_pwd').val() != '' && val != '') return true;
    else return false;
}
function testPhoneCodeRegular(val){
    if(!/^[0-9]{6}$/.test(val)  && val != '') return true;
    else return false;
}
function testShopNameLength(val){
    if(val.length > 12  && val != ''){
        return true;
    }else {
        return false;
    }
}
function testImgCodeRegular(val) {
    if(!/^[0-9]{4}$/.test(val)  && val != '') return true;
    else return false;
}

function inputBlurFocusTest(id,option){
    $(document).on('blur',id,function () {
        var value=$(this).val();
        $.each(option,function (index, val) {
            if(val.isShow(value)){
                showInputError($(id).parent(),val.errText)
            }
        });
        judgeBanButton();
    });
    $(document).on('focus',id,function () {
        hideInputError($(id).siblings('.error-box'));
        hideInputError($('#errorBox>.error-box'));
    });
    $(document).on('keyup',id,function () {
        hideInputError($(id).siblings('.error-box'));
        hideInputError($('#errorBox>.error-box'));
        judgeBanButton();
    })
}
function judgeBanButton(){
    var a=1;
    $.each($('.form-content input:not(".preAutoFill")'),function (index, val) {
        if($(val).val() == '') a=0;
        if($(val).siblings('.error-box').length !== 0) a=0;
    });
    if(a === 1) $('button.event').removeClass('banClick');
    else $('button.event').addClass('banClick');
}