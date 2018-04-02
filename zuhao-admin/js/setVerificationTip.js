/**
 * Created by ching on 2017/10/30.
 */

// 图片验证码校验调用插件
if($('#imgCodeTip').length !== 0){
    $('#imgCodeTip')[0].options={
        content:'请输入图片验证码',
        errText:['图片验证码不能为空','图片验证码长度不够','图片验证码错误']
    };
    focusBlurTipEvent($('#imgCodeTip'),$('#imgCode'),verificationImgCodeTip)
    function verificationImgCodeTip(val) {
        var ele=$('#imgCodeTip')[0];
        ele.errType=[verificationEmpty(val),verificationMinLength(val,4),2];
        changeTipState(ele);
    }
}


//支付密码校验调用插件
if($('#sixDigTip').length !== 0){
    $('#sixDigTip')[0].options={
        content:'请输入支付密码',
        errText:['密码不能为空','密码长度必须为6位','密码错误']
    };
    focusBlurTipEvent($('#sixDigTip'),$('#sixDig'),verificationPayPswTip);
    function verificationPayPswTip(val) {
        var ele=$('#sixDigTip')[0];
        ele.errType=[verificationEmpty(val),verificationMinLength(val,6),2];
        changeTipState(ele);
    }
}


//新支付密码调用插件
if($('#sixDigTip2').length !== 0){
    $('#sixDigTip2')[0].options={
        content:'请输入新的支付密码',
        errText:['密码不能为空','密码长度不够','支付密码必须有数字']
    };
    focusBlurTipEvent($('#sixDigTip2'),$('#sixDig2'),verificationNewPayPswTip);
    function verificationNewPayPswTip(val) {
        $('#sixDigTip2')[0].errType=[verificationEmpty(val),verificationMinLength(val,6),2];
        changeTipState($('#sixDigTip2')[0])
    }
}


//再次输入密码调用插件
if($('#sixDigTip3').length !== 0){
    $('#sixDigTip3')[0].options={
        content:'再次输入新的支付密码',
        errText:['密码不能为空','密码长度不够','2次密码输入不正确']
    };
    focusBlurTipEvent($('#sixDigTip3'),$('#sixDig3'),verificationRepeatPayPswTip);
    function verificationRepeatPayPswTip(val) {
        $('#sixDigTip3')[0].errType=[verificationEmpty(val),verificationMinLength(val,6),verificationIsSame(val,$('#sixDig2 input').val())];
        changeTipState($('#sixDigTip3')[0]);
    }
}


//旧的手机号码调用插件
if($('#oldPhoneTip').length !== 0){
    $('#oldPhoneTip')[0].options={
        content:'请输入旧的手机号码',
        errText:['手机号码不能为空','手机号码长度不够','手机号码格式有误','该手机号对应的代理商不存在','发送短信过于频繁，请稍后再试','发送短信失败，请稍后再试，如有疑问，联系平台客服']
    };
    focusBlurTipEvent($('#oldPhoneTip'),$('#oldPhone'),verificationPhoneTip);
    function verificationPhoneTip(val) {
        $('#oldPhoneTip')[0].errType=[verificationEmpty(val),verificationMinLength(val,11),verificationRegular(val,/^(13|14|15|17|18|19)\d{9}$/),2,2,2];
        changeTipState($('#oldPhoneTip')[0]);
    }
}



//手机验证码调用插件
if($('#phoneCodeTip').length !== 0){
    $('#phoneCodeTip')[0].options={
        content:'请输入手机验证码',
        errText:['手机验证码不能为空','手机验证码长度不够','手机验证码错误或者失效']
    };
    focusBlurTipEvent($('#phoneCodeTip'),$('#phoneCode'),verificationPhoneTip);
    function verificationPhoneTip(val) {
        $('#phoneCodeTip')[0].errType=[verificationEmpty(val),verificationMinLength(val,6),2];
        changeTipState($('#phoneCodeTip')[0]);
    }
}



function verificationMaxLength(val,max){
    var a=1;
    if(val.length > max) a=0;
    return a
}
function verificationMinLength(val,min) {
    var a=1;
    if(val.length < min) a=0;
    return a
}
function verificationRegular(val, reg) {
    var a=1;
    if(!reg.test(val) && val != '') a=0;
    return a
}
function verificationEmpty(val) {
    var a=1;
    if(val == '') a=0;
    return a
}
function verificationIsSame(val1,val2){
    a=0;
    if(val1 == val2) a=1;
    return a
}



//调用Tip组件
function setVerificationTip(ele,option){
    setTimeout(function(){
        ele[0].testTip=ele.verificationTip(option || ele[0].options)
    },0)
}

//判断是否有错误状态
function judgeTipRight(arr){
    var state=true;
    $.each(arr,function (index, val) {
        if(val == 0) state = false;
    });
    return state
}

//改变Tip状态
function changeTipState(ele){
    if(!judgeTipRight(ele.errType)){
        $(ele).removeClass('img-bingo').removeClass('img-question').removeClass('img-notice').addClass('img-mistake')
    }else{
        $(ele).removeClass('img-mistake').removeClass('img-question').removeClass('img-notice').addClass('img-bingo')
    }
}

//聚焦事件改变Tip状态
function focusTipEvent(ele,_this,func,focusFunc) {
    var name;
    if(_this[0].localName == 'input'){
        _this=_this.parent()
    }else if(_this[0].localName == 'textarea'){
        name='textarea';
        _this=_this.parent();
    }
    _this.on('focus',name || 'input',function () {
        if(focusFunc) focusFunc();
        if(ele.hasClass('img-mistake')){
            $(this).bind('keyup',function () {
                func($(this).val());
                ele[0].testTip.setVerification({errType:ele[0].errType,isShow:0,notAutoHide:1})
            });
            ele[0].testTip.setVerification({errType:ele[0].errType,isShow:1})
        }
    })
}

//失去焦点改变Tip状态
function blurTipEvent(ele,_this,func,blurFunc) {
    var name;
    if(_this[0].localName == 'input'){
        _this=_this.parent();
    }else if(_this[0].localName == 'textarea'){
        name='textarea';
        _this=_this.parent();
    }
    _this.on('blur',name || 'input',function () {
        if(blurFunc) blurFunc();
        func($(this).val());
        ele[0].testTip.setVerification({errType:ele[0].errType,isShow:0})
    })
}

//聚焦和失去焦点事件改变Tip状态
function focusBlurTipEvent(ele,_this,func,blurFunc,focusFunc) {
    blurTipEvent(ele,_this,func,blurFunc);
    focusTipEvent(ele,_this,func,focusFunc)
}