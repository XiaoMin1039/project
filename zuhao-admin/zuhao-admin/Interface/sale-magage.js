var rows = 10; //一页条数
var count_page = null;//总页数
var data = {};

//加载数据
$(function () {
    data = {
        page:1,
        rows:rows
    };
    //获取数据
    getTableData('agents/claim/order/get_orders',data);
});

//点击状态栏
$(document).on('click','.status li',function () {
    count_page = null;
    //状态栏的对应到搜索中
    $state.setLabel($(this).index());
    var fromData = {
        order_id:$('#orderId').val(),
        type:$type.getValue(),
        state:$state.getValue()
    };
    if($("#timeFrameBefore").val()){
        var time = $("#timeFrameBefore").val().split("至");
        fromData.start_time = changeTimeToUnix(time[0]);
        fromData.end_time = changeTimeToUnix(time[1]);
    }
    addRelativeFirst(fromData,data);
    //获取数据
    getTableData('agents/claim/order/get_orders',fromData);
});

//点击search
$(document).on('click','#search',function () {
    count_page = null;
    var _this = $(this);
    _this.getButtonLoading();

    var fromData = {
        order_id:$('#orderId').val(),
        type:$type.getValue(),
        state:$state.getValue()
    };
    if($("#timeFrameBefore").val()){
        var time = $("#timeFrameBefore").val().split("至");
        fromData.start_time = changeTimeToUnix(time[0]);
        fromData.end_time = changeTimeToUnix(time[1]);
    }
    //获取数据
    getTableData('agents/claim/order/get_orders',data,function () {
        _this.deleteButtonLoading();
        //状态栏也跟着改变
        $('.status li').removeClass('active').eq($('#state .cur').index()).addClass('active');
    });
});


