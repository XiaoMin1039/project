var rows = 10; //一页条数
var count_page = null;//总页数
var data = {};

//加载数据
$(function () {
    var data = {
        page:1,
        rows:rows
    };
    //获取数据
    getTableData('agents/account/black/gets',data);
});

//点击search
$(document).on('click','.search',function () {
    count_page = null;
    var _this = $(this);
    _this.getButtonLoading();

       data = {
        page:1,
        rows:rows,
        account:$("#searchword").val()
    };
    //获取数据
    getTableData('agents/account/black/gets',data,function () {
        _this.deleteButtonLoading();
    });
});

//点击状态栏
$(document).on('click','.status li',function () {
    count_page = null;
    data = {
        page:1,
        rows:rows,
        rule_status:$(this).index()
    };
    //获取数据
    getTableData('agents/rules/gets',data);
});

//点击删除黑名单
$(document).on('click','#delete',function(){
    var _this = $(this);
    var options={
        content:'确认删除该黑名单',
        yes:function(){
            //获取增删改查的数据
            _this.getButtonLoading();
            data = {
                black_id:_this.parents('tr').attr('data-id')
            };
            getChangeData('agents/account/black/delete',data,_this,function () {
                _this.deleteButtonLoading();
                _this.parents('tr').addClass('deleted');
            });
        }
    };
    $(this).minConfirmBox(options);
});

//点击增加黑名单

$(document).on('click','#confirm',function () {
    data = {
        publishId: 1,
        account: $('#account').val(),//账号
        account_type:1+Number($accountType.getValue())//类型
    };
    formGetData('#confirm',1,data,'agents/account/black/add',function (json) {
        if(json.content === 1){
            history.go(0);
            messageTip('增加黑名单成功');
        }else if(json.content === 751){
            showErrorTip(1,'#accountTip')
        }else{
            messageTip({content:'数据错误，请重试！'})
        }
    })
});

