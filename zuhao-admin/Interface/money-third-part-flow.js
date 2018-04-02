var rows = 10; //一页条数
var count_page = null;//总页数
var data = {};

$(function () {
    data = {
        page:1,
        rows:rows
    };
    //获取数据
    getTableData('agents/money/out_money_change/gets',data);
});

//点击search
$(document).on('click','#search',function () {
    count_page = null;
    var _this = $(this);
    _this.getButtonLoading();
    data = {
        page:1,
        rows:rows,
        order_id:$('#orderId').val(),
        product_id:$('#productId').val()
    };
    console.log(data)
    //获取数据
    getTableData('agents/money/out_money_change/gets',data,function () {
        _this.deleteButtonLoading();
    });
});