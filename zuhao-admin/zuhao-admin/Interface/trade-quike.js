//一共出租的时长（客户购买+赠送）
var data = "";
var totoltime = 0;

$(function () {
    // $('#orderKeywords').blur(function () {
    //     data = {
    //         page:1,
    //         rows:10,
    //         product_keywords:$('#orderKeywords').val()
    //     };
    // getTableData('agents/product', data);
    // });
    intRegularTest($('#time'));


    $('#orderKeywords').blur(function () {
        data = {
            page: 1,
            rows: 10,
            product_keywords: $('#orderKeywords').val(),
            product_state:1
        };
        $.ajax({
            url: spliceUrl('agents/product'),
            dataType: 'JSON',
            type: 'POST',
            data: data,
            xhrFields: {withCredentials: true},
        })
            .done(function (json) {
                if (json.content === 1) {
                    json.window = window;
                    var html = template('tbodyTemplate', json);
                    $('#tbody').html(html);
                    $('#tbody').show();
                } else {
                    //获取不到数据
                    $('#tbody').hide();
                    // $('.main').getUndefined({text: json.data || '哎呦喂，出错了'});
                }
                // $('.loading').remove();

                //如果直接就输入一个唯一的标识
                if (json.agentsProductDtos.length == 1) {
                    $("#orderKeywords").val($(".query").parent().siblings(".nickName").text());
                    $("#hourMoney").val($(".query").parent().siblings(".hrental").text());
                    $(".query").text("已选定").addClass("sel");
                    allMoney();
                    $('#orderKeywordsNotice').removeClass('img-mistake').removeClass('img-question').removeClass('img-notice').addClass('img-bingo')
                    $('#orderKeywordsNotice')[0].testTip.setVerification({errType:[1],isShow:0,notAutoHide:0});
                }
                //点击选定按钮
                $(".query").click(function () {
                    $("#orderKeywords").val($(this).parent().siblings(".nickName").text());
                    $("#hourMoney").val($(this).parent().siblings(".hrental").text());
                    $(".query").text("选定").removeClass("sel");
                    $(this).text("已选定").addClass("sel");
                    allMoney();
                    $('#orderKeywordsNotice').removeClass('img-mistake').removeClass('img-question').removeClass('img-notice').addClass('img-bingo')
                    $('#orderKeywordsNotice')[0].testTip.setVerification({errType:[1],isShow:0,notAutoHide:0});
                });
                //计算 出租时长*单价=实收  3+2
                $("#time,#order_keywords,#hourMoney").blur(function () {
                    allMoney();
                });
            })
            .fail(function () {

            })
    });
});

function allMoney() {
    totoltime = 0;
    var time = $("#time").val();
    var t = time.split("+");
    $("#allMoney").val(t[0] * $("#hourMoney").val());
    for (var i in t) {
        totoltime += Number(t[i]);
    }
}
//点击确定提交表单<button class="query sel">已选定</button><button class="query">选定</button>
$(document).on('click', '#modify', function () {
    $('#time').blur();
    if($('#tbody').find('button.sel').length !== 1){
        $('#orderKeywordsNotice').removeClass('img-bingo').removeClass('img-question').removeClass('img-notice').addClass('img-mistake')
        $('#orderKeywordsNotice')[0].testTip.setVerification({errType:[0],isShow:1});
    }
    if($('.form').find('.form-content>.img-bingo').length === 2){
        data = {
            time_type: 1,
            product_id: $(".sel").parent().siblings(".productId").text(),
            length: totoltime,//订单的时长为 客户购买+赠送
            give_miniutes: 0,
            actual_money: $("#allMoney").val(),
            consumerLinkAccount: $("#username").val(),
            consumerLinkWay: 5,
            customer_rate: $(".sel").parent().siblings(".customer_rate").text(),
            pay_pass: "",
            note: "",
            serializable: "",
            source: 1,
            is_reserve: 0
        };
        getFormData('order/agents/add_quick',data,$(this),function (json) {
            //成功后就跳转
            if(json.content === 1){
                window.location.href='trade-manage.html?orderId='+json.data;
            }
        });
        // $.ajax({
        //     url: spliceUrl('order/agents/add_quick'),
        //     dataType: 'JSON',
        //     type: 'POST',
        //     data: data,
        //     xhrFields: {withCredentials: true},
        //     beforeSend: function () {
        //
        //     }
        // }).done(function (json) {
        //
        //
        //
        // })
    }

});
