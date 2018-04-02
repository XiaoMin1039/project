$(function () {
    //时间选择插件
    timeFrame();
    //页面下拉框
    $moneyWay=$('#moneyWay').dropDown({
        items:[
            {value:'0',label:'所有 '},
            {value:'1',label:'用户提现'},
            {value:'2',label:'租金扣除'},
            {value:'3',label:'押金扣除'},
            {value:'4',label:'充值'},
            {value:'5',label:'冻结'},
            {value:'6',label:'租金'},
            {value:'7',label:'押金返回'},
            {value:'8',label:'保险扣除'},
            {value:'9',label:'保险返回'},
            {value:'10',label:'租金分成'}
        ]
    });

    $('#moneyWayNotice').mouseenter(function () {
        $(this).toolTip({content:'下单方式有多种，请选择要查询的方式'})
    });
    $('#timeFrameBeforeNotice').mouseenter(function () {
        $(this).toolTip({content:'可选择资金变动时间范围，点击弹出框的左下角“选择时间”还能选择具体的时分秒'})
    });

});