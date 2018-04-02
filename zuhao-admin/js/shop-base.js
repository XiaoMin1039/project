/**
 * Created by ching on 2017/11/1.
 */
$(function () {


    //店铺简介提示引入插件
    $('#shopIntoTip')[0].options={
        content:'请填写店铺相关简介，注意不能超过300字符',
        errText:['店铺简介不能为空','店铺简介超过限制字符']
    };
    focusBlurTipEvent($('#shopIntoTip'),$('#shopInto'),verificationShopInto)
    function verificationShopInto(val) {
        var ele=$('#shopIntoTip')[0];
        ele.errType=[verificationEmpty(val),verificationMaxLength(val,300)];
        changeTipState(ele);
    }
    setVerificationTip($('#shopIntoTip'));
    $('#shopInto').bind('focus',function () {
        setShowLength($(this),300,$('#contentLimit'));
    });
    $('#shopInto').bind('blur',function () {
        $('#contentLimit').slideUp();
    });
    $('#shopInto').bind('keyup',function () {
        setShowLength($(this),300,$('#contentLimit'));
    });

    // 店铺图片提示引入插件
    $('#shopPicTip')[0].options={
        content:'请上传店铺头部图片',
        errText:['店铺图片不能为空']
    };
    setVerificationTip($('#shopPicTip'));
    //店铺经营类型提示引入插件
    var options3={
        content:'可选择店铺经营的游戏分类'
    };
    $('#gameSelectTip').mouseenter(function(){
        $(this).toolTip(options3);
    });


});