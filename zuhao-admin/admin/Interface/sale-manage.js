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
    getTableData('agents/message/gets',data);
});


//点击状态栏
$(document).on('click','.status li',function () {
    count_page = null;
    data = {
        page:1,
        rows:rows,
        state:$(this).index()
    };
    //获取数据
    getTableData('agents/message/gets',data);
});