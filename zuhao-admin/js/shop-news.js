$(function(){
    //时间插件
    timeFrame();
    $('#searchTip').mouseenter(function () {
        $(this).toolTip({content:'输入匹配公告中的标题进行模糊搜索'})
    });

    //店铺新闻引入插件
    $('#shopNewsTitleTip')[0].options={
        content:'请输入新闻标题',
        errText:['新闻标题不能为空','新闻标题不能超过30个字符']
    };
    focusBlurTipEvent($('#shopNewsTitleTip'),$('#shopNewsTitle'),verificationShopNewsTitle);
    function verificationShopNewsTitle(val) {
        $('#shopNewsTitleTip')[0].errType=[verificationEmpty(val),verificationMaxLength(val,30)];
        changeTipState($('#shopNewsTitleTip')[0])
    }
    setVerificationTip($('#shopNewsTitleTip'))
    //新闻有效期引入插件
    $('#timeFrameAfterTip')[0].options={
        content:'请输入新闻有效期',
        errText:['新闻有效期不能为空']
    };
    focusBlurTipEvent($('#timeFrameAfterTip'),$('#timeFrameAfter'),verificationTimeFrameAfter);
    function verificationTimeFrameAfter(val) {
        $('#timeFrameAfterTip')[0].errType=[verificationEmpty(val)];
        changeTipState($('#timeFrameAfterTip')[0])
    }
    setVerificationTip($('#timeFrameAfterTip'));
    //新闻内容引入插件
    $('#shopNewsContentTip')[0].options={
        content:'请输入新闻标题',
        errText:['新闻标题不能为空','新闻标题不能超过120个字符']
    }
    focusBlurTipEvent($('#shopNewsContentTip'),$('#shopNewsContent'),verificationShopNewsContentTip);
    function verificationShopNewsContentTip(val) {
        $('#shopNewsContentTip')[0].errType=[verificationEmpty(val),verificationMaxLength(val,300)];
        changeTipState($('#shopNewsContentTip')[0])
    }
    setVerificationTip($('#shopNewsContentTip'))


    //点击增加店铺公告
    $(document).on('click','#addNew',function(){
        //让弹窗出现
        $('.pop-bg').removeClass('hide');

        $('.pop-bg input,.pop-bg textarea').val('');
        $('.pop-bg input,.pop-bg textarea').removeAttr('disabled');
        $('#shopNewsTitleTip').removeClass('opacity0').removeClass('img-bingo').removeClass('img-mistake').addClass('img-notice');
        $("#shopNewsContentTip").removeClass('opacity0').removeClass('img-bingo').removeClass('img-mistake').addClass('img-notice');
        $('#timeFrameAfterTip').removeClass('opacity0').removeClass('img-bingo').removeClass('img-mistake').addClass('img-notice');
        $("#shopNewsContentTip")[0].testTip.setVerification({errType:[2,2],isShow:0});
        $("#timeFrameAfterTip")[0].testTip.setVerification({errType:[2],isShow:0});
        $("#shopNewsTitleTip")[0].testTip.setVerification({errType:[2,2],isShow:0});
        $('.message-pop').css({marginTop:-$('.message-pop')[0].offsetHeight/2,marginLeft:-$('.message-pop')[0].offsetWidth/2});
        $('#confirm').attr('data-id',$(this).attr('id'));
    });

});
