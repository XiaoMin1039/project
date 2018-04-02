/**
 * Created by ching on 2017/11/10.
 */
$(function () {
    $('#orderKeywordsNotice')[0].options={
        content:'可根据模糊搜索选定右侧所需定单',
        errText:['未选定所需订单']
    };
    $('#orderKeywords').bind('blur',function(){

    });
    setVerificationTip($('#orderKeywordsNotice'));

    $('#timeNotice')[0].options={
        content:'可输入数字表示几小时，或输入如：1+1 表示出租1小时赠送1小时',
        errText:['出租时长不能为空']
    };
    focusBlurTipEvent($('#timeNotice'),$('#time'),verificationRentTime);
    function verificationRentTime(val) {
        $('#timeNotice')[0].errType=[verificationEmpty(val)];
        changeTipState($('#timeNotice')[0])
    }
    setVerificationTip($('#timeNotice'));


    $('#allMoneyNotice').mouseenter(function () {
        $(this).toolTip({content:'可输入实际收取金额，不填默认为0'})
    });
    $("#hourMoneyNotice").mouseenter(function () {
        $(this).toolTip({content:'需选定右侧的订单才能显示单价，单价不可修改'})
    });
    $('#usernameNotice').mouseenter(function () {
        $(this).toolTip({content:'可输入租客旺旺或者QQ'})
    });

});