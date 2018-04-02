var rows = 10; //一页条数
var count_page = null;//总页数
var data = {};

$(function () {
    data = {
        page:1,
        rows:rows
    };
    //获取数据
    getTableData('agents/rules/gets',data);
});

//点击search
$(document).on('click','#search',function () {
    count_page = null;
    var _this = $(this);
    _this.getButtonLoading();
    data = {
        page:1,
        rows:rows,
        keywords:$("#searchword").val()
    };
    //获取数据
    getTableData('agents/rules/gets',data,function () {
        _this.deleteButtonLoading();
    });
});

//点击状态栏
$(document).on('click','.status li',function () {
    count_page = null;
    data = {
        page:1,
        rows:rows,
        keywords:$("#searchword").val(),
        rule_status:$(this).index()
    };
    //获取数据
    getTableData('agents/rules/gets',data);
});

//点击删除规则
$(document).on('click','#delete',function(){
    var _this = $(this);
    var options={
        content:'确认删除该规则？',
        yes:function(){
            _this.getButtonLoading();
            data = {
                rules_id:_this.parents('tr').attr('data-id')
            };
            getChangeData('agents/rules/delete',data,_this,function () {
                _this.deleteButtonLoading();
                _this.parents('tr').addClass('deleted');
            });
        }
    };
    $(this).minConfirmBox(options);
});


//确定增加新的规则
$(document).on('click','#confirm',function(){
    var data = {
        rule_type:1+Number($ruleType.getValue()),
        match_type:1+Number($matchType.getValue()),
        handle_type:1+Number($handleType.getValue()),
        keywords:$('#searchword').val()
    };

    getChangeData('agents/rules/add', data, $(this), function () {
        $('.pop-bg').addClass('hide');
    });
});


//点击 停用 或者 开启 按钮
$(document).on('click','#end,#start',function () {
    var _this = $(this);
    // console.log(1)
    // 询问是否修改
    var options={
        content:'确认'+_this.text()+'该规则？',
        yes:function(){
            //获取增删改查的数据
            _this.getButtonLoading();
            data = {
                rule_id: _this.parents('tr').attr("data-id"),
                is_valid: _this.attr("data-id") == 1 ? 2 : 1
            };
            getChangeData('agents/rules/edit',data,_this,function(){
                _this.parents('tr').find('td').eq(0).text(_this.text());
                _this.text(_this.text() == '停用' ? '启用' : '停用').attr('id',_this.attr('id') == 'end' ? 'start' : 'end').attr('data-id',data.is_valid);
            });
        }
    };
    $(this).minConfirmBox(options);
});