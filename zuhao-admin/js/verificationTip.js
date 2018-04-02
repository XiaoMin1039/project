/**
 * Created by ching on 2017/10/21.
 */
(function($){
    function verificationTip(ele,options){
        this.$ele=ele;
        this.options=options;
        this.widthHeight={
            width:ele[0].offsetWidth,
            height:ele[0].offsetHeight
        };
        this.blockWidthHeight={
            width:20,
            height:20
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
            var _conWidthHeight={
                width:_con[0].offsetWidth,
                height:_con[0].offsetHeight
            };
            _self.locationPop(_con,_conWidthHeight);
            $(window).resize(function(){
                _self.locationPop(_con,_conWidthHeight);
            });
            $(window).scroll(function(){
                _self.locationPop(_con,_conWidthHeight);
            });
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
    verificationTip.prototype.locationPop=function(ele,_con){
        var top=this.widthHeight.height+this.blockWidthHeight.height,left=-_con.width/2+this.widthHeight.width/2;
        var scrollDistance={
            x:$(window).scrollLeft(),
            y:$(window).scrollTop()
        };
        var windowSize={
            x:$(window).width(),
            y:$(window).height()
        }
        var rightPosition={
            top:top-this.widthHeight.height/2-this.blockWidthHeight.height-_con.height/2,
            left:left+this.blockWidthHeight.width+this.widthHeight.width/2+_con.width/2
        },leftPostion={
            top:top-this.widthHeight.height/2-this.blockWidthHeight.height-_con.height/2,
            left:left-this.blockWidthHeight.width-this.widthHeight.width/2-_con.width/2
        },topPositon={
            top:top-2*this.blockWidthHeight.height-this.widthHeight.height-_con.height,
            left:left
        };
        ele.css({top:top,left:left}).attr('data-garnish','event-popup-top');
        ele.find('.down').css({top:-16,left:_con.width/2-8});
        ele.find('.up').css({top:-15,left:_con.width/2-8});
        // //判断距离下边缘位置
        // if(windowSize.y-top-_con.height+scrollDistance.y < 0){
        //     ele.css({top:topPositon.top}).attr('data-garnish','event-popup-bottom');
        //     ele.find('.down').css({top:_con.height+1});
        //     ele.find('.up').css({top:_con.height});
        // }else{
        //     //判断距离左边缘
        //     if(left-scrollDistance.x < 0){
        //         ele.css({top:rightPosition.top,left:rightPosition.left}).attr('data-garnish','event-popup-left');
        //         ele.find('.down').css({top:_con.height/2-8,left:-17});
        //         ele.find('.up').css({top:_con.height/2-8,left:-16});
        //     }else{
        //         //判断距离右边缘
        //         if(windowSize.x-left+scrollDistance.x-this.widthHeight.width/2-3*_con.width/2-this.blockWidthHeight.width < 0){
        //             ele.css({top:leftPostion.top,left:leftPostion.left}).attr('data-garnish','event-popup-right');
        //             ele.find('.down').css({top:_con.height/2-8,left:_con.width+1});
        //             ele.find('.up').css({top:_con.height/2-8,left:_con.width});
        //         }
        //     }
        // }
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