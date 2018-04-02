var oldErrArr,codeErrArr,newErrArr,repeatErrArr;
$(function () {
    getImg();
    var options1={
        content:'请输入旧登录密码',
        errText:['密码不能为空','密码输入错误']
    };
    $test1=$('#oldLoginPwTip').verificationTip(options1);
    var options2={
        content:'请输入图片验证码',
        errText:['图片验证码不能为空','图片验证码长度不够','图片验证码错误']
    };
    $test2=$('#imgCodeTip').verificationTip(options2);
    var options3={
        content:'请输入新登录密码',
        errText:['密码不能为空','密码不符合规范']
    };
    $test3=$('#newLoginPwTip').verificationTip(options3);
    var options4={
        content:'再次输入新登录密码',
        errText:['密码不能为空','两次输入的密码不一致']
    };
    $test4=$('#repeatPwTip').verificationTip(options4);
    oldErrArr=[2,2];
    $('#oldLoginPw').blur(function () {
        if($(this).val() == ''){
            $('#oldLoginPwTip').removeClass('img-notice').addClass('img-mistake');
            oldErrArr[0]=0;
        }else{
            oldErrArr[0]=1;
        }
        $test1.setVerification({errType:oldErrArr,isShow:0});
    });
    $('#oldLoginPw').focus(function(){
        if($('#oldLoginPwTip').hasClass('img-mistake')){
            $('#oldLoginPw').keyup(function(e){
                if(e.keyCode == 9) return;
                if($(this).val() == ''){
                    oldErrArr[0]=0;
                }else{
                    oldErrArr[0]=1;
                }
                if(judgeRight(oldErrArr)) $('#oldLoginPwTip').removeClass('img-mistake').addClass('img-bingo');
                else $('#oldLoginPwTip').removeClass('img-bingo').addClass('img-mistake');
                $test1.setVerification({errType:oldErrArr,isShow:0,notAutoHide:0});
            });
            $test1.setVerification({errType:oldErrArr,isShow:1});
        }
    });

    codeErrArr=[2,2,2];
    $('#imgCode').blur(function () {
         if($(this).val() == ''){
             $('#imgCodeTip').removeClass('img-notice').addClass('img-mistake')
             codeErrArr[0]=0;
         }else{
             codeErrArr[0]=1;
         }
         if($(this).val().length < 4) {
             $('#imgCodeTip').removeClass('img-notice').addClass('img-mistake')
             codeErrArr[1] = 0;
         }else{
             codeErrArr[1] = 1;
         }
         codeErrArr[2]=2;
         $test2.setVerification({errType:codeErrArr,isShow:0});
    });
    $('#imgCode').focus(function () {
        if($('#imgCodeTip').hasClass('img-mistake')){
            $('#imgCode').keyup(function (e) {
                if(e.keyCode == 9) return;
                if($(this).val() == ''){
                    codeErrArr[0]=0;
                }else{
                    codeErrArr[0]=1;
                }
                if($(this).val().length < 4) {
                    codeErrArr[1] = 0;
                }else{
                    codeErrArr[1] = 1;
                }
                codeErrArr[2]=2;
                if(judgeRight(codeErrArr)) $('#imgCodeTip').removeClass('img-mistake').addClass('img-bingo');
                else $('#imgCodeTip').removeClass('img-bingo').addClass('img-mistake');
                $test2.setVerification({errType:codeErrArr,isShow:0,notAutoHide:1});
            });
            $test2.setVerification({errType:codeErrArr,isShow:1});
        }
    });

    newErrArr=[2,2];
    $('#newLoginPw').blur(function () {
        if($(this).val() == ''){
            $('#newLoginPwTip').removeClass('img-notice').addClass('img-mistake')
            newErrArr[0]=0;
        }else{
            newErrArr[0]=1;
        }
        newErrArr[1]=2;
        $test3.setVerification({errType:newErrArr,isShow:0});
    });
    $('#newLoginPw').focus(function () {
        if($('#newLoginPwTip').hasClass('img-mistake')){
            $('#newLoginPw').keyup(function (e) {
                if(e.keyCode == 9) return;
                if($(this).val() == ''){
                    newErrArr[0]=0;
                }else{
                    newErrArr[0]=1;
                }
                if(judgeRight(newErrArr)) $('#newLoginPwTip').removeClass('img-mistake').addClass('img-bingo');
                else $('#newLoginPwTip').removeClass('img-bingo').addClass('img-mistake');
                $test3.setVerification({errType:newErrArr,isShow:0,notAutoHide:1});
            });
            $test3.setVerification({errType:newErrArr,isShow:1});
        }

    });

    repeatErrArr=[2,2];
    $('#repeatPw').blur(function () {
        if($('#newLoginPw').val() == '') return;
        if($(this).val() == ''){
            $('#repeatPwTip').removeClass('img-notice').addClass('img-mistake')
            repeatErrArr[0]=0;
        }else{
            repeatErrArr[0]=1;
        }
        if($(this).val() != $('#newLoginPw').val()){
            $('#repeatPwTip').removeClass('img-notice').addClass('img-mistake')
            repeatErrArr[1]=0;
        }else{
            repeatErrArr[1]=1;
        }
        $test4.setVerification({errType:repeatErrArr,isShow:0});
    });
    $('#repeatPw').focus(function () {
        if($('#repeatPwTip').hasClass('img-mistake')){
            $('#repeatPw').keyup(function (e) {
                if(e.keyCode == 9) return;
                if($('#newLoginPw').val() == '') return;
                if($(this).val() == ''){
                    repeatErrArr[0]=0;
                }else{
                    repeatErrArr[0]=1;
                }
                if($(this).val() != $('#newLoginPw').val()){
                    repeatErrArr[1]=0;
                }else{
                    repeatErrArr[1]=1;
                }
                if(judgeRight(repeatErrArr)) $('#repeatPwTip').removeClass('img-mistake').addClass('img-bingo');
                else $('#repeatPwTip').removeClass('img-bingo').addClass('img-mistake');
                $test4.setVerification({errType:repeatErrArr,isShow:0,notAutoHide:1});
            });
            $test4.setVerification({errType:repeatErrArr,isShow:1});
        }
    });

    function judgeRight(arr){
        var state=true;
        $.each(arr,function (index, val) {
            if(val == 0) state = false;
        });
        return state
    }
});