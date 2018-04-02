/**
 * Created by ching on 2017/11/4.
 */

var gameErr=[0,0,0,2];
$(function () {
    $.getJSON('http://datazudahao.oss-cn-shenzhen.aliyuncs.com/file/ziZone.json').then((data)=>{
        $gameSelect=$('#game-select').getGameSelect(data);
    });
    $('#game-select').on('click','i',function () {
       var i=$(this).attr('data-i');
       if(gameErr[3] == 0 && $(this).text() != $('#gameTitleBox .gameMenuTitle').eq(i).text() ) gameErr[3]=1;
       if($(this).text() != '所有游戏') gameErr[i]=1;
       else{
           gameErr[i]=0;
           $('#gameNotice').removeClass('img-bingo').removeClass('img-notice').addClass('img-mistake');
       }
        $('#gameNotice')[0].testTip.setVerification({errType:gameErr,isShow:0,notAutoHide:1});
        if(i == 2 && $(this).text() != '所有子区'){
            $('#gameNotice').removeClass('img-mistake').removeClass('img-notice').addClass('img-bingo');
            $('#gameNotice')[0].testTip.setVerification({errType:gameErr,isShow:0,notAutoHide:0});
        }
       setTimeout(function () {
           var code=$('#gameTitleBox .gameMenuTitle:first-child').attr('data-value');
           var gameCode=code.slice(0,code.length-7);
           if (gameCode == '3' || gameCode == '9') {//穿越火线和英雄联盟
               $('#uploaderBox').parent().addClass('hide')
           }else{
               uploaderPic()
           }
       },0)
    })
});
//发布宝贝
$(document).on('click','#publish,#preserve',function () {
    $.each(gameErr,function (index, val) {
        if(val == 0){
            $('#gameNotice').removeClass('img-notice').removeClass('img-bingo').addClass('img-mistake');
        }
    });
    $('#gameNotice')[0].testTip.setVerification({errType:gameErr,isShow:1});
    $('.form input,textarea').blur();
    if(!parseFloat($('#setHourRent>span>p').text())){
        $('#rentSetNotice').removeClass('img-notice').removeClass('img-bingo').addClass('img-mistake');
        $('#rentSetNotice')[0].testTip.setVerification({errType:rentErr,isShow:0});
    }
    if($('.form i.img-mistake').length !== 0) click_scroll('.form i.img-mistake');
    else{
        var data={
            is_publish:$(this).attr('id') == 'publish'? 1 : 2,
            zizone:$gameSelect.getValue(),
            product_title:$('#titleText').val(),
            nick_name:$('#customAlias').val(),
            h_rental:parseFloat($('#setHourRent>span>p').text()),
            d_rental:parseFloat($('#setDayRent>span>p').text()) || 0,
            n_rental:parseFloat($('#setNightRent>span>p').text()) || 0,
            deposit:parseInt($deposit.getValue()) || 0,
            agents_rate:parseInt($rate.getValue()) || 0,
            descrip:$('#accountDescribe').val(),
            game_account:$('#gameAccount').val(),
            game_password:$('#gamePwd').val(),
            game_limits:''+$submitRank.getActive()+$submitUseGold.getActive()+$submitLeaveGame.getActive()+$submitFeed.getActive(),
            max_violation:parseInt($maxViolation.getValue()) || 0,
            min_hours:parseInt($minHours.getValue()) || 1,
            is_keep:$submitTimeOut.getActive(),
            is_tgp:$submitTGP.getActive(),
            owner_phone:$('#ownPhone').val(),
            owner_pay_way:parseInt($('#dropDown>div').attr('data-value'))+1,
            owner_pay_account:$('#payAccount').val(),
            note:$('#otherMsg').val()
        };
        setAgentSKU(true,data);
        publishPreserve('agents/product/add',data,$(this));
    }
});

