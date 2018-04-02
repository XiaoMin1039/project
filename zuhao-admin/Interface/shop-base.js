/**
 * Created by ching on 2017/11/1.
 */
var isSet=0;
//获取店铺信息
getFormData('agents/config/shop_get',null,null,function (json) {
    if(json.content === 1){
        //店铺名提示
        var options1={
            content:'店铺名'
        };
        $('#shopNameTip').mouseenter(function () {
            $(this).toolTip(options1);
        });

        $('#shopName').attr('placeholder',json.shopConfig.shopName);
        $('#shopInto').val(json.shopConfig.shopSummary);
        var allGame = json.shopConfig.allGameId.split(',');
        $.each(allGame,function (index, val) {
            $('#gameSelect input').eq(val).prop('checked',true);
        });
        $('.form-item-box .img-update:first-child').remove();
        $('.form-item-box .img-update').removeClass('hide');
        $('#picContainer img').attr('src',json.shopConfig.bannerImgUrl).parents('.img-update').attr('data-url',json.shopConfig.bannerImgUrl);
        getWebUploader('#picker','http://192.168.31.39/api/agents/config/img/upload?method=upload',null,null)
    }else if(json.content === 501){
        isSet=1;
        $('#shopNameTip').removeClass('img-question').addClass('img-notice').next().prop('disabled',false);
        $('#shopIntoTip').removeClass('img-bingo').addClass('img-notice');
        $('#shopPicTip').removeClass('img-bingo').addClass('img-notice');
        // $('#picContainer').parent().addClass('hide').prev().removeClass('hide');
        //店铺名提示
        $('#shopNameTip')[0].options={
            content:'请输入店铺名称',
            errText:['店铺名不能为空','店铺名称不能超过12位字符','该店铺名称已经存在']
        };
        $('.form-item-box .img-update:last-child').remove();
        focusBlurTipEvent($('#shopNameTip'),$('#shopName'),verificationShopName);
        function verificationShopName(val){
            $('#shopNameTip')[0].errType=[verificationEmpty(val),verificationMaxLength(val,12),2];
            changeTipState($('#shopNameTip')[0])
        }
        setVerificationTip($('#shopNameTip'));
        getWebUploader('#picker','http://192.168.31.39/api/agents/config/img/upload?method=upload',null,null,function () {
            $('#shopPicTip')[0].testTip.setVerification({errType:[1],isShow:0,notAutoHide:1})
        })


    }else{
        messageTip({
            message: '数据错误，请重试。',
            state: 3
        })
    }
});

$(document).on('click','#modify',function () {
    var data={
        summary: $("#shopInto").val(),
        theme: 1,
        all_gameId:''
    };
    $.each($('#gameSelect input:checked'),function (index, val) {
        if(index === $('#gameSelect input:checked').length-1) data.all_gameId+=$(val).index();
        else data.all_gameId+=$(val).index()+','
    });
    if(isSet == 1){
        data.shop_name=$('#shopName').val();
        if($(".form-item-box").find('.img-update[data-url]').length === 0){
            $('#shopPicTip').removeClass('img-bingo').removeClass('img-notice').addClass('img-mistake');
            $('#shopPicTip')[0].testTip.setVerification({errType:[0],isShow:0})
        }
        formGetData('#modify',2,data,'agents/config/add',function (json) {
            if(json.content == 1){
                messageTip('添加成功')
            }else if(json.content == 500){
                $('#shopNameTip')[0].errType[2]=0;
                $('#shopNameTip').removeClass('img-bingo').addClass('img-mistake');
                $("#shopNameTip")[0].testTip.setVerification({errType:$('#shopNameTip')[0].errType,isShow:1})
            }else{
                messageTip({content:'添加失败，请重试',state:2})
            }
        });
    }else{
        formGetData('#modify',2,data,'agents/config/update',function (json) {
            if(json.content == 1){
                messageTip('更新成功')
            }else if(json.content == 501){
                messageTip({content:'店铺配置不存在',state:2})
            }else{
                messageTip({content:'更新失败，请重试',state:2})
            }
        });
    }


});


