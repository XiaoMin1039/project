var rows = 1; //一页条数
var count_page = null;//总页数
var data = {} , type,adminHrental;//type 平台还是自建 adminHrental 时租价格

$(function () {
    var data = {
        page:1,
        rows:rows,
        product_keywords: getQueryString('productId')
    };
    //获取宝贝数据
    getTableData('agents/product', data,function (json) {
        if(json.content === 1){
            let data=json.agentsProductDtos[0];
            type = data.productType;
            setAddSub(data.miniHours);
            adminHrental=data.adminHrental;
            if(data.productType == 1){
                var labelData=data.rate+"%（预设）";
                var rateDOptions=[{
                    value: '0',
                    label: labelData,
                    type: 'primary'
                },{
                    value: '1',
                    label: '号主不分成',
                    type: 'primary'
                },{
                    value: '2',
                    label: '自定义',
                    type: 'unit',
                    unit: {
                        unit: '%',
                        max: 100,
                        min: 0,
                        array: [10,20, 30,40, 50, 60,70,80,90, 100],
                        decimal: false,
                        multiple:10
                    }
                }];
                $rate=$('#rate').select(rateDOptions,'0');
                $('#rate').parent().append('<p style="margin-left:36%;">调整分成比例后，后期续租将按照调整后的分成结算。</p>');
                $('#math1').remove();
            }else if(data.productType == 2){
                $('#rate').html('<span class="select-label-active select-label" style="display: inline-block;cursor:auto"><p>'+data.rate+'%</p></span>')
                $('#math2').remove();
            }
            if(data.state == 2){
                setTimeout("$('#rentType').find('span:last-child').click().prev().remove()",0);
                $('#timeFrameSelect').parent().removeClass('hide');
                timeFrame();
            }
            //时间选择插件
            timeFrame();
            $('.form').removeClass('hide');
            setComponent();
        }
    })
});

//下单
$(document).on('click','#createOrder',function () {
    var data={
        product_id:getQueryString('productId'),
        time_type:1,
        is_reserve:$rentType.getActive(),
        consumerLinkAccount:$("#consumerLinkAccount").val(),
        consumerLinkWay:$consumerLinkWay.getValue(),
        source:$source.getValue(),
        serializable:$("#serializable").val(),
        actual_money:$("#realMoney").val(),
        note:$("#note").val(),
        length:$("#order_time").val(),
        pay_pass:123123
    };
    if($postTime.getActive() == 0){
        data.give_miniutes = 0;
    }else if($postTime.getActive() == 1){
        data.give_miniutes = $postTime.getValue();
    }else if($postTime.getActive() == 2){
        data.give_miniutes = parseInt($postTime.getValue()) * 60;
    }
    if(type == 1){
        if($rate.getActive() == 0){
            data.customer_rate = parseInt($('#rate').text());
        }else if($rate.getActive() == 1){
            data.customer_rate = 100;
        }else if($rate.getActive() == 2){
            data.customer_rate = $rate.getValue();
        }
    }else if(type == 2){
        data.customer_rate = $("#rate p").text().replace(/[^0-9]/ig,'');
    }
    $('#realMoney').blur();
    if($rentType.getActive() == 1){
        if ($("#timeFrameSelect").val()) {
            var time = $("#timeFrameSelect").val().split("至");
            data.start_time = changeTimeToUnix(time[0]);
        }
        $('#timeFrameSelect').blur();
        if($('.form').find('.img-bingo[data-id="popTip"]').length == 2){
            $(this).getButtonLoading();
            getChangeData('order/agents/add',data,$(this),function (json) {
                window.location.href='./order_manage.html?orderId='+json.data+'&is_reserve='+data.is_reserve;
            })
        }
    }else{
        if($('#realMoneyTip').hasClass('img-bingo')){
            $(this).getButtonLoading();
            getChangeData('order/agents/add',data,$(this),function (json) {
                window.location.href='./order_manage.html?orderId='+json.data+'&is_reserve='+data.is_reserve;
            })
        }
    }
});

//修改别名
$(document).on('click','#editNickname',function () {
    var _this = $(this);
    var options={
        confirm:function(val){
            _this.getButtonLoading();
            var data = {
                update_data:val,
                product_id:_this.parents('tr').attr('data-id'),
                option_type:12
            };
            getChangeData('agents/product/option',data,_this,function () {
                _this.prev().text(val)
            })
        },
        content:'输入新的别名',
        inputTip:'请输入别名'
    };
    _this.modifyPop(options)
});
//改密
$(document).on('click','#editPass',function () {
    var _this = $(this);
    var options={
        confirm:function(val){
            _this.getButtonLoading();
            var data = {
                update_data:val,
                product_id:_this.parents('tr').attr('data-id'),
                option_type:11
            };
            getChangeData('agents/product/option',data,_this,function () {
                _this.prev().text(val)
            })
        },
        content:'输入新的密码',
        inputTip:'请输入密码'
    };
    _this.modifyPop(options)
});
//上架+下架
$(document).on('click','#up,#down',function () {

    var _this = $(this);
    var options={
        content:'确认'+_this.text()+'？',
        yes:function(){
            _this.getButtonLoading();
            var data = {
                product_id:_this.parents('tr').attr('data-id')
            };
            //如果是点击 上架 按钮 则就是 15,下架 16
            _this.attr('id') == 'up' ? data.option_type = 15 : data.option_type = 16;

            getChangeData('agents/product/option',data,_this,function () {
                _this.attr('id') == 'up' ? _this.parents('tr').find('.state').text('正常可租') : _this.parents('tr').find('.state').text(_this.text());
                _this.text(_this.text() == '下架' ? '上架' : '下架').attr('id',_this.attr('id') == 'down' ? 'up' : 'down');
            });
        }
    };
    $(this).minConfirmBox(options);
});
//提交审核+取消审核
$(document).on('click','#postCheck,#quitCheck',function () {
    var _this = $(this);
    var options={
        content:'确认'+_this.text()+'？',
        yes:function(){
            _this.getButtonLoading();
            data = {
                product_id:_this.parents('tr').attr('data-id')
            };
            //如果是点击 提交审核 按钮 则就是 13,取消审核 14
            _this.attr('id') == 'postCheck' ? data.option_type = 13 : data.option_type = 14;

            getChangeData('agents/product/option',data,_this,function () {
                _this.deleteButtonLoading();
                _this.attr('id') == 'postCheck' ? _this.parents('tr').find('.state').text(_this.text()) : _this.parents('tr').find('.state').text('待编辑');
                _this.text(_this.text() == '提交审核' ? '取消审核' : '提交审核').attr('id',_this.attr('id') == 'postCheck' ? 'quitCheck' : 'postCheck');
            });
        }
    };
    $(this).minConfirmBox(options);

});
//删除产品
$(document).on('click','#delete',function () {
    var _this= $(this);
    data = {
        product_id: _this.parents('tr').attr('data-id'),
        option_type:17
    };
    getChangeData('agents/product/option',data,_this,function () {
        _this.deleteButtonLoading();
        _this.parents('tr').addClass('deleted');
    });
    $(this).minConfirmBox(options);
});