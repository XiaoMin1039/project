$(function () {
    // 获取手机验证码
    $(document).on('click','#fetchPhoneCode',function () {
        $('.form-content .form-item:lt(4) input').blur();
        if($('.form-content .form-item:lt(4)').find('.error-box').length === 0) {
            var data={
                user_phone:$("#phone").val(),
                user_account:$("#user_name").val(),
                type:1,
                role:2
            };
            getPicCode($(this),'valid/sms',data,function (json) {
                var options = {
                    message: returnError(json.content),//ele.text() + '失败',
                    state: 2,//1、cssDemo、3三种状态:1成功,2失败,3警告
                };
                messageTip(options)
            });
        }
    });

    //注册
    $(document).on('click','#register',function () {
        var data={
            agents_account:$("#user_name").val(),
            agents_phone:$("#phone").val(),
            agents_pass:$("#user_pwd").val(),
            sms_code:$("#phoneCode").val(),
            pay_pass:$("#payPwd").val(),
            agents_shop_name:$("#shopName").val()
        };
        getFormData('sign_up_agents',data,$('#register'),function (json) {
            if(json.content === 1){
                location.href='/index.html'
            }else if(json.content == 11){
                showInputError($('#errorBox'),'用户名要以字母开头且长度为6-16')
            }else {
                showInputError($('#errorBox'),json.data)
            }
        })
    })

});