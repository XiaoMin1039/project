/**
 * Created by ching on 2017/10/18.
 */
(function($){
    function toolTip(ele,options){
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
    toolTip.prototype.init=function(){
        var _self=this;
        var _id='toolTip';
        var html=$(`
              <div class="event-popup absolute opacity0" data-garnish="event-popup-top" data-id="toolTip">
                <em class="down"></em><span class="up"></span>
                <div style="color:#525252">${_self.options.content}</div>
            </div>
        `);
        console.log(_self.options.content)
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

    toolTip.prototype.locationPop=function(_con){
        var top=this.widthHeight.height+this.blockWidthHeight.height,left=-_con[0].offsetWidth/2+this.widthHeight.width/2;

        _con.css({top:top,left:left}).attr('data-garnish','event-popup-top');
        _con.find('.down').css({top:-16,left:_con[0].offsetWidth/2-8});
        _con.find('.up').css({top:-15,left:_con[0].offsetWidth/2-8});

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