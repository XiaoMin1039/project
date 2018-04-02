var rows = 10; //一页条数
var count_page = null;//总页数
var data = {};

$(function () {
    data = {
        type:1,
        page:1,
        rows:rows
    };
    //带参数跳转页面
    if (getQueryString('orderId')) {
        var orderId = getQueryString('orderId');
        data.type = 0;
        data.order_id = filtrate(orderId, 1);
        $('#orderId').val(orderId);
    }
    //获取数据
    getTableData('agents/screen/order/process/gets',data);
});
//点击状态栏
$(document).on('click','.status li',function () {
    count_page = null;
    data = {
        page:1,
        rows:rows
    };
    $type.setLabel($(this).index());
    data.order_id = $('#orderId').val();
    data.type=$type.getValue();
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
    //获取数据
    getTableData('agents/screen/order/process/gets',data);
});
//点击搜索
$(document).on('click','#search',function () {
    count_page = null;
    data={
        page:1,
        rows:rows,
        order_id:$('#orderId').val(),
        type:$type.getValue()
    };
    //获取数据
    getTableData('agents/screen/order/process/gets',data);
    //状态栏也跟着改变
    $('.status li').removeClass('active').eq($('#type .cur').index()).addClass('active');
});

