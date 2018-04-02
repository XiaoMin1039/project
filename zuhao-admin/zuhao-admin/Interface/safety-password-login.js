$(document).on('click','#modify',function () {
    var $parent=$(this).parents('.form');
    $parent.blur();
    if($parent.find('i.img-mistake').length === 0){
        var $this=$(this);
        $this.getButtonLoading();
        var data={
            agents_old_pass:$('#oldLoginPw').val(),
            valid_code:$('#imgCode').val(),
            agents_pass:$('#newLoginPw').val()
        };
        $.ajax({
            url: spliceUrl('agents/info/set_pass'),
            dataType: 'JSON',
            type: 'POST',
            xhrFields: {withCredentials: true},
            data: data
        }).done(function (json) {
            $this.deleteButtonLoading();
            if(json.content === 1) {
                messageTip({
                    message: '修改成功',
                    state: 1,//1、cssDemo、3三种状态:1成功,2失败,3警告
                })
            }else {
                getImg();
            }
            if(json.content === 6) {
                codeErrArr[2]=0;
                $('#imgCodeTip').removeClass('img-bingo').addClass('img-mistake');
                $test2.setVerification({errType:codeErrArr,isShow:1})
            }else if(json.content === 32) {
                oldErrArr[1]=0;
                $('#oldLoginPwTip').removeClass('img-bingo').addClass('img-mistake');
                $test1.setVerification({errType:oldErrArr,isShow:1})
            }else if(json.content === 12){
                    newErrArr[1]=0;
                    $('#newLoginPwTip').removeClass('img-bingo').addClass('img-mistake');
                    $test3.setVerification({errType:newErrArr,isShow:1})
            }
        }).fail(function () {
            $this.deleteButtonLoading();
            var options = {
                message: '数据错误，请重试。',
                state: 3//1、cssDemo、3三种状态:1成功,2失败,3警告
            };
            messageTip(options);
        })
    }
});