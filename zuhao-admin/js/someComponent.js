/**
 * Created by ching on 2017/11/13.
 */
//获取元素相对也窗口左上角的位置
function getPosition(ele){
    /*获取元素的纵坐标*/
    function getTop(e){
        var offset=e.offsetTop;
        if(e.offsetParent!=null){
            offset+=getTop(e.offsetParent);
        }
        return offset;
    }
    /*获取元素的横坐标*/
    function getLeft(e){
        var offset=e.offsetLeft;
        if(e.offsetParent!=null){
            offset+=getLeft(e.offsetParent);
        }
        return offset;
    }
    return {
        top:getTop(ele),
        left:getLeft(ele)
    }
}
/*
 *  动画上下滑动和动画淡入淡出
 * @param obj 采用动画的选择器（需原生的）
 * @param iTarget 设置目标值
 * @param event  到达目标值的回调 （可不填）
 * */
(function(){
    theSliding=function(obj,iTarget,event){
        clearInterval(obj.timer);
        obj.timer=setInterval(function (){
            var iSpeed=(iTarget-obj.marginTop)/8;
            iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);

            if(obj.marginTop==iTarget)
            {
                clearInterval(obj.timer);
                if(event) event();
            }
            else
            {
                obj.marginTop+=iSpeed;
                obj.style.marginTop=obj.marginTop+'px';
            }
        }, 30)
    }
})();
(function(){
    theFading=function(obj,iTarget,event){
        if(obj) {
            clearInterval(obj.timer);
            obj.timer=setInterval(function (){
                var iSpeed=(iTarget-obj.alpha)/8;
                iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
                if(obj.alpha == iTarget)
                {
                    clearInterval(obj.timer);
                    if(event) event();
                }
                else
                {
                    obj.alpha+=iSpeed;
                    obj.style.opacity=obj.alpha/100;
                }
            }, 5);
        }
    }
})();

/*
 *  按鈕加載和失去加載效果
 *
 * -- example --
 * $(selector).getButtonLoading()
 * $(selector).deleteButtonLoading()
 * */
(function($) {
    function getButtonLoading(ele){
        var _self=ele;
        ele[0].text=ele.text();
        var html=$(`
                <div class="m-load">
                    <div class="line">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div class="circlebg"></div>
                </div>
            `);
        _self.addClass('btn-loading').attr("disabled","disabled");
        _self.html(html);
    }

    function  deleteButtonLoading(ele) {
        var _self=ele;
        _self.removeClass('btn-loading').removeAttr("disabled");
        _self.html(ele[0].text);
    }

    $.fn.getButtonLoading=function(){
        return new getButtonLoading(this);
    };

    $.fn.deleteButtonLoading = function () {
        return new deleteButtonLoading(this);
    };
})(jQuery);

/**
 * 下拉框
 *
 * @调用方法
 * $(selector).pagination(option);
 *
 * -- example --
 * $selector=$(selector).dropDown({
 *     items: [
            {value: '0', label: '所有状态'},
            {value: '1', label: '租赁中'},
            {value: '2', label: '租赁结束'},
            {value: '3', label: '客户申诉'},
            {value: '4', label: '代理商申诉'},
            {value: '5', label: '订单异常关闭'},
            {value: '6', label: '撤单成功'},
            {value: '7', label: '已预约'},
            {value: '8', label: '取消预约'}
        ]
 * });
 * $selector.getValue()获取所选择框的value值
 * $selector.getLabel()获取所选择框的label值
 * $selector.setLabel()设置选择框要选择的label值和value值
 */
(function($){
    function dropDown(ele,options){
        this.$ele=ele;
        this.options=options;
        this.init()
    }
    dropDown.prototype.init=function(){
        var _self=this,_html=[];
        _html.push('<ul class="select_ul borderBottom">');
        $.each(_self.options.items,function(index,val){
            if(index == 0){
                _html.push(`<li data-value="${val.value}" class="cur">${val.label}</li>`);
                _self.$ele.find('div').text(val.label).attr('data-value',val.value);
            } else _html.push(`<li data-value="${val.value}">${val.label}</li>`)
        });
        _html.push('</ul>');
        _self.$ele.append(_html.join('')).addClass('select');
        var _con=_self.$ele;
        _self.$ele.click(function(){
            if(_con.hasClass('borderAll')) _con.removeClass('borderAll').addClass('borderTop');
            _self.$ele.find(".select_ul").slideToggle('fast',function(){
                if($(this).css('display') == 'none')  _con.removeClass('borderTop').addClass('borderAll');
            });
        });
        _self.bindClick();

        // 点击其他地方，窗口消失
        $(document).mouseup(function(e){
            if(!_self.$ele.is(e.target) && _self.$ele.has(e.target).length === 0){
                _self.$ele.find(".select_ul").slideUp('fast',function(){
                    _con.removeClass('borderTop').addClass('borderAll')
                });
            }
        });
    };
    dropDown.prototype.bindClick=function(event){
        this.$ele.on('click','li',function(){
            $(this).addClass('cur').siblings('li').removeClass('cur');
            $(this).parent().prev().text($(this).text()).attr('data-value',$(this).attr('data-value'));
            if(event) event();
        });
    };
    dropDown.prototype.selected=function(event){
        this.bindClick(event)
    };
    dropDown.prototype.getValue=function(){
        return this.$ele.find('div').attr('data-value');
    };
    dropDown.prototype.getLabel=function(){
        return this.$ele.find('div').text();
    };
    dropDown.prototype.setLabel=function (val) {
        var _con=this.$ele.find('li').eq(val)
        _con.addClass('cur').siblings('li').removeClass('cur');
        _con.parent().prev().text(_con.text()).attr('data-value',_con.attr('data-value'))
    };
    $.fn.dropDown=function(options){
        return new dropDown(this,options)
    }
})(jQuery);

/**
 * 支付密码框
 *
 * -- example --
 * $selector=$(selector).sixDig();
 * $selector.getValue()获取密码输入的数值
 */
(function($) {
    function sixDig(ele) {
        var _self = ele
        var input = $(
            '<input type="text" tabindex="1" id="payPassword"  oncontextmenu="return false" onpaste="return false" oncopy="return false" oncut="return false" autocomplete="off" value="" maxlength="6" minlength="6" style="outline: none; margin-left: -99999px;">'
        )
        _self.append(input)
        _self.append('<div id="mockInput" style="width: 221px;" tabindex="0"><span class="highLight"><i></i></span></div>')
        _self.find('.highLight').hide()
        ;(function() {
            for (var i = 0; i < 6; i++) {
                _self.find('#mockInput').append('<i style="width: 36px;"><b></b></i>')
            }
        })()
        var timer
        var active = 1
        function setActive() {
            if (active > 6) {
                _self.find('.highLight').hide()
                clearInterval(timer)
            } else {
                _self.find('.highLight').show()
                _self.find('.highLight').css('left', (active - 1) * 37 + 1 + 'px')
            }
            _self.find('i').removeClass('active')
            _self.find('i:nth-child(' + active + ')').addClass('active')
            _self.find('b').each(function(index, item) {
                if (index < active - 1) {
                    $(item).addClass('active')
                } else {
                    $(item).removeClass('active')
                }
            })
            setTimer()
        }
        function setTimer() {
            clearInterval(timer)
            timer = setInterval(function() {
                _self.find('.highLight i').hide()
                setTimeout(function() {
                    _self.find('.highLight i').show()
                }, 400)
            }, 800)
        }
        _self.find('input').on('blur', function() {
            _self.find('.highLight').hide()
            _self.find('#mockInput').css('border-color', '#ebedf3')
            clearInterval(timer)
        })
        _self.find('#mockInput').on('click', function() {
            setActive()
            _self.find('input').focus()
        })
        _self.find('input').on('focus', function() {
            _self.find('#mockInput').css('border-color', '#1E9FFF')
        })
        _self.find('input').on('keydown', function(key) {
            var kc = key.keyCode
            if (kc == 8 || kc == 46) {
                active--
                if (active < 1) active = 1
            } else if ((kc >= 48 && kc <= 57) || (kc >= 96 && kc <= 105)) {
                active++
                if (active > 6) active = 7
            } else {
                return false
            }
            setActive()
        })
        this.getActive = function() {
            return active
        }
        this.getValue = function() {
            return _self.find('input').val()
        }
    }
    $.fn.sixDig = function() {
        return new sixDig(this)
    }
})(jQuery);

/**
 * 游戏选择组件
 *
 * -- example --
 * $gameSelect=$('#game-select').getGameSelect(data);

 * $gameSelect.getValue()获取code数值
 * $gameSelect.setLabel()根据code设置游戏
 */
(function($){
    function getGameSelect(ele,json){
        this.$ele=ele;
        this.json=json;
        this.code=0;
        this.currentItemFirstLetter=[];
        this.currentItemAllTitle=[];
        this.currentItemAllLetter=[];
        this.init();
        this.list2=[];//存大区
        this.list1=[];//存子区
    }
    //初始化
    getGameSelect.prototype.init=function(){
        var list0=[];
        var _self=this;
        var html=$(`
                    <ul>
                        <li class="active">游戏</li>
                        <li>大区</li>
                        <li>子区</li>
                    </ul>
                    <div class="game-select-item">
                        <div class="shortening"></div>
                        <div class="item-name"></div>
                        <input type="text" placeholder="本页数据拼音首字母快速检索" style="ime-mode:disabled"  style="ime-mode:disabled">
                    </div>
                    <div id="gameMenuBox" class="gameMenuList close"></div>
                `);
        if(_self.$ele.find('#gameMenuBox').length === 0){
            _self.$ele.html(html).addClass('absolute');
            var titleHtml=`
                    <div id="gameTitleBox">
                        <a href="#" class="gameMenuTitle">所有游戏 </a> /
                        <a href="#" class="gameMenuTitle"> 所有大区 </a> /
                        <a href="#" class="gameMenuTitle"> 所有子区</a>
                    </div>`;
            _self.$ele.parent().append(titleHtml);
            //定位
            _self.$ele.css('width',_self.$ele.parent()[0].offsetWidth).css('top',_self.$ele.parent()[0].offsetHeight);
            _self.$ele.next().css('top',_self.$ele.parent()[0].offsetHeight/2-_self.$ele.next()[0].offsetHeight/2);
            $(window).resize(function () {
                _self.$ele.next().css('top',_self.$ele.parent()[0].offsetHeight/2-_self.$ele.next()[0].offsetHeight/2);
                _self.$ele.css('width',_self.$ele.parent()[0].offsetWidth).css('top',_self.$ele.parent()[0].offsetHeight);
            });
            $(window).scroll(function () {
                _self.$ele.next().css('top',_self.$ele.parent()[0].offsetHeight/2-_self.$ele.next()[0].offsetHeight/2);
                _self.$ele.css('width',_self.$ele.parent()[0].offsetWidth).css('top',_self.$ele.parent()[0].offsetHeight);
            });
            $.each(_self.json,function(index,val){
                list0.push(val);
            });
            _self.$ele.parent().on('click',function(){
                var gameNameFirst=[];
                _self.currentItemAllTitle=[];
                $.each(_self.json,function(index,val){
                    gameNameFirst.push(val.label.trim()[0]);
                    _self.currentItemAllTitle.push(val.label.trim());
                });
                var html='<i  data-i="0" data-value="00000000">所有游戏</i>';
                _self.$ele.find('ul>li').eq(0).addClass('active').siblings().removeClass('active');
                //显示第一部分游戏
                $.each(list0,function(index,val){
                    html+='<i data-i="0" data-index="'+index+'" data-value="'+val.value+'">'+val.label+'</i>'
                });
                _self.$ele.find('.item-name').html(html);
                //显示首字母
                _self.showLetter(gameNameFirst);
                //判断状态
                if($(_self.$ele.parent().find('.gameMenuTitle')[0]).attr('data-index')){
                    _self.$ele.find('.item-name>i').eq(parseInt($(_self.$ele.parent().find('.gameMenuTitle')[0]).attr('data-index'))+1).addClass('active');
                }else{
                    _self.$ele.find('.item-name>i').eq(0).addClass('active');
                }
                //动画显示
                _self.$ele.slideDown()
            });
            _self.$ele.parent().on('click','.gameMenuTitle',function(e){
                e.stopPropagation();
                var gameNameFirst=[];
                _self.currentItemAllTitle=[];
                $.each(_self.json,function(index,val){
                    gameNameFirst.push(val.label.trim()[0]);
                    _self.currentItemAllTitle.push(val.label.trim());
                });
                var html='<i data-i="0">所有游戏</i>';
                _self.$ele.find('ul>li').eq(0).addClass('active').siblings().removeClass('active');
                //显示第一部分游戏
                $.each(list0,function(index,val){
                    html+='<i data-i="0" data-index="'+index+'" data-value="'+val.value+'">'+val.label+'</i>'
                });
                _self.$ele.find('.item-name').html(html);
                //显示首字母
                _self.showLetter(gameNameFirst);
                //判断状态
                if($(_self.$ele.parent().find('.gameMenuTitle')[0]).attr('data-index')){
                    _self.$ele.find('.item-name>i').eq(parseInt($(_self.$ele.parent().find('.gameMenuTitle')[0]).attr('data-index'))+1).addClass('active');
                }else{
                    _self.$ele.find('.item-name>i').eq(0).addClass('active');
                }
                //动画显示
                _self.$ele.slideDown();

                var i=$(this).index();
                _self.$ele.find('ul>li').eq(i).addClass('active').siblings('li').removeClass('active');
                var gameNameFirst=[];
                _self.currentItemAllTitle=[];
                if(i==0){
                    var html='<i class="active" data-i="0">所有游戏</i>';
                    $.each(list0,function(index,val){
                        gameNameFirst.push(val.label.trim()[0]);
                        _self.currentItemAllTitle.push(val.label.trim());
                        html+='<i data-i="'+i+'" data-index="'+index+'" data-value="'+val.value+'">'+val.label+'</i>'
                    });
                    _self.$ele.find('.item-name').html(html);
                }else if(i==1){
                    var html='<i class="active" data-i="1">所有大区</i>';
                    $.each(_self.list1,function(index,val){
                        gameNameFirst.push(val.label.trim()[0]);
                        _self.currentItemAllTitle.push(val.label.trim());
                        html+='<i data-i="'+i+'" data-index="'+index+'" data-value="'+val.value+'" >'+val.label+'</i>'
                    });
                    console.log(html,_self.$ele.find('.item-name'))
                    _self.$ele.find('.item-name').html(html);
                    console.log(_self.$ele.find('.item-name').html())
                }else if(i==2){
                    var html='<i class="active"  data-i="2">所有子区</i>';
                    $.each(_self.list2,function(index,val){
                        gameNameFirst.push(val.label.trim()[0]);
                        _self.currentItemAllTitle.push(val.label.trim());
                        html+='<i data-i="'+i+'" data-index="'+index+'" data-value="'+val.value+'">'+val.label+'</i>'
                    });
                    _self.$ele.find('.item-name').html(html);
                }
                _self.showLetter(gameNameFirst);
                if($(this).attr('data-index')){
                    _self.$ele.find('.item-name>i').eq(parseInt($(this).attr('data-index'))+1).addClass('active').siblings('i').removeClass('active');
                }
            });
            _self.$ele.on('click','.item-name>i',function(e){
                e.stopPropagation();
                var index=$(this).attr('data-index');
                var i=parseInt($(this).attr('data-i'));
                $(this).addClass('active');
                var gameNameFirst=[];
                _self.currentItemAllTitle=[];
                _self.$ele.parent().find('.gameMenuTitle').eq(i).html($(this).html()).attr('data-value',$(this).attr('data-value')).attr('data-index',$(this).attr('data-index'));
                _self.$ele.find('ul>li').eq(i+1).addClass('active').siblings('li').removeClass('active');
                //点击的是游戏名字
                if(i == 0){
                    var html='<i class="active" data-i="1">所有大区</i>';
                    _self.list1=[];
                    _self.list2=[];
                    _self.$ele.parent().find('.gameMenuTitle').eq(1).attr('data-index','').html('所有大区');
                    _self.$ele.parent().find('.gameMenuTitle').eq(2).attr('data-index','').html('所有子区');
                    if(index){
                        _self.$ele.parent().find('.gameMenuTitle').eq(1).attr('data-value',$(this).attr('data-value'));
                        _self.$ele.parent().find('.gameMenuTitle').eq(2).attr('data-value',$(this).attr('data-value'));
                        $.each(list0[index].children,function(index,val){
                            _self.list1.push(val);
                            gameNameFirst.push(val.label.trim()[0]);
                            _self.currentItemAllTitle.push(val.label.trim());
                            html+='<i data-i="'+(i+1)+'" data-index="'+index+'" data-value="'+val.value+'">'+val.label+'</i>'
                        });
                    }else{
                        _self.$ele.parent().find('.gameMenuTitle').eq(0).attr('data-value',0);
                        _self.$ele.parent().find('.gameMenuTitle').eq(1).attr('data-value',0);
                        _self.$ele.parent().find('.gameMenuTitle').eq(2).attr('data-value',0);
                    }
                    _self.$ele.find('.item-name').html(html);

                }
                //点击的是游戏大区
                else if(i == 1){
                    var html='<i class="active" data-i="2">所有子区</i>';
                    _self.list2=[];
                    _self.$ele.parent().find('.gameMenuTitle').eq(2).attr('data-index','').html('所有子区');
                    if(index){
                        _self.$ele.parent().find('.gameMenuTitle').eq(2).attr('data-value',$(this).attr('data-value'));
                        $.each(_self.list1[index].children,function(index,val){
                            _self.list2.push(val);
                            gameNameFirst.push(val.label.trim()[0]);
                            _self.currentItemAllTitle.push(val.label.trim())
                            html+='<i data-i="'+(i+1)+'" data-index="'+index+'" data-value="'+val.value+'">'+val.label+'</i>'
                        });
                    }else{
                        _self.$ele.parent().find('.gameMenuTitle').eq(2).attr('data-value', _self.$ele.parent().find('.gameMenuTitle').eq(1).attr('data-value'));
                    }
                    _self.$ele.find('.item-name').html(html);
                }
                //点击的是游戏子区
                else if(i==2){
                    $(this).addClass('active').siblings('i').removeClass('active')
                    _self.$ele.slideUp('normal',function () {
                        _self.$ele.find('.item-name').html('');
                    });
                    return;
                }
                _self.showLetter(gameNameFirst)
            });

            _self.$ele.find('ul>li').on('click',function(e){
                e.stopPropagation();
                var i=$(this).index();
                $(this).addClass('active').siblings('li').removeClass('active');
                _self.$ele.parent().find('.gameMenuTitle').eq(i).trigger('click');
            });

            //首字母点击搜索
            _self.$ele.find('.shortening').on('click','i',function(e){
                e.stopPropagation();
                $(this).addClass('active').siblings().removeClass('active');
                //找出符合首字母的条件
                _self.searchLetter($(this).text())
            });

            //首字母input框搜索
            _self.$ele.find('input').on('keyup',function(){
                _self.currentItemAllLetter=[];
                $.each(_self.currentItemAllTitle,function(index,val){
                    _self.currentItemAllLetter.push(toPinyin(val).toUpperCase())
                });
                //显示搜索结果
                $(this).val( $(this).val().replace("'",''));
                _self.searchResult($(this).val().toUpperCase())
            });
            _self.$ele.click(function (e) {
                e.stopPropagation();
            });
            //点击其他地方，窗口消失
            $(document).mouseup(function(e){
                var _con = _self.$ele.parent();   // 设置目标区域
                if(!_con.is(e.target) && _con.has(e.target).length === 0){
                    _self.$ele.slideUp();
                }
            });
        }

    };
    //获取code数值
    getGameSelect.prototype.getValue=function(){
        this.code=this.$ele.parent().find('.gameMenuTitle').eq(2).attr('data-value');
        return this.code || 0
    };
    //显示首字母
    getGameSelect.prototype.showLetter=function(arr){
        var itemFirstLetter=[];
        $.each(arr,function(index,val){
            itemFirstLetter.push(toPinyin(val)[0])
        });
        var firstStr=this.arrRemoveRepeat(itemFirstLetter).sort();
        var letterHtml='';
        $.each(firstStr,function(index,val){
            letterHtml+='<i>'+val+'</i>';
        });
        this.$ele.find('.shortening').html(letterHtml);
    };
    //搜索符合首字母的条件
    getGameSelect.prototype.searchLetter=function(letter){
        var _self=this;
        var length=this.currentItemFirstLetter.length;
        _self.$ele.find('.item-name>i').removeClass('curr').removeClass('active');
        for(var i=0;i<length;i++){
            if(this.currentItemFirstLetter[i] == letter){
                _self.$ele.find('.item-name>i').eq(i+1).addClass('curr');
            }
        }
    };
    //显示搜索结果
    getGameSelect.prototype.searchResult=function(str){
        var _self=this;
        var text=_self.checkInput(str);
        _self.$ele.find('.item-name>i').removeClass('active').removeClass('curr');
        if(text == '') return;
        var currentItemAllFirstLetter=[];
        $.each(_self.currentItemAllLetter,function (index, val) {
            if(val.indexOf(text) !== -1){
                _self.$ele.find('.item-name>i').eq(index+1).addClass('curr');
            }
        });
        $.each(_self.currentItemAllTitle,function (index, val) {
            currentItemAllFirstLetter.push(toPinyin(val).replace(/[a-z]/g,''))
        });
        $.each(currentItemAllFirstLetter,function(index,val){
            if(val.indexOf(text) !== -1){
                _self.$ele.find('.item-name>i').eq(index+1).addClass('curr');
            }
        })
    };
    //数组去重
    getGameSelect.prototype.arrRemoveRepeat=function(arr){
        var res=[];
        var json={};
        var length=arr.length;
        for(var i=0;i<length;i++){
            if(!json[arr[i]]){
                res.push(arr[i]);
                json[arr[i]] = 1;
            }
        }
        this.currentItemFirstLetter=arr;
        return res;
    };
    getGameSelect.prototype.checkInput=function(str){
        var temp=""
        for(var i=0;i<str.length;i++)
            if(str.charCodeAt(i)>0&&str.charCodeAt(i)<255)
                temp+=str.charAt(i);
        return temp
    };
    //根据code设置值
    getGameSelect.prototype.setLabel=function (code) {
        var _self=this;
        $.each(_self.json,function (index, val) {
            var value=val.value.toString();
            if(value.slice(0,value.length-7) == code.slice(0,code.length-5)){
                $('#gameTitleBox>.gameMenuTitle').eq(0).text(val.label).attr({'data-Index':index,'data-value':value});
                $.each(val.children,function (index1, val1) {
                    _self.list1.push(val1);
                    var value1=val1.value.toString();
                    if(value1.slice(0,value1.length-2) == code.slice(0,code.length-2)){
                        $('#gameTitleBox>.gameMenuTitle').eq(1).text(val1.label).attr({'data-Index':index1,'data-value':value1});
                        $.each(val1.children,function (index2, val2) {
                            _self.list2.push(val2);
                            var value2=val2.value.toString();
                            if(value2 == code){
                                $('#gameTitleBox>.gameMenuTitle').eq(2).text(val2.label).attr({'data-Index':index2,'data-value':value2});
                            }
                        })
                    }
                })
            }
        })
    };
    $.fn.getGameSelect=function(json){
        return new getGameSelect(this,json)
    }
})(jQuery);

/**
 * 获取图片验证码弹框
 *
 * -- example --
 *  var options = {
        confirm: function (val) {//val 为弹框中input输入的值

        }
    };
 $(selector).getPicCodePop(options)
 */
(function($){
    function getPicCodePop(ele,options){
        this.$ele=ele;
        this.options=options;
        this.widthHeight={
            width:ele[0].offsetWidth,
            height:ele[0].offsetHeight
        };//本身宽高
        this.blockWidthHeight={
            width:16,
            height:16
        };//弹框距离本身的位移
        this.init();
    }
    getPicCodePop.prototype.init=function(){
        var _self=this;
        var html=$(`
              <div class="event-popup absolute opacity0" id="picCodePop">
                <em class="down"></em><span class="up"></span>
                <p><a href="#" class="change-yzm" style="float:right;line-height:22px;">看不清？换一张。</a>输入验证码 </p>
                <img src="${spliceUrl('valid/image/' + new Date().getTime())}" style="cursor:pointer;" alt="图片加载错误，请重试">
                <input type="text" maxlength="4">
                <div class="button-group">
                    <button  class="button-event-small-white">取消</button>
                    <button  class="button-event-small-blue">确认</button>
                </div>
            </div>
        `);
        if($('body').find('#picCodePop').length === 0){
            $('body').append(html);
            var _selfPosition=getPosition(_self.$ele[0]);
            var _con=$('body').find('#picCodePop');
            _con[0].alpha=_con.css('opacity')*100;
            theFading(_con[0],100);
            //显示弹框
            _self.locationPop(_con,_selfPosition);
            $(window).resize(function(){
                _self.locationPop(_con,getPosition(_self.$ele[0]));
            });
            $(window).scroll(function(){
                _self.locationPop(_con,getPosition(_self.$ele[0]));
            });
            _con.find('input').unbind('blur');
            _con.find('input').on('keyup',function(){
                $(this).val($(this).val().replace(/[^0-9]+/,''))
            });
            _con.find('input').on('keydown',function(){
                $(this).val($(this).val().replace(/[^0-9]+/,''))
            });
            //取消回调
            _con.find('.button-event-small-white').click(function () {
                _self.hidePop();
            });
            //确定回调
            _con.find('.button-event-small-blue').click(function(){
                var val=_con.find('input').val();
                _self.hidePop();
                _self.options.confirm(val);
            });
            // 点击其他地方，窗口消失
            $(document).mouseup(function(e){
                if(!_con.is(e.target) && _con.has(e.target).length === 0 && !_self.$ele.is(e.target) && _self.$ele.has(e.target).length === 0){
                    _self.hidePop();
                }
            });
            //点击切换验证码
            _con.find('img').click(function () {
                $(this).attr('src',spliceUrl('valid/image/' + new Date().getTime()))
            })
            _con.find('.change-yzm').click(function (e) {
                e.preventDefault();
                _con.find('img').attr('src',spliceUrl('valid/image/' + new Date().getTime()))
            })
        }else{
            $('body').find('#picCodePop').find('input').val('');
            $('body').find('#picCodePop').find('img').attr('src',spliceUrl('valid/image/' + new Date().getTime()));
            theFading($('body').find('#picCodePop')[0],100)
        }
    };
    getPicCodePop.prototype.locationPop=function(_con,pos){
        var top=pos.top+this.widthHeight.height+this.blockWidthHeight.height,left=pos.left-_con[0].offsetWidth/2+this.widthHeight.width/2;
        var scrollDistance={
            x:$(window).scrollLeft(),
            y:$(window).scrollTop()
        };
        var windowSize={
            x:$(window).width(),
            y:$(window).height()
        }
        var rightPosition={
            top:top-this.widthHeight.height/2-this.blockWidthHeight.height-_con[0].offsetHeight/2,
            left:left+this.blockWidthHeight.width+this.widthHeight.width/2+_con[0].offsetWidth/2
        },leftPostion={
            top:top-this.widthHeight.height/2-this.blockWidthHeight.height-_con[0].offsetHeight/2,
            left:left-this.blockWidthHeight.width-this.widthHeight.width/2-_con[0].offsetWidth/2
        },topPositon={
            top:top-2*this.blockWidthHeight.height-this.widthHeight.height-_con[0].offsetHeight,
            left:left
        };
        _con.css({top:top,left:left}).attr('data-garnish','event-popup-top');
        _con.find('.down').css({top:-16,left:_con[0].offsetWidth/2-8});
        _con.find('.up').css({top:-15,left:_con[0].offsetWidth/2-8});
        //判断距离下边缘位置
        if(windowSize.y-top-_con[0].offsetHeight+scrollDistance.y < 0){
            _con.css({top:topPositon.top}).attr('data-garnish','event-popup-bottom');
            _con.find('.down').css({top:_con[0].offsetHeight+1});
            _con.find('.up').css({top:_con[0].offsetHeight});
        }else{
            //判断距离左边缘
            if(left-scrollDistance.x < 0){
                _con.css({top:rightPosition.top,left:rightPosition.left}).attr('data-garnish','event-popup-left');
                _con.find('.down').css({top:_con[0].offsetHeight/2-8,left:-17});
                _con.find('.up').css({top:_con[0].offsetHeight/2-8,left:-16});
            }else{
                //判断距离右边缘
                if(windowSize.x-left+scrollDistance.x-this.widthHeight.width/2-3*_con[0].offsetWidth/2-this.blockWidthHeight.width < 0){
                    _con.css({top:leftPostion.top,left:leftPostion.left}).attr('data-garnish','event-popup-right');
                    _con.find('.down').css({top:_con[0].offsetHeight/2-8,left:_con[0].offsetWidth+1});
                    _con.find('.up').css({top:_con[0].offsetHeight/2-8,left:_con[0].offsetWidth});
                }
            }
        }
    };
    getPicCodePop.prototype.hidePop=function(){
        theFading($('body').find('#picCodePop')[0],0,function(){
            $('body').find('#picCodePop').remove();
            $(document).unbind('mouseup');
        });
    };
    $.fn.getPicCodePop=function(options){
        return new getPicCodePop(this,options)
    }
})(jQuery);

/**
 * 消息顶部提示
 *
 * -- example --
 * messageTip({
 *      message:'提示内容',
 *      state:1,//1、cssDemo、3三种状态:1成功,2失败,3警告
 *      time:提示消失所用时间，默认3000毫秒,
 *      callback:function(){}//提示消失后的回调函数，可不填
 * })
 */
(function($){
    function messageTipBox(ele,options){
        this.$ele=ele;
        this.options=options;
        this.init();
    }
    messageTipBox.prototype.init=function () {
        var _self=this;
        var html=$(`
                <div class="message fixed" id="messageTipBox" style="margin-top:-70px;top:10px;left:50%;">
                    <i class="iconfont"></i>
                    <span class="message-content"></span>
                </div>
            `);
        if($('body').find('#messageTipBox') != 0)$('body').find('#messageTipBox').remove();
        $('body').append(html);
        if(typeof (_self.options) == 'string'){
            $('body').find('#messageTipBox>.message-content').text(_self.options);
            $('body').find('#messageTipBox>.iconfont').addClass('icon-correct');
        }else if(typeof (_self.options) == 'object'){
            $('body').find('#messageTipBox>.message-content').text(_self.options.message);
            if(_self.options.state == 1) $('body').find('#messageTipBox>.iconfont').addClass('icon-correct');
            else if(_self.options.state == 2) $('body').find('#messageTipBox>.iconfont').addClass('icon-wrong');
            else if(_self.options.state == 3) $('body').find('#messageTipBox>.iconfont').addClass('icon-warning');
        }
        var _con=$('body').find('#messageTipBox');
        _con.css('margin-left',-_con[0].offsetWidth/2);
        _con[0].marginTop=-70;
        theSliding(_con[0],0);
        setTimeout(function(){
            theSliding(_con[0],-70,function () {
                _con.remove();
                if(_self.options.callback) _self.options.callback();
            });
        },_self.options.time || 3000)
    };

    messageTip=function(options){
        return new messageTipBox(this,options)
    }
})(jQuery);

/**
 * 二次确认弹框
 *
 * -- example --
 *  var options={
        content:'这是一段内容这是一段内容确定删除吗',//纯文本
        btn:[{type:2,label:'取消'},{type:1,label:'确认'},{type:1,label:'提交'}],
        btnEvent:[function(){
            console.log('btn1回调')
        }, function(){
            console.log('btn2回调')
        }, function(){
            console.log('btn3回调')
        }]
    };
 //不填btn和btnEvent参数，默认2个按钮（取消、确认）需要参数：yes:function(){}确认回调，可不填参数：cancel:function(){}取消回调
 $('#btn').click(function(){
        $(this).minConfirmBox(options);
    })
 */
(function($){
    function minConfirmBox(ele,options){
        this.$ele=ele;
        this.options=options;
        this.widthHeight={
            width:ele[0].offsetWidth,
            height:ele[0].offsetHeight
        };
        this.blockWidthHeight={
            width:16,
            height:16
        };
        this.init();
    }
    minConfirmBox.prototype.init=function(){
        var _self=this;
        var _index=_self.$ele.attr('id')+_self.$ele.parents('tr').index();
        var html=$(`
              <div class="event-popup absolute opacity0 minPop" data-garnish="event-popup-top" data-id="${_index}">
            <em class="down"></em><span class="up"></span>
            <p>${_self.options.content}</p>
            <div class="button-group"></div>
        </div>
        `);
        if($('body').find('[data-id="'+_index+'"]').length === 0){
            $('body').append(html);
            var _con=$('body').find('[data-id="'+_index+'"]');
            if(_self.options.width){
                _con.css({width:_self.options.width})
            }//显示宽度
            //动画显示
            _con[0].alpha=_con.css('opacity')*100;
            theFading(_con[0],100);
            //按钮接入
            var btnHtml='';
            if(_self.options.btn){
                $.each(_self.options.btn,function (index, val) {
                    if(val.type === 2){
                        btnHtml+=` <button class="button-event-small-white" data-btn="${index}">取消</button>`
                    }else if(val.type === 1){
                        btnHtml+=` <button class="button-event-small-blue" data-btn="${index}">确认</button>`
                    }
                });
                _con.find('.button-group').html(btnHtml);
                //各个按钮绑定事件
                _con.find('.button-group>button').on('click',function(){
                    if(_con.attr('opacity') == 1){
                        _self.hidePop(_index);
                        _self.options.btnEvent[$(this).attr('data-btn')]();
                    }
                });
            }else{
                btnHtml+=`<button class="button-event-small-white">取消</button> <button class="button-event-small-blue">确认</button>`;
                _con.find('.button-group').html(btnHtml);
                _con.find('.button-event-small-white').click(function(){
                    _self.hidePop(_index);
                    if(_self.options.cancel) _self.options.cancel();
                });
                _con.find('.button-event-small-blue').click(function(){
                    _self.hidePop(_index);
                    if(_self.options.yes){
                        $(this).css('pointer-events','none');
                        _self.options.yes()
                    }
                })
            }
            //显示弹框
            _self.locationPop(_con,getPosition(_self.$ele[0]));
            $(window).resize(function(){
                _self.locationPop(_con,getPosition(_self.$ele[0]));
            });
            $(window).scroll(function(){
                _self.locationPop(_con,getPosition(_self.$ele[0]));
            });
            // 点击其他地方，窗口消失
            $(document).mouseup(function(e){
                var _conn=$('body').find('.minPop');
                if(!_conn.is(e.target) && _conn.has(e.target).length === 0 && !_self.$ele.is(e.target) && _self.$ele.has(e.target).length === 0){
                    $.each($('body').find('.minPop'),function (index, val) {
                        _self.hidePop($(val).attr('data-id'))
                    });
                }
            });
        }else{
            theFading($('body').find('[data-id="'+_index+'"]')[0],100)
        }
    };
    minConfirmBox.prototype.locationPop=function(_con,pos){
        var top=pos.top+this.widthHeight.height+this.blockWidthHeight.height,left=pos.left-_con[0].offsetWidth/2+this.widthHeight.width/2;
        var scrollDistance={
            x:$(window).scrollLeft(),
            y:$(window).scrollTop()
        };
        var windowSize={
            x:$(window).width(),
            y:$(window).height()
        }
        var rightPosition={
            top:top-this.widthHeight.height/2-this.blockWidthHeight.height-_con[0].offsetHeight/2,
            left:left+this.blockWidthHeight.width+this.widthHeight.width/2+_con[0].offsetWidth/2
        },leftPostion={
            top:top-this.widthHeight.height/2-this.blockWidthHeight.height-_con[0].offsetHeight/2,
            left:left-this.blockWidthHeight.width-this.widthHeight.width/2-_con[0].offsetWidth/2
        },topPositon={
            top:top-2*this.blockWidthHeight.height-this.widthHeight.height-_con[0].offsetHeight,
            left:left
        };
        _con.css({top:top,left:left}).attr('data-garnish','event-popup-top');
        _con.find('.down').css({top:-16,left:_con[0].offsetWidth/2-8});
        _con.find('.up').css({top:-15,left:_con[0].offsetWidth/2-8});
        //判断距离下边缘位置
        if(windowSize.y-top-_con[0].offsetHeight+scrollDistance.y < 0){
            _con.css({top:topPositon.top}).attr('data-garnish','event-popup-bottom');
            _con.find('.down').css({top:_con[0].offsetHeight+1});
            _con.find('.up').css({top:_con[0].offsetHeight});
        }else{
            //判断距离左边缘
            if(left-scrollDistance.x < 0){
                _con.css({top:rightPosition.top,left:rightPosition.left}).attr('data-garnish','event-popup-left');
                _con.find('.down').css({top:_con[0].offsetHeight/2-8,left:-17});
                _con.find('.up').css({top:_con[0].offsetHeight/2-8,left:-16});
            }else{
                //判断距离右边缘
                if(windowSize.x-left+scrollDistance.x-_con[0].offsetWidth < 0){
                    _con.css({top:leftPostion.top,left:leftPostion.left}).attr('data-garnish','event-popup-right');
                    _con.find('.down').css({top:_con[0].offsetHeight/2-8,left:_con[0].offsetWidth+1});
                    _con.find('.up').css({top:_con[0].offsetHeight/2-8,left:_con[0].offsetWidth});
                }
            }
        }
    };
    minConfirmBox.prototype.hidePop=function(id){
        //动画消失
        theFading($('body').find('[data-id="'+id+'"]')[0],0,function(){
            $('body').find('[data-id="'+id+'"]').remove();
        });
    };
    $.fn.minConfirmBox=function(options){
        return new minConfirmBox(this,options)
    }
})(jQuery);

/**
 * 弹框提示
 *
 * -- example --
 *  var options={
        content:'这是一段内容这是这是一段内容这是这是一段内容这是'
    };
 $('#btn').mouseover(function(){
        $(this).toolTip(options);
    })
 */
(function($){
    function toolTip(ele,options){
        this.$ele=ele;
        this.options=options;
        this.widthHeight={
            width:this.$ele.width(),
            height:this.$ele.height()
        };
        this.blockWidthHeight={
            width:16,
            height:16
        };
        this.init();
    }
    toolTip.prototype.init=function(){
        var _self=this;
        var _id='toolTip';
        var html=$(`
              <div class="event-popup absolute opacity0" data-garnish="event-popup-top" data-id="toolTip">
                <em class="down"></em><span class="up"></span>
                <div style="color:#525252">${_self.options.content}</div>
            </div>
        `);
        if(_self.$ele.find('[data-id='+_id+']').length === 0){
            _self.$ele.append(html);
            _self.$ele.find('[data-id='+_id+']').css({width:_self.options.width || 200});
            var _con=$('body').find('[data-id='+_id+']');
            //动画显示
            _con[0].alpha=_con.css('opacity')*100;
            theFading(_con[0],100);
            //显示弹框
            _self.locationPop(_con);

            _self.$ele.mouseout(function(){
                _self.hidePop(_id);
            });
        }else{
            theFading(_self.$ele.find('[data-id='+_id+']')[0],100)
        }
    };

    toolTip.prototype.locationPop=function(ele){
        var top=this.widthHeight.height+this.blockWidthHeight.height,left=-ele.width()/2+this.widthHeight.width/2;
        ele.css({top:top,left:left}).attr('data-garnish','event-popup-top');
        ele.find('.down').css({top:-16,left:ele.width()/2-8});
        ele.find('.up').css({top:-15,left:ele.width()/2-8});
    };
    toolTip.prototype.hidePop=function(id){
        //动画消失
        var _this=this;
        theFading(_this.$ele.find('[data-id='+id+']')[0],0,function(){
            _this.$ele.find('[data-id='+id+']').remove();
        });
    };
    $.fn.toolTip=function(options){
        return new toolTip(this,options)
    }
})(jQuery);

/**
 * 弹框报错提示
 *
 * -- example --
 *  var options={
        content:'请输入手机号',//提示内容
        errText:['输入的手机号长度不够','输入的手机号过长','输入的手机号格式有误'],//需要报错的text内容
        width:200 // 设置宽度默认170
    };
 $test=$('#btn').verificationTip(options);
 $test.setVerification({errType:[1,0,2],isShow:1,notAutoHide:1});
 // errType:对应报错的内容的状态：1表示成功，0表示失败，2表示对的状态并隐藏；
 isShow:是否显示：1表示显示，0表示不显示；
 notAutoHide:当没有发现报错的状态时是否消失：1表示不自动消失0表示自动消失
 */
(function($){
    function verificationTip(ele,options){
        this.$ele=ele;
        this.options=options;
        this.blockWidthHeight={
            width:20,
            height:20
        };
        this.widthHeight={
            width:this.$ele.width(),
            height:this.$ele.height()
        };
        this.init();
    }
    verificationTip.prototype.init=function(){
        var _self=this,_select=`[data-id="${_self.$ele.attr('id')}"]`;
        var html=$(`
              <div class="event-popup absolute opacity0" data-garnish="event-popup-top" data-id="${_self.$ele.attr('id')}">
                <em class="down"></em><span class="up"></span>
                <p>${_self.options.content}</p>
            </div>
        `);
        if(_self.$ele.find(_select).length === 0){
            _self.$ele.append(html);
            var _con=_self.$ele.find(_select);

            _con.css({width:_self.options.width || 200})

            //动画显示
            _con[0].alpha=_con.css('opacity')*100;
            _self.$ele.mouseover(function () {
                _con.removeClass('hide');
                theFading(_con[0],100);
            });
            //接入错误信息
            _self.setErrorHtml(_con);
            //显示弹框
            _self.locationPop(_con);
            _self.$ele.mouseout(function(){
                _self.hidePop(_con);
            });
            _con.addClass('hide')
        }else{
            theFading(_self.$ele.find(_select)[0],100);
        }
    };
    verificationTip.prototype.getPosition=function(ele){
        /*获取元素的纵坐标*/
        function getTop(e){
            var offset=e.offsetTop;
            if(e.offsetParent!=null){
                offset+=getTop(e.offsetParent);
            }
            return offset;
        }
        /*获取元素的横坐标*/
        function getLeft(e){
            var offset=e.offsetLeft;
            if(e.offsetParent!=null){
                offset+=getLeft(e.offsetParent);
            }
            return offset;
        }
        return {
            top:getTop(ele),
            left:getLeft(ele)
        }
    };
    verificationTip.prototype.locationPop=function(ele){
        var top=this.widthHeight.height+this.blockWidthHeight.height,left=-ele.width()/2+this.widthHeight.width/2;
        ele.css({top:top,left:left}).attr('data-garnish','event-popup-top');
        ele.find('.down').css({top:-16,left:ele.width()/2-8});
        ele.find('.up').css({top:-15,left:ele.width()/2-8});
    };
    verificationTip.prototype.hidePop=function(ele){
        //动画消失
        theFading(ele[0],0,function(){
            ele.addClass('hide');
        });
    };
    verificationTip.prototype.setErrorHtml=function(ele){
        var errHtml='';
        $.each(this.options.errText,function(index,val){
            errHtml+=`<p class="hide"><i class="imgfont img-mistake"></i>${val}</p>`
        });
        ele.prepend(errHtml);
    };
    verificationTip.prototype.setVerification=function(option){
        var _con=$('body').find(`[data-id="${this.$ele.attr('id')}"]`);
        var icons=_con.find('i');
        icons.parent().removeClass('hide');
        $.each(option.errType,function(index,val){
            if(val == 1) $(icons[index]).removeClass('img-mistake').addClass('img-bingo');
            else if(val == 0) $(icons[index]).addClass('img-mistake').removeClass('img-bingo');
            if(val == 2) $(icons[index]).removeClass('img-mistake').addClass('img-bingo').parent().addClass('hide');
        });
        if(_con.find('i.img-mistake').length === 0 && ! option.notAutoHide) {
            theFading(_con[0],0,function(){
                _con.addClass('hide');
                icons.parent().addClass('hide');
            });
        }
        if(!option.notAutoHide){
            if(_con.find('i.img-mistake').length !== 0 && option.isShow){
                _con.removeClass('hide');
                theFading(_con[0],100);
            }else{
                theFading(_con[0],0,function(){
                    _con.addClass('hide');
                });
            }
        }
    };
    $.fn.verificationTip=function(options){
        if(this.length === 0) return;
        return new verificationTip(this,options)
    }
})(jQuery);

/**
 * pagination分页插件
 * @version 1.5.0
 * @author mss
 * @url https://github.com/Maxiaoxiang
 *
 * @调用方法
 * $(selector).pagination(option, callback);
 * -此处callback是初始化调用，option里的callback才是点击页码后调用
 *
 * -- example --
 * $(selector).pagination({
 *     ...
 *     callback: function(api){
 *         console.log('点击页码调用该回调'); //把请求接口函数放在这儿，每次点击请求一次
 *     }
 * }, function(){
 *     console.log('初始化'); //插件初始化时调用该回调，比如请求第一次接口来初始化分页配置
 * });
 */
(function (factory) {
    if (typeof define === "function" && (define.amd || define.cmd) && !jQuery) {
        // AMD或CMD
        define(["jquery"], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function (root, jQuery) {
            if (jQuery === undefined) {
                if (typeof window !== 'undefined') {
                    jQuery = require('jquery');
                } else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        //Browser globals
        factory(jQuery);
    }
}(function ($) {
    //配置参数
    var defaults = {
        totalData: 0, //数据总条数
        showData: 0, //每页显示的条数
        pageCount: 9, //总页数,默认为9
        current: 1, //当前第几页
        prevCls: 'prev', //上一页class
        nextCls: 'next', //下一页class
        prevContent: '<', //上一页内容
        nextContent: '>', //下一页内容
        activeCls: 'active', //当前页选中状态
        coping: false, //首页和尾页
        isHide: false, //当前页数为0页或者1页时不显示分页
        homePage: '', //首页节点内容
        endPage: '', //尾页节点内容
        keepShowPN: false, //是否一直显示上一页下一页
        count: 3, //当前页前后分页个数
        jump: false, //跳转到指定页数
        jumpIptCls: 'jump-ipt', //文本框内容
        jumpBtnCls: 'jump-btn', //跳转按钮
        jumpBtn: '跳转', //跳转按钮文本
        callback: function () {} //回调
    };
    var Pagination = function (element, options) {
        //全局变量
        var opts = options, //配置
            current, //当前页
            $document = $(document),
            $obj = $(element); //容器

        /**
         * 设置总页数
         * @param {int} page 页码
         * @return opts.pageCount 总页数配置
         */
        this.setPageCount = function (page) {
            return opts.pageCount = page;
        };

        /**
         * 获取总页数
         * 如果配置了总条数和每页显示条数，将会自动计算总页数并略过总页数配置，反之
         * @return {int} 总页数
         */
        this.getPageCount = function () {
            return opts.totalData && opts.showData ? Math.ceil(parseInt(opts.totalData) / opts.showData) : opts.pageCount;
        };

        /**
         * 获取当前页
         * @return {int} 当前页码
         */
        this.getCurrent = function () {
            return current;
        };

        /**
         * 填充数据
         * @param {int} 页码
         */
        this.filling = function (index) {
            var html = '';
            current = parseInt(index) || parseInt(opts.current); //当前页码
            var pageCount = this.getPageCount(); //获取的总页数
            if (opts.keepShowPN || current > 1) { //上一页
                html += '<a href="javascript:;" class="' + opts.prevCls + '">' + opts.prevContent + '</a>';
            } else {
                if (opts.keepShowPN == false) {
                    $obj.find('.' + opts.prevCls) && $obj.find('.' + opts.prevCls).remove();
                }
            }
            if (current >= opts.count + 2 && current != 1 && pageCount != opts.count) {
                var home = opts.coping && opts.homePage ? opts.homePage : '1';
                html += opts.coping ? '<a href="javascript:;" data-page="1">' + home + '</a><span>...</span>' : '';
            }
            var start = (current - opts.count) <= 1 ? 1 : (current - opts.count);
            var end = (current + opts.count) >= pageCount ? pageCount : (current + opts.count);
            for (; start <= end; start++) {
                if (start <= pageCount && start >= 1) {
                    if (start != current) {
                        html += '<a href="javascript:;" data-page="' + start + '">' + start + '</a>';
                    } else {
                        html += '<span class="' + opts.activeCls + '">' + start + '</span>';
                    }
                }
            }
            if (current + opts.count < pageCount && current >= 1 && pageCount > opts.count) {
                var end = opts.coping && opts.endPage ? opts.endPage : pageCount;
                html += opts.coping ? '<span>...</span><a href="javascript:;" data-page="' + pageCount + '">' + end + '</a>' : '';
            }
            if (opts.keepShowPN || current < pageCount) { //下一页
                html += '<a href="javascript:;" class="' + opts.nextCls + '">' + opts.nextContent + '</a>'
            } else {
                if (opts.keepShowPN == false) {
                    $obj.find('.' + opts.nextCls) && $obj.find('.' + opts.nextCls).remove();
                }
            }
            html += opts.jump ? '<input type="text" class="' + opts.jumpIptCls + '"><a href="javascript:;" class="' + opts.jumpBtnCls + '">' + opts.jumpBtn + '</a>' : '';
            $obj.empty().html(html);
        };

        //绑定事件
        this.eventBind = function () {
            var that = this;
            var pageCount = that.getPageCount(); //总页数
            var index = 1;
            $obj.off().on('click', 'a', function () {
                if ($(this).hasClass(opts.nextCls)) {
                    if ($obj.find('.' + opts.activeCls).text() >= pageCount) {
                        $(this).addClass('disabled');
                        return false;
                    } else {
                        index = parseInt($obj.find('.' + opts.activeCls).text()) + 1;
                    }
                } else if ($(this).hasClass(opts.prevCls)) {
                    if ($obj.find('.' + opts.activeCls).text() <= 1) {
                        $(this).addClass('disabled');
                        return false;
                    } else {
                        index = parseInt($obj.find('.' + opts.activeCls).text()) - 1;
                    }
                } else if ($(this).hasClass(opts.jumpBtnCls)) {
                    if ($obj.find('.' + opts.jumpIptCls).val() !== '') {
                        index = parseInt($obj.find('.' + opts.jumpIptCls).val());
                    } else {
                        return;
                    }
                } else {
                    index = parseInt($(this).data('page'));
                }
                that.filling(index);
                typeof opts.callback === 'function' && opts.callback(that);
            });
            //输入跳转的页码
            $obj.on('input propertychange', '.' + opts.jumpIptCls, function () {
                var $this = $(this);
                var val = $this.val();
                var reg = /[^\d]/g;
                if (reg.test(val)) $this.val(val.replace(reg, ''));
                (parseInt(val) > pageCount) && $this.val(pageCount);
                if (parseInt(val) === 0) $this.val(1); //最小值为1
            });
            //回车跳转指定页码
            $document.keydown(function (e) {
                if (e.keyCode == 13 && $obj.find('.' + opts.jumpIptCls).val()) {
                    var index = parseInt($obj.find('.' + opts.jumpIptCls).val());
                    that.filling(index);
                    typeof opts.callback === 'function' && opts.callback(that);
                }
            });
        };

        //初始化
        this.init = function () {
            this.filling(opts.current);
            this.eventBind();
            if (opts.isHide && this.getPageCount() == '1' || this.getPageCount() == '0') $obj.hide();
        };
        this.init();
    };
    $.fn.pagination = function (parameter, callback) {
        if (typeof parameter == 'function') { //重载
            callback = parameter;
            parameter = {};
        } else {
            parameter = parameter || {};
            callback = callback || function () {};
        }
        var options = $.extend({}, defaults, parameter);
        return this.each(function () {
            var pagination = new Pagination(this, options);
            callback(pagination);
        });
    };
}));

