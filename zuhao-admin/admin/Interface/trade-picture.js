var rows = 12; //一页条数
var count_page = null;//总页数
var data = {
    page: 1,
    rows: rows
};
var orderId = getQueryString('orderId') || 0;
//获取数据
$(function () {
    // var data = {
    //     page: 1,
    //     rows: rows
    // };
    //带参数跳转页面
    if (getQueryString('orderId')) {
        orderId = getQueryString('orderId');
        data.state = 0;
        data.order_keywords = filtrate(orderId, 1);
        $('#searchword').val(orderId);
        $('#orderKeywords').val(orderId);
    }
    //获取数据
    getTableData('agents/screen/order/get_all', data ,function () {
        $('#tbody').find($(".pic-item[data-id="+orderId+"]")).find('#lookPic').trigger('click');
    });
});
//单条件搜索
$(document).on('click', '#search', function () {
    count_page = null;
    var _this = $(this);
    _this.getButtonLoading();

    // var data = {
        // page: 1,
        // rows: rows,
        // order_keywords: $("#searchword").val(),
        // state: $('.status li.active').index()
    // };
    data.order_keywords = $("#searchword").val();
    data.state = $('.status li.active').index();
    //获取数据
    getTableData('agents/screen/order/get_all', data, function () {
        _this.deleteButtonLoading();
    });
});
//多条件搜索
$(document).on('click', '#moreSearch', function () {
    count_page = null;
    var _this = $(this);
    _this.getButtonLoading();

    // data = {
        // page: 1,
        // rows: rows,
        data.order_keywords=$("#orderKeywords").val();
        data.product_keywords= $("#productKeywords").val();
        data.zizone= $gameSelect.getValue();
        data.state= $state.getValue();
        data.user_link_way= $("#linkWay").val();
        data.user_pay_way= $userPayWay.getValue();
        data.screen_state= $screenState.getValue();
    // };
    if ($("#timeFrameBefore").val()) {
        var time = $("#timeFrameBefore").val().split("至");
        data.start_time = changeTimeToUnix(time[0]);
        data.end_time = changeTimeToUnix(time[1]);
    }
    if (data.state >= 5) {
        data.state += 1;
        if (data.state >= 7) {
            data.state = data.state + 2;
            if (data.state >= 10) {
                data.state += 1;
            }
        }
    }
    //状态栏也需跟着改变
    if ($state.getValue() <= 2) {
        $(".status li.active").removeClass('active');
        $(".status li:eq(" + $state.getValue() + ")").addClass('active');
    }

    //获取数据
    getTableData('agents/screen/order/get_all', data, function () {
        _this.deleteButtonLoading();
    });
});
//点击页面上的状态栏
$(document).on('click', '.main .status li', function () {
    count_page = null;
    data.state = $(this).index();
    $state.setLabel($(this).index());
    console.log(data);
    //获取数据
    getTableData('agents/screen/order/get_all', data);
});
//截图
$(document).on('click', '#lookPic,#lookpPicDetailed', function () {
    orderId = $(this).parents('.pic-item').attr('data-id');
    count_page = null;
    var _this = $(this);
    var data = {
        page: 1,
        order_id: $(this).parents('.pic-item').attr('data-id'),
        rows: rows
    };
    //显示弹窗
    $('#tradePictureTemplate').removeClass('hide');
    $('#tradePictureTemplate').find('.message-pop').css({
        marginTop: -$('#tradePictureTemplate').find('.message-pop')[0].offsetHeight / 2,
        marginLeft: -$('#tradePictureTemplate').find('.message-pop')[0].offsetWidth / 2
    });
    getTablePopData('agents/screen/order/get','pictureTemplate',data,$('#tradePictureTemplate'),function(){

        $('#tradePictureTemplate').find('#lightgallery').lightGallery();
        //如果是点击图片
        if(_this.attr('id') == 'lookpPicDetailed'){
            $('#tradePictureTemplate').find('#lightgallery:first-child a').trigger('click');
        }
    });
});
//点击截图状态栏
$(document).on('click', '#tradePictureTemplate .status li', function () {
    $('#tradePictureTemplate .status>ul>li').removeClass('active');
    $(this).addClass('active');
    count_page = null;
    var data = {
        page:1,
        rows:rows,
        order_id: orderId,
    };
    //搜索栏也跟着改变
    if($(this).index() == 0){
        $("#screenState .select_text").attr('data-value',$(this).index());
        $("#screenState .select_text").text('所有截图');
        data.type = 0;
    }else if($(this).index() == 1){
        $("#screenState .select_text").attr('data-value',$(this).index());
        $("#screenState .select_text").text('正常截图');
        data.type = 1;
    }else if($(this).index() == 2){
        $("#screenState .select_text").attr('data-value',$(this).index());
        $("#screenState .select_text").text('危险截图');
        data.type = 2;
    }//显示弹窗
    $('#tradePictureTemplate').removeClass('hide');
    $('#tradePictureTemplate').find('.message-pop').css({
        marginTop: -$('#tradePictureTemplate').find('.message-pop')[0].offsetHeight / 2,
        marginLeft: -$('#tradePictureTemplate').find('.message-pop')[0].offsetWidth / 2
    });
    getTablePopData('agents/screen/order/get','pictureTemplate',data,$('#tradePictureTemplate'),function(){

        $('#tradePictureTemplate').find('#lightgallery').lightGallery();
        // {appendSubHtmlTo:'.lg-sub-html'}
        // $('.lg-sub-html').text('121231212312123123')
    });


});
//拦截
$(document).on('click', '#intercept', function () {
    orderId = $(this).parents('.pic-item').attr('data-id');
    count_page = null;
    var data = {
        type: 1,
        page: 1,
        order_id: $(this).parents('.pic-item').attr('data-id'),
        rows: rows
    };//显示弹窗
    $('#tradeDiaryTemplate').removeClass('hide');
    $('#tradeDiaryTemplate').find('.message-pop').css({
        marginTop: -$('#tradeDiaryTemplate').find('.message-pop')[0].offsetHeight / 2,
        marginLeft: -$('#tradeDiaryTemplate').find('.message-pop')[0].offsetWidth / 2
    });
    getTablePopData('agents/screen/order/process/gets','diaryTemplate',data,$('#tradeDiaryTemplate'),function(){

    });
});
//点击拦截的状态栏
$(document).on('click', '#tradeDiaryTemplate .status li', function () {
    $('#tradeDiaryTemplate .status>ul>li').removeClass('active');
    $(this).addClass('active');
    count_page = null;
    var data = {
        page:1,
        rows:rows,
        order_id: orderId,
        type:$(this).index()+1
    };
    if(data.type == 5){
        $('#thead>tr').html(`
                    <th>时间</th>
                    <th>激活码</th>
                    <th>PC端提示</th>  
        `)
    }else{
        $('#thead>tr').html(`
                    <th>时间</th>
                    <th>危险程度</th>
                    <th>激活码</th>
                    <th>进程或模块名称</th>
                    <th>游戏在线</th>
                    <th>拦截结果</th>  
        `)
    }
    //显示弹窗
    $('#tradeDiaryTemplate').removeClass('hide');
    $('#tradeDiaryTemplate').find('.message-pop').css({
        marginTop: -$('#tradeDiaryTemplate').find('.message-pop')[0].offsetHeight / 2,
        marginLeft: -$('#tradeDiaryTemplate').find('.message-pop')[0].offsetWidth / 2
    });
    // 获取数据要单独写个弹窗的
    getTablePopData('agents/screen/order/process/gets','diaryTemplate',data,$('#tradeDiaryTemplate'));
});
//续租
$(document).on('click', '#goOn', function () {
    var _this = $(this);
    //跳出弹窗
    $('#goOnRent').removeClass('hide');
    $('#goOnRent .form-pop').css({marginTop:-$('#goOnRent .form-pop')[0].offsetHeight/2,marginLeft:-$('#goOnRent .form-pop')[0].offsetWidth/2});

    //确定 续租
    $(document).on('click', '#goOnRentConfirm', function () {
        var data={
            order_id: _this.parents('.pic-item').attr('data-id'),
            actual_money:$('#rentMoney').val() || 0,
            is_rate:$enjoySharing.getActive() == 0 ? 1 : 0
        };
        var time = $("#rentTime").val();
        var i = time.indexOf("+");
        if(i !== -1) data.relet_hours=parseInt(time.slice(0,i)*60)+parseInt(time.slice(i+1)) || 0;
        else data.relet_hours=time*60 || 0;
        data.relet_hours=parseInt(data.relet_hours/60);//以后改成接口接收的时分钟要去掉
        getChangeData('order/agents/relet', data, _this,function () {
            getOneDate(data.order_id);
            $('#goOnRent').addClass('hide');
        });
    });
});
//历史
var destopFiles;
$(document).on('click', '#history', function () {
    orderId = $(this).parents('.pic-item').attr('data-id');
    count_page = null;
    data = {
        page: 1,
        rows: rows,
        order_id: $(this).parents('.pic-item').attr('data-id')
    };//显示弹窗
    $('#tradeHistoryTemplate').removeClass('hide');
    $('#tradeHistoryTemplate').find('.message-pop').css({
        marginTop: -$('#tradeHistoryTemplate').find('.message-pop')[0].offsetHeight / 2,
        marginLeft: -$('#tradeHistoryTemplate').find('.message-pop')[0].offsetWidth / 2
    });
    getTablePopData('agents/screen/order/history/get','historyTemplate',data,$('#tradeHistoryTemplate'),function(json){
        //查看桌面文件
        destopFiles = json.pcLoginHistories;
    });
});
//点击查看桌面文件
$(document).on('click','#sawDesktopFiles',function () {
    // console.log(json.pcLoginHistories[$(this).parents("tr")].index());
    var html = "";
    $.each(JSON.parse(destopFiles[$(this).parents("tr").index()].destopFiles),function (n,val) {
        html += "<tr><td class='text-limit' title="+val.file+">"+val.file+"</td><td class='text-limit' style='display: table-cell' title="+val.filePath+">"+val.filePath+"</td></tr>"
    });
    //给弹窗显示数据
    $('#tradeDeskTemplate').find('.template').html(html);
    $('#tradeDeskTemplate').find('.template').show();

    $('#tradeDeskTemplate').removeClass('hide');
    $('#tradeDeskTemplate').find('.message-pop').css({
        marginTop: -$('#tradeDeskTemplate').find('.message-pop')[0].offsetHeight / 2,
        marginLeft: -$('#tradeDeskTemplate').find('.message-pop')[0].offsetWidth / 2
    });
});
//解卡
$(document).on('click', '#openOrder', function () {
    var _this = $(this);
    var options = {
        content: '确认' + _this.text() + '？',
        yes: function () {
            _this.getButtonLoading();
            var data = {
                order_id: _this.parents('.pic-item').attr('data-id')
            };
            getChangeData('order/agents/unFreeze', data, _this,function () {
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
                order_id: _this.parents('.pic-item').attr('data-id')
            };
            getChangeData('order/agents/freeze', data, _this, function () {

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
                order_id: _this.parents('.pic-item').attr('data-id')
            };
            console.log(data.order_id)
            getChangeData('order/agents/shutdown', data, _this, function () {
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
                order_id: _this.parents('.pic-item').attr('data-id')
            };
            getChangeData('order/agents/addBlack', data, _this, function () {
                //修改完只刷新该条
                getOneDate(data.order_id);
            });
        }
    };
    $(this).minConfirmBox(options);
});
//刷新当条信息
function getOneDate(id) {
    var data = {
        page: 1,
        rows: 10,
        state: $('.status li.active').index(),
        order_keywords: id
    };
    $('[data-id='+id+']').getLoadingTable();
    $('.status>ul>li:first-child').addClass('active').siblings('li').removeClass('active')
    getFormData('agents/screen/order/get_all', data,null, function (json) {
        var html = template('tbodyTemplate', json);
        $(html).replaceAll($('[data-id='+id+']'));
    });
}