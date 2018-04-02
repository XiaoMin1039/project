$(function () {
    data = {
        order_id: getQueryString('orderId')
    };
    //获取产品数据
    getTableData('order/agents/get', data, function (json) {
        if (json.orderAgentsDtos[0].orderState == 1) {
            if (json.orderAgentsDtos[0].orderType == 1) {
                // 轮到代理商评价
                $('.complain-box-info').addClass('hide');
                $('#formContent').parents('.complain-box').removeClass('hide')
            }
        } else if (json.orderAgentsDtos[0].orderState == 2) {
            if (json.orderAgentsDtos[0].isBackComment == 0 && json.orderAgentsDtos[0].commentFlag != 0) {
                // 评价回评
                getOrderDate();
                $('#formContent').parents('.complain-box').removeClass('hide');
                // $('.complain-box-info').parents('.complain-box').removeClass('hide');
            } else if (json.orderAgentsDtos[0].isBackComment == 1 && json.orderAgentsDtos[0].commentFlag != 0) {
                // 查看回评
                getOrderDate();
                // $('.complain-box-info').parents('.complain-box').removeClass('hide');
            }
        } else if (json.orderAgentsDtos[0].orderState == 3 || json.orderAgentsDtos[0].orderState == 4) {
            // 查看申诉
            getOrderDate();
            // $('.complain-box-info').parents('.complain-box').removeClass('hide');
        }
    });
    //获取聊天数据
    function getOrderDate() {
        $.ajax({
            url: spliceUrl('agents/claim/order/speak/get'),
            dataType: 'JSON',
            type: 'POST',
            data: data,
            xhrFields: {withCredentials: true},
            beforeSend: function () {
                $('.undefined').remove();
                //动画
                $('#orderTbody').hide();
            }
        }).done(function (json) {
            //这个地方content竟然不等于1，而是0！！！
            // if (json.content === 1) {
            //投诉对话上方的投诉信息
            //售后状态-afterState
            //回复的form表单隐藏——之所以这么写而不直接写在页面上是因为对问号插件加载有冲突
            $('#formContent').parents('.complain-box').addClass('hide');
            if (json.claimOrderDto.claimState) {
                switch (json.claimOrderDto.claimState) {
                    case 1:
                        //售后状态 显示的文字——现在是哪一方说话时间
                        if (json.speaks[json.speaks.length - 1].speakRole == 2) {
                            $('#afterState').text('等待买家继续举证');
                            $('#postClaim').hide();//提交留言按钮隐藏
                        } else if (json.speaks[json.speaks.length - 1].speakRole == 1) {
                            $('#afterState').text('等待商家处理售后');
                            $('#postClaim').show();//提交留言按钮显示
                            $('#formContent').parents('.complain-box').removeClass('hide');//回复的form表单显示
                        }
                        //如果没有赔付就隐藏赔付金额，如果有就显示具体
                        // if(json.claimOrderDto.complainMoney == 0){
                        //     $('#complainMoney').parent().remove();
                        // }else{
                        //     $('#complainMoney').text(json.claimOrderDto.complainMoney+'元');
                        // }
                        //举证回合
                        var sum = 0;
                        $.each(json.speaks, function (item, val) {
                            if (val.speakRole == 2) {
                                sum += 1;
                            }
                        });
                        var sum = 3 - sum;
                        if (sum) {
                            $('#surplusNum').text(sum + '次剩余（回合结束直接进入仲裁）');
                        } else {
                            $('#surplusNum').parent('li').remove();
                        }
                        //如果对话的数量大于等于2，就出现进入仲裁的按钮
                        if (json.speaks.length >= 2) {

                            $('#formContent').addClass('hide').parents('.complain-box').removeClass('hide');
                            //轮到商家发言
                            if (json.speaks[json.speaks.length - 1].speakRole == 1){
                                $('#formContent').removeClass('hide').parents('.complain-box').removeClass('hide');
                            }
                        } else {
                            $("#agree").hide();//同意退款
                            $("#advanceClaim").hide();//提前进入仲裁
                        }
                        ;
                        break;//交涉中
                    case 2:
                        $("#afterState").text('后台仲裁中');
                        $('#surplusNum').parent('li').remove();
                        break;
                    case 3:
                        $("#afterState").text('通过');
                        break;
                    case 4:
                        $("#afterState").text('失败');
                        break;
                }
                //处理时限
                var time = parseInt(json.claimOrderDto.claimCreateTime);
                var handingTimeLimit = new Date(time + 259200000);
                $('#handingTime').text(handingTimeLimit.getFullYear() + '年' + (handingTimeLimit.getMonth() + 1) + '月' + handingTimeLimit.getDate() + '日' + handingTimeLimit.getHours() + ':' + handingTimeLimit.getMinutes() + ':' + handingTimeLimit.getSeconds() + ' 前双方可以沟通举证，逾期将由平台仲裁。')
                //售后分类
                switch (json.claimOrderDto.claimType) {
                    case 1:
                        $("#afterType").text('产品描述不符');
                        break;
                    case 2:
                        $("#afterType").text('卖家骚扰');
                        break;
                    case 3:
                        $("#afterType").text('密码错误');
                        break;
                    case 4:
                        $("#afterType").text('无法正常登录');
                        break;
                    case 5:
                        $("#afterType").text('撤单');
                        break;
                    case 6:
                    case 13:
                        $("#afterType").text('其他');
                        break;
                    case 11:
                        $("#afterType").text('买家违规');
                        break;
                    case 12:
                        $("#afterType").text('买家辱骂或骚扰');
                        break;
                }
                //投诉对话
                var html = template('speakTbodyTemplate', json);
                $('#speakTbody').html(html);
                $('#speakTbody').show();
            } else {
                $('#formContent').parents('.complain-box').removeClass('hide');
            }
            $('.loading').remove();
            //显示售后状态
            $('.complain-box-info').parents('.complain-box').removeClass('hide');
        }).fail(function () {
            //去掉加载，显示服务器出错的手机图片
            $('.loading').remove();
            $('.main').getUndefined('服务器出错');
        });
    }
});


//点击提交留言(这是在投诉理赔的情况下)
$(document).on('click', '#postClaim', function () {
    data = {
        order_id: getQueryString('orderId'),
        speak_content: $("#complainInto").val()
    };

    formGetData($(this), 1, data, 'agents/claim/order/speak/add', function (json) {
        if (json.content === 1) {
            uploader.options.formData.speak_id = json.data;
            uploader.upload();
            var options = {
                message: '提交成功',
                state: 1
            };
            history.go(0)
        } else {
            var options = {
                message: returnError(json.content),//ele.text() + '失败',
                state: 2,//1、cssDemo、3三种状态:1成功,2失败,3警告
            };
        }
        messageTip(options)
    })
});
//点击同意退款
$(document).on('click', '#agree', function () {
    var _this = $(this);
    data = {
        order_id: getQueryString('orderId')
    };
    getChangeData('agents/claim/order/agree', data, _this,function () {
        history.go(0);
    });
});
//点击提前进入仲裁
$(document).on('click', '#advanceClaim', function () {
    var _this = $(this);
    data = {
        order_id: getQueryString('orderId')
    };
    getChangeData('agents/claim/order/enter_aritrage', data, _this,function () {
        history.go(0);
    });
});
