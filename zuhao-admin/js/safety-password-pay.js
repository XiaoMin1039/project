/**
 * Created by ching on 2017/10/30.
 */
$(function () {
    //密码框
    $('#sixDig').sixDig();
    //密码框
    $('#sixDig2').sixDig();
    //密码框
    $('#sixDig3').sixDig();


    getImg();

    //旧的支付密码--通用
    setVerificationTip($('#sixDigTip'));
    //新支付密码--通用
    setVerificationTip($('#sixDigTip2'));
    //再次输入密码--通用
    setVerificationTip($('#sixDigTip3'));
    //验证码输入--通用
    setVerificationTip($('#imgCodeTip'));
});