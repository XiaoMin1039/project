$(function () {
    $('#orderIdNotice').mouseenter(function () {
        $(this).toolTip({content:'可输入交易管理中的订单编号'})
    });
    $('#stateNotice').mouseenter(function () {
        $(this).toolTip({content:'可输入宝贝管理中的产品编号'})
    });
});