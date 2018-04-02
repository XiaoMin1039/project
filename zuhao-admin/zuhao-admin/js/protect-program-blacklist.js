$(function () {
    $accountType=$('#accountType').dropDown({
        items:[
            {value:'0',label:'启用 '},
            {value:'1',label:'停用 '},
        ]
    });
    $('#searchTip').mouseenter(function () {
        $(this).toolTip({content:'输入匹配黑名单中的md5进行模糊搜索'})
    });


    //点击增加黑名单
    $(document).on('click','#addNew',function(){
        //让弹窗出现
        $('.pop-bg').removeClass('hide');
        $('.message-pop').css({marginTop:-$('.message-pop')[0].offsetHeight/2,marginLeft:-$('.message-pop')[0].offsetWidth/2})
        $('#accountTypeTip').mouseenter(function () {
            $(this).toolTip({content:'MD5可启用和停用，若选择启用，创建之后即可生效，若选择停用，未来可以在页面中启用。'})
        });
        $('#MD5Tip')[0].options={
            content:'请填写要输入的MD5',
            errText:['MD5不能为空','该账号已在黑名单']
        };
        focusBlurTipEvent($('#MD5Tip'),$('#MD5'),verificationMD5);
        function verificationMD5(val) {
            $('#MD5Tip')[0].errType=[verificationEmpty(val),2];
            changeTipState($('#MD5Tip')[0])
        }
        setVerificationTip($('#MD5Tip'));
    });
});