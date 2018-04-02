/**
 * Created by ching on 2017/10/30.
 */
$(function(){
    //密码框
    $('#sixDig2').sixDig();
    //密码框
    $('#sixDig3').sixDig();

    //手机号码--通用
    setVerificationTip($('#oldPhoneTip'));
    //手机验证码--通用
    setVerificationTip($('#phoneCodeTip'));
    //新支付密码--通用
    setVerificationTip($('#sixDigTip2'));
    //再次输入密码--通用
    setVerificationTip($('#sixDigTip3'));



});