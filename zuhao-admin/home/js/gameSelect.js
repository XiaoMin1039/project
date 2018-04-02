
(function($) {
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
        this.speed='fast';
    }
    //初始化
    getGameSelect.prototype.init=function(){
        var list0=[];
        var _self=this;
        var html=$('<ul><li class="active">游戏名称</li><li>游戏区</li><li>游戏服务器</li></ul>' +
            '<div class="game-select-item"><div class="shortening"></div><div class="item-name"></div><input type="text" placeholder="本页数据拼音首字母快速检索" style="ime-mode:disabled"  style="ime-mode:disabled"></div>' +
            '<div id="gameMenuBox" class="gameMenuList close"></div>');
        if(_self.$ele.find('#gameMenuBox').length === 0){
            _self.$ele.html(html).addClass('absolute');
            //定位
            _self.$ele.css('width','521px');

            $.each(_self.json,function(index,val){
                list0.push(val);
            });
            _self.$ele.parent().on('click','[data-id="gameTitle"]',function(e){
                e.stopPropagation();
                //改变图标方向
                _self.$ele.parent().find("i.img").addClass('img-up').removeClass('img-down');
                $(this).find('i').addClass('img-down').removeClass('img-up');
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
                if($(_self.$ele.parent().find('[data-id="gameMenuTitle"]')[0]).attr('data-index')){
                    _self.$ele.find('.item-name>i').eq(parseInt($(_self.$ele.parent().find('[data-id="gameMenuTitle"]')[0]).attr('data-index'))+1).addClass('active');
                }else{
                    _self.$ele.find('.item-name>i').eq(0).addClass('active');
                }
                //动画显示
                _self.$ele.slideDown(_self.speed);

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
                    var html='<i class="active" data-i="1">所有区</i>';
                    $.each(_self.list1,function(index,val){
                        gameNameFirst.push(val.label.trim()[0]);
                        _self.currentItemAllTitle.push(val.label.trim());
                        html+='<i data-i="'+i+'" data-index="'+index+'" data-value="'+val.value+'" >'+val.label+'</i>'
                    });
                    _self.$ele.find('.item-name').html(html);
                    if(_self.list1.length === 1){
                        _self.$ele.parent().find('[data-id="gameMenuTitle"]').eq(1)
                            .attr('data-index',$(this).find('[data-id="gameMenuTitle"]').attr('data-index')-1);
                        _self.$ele.find('.item-name>i').eq(0).remove();
                    }
                }else if(i==2){
                    var html='<i class="active"  data-i="2">所有服务器</i>';
                    $.each(_self.list2,function(index,val){
                        gameNameFirst.push(val.label.trim()[0]);
                        _self.currentItemAllTitle.push(val.label.trim());
                        html+='<i data-i="'+i+'" data-index="'+index+'" data-value="'+val.value+'">'+val.label+'</i>'
                    });
                    _self.$ele.find('.item-name').html(html);
                    if(_self.list2.length === 1){
                        _self.$ele.find('.item-name>i').eq(0).remove();
                    }
                }
                _self.showLetter(gameNameFirst);
                if($(this).find('[data-id="gameMenuTitle"]').attr('data-index')){
                    _self.$ele.find('.item-name>i').eq(parseInt($(this).find('[data-id="gameMenuTitle"]').attr('data-index'))+1).addClass('active').siblings('i').removeClass('active');
                }
            });
            _self.$ele.on('click','.item-name>i',function(e){
                e.stopPropagation();
                var index=$(this).attr('data-index');
                var i=parseInt($(this).attr('data-i'));
                $(this).addClass('active');
                var gameNameFirst=[];
                _self.currentItemAllTitle=[];
                _self.$ele.parent().find('[data-id="gameMenuTitle"]').eq(i)
                    .html($(this).html())
                    .attr('data-value',$(this).attr('data-value')).attr('data-index',$(this).attr('data-index'))
                    .next().removeClass('img-down').addClass('img-up');
                _self.$ele.find('ul>li').eq(i+1).addClass('active').siblings('li').removeClass('active');
                //点击的是游戏名字
                if(i == 0){
                    var html='<i class="active" data-i="1">所有区</i>';
                    _self.list1=[];
                    _self.list2=[];
                    _self.$ele.parent().find('[data-id="gameMenuTitle"]').eq(1).attr('data-index','').html('所有区').next().addClass('img-down').removeClass('img-up');
                    _self.$ele.parent().find('[data-id="gameMenuTitle"]').eq(2).attr('data-index','').html('所有服务器');
                    if(index){
                        _self.$ele.parent().find('[data-id="gameMenuTitle"]').eq(1).attr('data-value',$(this).attr('data-value'));
                        _self.$ele.parent().find('[data-id="gameMenuTitle"]').eq(2).attr('data-value',$(this).attr('data-value'));
                        $.each(list0[index].children,function(index,val){
                            _self.list1.push(val);
                            gameNameFirst.push(val.label.trim()[0]);
                            _self.currentItemAllTitle.push(val.label.trim());
                            html+='<i data-i="'+(i+1)+'" data-index="'+index+'" data-value="'+val.value+'">'+val.label+'</i>'
                        });
                    }else{
                        _self.$ele.parent().find('[data-id="gameMenuTitle"]').eq(0).attr('data-value',0);
                        _self.$ele.parent().find('[data-id="gameMenuTitle"]').eq(1).attr('data-value',0);
                        _self.$ele.parent().find('[data-id="gameMenuTitle"]').eq(2).attr('data-value',0);
                    }
                    _self.$ele.find('.item-name').html(html);
                    if(_self.list1.length === 1){
                        _self.$ele.parent().find('[data-id="gameMenuTitle"]').eq(1)
                            .attr('data-index',$(this).attr('data-index')-1);
                        _self.$ele.find('.item-name>i').eq(0).remove();
                    }
                }
                //点击的是游戏大区
                else if(i == 1){
                    var html='<i class="active" data-i="2">所有服务器</i>';
                    _self.list2=[];
                    _self.$ele.parent().find('[data-id="gameMenuTitle"]').eq(2).attr('data-index','').html('所有服务器').next().addClass('img-down').removeClass('img-up');
                    if(index){
                        _self.$ele.parent().find('[data-id="gameMenuTitle"]').eq(2).attr('data-value',$(this).attr('data-value'));
                        $.each(_self.list1[index].children,function(index,val){
                            _self.list2.push(val);
                            gameNameFirst.push(val.label.trim()[0]);
                            _self.currentItemAllTitle.push(val.label.trim())
                            html+='<i data-i="'+(i+1)+'" data-index="'+index+'" data-value="'+val.value+'">'+val.label+'</i>'
                        });
                    }else{
                        _self.$ele.parent().find('[data-id="gameMenuTitle"]').eq(2).attr('data-value', _self.$ele.parent().find('[data-id="gameMenuTitle"]').eq(1).attr('data-value'));
                    }
                    _self.$ele.find('.item-name').html(html);
                    if(_self.list2.length === 1){
                        _self.$ele.find('.item-name>i').eq(0).remove();
                        _self.$ele.parent().find('[data-id="gameMenuTitle"]').eq(2)
                            .html(_self.list2[0].label)
                            .attr('data-value',_self.list2[0].value).attr('data-index',-1)
                            .next().removeClass('img-down').addClass('img-up');
                        _self.$ele.slideUp(_self.speed);
                    }
                }
                //点击的是游戏子区
                else if(i==2){
                    $(this).addClass('active').siblings('i').removeClass('active')
                    _self.$ele.slideUp(_self.speed,function () {
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
                _self.$ele.parent().find('[data-id="gameMenuTitle"]').eq(i).trigger('click');
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
            _self.$ele.prev().click(function () {
                _self.$ele.slideUp(_self.speed);
            });
            //点击其他地方，窗口消失
            $(document).mouseup(function(e){
                var _con = _self.$ele.parent();   // 设置目标区域
                if(!_con.is(e.target) && _con.has(e.target).length === 0){
                    _self.$ele.slideUp(_self.speed);

                }
            });
        }

    };
    //获取code数值
    getGameSelect.prototype.getValue=function(){
        this.code=this.$ele.parent().find('[data-id="gameMenuTitle"]').eq(2).attr('data-value');
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
                $('#gameTitleBox>[data-id="gameMenuTitle"]').eq(0).text(val.label).attr({'data-Index':index,'data-value':value});
                $.each(val.children,function (index1, val1) {
                    _self.list1.push(val1);
                    var value1=val1.value.toString();
                    if(value1.slice(0,value1.length-2) == code.slice(0,code.length-2)){
                        $('#gameTitleBox>[data-id="gameMenuTitle"]').eq(1).text(val1.label).attr({'data-Index':index1,'data-value':value1});
                        $.each(val1.children,function (index2, val2) {
                            _self.list2.push(val2);
                            var value2=val2.value.toString();
                            if(value2 == code){
                                $('#gameTitleBox>[data-id="gameMenuTitle"]').eq(2).text(val2.label).attr({'data-Index':index2,'data-value':value2});
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