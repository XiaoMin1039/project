/**
 * Created by ching on 2017/10/18.
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
            var _selfPosition=_self.getPosition(_self.$ele[0]);
            var _con=$('body').find('#picCodePop');
            _con[0].alpha=_con.css('opacity')*100;
            theFading(_con[0],100);
            //显示弹框
            _self.locationPop(_con,_selfPosition);
            $(window).resize(function(){
                _self.locationPop(_con,_self.getPosition(_self.$ele[0]));
            });
            $(window).scroll(function(){
                _self.locationPop(_con,_self.getPosition(_self.$ele[0]));
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
    getPicCodePop.prototype.getPosition=function(ele){
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