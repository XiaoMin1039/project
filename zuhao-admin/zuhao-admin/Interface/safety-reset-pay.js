/**
 * Created by ching on 2017/10/31.
 */
$(document).on('click','#modify',function () {
    $parent=$(this).parents('.form');
    $parent.find('input').blur();
    if($parent.find('[data-id="tipPop"].img-bingo').length === 4){
        var $this=$(this);
        $this.getButtonLoading();
        var data={
            new_pay_pass: $("#sixDig2 input").val(),
            phone: $("#oldPhone").val(),
            code: $("#phoneCode").val()
        };
        getFormData('agents/detail/info/reset_pay_pass',data,$this,function(json){
            if(json.content == 1){
                messageTip('重置成功')
            }
            if(json.content == 8){
                $('#phoneCodeTip')[0].errType=[2,2,0];
                $('#phoneCodeTip').removeClass('img-bingo').addClass('img-mistake');
                $('#phoneCodeTip')[0].testTip.setVerification({errType:$('#phoneCodeTip')[0].errType,isShow:1})
            }else if(json.content == 305){
                $('#oldPhoneTip')[0].errType[3]=0;
                $('#oldPhoneTip').removeClass('img-bingo').addClass('img-mistake');
                $('#oldPhoneTip')[0].testTip.setVerification({errType:$('#oldPhoneTip')[0].errType,isShow:1})
            }
        });

    }
});
// 获取手机验证码
$(document).on('click','#fetchPhoneCode',function () {
    var data={
        agents_phone:$('#phone').val()
    };
    getPicCode($(this),'valid/agents/sms/reset_pay_pass',data,function (json) {
        if(json.content === 305 ){
            $('#oldPhoneTip')[0].errType[3]=0;
            $('#oldPhoneTip').removeClass('img-bingo').addClass('img-mistake');
            $('#oldPhoneTip')[0].testTip.setVerification({errType:$('#oldPhoneTip')[0].errType,isShow:1})
        }else if(json.content === 801){
            $('#oldPhoneTip')[0].errType[4]=0;
            $('#oldPhoneTip').removeClass('img-bingo').addClass('img-mistake');
            $('#oldPhoneTip')[0].testTip.setVerification({errType:$('#oldPhoneTip')[0].errType,isShow:1})
        }else if(json.content === 802){
            $('#oldPhoneTip')[0].errType[5]=0;
            $('#oldPhoneTip').removeClass('img-bingo').addClass('img-mistake');
            $('#oldPhoneTip')[0].testTip.setVerification({errType:$('#oldPhoneTip')[0].errType,isShow:1})
        }
    })
});