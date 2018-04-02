/**
 * Created by ching on 2017/11/8.
 */

$(document).ready(function () {
    var getProduct ={
        product_id: getQueryString('productId')
    };
    var progress=0;
    getFormData('agents/product/sku/time/get',{productId:getQueryString('productId')},null,function (json) {
        if(json.content === 1 && json.productSkuTimes){
            $.each(json.productSkuTimes,function (index, val) {
                $div=$(`
                    <div class="form-set" data-id="setTimePrice">
                        <div data-id="setTime" class="rentActive"><span style="width: 100%;height:100%;display: inline-block"><p style="width: 100%;height:100%;">${val.duartion+'小时'}</p></span></div>
                        <div data-id="setPrice"><span style="width: 100%;height:100%;display: inline-block"><p style="width: 100%;height:100%;">${val.price+'元'}</p></span></div>
                        <i class='close-setRent'>&times;</i>
                    </div>
                `);
                $div.insertBefore($("#setTimePrice").parent());
            });
            progress+=50;
            if(progress == 100){

            }
            if(json.productSkuTimes.length === 5){
                $("#setTimePrice").parent().addClass('hide');
            }
        }
    });
    if (getQueryString('state') == 1 || getQueryString('state') == 2 || getQueryString('state') == 5) {//正常所有
        $('#publish').remove();
        $('#gameInfo').remove();
        var gameId=null,gameAccount=null;
        if (getQueryString('type') == 1) {//商家自建
            getAccountData('agents/product/get/zijian','agentsUpdateZijianProductDto');
            $('#preserve').on('click',function () {
                $('.form input,textarea').blur();
                if(!parseFloat($('#setHourRent>span>p').text())){
                    $('#rentSetNotice').removeClass('img-notice').removeClass('img-bingo').addClass('img-mistake');
                    $('#rentSetNotice')[0].testTip.setVerification({errType:[0],isShow:0});
                }
                if($('.form i.img-mistake[data-id="popTip"]').length !== 0) click_scroll('.form i.img-mistake[data-id="popTip"]');
                else{
                    var data={
                        product_id:getQueryString('productId'),
                        zizone:gameId,
                        common_login_addr:'//',//常用登录地暂时没有
                        product_title:$('#titleText').val(),
                        nick_name:$('#customAlias').val(),
                        h_rental:parseFloat($('#setHourRent>span>p').text()),
                        d_rental:parseFloat($('#setDayRent>span>p').text()) || 0,
                        n_rental:parseFloat($('#setNightRent>span>p').text()) || 0,
                        deposit:parseInt($deposit.getValue()) || 0,
                        rate:parseInt($rate.getValue()) || 0,
                        descrip:$('#accountDescribe').val(),
                        game_account:gameAccount,
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
                    setAgentSKU(false);
                    publishPreserve('agents/product/update/zijian',data,$(this));
                }
            })
        }else if(getQueryString('type') == 2) {//平台签约
            $('#ownerMsg').remove();
            $('#otherLimits>.form-content-item:lt(4)').remove();
            getAccountData('agents/product/get/qianyue','agentsUpdateQianyueDto');
            $('#preserve').on('click',function () {
                $('.form input,textarea').blur();
                if(!parseFloat($('#setHourRent>span>p').text())){
                    $('#rentSetNotice').removeClass('img-notice').removeClass('img-bingo').addClass('img-mistake');
                    $('#rentSetNotice')[0].testTip.setVerification({errType:[0],isShow:0});
                }
                if($('.form i.img-mistake[data-id="popTip"]').length !== 0) click_scroll('.form i.img-mistake[data-id="popTip"]');
                else{
                    var data={
                        product_id:getQueryString('productId'),
                        product_title:$('#titleText').val(),
                        agents_note:'',
                        nick_name:$('#customAlias').val(),
                        h_rental:parseFloat($('#setHourRent>span>p').text()),
                        d_rental:parseFloat($('#setDayRent>span>p').text()) || 0,
                        n_rental:parseFloat($('#setNightRent>span>p').text()) || 0,
                        deposit:parseInt($deposit.getValue()) || 0,
                        rate:parseInt($rate.getValue()) || 0,
                        descrip:$('#accountDescribe').val(),
                        game_account:gameAccount,
                        max_violation:parseInt($maxViolation.getValue()) || 0,
                        min_hours:parseInt($minHours.getValue()) || 1,
                        is_keep:$submitTimeOut.getActive(),
                        is_tgp:$submitTGP.getActive()
                    };
                    setAgentSKU(false);
                    publishPreserve('agents/product/update/qianyue',data,$(this));
                }
            })
        }
    }else if (getQueryString('state') == 3) {//待编辑
        if (getQueryString('type') == 1){
            var gameErr=[2,2,2,2];
            $.getJSON('http://datazudahao.oss-cn-shenzhen.aliyuncs.com/file/ziZone.json').then((data)=>{
                $gameSelect=$('#game-select').getGameSelect(data);
                getAccountData('agents/product/get/zijian','agentsUpdateZijianProductDto')
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
            });
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
                if($('.form i.img-mistake[data-id="popTip"]').length !== 0) click_scroll('.form i.img-mistake[data-id="popTip"]');
                else{
                    var data={
                        is_publish:$(this).attr('id') == 'publish' ? 1:2,
                        product_id: getQueryString('productId'),
                        zizone:$gameSelect.getValue(),
                        product_title:$('#titleText').val(),
                        nick_name:$('#customAlias').val(),
                        h_rental:parseFloat($('#setHourRent>span>p').text()),
                        d_rental:parseFloat($('#setDayRent>span>p').text()) || 0,
                        n_rental:parseFloat($('#setNightRent>span>p').text()) || 0,
                        deposit:parseInt($deposit.getValue()) || 0,
                        rate:parseInt($rate.getValue()) || 0,
                        descrip:$('#accountDescribe').val(),
                        game_account:$('#gameAccount').val(),
                        // game_password:$('#gamePwd').val(),
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
                    setAgentSKU(false);
                    publishPreserve('agents/product/update/zijian',data,$(this));
                }
            });

        }
    }

    function getAccountData(url,name) {
        getFormData(url,getProduct,null,function (json) {
            if(json.content === 1){
                var data = json[name];
                showAccountData(data)
            }else{
                var options = {
                    message: '数据错误，请重试。',
                    state: 3//1、cssDemo、3三种状态:1成功,2失败,3警告
                };
                messageTip(options);
            }
        })
    }
    function showAccountData(data){
        var game = data.ziZoneName.replace(/\s+/, '').split('/');
        gameId = data.ziZoneId;
        gameAccount = data.gameAccount;
        //游戏分类和大区400905
        if (getQueryString('state') == 3) {
            $('#gameAccount').val(gameAccount);
            $gameSelect.setLabel(gameId.toString());
        }else{
            $('#game-select').parent().html(`
                        <div id="gameTitleBox">
                            <span class="gameMenuTitle noPadding">所有游戏 </span> /
                            <span class="gameMenuTitle noPadding"> 所有大区 </span> /
                            <span class="gameMenuTitle noPadding"> 所有子区</span>
                        </div>          
        `).css('cursor','auto').prev().replaceWith('<i class="imgfont img-question"></i>');
            $('#gameTitleBox').find('span').eq(0).text(game[0]);
            $('#gameTitleBox').find('span').eq(1).text(game[1]);
            $('#gameTitleBox').find('span').eq(2).text(game[2]);
        }


        $('#titleText').val(data.productTitle);//标题文本
        $('#customAlias').val(data.nickName);//商家自定义别名
        $('#accountDescribe').val(data.descripbe);//账号描述
        $('#setHourRent>span>p').text(data.adminHrental+'元');//时租
        if(data.drental){
            $('#setDayRent>span>p').text(data.drental+'元');
            $('#setDayRent').prev().addClass('rentActive').parent().append("<i class='close-setRent'>&times;</i>");
        }//包天
        if(data.nrental){
            $('#setNightRent>span>p').text(data.nrental+'元');
            $('#setNightRent').prev().addClass('rentActive').parent().append("<i class='close-setRent'>&times;</i>");
        }//包夜
        //押金
        if(data.deposit == 0){
            $deposit.setValue('0', '免押金');
        }else{
            $deposit.setValue('1', data.deposit);
        }
        //分成
        if (getQueryString('type') == 1){//自建可以改
            if (data.rate != 0) {
                $rate.setValue('1', data.rate);
            } else {
                $rate.setValue('0', '不分成');
            }
        }else{//签约不可改
            $('#rate').html('<span class="select-label-active select-label" style="display: inline-block;cursor:auto"><p>'+data.rate+'%</p></span>')
        }

        //4个不允许
        if(data.gameLimits){
            $.each(data.gameLimits.split(''),function (index, val) {
                if (index == 0) {
                    $submitRank.setActive(val);
                } else if (index == 1) {
                    $submitUseGold.setActive(val);
                } else if (index == 2) {
                    $submitLeaveGame.setActive(val);
                } else if (index == 3) {
                    $submitFeed.setActive(val);
                }
            });
        }

        //违规冻结次数
        if (data.maxViolation != 10000) {
            $maxViolation.setValue('1', data.maxViolation);
        } else {
            $maxViolation.setValue('0', '不限制');
        }
        //最短租赁时间
        if (data.miniHours != 1) {
            $minHours.setValue('1', data.miniHours);
        } else {
            $minHours.setValue('0', '不限制');
        }
        //号主手机号码
        $('#ownPhone').val(data.ownerPhone);
        //支付账号
        $('#payAccount').val(data.payAccount);
        //其他备注
        $('#otherMsg').val(data.note);
        //支付方式
        $select.setLabel(data.payWay-1);

        //如果为腾讯游戏则显示WeGame
        var gameNum = data.gameId;
        if(gameNum == '8' || gameNum == '5' || game == '51'){
            $('#lol-limit').remove();
        }else{
            if(data.isTGP == 0){
                $submitTGP.setActive('0');
            }else{
                $submitTGP.setActive('1');
            }
        }
        //显示上传图片
        if(gameNum !=3 && gameNum != 9){
            var html='';
            uploaderPic();
            if(data.productImageUrl){
                $.each(data.productImageUrl.toString().split(','),function (index, val) {
                    html+=`
                    <div class="img-update" data-url="${val}">
                            <div class="picContainer"><div class="file-item thumbnail" style="height: 195px;">
                            <img style="width:100%;height:100%;" src="http://res.zudahao.com/${val}">
                            </div></div>
                            <i class="iconfont icon-enlarge" id="lookLargePic" title="点击看大图"></i>
                            <div class="img-opacity" data-id="deletePic"><i class="iconfont icon-delete"></i>删除图片</div>
                        </div>
                `;
                });
                $(html).insertBefore($('#uploaderBox>.img-update'));
                $('#uploaderBox').on('click','[data-id="deletePic"]',function () {
                    var _this = $(this);
                    var options={
                        content:'确认移除吗？',
                        yes:function(){
                            data = {
                                product_id:getProduct.product_id,
                                url:_this.parents('.img-update').attr('data-url')
                            };
                            getFormData('agents/product/image/delete',data,null,function (json) {
                                if(json.content == 1){
                                    messageTip({message:'删除成功',state:1});
                                    _this.parents('.img-update').remove();
                                }else{
                                    messageTip({message:'删除失败',state:3})
                                }
                            });
                        }
                    };
                    $(this).minConfirmBox(options);
                });
            }

        }else{
            $('#uploaderBox').parent().remove()
        }
        //到时下线
        if (data.isKeepPlay == 1) {
            $submitTimeOut.setActive('1');
        } else {
            $submitTimeOut.setActive('0');
        }
    }
});