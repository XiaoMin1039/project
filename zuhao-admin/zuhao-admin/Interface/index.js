var rows = 10; //一页条数
var count_page = null;//总页数
var data = {};
$(function () {

   //接入四个框框数据
    $.ajax({
        type:'post',
        url:spliceUrl('agents/detail/info/sales/get'),
        dataType:'JSON',
        xhrFields:{withCredentials:true},
    })
        .done(function (json) {
            if (json.content === 1) {
                var dto = json.dto;
                //店铺名
                $("#shopName").text(dto.shopName);
                //进行中的订单
                if(dto.rentingNum){
                    $("#rentingNum").text(dto.rentingNum);
                }
                //危险进程拦截

                //店铺账号信息
                $('#groundingNum').text(dto.groundingNum);
                $('#audingNum').text(dto.audingNum);
                $("#stateErrorNum").text(dto.stateErrorNum);
                //财务基本信息
                $("#availableBailMoney").text(dto.usableMoney);
                $("#unavailableBailMoney").text(dto.unusableMoney);
                // 昨日销售业绩
                $("#finishNum").text(dto.yesterdayFinishNum);
                $("#cancleNum").text(dto.yesterdayCancleNum);
                $("#complainNum").text(dto.yesterdayComplainNum);
                $("#saleMoney").text(dto.yesterdaySaleMoney);
                $("#profitMoney").text(dto.yesterdayProfitMoney);
                // 今日销售业绩
                $("#todayFinishNum").text(dto.todayFinishNum);
                $("#todayCancleNum").text(dto.todayCancleNum);
                $("#todayComplainNum").text(dto.todayComplainNum);
                $("#todaySaleMoney").text(dto.todaySaleMoney);
                $("#todayProfitMoney").text(dto.todayProfitMoney);
             }
        })



});