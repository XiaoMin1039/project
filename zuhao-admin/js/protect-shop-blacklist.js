$(function () {
    $accountType=$('#accountType').dropDown({
        items:[
            {value:'0',label:'手机号 '},
            {value:'1',label:'QQ号 '},
            {value:'2',label:'微信账号'},
            {value:'3',label:'支付宝账号'},
            {value:'4',label:'mac地址'},
            {value:'5',label:'平台账号名'}
        ]
    });
    $('#searchTip').mouseenter(function () {
        $(this).toolTip({content:'输入匹配黑名单中的账号进行模糊搜索'})
    });


    $(document).on('click','#addNew',function(){
        //让弹窗出现
        $('.pop-bg').removeClass('hide');
        $('.message-pop').css({marginTop:-$('.message-pop')[0].offsetHeight/2,marginLeft:-$('.message-pop')[0].offsetWidth/2})

        $('#accountTypeTip').mouseenter(function () {
            $(this).toolTip({content:'账户类型有多种，请选择对应的类型'})
        });
        $('#accountTip')[0].options={
            content:'请填写要拉黑的账号',
            errText:['账号不能为空','该账号已在黑名单']
        }
        focusBlurTipEvent($('#accountTip'),$('#account'),verificationAccout);
        function verificationAccout(val) {
            $('#accountTip')[0].errType=[verificationEmpty(val),2];
            changeTipState($('#accountTip')[0])
        }
        setVerificationTip($('#accountTip'));
    });
});