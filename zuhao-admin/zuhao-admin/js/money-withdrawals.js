/**
 * Created by ching on 2017/10/31.
 */
$(function () {
    //提现方式调用插件
    var options=[{
        value:'0',
        label:'支付宝',
        type:'primary'
    },{
        value:'1',
        label:'微信',
        type:'primary'
    }];
    $select = $('.selectSet').select(options,'0');
    //支付密码调用插件
    $('#sixDig').sixDig();

    //提示调用插件
    //支付密码
    setVerificationTip($('#sixDigTip'));
    //提现方式
    $('#selectedTip')[0].options={
        content:'请选择一种提现方式'
    };
    setVerificationTip($('#selectedTip'));
    //提现金额
    $('#moneyWithdrawalsTip')[0].options={
        content:'请输入要提现的金额，注意提现金额不能超过您现有的可用余额',
        errText:['提现金额不能为空','提现金额大于可用余额']
    };
    moneyRegularTest($('#moneyWithdrawals'));
    focusBlurTipEvent($('#moneyWithdrawalsTip'),$('#moneyWithdrawals'),verificationMoneyWdsTip)
    function verificationMoneyWdsTip(val) {
        var ele=$('#moneyWithdrawalsTip')[0];
        ele.errType=[verificationEmpty(val),2];
        changeTipState(ele);
    }
    setVerificationTip($('#moneyWithdrawalsTip'));
    $('#moneyWithdrawals').bind('blur',function () {
        if($(this).val() == '') {
            $("#getActualMoney").text(0.00.toFixed(2)+' 元')
        }else{
            $("#getActualMoney").text(Number($(this).val()-2).toFixed(2)+' 元')
        }

    });
    //实际到账
    $('#actualArrivalTip')[0].options={
        content:'支付宝收取2元手续费，实际到账金额为提现金额减去2的值'
    };
    setVerificationTip($('#actualArrivalTip'));
});