var rows = 10; //一页条数
var count_page = null;//总页数
var data = {};


$(function () {
    data = {
        page:1,
        rows:rows
    };
    //获取数据
    getTableData('agents/money/get',data);
});

//搜索
$(document).on('click','#search',function () {
    count_page = null;
    var _this = $(this);
    _this.getButtonLoading();
    data = {
        page:1,
        rows:rows,
        type:$moneyWay.getValue(),
    };
    if($("#timeFrameBefore").val()){
        var time = $("#timeFrameBefore").val().split("至");
        data.start_time = changeTimeToUnix(time[0]);
        data.end_time = changeTimeToUnix(time[1]);
    }
    //获取数据
    getTableData('agents/money/get',data,function () {
        _this.deleteButtonLoading();
    });
});

