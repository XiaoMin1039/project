/**
 * Created by ching on 2017/11/2.
 */
//点击创建按钮
$(function () {
    $('#shortcut-boxTip').mouseenter(function () {
        $(this).toolTip({content:'点击可直接选择要使用的快捷术语，将在下方的术语模板中生成，请不要随意更改生成的"{ }"中的内容，否则将影响使用。'})
    });
    $('#shopNewsTitleTip')[0].options={
        content:'模板别名请认真定义，使用将更为方便',
        errText:['模板别名不能为空']
    };
    focusBlurTipEvent($('#shopNewsTitleTip'),$('#shopNewsTitle'),verificationShopNewsTitle);
    function verificationShopNewsTitle(val) {
        $('#shopNewsTitleTip')[0].errType=[verificationEmpty(val)];
        changeTipState($('#shopNewsTitleTip')[0])
    }
    setVerificationTip($('#shopNewsTitleTip'));
    $('#shopNewsContentTip')[0].options={
        content:'请填写要输入的术语',
        errText:['模板不能为空']
    };
    focusBlurTipEvent($('#shopNewsContentTip'),$('#shopNewsContent'),verificationShopNewsContent);
    function verificationShopNewsContent(val) {
        $('#shopNewsContentTip')[0].errType=[verificationEmpty(val)];
        changeTipState($('#shopNewsContentTip')[0])
    }
    setVerificationTip($('#shopNewsContentTip'));
})
$(document).on('click','#addNew',function(){
    //加载按钮
    $("#shortcut-box").html('');
    $.each(shortcuts,function (index,s) {
        $("#shortcut-box").append("<button data-id="+s.content+" class='button-event-small-blue'>"+s.text+"</button>")
    });
    //让弹窗出现
    $('.pop-bg').removeClass('hide');
    $('.message-pop').css({marginTop:-$('.message-pop')[0].offsetHeight/2,marginLeft:-$('.message-pop')[0].offsetWidth/2})
    $('#shortcut-box button').removeClass('ban');
    $('.pop-bg input,.pop-bg textarea').val('');
    $('.pop-bg input,.pop-bg textarea').removeAttr('disabled');
    $('#shortcut-boxTip').removeClass('opacity0');
    $("#shopNewsTitleTip").removeClass('opacity0').removeClass('img-bingo').removeClass('img-mistake').addClass('img-notice');
    $('#shopNewsContentTip').removeClass('opacity0').removeClass('img-bingo').removeClass('img-mistake').addClass('img-notice');
    $("#shopNewsTitleTip")[0].testTip.setVerification({errType:[2],isShow:0});
    $("#shopNewsContentTip")[0].testTip.setVerification({errType:[2],isShow:0});
    $('#confirm').attr('data-id',$(this).attr('id'));
});