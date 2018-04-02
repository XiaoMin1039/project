
$(document).on('click','#modify',function () {
    $parent=$(this).parents('.form');
    $parent.find('input').blur();
    if($parent.find('[data-id="tipPop"].img-bingo').length === 4){
        var $this=$(this);
        $this.getButtonLoading();
        var data={
            agents_pay_pass: $("#sixDig #payPassword").val(),
            agents_old_pass: $("#sixDig2 #payPassword").val(),
            valid_code: $("#imgCode").val()
        };
        getFormData('agents/info/set_pay_pass',data,$this,function(json){
            if(json.content == 1){
                messageTip({
                    message: '修改成功',
                    state: 1,//1、cssDemo、3三种状态:1成功,2失败,3警告
                })
            }else{
                getImg();
            }
            if(json.content == 6){
                $('#imgCodeTip')[0].errType=[1,1,0];
                $('#imgCodeTip').removeClass('img-bingo').addClass('img-mistake');
                $('#imgCodeTip')[0].testTip.setVerification({errType:$('#imgCodeTip')[0].errType,isShow:1})
            }else if(json.content == 32){
                $('#sixDigTip')[0].errType[2]=0;
                $('#sixDigTip').removeClass('img-bingo').addClass('img-mistake');
                $('#sixDigTip')[0].testTip.setVerification({errType:$('#sixDigTip')[0].errType,isShow:1})
            }else if(json.content == 12){
                $('#sixDigTip2')[0].errType[2]=0;
                $('#sixDigTip2').removeClass('img-bingo').addClass('img-mistake');
                $('#sixDigTip2')[0].testTip.setVerification({errType:$('#sixDigTip2')[0].errType,isShow:1});
            }
        });

    }
});