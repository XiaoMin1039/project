var rows = 9; //一页条数
var count_page = null;//总页数
var data = {};

$(function () {
    data = {
        page:1,
        rows:rows
    };
    //获取数据
    getTableData('agents/message/gets',data,function () {
        //设置第一条信息是已经选中阅读的
        if($('.shop-get-info-title .title-item:first-child').length > 0){
            $('.shop-get-info-title .title-item:first-child').trigger('click');
        }
    });
});

//点击状态栏
$(document).on('click','.status li',function () {
    count_page = null;
    data = {
        page:1,
        rows:rows,
        status:$(this).index()-1
    };
    $('.shop-get-info-content').addClass('hide');
    //获取数据
    getTableData('agents/message/gets',data,function () {
        //如果获取到的站内信长度大于0
        if($('.shop-get-info-title .title-item:first-child').length > 0){
            //设置第一条信息是已经选中阅读的
            $('.shop-get-info-title .title-item:first-child').trigger('click');
        }
    });
});

//点击左侧公告信息
$(document).on('click','.title-item',function () {
    var _this = $(this);
    _this.addClass('title-item-select');
    $('.title-item').removeClass('title-item-reading');
    _this.addClass('title-item-reading');

    //向服务器传已读状态
    data = {
        message_id: $(this).attr('data-id')
    };
    $.ajax({
        url: spliceUrl('agents/message/get'),
        dataType: 'JSON',
        type: 'POST',
        data: data,
        xhrFields :{withCredentials:true}
    });

    $('.shop-get-info-content').removeClass('hide');
    //显示右侧信息
    $('.content-title').text(_this.find('.message-content span:first-child').text());
    $('.content-type span:first-child').text(_this.find('.message-type').text());
    $('.content-type span:last-child').text(_this.find('.message-time').text());
    $('.content-info').text(_this.find('.message-content span:last-child').text());
});







