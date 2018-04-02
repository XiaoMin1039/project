/**
 * Created by ching on 2017/10/31.
 */
var rentErr=[0];
$(function () {
    $select=$('#dropDown').dropDown({
        items:[{value:'0',label:'支付宝'}]
    });
    //设置时租、包夜、包天
    $(document).on('click','#setHourRent',function (e) {
        e.stopPropagation();
        var options=[{
            value:'0',
            type:'hRent',
            unit:{
                max:100,
                min:0,
                content:'',
                array: [0, 1, 3, 4, 10, 100],
                decimal:true,
                digit:2
            },
            yes:function (val) {
                if(val != '') {
                    rentErr[0]=1;
                    $('#rentSetNotice').removeClass('img-mistake').removeClass('img-notice').addClass('img-bingo');
                    $('#rentSetNotice')[0].testTip.setVerification({errType:rentErr,isShow:0,notAutoHide:1});
                    $('#setHourRent').prev().addClass('rentActive');
                    $("#setHourRent>span>p").text(val+'元');
                }
            }
        }];
        $(this).select(options);
    });
    $(document).on('click','#setNightRent',function (e) {
        e.stopPropagation();
        var options=[{
            value:'0',
            type:'hRent',
            unit:{
                unit:'',
                max:100,
                min:0,
                content:'',
                array: [0, 1, 3, 4, 10, 100],
                decimal:true,
                digit:2
            },
            yes:function (val) {
                if(val != '') {
                    $('#setNightRent').prev().addClass('rentActive')
                    if($('#setNightRent').parent().find('.close-setRent').length === 0) {
                        $("#setNightRent").parent().append("<i class='close-setRent'>&times;</i>");
                    }
                    $("#setNightRent>span>p").text(val+'元');
                }
            }
        }];
        $(this).select(options);
    });
    $(document).on('click','#setDayRent',function (e) {
        e.stopPropagation();
        var options=[{
            value:'0',
            type:'hRent',
            unit:{
                max:100,
                min:0,
                content:'',
                array: [0, 1, 3, 4, 10, 100],
                decimal:true,
                digit:2
            },
            yes:function (val) {
                if(val != '') {
                    $('#setDayRent').prev().addClass('rentActive');
                    if($('#setDayRent').parent().find('.close-setRent').length === 0){
                        $("#setDayRent").parent().append("<i class='close-setRent'>&times;</i>");
                    }
                    $("#setDayRent>span>p").text(val+'元');
                }
            }
        }];
        $(this).select(options);
    });
    //设置SKU
    $(document).on('click','#setTimePrice',function () {
         $div=$(`
            <div class="form-set" data-id="setTimePrice">
                <div data-id="setTime" style="position:relative;cursor: pointer"><span style="width: 100%;height:100%;display: inline-block"><p style="width: 100%;height:100%;">设置时间</p></span></div>
                <div data-id="setPrice" style="position:relative"><span style="width: 100%;height:100%;display: inline-block"><p style="width: 100%;height:100%;">设置价格</p></span></div>
                <i class='close-setRent'>&times;</i>
            </div>
         `);
         $div.insertBefore($(this).parent());
         if($(this).parents('.form-content').find('[data-id="setTimePrice"]').length === 5){
             $(this).parent().addClass('hide');
         }
    });
    $(document).on('click','[data-id="setTime"]',function (e) {
        e.stopPropagation();
        var _this=$(this)
        var options=[{
            value:'0',
            type:'hRent',
            unit:{
                max:100,
                min:2,
                content:'',
                array: [2,4,6,8,10,20],
                decimal:false
            },
            yes:function (val) {
                if(val != '') {
                    _this.find('p').text(val+'小时');
                }
            }
        }];
        $(this).select(options);
    });
    $(document).on('click','[data-id="setPrice"]',function (e) {
        e.stopPropagation();
        var _this=$(this);
        if($(this).prev().find('p').text() != '设置时间'){
            var options=[{
                value:'0',
                type:'hRent',
                unit:{
                    max:10000,
                    min:0,
                    content:'',
                    array: [2,4,6,8,10,20],
                    decimal:true,
                    digit:2
                },
                yes:function (val) {
                    if(val != '') {
                        _this.prev().addClass('rentActive');
                        _this.find('p').text(val+'元');
                    }
                }
            }];
            $(this).select(options);
        }
    });
    $(document).on('click','.close-setRent',function (e) {
        e.stopPropagation();
        if($(this).parent().attr('data-id') == 'setTimePrice'){
            $(this).parent().remove();
            $('#setTimePrice').parent().removeClass('hide');
        }else{
            $(this).prev().prev().removeClass('rentActive');
            $(this).prev().html('<span style="width: 100%;height:100%;display: inline-block"><p style="width: 100%;height:100%;">点击设置</p></span>');
            $(this).remove();
        }
    });


    // 报错提示
    //1.游戏分类和大区
    if($('#gameNotice').length === 1){
        $('#gameNotice')[0].options={
            content:'选择账号所在的游戏分类、大区、子区，三个条件都必须全填。',
            errText:['游戏分类必须选择','游戏大区必须选择','游戏子区必须选择','该账号在该子区已存在，请勿重复提交']
        };
        setVerificationTip($('#gameNotice'));
    }

    //2.标题文本
    $('#titleTextTip')[0].options={
        content:'最长可以填写30个中文字符，标题可以用于搜索，建议将您的别名写在标题上，用于租客搜索定位。',
        errText:['标题不能为空','标题长度不能超过30个字符']
    };
    focusBlurTipEvent($('#titleTextTip'),$('#titleText'),verificationTitleText);
    $('#titleText').bind('focus',function () {
        setShowLength($(this),30)
    })
    $('#titleText').bind('keyup',function () {
        setShowLength($(this),30)
    })
    $('#titleText').bind('blur',function () {
        $(this).next().slideUp();
    })
    function verificationTitleText(val) {
        $('#titleTextTip')[0].errType=[verificationEmpty(val),verificationMaxLength(val,30)]
        changeTipState($('#titleTextTip')[0]);
    }
    setVerificationTip($('#titleTextTip'));
    //3.商家自定义别名（选填）
    $('#customAliasTip')[0].options={
        content:'别名相当于自定义编号，或者账号佚名，用于快速搜索，或者快速建单。请按照自己的内部习惯填写。',
        errText:['别名长度不20个中文字符']
    };
    $('#customAlias').bind('focus',function () {
        setShowLength($(this),20)
    })
    $('#customAlias').bind('keyup',function () {
        setShowLength($(this),20)
    })
    $('#customAlias').bind('blur',function () {
        $(this).next().slideUp();
    })
    focusBlurTipEvent($('#customAliasTip'),$('#customAlias'),verificationCustomAlias);
    function verificationCustomAlias(val) {
        $('#customAliasTip')[0].errType=[verificationMaxLength(val,20)]
        changeTipState($('#customAliasTip')[0]);
    }
    setVerificationTip($('#customAliasTip'));
    //4.租赁价格
    $('#rentSetNotice')[0].options={
        content:'最多可以设置5种不同的租金类型，时租（每个小时的租金）必须设置，如果想多个小时起租，请在下面的【最短租赁时间】中设置。',
        errText:['时租必须设置']
    };
    setVerificationTip($('#rentSetNotice'));
    //5.押金设置
    $('#depositNotice')[0].options={
        content:'押金只对平台用户有效，订单正常结束后，24小时返回客户账户，押金不得高于20元，免押金或者抵押金排名靠前。'
    };
    setVerificationTip($('#depositNotice'));
    //6.代理商分成
    $('#rateNotice')[0].options={
        content:'填写您所获得的账号分成比例，只能为10倍数的正整数，例如填写20，代表您获得的租金分成为20%，号主所得为80%，分成用于后期财务做账转款，或者是对账，请谨慎填写。'
    };
    setVerificationTip($('#rateNotice'));
    //7.账号描述
    $('#accountDescribeNotice')[0].options={
        content:'可以用于装备/账号亮眼点/特殊的限制要求 通过描述告知用户。我们不太建议您将所有的装备信息填写到这里。',
        errText:['账号描述不能为空','账号描述不超过300个字符']
    };
    $('#accountDescribe').bind('focus',function () {
        setShowLength($(this),300)
    })
    $('#accountDescribe').bind('keyup',function () {
        setShowLength($(this),300)
    })
    $('#accountDescribe').bind('blur',function () {
        $(this).next().slideUp();
    })
    focusBlurTipEvent($('#accountDescribeNotice'),$('#accountDescribe'),verificationAccountDescribe);
    function verificationAccountDescribe(val) {
        $('#accountDescribeNotice')[0].errType=[verificationEmpty(val),verificationMaxLength(val,300)]
        changeTipState($('#accountDescribeNotice')[0]);
    }
    setVerificationTip($('#accountDescribeNotice'));
    //9.游戏账号
    $('#gameAccountNotice')[0].options={
        content:'请输入游戏账号',
        errText:['游戏账号不能为空']
    };
    focusBlurTipEvent($('#gameAccountNotice'),$('#gameAccount'),verificationGameAccount);
    function verificationGameAccount(val) {
        $('#gameAccountNotice')[0].errType=[verificationEmpty(val)];
        changeTipState($('#gameAccountNotice')[0]);
    }
    setVerificationTip($('#gameAccountNotice'));
    //10.游戏密码
    if($('#gamePwdNotice').length !== 0){
        $('#gamePwdNotice')[0].options={
            content:'请输入游戏密码',
            errText:['游戏密码不能为空']
        };
        focusBlurTipEvent($('#gamePwdNotice'),$('#gamePwd'),verificationGamePwd);
        function verificationGamePwd(val) {
            $('#gamePwdNotice')[0].errType=[verificationEmpty(val)];
            changeTipState($('#gamePwdNotice')[0]);
        }
        setVerificationTip($('#gamePwdNotice'));
    }
    //违规冻结次数
    $('#maxViolationNotice')[0].options={
        content:'违规次数用完后,激活码默认会自动冻结，比如开启黑名单进程，比如上号期间开一些非法的杀毒软件妨碍上号器工作等。具体规则请查看帮助中心。'
    };
    setVerificationTip($('#maxViolationNotice'));
    //号主联系电话
    $('#ownPhoneNotice')[0].options={
        content:'可以不填写，如果填写请填写正确的电话号码，后期可以账号出现问题，系统可以通过短信的形式告知号主账号情况。',
        errText:['手机号有填写的情况下，号主手机号码格式不正确']
    };
    focusBlurTipEvent($('#ownPhoneNotice'),$('#ownPhone'),verificationOwnPhone);
    function verificationOwnPhone(val) {
        $('#ownPhoneNotice')[0].errType=[verificationRegular(val,/^(13|14|15|17|18|19)\d{9}$/)]
        changeTipState($('#ownPhoneNotice')[0])
    }
    setVerificationTip($('#ownPhoneNotice'));
    //支付方式
    $('#payWayNotice')[0].options={
        content:'可以不填写，用于后期财务转款用，建议填写。'
    };
    setVerificationTip($('#payWayNotice'));
    //其他备注
    $('#otherMsgNotice')[0].options={
        content:'可以不填写，用于后期财务转款用，建议填写。',
        errText:['备注信息不超过30个字符']
    };
    $('#otherMsg').bind('focus',function () {
        setShowLength($(this),30)
    });
    $('#otherMsg').bind('keyup',function () {
        setShowLength($(this),30)
    });
    $('#otherMsg').bind('blur',function () {
        $(this).next().slideUp();
    });
    focusBlurTipEvent($('#otherMsgNotice'),$('#otherMsg'),verificationOtherMsg);
    function verificationOtherMsg(val) {
        $('#otherMsgNotice')[0].errType=[verificationMaxLength(val,30)];
        changeTipState($('#otherMsgNotice')[0])
    }
    setVerificationTip($('#otherMsgNotice'));


});
function click_scroll(id) {
    var scroll_offset = $(id).offset();
    $("body,html").animate({
        scrollTop:scroll_offset.top-120
    },0);
}
function uploaderPic() {
    $('#uploaderBox').html('<div class="img-update"><div id="picker"><img src="http://zudahao.zudahao.com/agents2/images/pic-upload.png" style="width: 100%;height:100%">' +
        '</div></div>');
    $('#uploaderBox').parent().removeClass('hide');
    //接入图片上传功能
    getWebUploader('#picker',spliceUrl('agents/product/image'),null,5)
}
function publishPreserve(url,data,ele) {
    if($('#uploaderBox [data-url]').length !== 0){
        var urls=[];
        $.each($('#uploaderBox [data-url]'),function (index, val) {
            urls.push($(val).attr('data-url'))
        });
        data.urls=urls.join(',');
    }
    getFormData(url,data,ele,function (json) {
        if(json.content === 1){
            var options = {
                message: '提交成功',
                state: 1,
                callback:function () {
                     window.location.href = './product-manage.html?productId=' + json.data
                }
            };
            messageTip(options);
        }else if(json.content == 307){
            gameErr[3]=0;
            $('#gameNotice').removeClass('img-notice').removeClass('img-bingo').addClass('img-mistake');
            $('#gameNotice')[0].testTip.setVerification({errType:gameErr,isShow:1});
        }else{
            var errText=[];
            $.each(json.errors,function (index, val) {
                errText.push(returnError(val))
            })
            var options = {
                message: errText.join('</br>'),
                state: 3
            };
            messageTip(options);
        }
    })
}
function setAgentSKU(first,data) {
    var sku=[];
    $.each($('[data-id="setTime"]'),function (index,val) {
        if($(val).hasClass('rentActive')){
            sku.push({"duartion":parseFloat($(val).find('p').text()),"price":parseFloat($(val).next().find('p').text())})
        }
    });
    var skuData={
        data:JSON.stringify(sku),
        productId: getQueryString('productId') || ''
    };
    if(first){
        confirmAddProto(skuData.data,data,'sku');
    }else{
        if(sku.length !== 0){
            $.ajax({
                url: spliceUrl('agents/product/sku/time/set'),
                dataType: 'JSON',
                type: 'POST',
                xhrFields: {withCredentials: true},
                async: false,
                data: skuData
            });
        }
    }
}