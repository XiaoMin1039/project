$(function () {
    $('#afterStateNotice').mouseenter(function () {
        $(this).toolTip({content:'售后状态'})
    });
    $('#handingTimeNotice').mouseenter(function () {
        $(this).toolTip({content:'处理时限 '})
    });
    $('#surplusNumNotice').mouseenter(function () {
        $(this).toolTip({content:'举证回合'})
    });
    $('#afterTypeNotice').mouseenter(function () {
        $(this).toolTip({content:'售后分类'})
    });

    $('#complainIntoNotice')[0].options={
        content:'请填写投诉相关内容，注意不能超过300字符',
        errText:['投诉相关内容不能为空','投诉相关内容超过限制字符']
    };
    focusBlurTipEvent($('#complainIntoNotice'),$('#complainInto'),verificationComplainInto)
    function verificationComplainInto(val) {
        var ele=$('#complainIntoNotice')[0];
        ele.errType=[verificationEmpty(val),verificationMaxLength(val,200)];
        changeTipState(ele);
    }
    setVerificationTip($('#complainIntoNotice'));
    $('#complainInto').bind('focus',function () {
        setShowLength($(this),200,$('#contentLimit'));
    });
    $('#complainInto').bind('blur',function () {
        $('#contentLimit').slideUp();
    });
    $('#complainInto').bind('keyup',function () {
        setShowLength($(this),200,$('#contentLimit'));
    });

    var options={
        content:'请上传店铺头部图片'
    };
    $('#complainPicNotice').verificationTip(options);


    getWebUploader('#picker','http://192.168.31.39/api/agents/claim/order/speak/image/add?method=upload',{order_id:getQueryString('orderId')},null,function (json) {
        console.log(1)
    })

//上传图片

















});