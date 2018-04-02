/**
 * Created by ching on 2017/10/31.
 */
$(document).on('click','#withdrawals',function () {
    var data={
        recharge_money:$("#moneyWithdrawals").val(),
        pay_password:$("#sixDig #payPassword").val(),
        pay_way:$select.getActive()
    };
    formGetData('#withdrawals',2,data,'agents/money/recharge',function (json) {
        if(json.content == 1){
            messageTip('提现成功')
        }else if(json.content == 33){
            $('#sixDigTip')[0].errType[2]=0;
            $('#sixDigTip').removeClass('img-bingo').addClass('img-mistake');
            $('#sixDigTip')[0].testTip.setVerification({errType:$('#sixDigTip')[0].errType,isShow:1})
        }else if(json.content == 34){
            $('#moneyWithdrawalsTip')[0].errType[1]=0;
            $('#moneyWithdrawalsTip').removeClass('img-bingo').addClass('img-mistake');
            $('#moneyWithdrawalsTip')[0].testTip.setVerification({errType:$('#moneyWithdrawals')[0].errType,isShow:1})
        }
    });
});