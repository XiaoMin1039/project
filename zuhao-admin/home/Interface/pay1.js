/**
 * Created by ching on 2017/11/23.
 */
$(function () {
    var realRental,productId=getQueryString('productId'),timeType=getQueryString('time_type') == 6 ? 6 :parseInt(getQueryString('time_type')) + 1;
    if(getQueryString('startTime') != '' && getQueryString('type') == 0){
        var startTime = getQueryString('startTime');
    }
    $('#sixDig').sixDig();
    var product = {
        product_id:productId,
    };
    //获取押金，产品标题，产品，可用余额
    function runAsync1(){
        var p = new Promise(function(resolve, reject){
            getFormData('product/get_id',product,null,function (json) {
                if(json.content === 1){
                    var data=json.searchProductDtos[0];
                    $("#productTitle").text(data.productTitle);
                    $("#productTitle").attr("title",data.productTitle);
                    $("#productTitle").attr('href','/product/' + data.productId + '.html');
                    $("#deposit").text(data.deposit+'元');
                    resolve()
                }
            });
        });
        return p;
    }
    function runAsync2(){
        var p = new Promise(function(resolve, reject){
            var rental = {
                product_id:productId,
                duration:getQueryString('orderTime') || 1,
                time_type:parseInt(getQueryString('time_type')) + 1
            };
            if(getQueryString('time_type') == 6){
                var rental=getQueryString('rental');
                $("#rental").text(rental+'元');
                $("#allPay").text((parseFloat(rental) + parseFloat($('#deposit').text())).toFixed(2));
                $("#allPay1").text($('#allPay').text() + '元');
                resolve()
            }else{
                getFormData('order/user/get_user_price',rental,null,function (json) {
                    realRental = json.price;
                    $("#rental").text(realRental);
                    $("#allPay").text((parseFloat(rental) + parseFloat($('#deposit').text())).toFixed(2));
                    $("#allPay1").text($('#allPay').text() + '元');
                    resolve()
                })
            }
        });
        return p;
    }
    runAsync1().then(function(){
                    return runAsync2();
                }).then(function () {
                return getMoney()
            });
    // getFormData('product/get_id',product,null,function (json) {
    //     if(json.content === 1){
    //         var data=json.searchProductDtos[0];
    //         $("#productTitle").text(data.productTitle);
    //         $("#productTitle").attr("title",data.productTitle);
    //         $("#productTitle").attr('href','/product/' + data.productId + '.html');
    //         $("#deposit").text(data.deposit+'元');
    //         var rental = {
    //             product_id:getQueryString('productId'),
    //             duration:getQueryString('orderTime') || 1,
    //             time_type:parseInt(getQueryString('time_type')) + 1
    //         };
    //         if(getQueryString('time_type') == 6){
    //             var rental=getQueryString('rental');
    //             $("#rental").text(rental+'元');
    //             $("#allPay").text(parseFloat(rental) + parseFloat($('#deposit').text()).toFixed(2));
    //             $("#allPay1").text($('#allPay').text() + '元');
    //         }else{
    //             getFormData('order/user/get_user_price',rental,null,function (json1) {
    //                 var realRental = json1.price;
    //                 $("#rental").text(realRental);
    //                 $("#allPay").text(parseFloat(realRental) + parseFloat($('#deposit').text()).toFixed(2));
    //                 $("#allPay1").text($('#allPay').text() + '元');
    //             })
    //         }
    //     }
    // });
    if(getQueryString('orderTime') == ''){
        if(getQueryString('time_type') == 1){
            $("#orderTime").text('包夜（晚上11:00至次日7:00）');
        }else if(getQueryString('time_type') == 2){
            $("#orderTime").text('日租（24小时）');
        }else if(getQueryString('time_type') == 6){
            $("#orderTime").text(getQueryString('length')+'小时');
        }
    }else{
        $("#orderTime").text(getQueryString('orderTime')+'小时');
    }
    if(getQueryString('type') == 0){
        $("#orderType").text('即时订单').attr('data-type',1);
    }else if(getQueryString('type') == 1){
        $("#orderType").text('预约订单').attr('data-type',2);
    }

    $('#pay').on('click',function (e) {
        e.preventDefault();
        setOrder();
    });
    $(document).on('keydown',function (e) {
        if(e.keyCode == 13){
            setOrder()
        }
    });
    $("#sixDig #payPassword").on('input',function(){
        if($("#sixDig #payPassword").val().length === 6){
            $('#pay').removeClass('ban-click')
        }else{
            $('#pay').addClass('ban-click')
        }
    });
    function setOrder(){
        if($("#pay").hasClass('ban-click')){
            return;
        }
        var payData={
            time_type:timeType,
            is_reserve:$("#orderType").attr('data-type'),
            length:parseFloat($('#orderTime').text()) || 1,
            pay_pass:$("#sixDig #payPassword").val(),
            rental: parseFloat($('#rental').text()),
            product_id:productId,
            start_time:startTime
        };
        console.log(payData,realRental)
        getChangeData('order/user/add',payData,$("#pay"),function (json) {
            location.href = '/zudahao/pay2.html?orderId=' + json.data;
        })
    }
});
function getMoney(ele){
    var p = new Promise(function(resolve, reject){
        $("#rechargeUsable").text("加载中");
        getFormData('user/get_money_info',null,ele,function (json) {
            if(json.content === 1){
                var data=json.dtos[0];
                $("#rechargeUsable").text(parseFloat(data.usableMoney).toFixed(2) + '元');
                if(data.isUsePayPass == 0){
                    $('#pay').removeClass('ban-click');
                    $('#sixDig').addClass('hide').prev().removeClass('hide');
                }
            }else{
                $("#rechargeUsable").text('获取失败');
            }
            resolve()
        })
    });
    return p;
}