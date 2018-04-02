/**
 * Created by ching on 2017/11/7.
 */
$(function () {
    // 获取手机验证码
    $(document).on('click','#fetchPhoneCode',function () {
        $('#phone').blur();
        if($('#phone').siblings('.error-box').length === 0) {
            var data={
                agents_phone:$('#phone').val()
            };
            getPicCode($(this),'valid/agents/sms/reset_pay_pass',data,function (json) {
                var options = {
                    message: returnError(json.content),//ele.text() + '失败',
                    state: 2,//1、cssDemo、3三种状态:1成功,2失败,3警告
                };
                messageTip(options)
            });
        }
    });

    //注册
    $(document).on('click','#reset',function () {
        var data={
            phone:$("#phone").val(),
            new_pass:$("#user_pwd").val(),
            code:$("#phoneCode").val()
        };
        getFormData('agents/detail/info/reset_login_pass',data,$(this),function (json) {
            if(json.content === 1){
                location.href='/agents/login.html'
            }else{
                showInputError($('#errorBox'),returnError(json.content))
            }
        })
    })

});