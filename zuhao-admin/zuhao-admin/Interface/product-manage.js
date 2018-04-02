var rows = 10; //一页条数
var count_page = null;//总页数
var dataBase = {
    page:1,
    rows:rows
};
//加载数据
$(function () {
    var data={};
    if (getQueryString('productId')) {
        var productId = getQueryString('productId');
        data={
            product_state:0,
            product_keywords:filtrate(productId, 1)
        };
        $('#keyword').val(productId);
    }
    //获取数据
    addRelativeFirst(data,dataBase);
    getTableData('agents/product',data);
});

//点击状态栏
$(document).on('click','.status li',function () {
    count_page = null;
    var data={
        product_state:$(this).index()
    };
    if(data.product_state == 1){
        data.product_state = 100
    }else if(data.product_state > 1 && data.product_state != 100){
        data.product_state = data.product_state - 1;
    }
    var formData = {
        product_keywords:$('#keyword').val(),
        zizone:$gameSelect.getValue(),
        product_type:$accountType.getValue(),
        game_account:$('#gameAccount').val(),
        role_name:$('#gameRole').val(),
        user_link_way:$('#userWay').val(),
        user_pay_way:$('#payAccount').val()
    };
    addRelativeFirst(data,dataBase);
    addRelativeFirst(data,formData);
    //状态栏的对应到搜索中
    $state.setLabel($(this).index());

    getTableData('agents/product',data);
});

//点击搜索栏
$(document).on("click",'#search',function () {
    count_page = null;
    var _this = $(this);
    _this.getButtonLoading();
    var formData = {
        product_keywords:$('#keyword').val(),
        product_state:$state.getValue(),
        zizone:$gameSelect.getValue(),
        product_type:$accountType.getValue(),
        game_account:$('#gameAccount').val(),
        role_name:$('#gameRole').val(),
        user_link_way:$('#userWay').val(),
        user_pay_way:$('#payAccount').val()
    };
    addRelativeFirst(formData,dataBase);
    //获取数据
    getTableData('agents/product',formData,function () {
        _this.deleteButtonLoading();
    });
});
//修改别名
$(document).on('click','#editNickname',function () {
    var _this = $(this);
    var options={
        confirm:function(val){
            var data = {
                update_data:val,
                product_id:_this.parents('tr').attr('data-id'),
                option_type:12
            };
            getFormData('agents/product/option',data,null,function (json) {
                  if(json.content === 1){
                      messageTip('修改成功')
                      _this.prev().text(val)
                  }else{
                      var options = {
                          message: returnError(json.content),//ele.text() + '失败',
                          state: 2,//1、cssDemo、3三种状态:1成功,2失败,3警告
                      };
                  }
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
//修改时租
$(document).on('click','.editHRent',function (e) {
    e.stopPropagation();
    var options=[{
        value:'0',
        type:'hRent',
        unit:{
            unit:'小时',
            max:100,
            min:0,
            content:'',
            array: [0, 1, 3, 4, 10, 100],
            decimal:false
        },
        yes:function (val) {
            console.log(val);//input框中的val值
        }
    }];
    $(this).select(options);
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
            var data = {
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
    var data = {
        product_id: _this.parents('tr').attr('data-id'),
        option_type:17
    };
    getChangeData('agents/product/option',data,_this,function () {
        _this.deleteButtonLoading();
        _this.parents('tr').addClass('deleted');
     });
    $(this).minConfirmBox(options);
});