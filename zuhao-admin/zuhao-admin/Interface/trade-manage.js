var rows = 10; //一页条数
var count_page = null;//总页数
var data = {
    page: 1,
    rows: rows
};
//加载数据
$(function () {
    //带参数跳转页面
    if (getQueryString('orderId')) {
        var orderId = getQueryString('orderId');
        data.order_state = 0;
        data.order_keywords = filtrate(orderId, 1);
        $('#searchword').val(orderId);
        $('#orderKeywords').val(orderId);
    }
    if (getQueryString('userAccount')) {
        var userAccount = getQueryString('userAccount');
        data.user_account = userAccount;
        $('#userAccount').val(userAccount);
    }
    //获取数据
    getTableData('order/agents/get_orders', data);
});
//点击单个搜索
$(document).on("click", '#search', function () {
    count_page = null;
    var _this = $(this);
    _this.getButtonLoading();
    var data = {
        page: 1,
        rows: 10,
        order_keywords: filtrate($("#searchword").val(), 1)
    };
    $('.status ul li:first-child').addClass('active').siblings('li').removeClass('active');
    //获取数据
    getTableData('order/agents/get_orders', data, function () {
        _this.deleteButtonLoading();
    });
});
//点击高级搜索
$(document).on("click", '#moreSearch', function () {
    count_page = null;
    var _this = $(this);
    _this.getButtonLoading();
    data = {
        page: 1,
        rows: rows,
        order_keywords: filtrate($("#orderKeywords").val(), 1),
        product_keywords: $('#productKeywords').val(),
        zizone: $gameSelect.getValue(),
        order_state: $productState.getValue(),
        is_reserve: $productType.getValue(),
        game_account: $('#gameAccount').val(),
        game_roleName: $('#roleName').val(),
        user_link_way: $('#linkWay').val(),
        user_pay_way: $('#userPayWay').val(),
        order_type: $payWay.getValue(),
        user_account: $('#userAccount').val()
    };
    if ($("#timeFrameBefore").val()) {
        var time = $("#timeFrameBefore").val().split("至");
        data.start_time = changeTimeToUnix(time[0]);
        data.end_time = changeTimeToUnix(time[1]);
    }
    //获取数据
    getTableData('order/agents/get_orders', data, function () {
        _this.deleteButtonLoading();
    });
});
//点击漏斗-过滤，搜索客户账号下的所有订单
$(document).on('click', '#filter', function () {
    count_page = null;
    var data = {
        page: 1,
        rows: rows,
        user_account: $(this).siblings('.user-account').text()
    };
    $("#userAccount").val($(this).siblings('.user-account').text());
    history.replaceState('','',''+location.origin+location.pathname+'?userAccount='+data.user_account);
    //获取数据
    getTableData('order/agents/get_orders', data, function () {
    });
});
//页面点击状态栏
$(document).on('click', '.status li', function () {
    count_page = null;
    data.order_state=$(this).index();
    //状态栏的对应到搜索中
    $productState.setLabel($(this).index());
    data.order_state=$productState.getValue();
    //获取数据
    getTableData('order/agents/get_orders', data);
});
//解卡
$(document).on('click', '#openOrder', function () {
    var _this = $(this);
    var options = {
        content: '确认' + _this.text() + '？',
        yes: function () {
            _this.getButtonLoading();
            var data = {
                order_id: _this.parents('.product').attr('data-id')
            };
            getChangeData('order/agents/unFreeze', data, _this, function () {
                //修改完只刷新该条
                getOneDate(data.order_id);
            });
        }
    };
    $(this).minConfirmBox(options);
});
//锁卡
$(document).on('click', '#closeOrder', function () {

    var _this = $(this);
    var options = {
        content: '确认' + _this.text() + '？',
        yes: function () {
            _this.getButtonLoading();
            var data = {
                order_id: _this.parents('.product').attr('data-id')
            };
            getChangeData('order/agents/freeze', data, _this, function () {

                //修改完只刷新该条
                getOneDate(data.order_id);
            });
        }
    };
    $(this).minConfirmBox(options);
});
//拉黑
$(document).on('click', '#toBlack', function () {
    var _this = $(this);
    var options = {
        content: '确认' + _this.text() + '？',
        yes: function () {
            _this.getButtonLoading();
            var data = {
                order_id: _this.parents('.product').attr('data-id')
            };
            getChangeData('order/agents/addBlack', data, _this, function () {
                //修改完只刷新该条
                getOneDate(data.order_id);
            });
        }
    };
    $(this).minConfirmBox(options);
});
//停卡
$(document).on('click', '#stopOrder', function () {
    var _this = $(this);
    var options = {
        content: '确认' + _this.text() + '？',
        yes: function () {
            _this.getButtonLoading();
            var data = {
                order_id: _this.parents('.product').attr('data-id')
            };
            getChangeData('order/agents/shutdown', data, _this, function () {
                //修改完只刷新该条
                getOneDate(data.order_id);
            });
        }
    };
    $(this).minConfirmBox(options);
});
//快速撤单
$(document).on('click', '#quickReset', function () {
    var _this = $(this);
    var order_id = _this.parents('.product').attr('data-id');
    var actualMoney = 0; //实际金额
    var agentsGetMoney = 0;//代理商获取的金额
    var customRate = 0;//商家自定义分成
    var ownerGetMoney = 0;//号主获得的金额
    //跳出弹窗
    $('#reset').removeClass('hide');
    $('#reset .form-pop').css({
        marginTop: -$('#reset .form-pop')[0].offsetHeight / 2,
        marginLeft: -$('#reset .form-pop')[0].offsetWidth / 2
    })

    //获取原本订单的金额信息
    getFormData('agents/money/out_money_change/order',{order_id: _this.parents('.product').attr('data-id')},null,function (json) {
        actualMoney = json.object.actualMoney; //实际金额
        agentsGetMoney = json.object.agentsGetMoney;//代理商获取的金额
        customRate = json.object.customRate;//商家自定义分成
        ownerGetMoney = json.object.ownerGetMoney;//号主获得的金额
    });
    //确定 快速撤单
    $(document).on('click', '#resetConfirm', function () {
        var _this = $(this);
        var data = {
            order_id: order_id,
            return_money: Number($("#returnMoney").val()) || agentsGetMoney,
            owner_return_money: Number($("#ownerReturnMoney").val()) || ownerGetMoney
        };
        $('.pop-bg').addClass('hide');
        getChangeData('order/agents/cancle', data, _this,function () {
            getOneDate(order_id);
        });
    });
});
//续租
$(document).on('click', '#goOn', function () {
    var _this = $(this);
    //跳出弹窗
    $('#goOnRent').removeClass('hide');
    $('#goOnRent .form-pop').css({
        marginTop: -$('#goOnRent .form-pop')[0].offsetHeight / 2,
        marginLeft: -$('#goOnRent .form-pop')[0].offsetWidth / 2
    });

    //确定 续租
    $(document).on('click', '#goOnRentConfirm', function () {
        var data = {
            order_id: _this.parents('.product').attr('data-id'),
            actual_money: $('#rentMoney').val() || 0,
            is_rate: $enjoySharing.getActive() == 0 ? 1 : 0
        };
        var time = $("#rentTime").val();
        var i = time.indexOf("+");
        if (i !== -1) data.relet_hours = parseInt(time.slice(0, i) * 60) + parseInt(time.slice(i + 1)) || 0;
        else data.relet_hours = time * 60 || 0;
        data.relet_hours = parseInt(data.relet_hours / 60);//以后改成接口接收的时分钟要去掉
        getChangeData('order/agents/relet', data, _this,function () {
            getOneDate(data.order_id);
            $('#goOnRent').addClass('hide');
        });
    });
});
//上号器术语
$(document).on('click', '#activation', function () {
    $('#shortContent').val();
    count_page = null;
    var _this = $(this);
    //获取表格数据
    var data = {
        page: 1,
        rows: 5
    };
    getPopTableData('agents/short_cut/gets', data);
    function getPopTableData(url, data, func) {
        confirmAddProto(count_page, data, 'count_page');
        $.ajax({
            url: spliceUrl('agents/short_cut/gets'),
            dataType: 'JSON',
            type: 'POST',
            data: data,
            xhrFields: {withCredentials: true},
            beforeSend: function () {
            }
        }).done(function (json) {
            if (json.content === 1) {
                count_page = isChangeVariable(count_page, json.countPage);//总页数
                //分页插入
                if (count_page >= 2) {
                    $('#upCode').find('.pop-pages').html('');
                    $('#upCode').find('.pop-pages').pagination({
                        pageCount: count_page,
                        jump: true,
                        coping: true,
                        current: data.page,
                        prevContent: '上一页',
                        nextContent: '下一页',
                        callback: function (api) {
                            data.page = api.getCurrent();
                            getPopTableData(url, data, func)
                        }
                    });
                } else {
                    $('#upCode').find('.pop-pages').html('');
                    $('#upCode').find('.pop-pages').hide();
                }
                json.window = window;
                var html = template('uppopTbodyTemplate', json);
                $('#upCode').find('#upCodeTBody').html(html);
                $('#upCode').find('#upCodeTBody').show();
                $('#upCode').find('.pop-pages').show();

                //获取订单信息
                var data2 = {
                    page: 1,
                    rows: 10,
                    order_state: 0,
                    order_keywords: _this.parents('.product').attr('data-id')
                };
                $.ajax({
                    url: spliceUrl('order/agents/get_orders'),
                    type: 'POST',
                    dataType: 'JSON',
                    async: false,
                    data: data2,
                    xhrFields: {withCredentials: true}
                })
                    .done(function (json) {
                        var shortcuts = [
                            {
                                "content": "zoneName-name",
                                "text": "游戏名称"
                            }, {
                                "content": "zoneName-par",
                                "text": "游戏大区"
                            }, {
                                "content": "zoneName-chi",
                                "text": "游戏子区"
                            }, {
                                "content": "productTitle",
                                "text": "账号标题"
                            }, {
                                "content": "nickName",
                                "text": "账号别名"
                            }, {
                                "content": "createTime",
                                "text": "订单开始时间"
                            }, {
                                "content": "endTime",
                                "text": "订单结束时间"
                            }, {
                                "content": "totalTime",
                                "text": "订单时长"
                            }, {
                                "content": "orderCdk",
                                "text": "激活码"
                            }, {
                                "content": "shopName",
                                "text": "店铺名"
                            }, {
                                "content": "orderId",
                                "text": "产品编号"
                            }, {
                                "content": "roleName",
                                "text": "角色名"
                            }];
                        var zoneName = json.orderAgentsDtos[0].zoneName;
                        var z = zoneName.split("/");
                        var first = true;//这样点击copy2就只执行一次


                        $(document).on('click', '.copy', function () {
                            var short = $(this).parents('tr').find('.shortcut-content').attr('title');
                            $.each(shortcuts, function (index, s) {
                                if (s.text == "游戏名称" || s.text == "游戏大区" || s.text == "游戏子区") {
                                    short = short.replace("{游戏名称}", z[0]);
                                    short = short.replace("{游戏大区}", z[1]);
                                    short = short.replace("{游戏子区}", z[2]);
                                } else if (s.text == "订单开始时间" || s.text == "订单结束时间") {
                                    short = short.replace("{" + s.text + "}", getFullTimeF(json.orderAgentsDtos[0][s.content]));
                                } else {
                                    short = short.replace("{" + s.text + "}", json.orderAgentsDtos[0][s.content]);
                                }
                            });
                            $('#upCode').find('.pop-info textarea').val(short);
                            $('.copy').text('选择').removeClass('copy2');
                            $(this).text('已选择').addClass('copy2');

                            if (first) {
                                first = false;
                                $('.copy2').trigger('click');
                            }
                            //选择按钮
                            var clipboard = new Clipboard('.copy2');
                            clipboard.on('success', function () {
                                //复制成功
                                var options = {
                                    message: '复制成功 ，可直接粘贴',
                                    state: 1
                                };
                                messageTip(options);
                                first = true;
                            });

                            clipboard.on('error', function () {
                                var options = {
                                    message: '复制失败，请手动复制',
                                    state: 2
                                };
                                messageTip(options);
                            });
                        });
                    });

            } else {
                //获取不到数据
                $('#upCode').find('table').parent().getUndefined({text: json.data || '服务器出错'});
            }
            $('.loading').remove();
        }).fail(function () {
            //去掉加载（此处定不会和页面上的loading有冲突）
            $('.loading').remove();
            $('#upCode').find('table').parent().getUndefined({text: json.data || '服务器出错'});
        });


    }
    //复制按钮
    var clipboard = new Clipboard('#copyBtn');
    clipboard.on('success', function () {
        //复制成功
        var options = {
            message: '复制成功 ，可直接粘贴',
            state: 1
        };
        messageTip(options);
        first = true;
    });

    clipboard.on('error', function () {
        var options = {
            message: '复制失败，请手动复制',
            state: 2
        };
        messageTip(options);
    });

});
//刷新当条信息
function getOneDate(id) {
    var data = {
        page: 1,
        rows: 10,
        order_state: 0,
        order_keywords: id
    };
    $('.status>ul>li:first-child').addClass('active').siblings('li').removeClass('active')
    $('[data-id='+id+']').getLoadingTable();
    getFormData('order/agents/get_orders', data,null, function (json) {
        var html = template('tbodyTemplate', json);
        $(html).replaceAll($('[data-id='+id+']'));
    });
}
