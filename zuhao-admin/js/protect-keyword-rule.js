$(function(){

    // 创建新规则 中的下拉框
    $ruleType=$('#ruleType').dropDown({
        items:[
            {value:'0',label:'桌面程序窗口关键词规则 '},
            {value:'1',label:'外网IP规则 (慎用)'}
        ]
    });
    $matchType=$('#matchType').dropDown({
        items:[
            {value:'0',label:'包含部分词汇'},
            {value:'1',label:'完全匹配词汇'}
        ]
    });
    $handleType=$('#handleType').dropDown({
        items:[
            {value:'0',label:'冻结上号激活码'},
            {value:'1',label:'重启租客电脑'},
            {value:'2',label:'强制租客电脑蓝屏'}
        ]
    });

    // 快速搜索 问号
    $('#searchTip').mouseenter(function () {
        $(this).toolTip({content:'输入匹配关键词中的部分文字进行模糊搜索'})
    });


    //创建新规则
    //点击创建按钮
    $(document).on('click','#addNew',function(){
        //让弹窗出现
        $('.pop-bg').removeClass('hide');
        $('.message-pop').css({marginTop:-$('.message-pop')[0].offsetHeight/2,marginLeft:-$('.message-pop')[0].offsetWidth/2})
        $('#ruleTypeTip').mouseenter(function () {
            $(this).toolTip({content:'窗口关键词：运行程序中能看到的文字信息（句柄的标题）。外网IP：租客的外网IP，不太建议使用。大部分家庭用的IP都是动态分配的。'})
        });
        $('#matchTypeTip').mouseenter(function () {
            $(this).toolTip({content:'匹配规则'})
        });
        $('#handleTypeTip').mouseenter(function () {
            $(this).toolTip({content:'处理方式'})
        });
        $('#keywordsTip')[0].options={
            content:'请填写关键词规则',
            errText:['关键词超过字符限制','该关键词规则已存在']
        };
        focusBlurTipEvent($('#keywordsTip'),$('#keywords'),verificationkeywords);
        function verificationkeywords(val) {
            $('#keywordsTip')[0].errType=[verificationMaxLength(val,250),2];
            changeTipState($('#keywordsTip')[0])
        }
        setVerificationTip($('#keywordsTip'));
        // $('#keywords').bind('focus',function () {
        //     setShowLength($(this),250,$('#contentLimit'));
        // });
        // $('#keywords').bind('blur',function () {
        //     $('#contentLimit').slideUp();
        // });
        // $('#keywords').bind('keyup',function () {
        //     setShowLength($(this),250,$('#contentLimit'));
        // });
    });
});