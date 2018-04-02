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
    getTableData('agents/md5/gets',data);
});

//点击search
$(document).on('click','.search',function () {
    count_page = null;
    var _this = $(this);
    _this.getButtonLoading();
    data={
        page:1,
        rows:rows,
        md5:$('#searchword').val()
    };
    //获取数据
    getTableData('agents/md5/gets',data,function () {
        _this.deleteButtonLoading();
    });
});


//点击状态栏
$(document).on('click','.status li',function () {
    count_page = null;
    data = {
        page:1,
        rows:rows,
        rule_status:$(".user-order-position .active").index()
    };
    //获取数据
    getTableData('agents/md5/gets',data);
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
                md5_id:_this.parents('tr').attr('data-id')
            };
            getChangeData('agents/md5/delete',data,_this,function () {
                _this.deleteButtonLoading();
                _this.parents('tr').addClass('deleted');
            });
        }
    };
    $(this).minConfirmBox(options);
});


//确定添加黑名单
$(document).on('click','#confirm',function () {
    var data = {
        md5: $('#MD5').val(),//账号
        is_valid:1+Number($accountType.getValue())//类型
    };
    formGetData('#confirm',1,data,'agents/md5/add',  function (json) {
        if(json.content === 1){
            history.go(0);
            messageTip('增加程序黑名单成功');
        }else if(json.content === 751){
            showErrorTip(1,'#MD5Tip')
        }else{
            messageTip({content:'数据错误，请重试！'})
        }
    });
});


//点击 停用 或者 开启 按钮
$(document).on('click','#end,#start',function () {
    var _this = $(this);
    // 询问是否修改
    var options={
        content:'确认'+_this.text()+'该程序黑名单吗？',
        yes:function(){
            //获取增删改查的数据
            _this.getButtonLoading();
            data = {
                md5_id: _this.parents('tr').attr("data-id"),
                is_valid: _this.attr("data-id") == 1 ? 2 : 1
            };
            getChangeData('agents/md5/edit',data,_this,function(){
                _this.parents('tr').find('td').eq(0).text(_this.text());
                _this.text(_this.text() == '停用' ? '启用' : '停用').attr('id',_this.attr('id') == 'end' ? 'start' : 'end').attr('data-id',data.is_valid);
            });
        }
    };
    $(this).minConfirmBox(options);
});