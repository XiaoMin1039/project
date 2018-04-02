$(function () {
    //时间选择插件
    timeFrame();
    $state = $('#state').dropDown({
        items: [
            {value: '0', label: '所有状态'},
            {value: '1', label: '处理中'},
            {value: '2', label: '处理成功'},
            {value: '3', label: '处理失败'}
        ]
    });
    $type = $('#type').dropDown({
        items: [
            {value: '0', label: '所有状态'},
            {value: '1', label: '撤单订单'},
            {value: '2', label: '投诉订单'}
        ]
    });


    $('#orderIdNotice').mouseenter(function () {
        $(this).toolTip({content:'支持多个条件搜索，您可以在订单编号、上号激活码或产品标题，三者中任选其一。进行快速搜索。'})
    });
    $('#stateNotice').mouseenter(function () {
        $(this).toolTip({content:'可选择要搜索的售后状态'})
    });
    $('#typeNotice').mouseenter(function () {
        $(this).toolTip({content:'可选择要搜索的售后分类'})
    });
    $('#timeFrameNotice').mouseenter(function () {
        $(this).toolTip({content:'可选择资金变动时间范围，点击弹出框的左下角“选择时间”还能选择具体的时分秒'})
    });




});