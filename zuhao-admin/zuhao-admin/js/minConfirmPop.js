/**
 * Created by ching on 2017/10/18.
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
                       _self.options.yes()
                   }
                })
            }
            //显示弹框
            _self.locationPop(_con,_self.getPosition(_self.$ele[0]));
            $(window).resize(function(){
                _self.locationPop(_con,_self.getPosition(_self.$ele[0]));
            });
            $(window).scroll(function(){
                _self.locationPop(_con,_self.getPosition(_self.$ele[0]));
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
    minConfirmBox.prototype.getPosition=function(ele){
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