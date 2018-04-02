$(function () {
    //限定十五天前到今日
    // laydate.render({
    //     elem: '#after'
    //     ,min: -15
    //     ,max: 0
    //     ,theme:'#1E9FFF'
    //     ,format: 'yyyy-MM-dd HH:mm:ss'
    //     ,showBottom: false
    // });
    //日期范围
    var date = laydate.render({
        elem: '#test1'
        ,min: -15
        ,max: 0
        ,format: 'yyyy-MM-dd'
        ,range: '到'
        ,done: function(value, date,endDate){
            date[0] = date;
            date[1] = endDate;
            return date;
        }
    });
    //具体到时分秒，但是要自己选择
    // laydate.render({
    //     elem: '#test1'
    //     ,type: 'datetime'
    //     ,min: 0
    //     ,max: '2099-12-31 23:59:59'
    //     ,theme:'#1E9FFF'
    //     ,btns: ['now','confirm']
    // });



});