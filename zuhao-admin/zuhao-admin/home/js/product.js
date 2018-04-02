var orderTypeValue=0;
$(function () {

    //租赁类型
    var rentTypeOption = [
        {
            value: '0',
            label: '立即开始',
            type: 'primary'
        }, {
            value: '1',
            label: '预定',
            type: 'primary'
        }
    ];
    $rentType = $('#rentType').select(rentTypeOption, '0');
    $('#rentType').on('click','span',function () {
        orderTypeValue != $(this).attr('data-value') && changOrderType();
    });

    //时长tab切换
    $('#timeSku').on('click','li',function () {
        $(this).addClass('active').siblings('li').removeClass('active');
        changOrderMsg(1);
        $('#time').val(1);
    });

    //菜单tab切换
    $('.product-account-rent-nav').on('click','.product-account-rent-item',function () {
        $(this).addClass('active').siblings('li').removeClass('active');
        $(this).parent().siblings('div').addClass('hide').eq($(this).index()).removeClass('hide');
    });



    //评论tab切换
    $('.product-appraise-menu').on('mouseenter', '.product-appraise-item', function () {
        $('.product-appraise-active-line').css('left', $(this).index() * 120 + 'px');
    }).on('click','.product-appraise-item',function () {
        $('.product-appraise-active-line').css('left', $(this).index() * 120 + 'px');
        $(this).addClass('active').siblings('li').removeClass('active');
    });
    $('.product-appraise-item').on('mouseleave', function () {
        $('.product-appraise-active-line').css('left', $(this).parent().find('.active').index() * 120 + 'px');
    });

});
//创建加减
function setAddSub(num) {
    $('#time').val(num);
    changOrderMsg(num);
    $('#time').click(function (e) {
        e.stopPropagation();
    })
    $('#time').on('input propertychange',function () {
        var $this = $(this);
        var val = $this.val();
        var reg = /[^\d]/g;
        if (reg.test(val)) $this.val(val.replace(reg, ''));
        (parseInt(val) < num) && $this.val(num);
        (parseInt(val) > 99) && $this.val(99);
        changOrderMsg($("#time").val())
    });
    $("#btn-add").on("click", function(e) {
        e.stopPropagation();
        var text = $("#time").val();
        if(parseInt(text) > 98)  return;
        text++;
        $("#time").val(text);
        changOrderMsg(text)
    });
    $("#btn-sub").on("click", function(e) {
        e.stopPropagation();
        var text = $("#time").val();
        if (text <= num) return;
        text--;
        $("#time").val(text);
        changOrderMsg(text)
    });
}
function changOrderMsg(num){
    if($('#timeSku').find('.active').index() == 0){
        $('#rentPrice').text((parseFloat($("#orderPrice").text())*num).toFixed(2));
        $("#orderTime").text(num+'小时');
    }else{
        $('#rentPrice').text(parseFloat($("#timeSku").find('.active>.rent-price').text()).toFixed(2));
        $("#orderTime").text($("#timeSku").find('.active>.rent-time').text());
    }
    $('#defaultRental').text($('#rentPrice').text()+'元');
    $('#allPay').text(parseFloat($('#rentPrice').text())+parseFloat($('#defaultDeposit').text())+'元');
}
function changOrderType() {
    orderTypeValue=$rentType.getActive();
    $("#time").val(1);
    if($rentType.getActive() == 0){
        $('#timeFrameNow').parent().addClass('hide');
        $('#orderType').text('即时订单');
        $("#timeSku li:first-child").addClass('active').siblings('li').removeClass('active');
        $('#timeSku li:not(:first-child)').removeClass('hide');
        changOrderMsg(1);
    }else{
        $('#timeFrameNow').parent().removeClass('hide');
        $("#timeSku li:first-child").addClass('active').siblings('li').removeClass('active');
        $('#timeSku li:not(:first-child)').addClass('hide');
        $('#rent').text('立即预定');
        $('#orderType').text('预定订单');
        changOrderMsg(1);
    }
}