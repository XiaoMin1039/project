function setComponent() {

    $('#rentType').on('click','p',function () {
        if($(this).parent().attr('data-value') == 1){
            $('#timeFrameSelect').parent().removeClass('hide');
            //预定的开始时间
            if(!$('#timeFrameSelectTip')[0].testTip){
                $('#timeFrameSelectTip')[0].options={
                    content:'请输入开始时间',
                    errText:['开始时间不能为空']
                };
                focusBlurTipEvent($('#timeFrameSelectTip'),$('#timeFrameSelect'),verificationTimeFrameSelect);
                function verificationTimeFrameSelect(val) {
                    $('#timeFrameSelectTip')[0].errType=[verificationEmpty(val)];
                    changeTipState($('#timeFrameSelectTip')[0])
                }
                setVerificationTip($('#timeFrameSelectTip'));
            }
        }else{
            $('#timeFrameSelect').parent().addClass('hide');
        }
    });
    //租赁类型提示
    $('#rentTypeTip').mouseenter(function () {
        $(this).toolTip({content:'即时和预定，当该产品在已经被租赁的状态时，只能进行预定功能'})
    });
    //租赁时长
    $('#order_time_tip').mouseenter(function () {
        $(this).toolTip({content:'最低不能低于改订单所设的最小租赁时间'})
    });
    //免费赠送时长
    $('#postTimeTip').mouseenter(function () {
        $(this).toolTip({content:'免费赠送'})
    });
    //实际收取客户金额
    moneyRegularTest($('#realMoney'));
    $('#realMoneyTip')[0].options={
        content:'请输入实际收取金额',
        errText:['金额不能为空','金额格式有误']
    };
    focusBlurTipEvent($('#realMoneyTip'),$('#realMoney'),verificationRealMoney);
    function verificationRealMoney(val) {
        var ele=$('#realMoneyTip')[0];
        ele.errType=[verificationEmpty(val),verificationRegular(val,/^\d+\.?\d{0,2}$/)];
        changeTipState(ele);
    }
    setVerificationTip($('#realMoneyTip'));
    //订单来源方式
    $source=$('#source').dropDown({
             items: [
            {value: '1', label: '淘宝'},
            {value: '2', label: '微信'},
            {value: '3', label: 'QQ账号'},
            {value: '4', label: '手机号码'},
            {value: '5', label: '其他'}
            ]
         });
    //客户联系方式
    $consumerLinkWay=$('#consumerLinkWay').dropDown({
        items: [
            {value: '1', label: '淘宝账号'},
            {value: '2', label: '微信号码'},
            {value: '3', label: 'QQ账号'},
            {value: '4', label: '手机号码'},
            {value: '5', label: '其他'}
        ]
    });
    //租赁类型引入选择插件
    var rentTypeOptions=[{
        value:'0',
        label:'即时订单',
        type:'primary'
    },{
        value:'1',
        label:'预定订单',
        type:'primary'
    }];
    $rentType=$('#rentType').select(rentTypeOptions,'0');
    //免费赠送时间引入选择插件
    var postTimeOptions=[{
        value: '0',
        label: '不赠送',
        type: 'primary'
    },{
        value: '1',
        label: '分钟',
        type: 'unit',
        unit: {
            unit: '分钟',
            max: 10000,
            min: 1,
            array: [1,2, 4, 5, 8,10,12,15,20, 100],
            decimal: false
        }
    },{
        value: '2',
        label: '小时',
        type: 'unit',
        unit: {
            unit: '小时',
            max: 10000,
            min: 1,
            array: [1,2, 4, 5, 8,10,12,15,20, 100],
            decimal: false
        }
    }];
    $postTime=$('#postTime').select(postTimeOptions,'0');

    $("#count").on('click',function () {
        $('#realMoney').blur();
        if($('#realMoneyTip').hasClass('img-bingo')){
            var allHours = 0;
            if($postTime.getActive() == 0){
                allHours = parseInt($("#order_time").val());
            }else if($postTime.getActive() == 1){
                allHours = parseInt($postTime.getValue());
                if(allHours % 30 != 0){
                    allHours = parseInt(allHours / 30 + 1) * 0.5;
                }else{
                    allHours = parseInt(allHours / 30) * 0.5;
                }
                allHours += parseInt($("#order_time").val());
            }else if($postTime.getActive() == 2){
                allHours = parseInt($postTime.getValue());
                allHours += parseInt($("#order_time").val());
            }
            $("#mathTime").text(allHours+'小时');
            $("#shizu").text(parseFloat(allHours * adminHrental).toFixed(2)+"元");
            $("#mathRealMoney").text($("#realMoney").val()+"元");
            if(type == 1){
                if($rate.getActive() == 0){
                    var divided=1-parseInt($('#rate').text())/100;
                }else if($rate.getActive() == 1){
                    var divided=0;
                }else if($rate.getActive() == 2){
                    var divided=1-parseInt($rate.getValue())/100;
                }
                $('#math2').removeClass('hide');
            }else{
                var divided=1-parseInt($('#rate p').text())/100;
                $('#math1').removeClass('hide');
            }
            $('#notCount').addClass('hide');
            $('#haozhuhuoli').text(($("#realMoney").val()*divided).toFixed(2)+'元');
            $('#dailishangfenchengbili').text(100-divided*100+'%')
            $('#dailishangfencheng').text(($("#realMoney").val()-$("#realMoney").val()*divided).toFixed(2)+'元');
            $('#ownerGet').text(($("#realMoney").val()*divided).toFixed(2)+'元');
            $('#oneselfGet').text(($("#realMoney").val()-$("#realMoney").val()*divided).toFixed(2)+'元');
        }else{
            $('#realMoneyTip')[0].testTip.setVerification({errType:$('#realMoneyTip')[0].errType,isShow:1})
        }
    });

}
//创建加减
function setAddSub(num) {
    $('#order_time').val(num);
    $('#order_time').keyup(function () {
        var reg = $(this).val().match(/\d+/);
        var txt='';
        if(reg != null){
            txt =reg[0];
        }
        $(this).val(txt);
    }).change(function () {
        $(this).keypress();
        if($(this).val() < num){
            $('#order_time').val(num)
        }
    });
    $("#btn-add").on("click", function() {
        var text = $("#order_time").val();
        text++;
        $("#order_time").val(text);
    });
    $("#btn-sub").on("click", function() {
        var text = $("#order_time").val();
        if (text <= num) return;
        text--;
        $("#order_time").val(text);
    });
}
