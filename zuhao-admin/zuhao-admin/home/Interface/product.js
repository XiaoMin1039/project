$(function () {
    var productData={
        // productId:getQueryStringRewrite('product')
        product_id:1000091
    };
    var productGameId;
    getFormData('/agents/product/sku/time/get',{productId:1000036},null,function (json) {
        if(json.content === 1){
            if(json.productSkuTimes){
                var html='';
                $.each(json.productSkuTimes,function (index, val) {
                    html+='<li data-id="sku" data-time="'+val.duartion+'" data-price="'+val.price+'"><p class="rent-time">'+val.duartion+'小时</p><p class="rent-price">'+val.price+' 元</p></li>';
                });
                $('#timeSku').append(html);
            }
        }else{
            console.log('服务器出错');
        }
    });
    //判断预定时间是否与订单租赁时间冲突
    function canIUse(text, time) {
        var startTime = time || new Date($('#timeRange').val()).getTime()
        if ($('#current').hasClass('active') && !time) startTime = new Date().getTime()
        var text = text || $('.order-time').val()
        var endTime = startTime + text * 60 * 60 * 1000
        var flag = false;
        if (isNaN(startTime) || isNaN(endTime)) return
        $.each(reletTimes, function(index, item) {
            if (
                (startTime >= item.startTime && startTime <= item.endTime) ||
                (endTime >= item.startTime && endTime <= item.endTime) ||
                (endTime >= item.endTime && startTime <= item.startTime)
            ) {
                flag = true
            }
        })
        if (flag && !$('#rent').hasClass('rent-ban')) {
            $('#rent').addClass('rent-ban')
            $('#rent').text('时间冲突')
        }
        if (!flag) {
            $('#rent').removeClass('rent-ban')
            $('#rent').text($('#current').hasClass('active') ? '立即租赁' : '立即预约')
        }
    }
    //获取订单被租赁的时间
    getFormData('product/get_relet_time',productData,null,function (json) {
        //时间插件
        timeFrame();

        reletTimes = json.reletTimes;
        //  canIUse();
        // $('.predetermine').Predetermine({
        //     currentTime: new Date().getTime(),
        //     dataArray: reletTimes,
        //     timePanelBlockNum: 48
        // });
        $.each(reletTimes, function(index, item) {
            //当前时间在订单已租赁时间内
            var now = new Date().getTime() + 60 * 60 * 1000;
            if (item.startTime < now && item.endTime > now) {
                $('#rentType').find('span:last-child').click().prev().remove();
                changOrderType()
            }
        });
        $('.one-hour').click(function() {
            var timestamp = $(this).attr('data-time')
            $('#timeRange').val(laydate.now(timestamp))
            canIUse()
        })
    });
    //获取产品基本信息
    function runAsync1(){
        var p = new Promise(function(resolve, reject){
            getFormData('product/get_id',productData,null,function (json) {
                if(json.content === 1){
                    var data=json.searchProductDtos[0];
                    //!!!!!!!!!!!!!不懂原因
                    if (data.state != 1 && data.state != 2) {
                        window.location.href = '/index.html'
                    }
                    //收藏店铺！！！！没原型
                    //产品信息
                    if (data.hasCollect) {}
                    $('#productTitle').text(data.productTitle);
                    $('#productId').text(data.productId);
                    $('#productZone').text(data.ziZoneName);
                    $('#rentCount').text(data.totalTimes);
                    $('#rentTime').text(data.totalTimeLength);
                    $('#describe').text(data.descripbe);
                    //接口少了个服务好评比例！！！！！！！！！
                    //包小时
                    $('#orderPrice').text(data.adminHrental+'元/小时');
                    //包夜
                    if(data.nrental !== 0){
                        $('#timeSku li:first-child').after('<li><p class="rent-time">包夜</p><p class="rent-price">'+data.nrental+' 元</p></li>');
                    }
                    //包天
                    if(data.drental !== 0){
                        $('#timeSku li:first-child').after('<li><p class="rent-time">包天</p><p class="rent-price">'+data.drental+' 元</p></li>');
                    }
                    //只能预定订单
                    if(data.state === 2){
                        $('#rentType').find('span:last-child').click().prev().remove();
                        changOrderType()
                    }
                    //初始1小时的订单信息
                    $('#defaultDeposit').text(data.deposit+'元');
                    setAddSub(1);
                    resolve(data)
                }
            });
        });
        return p;
    }
    //获取产品账号信息
    function runAsync2(productMsg){
        var p = new Promise(function(resolve, reject){
            var game=productMsg.gameId;
            gameId=game;
            if (game == 9) {//英雄联盟
                var html='<li class="active">所有英雄</li><li data-item="Fighter">战士</li><li data-item="Mage">法师</li><li data-item="Assassin">刺客</li><li data-item="Tank">坦克</li><li data-item="Marksman">射手</li><li data-item="Support">辅助</li>';
                $('#product-detail-list').removeClass('hide').find('ul').html(html);
                //获取账号装备信息
                getFormData('product/equipment',productData,null,function (json) {
                    if(json.content === 1){
                        var data=json.lolEquipment,heroTitle='',division;
                        var heroArr=data.yingxiong.split(','),skinArr=data.pifu.split(',');//当前账号拥有的皮肤和英雄
                        var divisionNameImg={
                            DEFAULT:'无段位',
                            BRONZE:'英勇黄铜',
                            SILVER:'不屈白银',
                            GOLD:'荣耀黄金',
                            PLATINUM:'华贵铂金',
                            DIAMOND:'璀璨钻石',
                            MASTER:'超凡大师',
                            CHALLENGE:'最强王者'
                        };
                        division = data.duanweiKuang === 'DEFAULT1' ? 'DEFAULT' : data.duanwei;
                        heroTitle+='<div class="detail-img"><div class="circle"></div><img src="http://ossweb-img.qq.com/images/lol/img/profileicon2/profileicon' +
                            data.touxiangId+'.jpg"><span>'+data.gameLevel+'</span></div>';
                        heroTitle+=' <div class="detail-user"><div>' +
                            data.roleName+'</div><div>'+data.ziZoneName+'</div></div>';
                        heroTitle+=`<div class="detail-msg">
                            <div class="detail-msg-box">
                                <div class="detail-num">${data.yingxingCount}</div>
                                <div class="detail-text">英雄数</div>
                            </div>
                            <div class="detail-msg-box">
                                <div class="detail-num">${data.pifuCount}</div>
                                <div class="detail-text">皮肤数</div>
                            </div>
                            <div class="detail-msg-box detail-level">
                                <div class="detail-level-wrap">
                                    <div class="detail-num">${divisionNameImg[division]}</div>
                                    <div class="detail-text">段位</div>
                                </div>
                                <img src="http://res.zudahao.com/lol/rank/${division}.png" alt="">
                            </div>
                        </div>`;
                        $('#heroTitle').html(heroTitle).removeClass('hide');
                        //获取英雄联盟所有的英雄和皮肤并从中选出想要的数据
                        function getAllHeroSkin() {
                            var pHS = new Promise(function(resolve1, reject1){
                                $.getJSON('http://res.zudahao.com/lol/file/zudahao_lol.json',function (getJson) {
                                    var data=getJson.heros;
                                    var newHero=[];//存放当前账号拥有的皮肤和英雄数据
                                    $.each(heroArr,function (index, val) {
                                        if(data[val]){
                                            var hero={};
                                            hero.title=data[val].name;
                                            hero.imgSrc = data[val].url;
                                            hero.skinSrc = [];
                                            hero.ETitle = '';
                                            hero.tags = data[val].tags;
                                            $.each(getJson.skins[val],function (index1, val1) {
                                                var skin = {};
                                                $.each(skinArr,function (index2,val2) {
                                                    if(val1.id === val2){
                                                        skin.src = val1.url;
                                                        skin.id = val1.name;
                                                        hero.skinSrc.push(skin);
                                                        skinArr.splice(index2,1);
                                                        return;
                                                    }
                                                })
                                            });
                                            hero.skinNum = hero.skinSrc.length
                                        }
                                        newHero.push(hero);
                                    });
                                    resolve1(newHero);
                                })
                            });
                            return pHS;
                        }
                        getAllHeroSkin().then(function (json) {
                            var skins=productSet(json,0);//获取当前皮肤并显示初始所有英雄和皮肤
                            searchMsg(json,0);
                            //账号详情tab切换
                            tabBindClick(json)
                        })
                    }
                })
            }
            else if(game == 3) {//穿越火线
                var html='<li class="active">所有装备</li><li data-item="枪">主武器</li><li data-item="副">副武器</li><li data-item="投掷">投掷武器</li><li data-item="近战">近战武器</li><li data-item="道具">道具</li><li data-item="人物">人物</li>';
                $('#product-detail-list').removeClass('hide').find('ul').html(html);
                getFormData('product/equipment/get_cf',productData,null,function (json) {
                    if(json.content === 1){
                        var data=json.cfEquipment,newJson=[];
                        var update=data.updateTime;//更新该账号时的时间
                        var equip=$.parseJSON(data.equip);
                        var mainEquip = 0 ,jinzhanEquip = 0 ,juese = 0;//存武器数量
                        $.each(equip,function (index, val) {
                            if (val.type.indexOf('枪') > -1 || val.type.indexOf('副') > -1)  mainEquip++;
                            else if (val.type.indexOf('近战') > -1) jinzhanEquip++;
                            else if (val.type.indexOf('人物') > -1) juese++;
                        });
                        //显示头部内容
                        var heroTitle='';
                        heroTitle+='<div class="detail-img"><div class="circle" style="background: none"></div><img src="http://res.zudahao.com/cf/rank/' +
                            data.level+'.png" style="border-radius:0;"></div>';
                        heroTitle+=' <div class="detail-user fl"><div>' +
                            data.roleName+'</div><div>'+data.ziZoneName.split('/')[2]+'&nbsp;'+data.ziZoneName.split('/')[1]+'</div><div>等级：'+data.level+'</div></div>';
                        heroTitle+=`<div class="detail-msg">
                            <div class="detail-msg-box">
                                <div class="detail-num">${mainEquip}</div>
                                <div class="detail-text">主副武器</div>
                            </div>
                            <div class="detail-msg-box">
                                <div class="detail-num">${jinzhanEquip}</div>
                                <div class="detail-text">近战武器</div>
                            </div>
                            <div class="detail-msg-box">
                                <div class="detail-num">${juese}</div>
                                <div class="detail-text">角色</div>
                            </div>
                        </div>`;
                        $('#heroTitle').html(heroTitle).removeClass('hide');
                        //显示装备内容
                        $.each(equip,function (index, val) {
                            var newEquip = {}
                            newEquip.count = val.count
                            newEquip.imgSrc = 'http://res.zudahao.com/cf_dec/gun/' + val.image
                            newEquip.title = val.name; //装备名称
                            newEquip.type = val.type;
                            newEquip.unit = val.unit
                            if (val.unit == 'all') newEquip.useTime = '永久';
                            else if (val.unit == '天') {
                                var currentTime = new Date().getTime()
                                newEquip.useTime = update + val.exp * 24 * 60 * 60 * 1000 - currentTime > 0
                                                 ? Math.round((update + val.exp * 24 * 60 * 60 * 1000 - currentTime) / 1000 / 60 / 60 / 24)
                                                 : '即将过期';
                            } else newEquip.useTime = '消耗品';
                            newJson.push(newEquip)
                        });
                        productSet(newJson,0);
                        searchMsg(newJson,0);
                        tabBindClick(newJson)
                    }
                })
            }
            else{
                if(game == 7){
                    var zone=productMsg.ziZoneName.split('/');
                    var html=`
                         <div class="hero-title-tps clearBoth">
                            <div class="head-pic fl">
                                <div class="circle">
                                    <p><img src="http://zudahao.zudahao.com/zudahao/img/${zone[1]=='电信区'?'tps-up':'tps-down'}.png" /></p>
                                    <p>${zone[1]=='枪神之路'?'tps-up':'荣耀之心'}</p>
                                </div>
                            </div>
                            <div class="user-msg fl">
                                <h2>${productMsg.roleName||''}</h2>
                                <p><span>${zone[0]}</span>&nbsp;<span>${zone[1]}</span>&nbsp;<span>${zone[2]}</span></p>
                                <p>${productMsg.level||''}</p>
                            </div>
                         </div>
                      `;
                    $('#heroTitle').replaceWith(html);
                }else{
                    $('#heroTitle').remove();
                }
                var imgArr=productMsg.productImageUrl.split(',');
                $('#carousel').removeClass('hide').css('height','600px').carousel(imgArr);
            }
        });
        return p;
    }
    //异步回调
    runAsync1().then(function (data) {
        runAsync2(data)
    });
    $('#rent').on('click',function () {
        if($(this).hasClass('banClick')) return;
        var href =
            'pay1.html?productId=' +
            $('#productId').text() +
            '&orderTime=' +
            ($('#timeSku .active').index() == 0 ? parseInt($('#orderTime').text()) : '') +
            '&type=' +
            $rentType.getActive() +
            ($('#timeFrameNow').val() == '' ? '' : '&startTime=' + changeTimeToUnix($('#timeFrameNow').val())) +
            '&time_type=' +
            ($('#timeSku .active').attr('data-id') == 'sku' ? ('6&rental='+$('#timeSku .active').attr('data-price')+'&length='+$('#timeSku .active').attr('data-time'))
                : $('#timeSku .active').index());
        location.href = href
    });
    //显示产品具体信息
    function productSet(data,eq){
        var html ='';
        var skins={};//保存皮肤
        html += productGameId === 9 ? LOLProductSet(data,skins) : CFProductSet(data);
        html += '</ul>';
        $('#productDetail>li').eq(eq).html(html);
        return skins;
    }
    //显示lol英雄和皮肤
    function LOLProductSet(data,skins){
        var html='<ul class="detail-pic clearBoth lol-game">';
        $.each(data,function (index, val) {
            html +='<li><img src="'+val.imgSrc+'"><span class="product-detail-title text-limit" title="'+val.title+'">'+val.title+'</span>'
            if (val.skinNum > 0) {
                var skin=[];//单个英雄的皮肤
                html += '<span class="product-detail-num">' + val.skinNum + '</span>';
                var width=0;
                if(val.skinNum == 1) width=126;
                else if(val.skinNum <=4) width=252;
                else if(val.skinNum <=6) width=378;
                else width=504;
                html += `
                    <div class="product-detail-float-panel clearBoth hide">
                        <div class="float-content-panel" style="width: ${width+'px'}">
                            <span class="float-title">皮肤</span>
                            <ul class="float-img-panel clearfix">
                `;
                $.each(val.skinSrc,function (index1, val1) {
                    skin.push(val1.id);
                    html +=' <li><img src="'+val1.src+'?x-oss-process=image/resize,m_fixed,h_212,w_116"><p>'+val1.id+'</p></li>'
                });
                skins[index]=skin;
                html +='</ul></div></div>';
            }
            html +='</li>';
        });
        html+='</ul>';
        return html;
    }
    //鼠标移入显示皮肤
    $('#productDetail').on('mouseenter','.detail-pic>li',function(){
        if($(this).find('.product-detail-num').length === 1){
            $(this).find('.product-detail-float-panel').removeClass('hide');
        }
    }).on('mouseleave','.detail-pic>li',function () {
        if($(this).find('.product-detail-num').length === 1){
            $(this).find('.product-detail-float-panel').addClass('hide');
        }
    });
    //显示cf装备
    function CFProductSet(data) {
        var html='<ul class="detail-pic clearBoth cf-game">';
        $.each(data,function (index, val) {
            html+=`<li>
                    <img src="${val.imgSrc+'?x-oss-process=image/resize,m_fixed,h_65,w_146'}">
                    <span class="product-detail-title">
                        <span class="text-limit" title="${val.title}">${val.title}</span>
                        <span>${val.useTime+(parseInt(val.useTime) ? val.unit : '')}
                        </span>
                    </span>`;
            if(val.count != 1) html+='<span class="product-detail-num">×'+val.count+'件</span>';
            html+='</li>'
        });
        return html;
    }
    function searchMsg(data,eq){
        var name={},title={};//保存英雄拼音和拼音首字母
        $.each(data,function(index,val){
            name[index]=toPinyin(val.title).toUpperCase();
            var titleFirst='';
            $.each(toPinyin(val.title).split(''),function(index1,val1){
                if(/[A-Z0-9]/.test(val1)){
                    titleFirst +=val1;
                }
            });
            title[index]=titleFirst;
        });
        $('#search').on('input propertychange',function () {
            var value=$(this).val().toUpperCase();
            var showIndex=[],json=[];//保存要显示的下标和数组
            $.each(name,function (index,val) {
                if(val.indexOf(value) !== -1) showIndex.push(index);
            });
            $.each(title,function (index,val) {
                if(val.indexOf(value) !== -1) showIndex.push(index);
            });
            showIndex=arrRemoveRepeat(showIndex);//数组去重
            $.each(showIndex,function(index,val){
                json.push(data[val])
            });
            //显示英雄和皮肤
            if(value == '') productSet(data,eq);
            else productSet(json,eq);
        })
    }
    //绑定菜单切换事件
    function tabBindClick(json){
         $(document).on('click','.detail-tab>ul>li',function () {
             var _this=this;
             $(this).addClass('active').siblings('li').removeClass('active');
             $('.detail-content>ul>li').eq($(this).index()).addClass('active').siblings('li').removeClass('active');
             var data=[];
             switch ($(this).index()){
                 case 0: data=json;break;
                 default: {
                     if(productGameId === 9){//英雄联盟
                         $.each(json,function (index, val) {
                             $.each(val.tags,function(index1,val1){
                                 if(val1 == $(_this).attr('data-item')) data.push(val);
                             })
                         })
                     }else {//CF
                         $.each(json,function (index, val) {
                             if($(_this).attr('data-item') == '道具'){
                                 if (val.type.indexOf('枪') == -1 && val.type.indexOf('副') == -1 &&val.type.indexOf('投掷') == -1 &&val.type.indexOf('近战') == -1 &&val.type.indexOf('人物') == -1) {
                                     data.push(val)
                                 }
                             }else{
                                 if(val.type.indexOf($(_this).attr('data-item')) > -1) data.push(val);
                             }
                         })
                     }

                 }
             }
             productSet(data,$(this).index());
             searchMsg(data,$(this).index());
         });
     }
});